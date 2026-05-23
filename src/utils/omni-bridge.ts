import OmniConfig from '../api/index_config.js';
import type { ComposedTheme, ThemeExtension } from '../themes/types';
import { isReady, zrevrange, get } from '../lib/redis';

interface OmniThemeEntry {
  id: string;
  name: string;
  logo?: { text: string; colors: string[] };
  theme: {
    bgBase: string;
    textMain: string;
    textMuted: string;
    accentRgb: string;
    avatarGrad1: string;
    avatarGrad2: string;
    ambient1: string;
    ambient2: string;
    customCss?: string;
  };
  extensions?: ThemeExtension[];
  type?: string;
}

/** Convert an OmniConfig theme entry to our ComposedTheme format */
export function omniToComposed(entry: OmniThemeEntry): ComposedTheme {
  const t = entry.theme;
  const borderColor = hexFromRgb(t.accentRgb, 0.18);

  return {
    preset: entry.id,
    presetName: entry.name,
    customCss: t.customCss || undefined,
    extensions: entry.extensions,
    logoText: entry.logo?.text,
    logoColors: entry.logo?.colors,
    cssVars: {
      '--color-primary': t.avatarGrad1,
      '--color-secondary': t.avatarGrad2,
      '--color-accent': rgbToHex(t.accentRgb),
      '--color-bg': t.bgBase,
      '--color-surface': lightenDarken(t.bgBase, 0.06),
      '--color-text': t.textMain,
      '--color-text-muted': t.textMuted,
      '--color-border': borderColor,

      // Typography defaults (OmniConfig doesn't specify fonts)
      '--font-heading': "'Inter', system-ui, sans-serif",
      '--font-body': "'Inter', system-ui, sans-serif",
      '--font-mono': "'JetBrains Mono', monospace",
      '--text-base': 'clamp(1rem, 0.9rem + 0.5vw, 1.125rem)',
      '--text-lg': 'calc(var(--text-base) * 1.25)',
      '--text-xl': 'calc(var(--text-lg) * 1.25)',
      '--text-2xl': 'calc(var(--text-xl) * 1.25)',
      '--text-sm': 'calc(var(--text-base) / 1.25)',

      // Spacing defaults
      '--space-unit': '0.25rem',
      '--space-1': 'calc(0.25rem * 1)',
      '--space-2': 'calc(0.25rem * 2)',
      '--space-3': 'calc(0.25rem * 3)',
      '--space-4': 'calc(0.25rem * 4)',
      '--space-6': 'calc(0.25rem * 6)',
      '--space-8': 'calc(0.25rem * 8)',
      '--space-12': 'calc(0.25rem * 12)',
      '--radii': '0.75rem',
      '--content-max': '72rem',

      // Effects from OmniConfig ambient
      '--shadow-sm': '0 1px 2px rgba(0,0,0,0.08)',
      '--shadow-md': '0 4px 12px rgba(0,0,0,0.12)',
      '--shadow-lg': '0 12px 32px rgba(0,0,0,0.18)',
      '--glass-bg': 'color-mix(in srgb, var(--color-bg) 85%, transparent)',
      '--glass-blur': 'blur(16px)',
      '--noise-opacity': '0',

      // OmniConfig ambient colors
      '--ambient-1': t.ambient1,
      '--ambient-2': t.ambient2,
    },
  };
}

/** Get today's theme using OmniConfig's auto strategy (holidays → dailyPool) */
export function getOmniDailyTheme(): ComposedTheme {
  const raw = OmniConfig.getThemeConfig('auto');
  // The _mergeConfig returns a merged config; we need to figure out which preset was selected
  // For daily pool, infer from the day-of-year
  const today = new Date();
  const start = new Date(today.getFullYear(), 0, 0);
  const diff = today.getTime() - start.getTime() + (start.getTimezoneOffset() - today.getTimezoneOffset()) * 60 * 1000;
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));

  // Check if a holiday matched (holidays have date keys, dailyPool entries have id/name)
  // If a holiday matched, raw.theme will differ from default
  const isHoliday = raw.logo && raw.logo.text !== OmniConfig.default.logo.text;

  const dailyPool = OmniConfig.dailyPool as OmniThemeEntry[];
  const poolTheme = dailyPool[dayOfYear % dailyPool.length];

  if (isHoliday) {
    // Holiday override: use holiday config with all decorations
    return omniToComposed({
      id: `holiday-${dayOfYear}`,
      name: raw.logo?.text || 'Special Day',
      theme: raw.theme,
      logo: raw.logo,
      extensions: raw.extensions,
      type: 'holiday',
    });
  }

  return omniToComposed(poolTheme);
}

