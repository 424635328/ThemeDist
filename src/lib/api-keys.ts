import { get, set, del, zadd, zrange } from './redis';
import { nanoid } from 'nanoid';

export interface ApiKeyData {
  key: string;
  tier: 'free' | 'standard' | 'unlimited';
  owner: string;
  createdAt: number;
  lastUsed: number;
}

export async function createApiKey(tier: 'free' | 'standard' | 'unlimited', owner: string): Promise<ApiKeyData> {
  const key = 'td_' + nanoid(32);
  const data: ApiKeyData = { key, tier, owner, createdAt: Date.now(), lastUsed: 0 };
  await set(`td:apikey:${key}`, JSON.stringify(data));
  await zadd('td:apikeys:index', data.createdAt, key);
  return data;
}

export async function validateApiKey(key: string): Promise<ApiKeyData | null> {
  if (!key || !key.startsWith('td_')) return null;
  const raw = await get<string>(`td:apikey:${key}`);
  if (!raw) return null;
  try {
    const data = typeof raw === 'string' ? JSON.parse(raw) : raw;
    data.lastUsed = Date.now();
    await set(`td:apikey:${key}`, JSON.stringify(data));
    return data;
  } catch { return null; }
}

export async function revokeApiKey(key: string): Promise<boolean> {
  return await del(`td:apikey:${key}`);
}

export async function listApiKeys(): Promise<ApiKeyData[]> {
  const indexKey = 'td:apikeys:index';
  const keys = await zrange(indexKey, 0, -1);
  const results: ApiKeyData[] = [];
  for (const k of keys) {
    const raw = await get<string>(`td:apikey:${k}`);
    if (raw) {
      try { results.push(typeof raw === 'string' ? JSON.parse(raw) : raw); } catch {}
    }
  }
  return results;
}
