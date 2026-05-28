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

/** Declarative Web Audio synthesis parameters for sound micro-interactions. */
export interface WebAudioSynthParams {
  waveform: 'sine' | 'square' | 'sawtooth' | 'triangle';
  frequency: number;  // Hz (20-20000)
  duration: number;   // ms (50-5000)
  volume: number;     // 0-1
  attack: number;     // ms envelope attack
  release: number;    // ms envelope release
  filter?: { type: 'lowpass' | 'highpass'; cutoff: number };
}

/** Sound micro-interaction extension — synthesized via Web Audio API. */
export interface SoundExtension {
  type: 'sound';
  trigger: 'click' | 'hover' | 'ambient';
  synth: WebAudioSynthParams;
}

/** Any extension — floating, decorative, or sound. */
export type AnyExtension = ThemeExtension | DecorativeExtension | SoundExtension;

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

/** A single element spawned by the click-effect engine on each click. */
export interface ClickSpawnDef {
  className: string;
  style?: string;
  count?: number;
  angleDeg?: number;
  angleSpread?: number;
  offsetX?: number;
  offsetY?: number;
  duration: number;
}

/** Declarative click-effect config. Themes define what to spawn; the Layout.astro engine executes it. */
export interface ClickEffectConfig {
  spawn: ClickSpawnDef[];
}

/** The single theme data model — all themes flow through this shape.
 *  OmniConfig entries, community themes, and fallback themes all conform. */
export interface ComposedTheme {
  preset: string;
  presetName: string;
  cssVars: Record<string, string>;
  customCss?: string;
  extensions?: AnyExtension[];
  clickEffect?: ClickEffectConfig;
  logoText?: string;
  logoColors?: string[];
  tags?: ThemeTag[];
}
