import { Lunar } from 'lunar-javascript';
import OmniConfig from '../../api/index_config.js';
import { getAllThemes } from '../../utils/daily-theme';

export const prerender = true;

export async function GET() {
  const config = OmniConfig as any;
  const themes = getAllThemes();

  // Daily pool preset IDs in order (used for dayOfYear rotation)
  const pool: string[] = (config.dailyPool || []).map((t: any) => t.id);

  // Gregorian holidays: MM-DD → holiday preset
  const gregorianHolidays: Record<string, string> = {};
  // Lunar holidays mapped to Gregorian dates for the current year: MM-DD → holiday preset
  const lunarHolidays: Record<string, string> = {};

  if (config.holidays) {
    const today = new Date();
    const lunar = Lunar.fromDate(today);
    const lunarYear = lunar.getYear();

    for (const key of Object.keys(config.holidays)) {
      if (/^\d{2}-\d{2}$/.test(key)) {
        gregorianHolidays[key] = `holiday-${key.toLowerCase()}`;
      } else if (/^L(\d{2})-(\d{2})$/.test(key)) {
        const lMonth = parseInt(RegExp.$1, 10);
        const lDay = parseInt(RegExp.$2, 10);
        try {
          const l = Lunar.fromYmd(lunarYear, lMonth, lDay);
          const s = l.getSolar();
          const mm = String(s.getMonth()).padStart(2, '0');
          const dd = String(s.getDay()).padStart(2, '0');
          lunarHolidays[`${mm}-${dd}`] = `holiday-${key.toLowerCase()}`;
        } catch { /* skip lunar dates that don't exist this year */ }
      }
    }
  }

  // Directory: first 20 static themes for the response
  const directory = themes.slice(0, 20).map(t => ({
    preset: t.preset,
    name: t.presetName,
    primary: t.cssVars['--color-primary'],
    accent: t.cssVars['--color-accent'],
    logoText: t.logoText || null,
  }));

  return new Response(JSON.stringify({
    pool,
    poolLength: pool.length,
    totalThemes: themes.length,
    gregorianHolidays,
    lunarHolidays,
    directory,
  }), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
