import type { ThemePart, ThemePartOptions } from '../types';

interface TypographyOptions extends ThemePartOptions {
  headingFont: string;
  bodyFont: string;
  monoFont: string;
  baseSize: string; // base font-size clamp()
  scale: number; // modular scale ratio
}

export const typography: ThemePart<TypographyOptions> = {
  id: 'typography',
  name: 'Typography',
  description: 'Font stacks, base size, and type scale.',
  defaults: {
    headingFont: "'Inter', system-ui, sans-serif",
    bodyFont: "'Inter', system-ui, sans-serif",
    monoFont: "'JetBrains Mono', monospace",
    baseSize: 'clamp(1rem, 0.9rem + 0.5vw, 1.125rem)',
    scale: 1.25,
  },
  generate(opts) {
    const scale = opts.scale ?? this.defaults.scale;
    return {
      cssVars: {
        '--font-heading': opts.headingFont ?? this.defaults.headingFont,
        '--font-body': opts.bodyFont ?? this.defaults.bodyFont,
        '--font-mono': opts.monoFont ?? this.defaults.monoFont,
        '--text-base': opts.baseSize ?? this.defaults.baseSize,
        '--text-lg': `calc(var(--text-base) * ${scale})`,
        '--text-xl': `calc(var(--text-lg) * ${scale})`,
        '--text-2xl': `calc(var(--text-xl) * ${scale})`,
        '--text-sm': `calc(var(--text-base) / ${scale})`,
      },
    };
  },
};
