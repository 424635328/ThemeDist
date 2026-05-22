/** Output of any ThemePart.generate() */
export interface ThemePartOutput {
  /** CSS custom properties to inject */
  cssVars: Record<string, string>;
}

/** Options that any theme part can receive */
export type ThemePartOptions = Record<string, unknown>;

/** A pluggable theme part */
export interface ThemePart<T extends ThemePartOptions = ThemePartOptions> {
  id: string;
  name: string;
  description: string;
  /** Default values for optional keys */
  defaults: Partial<T>;
  generate(options: T): ThemePartOutput;
}

/** A preset bundles part configs */
export interface ThemePreset {
  id: string;
  name: string;
  description: string;
  /** Part ID → options. Omitted parts fall back to defaults. */
  parts: Record<string, ThemePartOptions>;
}

export interface ThemeExtension {
  type: 'html';
  content: string;
}

/** Full composed theme */
export interface ComposedTheme {
  preset: string;
  presetName: string;
  cssVars: Record<string, string>;
  /** Present only if the wallpaper part is active */
  wallpaper?: string;
  /** Theme-specific custom CSS injected into the page */
  customCss?: string;
  /** Theme-specific decorative HTML extensions */
  extensions?: ThemeExtension[];
  /** Logo text for gradient display */
  logoText?: string;
  /** Logo gradient colors */
  logoColors?: string[];
}
