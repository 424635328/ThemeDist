import { Redis } from '@upstash/redis';

let client = null;
let disabled = false;
function getClient() {
  if (disabled) return null;
  if (client) return client;
  const url = "https://primary-owl-131346.upstash.io";
  const token = "gQAAAAAAAgESAAIgcDFlYTBmZDFlYTQzOWU0ZjVhYjYyYzk2NWRmMGIyMTA3Zg";
  try {
    client = new Redis({ url, token });
    console.log("[redis] Upstash Redis 客户端初始化成功");
  } catch (err) {
    console.error("[redis] 创建 Redis 客户端失败:", err);
    disabled = true;
  }
  return client;
}
function isReady() {
  return getClient() !== null;
}
async function sadd(key, ...members) {
  const c = getClient();
  if (!c) return 0;
  try {
    return await c.sadd(key, ...members);
  } catch {
    return 0;
  }
}
async function sismember(key, member) {
  const c = getClient();
  if (!c) return false;
  try {
    const r = await c.sismember(key, member);
    return r === 1 || r === true;
  } catch {
    return false;
  }
}
async function get(key) {
  const c = getClient();
  if (!c) return null;
  try {
    return await c.get(key);
  } catch {
    return null;
  }
}
async function set(key, value, options) {
  const c = getClient();
  if (!c) return false;
  try {
    if (options?.ex) {
      await c.set(key, value, { ex: options.ex });
    } else {
      await c.set(key, value);
    }
    return true;
  } catch {
    return false;
  }
}
async function zadd(key, score, member) {
  const c = getClient();
  if (!c) return false;
  try {
    await c.zadd(key, { score, member });
    return true;
  } catch {
    return false;
  }
}
async function zincrby(key, increment, member) {
  const c = getClient();
  if (!c) return 0;
  try {
    return await c.zincrby(key, increment, member);
  } catch {
    return 0;
  }
}
async function zrevrange(key, start, stop, withScores) {
  const c = getClient();
  if (!c) return [];
  try {
    const opts = withScores ? { withScores: true } : {};
    const rawResult = await c.zrange(key, start, stop, { rev: true, ...opts });
    if (withScores && Array.isArray(rawResult)) ;
    return rawResult || [];
  } catch (err) {
    console.error("[redis] zrevrange error:", err);
    return [];
  }
}
async function zscore(key, member) {
  const c = getClient();
  if (!c) return null;
  try {
    return await c.zscore(key, member);
  } catch {
    return null;
  }
}
async function zcard(key) {
  const c = getClient();
  if (!c) return 0;
  try {
    return await c.zcard(key);
  } catch {
    return 0;
  }
}
async function zrem(key, member) {
  const c = getClient();
  if (!c) return false;
  try {
    await c.zrem(key, member);
    return true;
  } catch {
    return false;
  }
}
async function del(key) {
  const c = getClient();
  if (!c) return false;
  try {
    await c.del(key);
    return true;
  } catch {
    return false;
  }
}

export { set as a, sismember as b, zcard as c, del as d, zincrby as e, zrem as f, get as g, zrevrange as h, isReady as i, zscore as j, sadd as s, zadd as z };
