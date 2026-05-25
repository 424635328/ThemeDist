export const prerender = false;

import { likeTheme, hasVoted } from '../../../../lib/themes-db';
import { isReady } from '../../../../lib/redis';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function getFingerprint(request: Request): string {
  const rawIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '0.0.0.0';
  // x-forwarded-for can be "client, proxy1, proxy2" — take only the first (real client) IP
  const ip = rawIp.split(',')[0].trim();
  const ua = request.headers.get('user-agent') || '';
  // Simple hash - not crypto-secure, just for dedup
  let hash = 0;
  const str = ip + '|' + ua.slice(0, 64);
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return String(hash);
}

export async function POST({ request }: { request: Request }) {
  if (!isReady()) {
    return new Response(JSON.stringify({ error: '数据库暂时不可用' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json', ...CORS },
    });
  }

  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return new Response(JSON.stringify({ error: '缺少 id' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...CORS },
      });
    }

    const fp = getFingerprint(request);
    const likes = await likeTheme(id, fp);

    if (likes === null) {
      return new Response(JSON.stringify({ error: '主题不存在' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...CORS },
      });
    }

    const voted = await hasVoted(id, fp);

    return new Response(JSON.stringify({ likes, voted, apiVersion: 'v1' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...CORS },
    });
  } catch {
    return new Response(JSON.stringify({ error: '请求格式错误' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...CORS },
    });
  }
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}
