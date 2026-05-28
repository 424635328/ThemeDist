import { defineMiddleware } from 'astro:middleware';
import { getDailyTheme } from './utils/daily-theme';
import { getDailyCommunityTheme, enrichCssVars } from './utils/omni-bridge';
import { get as redisGet } from './lib/redis';
import { STATUS_THEMES } from './lib/status-themes';
import { STRUCTURAL_CSS_VARS } from './lib/css-vars-defaults';
import { cacheGet, cacheSet } from './lib/cache';
import { validateApiKey } from './lib/api-keys';

interface WindowEntry {
  timestamps: number[];
}

const windows = new Map<string, WindowEntry>();

const LIMITS: Record<string, { max: number; windowMs: number }> = {
  '/api/v1/diy/submit.json': { max: 3, windowMs: 60_000 },
  '/api/v1/diy/fork.json': { max: 3, windowMs: 60_000 },
  '/api/v1/diy/like.json': { max: 10, windowMs: 60_000 },
  '/api/v1/admin/status-override.json': { max: 10, windowMs: 60_000 },
};

/** Tier multipliers for rate limits. */
const TIER_MULTIPLIERS: Record<string, number> = {
  'free': 1,
  'standard': 10,
  'unlimited': Infinity,
};

function getIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp.trim();
  return '127.0.0.1';
}

export const onRequest = defineMiddleware(async (ctx, next) => {
  // Theme pre-resolution for HTML page requests (FOUC elimination)
  const path = ctx.url.pathname;
  const method = ctx.request.method;

  if (
    method === 'GET' &&
    !path.startsWith('/api/') &&
    !path.match(/\.(js|css|svg|png|ico|json)$/)
  ) {
    const today = new Date().toISOString().slice(0, 10);
    const cacheKey = `edge:theme:${today}`;

    let cssVars = cacheGet<Record<string, string>>(cacheKey);

    if (!cssVars) {
      // Resolve base theme (community or daily)
      const communityDaily = await getDailyCommunityTheme();
      const theme = communityDaily || getDailyTheme();
      cssVars = theme.cssVars;

      // Apply status override if active
      const override = await redisGet<{ status: string; activatedAt: string }>(
        'td:status-override'
      );
      if (override && STATUS_THEMES[override.status]) {
        cssVars = enrichCssVars({
          ...STATUS_THEMES[override.status],
          ...STRUCTURAL_CSS_VARS,
        });
      }

      cacheSet(cacheKey, cssVars, 2 * 60 * 1000);
    }

    ctx.locals.todayTheme = { cssVars };
  }

  // Rate limiting (with API key tier support)
  const limit = LIMITS[path];
  if (!limit) return next();

  if (ctx.request.method !== 'POST') return next();

  // Test mode bypass: skip rate limiting when THEMEDIST_TEST_MODE=1
  if (process.env.THEMEDIST_TEST_MODE === '1') return next();

  // Check for API key
  const apiKeyHeader = ctx.request.headers.get('x-api-key');
  const apiKeyParam = ctx.url.searchParams.get('api_key');
  const apiKeyStr = apiKeyHeader || apiKeyParam;

  let effectiveMax = limit.max;
  if (apiKeyStr) {
    const keyData = await validateApiKey(apiKeyStr);
    if (keyData) {
      const multiplier = TIER_MULTIPLIERS[keyData.tier] ?? 1;
      if (multiplier === Infinity) return next(); // unlimited tier bypasses rate limiting
      effectiveMax = limit.max * multiplier;
    }
  }

  const ip = getIp(ctx.request);
  const key = `${ip}:${path}`;

  const now = Date.now();
  let entry = windows.get(key);
  if (!entry) {
    entry = { timestamps: [] };
    windows.set(key, entry);
  }

  // Prune expired timestamps
  entry.timestamps = entry.timestamps.filter((t) => now - t < limit.windowMs);

  if (entry.timestamps.length >= effectiveMax) {
    return new Response(JSON.stringify({ error: '请求过于频繁，请稍后再试' }), {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': String(Math.ceil(limit.windowMs / 1000)),
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  entry.timestamps.push(now);

  // Cleanup stale entries periodically (keep Map from growing unbounded)
  if (windows.size > 10_000) {
    for (const [k, v] of windows) {
      if (v.timestamps.length === 0 || now - v.timestamps[v.timestamps.length - 1] > limit.windowMs * 2) {
        windows.delete(k);
      }
    }
  }

  return next();
});
