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
  category: 'epilepsy' | 'performance' | 'security' | 'content';
  description: string;
}

interface ModerationResult {
  safe: boolean;
  issues: ModerationIssue[];
  checkedAt: string;
}

// ── helpers ──────────────────────────────────────────────────────────────────

/** Extract all @keyframes blocks from CSS text. */
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

/** Parse percentage stops from a @keyframes block body. Returns sorted entries [{pct, body}]. */
function parseStops(block: string): { pct: number; body: string }[] {
  const stops: { pct: number; body: string }[] = [];
  const re = /([\d.]+)%\s*\{([^}]*)\}/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(block)) !== null) {
    stops.push({ pct: parseFloat(m[1]), body: m[2] });
  }
  // also match "from" (0%) and "to" (100%)
  const fromRe = /\bfrom\s*\{([^}]*)\}/g;
  const toRe = /\bto\s*\{([^}]*)\}/g;
  let fm: RegExpExecArray | null;
  while ((fm = fromRe.exec(block)) !== null) {
    stops.push({ pct: 0, body: fm[1] });
  }
  let tm: RegExpExecArray | null;
  while ((tm = toRe.exec(block)) !== null) {
    stops.push({ pct: 100, body: tm[1] });
  }
  stops.sort((a, b) => a.pct - b.pct);
  return stops;
}

/** Parse the total cycle duration from a full CSS text for a given keyframe name, via animation shorthand or duration. */
function getCycleDurationMs(name: string, fullCss: string): number {
  // Try to find animation or animation-duration declarations referencing this keyframe name
  // Match animation shorthand: animation: ... <duration> ... <name>
  // or animation-name + animation-duration separately
  const lines = fullCss.split(';');
  let duration: number | null = null;

  for (const line of lines) {
    const trimmed = line.trim();
    // animation shorthand
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
    // animation-duration
    const durDeclMatch = trimmed.match(/animation-duration\s*:\s*([\d.]+)(s|ms)/i);
    if (durDeclMatch) {
      const val = parseFloat(durDeclMatch[1]);
      duration = durDeclMatch[2] === 's' ? val * 1000 : val;
    }
  }

  if (duration !== null) return duration;
  return 300; // default assumption: likely short if unspecified
}

/** Extract keyframe name from @keyframes declaration line. */
function keyframeName(block: string): string {
  const m = block.match(/@keyframes\s+([\w-]+)/);
  return m ? m[1] : 'unknown';
}

