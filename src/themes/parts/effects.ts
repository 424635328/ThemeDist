import type { ThemePart, ThemePartOptions } from '../types';

interface EffectsOptions extends ThemePartOptions {
  shadowStrength: 'none' | 'subtle' | 'medium' | 'strong';
  glass: boolean; // frosted-glass surfaces
  noise: boolean; // subtle grain texture
}

export const effects: ThemePart<EffectsOptions> = {
  id: 'effects',
  name: 'Visual Effects',
  description: 'Shadows, glass-morphism, and grain overlays.',
  defaults: {
    shadowStrength: 'subtle',
    glass: false,
    noise: false,
  },
  generate(opts) {
    const vars: Record<string, string> = {};

    const shadow = opts.shadowStrength ?? this.defaults.shadowStrength;
    switch (shadow) {
      case 'none':
        vars['--shadow-sm'] = 'none';
        vars['--shadow-md'] = 'none';
        vars['--shadow-lg'] = 'none';
        break;
      case 'subtle':
        vars['--shadow-sm'] = '0 1px 2px rgba(0,0,0,0.06)';
        vars['--shadow-md'] = '0 4px 6px rgba(0,0,0,0.07)';
        vars['--shadow-lg'] = '0 10px 25px rgba(0,0,0,0.1)';
        break;
      case 'medium':
        vars['--shadow-sm'] = '0 1px 3px rgba(0,0,0,0.12)';
        vars['--shadow-md'] = '0 6px 12px rgba(0,0,0,0.12)';
        vars['--shadow-lg'] = '0 14px 30px rgba(0,0,0,0.14)';
        break;
      case 'strong':
        vars['--shadow-sm'] = '0 2px 4px rgba(0,0,0,0.2)';
        vars['--shadow-md'] = '0 8px 16px rgba(0,0,0,0.2)';
        vars['--shadow-lg'] = '0 16px 40px rgba(0,0,0,0.24)';
        break;
    }

    const glass = opts.glass ?? this.defaults.glass;
    vars['--glass-bg'] = glass
      ? 'rgba(255,255,255,0.12)'
      : 'var(--color-surface)';
    vars['--glass-blur'] = glass ? 'blur(12px)' : 'none';

    const noise = opts.noise ?? this.defaults.noise;
    vars['--noise-opacity'] = noise ? '0.03' : '0';

    return { cssVars: vars };
  },
};
