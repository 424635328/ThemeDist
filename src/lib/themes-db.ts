import { nanoid } from 'nanoid';
import { get, set, zadd, zincrby, zrevrange, zscore, zcard, sadd, sismember, isReady } from './redis';

export interface CommunityTheme {
  id: string;
  name: string;
  author: string;
  createdAt: number;
  likes: number;
  cssVars: Record<string, string>;
  customCss: string | null;
}

interface SubmitInput {
  name: string;
  author: string;
  cssVars: Record<string, string>;
  customCss?: string;
}

function makeId(): string {
  return nanoid(8);
}

function themeKey(id: string) { return `td:theme:${id}`; }
const NEWEST_KEY = 'td:themes:by_newest';
const LIKES_KEY = 'td:themes:by_likes';
function likesSetKey(id: string) { return `td:likes:${id}`; }

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
  };

  const ok = await set(themeKey(id), JSON.stringify(theme));
  if (!ok) return null;

  await zadd(NEWEST_KEY, theme.createdAt, id);
  await zadd(LIKES_KEY, 0, id);

  return theme;
}

export async function getTheme(id: string): Promise<CommunityTheme | null> {
  if (!isReady()) return null;
  const raw = await get(themeKey(id));
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
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
    // Unlike
    await sadd(setKey, fingerprint); // noop
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
