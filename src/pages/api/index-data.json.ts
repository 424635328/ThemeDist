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
  if (config.holidays) {
    for (const key of Object.keys(config.holidays)) {
      if (/^\d{2}-\d{2}$/.test(key)) {
        gregorianHolidays[key] = `holiday-${key}`;
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
    gregorianHolidays,
    directory,
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
