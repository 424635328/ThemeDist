import { getAllThemes } from '../../../../utils/daily-theme';
import { getCommunityThemes } from '../../../../utils/omni-bridge';
import { extractRgbChannels } from '../../../../utils/color';

export const prerender = false;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function colorDistance(hex1: string, hex2: string): number {
  const c1 = extractRgbChannels(hex1);
  const c2 = extractRgbChannels(hex2);
  if (!c1 || !c2) return Infinity;
  const [r1, g1, b1] = c1.split(',').map(Number);
  const [r2, g2, b2] = c2.split(',').map(Number);
  return Math.pow(r1 - r2, 2) + Math.pow(g1 - g2, 2) + Math.pow(b1 - b2, 2);
}

export async function GET({ url }: { url: URL }) {
  try {
    const hex = url.searchParams.get('hex') || '';
    const limit = Math.min(50, Math.max(1, parseInt(url.searchParams.get('limit') || '10')));

    if (!/^[0-9a-fA-F]{3,8}$/.test(hex)) {
      return new Response(JSON.stringify({ error: '请提供有效的 hex 颜色值，如 ?hex=4285f4' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
      });
    }

    const targetHex = hex.length === 3
      ? `#${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`
      : `#${hex}`;

    const staticThemes = getAllThemes();
    const communityThemes = await getCommunityThemes(100);

    const all: Array<{ preset: string; name: string; primary: string; distance: number }> = [];

    for (const t of staticThemes) {
      const pri = t.cssVars['--color-primary'] || '#000';
      all.push({ preset: t.preset, name: t.presetName, primary: pri, distance: colorDistance(targetHex, pri) });
    }
    for (const t of communityThemes) {
      const pri = t.cssVars['--color-primary'] || '#000';
      all.push({ preset: t.preset, name: t.presetName, primary: pri, distance: colorDistance(targetHex, pri) });
    }

    all.sort((a, b) => a.distance - b.distance);
    const results = all.slice(0, limit);

    return new Response(JSON.stringify({
      query: targetHex,
      total: all.length,
      results,
      apiVersion: 'v1',
    }, null, 2), {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, max-age=300',
        ...CORS_HEADERS,
      },
    });
  } catch (err) {
    console.error('[v1/search/color.json] Error:', err);
    return new Response(JSON.stringify({ error: '内部服务错误' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  }
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}
