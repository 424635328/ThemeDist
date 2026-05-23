import { nanoid } from 'nanoid';
import { i as isReady, c as zcard, h as zrevrange, f as zrem, b as sismember, j as zscore, s as sadd, e as zincrby, a as set, z as zadd, g as get, d as del } from './redis_EXBth6OG.mjs';

function makeId() {
  return nanoid(8);
}
function themeKey(id) {
  return `td:theme:${id}`;
}
const NEWEST_KEY = "td:themes:by_newest";
const LIKES_KEY = "td:themes:by_likes";
const PENDING_KEY = "td:themes:pending";
function likesSetKey(id) {
  return `td:likes:${id}`;
}
function normaliseStatus(raw) {
  if (raw === "pending" || raw === "approved" || raw === "rejected") return raw;
  return "approved";
}
async function submitTheme(input) {
  if (!isReady()) return null;
  const id = makeId();
  const theme = {
    id,
    name: input.name.trim().slice(0, 100),
    author: input.author.trim().slice(0, 50),
    createdAt: Date.now(),
    likes: 0,
    cssVars: input.cssVars,
    customCss: input.customCss || null,
    status: "pending"
  };
  const ok = await set(themeKey(id), theme, { ex: 86400 });
  if (!ok) return null;
  await zadd(PENDING_KEY, theme.createdAt, id);
  return theme;
}
async function approveTheme(id) {
  if (!isReady()) return false;
  const theme = await get(themeKey(id));
  if (!theme) return false;
  try {
    theme.status = normaliseStatus(theme.status);
    if (theme.status !== "pending") return false;
    theme.status = "approved";
    await set(themeKey(id), theme);
    await zrem(PENDING_KEY, id);
    await zadd(NEWEST_KEY, theme.createdAt, id);
    await zadd(LIKES_KEY, theme.likes, id);
    return true;
  } catch {
    return false;
  }
}
async function rejectTheme(id) {
  if (!isReady()) return false;
  const theme = await get(themeKey(id));
  if (!theme) return false;
  try {
    theme.status = normaliseStatus(theme.status);
    if (theme.status !== "pending") return false;
    await del(themeKey(id));
    await zrem(PENDING_KEY, id);
    await zrem(NEWEST_KEY, id);
    await zrem(LIKES_KEY, id);
    await del(likesSetKey(id));
    return true;
  } catch {
    return false;
  }
}
async function batchApproveThemes(ids) {
  let done = 0, failed = 0;
  for (const id of ids) {
    if (await approveTheme(id)) done++;
    else failed++;
  }
  return { done, failed };
}
async function batchRejectThemes(ids) {
  let done = 0, failed = 0;
  for (const id of ids) {
    if (await rejectTheme(id)) done++;
    else failed++;
  }
  return { done, failed };
}
async function getPendingThemes() {
  if (!isReady()) return [];
  const ids = await zrevrange(PENDING_KEY, 0, -1);
  if (!ids || ids.length === 0) return [];
  const themes = [];
  for (const id of ids) {
    const t = await getTheme(id);
    if (t) {
      themes.push(t);
    } else {
      await zrem(PENDING_KEY, id);
    }
  }
  return themes;
}
async function getPendingCount() {
  if (!isReady()) return 0;
  return zcard(PENDING_KEY);
}
async function getTheme(id) {
  if (!isReady()) return null;
  const t = await get(themeKey(id));
  if (!t) return null;
  t.status = normaliseStatus(t.status);
  return t;
}
async function listThemes(sort = "new", page = 1, pageSize = 20) {
  if (!isReady()) return [];
  const key = sort === "hot" ? LIKES_KEY : NEWEST_KEY;
  const start = (page - 1) * pageSize;
  const stop = start + pageSize - 1;
  const ids = await zrevrange(key, start, stop);
  if (ids.length === 0) return [];
  const themes = [];
  for (const id of ids) {
    const t = await getTheme(id);
    if (t) themes.push(t);
  }
  return themes;
}
async function getTotalCount() {
  if (!isReady()) return 0;
  return zcard(NEWEST_KEY);
}
async function likeTheme(id, fingerprint) {
  if (!isReady()) return 0;
  const setKey = likesSetKey(id);
  const already = await sismember(setKey, fingerprint);
  if (already) {
    return await zscore(LIKES_KEY, id) ?? 0;
  }
  await sadd(setKey, fingerprint);
  const newScore = await zincrby(LIKES_KEY, 1, id);
  return newScore;
}
async function hasVoted(id, fingerprint) {
  if (!isReady()) return false;
  return sismember(likesSetKey(id), fingerprint);
}
async function getThemeWithLikes(id) {
  const theme = await getTheme(id);
  if (!theme) return null;
  if (!isReady()) return theme;
  const likes = await zscore(LIKES_KEY, id);
  if (likes !== null) theme.likes = likes;
  return theme;
}

export { batchRejectThemes as a, batchApproveThemes as b, getPendingThemes as c, getThemeWithLikes as d, getTotalCount as e, listThemes as f, getPendingCount as g, hasVoted as h, likeTheme as l, submitTheme as s };
