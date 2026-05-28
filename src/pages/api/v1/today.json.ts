import { getDailyTheme, getAllThemes } from '../../../utils/daily-theme';
import { getCommunityThemes, getDailyCommunityTheme, getDateTheme, getDateStrForTimezone, getMMDDForTimezone, enrichCssVars } from '../../../utils/omni-bridge';
import { cacheGet, cacheSet } from '../../../lib/cache';
import { applyOverrides, processThemePayload } from '../../../utils/sanitize';
import { get as redisGet } from '../../../lib/redis';
import { STATUS_THEMES } from '../../../lib/status-themes';
import { STRUCTURAL_CSS_VARS } from '../../../lib/css-vars-defaults';

export const prerender = false;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const CACHE_HEADERS = {
  'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=3600',
};

export async function GET({ url }: { url: URL }) {
  const tz = url.searchParams.get('tz');
  const overridesRaw = url.searchParams.get('overrides');

  // Check for active status override before cache
  const override = await redisGet<{ status: string; activatedAt: string }>('td:status-override');
  if (override && STATUS_THEMES[override.status]) {
    const cssVars = enrichCssVars({ ...STATUS_THEMES[override.status], ...STRUCTURAL_CSS_VARS });
    const body = JSON.stringify({
      date: new Date().toISOString().slice(0, 10),
      generatedAt: new Date().toISOString(),
      preset: `status-${override.status}`,
      presetName: `紧急覆盖: ${override.status}`,
      cssVars,
      customCss: null,
      extensions: [],
      clickEffect: null,
      logoText: null,
      logoColors: null,
      override: { status: override.status, activatedAt: override.activatedAt },
      apiVersion: 'v1',
    }, null, 2);
    return new Response(body, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, max-age=10, s-maxage=30',
        ...CORS_HEADERS,
      },
    });
  }

  const todayKey = `today:${new Date().toISOString().slice(0, 10)}` + (tz ? `:tz:${tz}` : '');
  const cached = cacheGet<string>(todayKey);
  if (cached && !overridesRaw) {
    return new Response(cached, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        ...CORS_HEADERS,
        ...CACHE_HEADERS,
      },
    });
  }

  try {
  let theme;
  if (tz) {
    const dateStr = getMMDDForTimezone(tz);
    theme = await getDateTheme(dateStr);
  } else {
    const communityDaily = await getDailyCommunityTheme();
    theme = communityDaily || getDailyTheme();
  }

  let cssVars = theme.cssVars;
  if (overridesRaw) {
    cssVars = applyOverrides(cssVars, overridesRaw);
  }

  const allThemes = getAllThemes();
  const communityThemes = await getCommunityThemes(50);
  const staticDir = allThemes.map((t) => ({
    preset: t.preset,
    name: t.presetName,
    primary: t.cssVars['--color-primary'],
    accent: t.cssVars['--color-accent'],
    logoText: t.logoText || null,
  }));

  const communityDir = communityThemes.map((t) => ({
    preset: t.preset,
    name: t.presetName,
    primary: t.cssVars['--color-primary'],
    accent: t.cssVars['--color-accent'],
    logoText: null,
    community: true,
  }));

  const directory = [...staticDir.slice(0, 20), ...communityDir.slice(0, 10)];

  // Process theme payload: filter empty extensions, rewrite z-index,
  // inject pointer-events: none, build layer context metadata
  const processed = processThemePayload({
    customCss: theme.customCss,
    extensions: theme.extensions,
  });

  const bodyObj: Record<string, any> = {
    date: tz ? getDateStrForTimezone(tz) : new Date().toISOString().slice(0, 10),
    generatedAt: new Date().toISOString(),
    preset: theme.preset,
    presetName: theme.presetName,
    cssVars,
    customCss: processed.customCss || null,
    extensions: processed.extensions,
    clickEffect: theme.clickEffect || null,
    logoText: theme.logoText || null,
    logoColors: theme.logoColors || null,
    available: staticDir.length + communityDir.length,
    directory,
    dailyIsCommunity: !!(!tz && await getDailyCommunityTheme()),
    apiVersion: 'v1',
    layerContext: processed.layerContext,
  };
  if (overridesRaw) bodyObj.appliedOverrides = true;

  const body = JSON.stringify(bodyObj, null, 2);

  if (!overridesRaw) {
    cacheSet(todayKey, body, 120_000); // 2 min in-memory cache
  }

  return new Response(body, {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...CORS_HEADERS,
      ...CACHE_HEADERS,
    },
  });
  } catch (err) {
    console.error('[v1/today.json] Unexpected error:', err);
    return new Response(JSON.stringify({ error: '内部服务错误' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  }
}

export function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}
