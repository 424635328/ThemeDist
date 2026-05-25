import { getAllThemes } from '../../../../utils/daily-theme';
import { get as redisGet } from '../../../../lib/redis';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function GET({ params }: { params: { preset: string } }) {
  const presetId = params.preset;

  // Handle community themes from Redis
  if (presetId.startsWith('community-')) {
    const redisId = presetId.slice('community-'.length);
    try {
      const ct = await redisGet<any>(`td:theme:${redisId}`);
      if (ct) {
        return new Response(
          JSON.stringify({
            preset: presetId,
            presetName: ct.name,
            cssVars: ct.cssVars,
            customCss: ct.customCss || null,
            extensions: ct.extensions || null,
            logoText: null,
            logoColors: null,
            apiVersion: 'v1',
          }),
          {
            headers: {
              'Content-Type': 'application/json',
              'Cache-Control': 'public, max-age=3600',
              ...CORS_HEADERS,
            },
          },
        );
      }
    } catch { /* fall through to 404 */ }
    return new Response(JSON.stringify({ error: 'Theme not found', code: 404 }), {
      status: 404,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  }

  // Static themes
  const themes = getAllThemes();
  const theme = themes.find((t) => t.preset === presetId);

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
        apiVersion: 'v1',
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
