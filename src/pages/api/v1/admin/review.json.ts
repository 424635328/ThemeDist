export const prerender = false;

import { isAdmin, verifyCsrf, getAdminAccount } from '../../../../lib/auth';
import { batchApproveThemes, batchRejectThemes, getPendingThemes, getPendingCount, rollbackTheme, getRecentlyApproved } from '../../../../lib/themes-db';

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
    cookies.set('csrf_token', crypto.randomUUID(), {
      httpOnly: false,
      path: '/',
      maxAge: 60 * 60 * 24,
      sameSite: 'strict',
    });
  }

  const [themes, count, recentlyApproved] = await Promise.all([getPendingThemes(), getPendingCount(), getRecentlyApproved()]);
  return new Response(JSON.stringify({ themes, pending: count, recentlyApproved, apiVersion: 'v1' }), {
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
    const { action, ids, id } = body as { action: string; ids?: string[]; id?: string };

    // Rollback: single theme back to pending
    if (action === 'rollback') {
      if (!id) {
        return new Response(JSON.stringify({ error: '缺少主题 ID' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...CORS, ...NO_CACHE },
        });
      }
      const result = await rollbackTheme(id);
      return new Response(JSON.stringify({ ...result, apiVersion: 'v1' }), {
        status: result.success ? 200 : 400,
        headers: { 'Content-Type': 'application/json', ...CORS, ...NO_CACHE },
      });
    }

    if (!Array.isArray(ids) || ids.length === 0) {
      return new Response(JSON.stringify({ error: '请选择至少一个主题' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...CORS, ...NO_CACHE },
      });
    }

    if (action === 'approve') {
      const reviewedBy = getAdminAccount(cookies);
      const result = await batchApproveThemes(ids, reviewedBy);
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
