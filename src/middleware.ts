import { defineMiddleware } from 'astro:middleware';

interface WindowEntry {
  timestamps: number[];
}

const windows = new Map<string, WindowEntry>();

const LIMITS: Record<string, { max: number; windowMs: number }> = {
  '/api/v1/diy/submit.json': { max: 3, windowMs: 60_000 },
  '/api/v1/diy/like.json': { max: 10, windowMs: 60_000 },
  '/api/v1/admin/status-override.json': { max: 10, windowMs: 60_000 },
};

function getIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp.trim();
  return '127.0.0.1';
}

export const onRequest = defineMiddleware((ctx, next) => {
  const path = ctx.url.pathname;
  const limit = LIMITS[path];
  if (!limit) return next();

  if (ctx.request.method !== 'POST') return next();

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

  if (entry.timestamps.length >= limit.max) {
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
