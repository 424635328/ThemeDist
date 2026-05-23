export const prerender = false;

import { verifyCredentials, setAdminCookie, clearAdminCookie } from '../../../lib/auth';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function POST({ request, cookies }: { request: Request; cookies: any }) {
  try {
    const body = await request.json();
    const { account, password, action } = body;

    if (action === 'logout') {
      clearAdminCookie(cookies);
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...CORS },
      });
    }

    if (!account || !password) {
      return new Response(JSON.stringify({ error: '请输入账号和密码' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...CORS },
      });
    }

    if (verifyCredentials(account, password)) {
      setAdminCookie(cookies);
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...CORS },
      });
    }

    return new Response(JSON.stringify({ error: '账号或密码错误' }), {
      status: 401,
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
