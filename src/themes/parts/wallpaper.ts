import type { ThemePart, ThemePartOptions } from '../types';

interface WallpaperOptions extends ThemePartOptions {
  /** Relative URL path or absolute URL */
  src: string;
  /** CSS blend mode — "none" hides the overlay */
  blend: 'none' | 'overlay' | 'multiply' | 'screen';
  opacity: number; // 0-1
}

export const wallpaper: ThemePart<WallpaperOptions> = {
  id: 'wallpaper',
  name: 'Wallpaper',
  description: 'Background image with blend/opacity control.',
  defaults: {
    src: '',
    blend: 'none',
    opacity: 0,
  },
  generate(opts) {
    const src = opts.src ?? this.defaults.src;
    const blend = opts.blend ?? this.defaults.blend;
    const opacity = opts.opacity ?? this.defaults.opacity;

    if (!src || blend === 'none' || opacity === 0) {
      return { cssVars: {} };
    }

    return {
      cssVars: {
        '--wallpaper-url': `url(${src})`,
        '--wallpaper-blend': blend,
        '--wallpaper-opacity': String(opacity),
      },
    };
  },
};
