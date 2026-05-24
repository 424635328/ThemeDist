import { getDateTheme, getAllThemes } from '../../utils/daily-theme';
import { getCommunityThemes } from '../../utils/omni-bridge';
import { cacheGet, cacheSet } from '../../lib/cache';

export const prerender = false;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const CACHE_HEADERS = {
  'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=3600',
};

export async function GET({ params }: { params: { param: string } }) {
  const raw = params.param;

  // Expect format: date=MM-DD
  const match = raw.match(/^date=(\d{2}-\d{2})$/);
  if (!match) {
    return new Response(JSON.stringify({ error: 'Invalid format. Use /api/date=MM-DD' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json; charset=utf-8', ...CORS_HEADERS },
    });
  }

  const dateStr = match[1];
  const cacheKey = `api:date:${dateStr}`;
  const cached = cacheGet<string>(cacheKey);
  if (cached) {
    return new Response(cached, {
      headers: { 'Content-Type': 'application/json; charset=utf-8', ...CORS_HEADERS, ...CACHE_HEADERS },
    });
  }

  try {
    const theme = await getDateTheme(dateStr);

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

    const body = JSON.stringify(
      {
        date: `${new Date().getFullYear()}-${dateStr}`,
        generatedAt: new Date().toISOString(),
        preset: theme.preset,
        presetName: theme.presetName,
        cssVars: theme.cssVars,
        customCss: theme.customCss || null,
        extensions: theme.extensions || null,
        logoText: theme.logoText || null,
        logoColors: theme.logoColors || null,
        available: staticDir.length + communityDir.length,
        directory,
      },
      null,
      2,
    );

    cacheSet(cacheKey, body, 120_000);

    return new Response(body, {
      headers: { 'Content-Type': 'application/json; charset=utf-8', ...CORS_HEADERS, ...CACHE_HEADERS },
    });
  } catch (err) {
    console.error('[api/date] Unexpected error:', err);
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
