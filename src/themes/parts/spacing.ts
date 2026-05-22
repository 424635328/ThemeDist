import type { ThemePart, ThemePartOptions } from '../types';

interface SpacingOptions extends ThemePartOptions {
  unit: string; // base spacing unit
  radius: string;
  maxWidth: string;
}

export const spacing: ThemePart<SpacingOptions> = {
  id: 'spacing',
  name: 'Spacing & Shape',
  description: 'Spacing scale, border radius, and max content width.',
  defaults: {
    unit: '0.25rem',
    radius: '0.5rem',
    maxWidth: '72rem',
  },
  generate(opts) {
    const u = opts.unit ?? this.defaults.unit;
    return {
      cssVars: {
        '--space-unit': u,
        '--space-1': `calc(${u} * 1)`,
        '--space-2': `calc(${u} * 2)`,
        '--space-3': `calc(${u} * 3)`,
        '--space-4': `calc(${u} * 4)`,
        '--space-6': `calc(${u} * 6)`,
        '--space-8': `calc(${u} * 8)`,
        '--space-12': `calc(${u} * 12)`,
        '--radii': opts.radius ?? this.defaults.radius,
        '--content-max': opts.maxWidth ?? this.defaults.maxWidth,
      },
    };
  },
};
