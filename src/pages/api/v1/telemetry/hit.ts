import { isReady, pfadd, zincrby } from '../../../../lib/redis';

export const prerender = false;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function POST({ request }: { request: Request }) {
  try {
    const body = await request.json();
    const { themeId, host } = body || {};

    if (!themeId || !host) {
      return new Response(JSON.stringify({ error: '请提供 themeId 和 host 字段' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
      });
    }

    const today = new Date().toISOString().slice(0, 10);

    if (isReady()) {
      // HyperLogLog: count unique domains per day
      await pfadd(`td:stats:uv:${today}`, String(host).slice(0, 128));
      // Sorted Set: increment theme usage count
      await zincrby('td:stats:theme_usage', 1, String(themeId).slice(0, 64));
    }

    return new Response(JSON.stringify({ recorded: true, date: today, apiVersion: 'v1' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  } catch (err) {
    console.error('[v1/telemetry/hit] Error:', err);
    return new Response(JSON.stringify({ error: '请求格式错误' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  }
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}
