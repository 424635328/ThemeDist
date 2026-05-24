export const prerender = false;

import { isAdmin, verifyCsrf } from '../../../lib/auth';
import { batchApproveThemes, batchRejectThemes, getPendingThemes, getPendingCount } from '../../../lib/themes-db';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function GET({ cookies }: { cookies: any }) {
  if (!isAdmin(cookies)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json', ...CORS },
    });
  }

  const [themes, count] = await Promise.all([getPendingThemes(), getPendingCount()]);
  return new Response(JSON.stringify({ themes, pending: count }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', ...CORS },
  });
}

export async function POST({ request, cookies }: { request: Request; cookies: any }) {
  if (!isAdmin(cookies)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json', ...CORS },
    });
  }

  if (!verifyCsrf(cookies, request.headers)) {
    return new Response(JSON.stringify({ error: 'CSRF validation failed' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json', ...CORS },
    });
  }

  try {
    const body = await request.json();
    const { action, ids } = body as { action: string; ids: string[] };

    if (!Array.isArray(ids) || ids.length === 0) {
      return new Response(JSON.stringify({ error: '请选择至少一个主题' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...CORS },
      });
    }

    if (action === 'approve') {
      const result = await batchApproveThemes(ids);
      return new Response(JSON.stringify({ success: true, ...result }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...CORS },
      });
    }

    if (action === 'reject') {
      const result = await batchRejectThemes(ids);
      return new Response(JSON.stringify({ success: true, ...result }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...CORS },
      });
    }

    return new Response(JSON.stringify({ error: `未知操作: ${action}` }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...CORS },
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