/** List all available themes for the store — dailyPool + all holidays + crazyThursday */
export function getAllOmniThemes(): ComposedTheme[] {
  const results: ComposedTheme[] = [];

  // 1. All dailyPool themes
  const dailyPool = OmniConfig.dailyPool as OmniThemeEntry[];
  for (const t of dailyPool) {
    results.push(omniToComposed(t));
  }

  // 2. All holiday themes (gregorian MM-DD + lunar LMM-DD)
  if (OmniConfig.holidays) {
    const holidays = OmniConfig.holidays as Record<string, OmniThemeEntry>;
    for (const [key, entry] of Object.entries(holidays)) {
      const composed = omniToComposed({
        id: `holiday-${key.toLowerCase()}`,
        name: entry.logo?.text || `Holiday ${key}`,
        logo: entry.logo,
        theme: entry.theme,
        extensions: entry.extensions,
        type: 'holiday',
      });
      composed.presetName = `${entry.logo?.text || 'Special Day'} (${key})`;
      results.push(composed);
    }
  }

  // 3. crazyThursday
  if (OmniConfig.crazyThursday) {
    const crazy = OmniConfig.crazyThursday as OmniThemeEntry;
    results.push(omniToComposed({
      id: 'crazy-thursday',
      name: crazy.logo?.text || 'Crazy Thursday',
      logo: crazy.logo,
      theme: crazy.theme,
      extensions: crazy.extensions,
      type: 'special',
    }));
  }

  return results;
}

// ── helpers ──

function rgbToHex(rgb: string): string {
  const parts = rgb.split(',').map(Number);
  if (parts.length !== 3) return '#888888';
  const hex = parts.map((n) => Math.max(0, Math.min(255, n)).toString(16).padStart(2, '0')).join('');
  return `#${hex}`;
}

function hexFromRgb(rgb: string, alpha: number): string {
  const parts = rgb.split(',').map(Number);
  if (parts.length !== 3) return `rgba(128,128,128,${alpha})`;
  return `rgba(${parts[0]},${parts[1]},${parts[2]},${alpha})`;
}

function lightenDarken(hex: string, amount: number): string {
  const c = hex.replace('#', '');
  if (c.length < 6) return hex;
  const r = Math.min(255, Math.max(0, parseInt(c.slice(0, 2), 16) + Math.round(amount * 255)));
  const g = Math.min(255, Math.max(0, parseInt(c.slice(2, 4), 16) + Math.round(amount * 255)));
  const b = Math.min(255, Math.max(0, parseInt(c.slice(4, 6), 16) + Math.round(amount * 255)));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/** Community theme from Redis, in ComposedTheme shape */
interface CommunityThemeRaw {
  id: string;
  name: string;
  author: string;
  createdAt: number;
  likes: number;
  cssVars: Record<string, string>;
  customCss: string | null;
}

function communityToComposed(ct: CommunityThemeRaw): ComposedTheme {
  return {
    preset: `community-${ct.id}`,
    presetName: ct.name,
    cssVars: ct.cssVars,
    customCss: ct.customCss || undefined,
  };
}

const COMMUNITY_NEWEST_KEY = 'td:themes:by_newest';

/**
 * Load community themes from Redis. Returns [] on any failure.
 * This is designed to never throw—DB outage must not break the site.
 */
export async function getCommunityThemes(limit: number = 50): Promise<ComposedTheme[]> {
  try {
    if (!isReady() || limit <= 0) return [];

    const ids = await zrevrange(COMMUNITY_NEWEST_KEY, 0, limit - 1) as string[];
    if (!ids || ids.length === 0) return [];

    const themes: ComposedTheme[] = [];
    for (const id of ids) {
      try {
        const ct = await get<CommunityThemeRaw>(`td:theme:${id}`);
        if (ct) {
          themes.push(communityToComposed(ct));
        }
      } catch { /* skip broken entries */ }
    }
    return themes;
  } catch {
    return [];
  }
}
