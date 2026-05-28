import { Redis } from '@upstash/redis';

let client: Redis | null = null;

function getClient(): Redis | null {
  if (client) return client;

  const url = import.meta.env.UPSTASH_REDIS_REST_URL
    || import.meta.env.KV_REST_API_URL
    || import.meta.env.KV_URL
    || process.env.UPSTASH_REDIS_REST_URL
    || process.env.KV_REST_API_URL
    || process.env.KV_URL;
  const token = import.meta.env.UPSTASH_REDIS_REST_TOKEN
    || import.meta.env.KV_REST_API_TOKEN
    || process.env.UPSTASH_REDIS_REST_TOKEN
    || process.env.KV_REST_API_TOKEN;

  if (!url || !token) {
    console.warn('[redis] 环境变量 UPSTASH_REDIS_REST_URL 或 KV_REST_API_URL 未设置，Redis 功能已禁用。本地开发请检查 .env.local');
    return null;
  }

  try {
    client = new Redis({ url, token });
    console.log('[redis] Upstash Redis 客户端初始化成功');
  } catch (err) {
    console.error('[redis] 创建 Redis 客户端失败:', err);
  }
  return client;
}

export function isReady(): boolean {
  return getClient() !== null;
}

// ─── Set (集合) 操作 ───

export async function sadd(key: string, ...members: string[]): Promise<number> {
  const c = getClient();
  if (!c) return 0;
  try { return await (c as any).sadd(key, ...members) as number; } catch { return 0; }
}

export async function sismember(key: string, member: string): Promise<boolean> {
  const c = getClient();
  if (!c) return false;
  try {
    const r = await c.sismember(key, member);
    return r === 1;
  } catch { return false; }
}

export async function smembers(key: string): Promise<string[]> {
  const c = getClient();
  if (!c) return [];
  try { return await c.smembers(key); } catch { return []; }
}

export async function srem(key: string, ...members: string[]): Promise<number> {
  const c = getClient();
  if (!c) return 0;
  try { return await c.srem(key, ...members); } catch { return 0; }
}

// ─── Key Value (键值对) 操作 ───

export async function get<T = any>(key: string): Promise<T | null> {
  const c = getClient();
  if (!c) return null;
  try { return await c.get<T>(key); } catch { return null; }
}

export async function set(key: string, value: any, options?: { ex?: number }): Promise<boolean> {
  const c = getClient();
  if (!c) return false;
  try {
    if (options?.ex) {
      await c.set(key, value, { ex: options.ex });
    } else {
      await c.set(key, value);
    }
    return true;
  } catch { return false; }
}

// ─── Sorted Set (有序集合) 操作 ───

export async function zadd(key: string, score: number, member: string): Promise<boolean> {
  const c = getClient();
  if (!c) return false;
  try { await c.zadd(key, { score, member }); return true; } catch { return false; }
}

export async function zincrby(key: string, increment: number, member: string): Promise<number> {
  const c = getClient();
  if (!c) return 0;
  try { return await c.zincrby(key, increment, member); } catch { return 0; }
}

export async function zrevrange(
  key: string, start: number, stop: number, withScores: true
): Promise<{ member: string; score: number }[]>;
export async function zrevrange(
  key: string, start: number, stop: number, withScores?: false
): Promise<string[]>;
export async function zrevrange(
  key: string, start: number, stop: number, withScores?: boolean
): Promise<any[]> {
  const c = getClient();
  if (!c) return [];
  try {
    const opts = withScores ? { withScores: true } : {};
    const rawResult = await c.zrange<any[]>(key, start, stop, { rev: true, ...opts });

    if (withScores && Array.isArray(rawResult)) {
      const formatted: { member: string; score: number }[] = [];
      for (let i = 0; i < rawResult.length; i += 2) {
        if (rawResult[i] !== undefined) {
          formatted.push({
            member: String(rawResult[i]),
            score: Number(rawResult[i + 1] || 0)
          });
        }
      }
      return formatted;
    }
    return rawResult || [];
  } catch (err) {
    console.error('[redis] zrevrange error:', err);
    return [];
  }
}

export async function zscore(key: string, member: string): Promise<number | null> {
  const c = getClient();
  if (!c) return null;
  try { return await c.zscore(key, member); } catch { return null; }
}

export async function zcard(key: string): Promise<number> {
  const c = getClient();
  if (!c) return 0;
  try { return await c.zcard(key); } catch { return 0; }
}

export async function zrem(key: string, member: string): Promise<boolean> {
  const c = getClient();
  if (!c) return false;
  try { await c.zrem(key, member); return true; } catch { return false; }
}

export async function zrange(key: string, start: number, stop: number): Promise<string[]> {
  const c = getClient();
  if (!c) return [];
  try { return (await c.zrange<string[]>(key, start, stop)) || []; } catch { return []; }
}

// ─── Hash (哈希) 操作 ───

export async function hgetall<T = any>(key: string): Promise<T | null> {
  const c = getClient();
  if (!c) return null;
  try { return await c.hgetall(key) as T | null; } catch { return null; }
}

export async function hset(key: string, data: Record<string, any>): Promise<number> {
  const c = getClient();
  if (!c) return 0;
  try { return await c.hset(key, data); } catch { return 0; }
}

// ─── Generic (通用) 操作 ───

export async function expire(key: string, seconds: number): Promise<boolean> {
  const c = getClient();
  if (!c) return false;
  try { await c.expire(key, seconds); return true; } catch { return false; }
}

export async function del(key: string): Promise<boolean> {
  const c = getClient();
  if (!c) return false;
  try { await c.del(key); return true; } catch { return false; }
}

// ─── HyperLogLog 操作 ───

export async function pfadd(key: string, ...elements: string[]): Promise<boolean> {
  const c = getClient();
  if (!c) return false;
  try { await c.pfadd(key, ...elements); return true; } catch { return false; }
}

export async function pfcount(key: string): Promise<number> {
  const c = getClient();
  if (!c) return 0;
  try { return await c.pfcount(key); } catch { return 0; }
}
