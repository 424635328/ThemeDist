import { Lunar } from 'lunar-javascript';
import OmniConfig from '../api/index_config.js';
import type { ComposedTheme, AnyExtension, ThemeTag } from '../themes/types';
import { isReady, zrevrange, get, zcard } from '../lib/redis';
import { cacheGet, cacheSet } from '../lib/cache';
import { parseLegacyExtension, sanitizeClickEffect, processThemePayload } from './sanitize';
import { sanitizeExtensionsOutput, sanitizeCustomCss } from './sanitize';
import { extractRgbChannels } from './color';
import { getDayOfYear } from './date';
import { STRUCTURAL_CSS_VARS } from '../lib/css-vars-defaults';

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
  extensions?: any[];
  clickEffect?: { spawn: any[] };
  type?: string;
}

/** Infer tags from theme colors and metadata */
function inferTags(entry: OmniThemeEntry): ThemeTag[] {
  const tags: ThemeTag[] = [];
  const bgBase = entry.theme.bgBase || '#000000';
  const textMain = entry.theme.textMain || '#ffffff';
  const bgBrightness = luminance(bgBase);

  // Dark vs light
  tags.push(bgBrightness < 0.3 ? 'dark' : 'light');

  // Warm vs cool — approximate from primary hue
  const primaryHex = rgbToHex(entry.theme.avatarGrad1);
  const hue = hexToHue(primaryHex);
  if (hue >= 200 && hue <= 330) tags.push('cool');
  else tags.push('warm');

  // Vibrant vs minimal — check color saturation proxies
  const sat = estimateSaturation(entry.theme);
  tags.push(sat > 0.5 ? 'vibrant' : 'minimal');

  // Type-based
  if (entry.type === 'holiday') tags.push('holiday');

  // Name-based keyword matching
  const name = (entry.name || '').toLowerCase();
  if (/ocean|sea|abyss|deep|wave|coral|海洋|海|深海/i.test(name)) tags.push('ocean');
  if (/space|cosmic|galaxy|nebula|star|cosmos|太空|宇宙|星/i.test(name)) tags.push('space');
  if (/fantasy|magic|myth|fairy|dragon|魔法|奇幻|仙/i.test(name)) tags.push('fantasy');
  if (/spring|summer|autumn|winter|春|夏|秋|冬/i.test(name)) tags.push('seasonal');
  if (/retro|vintage|80s|90s|复古|怀旧/i.test(name)) tags.push('retro');
  if (/tech|cyber|neon|code|matrix|科技|赛博/i.test(name)) tags.push('tech');

  // Glass detection from custom CSS
  const css = entry.theme.customCss || '';
  if (/glass|blur|frost|毛玻璃/i.test(css)) {
    if (!tags.includes('tech')) tags.push('tech');
    if (tags.length < 5) tags.push('glass' as ThemeTag);
  }

  return tags.slice(0, 5);
}

