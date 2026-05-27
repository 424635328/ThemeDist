export const prerender = false;

import { getThemeWithLikes } from '../../../../lib/themes-db';
import { isReady } from '../../../../lib/redis';
import { processThemePayload } from '../../../../utils/sanitize';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function GET({ url }: { url: URL }) {
  const id = url.searchParams.get('id');
  if (!id) {
    return new Response(JSON.stringify({ error: '缺少 id 参数' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...CORS },
    });
  }

  if (!isReady()) {
    return new Response(JSON.stringify({ error: '数据库暂时不可用' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json', ...CORS },
    });
  }

  const theme = await getThemeWithLikes(id);

  if (!theme) {
    return new Response(JSON.stringify({ error: '主题不存在' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json', ...CORS },
    });
  }

  const processed = processThemePayload({
    customCss: theme.customCss || undefined,
    extensions: theme.extensions || undefined,
  });

  return new Response(JSON.stringify({
    ...theme,
    customCss: processed.customCss || null,
    extensions: processed.extensions,
    layerContext: processed.layerContext,
    apiVersion: 'v1',
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=300', ...CORS },
  });
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}
