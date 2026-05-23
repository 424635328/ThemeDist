import { f as listThemes, e as getTotalCount } from './themes-db_Atg0GKXN.mjs';
import { i as isReady } from './redis_EXBth6OG.mjs';

const prerender = false;
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};
async function GET({ url }) {
  if (!isReady()) {
    return new Response(JSON.stringify({ themes: [], total: 0, dbAvailable: false }), {
      status: 200,
      headers: { "Content-Type": "application/json", "Cache-Control": "public, max-age=60", ...CORS }
    });
  }
  const sort = url.searchParams.get("sort") || "new";
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1"));
  const pageSize = Math.min(50, Math.max(1, parseInt(url.searchParams.get("size") || "20")));
  const [themes, total] = await Promise.all([
    listThemes(sort, page, pageSize),
    getTotalCount()
  ]);
  return new Response(JSON.stringify({ themes, total, dbAvailable: true }), {
    status: 200,
    headers: { "Content-Type": "application/json", "Cache-Control": "public, max-age=60", ...CORS }
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
