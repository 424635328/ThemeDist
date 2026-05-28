/**
 * Convert #RRGGBB or #RGB hex to [R, G, B] tuple.
 * Returns [0,0,0] for invalid input.
 */
export function hexToRgb(hex: string): [number, number, number] {
  const c = hex.replace('#', '').trim();
  if (c.length !== 6 && c.length !== 3) return [0, 0, 0];

  let r = 0, g = 0, b = 0;
  if (c.length === 6) {
    r = parseInt(c.slice(0, 2), 16);
    g = parseInt(c.slice(2, 4), 16);
    b = parseInt(c.slice(4, 6), 16);
  } else {
    r = parseInt(c[0] + c[0], 16);
    g = parseInt(c[1] + c[1], 16);
    b = parseInt(c[2] + c[2], 16);
  }

  if (isNaN(r) || isNaN(g) || isNaN(b)) return [0, 0, 0];
  return [r, g, b];
}

/**
 * Convert #RRGGBB or #RGB hex to comma-separated R, G, B channels string.
 * Returns empty string for invalid input.
 */
export function hexToRgbChannels(hex: string): string {
  const clean = hex.replace(/^#/, '').trim();
  if (clean.length !== 6 && clean.length !== 3) return '';

  let r = 0, g = 0, b = 0;
  if (clean.length === 6) {
    r = parseInt(clean.slice(0, 2), 16);
    g = parseInt(clean.slice(2, 4), 16);
    b = parseInt(clean.slice(4, 6), 16);
  } else {
    r = parseInt(clean[0] + clean[0], 16);
    g = parseInt(clean[1] + clean[1], 16);
    b = parseInt(clean[2] + clean[2], 16);
  }

  if (isNaN(r) || isNaN(g) || isNaN(b)) return '';
  return `${r}, ${g}, ${b}`;
}

/**
 * Parse rgba(r, g, b, a) or rgb(r,g,b) string to R, G, B channels.
 */
export function rgbaToRgbChannels(rgba: string): string {
  const m = rgba.match(/rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
  if (!m) return '';
  return `${m[1]}, ${m[2]}, ${m[3]}`;
}

/**
 * Extract R, G, B channels from any color format (hex or rgba/rgb).
 * Returns empty string for unrecognized formats.
 */
export function extractRgbChannels(colorVal: string): string {
  if (!colorVal) return '';
  const val = colorVal.trim();

  if (val.startsWith('#')) {
    return hexToRgbChannels(val);
  }

  const rgbaRegex = /rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i;
  const match = val.match(rgbaRegex);
  if (match) {
    return `${match[1]}, ${match[2]}, ${match[3]}`;
  }

  return '';
}

/**
 * W3C relative luminance (0-1) from R, G, B values (0-255).
 */
export function getLuminance(r: number, g: number, b: number): number {
  const a = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

/**
 * WCAG contrast ratio between two hex colors.
 */
export function getContrastRatio(hex1: string, hex2: string): number {
  const [r1, g1, b1] = hexToRgb(hex1);
  const [r2, g2, b2] = hexToRgb(hex2);
  const lum1 = getLuminance(r1, g1, b1);
  const lum2 = getLuminance(r2, g2, b2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

/**
 * W3C relative luminance (0-1) from a CSS color value.
 * Uses gamma-corrected WCAG formula, consistent with getLuminance().
 */
export function isLightColor(colorVal: string): boolean {
  const rgbStr = extractRgbChannels(colorVal);
  if (!rgbStr) return false;

  const [r, g, b] = rgbStr.split(',').map(Number);
  return getLuminance(r, g, b) > 0.179;
}

/**
 * RGB to HSL string in Shadcn UI format: "222.2 84% 4.9%"
 */
export function rgbToHslString(r: number, g: number, b: number): string {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return `${(h * 360).toFixed(1)} ${(s * 100).toFixed(1)}% ${(l * 100).toFixed(1)}%`;
}

/**
 * Mix two RGB tuples by weight (0 = all base, 1 = all mix).
 */
export function mixColor(base: [number, number, number], mix: [number, number, number], weight: number): [number, number, number] {
  return [
    Math.round(base[0] + (mix[0] - base[0]) * weight),
    Math.round(base[1] + (mix[1] - base[1]) * weight),
    Math.round(base[2] + (mix[2] - base[2]) * weight),
  ];
}

/**
 * RGB tuple to hex string.
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => Math.max(0, Math.min(255, Math.round(x))).toString(16).padStart(2, '0')).join('');
}

// ─── HSL Conversions ───

/** Hex to HSL. h: 0-360, s: 0-1, l: 0-1. */
export function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const [r, g, b] = hexToRgb(hex);
  return rgbToHsl(r, g, b);
}

/** RGB (0-255) to HSL. h: 0-360, s: 0-1, l: 0-1. */
export function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: h * 360, s, l };
}

/** HSL to hex. h: 0-360, s: 0-1, l: 0-1. Does not mutate parameters. */
export function hslToHex(h: number, s: number, l: number): string {
  const hNorm = ((h % 360) + 360) % 360 / 360;
  let r: number, g: number, b: number;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      let tN = t;
      if (tN < 0) tN += 1;
      if (tN > 1) tN -= 1;
      if (tN < 1 / 6) return p + (q - p) * 6 * tN;
      if (tN < 1 / 2) return q;
      if (tN < 2 / 3) return p + (q - p) * (2 / 3 - tN) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, hNorm + 1 / 3);
    g = hue2rgb(p, q, hNorm);
    b = hue2rgb(p, q, hNorm - 1 / 3);
  }
  const toHex = (x: number) => Math.round(x * 255).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// ─── APCA Contrast (WCAG 3.0 draft) ───

/** sRGB component to linear luminance. */
function srgbToLinear(c: number): number {
  c /= 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

/**
 * APCA Lc value for text on background (WCAG 3.0 draft).
 * Uses polarity-aware asymmetric coefficients.
 * Negative = light text on dark bg, Positive = dark text on light bg.
 */
export function getAPCAContrast(textHex: string, bgHex: string): number {
  const [tr, tg, tb] = hexToRgb(textHex);
  const [br, bg2, bb] = hexToRgb(bgHex);

  const Ytxt = 0.2126 * srgbToLinear(tr) + 0.7152 * srgbToLinear(tg) + 0.0722 * srgbToLinear(tb);
  const Ybg = 0.2126 * srgbToLinear(br) + 0.7152 * srgbToLinear(bg2) + 0.0722 * srgbToLinear(bb);

  // Polarity-aware (simplified APCA 0.98G-4g)
  if (Ybg > Ytxt) {
    // Dark text on light background (positive Lc)
    return (Math.pow(Ybg, 0.56) - Math.pow(Ytxt, 0.57)) * 1.14 * 100;
  } else {
    // Light text on dark background (negative Lc, glare-compensated)
    return -((Math.pow(Ytxt, 0.57) - Math.pow(Ybg, 0.56)) * 1.14 * 100) * 0.95;
  }
}

/** Evaluate APCA level. */
export function evalAPCA(textHex: string, bgHex: string): { Lc: number; level: string } {
  const Lc = Math.round(getAPCAContrast(textHex, bgHex) * 10) / 10;
  const absLc = Math.abs(Lc);
  let level: string;
  if (absLc >= 75) level = 'AAA';
  else if (absLc >= 60) level = 'AA';
  else if (absLc >= 45) level = 'AA-large';
  else level = 'fail';
  return { Lc, level };
}

// ─── WCAG Auto-Fix ───

/**
 * Adjust a foreground color's lightness to meet a target contrast ratio against a background.
 * Uses binary search on the L channel in HSL space, preserving hue and saturation.
 * Max L adjustment capped at 25% to preserve design intent (beauty protection).
 * Returns null if adjustment would exceed cap (caller should use fallback strategy).
 */
export function adjustLightnessForContrast(fgHex: string, bgHex: string, targetRatio: number): string | null {
  const fgHsl = hexToHsl(fgHex);
  const bgLum = getLuminance(...hexToRgb(bgHex));
  const fgLum = getLuminance(...hexToRgb(fgHex));

  const makeLighter = fgLum > bgLum;
  const MAX_L_SHIFT = 0.25;

  let lo = makeLighter ? fgHsl.l : Math.max(0, fgHsl.l - MAX_L_SHIFT);
  let hi = makeLighter ? Math.min(1, fgHsl.l + MAX_L_SHIFT) : fgHsl.l;

  // Check if cap allows meeting target ratio
  const capCandidate = hslToHex(fgHsl.h, fgHsl.s, makeLighter ? hi : lo);
  if (getContrastRatio(capCandidate, bgHex) < targetRatio) {
    return null; // Cannot meet target within beauty-safe range
  }

  let best = fgHex;
  for (let i = 0; i < 30; i++) {
    const mid = (lo + hi) / 2;
    const candidate = hslToHex(fgHsl.h, fgHsl.s, mid);
    const ratio = getContrastRatio(candidate, bgHex);

    if (ratio >= targetRatio) {
      best = candidate;
      if (makeLighter) hi = mid; else lo = mid;
    } else {
      if (makeLighter) lo = mid; else hi = mid;
    }
    if (Math.abs(ratio - targetRatio) < 0.05) break;
  }
  return best;
}

/** Standard color pairs to check for WCAG compliance. */
const WCAG_PAIRS: [string, string, string][] = [
  ['--color-text', '--color-bg', 'text_on_bg'],
  ['--color-primary', '--color-bg', 'primary_on_bg'],
  ['--color-secondary', '--color-bg', 'secondary_on_bg'],
  ['--color-text-muted', '--color-bg', 'muted_on_bg'],
  ['--color-text', '--color-surface', 'text_on_surface'],
];

/**
 * Auto-fix CSS variable colors to meet WCAG contrast requirements.
 * Returns patched cssVars and a change log.
 * If beauty-safe adjustment can't meet target, tries AA as fallback.
 * If still failing, generates *-contrasted derivative vars instead.
 */
export function generateContrastFix(
  cssVars: Record<string, string>,
  level: 'aa' | 'aaa' = 'aa',
): { fixed: Record<string, string>; changes: { var: string; original: string; fixed: string; pair: string; reason: string }[] } {
  const targetRatio = level === 'aaa' ? 7.0 : 4.5;
  const aaRatio = 4.5;
  const fixed = { ...cssVars };
  const changes: { var: string; original: string; fixed: string; pair: string; reason: string }[] = [];

  for (const [fgVar, bgVar, pairName] of WCAG_PAIRS) {
    const fg = fixed[fgVar];
    const bg = fixed[bgVar] || fixed['--color-bg'];
    if (!fg || !bg) continue;

    const ratio = getContrastRatio(fg, bg);
    if (ratio >= targetRatio) continue;

    // Try primary target ratio within beauty-safe range
    let adjusted = adjustLightnessForContrast(fg, bg, targetRatio);
    let appliedRatio = targetRatio;
    let fallbackNote = '';

    if (!adjusted && targetRatio > aaRatio) {
      // Fallback to AA level
      adjusted = adjustLightnessForContrast(fg, bg, aaRatio);
      appliedRatio = aaRatio;
      fallbackNote = `（AAA 无法在美感范围内达成，降级为 AA）`;
    }

    if (adjusted) {
      fixed[fgVar] = adjusted;
      const rgbKey = `${fgVar}-rgb`;
      const channels = hexToRgbChannels(adjusted);
      if (channels && fixed[rgbKey]) fixed[rgbKey] = channels;

      changes.push({
        var: fgVar,
        original: fg,
        fixed: adjusted,
        pair: pairName,
        reason: `${pairName} 对比度 ${ratio.toFixed(2)}:1 → ${appliedRatio}:1${fallbackNote}`,
      });
    } else {
      // Generate *-contrasted derivative variable, keep original intact
      const contrastedKey = `${fgVar}-contrasted`;
      // Respect existing -contrasted var if it already meets the target
      const existingContrasted = fixed[contrastedKey];
      if (existingContrasted && getContrastRatio(existingContrasted, bg) >= targetRatio) {
        changes.push({
          var: contrastedKey,
          original: fg,
          fixed: existingContrasted,
          pair: pairName,
          reason: `${pairName} 对比度 ${ratio.toFixed(2)}:1 — ${contrastedKey} 已存在且合规`,
        });
      } else {
        const maxAdjusted = adjustLightnessForContrast(fg, bg, aaRatio);
        if (maxAdjusted) {
          fixed[contrastedKey] = maxAdjusted;
          changes.push({
            var: contrastedKey,
            original: fg,
            fixed: maxAdjusted,
            pair: pairName,
            reason: `${pairName} 对比度 ${ratio.toFixed(2)}:1 — 原色已保留，生成 ${contrastedKey} 衍生变量`,
          });
        }
      }
    }
  }

  return { fixed, changes };
}
