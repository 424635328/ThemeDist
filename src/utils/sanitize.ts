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

const SUPPORTED_EXT_TYPES = ['floating', 'decorative'];

/**
 * Check raw extensions for unsupported types and return human-readable warnings.
 * Called BEFORE validateUserExtensions so warnings reflect what will be dropped.
 */
export function collectExtensionWarnings(raw: any): string[] {
  if (!Array.isArray(raw)) return [];
  const warnings: string[] = [];
  const seenTypes = new Set<string>();
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const t = item.type;
    if (t && !SUPPORTED_EXT_TYPES.includes(t) && !seenTypes.has(t)) {
      seenTypes.add(t);
      warnings.push(`不支持的类型 "${t}"，已自动移除。请改用 ${SUPPORTED_EXT_TYPES.map(x => `"${x}"`).join(' 或 ')}。`);
    }
  }
  if (warnings.length > 0) {
    warnings.push('提示：如需注入 HTML 结构（如粒子层、叠层），请使用 "decorative" 类型，将 HTML 写入 html 字段。');
  }
  return warnings;
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
        { const dim = sanitizeCssDimension(val); if (dim) (ext as Record<string, string>)[key] = dim; break; }
      case 'font-size': case 'fontsize':
        { const dim = sanitizeCssDimension(val); if (dim) ext.fontSize = dim; break; }
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

// ─── Decorative HTML allowlist ───
// Tags not in this set are stripped entirely.
const ALLOWED_TAGS = new Set([
  // structural
  'div', 'span', 'p', 'a', 'br', 'hr', 'wbr',
  'section', 'article', 'header', 'footer', 'nav', 'main', 'aside',
  'figure', 'figcaption', 'details', 'summary',
  // headings & text
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'ul', 'ol', 'li', 'dl', 'dt', 'dd',
  'strong', 'em', 'b', 'i', 'u', 's', 'small', 'mark', 'del', 'ins',
  'code', 'pre', 'kbd', 'samp', 'var',
  'blockquote', 'q', 'cite', 'abbr', 'sub', 'sup', 'time',
  // table
  'table', 'thead', 'tbody', 'tfoot', 'tr', 'td', 'th', 'caption', 'colgroup', 'col',
  // media / visual
  'img', 'picture', 'svg', 'path', 'circle', 'rect', 'ellipse', 'line',
  'polyline', 'polygon', 'g', 'defs', 'linearGradient', 'radialGradient',
  'stop', 'filter', 'feDropShadow', 'feGaussianBlur', 'feColorMatrix',
  'feBlend', 'feMerge', 'feMergeNode', 'feOffset', 'feFlood', 'feComposite',
  'pattern', 'use', 'clipPath', 'mask', 'text', 'tspan', 'title', 'desc',
  'symbol', 'view', 'foreignObject',
  // style (CSS content sanitized separately)
  'style',
]);

// Tags that MUST be stripped — no legitimate decorative use.
const DANGEROUS_TAGS_RE = /<\/?(script|iframe|object|embed|applet|frame|frameset|form|input|button|select|textarea|option|optgroup|label|fieldset|legend|meta|base|link|audio|video|source|track|canvas)\b[^>]*\/?>/gi;

// Strip dangerous tags AND their inner content (prevents text-node JS leakage)
const DANGEROUS_TAGS_CONTENT_RE = /<(script|iframe|object|embed|applet|frame|frameset|form|input|button|select|textarea|option|optgroup|label|fieldset|legend|meta|base|link|audio|video|source|track|canvas)\b[^>]*>[\s\S]*?<\/\1\s*>/gi;

