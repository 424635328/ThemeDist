/** Simple floating emoji — rendered via document.createElement */
export interface ThemeExtension {
  type: 'floating';
  char: string;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  fontSize?: string;
  opacity?: number;
  animation?: string;
  zIndex?: number;
}

/** Pre-vetted decorative HTML from trusted server config (index_config.js).
 *  Rendered via safe DocumentFragment parsing — never innerHTML. */
export interface DecorativeExtension {
  type: 'decorative';
  html: string;
}

/** Any extension — floating (safe) or decorative (trusted-only). */
export type AnyExtension = ThemeExtension | DecorativeExtension;

/** Theme tags for classification */
export type ThemeTag =
  | 'dark'
  | 'light'
  | 'holiday'
  | 'minimal'
  | 'vibrant'
  | 'nature'
  | 'tech'
  | 'retro'
  | 'warm'
  | 'cool'
  | 'community'
  | 'space'
  | 'ocean'
  | 'animated'
  | 'elegant'
  | 'glass'
  | 'seasonal'
  | 'fantasy'
  | 'industrial';

/** The single theme data model — all themes flow through this shape.
 *  OmniConfig entries, community themes, and fallback themes all conform. */
export interface ComposedTheme {
  preset: string;
  presetName: string;
  cssVars: Record<string, string>;
  customCss?: string;
  extensions?: AnyExtension[];
  logoText?: string;
  logoColors?: string[];
  tags?: ThemeTag[];
}