/** Simple luminance estimate from hex color. */
function hexLuminance(hex: string): number {
  hex = hex.replace('#', '');
  if (hex.length === 3) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Check if two color strings represent high-contrast colors. */
function isHighContrast(c1: string, c2: string): boolean {
  const l1 = parseColorLuminance(c1);
  const l2 = parseColorLuminance(c2);
  if (l1 === null || l2 === null) return false;
  return Math.abs(l1 - l2) > 0.7;
}

function parseColorLuminance(color: string): number | null {
  color = color.trim();
  if (color.startsWith('#')) return hexLuminance(color);
  // named color shortcuts
  const named: Record<string, number> = {
    white: 1, black: 0, red: 0.2126, green: 0.0722, blue: 0.0722,
    yellow: 0.9278, cyan: 0.7874, magenta: 0.2848, transparent: 0,
  };
  const lower = color.toLowerCase();
  if (lower in named) return named[lower];
  return null;
}

// ── rule checks ──────────────────────────────────────────────────────────────

function checkEpilepsy(cssVars: Record<string, string> | undefined, customCss: string | null): ModerationIssue[] {
  const issues: ModerationIssue[] = [];
  if (!customCss) return issues;

  const keyframes = extractKeyframes(customCss);
  if (keyframes.length === 0) return issues;

  for (const block of keyframes) {
    const name = keyframeName(block);
    const stops = parseStops(block);
    const cycleDur = getCycleDurationMs(name, customCss);

    // Check: opacity flicker within fast cycle
    const hasOpacity = block.match(/opacity\s*:\s*(0|0\.0+|1)/);
    if (hasOpacity && cycleDur < 333) {
      issues.push({
        severity: 'critical',
        category: 'epilepsy',
        description: `Keyframes "${name}": opacity transition with cycle duration ${cycleDur}ms < 333ms (seizure risk).`,
      });
    }

    // Check: scale alternating between very different values
    const scaleValues = Array.from(block.matchAll(/transform\s*:\s*scale\(([^)]+)\)/g))
      .map(m => parseFloat(m[1]));
    if (scaleValues.length >= 2) {
      const min = Math.min(...scaleValues);
      const max = Math.max(...scaleValues);
      if (max / Math.max(min, 0.001) > 3 && cycleDur < 333) {
        issues.push({
          severity: 'critical',
          category: 'epilepsy',
          description: `Keyframes "${name}": scale alternates ${min} to ${max} within ${cycleDur}ms cycle (seizure risk).`,
        });
      }
    }

    // Check: background-color alternating high-contrast
    const bgColors = Array.from(block.matchAll(/background-color\s*:\s*([^;\s]+)/g))
      .map(m => m[1]);
    if (bgColors.length >= 2) {
      for (let i = 0; i < bgColors.length - 1; i++) {
        if (isHighContrast(bgColors[i], bgColors[i + 1]) && cycleDur < 333) {
          issues.push({
            severity: 'critical',
            category: 'epilepsy',
            description: `Keyframes "${name}": background-color alternates between high-contrast colors within ${cycleDur}ms cycle (seizure risk).`,
          });
          break;
        }
      }
    }

    // Check: sub-step timing — fast high-contrast jumps between close percentage stops
    if (stops.length >= 2) {
      for (let i = 0; i < stops.length - 1; i++) {
        const pctDelta = Math.abs(stops[i + 1].pct - stops[i].pct);
        const timeDeltaMs = (pctDelta / 100) * cycleDur;
        if (timeDeltaMs < 333) {
          // Check if the two stops have high-contrast changes
          const bg1 = stops[i].body.match(/background-color\s*:\s*([^;\s]+)/);
          const bg2 = stops[i + 1].body.match(/background-color\s*:\s*([^;\s]+)/);
          if (bg1 && bg2 && isHighContrast(bg1[1], bg2[1])) {
            issues.push({
              severity: 'critical',
              category: 'epilepsy',
              description: `Keyframes "${name}": high-contrast background-color jump between ${stops[i].pct}% and ${stops[i + 1].pct}% stops (${Math.round(timeDeltaMs)}ms apart, seizure risk).`,
            });
          }
          // Check opacity jumps
          const op1 = stops[i].body.match(/opacity\s*:\s*([^;\s]+)/);
          const op2 = stops[i + 1].body.match(/opacity\s*:\s*([^;\s]+)/);
          if (op1 && op2) {
            const o1 = parseFloat(op1[1]);
            const o2 = parseFloat(op2[1]);
            if (Math.abs(o1 - o2) > 0.5) {
              issues.push({
                severity: 'critical',
                category: 'epilepsy',
                description: `Keyframes "${name}": large opacity jump (${o1} to ${o2}) between ${stops[i].pct}% and ${stops[i + 1].pct}% stops (${Math.round(timeDeltaMs)}ms apart, seizure risk).`,
              });
            }
          }
        }
      }
    }
  }

  return issues;
}

function checkExcessiveAnimation(customCss: string | null): ModerationIssue[] {
  if (!customCss) return [];
  const keyframes = extractKeyframes(customCss);
  if (keyframes.length > 10) {
    return [{
      severity: 'warning',
      category: 'performance',
      description: `Found ${keyframes.length} @keyframes blocks (limit: 10). Excessive animations may degrade user experience.`,
    }];
  }
  return [];
}

