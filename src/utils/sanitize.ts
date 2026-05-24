import type { AnyExtension, DecorativeExtension, ThemeExtension } from '../themes/types';

/** Max extensions per theme */
const MAX_EXTENSIONS = 20;

// ─── CSS value blacklist patterns ───
const DANGEROUS_CSS = [
  /\burl\s*\(\s*["']?\s*(?:https?|ftp|data):/gi,
  /@import\b/gi,
  /expression\s*\(/gi,
  /javascript\s*:/gi,
  /behavior\s*:/gi,
  /-moz-binding\b/gi,
  /\\0[0-9a-f]/gi,       // null-byte obfuscation
  /\\x[0-9a-f]{2}/gi,    // hex escape obfuscation
];

// ─── Valid CSS dimension value pattern ───
const VALID_CSS_DIM = /^-?[\d.]+(?:%|px|em|rem|vh|vw|vmin|vmax|ch|ex|cm|mm|in|pt|pc|s|ms)?$/i;

/** Strip HTML tags and event handlers from user-submitted text. */
export function sanitizeText(input: string): string {
  if (!input) return '';
  return String(input)
    .replace(/<[^>]*>/g, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/javascript\s*:/gi, '')
    .trim();
}

/** Sanitize custom CSS — strip injections while preserving valid CSS. */
export function sanitizeCustomCss(input: string | null | undefined): string | null {
  if (!input) return null;
  let css = String(input)
    .replace(/<\/style[\s\S]*?>/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/javascript\s*:/gi, '')
    .replace(/expression\s*\(/gi, '')
    .replace(/@import\b/gi, '')
    .replace(/behavior\s*:/gi, '')
    .replace(/-moz-binding\b/gi, '')
    .replace(/\burl\s*\(\s*["']?\s*(?:https?|ftp|data):/gi, 'url(banned:')
    .trim();

  if (css.length > 16384) css = css.slice(0, 16384);
  return css || null;
}

/**
 * Sanitize a single CSS property value. Strips dangerous constructs.
 * Used for extension fields like top/left/fontSize/animation.
 */
export function sanitizeCssValue(val: string): string {
  if (!val) return '';
  let cleaned = String(val).slice(0, 128);
  for (const pattern of DANGEROUS_CSS) {
    cleaned = cleaned.replace(pattern, '');
  }
  cleaned = cleaned.replace(/[;{}]/g, ''); // strip CSS block delimiters
  return cleaned.trim();
}

/**
 * Validate a CSS dimension value (e.g. "10px", "50%", "2em").
 * Returns the value if valid, empty string otherwise.
 */
export function sanitizeCssDimension(val: string): string {
  if (!val) return '';
  const cleaned = sanitizeCssValue(val);
  if (!VALID_CSS_DIM.test(cleaned)) return '';
  return cleaned;
}

/** Strip non-printable characters, limited to 4 Unicode code points. */
export function sanitizeChar(input: string): string {
  if (!input) return '';
  const cleaned = String(input)
    .replace(/[\x00-\x1f\x7f-\x9f]/g, '') // strip control chars
    .replace(/<[^>]*>/g, '')                 // strip HTML tags
    .trim();
  // Take up to 4 code points (handles multi-byte emoji correctly)
  return [...cleaned].slice(0, 4).join('');
}

/**
 * Validate user-submitted extensions. Allows 'floating' (safe) and 'decorative' (sanitized HTML).
 * Sanitizes all CSS values and HTML to prevent injection.
 */
export function validateUserExtensions(raw: any): AnyExtension[] | undefined {
  if (!Array.isArray(raw) || raw.length === 0) return undefined;
  if (raw.length > MAX_EXTENSIONS) raw = raw.slice(0, MAX_EXTENSIONS);

  const cleaned: AnyExtension[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;

    if (item.type === 'floating') {
      if (!item.char || typeof item.char !== 'string') continue;

      const char = sanitizeChar(item.char);
      if (!char) continue;

      const ext: ThemeExtension = { type: 'floating', char };

      if (item.top && typeof item.top === 'string') {
        const v = sanitizeCssDimension(item.top); if (v) ext.top = v;
      }
      if (item.left && typeof item.left === 'string') {
        const v = sanitizeCssDimension(item.left); if (v) ext.left = v;
      }
      if (item.right && typeof item.right === 'string') {
        const v = sanitizeCssDimension(item.right); if (v) ext.right = v;
      }
      if (item.bottom && typeof item.bottom === 'string') {
        const v = sanitizeCssDimension(item.bottom); if (v) ext.bottom = v;
      }
      if (item.fontSize && typeof item.fontSize === 'string') {
        const v = sanitizeCssDimension(item.fontSize); if (v) ext.fontSize = v;
      }
      if (typeof item.opacity === 'number') {
        ext.opacity = Math.max(0, Math.min(1, item.opacity));
      }
      if (item.animation && typeof item.animation === 'string') {
        const v = sanitizeCssValue(item.animation); if (v) ext.animation = v;
      }
      if (typeof item.zIndex === 'number') {
        ext.zIndex = Math.max(-1, Math.min(99999, Math.floor(item.zIndex)));
      }

      cleaned.push(ext);

    } else if (item.type === 'decorative' && item.html && typeof item.html === 'string') {
      const html = sanitizeDecorativeHtml(item.html);
      if (html) {
        cleaned.push({ type: 'decorative', html });
      }
    }
  }
  return cleaned.length > 0 ? cleaned : undefined;
}

// ─── Legacy converters (for index_config.js) ───

export function parseLegacyExtension(raw: { type: string; content: string }): AnyExtension | null {
  if (raw.type !== 'html' || !raw.content) return null;

  const html = raw.content.trim();

  const withoutStyle = html.replace(/<style[\s\S]*?<\/style>/gi, '').trim();
  if (!withoutStyle) return null;

  const floating = tryParseFloating(withoutStyle);
  if (floating) return floating;

  const deco: DecorativeExtension = {
    type: 'decorative',
    html: sanitizeDecorativeHtml(withoutStyle),
  };
  return deco;
}

function tryParseFloating(html: string): ThemeExtension | null {
  const m = html.match(/^<div\s+style\s*=\s*"([^"]*)"\s*>([^<]*)<\/div>$/i);
  if (!m) return null;

  const styleStr = m[1];
  const char = sanitizeChar(m[2]);
  if (!char) return null;

  const ext: ThemeExtension = { type: 'floating', char };

  for (const prop of styleStr.split(';')) {
    const [k, ...vParts] = prop.split(':');
    if (!k || vParts.length === 0) continue;
    const key = k.trim().toLowerCase();
    const val = vParts.join(':').trim();

    switch (key) {
      case 'top': case 'left': case 'right': case 'bottom':
      case 'font-size': case 'fontsize': {
        const dim = sanitizeCssDimension(val);
        if (dim) (ext as Record<string, string>)[key === 'fontsize' ? 'fontSize' : key] = dim;
        break;
      }
      case 'opacity':
        ext.opacity = Math.max(0, Math.min(1, parseFloat(val) || 0));
        break;
      case 'animation': {
        const anim = sanitizeCssValue(val);
        if (anim) ext.animation = anim;
        break;
      }
      case 'z-index':
        ext.zIndex = Math.max(-1, Math.min(99999, parseInt(val, 10) || 0));
        break;
    }
  }

  return ext;
}

function sanitizeDecorativeHtml(html: string): string {
  return html
    .replace(/\s+on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/javascript\s*:/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, '');
}
