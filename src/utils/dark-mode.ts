import { hexToHsl, hslToHex, hexToRgb, hexToRgbChannels } from './color';
import type { ComposedTheme } from '../themes/types';
import { enrichCssVars } from './omni-bridge';

/**
 * Derive a high-quality dark variant from a light theme.
 * Uses non-linear desaturation and rich dark gray backgrounds
 * to avoid retinal fatigue and preserve design intent.
 */
export function deriveDarkVariant(theme: ComposedTheme): ComposedTheme {
  const vars = { ...theme.cssVars };

  // 1. Rich dark background: derive from original bg hue with low L and low S
  const origBg = vars['--color-bg'] || '#ffffff';
  const origBgHsl = hexToHsl(origBg);
  if (origBgHsl.l > 0.3) {
    // Based on original hue, generate a rich dark gray (L=0.05, S capped at 12%)
    vars['--color-bg'] = hslToHex(origBgHsl.h, Math.min(0.12, origBgHsl.s * 0.5), 0.05);
  }
  const bgHsl = hexToHsl(vars['--color-bg']);

  // 2. Surface: slightly lighter than bg
  vars['--color-surface'] = hslToHex(bgHsl.h, bgHsl.s, bgHsl.l + 0.06);

  // 3. Text: very slightly tinted near-white
  vars['--color-text'] = hslToHex(bgHsl.h, Math.min(0.05, bgHsl.s), 0.94);
  vars['--color-text-muted'] = hslToHex(bgHsl.h, Math.min(0.08, bgHsl.s), 0.68);

  // 4. Accent colors: non-linear desaturation (15%) + L clamped to dark-safe range
  for (const key of ['--color-primary', '--color-secondary', '--color-accent']) {
    const hex = vars[key];
    if (!hex || !hex.startsWith('#')) continue;
    const { h, s, l } = hexToHsl(hex);
    vars[key] = hslToHex(h, s * 0.85, Math.max(0.52, Math.min(0.72, l)));
  }

  // 5. Border: derived from adjusted primary with alpha
  const primaryRgb = hexToRgb(vars['--color-primary'] || '#6366f1');
  vars['--color-border'] = `rgba(${primaryRgb[0]}, ${primaryRgb[1]}, ${primaryRgb[2]}, 0.22)`;

  // 6. Ambient colors
  vars['--ambient-1'] = `rgba(${primaryRgb[0]}, ${primaryRgb[1]}, ${primaryRgb[2]}, 0.18)`;
  const secRgb = hexToRgb(vars['--color-secondary'] || vars['--color-primary'] || '#6366f1');
  vars['--ambient-2'] = `rgba(${secRgb[0]}, ${secRgb[1]}, ${secRgb[2]}, 0.12)`;

  // 7. Refresh RGB channels
  refreshRgbChannels(vars);

  return {
    ...theme,
    preset: theme.preset + '-dark',
    presetName: theme.presetName + ' (Dark)',
    cssVars: enrichCssVars(vars),
    tags: [...(theme.tags || []).filter(t => t !== 'light'), 'dark'],
  };
}

/**
 * Derive a high-quality light variant from a dark theme.
 * Adjusts accent colors for readability on light backgrounds.
 */
export function deriveLightVariant(theme: ComposedTheme): ComposedTheme {
  const vars = { ...theme.cssVars };

  // 1. Clean light background: derive from original bg hue
  const origBg = vars['--color-bg'] || '#000000';
  const origBgHsl = hexToHsl(origBg);
  if (origBgHsl.l < 0.7) {
    vars['--color-bg'] = hslToHex(origBgHsl.h, Math.min(0.04, origBgHsl.s * 0.3), 0.97);
  }
  const bgHsl = hexToHsl(vars['--color-bg']);

  // 2. Surface: slightly darker than bg for depth
  vars['--color-surface'] = hslToHex(bgHsl.h, bgHsl.s, bgHsl.l - 0.04);

  // 3. Text: deep ink with subtle hue tint
  vars['--color-text'] = hslToHex(bgHsl.h, Math.min(0.12, bgHsl.s), 0.12);
  vars['--color-text-muted'] = hslToHex(bgHsl.h, Math.min(0.10, bgHsl.s), 0.44);

  // 4. Accent colors: keep saturation, adjust L for light-bg readability
  for (const key of ['--color-primary', '--color-secondary', '--color-accent']) {
    const hex = vars[key];
    if (!hex || !hex.startsWith('#')) continue;
    const { h, s, l } = hexToHsl(hex);
    vars[key] = hslToHex(h, s, Math.max(0.38, Math.min(0.55, l)));
  }

  // 5. Border
  const primaryRgb = hexToRgb(vars['--color-primary'] || '#6366f1');
  vars['--color-border'] = `rgba(${primaryRgb[0]}, ${primaryRgb[1]}, ${primaryRgb[2]}, 0.14)`;

  // 6. Ambient
  vars['--ambient-1'] = `rgba(${primaryRgb[0]}, ${primaryRgb[1]}, ${primaryRgb[2]}, 0.08)`;
  const secRgb = hexToRgb(vars['--color-secondary'] || vars['--color-primary'] || '#6366f1');
  vars['--ambient-2'] = `rgba(${secRgb[0]}, ${secRgb[1]}, ${secRgb[2]}, 0.05)`;

  // 7. Refresh RGB channels
  refreshRgbChannels(vars);

  return {
    ...theme,
    preset: theme.preset + '-light',
    presetName: theme.presetName + ' (Light)',
    cssVars: enrichCssVars(vars),
    tags: [...(theme.tags || []).filter(t => t !== 'dark'), 'light'],
  };
}

/** Refresh --color-*-rgb channel variables from their hex values. */
function refreshRgbChannels(vars: Record<string, string>): void {
  for (const key of Object.keys(vars)) {
    if (key.startsWith('--color-') && !key.endsWith('-rgb') && !key.startsWith('--color-gradient')) {
      const val = vars[key];
      if (val && val.startsWith('#')) {
        vars[`${key}-rgb`] = hexToRgbChannels(val);
      }
    }
  }
}
