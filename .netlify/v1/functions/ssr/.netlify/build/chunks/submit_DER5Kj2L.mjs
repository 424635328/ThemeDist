import { s as submitTheme } from './themes-db_Atg0GKXN.mjs';
import { i as isReady } from './redis_EXBth6OG.mjs';

const prerender = false;
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};
async function POST({ request }) {
  if (!isReady()) {
    return new Response(JSON.stringify({ error: "数据库暂时不可用" }), {
      status: 503,
      headers: { "Content-Type": "application/json", ...CORS }
    });
  }
  try {
    const body = await request.json();
    const { name, author, cssVars, customCss } = body;
    if (!name || !author || !cssVars || typeof cssVars !== "object") {
      return new Response(JSON.stringify({ error: "缺少必填字段: name, author, cssVars" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...CORS }
      });
    }
    if (!cssVars["--color-primary"] || !cssVars["--color-bg"]) {
      return new Response(JSON.stringify({ error: "cssVars 必须包含 --color-primary 和 --color-bg" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...CORS }
      });
    }
    const theme = await submitTheme({ name, author, cssVars, customCss });
    if (!theme) {
      return new Response(JSON.stringify({ error: "提交失败，请稍后重试" }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...CORS }
      });
    }
    return new Response(JSON.stringify({ success: true, theme }), {
      status: 201,
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
  OPTIONS,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
