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
 * Supports hex (#RGB, #RRGGBB) and rgba/rgb formats.
 */
export function isLightColor(colorVal: string): boolean {
  const rgbStr = extractRgbChannels(colorVal);
  if (!rgbStr) return false;

  const [r, g, b] = rgbStr.split(',').map(Number);
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return luminance > 0.5;
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
