import { d as getThemeWithLikes } from './themes-db_Atg0GKXN.mjs';
import { i as isReady } from './redis_EXBth6OG.mjs';

const prerender = false;
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};
async function GET({ url }) {
  const id = url.searchParams.get("id");
  if (!id) {
    return new Response(JSON.stringify({ error: "缺少 id 参数" }), {
      status: 400,
      headers: { "Content-Type": "application/json", ...CORS }
    });
  }
  if (!isReady()) {
    return new Response(JSON.stringify({ error: "数据库暂时不可用" }), {
      status: 503,
      headers: { "Content-Type": "application/json", ...CORS }
    });
  }
  const theme = await getThemeWithLikes(id);
  if (!theme) {
    console.error(`[theme.json] 主题不存在: id=${id}, isReady=${isReady()}`);
    return new Response(JSON.stringify({ error: "主题不存在" }), {
      status: 404,
      headers: { "Content-Type": "application/json", ...CORS }
    });
  }
  return new Response(JSON.stringify(theme), {
    status: 200,
    headers: { "Content-Type": "application/json", "Cache-Control": "public, max-age=300", ...CORS }
  });
}
function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  OPTIONS,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
