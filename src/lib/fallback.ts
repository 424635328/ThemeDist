import type { ComposedTheme } from '../themes/types';
import { STRUCTURAL_CSS_VARS } from './css-vars-defaults';

export const FALLBACK_THEME: ComposedTheme = {
  preset: 'fallback',
  presetName: 'Default',
  cssVars: {
    '--color-primary': '#6366f1',
    '--color-secondary': '#818cf8',
    '--color-accent': '#6366f1',
    '--color-bg': '#0f0f23',
    '--color-surface': '#1a1a2e',
    '--color-text': '#f4f4f5',
    '--color-text-muted': '#a1a1aa',
    '--color-border': 'rgba(99,102,241,0.18)',
    ...STRUCTURAL_CSS_VARS,
    '--ambient-1': 'rgba(99,102,241,0.15)',
    '--ambient-2': 'rgba(129,140,248,0.1)',
  },
};
