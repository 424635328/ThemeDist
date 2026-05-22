import { getAllThemes } from '../../../utils/daily-theme';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function getStaticPaths() {
  const themes = getAllThemes();
  return themes.map((t) => ({
    params: { preset: t.preset },
  }));
}

export async function GET({ params }: { params: { preset: string } }) {
  const themes = getAllThemes();
  const theme = themes.find((t) => t.preset === params.preset);

  if (!theme) {
    return new Response(JSON.stringify({ error: 'Theme not found', code: 404 }), {
      status: 404,
      headers: {
        'Content-Type': 'application/json',
        ...CORS_HEADERS,
      },
    });
  }

  return new Response(
    JSON.stringify(
      {
        preset: theme.preset,
        presetName: theme.presetName,
        cssVars: theme.cssVars,
        customCss: theme.customCss || null,
        extensions: theme.extensions || null,
        logoText: theme.logoText || null,
        logoColors: theme.logoColors || null,
      },
      null,
      2,
    ),
    {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=86400, s-maxage=31536000, immutable',
        ...CORS_HEADERS,
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
