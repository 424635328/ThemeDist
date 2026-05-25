import { isReady, set } from '../../../../lib/redis';
import { nanoid } from 'nanoid';

export const prerender = false;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function POST({ request }: { request: Request }) {
  try {
    const body = await request.json();
    const { name, themeIds } = body || {};

    if (!name || !Array.isArray(themeIds) || themeIds.length === 0) {
      return new Response(JSON.stringify({ error: '请提供 name 和 themeIds 数组' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
      });
    }

    if (themeIds.length > 100) {
      return new Response(JSON.stringify({ error: '池子最多 100 个主题' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
      });
    }

    const poolId = nanoid(8);
    const pool = {
      id: poolId,
      name: String(name).slice(0, 100),
      themeIds: themeIds.slice(0, 100).map((id: any) => String(id).slice(0, 64)),
      createdAt: Date.now(),
    };

    if (isReady()) {
      await set(`td:pool:${poolId}`, pool);
    }

    return new Response(JSON.stringify({ success: true, pool, apiVersion: 'v1' }, null, 2), {
      status: 201,
      headers: { 'Content-Type': 'application/json; charset=utf-8', ...CORS_HEADERS },
    });
  } catch (err) {
    console.error('[v1/pool/create.json] Error:', err);
    return new Response(JSON.stringify({ error: '请求格式错误' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  }
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}
