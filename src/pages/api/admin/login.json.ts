export const prerender = false;

import { verifyCredentials, setAdminCookie, clearAdminCookie } from '../../../lib/auth';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const NO_CACHE = { 'Cache-Control': 'no-store' };

export async function POST({ request, cookies }: { request: Request; cookies: any }) {
  try {
    const body = await request.json();
    const { account, password, action } = body;

    if (action === 'logout') {
      clearAdminCookie(cookies);
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...CORS, ...NO_CACHE },
      });
    }

    if (!account || !password) {
      return new Response(JSON.stringify({ error: '请输入账号和密码' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...CORS, ...NO_CACHE },
      });
    }

    if (verifyCredentials(account, password)) {
      setAdminCookie(cookies);
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...CORS, ...NO_CACHE },
      });
    }

    return new Response(JSON.stringify({ error: '账号或密码错误' }), {
      status: 401,
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
