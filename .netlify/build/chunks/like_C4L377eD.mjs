import { l as likeTheme, h as hasVoted } from './themes-db_Atg0GKXN.mjs';
import { i as isReady } from './redis_EXBth6OG.mjs';

const prerender = false;
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};
function getFingerprint(request) {
  const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "0.0.0.0";
  const ua = request.headers.get("user-agent") || "";
  let hash = 0;
  const str = ip + "|" + ua.slice(0, 64);
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i) | 0;
  }
  return String(hash);
}
async function POST({ request }) {
  if (!isReady()) {
    return new Response(JSON.stringify({ error: "数据库暂时不可用" }), {
      status: 503,
      headers: { "Content-Type": "application/json", ...CORS }
    });
  }
  try {
    const body = await request.json();
    const { id } = body;
    if (!id) {
      return new Response(JSON.stringify({ error: "缺少 id" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...CORS }
      });
    }
    const fp = getFingerprint(request);
    const likes = await likeTheme(id, fp);
    const voted = await hasVoted(id, fp);
    return new Response(JSON.stringify({ likes, voted }), {
      status: 200,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store", ...CORS }
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
