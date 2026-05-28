import type { APIRoute } from 'astro';
import { isAdmin, verifyCsrf } from '../../../../lib/auth';
import { createApiKey, revokeApiKey, listApiKeys } from '../../../../lib/api-keys';

export const prerender = false;

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
};

export const GET: APIRoute = async ({ cookies }) => {
  if (!isAdmin(cookies)) {
    return new Response(JSON.stringify({ error: '未授权' }), {
      status: 401, headers: { 'Content-Type': 'application/json', ...CORS },
    });
  }

  const keys = await listApiKeys();
  return new Response(JSON.stringify({ keys }, null, 2), {
    headers: { 'Content-Type': 'application/json', ...CORS },
  });
};

export const POST: APIRoute = async ({ request, cookies }) => {
  if (!isAdmin(cookies)) {
    return new Response(JSON.stringify({ error: '未授权' }), {
      status: 401, headers: { 'Content-Type': 'application/json', ...CORS },
    });
  }
  if (!verifyCsrf(cookies, request.headers)) {
    return new Response(JSON.stringify({ error: 'CSRF 验证失败' }), {
      status: 403, headers: { 'Content-Type': 'application/json', ...CORS },
    });
  }

  try {
    const body = await request.json();
    const { action, tier, owner, key } = body;

    if (action === 'create') {
      const validTiers = ['free', 'standard', 'unlimited'];
      if (!validTiers.includes(tier)) {
        return new Response(JSON.stringify({ error: '无效的等级' }), {
          status: 400, headers: { 'Content-Type': 'application/json', ...CORS },
        });
      }
      const apiKey = await createApiKey(tier, owner || 'admin');
      return new Response(JSON.stringify({ key: apiKey.key, tier: apiKey.tier, owner: apiKey.owner }), {
        status: 201, headers: { 'Content-Type': 'application/json', ...CORS },
      });
    }

    if (action === 'revoke') {
      if (!key || typeof key !== 'string') {
        return new Response(JSON.stringify({ error: '请提供 API Key' }), {
          status: 400, headers: { 'Content-Type': 'application/json', ...CORS },
        });
      }
      const revoked = await revokeApiKey(key);
      return new Response(JSON.stringify({ revoked }), {
        headers: { 'Content-Type': 'application/json', ...CORS },
      });
    }

    return new Response(JSON.stringify({ error: '无效操作' }), {
      status: 400, headers: { 'Content-Type': 'application/json', ...CORS },
    });
  } catch {
    return new Response(JSON.stringify({ error: '请求格式错误' }), {
      status: 400, headers: { 'Content-Type': 'application/json', ...CORS },
    });
  }
};

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}