/** Relative luminance (0-1) */
function luminance(hex: string): number {
  const c = hex.replace('#', '');
  if (c.length < 6) return 0.5;
  const r = parseInt(c.slice(0, 2), 16) / 255;
  const g = parseInt(c.slice(2, 4), 16) / 255;
  const b = parseInt(c.slice(4, 6), 16) / 255;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function hexToHue(hex: string): number {
  if (!hex || typeof hex !== 'string') return 0;
  const c = hex.replace('#', '').trim();
  if (c.length !== 6 && c.length !== 3) return 0;
  if (c.length === 3) {
    const chars = c.split('');
    return hexToHue(`#${chars[0]}${chars[0]}${chars[1]}${chars[1]}${chars[2]}${chars[2]}`);
  }
  const r = parseInt(c.slice(0, 2), 16) / 255;
  const g = parseInt(c.slice(2, 4), 16) / 255;
  const b = parseInt(c.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  if (d === 0) return 0;
  let h = 0;
  if (max === r) h = ((g - b) / d) % 6;
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  return ((h * 60) % 360 + 360) % 360;
}

function estimateSaturation(theme: OmniThemeEntry['theme']): number {
  const hex = rgbToHex(theme.avatarGrad1);
  const c = hex.replace('#', '');
  if (c.length < 6) return 0;
  const r = parseInt(c.slice(0, 2), 16) / 255;
  const g = parseInt(c.slice(2, 4), 16) / 255;
  const b = parseInt(c.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  if (max === 0) return 0;
  return (max - min) / max;
}

/** Convert legacy extensions from OmniConfig to new declarative format. */
function convertExtensions(raw: any[] | undefined): AnyExtension[] | undefined {
  if (!raw || raw.length === 0) return undefined;
  const converted = raw.map((e) => parseLegacyExtension(e)).filter(Boolean) as AnyExtension[];
  return converted.length > 0 ? converted : undefined;
}

/** Convert an OmniConfig theme entry to our ComposedTheme format */
export function omniToComposed(entry: OmniThemeEntry): ComposedTheme {
  const t = entry.theme;
  const borderColor = hexFromRgb(t.accentRgb, 0.18);

  return {
    preset: entry.id,
    presetName: entry.name,
    customCss: t.customCss || undefined,
    extensions: convertExtensions(entry.extensions),
    logoText: entry.logo?.text,
    logoColors: entry.logo?.colors,
    cssVars: enrichCssVars({
      '--color-primary': t.avatarGrad1,
      '--color-secondary': t.avatarGrad2,
      '--color-accent': rgbToHex(t.accentRgb),
      '--color-bg': t.bgBase,
      '--color-surface': lightenDarken(t.bgBase, 0.06),
      '--color-text': t.textMain,
      '--color-text-muted': t.textMuted,
      '--color-border': borderColor,

      ...STRUCTURAL_CSS_VARS,

      // OmniConfig ambient colors
      '--ambient-1': t.ambient1,
      '--ambient-2': t.ambient2,
    }),
    tags: inferTags(entry),
    clickEffect: entry.clickEffect as any,
  };
}

/** Get today's theme using OmniConfig's auto strategy (holidays → dailyPool) */
export function getOmniDailyTheme(): ComposedTheme {
  const raw = OmniConfig.getThemeConfig('auto');
  const today = new Date();
  const dayOfYear = getDayOfYear(today);

  const dailyPool = (OmniConfig.dailyPool || []) as OmniThemeEntry[];
  if (dailyPool.length === 0) {
    // Fallback: return a safe default theme
    return omniToComposed({
      id: 'fallback',
      name: 'Default',
      theme: {
        bgBase: '#0f0f23', textMain: '#f4f4f5', textMuted: '#a1a1aa',
        accentRgb: '99,102,241', avatarGrad1: '#6366f1', avatarGrad2: '#818cf8',
        ambient1: 'rgba(99,102,241,0.15)', ambient2: 'rgba(129,140,248,0.1)',
      },
    });
  }

  // Check if a real holiday matched — compare logo text against dailyPool logos.
  // Holiday themes have unique logo texts that won't appear in dailyPool entries.
  const dailyLogos = new Set(dailyPool.map(t => t.logo?.text).filter(Boolean));
  const isHoliday = raw.logo && !dailyLogos.has(raw.logo.text);

  if (isHoliday) {
    return omniToComposed({
      id: `holiday-${dayOfYear}`,
      name: raw.logo?.text || 'Special Day',
      theme: raw.theme,
      logo: raw.logo,
      extensions: raw.extensions,
      type: 'holiday',
    });
  }

  const poolTheme = dailyPool[dayOfYear % dailyPool.length];
  return omniToComposed(poolTheme);
}

/**
 * Select a community theme for today's daily rotation.
 * Returns null if no community themes exist or DB is unreachable.
 * Uses a deterministic day-of-year index so the same theme lasts all day.
 */
export async function getDailyCommunityTheme(): Promise<ComposedTheme | null> {
  try {
    if (!isReady()) return null;

    const count = await zcard(COMMUNITY_NEWEST_KEY);
    if (count === 0) return null;

    const today = new Date();
    const dayOfYear = getDayOfYear(today);

    // Community theme takes over every 3rd day (~30% of days)
    if (dayOfYear % 3 !== 2) return null;

    const idx = dayOfYear % count;
    const ids = await zrevrange(COMMUNITY_NEWEST_KEY, idx, idx) as string[];
    if (!ids || ids.length === 0) return null;

    const ct = await get<CommunityThemeRaw>(`td:theme:${ids[0]}`);
    if (!ct) return null;

    return communityToComposed(ct);
  } catch {
    return null;
  }
}

/** Region-specific holidays by locale prefix */
const LOCALE_HOLIDAYS: Record<string, Record<string, any>> = {
  'hi': { // India
    'L10-15': { logo: { text: '🪔 排灯节 Diwali', colors: ['#f97316', '#eab308'] }, theme: { bgBase: '#1a0a00', textMain: '#fef3c7', textMuted: '#f59e0b', accentRgb: '249,115,22', avatarGrad1: '#f97316', avatarGrad2: '#eab308', ambient1: 'rgba(249,115,22,0.2)', ambient2: 'rgba(234,179,8,0.15)', customCss: '@keyframes diyas { 0%,100%{opacity:0.6} 50%{opacity:1} } .particle-diyas{animation:diyas 2s ease-in-out infinite}' }, extensions: [{ type:'floating', char:'🪔', top:'20%', left:'10%', fontSize:'2rem', opacity:0.8, animation:'float 4s ease-in-out infinite' }] },
    'L03-15': { logo: { text: '🎨 洒红节 Holi', colors: ['#ec4899', '#8b5cf6'] }, theme: { bgBase: '#fdf2f8', textMain: '#831843', textMuted: '#db2777', accentRgb: '236,72,153', avatarGrad1: '#ec4899', avatarGrad2: '#8b5cf6', ambient1: 'rgba(236,72,153,0.15)', ambient2: 'rgba(139,92,246,0.1)' } },
  },
  'ja': { // Japan
    '02-03': { logo: { text: '👹 节分 Setsubun', colors: ['#ef4444', '#f59e0b'] }, theme: { bgBase: '#fef2f2', textMain: '#991b1b', textMuted: '#dc2626', accentRgb: '239,68,68', avatarGrad1: '#ef4444', avatarGrad2: '#f59e0b', ambient1: 'rgba(239,68,68,0.12)', ambient2: 'rgba(245,158,11,0.1)' } },
    'L07-15': { logo: { text: '🏮 盂兰盆节 Obon', colors: ['#f97316', '#dc2626'] }, theme: { bgBase: '#0c0a09', textMain: '#fef3c7', textMuted: '#f59e0b', accentRgb: '249,115,22', avatarGrad1: '#f97316', avatarGrad2: '#dc2626', ambient1: 'rgba(249,115,22,0.15)', ambient2: 'rgba(220,38,38,0.1)' } },
  },
  'en-US': { // United States
    '11-THU-4': { logo: { text: '🦃 Thanksgiving', colors: ['#f59e0b', '#92400e'] }, theme: { bgBase: '#fffbeb', textMain: '#78350f', textMuted: '#b45309', accentRgb: '245,158,11', avatarGrad1: '#f59e0b', avatarGrad2: '#92400e', ambient1: 'rgba(245,158,11,0.12)', ambient2: 'rgba(146,64,14,0.08)' } },
    '07-04': { logo: { text: '🇺🇸 Independence Day', colors: ['#3b82f6', '#ef4444'] }, theme: { bgBase: '#eff6ff', textMain: '#1e3a5f', textMuted: '#3b82f6', accentRgb: '59,130,246', avatarGrad1: '#3b82f6', avatarGrad2: '#ef4444', ambient1: 'rgba(59,130,246,0.1)', ambient2: 'rgba(239,68,68,0.08)' } },
  },
  'pt-BR': { // Brazil
    '02-MON-BEFORE-LENT': { logo: { text: '🎭 Carnival', colors: ['#a855f7', '#22c55e'] }, theme: { bgBase: '#0f0a1a', textMain: '#f0abfc', textMuted: '#a855f7', accentRgb: '168,85,247', avatarGrad1: '#a855f7', avatarGrad2: '#22c55e', ambient1: 'rgba(168,85,247,0.2)', ambient2: 'rgba(34,197,94,0.15)' } },
    '06-12': { logo: { text: '💕 Dia dos Namorados', colors: ['#ec4899', '#f43f5e'] }, theme: { bgBase: '#fdf2f8', textMain: '#831843', textMuted: '#db2777', accentRgb: '236,72,153', avatarGrad1: '#ec4899', avatarGrad2: '#f43f5e', ambient1: 'rgba(236,72,153,0.12)', ambient2: 'rgba(244,63,94,0.08)' } },
  },
};

/** Get locale-specific holidays for a given locale string. */
function getLocaleHolidays(locale: string | null): Record<string, any> | null {
  if (!locale) return null;
  // Try exact match first (e.g., 'en-US'), then prefix (e.g., 'en')
  if (LOCALE_HOLIDAYS[locale]) return LOCALE_HOLIDAYS[locale];
  const prefix = locale.split('-')[0].toLowerCase();
  if (LOCALE_HOLIDAYS[prefix]) return LOCALE_HOLIDAYS[prefix];
  return null;
}

/** Check if today is the Nth weekday of a month (for Thanksgiving-style holidays). */
function isNthWeekdayOfMonth(date: Date, weekday: number, n: number): boolean {
  if (date.getDay() !== weekday) return false;
  return Math.ceil(date.getDate() / 7) === n;
}

/**
 * Get the theme for a specific date (MM-DD format).
 * Selection priority: locale holiday → lunar holiday → gregorian holiday → community (every 3rd day) → dailyPool.
 */
export async function getDateTheme(dateStr: string, locale?: string): Promise<ComposedTheme> {
  const dailyPool = (OmniConfig.dailyPool || []) as OmniThemeEntry[];
  if (dailyPool.length === 0) {
    return omniToComposed({
      id: 'fallback',
      name: 'Default',
      theme: {
        bgBase: '#0f0f23', textMain: '#f4f4f5', textMuted: '#a1a1aa',
        accentRgb: '99,102,241', avatarGrad1: '#6366f1', avatarGrad2: '#818cf8',
        ambient1: 'rgba(99,102,241,0.15)', ambient2: 'rgba(129,140,248,0.1)',
      },
    });
  }

  const parts = dateStr.split('-').map(Number);
  if (parts.length !== 2 || isNaN(parts[0]) || isNaN(parts[1])) {
    return getOmniDailyTheme();
  }

  const targetDate = new Date(new Date().getFullYear(), parts[0] - 1, parts[1]);
  if (isNaN(targetDate.getTime())) {
    return getOmniDailyTheme();
  }

  const dayOfYear = getDayOfYear(targetDate);

  // Helper: wrap a raw holiday/crazy entry into full OmniThemeEntry shape
  const wrapEntry = (entry: any, id: string): OmniThemeEntry => ({
    id,
    name: entry.logo?.text || id,
    logo: entry.logo,
    theme: entry.theme,
    extensions: entry.extensions,
    type: 'holiday',
  });

  // 0. Locale-specific holidays
  if (locale) {
    const localeHolidays = getLocaleHolidays(locale);
    if (localeHolidays) {
      // Check standard MM-DD keys
      if (localeHolidays[dateStr]) {
        return omniToComposed(wrapEntry(localeHolidays[dateStr], `locale-${dateStr}`));
      }
      // Check special US Thanksgiving (4th Thursday of November)
      if (dateStr.startsWith('11-') && targetDate.getDay() === 4 && isNthWeekdayOfMonth(targetDate, 4, 4)) {
        if (localeHolidays['11-THU-4']) {
          return omniToComposed(wrapEntry(localeHolidays['11-THU-4'], 'locale-thanksgiving'));
        }
      }
      // Check lunar keys too
      try {
        const lunar = Lunar.fromDate(targetDate);
        const lMonth = String(Math.abs(lunar.getMonth())).padStart(2, '0');
        const lDay = String(lunar.getDay()).padStart(2, '0');
        const lunarKey = `L${lMonth}-${lDay}`;
        if (localeHolidays[lunarKey]) {
          return omniToComposed(wrapEntry(localeHolidays[lunarKey], `locale-${lunarKey}`));
        }
      } catch {}
    }
  }

  // 1. Lunar holiday
  try {
    const lunar = Lunar.fromDate(targetDate);
    const lMonth = String(Math.abs(lunar.getMonth())).padStart(2, '0');
    const lDay = String(lunar.getDay()).padStart(2, '0');
    const lunarKey = `L${lMonth}-${lDay}`;
    if (OmniConfig.holidays?.[lunarKey as keyof typeof OmniConfig.holidays]) {
      return omniToComposed(wrapEntry(OmniConfig.holidays[lunarKey as keyof typeof OmniConfig.holidays], `holiday-${lunarKey.toLowerCase()}`));
    }
  } catch { /* skip if lunar conversion fails */ }

  // 2. Gregorian holiday
  if (OmniConfig.holidays?.[dateStr as keyof typeof OmniConfig.holidays]) {
    return omniToComposed(wrapEntry(OmniConfig.holidays[dateStr as keyof typeof OmniConfig.holidays], `holiday-${dateStr.toLowerCase()}`));
  }

  // 3. Crazy Thursday
  if (targetDate.getDay() === 4 && OmniConfig.crazyThursday) {
    return omniToComposed(wrapEntry(OmniConfig.crazyThursday as any, 'crazy-thursday'));
  }

  // 4. Community theme (every 3rd day)
  if (dayOfYear % 3 === 2) {
    try {
      if (isReady()) {
        const count = await zcard(COMMUNITY_NEWEST_KEY);
        if (count > 0) {
          const idx = dayOfYear % count;
          const ids = await zrevrange(COMMUNITY_NEWEST_KEY, idx, idx) as string[];
          if (ids && ids.length > 0) {
            const ct = await get<CommunityThemeRaw>(`td:theme:${ids[0]}`);
            if (ct) return communityToComposed(ct);
          }
        }
      }
    } catch { /* fall through to dailyPool */ }
  }

  // 5. Daily pool
  return omniToComposed(dailyPool[dayOfYear % dailyPool.length]);
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
    const holidays = OmniConfig.holidays as unknown as Record<string, OmniThemeEntry>;
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

/** Append --*-rgb channel variants for all color CSS variables. */
export function enrichCssVars(cssVars: Record<string, string>): Record<string, string> {
  const enriched: Record<string, string> = { ...cssVars };

  for (const [key, val] of Object.entries(cssVars)) {
    if (!key.startsWith('--color-') && key !== '--ambient-1' && key !== '--ambient-2') continue;
    if (typeof val !== 'string') continue;

    const rgb = extractRgbChannels(val);
    if (rgb) enriched[`${key}-rgb`] = rgb;
  }

  return enriched;
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
  extensions?: AnyExtension[] | null;
  tags?: string[];
  clickEffect?: any;
}

function inferTagsFromVars(cssVars: Record<string, string>): ThemeTag[] {
  const tags: ThemeTag[] = [];
  const bg = cssVars['--color-bg'] || '#000000';
  const primary = cssVars['--color-primary'] || '#6366f1';
  const bgLum = luminance(bg);

  tags.push(bgLum < 0.3 ? 'dark' : 'light');

  const hue = hexToHue(primary);
  if (hue >= 200 && hue <= 330) tags.push('cool');
  else tags.push('warm');

  // Estimate vibrancy from primary saturation
  const c = primary.replace('#', '');
  if (c.length >= 6) {
    const r = parseInt(c.slice(0, 2), 16) / 255;
    const g = parseInt(c.slice(2, 4), 16) / 255;
    const b = parseInt(c.slice(4, 6), 16) / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const sat = max === 0 ? 0 : (max - min) / max;
    tags.push(sat > 0.5 ? 'vibrant' : 'minimal');
  } else {
    tags.push('minimal');
  }

  // Glass detection
  const glassBlur = (cssVars['--glass-blur'] || '').trim();
  if (glassBlur && glassBlur !== 'blur(0px)' && !glassBlur.startsWith('0')) {
    if (!tags.includes('tech')) tags.push('tech');
    tags.push('glass' as ThemeTag);
  }

  // Font detection
  const heading = (cssVars['--font-heading'] || '').toLowerCase();
  if (/serif|garamond|times|georgia|baskerville/i.test(heading)) {
    tags.push('elegant' as ThemeTag);
  }

  tags.push('community');
  return tags.slice(0, 5);
}

function communityToComposed(ct: CommunityThemeRaw): ComposedTheme {
  const sanitizedCss = sanitizeCustomCss(ct.customCss) || undefined;
  const sanitizedExts = sanitizeExtensionsOutput(ct.extensions);

  // Run full layer-safety pipeline (pointer-events, z-index rewrite, empty filter)
  const processed = processThemePayload({
    customCss: sanitizedCss,
    extensions: sanitizedExts,
  });

  return {
    preset: `community-${ct.id}`,
    presetName: ct.name,
    cssVars: enrichCssVars(ct.cssVars),
    customCss: processed.customCss || undefined,
    extensions: processed.extensions || undefined,
    tags: ((ct.tags?.length ? ct.tags.filter(Boolean) : undefined) || inferTagsFromVars(ct.cssVars)) as ThemeTag[] | undefined,
    clickEffect: sanitizeClickEffect(ct.clickEffect),
  };
}

const COMMUNITY_NEWEST_KEY = 'td:themes:by_newest';

/**
 * Get YYYY-MM-DD date string for a given timezone.
 * Uses Intl.DateTimeFormat.formatToParts for robust cross-runtime parsing.
 * Falls back to server local time on invalid timezone.
 */
export function getDateStrForTimezone(tz: string): string {
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    const parts = formatter.formatToParts(new Date());
    const year = parts.find(p => p.type === 'year')?.value;
    const month = parts.find(p => p.type === 'month')?.value;
    const day = parts.find(p => p.type === 'day')?.value;
    if (year && month && day) return `${year}-${month}-${day}`;
  } catch { /* fall through */ }
  return new Date().toISOString().slice(0, 10);
}

/**
 * Get MM-DD date string for a given timezone (for theme selection).
 */
export function getMMDDForTimezone(tz: string): string {
  const full = getDateStrForTimezone(tz);
  return full.slice(5, 10);
}

/**
 * Load community themes from Redis. Returns [] on any failure.
 * This is designed to never throw—DB outage must not break the site.
 */
export async function getCommunityThemes(limit: number = 50): Promise<ComposedTheme[]> {
  try {
    if (!isReady() || limit <= 0) return [];

    const cacheKey = `community:list:${limit}`;
    const cached = cacheGet<ComposedTheme[]>(cacheKey);
    if (cached) return cached;

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

    cacheSet(cacheKey, themes, 300_000); // 5 min cache
    return themes;
  } catch {
    return [];
  }
}
