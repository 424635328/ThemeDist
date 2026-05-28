export const prerender = false;

import { isAdmin, verifyCsrf } from '../../../../lib/auth';
import { getTheme } from '../../../../lib/themes-db';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const NO_CACHE = { 'Cache-Control': 'no-store' };

interface ModerationIssue {
  severity: 'critical' | 'warning' | 'info';
  category: 'epilepsy' | 'performance' | 'security' | 'content' | 'accessibility' | 'quality';
  description: string;
}

interface ModerationResult {
  safe: boolean;
  score: number;       // 0-100, higher = safer
  issues: ModerationIssue[];
  checkedAt: string;
  wcag?: {
    textOnBg: number;         // contrast ratio
    primaryOnBg: number;
    passes: boolean;
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// WCAG Contrast Ratio
// ═══════════════════════════════════════════════════════════════════════════════

function hexToRgb(hex: string): [number, number, number] | null {
  hex = hex.replace('#', '');
  if (hex.length === 3) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  if (hex.length !== 6) return null;
  return [
    parseInt(hex.slice(0, 2), 16),
    parseInt(hex.slice(2, 4), 16),
    parseInt(hex.slice(4, 6), 16),
  ];
}

function relativeLuminance(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;
  const [r, g, b] = rgb.map(c => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(c1: string, c2: string): number {
  const l1 = relativeLuminance(c1);
  const l2 = relativeLuminance(c2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// ═══════════════════════════════════════════════════════════════════════════════
// CSS Parsing Helpers
// ═══════════════════════════════════════════════════════════════════════════════

function extractKeyframes(css: string): string[] {
  const blocks: string[] = [];
  const re = /@keyframes\s+[\w-]+\s*\{/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(css)) !== null) {
    let depth = 1;
    let i = match.index + match[0].length;
    while (i < css.length && depth > 0) {
      if (css[i] === '{') depth++;
      else if (css[i] === '}') depth--;
      i++;
    }
    blocks.push(css.slice(match.index, i));
  }
  return blocks;
}

function parseStops(block: string): { pct: number; body: string }[] {
  const stops: { pct: number; body: string }[] = [];
  const re = /([\d.]+)%\s*\{([^}]*)\}/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(block)) !== null) {
    stops.push({ pct: parseFloat(m[1]), body: m[2] });
  }
  const fromRe = /\bfrom\s*\{([^}]*)\}/g;
  const toRe = /\bto\s*\{([^}]*)\}/g;
  let fm: RegExpExecArray | null;
  while ((fm = fromRe.exec(block)) !== null) stops.push({ pct: 0, body: fm[1] });
  let tm: RegExpExecArray | null;
  while ((tm = toRe.exec(block)) !== null) stops.push({ pct: 100, body: tm[1] });
  stops.sort((a, b) => a.pct - b.pct);
  return stops;
}

function getCycleDurationMs(name: string, fullCss: string): number {
  const lines = fullCss.split(';');
  let duration: number | null = null;
  for (const line of lines) {
    const trimmed = line.trim();
    const shorthandMatch = trimmed.match(/animation\s*:\s*(.+)/i);
    if (shorthandMatch) {
      const parts = shorthandMatch[1].trim().split(/\s+/);
      if (parts.some(p => p === name)) {
        for (const part of parts) {
          const durMatch = part.match(/^([\d.]+)(s|ms)$/);
          if (durMatch) {
            const val = parseFloat(durMatch[1]);
            duration = durMatch[2] === 's' ? val * 1000 : val;
          }
        }
      }
    }
    const durDeclMatch = trimmed.match(/animation-duration\s*:\s*([\d.]+)(s|ms)/i);
    if (durDeclMatch) {
      const val = parseFloat(durDeclMatch[1]);
      duration = durDeclMatch[2] === 's' ? val * 1000 : val;
    }
  }
  return duration ?? 300;
}

