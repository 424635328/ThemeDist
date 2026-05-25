import { isReady, zrevrange } from '../../../lib/redis';
import { cacheGet, cacheSet } from '../../../lib/cache';

export const prerender = false;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const CACHE_KEY = 'trending:top20';
const CACHE_TTL = 300_000; // 5 min

export async function GET() {
  try {
    const cached = cacheGet<any[]>(CACHE_KEY);
    if (cached) {
      return new Response(JSON.stringify({ trending: cached, cached: true, apiVersion: 'v1' }, null, 2), {
        headers: { 'Content-Type': 'application/json; charset=utf-8', ...CORS_HEADERS, 'Cache-Control': 'public, max-age=300' },
      });
    }

    const merged: Map<string, { preset: string; likes: number; usage: number }> = new Map();

    if (isReady()) {
      // Get likes leaderboard
      const likesData = await zrevrange('td:themes:by_likes', 0, 49, true);
      for (const { member, score } of likesData) {
        merged.set(member, { preset: member, likes: score, usage: 0 });
      }

      // Get usage leaderboard
      const usageData = await zrevrange('td:stats:theme_usage', 0, 49, true);
      for (const { member, score } of usageData) {
        const existing = merged.get(member);
        if (existing) {
          existing.usage = score;
        } else {
          merged.set(member, { preset: member, likes: 0, usage: score });
        }
      }
    }

    // Calculate hotness score
    const scored = Array.from(merged.values())
      .map(t => ({
        ...t,
        hotness: t.likes * 10 + t.usage * 1,
      }))
      .sort((a, b) => b.hotness - a.hotness)
      .slice(0, 20);

    cacheSet(CACHE_KEY, scored, CACHE_TTL);

    return new Response(JSON.stringify({ trending: scored, apiVersion: 'v1' }, null, 2), {
      headers: { 'Content-Type': 'application/json; charset=utf-8', ...CORS_HEADERS, 'Cache-Control': 'public, max-age=300' },
    });
  } catch (err) {
    console.error('[v1/trending.json] Error:', err);
    return new Response(JSON.stringify({ error: '内部服务错误' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  }
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}
