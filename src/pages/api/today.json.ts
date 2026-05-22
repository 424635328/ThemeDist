import { getDailyTheme, getAllThemes } from '../../utils/daily-theme';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const CACHE_HEADERS = {
  'Cache-Control': 'public, max-age=3600, s-maxage=86400',
};

export async function GET() {
  const theme = getDailyTheme();
  const allThemes = getAllThemes();

  return new Response(
    JSON.stringify(
      {
        date: new Date().toISOString().slice(0, 10),
        generatedAt: new Date().toISOString(),
        preset: theme.preset,
        presetName: theme.presetName,
        cssVars: theme.cssVars,
        customCss: theme.customCss || null,
        extensions: theme.extensions || null,
        logoText: theme.logoText || null,
        logoColors: theme.logoColors || null,
        available: allThemes.length,
        directory: allThemes.map((t) => ({
          preset: t.preset,
          name: t.presetName,
          primary: t.cssVars['--color-primary'],
          accent: t.cssVars['--color-accent'],
          logoText: t.logoText || null,
        })),
      },
      null,
      2,
    ),
    {
      headers: {
        'Content-Type': 'application/json',
        ...CORS_HEADERS,
        ...CACHE_HEADERS,
      },
    },
  );
}

export function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}
