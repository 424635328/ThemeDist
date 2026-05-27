import { getAllThemes } from '../../../../utils/daily-theme';
import { get, isReady } from '../../../../lib/redis';
import { getThemeWithLikes } from '../../../../lib/themes-db';
import { getDayOfYear } from '../../../../utils/date';
import { processThemePayload } from '../../../../utils/sanitize';

export const prerender = false;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function GET({ params }: { params: { poolId: string } }) {
  try {
    const poolId = params.poolId;

    if (!poolId || poolId.length < 4) {
      return new Response(JSON.stringify({ error: '无效的 poolId' }), {
        status: 400, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
      });
    }

    // Try Redis first
    let themeIds: string[] = [];
    if (isReady()) {
      const pool = await get<any>(`td:pool:${poolId}`);
      if (pool && Array.isArray(pool.themeIds)) {
        themeIds = pool.themeIds;
      }
    }

    if (themeIds.length === 0) {
      return new Response(JSON.stringify({ error: '轮换池不存在或为空' }), {
        status: 404, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
      });
    }

    // Daily rotation by dayOfYear
    const dayOfYear = getDayOfYear(new Date());
    const selectedId = themeIds[dayOfYear % themeIds.length];

    // Resolve the theme
    let theme: any = null;
    const allStatic = getAllThemes();

    if (selectedId.startsWith('community-')) {
      const ct = await getThemeWithLikes(selectedId.replace('community-', ''));
      if (ct) theme = { preset: `community-${ct.id}`, presetName: ct.name, cssVars: ct.cssVars, customCss: ct.customCss || null, extensions: ct.extensions || null, clickEffect: ct.clickEffect || null };
    } else {
      theme = allStatic.find(t => t.preset === selectedId);
    }

    if (!theme) {
      return new Response(JSON.stringify({ error: `池中主题 ${selectedId} 不存在` }), {
        status: 404, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
      });
    }

    const processed = processThemePayload({
      customCss: theme.customCss || undefined,
      extensions: theme.extensions || undefined,
    });

    return new Response(JSON.stringify({
      poolId,
      date: new Date().toISOString().slice(0, 10),
      selected: selectedId,
      preset: theme.preset,
      presetName: theme.presetName,
      cssVars: theme.cssVars,
      customCss: processed.customCss || null,
      extensions: processed.extensions,
      clickEffect: theme.clickEffect || null,
      apiVersion: 'v1',
      layerContext: processed.layerContext,
    }, null, 2), {
      headers: { 'Content-Type': 'application/json; charset=utf-8', ...CORS_HEADERS, 'Cache-Control': 'public, max-age=3600' },
    });
  } catch (err) {
    console.error('[v1/pool/[poolId].json] Error:', err);
    return new Response(JSON.stringify({ error: '内部服务错误' }), {
      status: 500, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  }
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}
