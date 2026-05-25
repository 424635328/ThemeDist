import { getAllThemes } from '../../../../utils/daily-theme';
import { getCommunityThemes } from '../../../../utils/omni-bridge';

export const prerender = false;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function GET({ url }: { url: URL }) {
  try {
    const pool = url.searchParams.get('pool') || 'all';
    const seed = url.searchParams.get('seed');

    let themes: any[] = [];

    if (pool === 'static' || pool === 'all') {
      themes.push(...getAllThemes());
    }
    if (pool === 'community' || pool === 'all') {
      const community = await getCommunityThemes(50);
      themes.push(...community);
    }

    if (themes.length === 0) {
      return new Response(JSON.stringify({ error: '主题池为空' }), {
        status: 503,
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
      });
    }

    let idx: number;
    if (seed && !isNaN(Number(seed))) {
      // Deterministic "random" from seed
      idx = Math.abs(hashSeed(Number(seed))) % themes.length;
    } else {
      idx = Math.floor(Math.random() * themes.length);
    }

    const theme = themes[idx];

    return new Response(JSON.stringify({
      preset: theme.preset,
      presetName: theme.presetName,
      cssVars: theme.cssVars,
      customCss: theme.customCss || null,
      extensions: theme.extensions || null,
      logoText: theme.logoText || null,
      logoColors: theme.logoColors || null,
      tags: theme.tags || null,
      apiVersion: 'v1',
    }, null, 2), {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        ...CORS_HEADERS,
      },
    });
  } catch (err) {
    console.error('[v1/theme/random.json] Error:', err);
    return new Response(JSON.stringify({ error: '内部服务错误' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  }
}

function hashSeed(n: number): number {
  let h = 0;
  const s = String(n);
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h) + s.charCodeAt(i);
    h |= 0;
  }
  return h;
}

export function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}
