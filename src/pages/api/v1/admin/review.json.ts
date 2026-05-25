export const prerender = false;

import { isAdmin, verifyCsrf } from '../../../../lib/auth';
import { batchApproveThemes, batchRejectThemes, getPendingThemes, getPendingCount } from '../../../../lib/themes-db';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const NO_CACHE = { 'Cache-Control': 'no-store' };

export async function GET({ cookies }: { cookies: any }) {
  if (!isAdmin(cookies)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json', ...CORS, ...NO_CACHE },
    });
  }

  // Ensure CSRF cookie exists (repair sessions created before CSRF was added)
  if (!cookies.get('csrf_token')) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < 32; i++) {
      token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    cookies.set('csrf_token', token, {
      httpOnly: false,
      path: '/',
      maxAge: 60 * 60 * 24,
      sameSite: 'strict',
    });
  }

  const [themes, count] = await Promise.all([getPendingThemes(), getPendingCount()]);
  return new Response(JSON.stringify({ themes, pending: count, apiVersion: 'v1' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', ...CORS, ...NO_CACHE },
  });
}

export async function POST({ request, cookies }: { request: Request; cookies: any }) {
  if (!isAdmin(cookies)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json', ...CORS, ...NO_CACHE },
    });
  }

  if (!verifyCsrf(cookies, request.headers)) {
    return new Response(JSON.stringify({ error: 'CSRF validation failed' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json', ...CORS, ...NO_CACHE },
    });
  }

  try {
    const body = await request.json();
    const { action, ids } = body as { action: string; ids: string[] };

    if (!Array.isArray(ids) || ids.length === 0) {
      return new Response(JSON.stringify({ error: '请选择至少一个主题' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...CORS, ...NO_CACHE },
      });
    }

    if (action === 'approve') {
      const result = await batchApproveThemes(ids);
      return new Response(JSON.stringify({ success: true, ...result, apiVersion: 'v1' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...CORS, ...NO_CACHE },
      });
    }

    if (action === 'reject') {
      const result = await batchRejectThemes(ids);
      return new Response(JSON.stringify({ success: true, ...result, apiVersion: 'v1' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...CORS, ...NO_CACHE },
      });
    }

    return new Response(JSON.stringify({ error: `未知操作: ${action}` }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...CORS, ...NO_CACHE },
    });
  } catch {
    return new Response(JSON.stringify({ error: '请求格式错误' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...CORS, ...NO_CACHE },
    });
  }
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}
