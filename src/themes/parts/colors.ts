import type { ThemePart, ThemePartOptions } from '../types';

interface ColorsOptions extends ThemePartOptions {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textMuted: string;
  border: string;
}

export const colors: ThemePart<ColorsOptions> = {
  id: 'colors',
  name: 'Color Palette',
  description: 'Core color scheme: surfaces, text, borders.',
  defaults: {
    primary: '#4f46e5',
    secondary: '#7c3aed',
    accent: '#f59e0b',
    background: '#ffffff',
    surface: '#f9fafb',
    text: '#111827',
    textMuted: '#6b7280',
    border: '#e5e7eb',
  },
  generate(opts) {
    return {
      cssVars: {
        '--color-primary': opts.primary ?? this.defaults.primary,
        '--color-secondary': opts.secondary ?? this.defaults.secondary,
        '--color-accent': opts.accent ?? this.defaults.accent,
        '--color-bg': opts.background ?? this.defaults.background,
        '--color-surface': opts.surface ?? this.defaults.surface,
        '--color-text': opts.text ?? this.defaults.text,
        '--color-text-muted': opts.textMuted ?? this.defaults.textMuted,
        '--color-border': opts.border ?? this.defaults.border,
      },
    };
  },
};
