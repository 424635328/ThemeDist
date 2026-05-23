import { i as isAdmin } from './auth_Ccxb5js3.mjs';
import { c as getPendingThemes, g as getPendingCount, b as batchApproveThemes, a as batchRejectThemes } from './themes-db_Atg0GKXN.mjs';

const prerender = false;
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};
async function GET({ cookies }) {
  if (!isAdmin(cookies)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json", ...CORS }
    });
  }
  const [themes, count] = await Promise.all([getPendingThemes(), getPendingCount()]);
  return new Response(JSON.stringify({ themes, pending: count }), {
    status: 200,
    headers: { "Content-Type": "application/json", ...CORS }
  });
}
async function POST({ request, cookies }) {
  if (!isAdmin(cookies)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json", ...CORS }
    });
  }
  try {
    const body = await request.json();
    const { action, ids } = body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return new Response(JSON.stringify({ error: "请选择至少一个主题" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...CORS }
      });
    }
    if (action === "approve") {
      const result = await batchApproveThemes(ids);
      return new Response(JSON.stringify({ success: true, ...result }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...CORS }
      });
    }
    if (action === "reject") {
      const result = await batchRejectThemes(ids);
      return new Response(JSON.stringify({ success: true, ...result }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...CORS }
      });
    }
    return new Response(JSON.stringify({ error: `未知操作: ${action}` }), {
      status: 400,
      headers: { "Content-Type": "application/json", ...CORS }
    });
  } catch {
    return new Response(JSON.stringify({ error: "请求格式错误" }), {
      status: 400,
      headers: { "Content-Type": "application/json", ...CORS }
    });
  }
}
function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  OPTIONS,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
