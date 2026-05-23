import { Redis } from '@upstash/redis';

let client: Redis | null = null;
let disabled = false;

function getClient(): Redis | null {
  if (disabled) return null;
  if (client) return client;

  const url = import.meta.env.KV_REST_API_URL;
  const token = import.meta.env.KV_REST_API_TOKEN;

  if (!url || !token) {
    disabled = true;
    return null;
  }

  try {
    client = new Redis({ url, token });
  } catch {
    disabled = true;
  }
  return client;
}

export function isReady(): boolean {
  return getClient() !== null;
}

export async function sadd(key: string, ...members: string[]): Promise<number> {
  const c = getClient();
  if (!c) return 0;
  try { return await c.sadd(key, ...members); } catch { return 0; }
}

export async function sismember(key: string, member: string): Promise<boolean> {
  const c = getClient();
  if (!c) return false;
  try {
    const r = await c.sismember(key, member);
    return r === 1;
  } catch { return false; }
}

export async function get(key: string): Promise<string | null> {
  const c = getClient();
  if (!c) return null;
  try { return await c.get<string>(key); } catch { return null; }
}

export async function set(key: string, value: string): Promise<boolean> {
  const c = getClient();
  if (!c) return false;
  try { await c.set(key, value); return true; } catch { return false; }
}

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
  key: string, start: number, stop: number, withScores?: boolean
): Promise<string[] | { member: string; score: number }[]> {
  const c = getClient();
  if (!c) return [];
  try {
    const opts = withScores ? { withScores: true } : {};
    return await c.zrange(key, start, stop, { rev: true, ...opts });
  } catch { return []; }
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
