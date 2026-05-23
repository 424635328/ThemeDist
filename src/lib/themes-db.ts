import { nanoid } from 'nanoid';
import { get, set, zadd, zincrby, zrevrange, zscore, zcard, zrem, del, sadd, sismember, isReady } from './redis';

export type ThemeStatus = 'pending' | 'approved' | 'rejected';
export type ThemeTag = string;

export interface CommunityTheme {
  id: string;
  name: string;
  author: string;
  createdAt: number;
  likes: number;
  cssVars: Record<string, string>;
  customCss: string | null;
  status: ThemeStatus;
  tags?: ThemeTag[];
}

interface SubmitInput {
  name: string;
  author: string;
  cssVars: Record<string, string>;
  customCss?: string;
  tags?: string[];
}

function makeId(): string {
  return nanoid(8);
}

function themeKey(id: string) { return `td:theme:${id}`; }
const NEWEST_KEY = 'td:themes:by_newest';
const LIKES_KEY = 'td:themes:by_likes';
const PENDING_KEY = 'td:themes:pending';
function likesSetKey(id: string) { return `td:likes:${id}`; }

function normaliseStatus(raw: any): ThemeStatus {
  if (raw === 'pending' || raw === 'approved' || raw === 'rejected') return raw;
  return 'approved'; // back-compat: themes submitted before status field existed
}

export async function submitTheme(input: SubmitInput): Promise<CommunityTheme | null> {
  if (!isReady()) return null;

  const id = makeId();
  const theme: CommunityTheme = {
    id,
    name: input.name.trim().slice(0, 100),
    author: input.author.trim().slice(0, 50),
    createdAt: Date.now(),
    likes: 0,
    cssVars: input.cssVars,
    customCss: input.customCss || null,
    status: 'pending',
    tags: Array.isArray(input.tags) ? input.tags.filter(Boolean).slice(0, 5) : undefined,
  };

  const ok = await set(themeKey(id), theme, { ex: 86400 });
  if (!ok) return null;

  await zadd(PENDING_KEY, theme.createdAt, id);

  return theme;
}

export async function approveTheme(id: string): Promise<boolean> {
  if (!isReady()) return false;

  const theme = await get<CommunityTheme>(themeKey(id));
  if (!theme) return false;

  try {
    theme.status = normaliseStatus(theme.status);
    if (theme.status !== 'pending') return false;

    theme.status = 'approved';
    await set(themeKey(id), theme);
    await zrem(PENDING_KEY, id);
    await zadd(NEWEST_KEY, theme.createdAt, id);
    await zadd(LIKES_KEY, theme.likes, id);
    return true;
  } catch {
    return false;
  }
}

export async function rejectTheme(id: string): Promise<boolean> {
  if (!isReady()) return false;

  const theme = await get<CommunityTheme>(themeKey(id));
  if (!theme) return false;

  try {
    theme.status = normaliseStatus(theme.status);
    if (theme.status !== 'pending') return false;

    // Fully delete the theme and all associated data
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

export async function batchApproveThemes(ids: string[]): Promise<{ done: number; failed: number }> {
  let done = 0, failed = 0;
  for (const id of ids) {
    if (await approveTheme(id)) done++; else failed++;
  }
  return { done, failed };
}

export async function batchRejectThemes(ids: string[]): Promise<{ done: number; failed: number }> {
  let done = 0, failed = 0;
  for (const id of ids) {
    if (await rejectTheme(id)) done++; else failed++;
  }
  return { done, failed };
}

export async function getPendingThemes(): Promise<CommunityTheme[]> {
  if (!isReady()) return [];

  const ids = await zrevrange(PENDING_KEY, 0, -1) as string[];
  if (!ids || ids.length === 0) return [];

  const themes: CommunityTheme[] = [];
  for (const id of ids) {
    const t = await getTheme(id);
    if (t) {
      themes.push(t);
    } else {
      // Stale entry: theme key expired (24h TTL), clean up the pending index
      await zrem(PENDING_KEY, id);
    }
  }
  return themes;
}

export async function getPendingCount(): Promise<number> {
  if (!isReady()) return 0;
  return zcard(PENDING_KEY);
}

export async function getTheme(id: string): Promise<CommunityTheme | null> {
  if (!isReady()) return null;
  const t = await get<CommunityTheme>(themeKey(id));
  if (!t) return null;
  t.status = normaliseStatus(t.status);
  return t;
}

export async function listThemes(
  sort: 'new' | 'hot' = 'new',
  page: number = 1,
  pageSize: number = 20
): Promise<CommunityTheme[]> {
  if (!isReady()) return [];

  const key = sort === 'hot' ? LIKES_KEY : NEWEST_KEY;
  const start = (page - 1) * pageSize;
  const stop = start + pageSize - 1;

  const ids = await zrevrange(key, start, stop) as string[];
  if (ids.length === 0) return [];

  const themes: CommunityTheme[] = [];
  for (const id of ids) {
    const t = await getTheme(id);
    if (t) themes.push(t);
  }
  return themes;
}

export async function getTotalCount(): Promise<number> {
  if (!isReady()) return 0;
  return zcard(NEWEST_KEY);
}

export async function likeTheme(id: string, fingerprint: string): Promise<number> {
  if (!isReady()) return 0;

  const setKey = likesSetKey(id);
  const already = await sismember(setKey, fingerprint);
  if (already) {
    return (await zscore(LIKES_KEY, id)) ?? 0;
  }

  await sadd(setKey, fingerprint);
  const newScore = await zincrby(LIKES_KEY, 1, id);
  return newScore;
}

export async function hasVoted(id: string, fingerprint: string): Promise<boolean> {
  if (!isReady()) return false;
  return sismember(likesSetKey(id), fingerprint);
}

export async function getThemeWithLikes(id: string): Promise<CommunityTheme | null> {
  const theme = await getTheme(id);
  if (!theme) return null;
  if (!isReady()) return theme;
  const likes = await zscore(LIKES_KEY, id);
  if (likes !== null) theme.likes = likes;
  return theme;
}
