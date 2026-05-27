import { getAllThemes } from '../../../../utils/daily-theme';
import { get as redisGet } from '../../../../lib/redis';
import { sanitizeCustomCss } from '../../../../utils/sanitize';
import { sanitizeExtensionsOutput, processThemePayload } from '../../../../utils/sanitize';

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
        const processed = processThemePayload({
          customCss: sanitizeCustomCss(ct.customCss) || undefined,
          extensions: sanitizeExtensionsOutput(ct.extensions) || undefined,
        });
        return new Response(
          JSON.stringify({
            preset: presetId,
            presetName: ct.name,
            cssVars: ct.cssVars,
            customCss: processed.customCss || null,
            extensions: processed.extensions,
            clickEffect: ct.clickEffect || null,
            logoText: null,
            logoColors: null,
            apiVersion: 'v1',
            layerContext: processed.layerContext,
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

  const processed = processThemePayload({
    customCss: theme.customCss,
    extensions: theme.extensions,
  });

  return new Response(
    JSON.stringify(
      {
        preset: theme.preset,
        presetName: theme.presetName,
        cssVars: theme.cssVars,
        customCss: processed.customCss || null,
        extensions: processed.extensions,
        clickEffect: theme.clickEffect || null,
        logoText: theme.logoText || null,
        logoColors: theme.logoColors || null,
        apiVersion: 'v1',
        layerContext: processed.layerContext,
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
