import type { APIRoute } from 'astro';
import { isAdmin, verifyCsrf } from '../../../../lib/auth';
import { get as redisGet, set as redisSet, del as redisDel } from '../../../../lib/redis';
import { cacheDeletePrefix } from '../../../../lib/cache';
import { VALID_STATUSES } from '../../../../lib/status-themes';
import { broadcastEvent } from '../events';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-CSRF-Token',
};

const REDIS_KEY = 'td:status-override';

interface OverrideState {
  status: string;
  activatedAt: string;
  activatedBy: string;
}

export const GET: APIRoute = async ({ cookies }) => {
  if (!isAdmin(cookies)) {
    return new Response(JSON.stringify({ error: '未授权访问' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  }

  const override = await redisGet<OverrideState>(REDIS_KEY);

  if (!override || !override.status) {
    return new Response(JSON.stringify({ active: false }), {
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  }

  return new Response(JSON.stringify({
    active: true,
    status: override.status,
    activatedAt: override.activatedAt,
    activatedBy: override.activatedBy,
  }), {
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
  });
};

export const POST: APIRoute = async ({ request, cookies }) => {
  if (!isAdmin(cookies)) {
    return new Response(JSON.stringify({ error: '未授权访问' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  }

  if (!verifyCsrf(cookies, request.headers)) {
    return new Response(JSON.stringify({ error: 'CSRF 校验失败' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  }

  let body: { action?: string; status?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: '请求体解析失败' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  }

  const { action, status } = body;

  if (action === 'activate') {
    if (!status || !VALID_STATUSES.includes(status)) {
      return new Response(JSON.stringify({
        error: '无效的状态类型',
        validStatuses: VALID_STATUSES,
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
      });
    }

    const state: OverrideState = {
      status,
      activatedAt: new Date().toISOString(),
      activatedBy: 'admin',
    };

    await redisSet(REDIS_KEY, state);
    cacheDeletePrefix('today:');
    broadcastEvent('status-override', { action: 'activated', status, activatedAt: state.activatedAt });

    return new Response(JSON.stringify({
      success: true,
      action: 'activated',
      status,
      activatedAt: state.activatedAt,
    }), {
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  }

  if (action === 'deactivate') {
    await redisDel(REDIS_KEY);
    cacheDeletePrefix('today:');
    broadcastEvent('status-override', { action: 'deactivated' });

    return new Response(JSON.stringify({
      success: true,
      action: 'deactivated',
    }), {
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  }

  return new Response(JSON.stringify({
    error: '无效的操作，支持: activate, deactivate',
  }), {
    status: 400,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
  });
};

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}