// JS execution patterns — extensions containing these are rejected outright
const JS_EXEC_PATTERNS = [
  /\bwindow\s*\.\s*_\w+\s*=/i,       // window._hsState = ...
  /\bwindow\s*\[\s*["'][\w-]+["']\s*\]/i,
  /\bdocument\s*\.\s*getElementById\b/i,
  /\bdocument\s*\.\s*querySelector\b/i,
  /\bdocument\s*\.\s*createElement\b/i,
  /\brequestAnimationFrame\b/i,
  /\bsetInterval\b/i,
  /\bsetTimeout\b.*\bfunction\b/i,
  /\beval\s*\(/i,
  /\bcanvas\s*\.\s*getContext\b/i,
  /\bnew\s+Worker\s*\(/i,
  /\blocalStorage\b/i,
  /\bsessionStorage\b/i,
  /\bfetch\s*\(/i,
  /\bXMLHttpRequest\b/i,
  /\bnavigator\s*\./i,
  /\.innerHTML\s*=/i,
  /\.outerHTML\s*=/i,
];

// Allowed attributes (prefix-based) — everything else stripped.
const ALLOWED_ATTR_PREFIXES = [
  'class', 'id', 'style',
  'src', 'alt', 'width', 'height', 'loading',
  'href', 'target', 'rel', 'title',
  'type', 'media',
  'viewBox', 'fill', 'stroke', 'stroke-width', 'stroke-linecap', 'stroke-linejoin',
  'd', 'cx', 'cy', 'r', 'rx', 'ry', 'x', 'y', 'x1', 'x2', 'y1', 'y2',
  'points', 'transform', 'opacity',
  'cx', 'cy', 'fx', 'fy', 'gradientUnits', 'gradientTransform', 'spreadMethod',
  'offset', 'stop-color', 'stop-opacity',
  'filterUnits', 'stdDeviation', 'in', 'in2', 'result', 'mode', 'values',
  'patternUnits', 'patternTransform', 'patternContentUnits',
  'clip-path', 'clip-rule', 'fill-rule', 'stroke-dasharray', 'stroke-dashoffset',
  'stroke-linejoin', 'stroke-miterlimit', 'stroke-opacity',
  'font-family', 'font-size', 'font-weight', 'text-anchor', 'dominant-baseline',
  'dx', 'dy', 'rotate', 'textLength', 'lengthAdjust',
  'xmlns',
  'aria-hidden', 'role', 'data-',
];

const ALLOWED_ATTR_RE = new RegExp(
  '^(?:' + ALLOWED_ATTR_PREFIXES.map(p => p.endsWith('-') ? p.slice(0, -1) + '(?:-[a-zA-Z][\\w-]*)?' : p).join('|') + ')$'
);

function sanitizeAttributes(tagContent: string): string {
  // Strip on* event handlers
  let cleaned = tagContent.replace(/\s+on\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]*)/gi, '');
  // Strip javascript: protocol from attribute values
  cleaned = cleaned.replace(/=\s*["'][^"']*javascript\s*:[^"']*["']/gi, '="banned:"');
  return cleaned;
}

function sanitizeDecorativeHtml(html: string): string {
  // 0. Reject outright if JS execution patterns detected
  for (const pattern of JS_EXEC_PATTERNS) {
    if (pattern.test(html)) return '';
  }

  // 1. Strip dangerous tags AND their inner content (prevents text-node JS leakage)
  let cleaned = html;
  let prev = '';
  while (prev !== cleaned) {
    prev = cleaned;
    cleaned = cleaned.replace(DANGEROUS_TAGS_CONTENT_RE, '');
  }
  // Also strip any self-closing dangerous tags
  cleaned = cleaned.replace(DANGEROUS_TAGS_RE, '');

  // 2. Sanitize <style> blocks — extract CSS, run through sanitizeCustomCss, re-wrap
  cleaned = cleaned.replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gi, (_m: string, css: string) => {
    const safeCss = sanitizeCustomCss(css);
    return safeCss ? `<style>${safeCss}</style>` : '';
  });

  // 3. Strip event handlers and javascript: protocol from all remaining tags
  cleaned = cleaned.replace(/<(\/?)(\w+)([^>]*)>/g, (_m: string, slash: string, tag: string, attrs: string) => {
    // Strip non-allowed tags
    if (!ALLOWED_TAGS.has(tag.toLowerCase())) return '';
    const cleanAttrs = sanitizeAttributes(attrs);
    return `<${slash}${tag}${cleanAttrs}>`;
  });

  // 4. Pass-through strip of any remaining javascript: URIs in the text
  cleaned = cleaned.replace(/javascript\s*:/gi, '');

  return cleaned;
}

// ─── Query parameter override parsing ───

const OVERRIDE_KEY_RE = /^--[a-zA-Z0-9_-]+$/;

// ─── Output pipeline sanitization (for Redis-loaded community themes) ───

/**
 * Sanitize extensions array at output time. Re-runs decorative HTML
 * through sanitizeDecorativeHtml to catch any JS that may have been
 * stored before sanitization rules were tightened.
 * Returns undefined if the result is empty after filtering.
 */
export function sanitizeExtensionsOutput(exts: any[] | null | undefined): any[] | undefined {
  if (!Array.isArray(exts) || exts.length === 0) return undefined;
  const cleaned: any[] = [];
  for (const ext of exts) {
    if (!ext || typeof ext !== 'object') continue;
    if (ext.type === 'decorative' && ext.html) {
      const html = sanitizeDecorativeHtml(String(ext.html));
      if (!html) continue; // drop entirely if sanitization rejected it
      cleaned.push({ ...ext, html });
    } else if (ext.type === 'floating') {
      cleaned.push(ext);
    }
    // drop unsupported types silently
  }
  return cleaned.length > 0 ? cleaned : undefined;
}

/**
 * Validate and sanitize a single override key-value pair.
 * Returns null if the key is invalid or value contains dangerous patterns.
 */
export function sanitizeOverridePair(key: string, value: string): { k: string; v: string } | null {
  if (!OVERRIDE_KEY_RE.test(key)) return null;

  const cleanVal = String(value)
    .slice(0, 256)
    .replace(/[;{}]/g, '')
    .replace(/url\s*\(\s*["']?\s*(?:https?|ftp|data):[^)]*\)?/gi, '')
    .replace(/expression\s*\(/gi, '')
    .replace(/javascript\s*:/gi, '')
    .replace(/@import\b/gi, '')
    .replace(/\)/g, '')  // stray ) from stripped url()
    .trim();

  if (!cleanVal) return null;
  return { k: key, v: cleanVal };
}

/**
 * Parse ?overrides= query string and merge into cssVars.
 * Format: --key1:val1;--key2:val2
 * Max 20 overrides for abuse prevention.
 */
export function applyOverrides(cssVars: Record<string, string>, overridesQuery: string | null): Record<string, string> {
  if (!overridesQuery) return cssVars;
  const result = { ...cssVars };

  const pairs = overridesQuery.split(';').slice(0, 20);
  for (const pair of pairs) {
    const colonIdx = pair.indexOf(':');
    if (colonIdx <= 0) continue;
    const rawKey = pair.slice(0, colonIdx).trim();
    const rawVal = pair.slice(colonIdx + 1).trim();
    if (!rawKey || !rawVal) continue;
    const sanitized = sanitizeOverridePair(rawKey.startsWith('--') ? rawKey : `--${rawKey}`, rawVal);
    if (sanitized) {
      result[sanitized.k] = sanitized.v;
    }
  }

  return result;
}
