import { getDailyTheme, getAllThemes } from '../../utils/daily-theme';
import { getCommunityThemes } from '../../utils/omni-bridge';

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
  const communityThemes = await getCommunityThemes(0);
  const totalAvailable = allThemes.length + communityThemes.length;

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
        available: totalAvailable,
        directory: [...staticDir.slice(0, 20), ...communityDir.slice(0, 10)],
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
