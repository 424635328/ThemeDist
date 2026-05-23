import { i as isReady } from './redis_EXBth6OG.mjs';
import { g as getPendingCount, e as getTotalCount } from './themes-db_Atg0GKXN.mjs';

const prerender = false;
async function GET() {
  const ready = isReady();
  const pending = ready ? await getPendingCount() : -1;
  const approved = ready ? await getTotalCount() : -1;
  return new Response(JSON.stringify({
    redis: ready ? "connected" : "disconnected",
    pending,
    approved
  }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
