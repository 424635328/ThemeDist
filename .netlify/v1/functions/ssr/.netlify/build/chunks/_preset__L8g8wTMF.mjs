import { g as getAllOmniThemes } from './omni-bridge_C96fFqzW.mjs';
import { g as get } from './redis_EXBth6OG.mjs';

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};
async function getStaticPaths() {
  const themes = getAllOmniThemes();
  return themes.map((t) => ({
    params: { preset: t.preset }
  }));
}
async function GET({ params }) {
  const presetId = params.preset;
  if (presetId.startsWith("community-")) {
    const redisId = presetId.slice("community-".length);
    try {
      const ct = await get(`td:theme:${redisId}`);
      if (ct) {
        return new Response(
          JSON.stringify({
            preset: presetId,
            presetName: ct.name,
            cssVars: ct.cssVars,
            customCss: ct.customCss || null,
            extensions: null,
            logoText: null,
            logoColors: null
          }),
          {
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "public, max-age=3600",
              ...CORS_HEADERS
            }
          }
        );
      }
    } catch {
    }
    return new Response(JSON.stringify({ error: "Theme not found", code: 404 }), {
      status: 404,
      headers: { "Content-Type": "application/json", ...CORS_HEADERS }
    });
  }
  const themes = getAllOmniThemes();
  const theme = themes.find((t) => t.preset === presetId);
  if (!theme) {
    return new Response(JSON.stringify({ error: "Theme not found", code: 404 }), {
      status: 404,
      headers: {
        "Content-Type": "application/json",
        ...CORS_HEADERS
      }
    });
  }
  return new Response(
    JSON.stringify(
      {
        preset: theme.preset,
        presetName: theme.presetName,
        cssVars: theme.cssVars,
        customCss: theme.customCss || null,
        extensions: theme.extensions || null,
        logoText: theme.logoText || null,
        logoColors: theme.logoColors || null
      },
      null,
      2
    ),
    {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=86400, s-maxage=31536000, immutable",
        ...CORS_HEADERS
      }
    }
  );
}
function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS
  });
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  OPTIONS,
  getStaticPaths
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