function checkPerformance(cssVars: Record<string, string> | undefined, customCss: string | null): ModerationIssue[] {
  const issues: ModerationIssue[] = [];

  if (customCss && customCss.length > 12 * 1024) {
    issues.push({
      severity: 'warning',
      category: 'performance',
      description: `customCss is ${(customCss.length / 1024).toFixed(1)}KB (limit: 12KB). Large CSS may impact page load performance.`,
    });
  }

  // Estimate total CSS rules by counting opening braces
  if (customCss) {
    const ruleCount = (customCss.match(/\{/g) || []).length;
    if (ruleCount > 500) {
      issues.push({
        severity: 'warning',
        category: 'performance',
        description: `Estimated ${ruleCount} CSS rules (limit: 500). Too many rules may slow rendering.`,
      });
    }
  }

  return issues;
}

function checkDangerousHtml(extensions: any[] | null | undefined): ModerationIssue[] {
  if (!extensions || !Array.isArray(extensions)) return [];
  const issues: ModerationIssue[] = [];

  for (const ext of extensions) {
    const html: string | undefined = ext.html || ext.content || (typeof ext === 'string' ? ext : undefined);
    if (!html || typeof html !== 'string') continue;

    // Form elements
    if (/<form[\s>]/i.test(html) || /<input[\s>\/]/i.test(html) || /<button[\s>]/i.test(html)) {
      issues.push({
        severity: 'critical',
        category: 'security',
        description: 'Extension HTML contains form/input/button elements which could be used for phishing.',
      });
    }

    // target="_blank" without rel="noopener"
    const linkMatches = Array.from(html.matchAll(/<a\s[^>]*target\s*=\s*["']_blank["'][^>]*>/gi));
    for (const link of linkMatches) {
      const tag = link[0];
      if (!/rel\s*=\s*["'][^"']*noopener/.test(tag)) {
        issues.push({
          severity: 'critical',
          category: 'security',
          description: `Link with target="_blank" missing rel="noopener": ${tag.slice(0, 80)}`,
        });
      }
    }

    // data: URIs with script content
    if (/data:\s*[^,]*(?:text\/html|application\/javascript|text\/javascript)[^,]*,/i.test(html)) {
      issues.push({
        severity: 'critical',
        category: 'security',
        description: 'Extension HTML contains data: URI with script content.',
      });
    }
  }

  return issues;
}

function checkContent(extensions: any[] | null | undefined): ModerationIssue[] {
  if (!extensions || !Array.isArray(extensions)) return [];
  const issues: ModerationIssue[] = [];

  // Basic English + Chinese profanity patterns
  const profanityPatterns = [
    /\bf+[\W_]*u+[\W_]*c+[\W_]*k+/i,
    /\bs+[\W_]*h+[\W_]*[i1]+[\W_]*t+/i,
    /\ba+[\W_]*s+[\W_]*s+(?:h+[\W_]*[o0]+[\W_]*l+[\W_]*[e3]+)?/i,
    /\bb+[\W_]*[i1]+[\W_]*t+[\W_]*c+[\W_]*h+/i,
    /\bd+[\W_]*[a@]+[\W_]*m+[\W_]*n+/i,
    /\bc+[\W_]*r+[\W_]*a+[\W_]*p+/i,
    // Chinese profanity (common)
    /[價僻尼玛草據趣正奶]/,
    /[偷觀]/,
    /[擎死]/,
  ];

  for (const ext of extensions) {
    const html: string | undefined = ext.html || ext.content || (typeof ext === 'string' ? ext : undefined);
    if (!html || typeof html !== 'string') continue;

    // Strip HTML tags to get text content
    const text = html.replace(/<[^>]+>/g, ' ');
    for (const pattern of profanityPatterns) {
      if (pattern.test(text)) {
        issues.push({
          severity: 'warning',
          category: 'content',
          description: 'Extension contains potentially inappropriate text content.',
        });
        break; // one match per extension is enough
      }
    }
  }

  return issues;
}

// ── main handler ─────────────────────────────────────────────────────────────

function moderateTheme(theme: { cssVars?: Record<string, string>; customCss?: string | null; extensions?: any[] | null }): ModerationResult {
  const issues: ModerationIssue[] = [
    ...checkEpilepsy(theme.cssVars, theme.customCss ?? null),
    ...checkExcessiveAnimation(theme.customCss ?? null),
    ...checkPerformance(theme.cssVars, theme.customCss ?? null),
    ...checkDangerousHtml(theme.extensions),
    ...checkContent(theme.extensions),
  ];

  const hasCritical = issues.some(i => i.severity === 'critical');

  return {
    safe: !hasCritical,
    issues,
    checkedAt: new Date().toISOString(),
  };
}

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

    let target: { cssVars?: Record<string, string>; customCss?: string | null; extensions?: any[] | null };

    if ('id' in body && typeof body.id === 'string') {
      const theme = await getTheme(body.id);
      if (!theme) {
        return new Response(JSON.stringify({ error: 'Theme not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json', ...CORS, ...NO_CACHE },
        });
      }
      target = { cssVars: theme.cssVars, customCss: theme.customCss, extensions: theme.extensions };
    } else if ('cssVars' in body || 'customCss' in body || 'extensions' in body) {
      target = {
        cssVars: body.cssVars,
        customCss: body.customCss,
        extensions: body.extensions,
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