function keyframeName(block: string): string {
  const m = block.match(/@keyframes\s+([\w-]+)/);
  return m ? m[1] : 'unknown';
}

// ═══════════════════════════════════════════════════════════════════════════════
// 1. Epilepsy / Seizure Risk
// ═══════════════════════════════════════════════════════════════════════════════

function checkEpilepsy(_vars: Record<string, string> | undefined, customCss: string | null): ModerationIssue[] {
  const issues: ModerationIssue[] = [];
  if (!customCss) return issues;

  const keyframes = extractKeyframes(customCss);
  if (keyframes.length === 0) return issues;

  for (const block of keyframes) {
    const name = keyframeName(block);
    const stops = parseStops(block);
    const cycleDur = getCycleDurationMs(name, customCss);

    // Fast opacity flicker
    const hasOpacity = /opacity\s*:\s*(0|0\.0+|1)/.test(block);
    if (hasOpacity && cycleDur < 333) {
      issues.push({
        severity: 'critical',
        category: 'epilepsy',
        description: `Keyframes "${name}": opacity toggles at ${cycleDur}ms cycle (< 333ms, seizure risk).`,
      });
    }

    // Scale extremes
    const scaleValues = Array.from(block.matchAll(/transform\s*:\s*scale\(([^)]+)\)/g))
      .map(m => parseFloat(m[1]));
    if (scaleValues.length >= 2) {
      const min = Math.min(...scaleValues);
      const max = Math.max(...scaleValues);
      if (max / Math.max(min, 0.001) > 3 && cycleDur < 333) {
        issues.push({
          severity: 'critical',
          category: 'epilepsy',
          description: `Keyframes "${name}": scale alternates ${min.toFixed(1)}x–${max.toFixed(1)}x within ${cycleDur}ms (seizure risk).`,
        });
      }
    }

    // High-contrast background-color alternation
    const bgColors = Array.from(block.matchAll(/background(?:-color)?\s*:\s*([#\w]+)/gi)).map(m => m[1]);
    for (let i = 0; i < bgColors.length - 1; i++) {
      if (isHighContrast(bgColors[i], bgColors[i + 1]) && cycleDur < 333) {
        issues.push({
          severity: 'critical',
          category: 'epilepsy',
          description: `Keyframes "${name}": high-contrast background-color switch at ${cycleDur}ms (seizure risk).`,
        });
        break;
      }
    }

    // Sub-step timing checks
    if (stops.length >= 2) {
      for (let i = 0; i < stops.length - 1; i++) {
        const pctDelta = Math.abs(stops[i + 1].pct - stops[i].pct);
        const timeDeltaMs = (pctDelta / 100) * cycleDur;
        if (timeDeltaMs < 333) {
          const bg1 = stops[i].body.match(/background(?:-color)?\s*:\s*([#\w]+)/i);
          const bg2 = stops[i + 1].body.match(/background(?:-color)?\s*:\s*([#\w]+)/i);
          if (bg1 && bg2 && isHighContrast(bg1[1], bg2[1])) {
            issues.push({
              severity: 'critical',
              category: 'epilepsy',
              description: `Keyframes "${name}": high-contrast jump between ${stops[i].pct}% and ${stops[i + 1].pct}% (${Math.round(timeDeltaMs)}ms, seizure risk).`,
            });
          }
          const op1 = stops[i].body.match(/opacity\s*:\s*([^;\s]+)/);
          const op2 = stops[i + 1].body.match(/opacity\s*:\s*([^;\s]+)/);
          if (op1 && op2 && Math.abs(parseFloat(op1[1]) - parseFloat(op2[1])) > 0.5) {
            issues.push({
              severity: 'critical',
              category: 'epilepsy',
              description: `Keyframes "${name}": opacity jump ${op1[1]}→${op2[1]} at ${Math.round(timeDeltaMs)}ms (seizure risk).`,
            });
          }
        }
      }
    }

    // Check for stroboscopic patterns: 3+ alternating stops with high contrast
    if (stops.length >= 3 && cycleDur < 1000) {
      const bgStops = stops.map(s => {
        const m = s.body.match(/background(?:-color)?\s*:\s*([#\w]+)/i);
        return m ? m[1] : null;
      });
      let altCount = 0;
      for (let i = 1; i < bgStops.length; i++) {
        if (bgStops[i] && bgStops[i - 1] && bgStops[i] !== bgStops[i - 1]) altCount++;
      }
      if (altCount >= 3) {
        issues.push({
          severity: 'critical',
          category: 'epilepsy',
          description: `Keyframes "${name}": ${altCount} alternating background-color changes in ${cycleDur}ms (strobe pattern).`,
        });
      }
    }
  }

  return issues;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 2. Performance
// ═══════════════════════════════════════════════════════════════════════════════

function checkExcessiveAnimation(customCss: string | null): ModerationIssue[] {
  if (!customCss) return [];
  const count = extractKeyframes(customCss).length;
  if (count > 10) {
    return [{
      severity: 'warning',
      category: 'performance',
      description: `${count} @keyframes blocks (recommended ≤ 10). Excessive animations degrade UX.`,
    }];
  }
  return [];
}

function checkPerformance(_vars: Record<string, string> | undefined, customCss: string | null): ModerationIssue[] {
  const issues: ModerationIssue[] = [];
  if (!customCss) return issues;

  if (customCss.length > 12 * 1024) {
    issues.push({
      severity: 'warning',
      category: 'performance',
      description: `customCss is ${(customCss.length / 1024).toFixed(1)}KB (limit: 12KB).`,
    });
  }

  const ruleCount = (customCss.match(/\{/g) || []).length;
  if (ruleCount > 500) {
    issues.push({
      severity: 'warning',
      category: 'performance',
      description: `~${ruleCount} CSS rules (limit: 500). Too many rules slow rendering.`,
    });
  }

  // Check for expensive CSS properties
  if (/(?:filter\s*:\s*blur|backdrop-filter)/i.test(customCss)) {
    issues.push({
      severity: 'info',
      category: 'performance',
      description: 'Uses blur/backdrop-filter which can be GPU-intensive.',
    });
  }

  return issues;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 3. Security
// ═══════════════════════════════════════════════════════════════════════════════

function checkCssInjection(customCss: string | null): ModerationIssue[] {
  if (!customCss) return [];
  const issues: ModerationIssue[] = [];

  if (/expression\s*\(/i.test(customCss)) {
    issues.push({
      severity: 'critical',
      category: 'security',
      description: 'CSS contains expression() — IE CSS injection vector.',
    });
  }
  if (/javascript\s*:/i.test(customCss)) {
    issues.push({
      severity: 'critical',
      category: 'security',
      description: 'CSS contains javascript: URI — XSS vector.',
    });
  }
  if (/behavior\s*:/i.test(customCss)) {
    issues.push({
      severity: 'critical',
      category: 'security',
      description: 'CSS contains behavior: property — IE HTC injection.',
    });
  }
  if (/-moz-binding\s*:/i.test(customCss)) {
    issues.push({
      severity: 'critical',
      category: 'security',
      description: 'CSS contains -moz-binding — Firefox XBL injection.',
    });
  }
  if (/@import\s+url\s*\(/i.test(customCss)) {
    issues.push({
      severity: 'warning',
      category: 'security',
      description: 'CSS uses @import url() — external resource loading.',
    });
  }

  return issues;
}

function checkDangerousHtml(extensions: any[] | null | undefined): ModerationIssue[] {
  if (!extensions || !Array.isArray(extensions)) return [];
  const issues: ModerationIssue[] = [];

  for (const ext of extensions) {
    const html: string | undefined = ext.html || ext.content || (typeof ext === 'string' ? ext : undefined);
    if (!html || typeof html !== 'string') continue;

    // Form / interactive elements
    if (/<(?:form|input|button|select|textarea|option)[\s>\/]/i.test(html)) {
      issues.push({
        severity: 'critical',
        category: 'security',
        description: 'Extension HTML contains form/interactive elements (phishing risk).',
      });
    }

    // target="_blank" without noopener
    for (const link of Array.from(html.matchAll(/<a\s[^>]*target\s*=\s*["']_blank["'][^>]*>/gi))) {
      if (!/rel\s*=\s*["'][^"']*noopener/.test(link[0])) {
        issues.push({
          severity: 'critical',
          category: 'security',
          description: 'Link with target="_blank" missing rel="noopener".',
        });
      }
    }

    // data: URIs with executable content
    if (/data:\s*[^,]*(?:text\/html|application\/javascript|text\/javascript)[^,]*[,;]/i.test(html)) {
      issues.push({
        severity: 'critical',
        category: 'security',
        description: 'Extension uses data: URI with executable content.',
      });
    }

    // Suspicious URL patterns
    const urlMatches = html.match(/https?:\/\/[^\s"'<>]+/gi) || [];
    for (const url of urlMatches) {
      const suspicious = /\.(?:tk|ml|ga|cf|gq|xyz|top|click|download|loan|work)\b/i;
      if (suspicious.test(url)) {
        issues.push({
          severity: 'warning',
          category: 'security',
          description: `Suspicious URL domain: ${url.slice(0, 60)}`,
        });
        break;
      }
    }

    // Event handlers in HTML
    if (/\bon\w+\s*=/i.test(html)) {
      issues.push({
        severity: 'critical',
        category: 'security',
        description: 'Extension HTML contains inline event handlers (XSS risk).',
      });
    }

    // Embedded iframe/object/embed
    if (/<(?:iframe|object|embed)[\s>]/i.test(html)) {
      issues.push({
        severity: 'critical',
        category: 'security',
        description: 'Extension HTML contains embedded content element (iframe/object/embed).',
      });
    }
  }

  return issues;
}

function checkClickEffect(clickEffect: any): ModerationIssue[] {
  if (!clickEffect || !clickEffect.spawn) return [];
  const issues: ModerationIssue[] = [];

  if (clickEffect.spawn.length > 20) {
    issues.push({
      severity: 'warning',
      category: 'performance',
      description: `Click effect spawns ${clickEffect.spawn.length} elements (excessive).`,
    });
  }

  for (const def of clickEffect.spawn) {
    if (def.duration && def.duration > 10000) {
      issues.push({
        severity: 'warning',
        category: 'performance',
        description: `Click effect has duration ${def.duration}ms (>10s, potential memory leak).`,
      });
    }
    if (def.count && def.count > 100) {
      issues.push({
        severity: 'warning',
        category: 'performance',
        description: `Click effect spawns ${def.count} particles per click (excessive).`,
      });
    }
  }

  return issues;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 4. Content
// ═══════════════════════════════════════════════════════════════════════════════

const PROFANITY_EN: RegExp[] = [
  /\bf[\W_]*u[\W_]*c[\W_]*k(?:ing|er|ed)?\b/i,
  /\bs[\W_]*h[\W_]*[i1][\W_]*t(?:ting|ter|ty)?\b/i,
  /\b(?:a[\W_]*s[\W_]*s(?:h[\W_]*[o0][\W_]*l[\W_]*e)?|a[\W_]*s[\W_]*s[\W_]*w[\W_]*i[\W_]*p[\W_]*e)\b/i,
  /\bb[\W_]*[i1][\W_]*t[\W_]*c[\W_]*h(?:ing|er|ed)?\b/i,
  /\bd[\W_]*[a@][\W_]*m[\W_]*n\b/i,
  /\bc[\W_]*r[\W_]*a[\W_]*p\b/i,
  /\b(?:d[\W_]*i[\W_]*c[\W_]*k|c[\W_]*o[\W_]*c[\W_]*k|p[\W_]*e[\W_]*n[\W_]*[i1][\W_]*s)\b/i,
  /\bb[\W_]*a[\W_]*s[\W_]*t[\W_]*a[\W_]*r[\W_]*d\b/i,
  /\bw[\W_]*h[\W_]*[o0][\W_]*r[\W_]*e\b/i,
  /\bs[\W_]*l[\W_]*u[\W_]*t\b/i,
  /\bn[\W_]*[i1][\W_]*g+[\W_]*[e3]+[\W_]*r\b/i,
  /\bf[\W_]*[a@][\W_]*g+(?:[\W_]*[e3]+[\W_]*t)?\b/i,
  /\br[\W_]*[e3][\W_]*t[\W_]*a[\W_]*r[\W_]*d\b/i,
];

const PROFANITY_ZH: RegExp[] = [
  /傻[\s]*[逼笔比屄]/,
  /[操草][\s]*(?:你|尼|泥|呢|妳|娘|他|她|ta|大爷|蛋)/,
  /[日][\s]*(?:你|尼|泥|呢|妳|娘|他|她|ta)/,
  /妈[\s]*的/,
  /[他她它妈你尼呢妳]妈[\s]*的/,
  /靠[\s]*[北呗][\s]*[~～]*$/,
  /[鸡姬][\s]*[巴吧八扒]/,
  /[逼比][\s]*[样养痒]/,
  /[我你妳他她][\s]*[去滚死爬]/,
  /狗[\s]*[日屎屁]/,
  /[操草艹](?:蛋|大爷|tm|特么|踏马)/,
  /jb|sb|cnm|nmsl|tmd|wqnmlgb/i,
];

function checkTextContent(text: string, context: string): ModerationIssue[] {
  if (!text || typeof text !== 'string') return [];

  for (const pattern of PROFANITY_EN) {
    if (pattern.test(text)) {
      return [{
        severity: 'warning',
        category: 'content',
        description: `${context} contains inappropriate language.`,
      }];
    }
  }

  for (const pattern of PROFANITY_ZH) {
    if (pattern.test(text)) {
      return [{
        severity: 'warning',
        category: 'content',
        description: `${context} contains inappropriate language.`,
      }];
    }
  }

  return [];
}

function checkNameAndAuthor(name: string | undefined, author: string | undefined): ModerationIssue[] {
  const issues: ModerationIssue[] = [];

  if (name) {
    // Check for excessively long names
    if (name.length > 80) {
      issues.push({
        severity: 'info',
        category: 'quality',
        description: `Theme name is ${name.length} chars (unusually long).`,
      });
    }
    // Check for spammy patterns
    if (/\b(?:buy|sell|cheap|discount|free|click|earn|cash|win|prize|viagra|casino|porn|xxx|sex)\b/i.test(name)) {
      issues.push({
        severity: 'critical',
        category: 'content',
        description: 'Theme name contains spam/advertising keywords.',
      });
    }
    issues.push(...checkTextContent(name, 'Theme name'));
  }

  if (author) {
    if (author.length > 40) {
      issues.push({
        severity: 'info',
        category: 'quality',
        description: `Author name is ${author.length} chars (unusually long).`,
      });
    }
    issues.push(...checkTextContent(author, 'Author name'));
  }

  return issues;
}

function checkExtensionsContent(extensions: any[] | null | undefined): ModerationIssue[] {
  if (!extensions || !Array.isArray(extensions)) return [];
  const issues: ModerationIssue[] = [];

  for (const ext of extensions) {
    const html: string | undefined = ext.html || ext.content || (typeof ext === 'string' ? ext : undefined);
    if (!html || typeof html !== 'string') continue;

    // Strip tags for text analysis
    const text = html.replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/gi, '');
    const textIssues = checkTextContent(text, 'Extension');
    for (const issue of textIssues) {
      if (!issues.some(i => i.description === issue.description)) {
        issues.push(issue);
      }
    }
  }

  return issues;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 5. Accessibility (WCAG)
// ═══════════════════════════════════════════════════════════════════════════════

function checkWcagContrast(cssVars: Record<string, string> | undefined): {
  issues: ModerationIssue[];
  wcag: { textOnBg: number; primaryOnBg: number; passes: boolean };
} {
  if (!cssVars) {
    return {
      issues: [],
      wcag: { textOnBg: 0, primaryOnBg: 0, passes: false },
    };
  }

  const bg = cssVars['--color-bg'] || '#0f0f23';
  const text = cssVars['--color-text'] || '#f4f4f5';
  const primary = cssVars['--color-primary'] || '#6366f1';

  const textRatio = Math.round(contrastRatio(text, bg) * 100) / 100;
  const primaryRatio = Math.round(contrastRatio(primary, bg) * 100) / 100;
  const textPasses = textRatio >= 4.5;
  const primaryPasses = primaryRatio >= 3;
  const passes = textPasses && primaryPasses;

  const issues: ModerationIssue[] = [];

  if (!textPasses) {
    issues.push({
      severity: textRatio < 3 ? 'critical' : 'warning',
      category: 'accessibility',
      description: `Text-to-background contrast ratio ${textRatio}:1 (WCAG AA requires ≥ 4.5:1).`,
    });
  }
  if (!primaryPasses) {
    issues.push({
      severity: primaryRatio < 2 ? 'critical' : 'warning',
      category: 'accessibility',
      description: `Primary-to-background contrast ratio ${primaryRatio}:1 (WCAG AA non-text requires ≥ 3:1).`,
    });
  }

  return { issues, wcag: { textOnBg: textRatio, primaryOnBg: primaryRatio, passes } };
}

// ═══════════════════════════════════════════════════════════════════════════════
// 6. Quality
// ═══════════════════════════════════════════════════════════════════════════════

function checkCssVarQuality(cssVars: Record<string, string> | undefined): ModerationIssue[] {
  if (!cssVars) return [];
  const issues: ModerationIssue[] = [];
  const keys = Object.keys(cssVars);

  // Too few variables
  if (keys.length < 6) {
    issues.push({
      severity: 'info',
      category: 'quality',
      description: `Only ${keys.length} CSS variables defined (minimal theme).`,
    });
  }

  // Too many variables (possible abuse)
  if (keys.length > 100) {
    issues.push({
      severity: 'warning',
      category: 'quality',
      description: `${keys.length} CSS variables defined (suspiciously many).`,
    });
  }

  // Check for suspiciously identical colors (no real theming)
  const colorKeys = ['--color-primary', '--color-secondary', '--color-accent'];
  const colorValues = colorKeys.map(k => cssVars[k]).filter(Boolean);
  const uniqueColors = new Set(colorValues.map(c => c.toLowerCase()));
  if (colorValues.length >= 3 && uniqueColors.size === 1) {
    issues.push({
      severity: 'info',
      category: 'quality',
      description: 'Primary, secondary, and accent are identical — not a meaningful theme.',
    });
  }

  // Check for extreme font sizes in CSS vars
  const fontBase = cssVars['--text-base'];
  if (fontBase) {
    const match = fontBase.match(/^([\d.]+)(px|rem)$/);
    if (match) {
      const size = parseFloat(match[1]);
      if (match[2] === 'px' && (size < 10 || size > 32)) {
        issues.push({
          severity: 'info',
          category: 'accessibility',
          description: `Base font size ${fontBase} is outside readable range.`,
        });
      }
    }
  }

  return issues;
}

// ═══════════════════════════════════════════════════════════════════════════════
// Helpers
// ═══════════════════════════════════════════════════════════════════════════════

/** Check if two color strings have high contrast (Δ luminance > 0.5). */
function isHighContrast(c1: string, c2: string): boolean {
  const l1 = parseColorLuminance(c1);
  const l2 = parseColorLuminance(c2);
  if (l1 === null || l2 === null) return false;
  return Math.abs(l1 - l2) > 0.5;
}

function hexLuminance(hex: string): number {
  hex = hex.replace('#', '');
  if (hex.length === 3) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function parseColorLuminance(color: string): number | null {
  color = color.trim();
  if (color.startsWith('#')) return hexLuminance(color);
  const named: Record<string, number> = {
    white: 1, black: 0,
    red: 0.2126, green: 0.7152, blue: 0.0722,
    yellow: 0.9278, cyan: 0.7874, magenta: 0.2848,
    transparent: 0,
  };
  const lower = color.toLowerCase();
  if (lower in named) return named[lower];
  return null;
}

// ═══════════════════════════════════════════════════════════════════════════════
// Main
// ═══════════════════════════════════════════════════════════════════════════════

function moderateTheme(theme: {
  cssVars?: Record<string, string>;
  customCss?: string | null;
  extensions?: any[] | null;
  clickEffect?: any;
  name?: string;
  author?: string;
}): ModerationResult {
  const issues: ModerationIssue[] = [
    ...checkEpilepsy(theme.cssVars, theme.customCss ?? null),
    ...checkExcessiveAnimation(theme.customCss ?? null),
    ...checkCssInjection(theme.customCss ?? null),
    ...checkPerformance(theme.cssVars, theme.customCss ?? null),
    ...checkDangerousHtml(theme.extensions),
    ...checkExtensionsContent(theme.extensions),
    ...checkClickEffect(theme.clickEffect),
    ...checkNameAndAuthor(theme.name, theme.author),
    ...checkCssVarQuality(theme.cssVars),
  ];

  const wcag = checkWcagContrast(theme.cssVars);
  issues.push(...wcag.issues);

  // Calculate safety score (0-100)
  let score = 100;
  for (const issue of issues) {
    switch (issue.severity) {
      case 'critical': score -= 25; break;
      case 'warning': score -= 10; break;
      case 'info': score -= 3; break;
    }
  }
  score = Math.max(0, score);

  const hasCritical = issues.some(i => i.severity === 'critical');

  return {
    safe: !hasCritical,
    score,
    issues,
    checkedAt: new Date().toISOString(),
    wcag: wcag.wcag,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// API Handler
// ═══════════════════════════════════════════════════════════════════════════════

export async function POST({ request, cookies }: { request: Request; cookies: any }) {
  if (!isAdmin(cookies)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json', ...CORS, ...NO_CACHE },
    });
  }

  if (!verifyCsrf(cookies, request.headers)) {
    return new Response(JSON.stringify({ error: 'CSRF validation failed' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json', ...CORS, ...NO_CACHE },
    });
  }

  try {
    const body = await request.json();

    let target: {
      cssVars?: Record<string, string>;
      customCss?: string | null;
      extensions?: any[] | null;
      clickEffect?: any;
      name?: string;
      author?: string;
    };

    if ('id' in body && typeof body.id === 'string') {
      const theme = await getTheme(body.id);
      if (!theme) {
        return new Response(JSON.stringify({ error: 'Theme not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json', ...CORS, ...NO_CACHE },
        });
      }
      target = {
        cssVars: theme.cssVars,
        customCss: theme.customCss,
        extensions: theme.extensions,
        clickEffect: theme.clickEffect,
        name: theme.name,
        author: theme.author,
      };
    } else if ('cssVars' in body || 'customCss' in body || 'extensions' in body || 'name' in body) {
      target = {
        cssVars: body.cssVars,
        customCss: body.customCss,
        extensions: body.extensions,
        clickEffect: body.clickEffect,
        name: body.name,
        author: body.author,
      };
    } else {
      return new Response(JSON.stringify({ error: 'Provide either { id } or { cssVars, customCss, extensions }' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...CORS, ...NO_CACHE },
      });
    }

    const result = moderateTheme(target);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...CORS, ...NO_CACHE },
    });
  } catch {
    return new Response(JSON.stringify({ error: 'Request format error' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...CORS, ...NO_CACHE },
    });
  }
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}
