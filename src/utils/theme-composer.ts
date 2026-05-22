import type { ComposedTheme, ThemePreset } from '../themes/types';
import { getPart, type PartId } from '../themes/registry';

/** Compose a preset into a complete theme with all CSS variables and metadata */
export function composeTheme(preset: ThemePreset): ComposedTheme {
  const cssVars: Record<string, string> = {};
  let wallpaper: string | undefined;

  for (const [partId, options] of Object.entries(preset.parts)) {
    const part = getPart(partId as PartId);
    const merged = { ...part.defaults, ...options };
    const output = part.generate(merged);

    Object.assign(cssVars, output.cssVars);

    // Extract wallpaper URL if this part produced one
    if (output.cssVars['--wallpaper-url']) {
      wallpaper = output.cssVars['--wallpaper-url']
        .replace(/^url\(/, '')
        .replace(/\)$/, '')
        .replace(/^["']|["']$/g, '');
    }
  }

  return {
    preset: preset.id,
    presetName: preset.name,
    cssVars,
    wallpaper,
  };
}
