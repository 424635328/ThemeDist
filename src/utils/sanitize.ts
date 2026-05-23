/** Strip HTML tags and event handlers from user-submitted text. */
export function sanitizeText(input: string): string {
  if (!input) return '';
  return String(input)
    .replace(/<[^>]*>/g, '')               // strip all HTML tags
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '') // strip inline event handlers
    .replace(/javascript\s*:/gi, '')        // strip javascript: protocol
    .trim();
}

/** Sanitize custom CSS — strip style-breaking injections while preserving valid CSS. */
export function sanitizeCustomCss(input: string | null | undefined): string | null {
  if (!input) return null;
  return String(input)
    .replace(/<\/style[\s\S]*?>/gi, '')     // strip </style> closing tag + anything after
    .replace(/<[^>]*>/g, '')                 // strip any remaining HTML tags
    .replace(/javascript\s*:/gi, '')         // strip javascript: protocol
    .replace(/expression\s*\(/gi, '')        // strip CSS expression()
    .trim() || null;
}
