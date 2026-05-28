import { nanoid } from 'nanoid';
import { get, set, zadd, zincrby, zrevrange, zscore, zcard, zrem, del, sadd, sismember, isReady } from './redis';

export type ThemeStatus = 'pending' | 'approved' | 'rejected';
export type ThemeTag = string;

import type { AnyExtension, ClickEffectConfig } from '../themes/types';
import { validateUserExtensions } from '../utils/sanitize';

export interface CommunityTheme {
  id: string;
  name: string;
  author: string;
  createdAt: number;
  /** Timestamp when the theme was approved (ms). Used for 24h rollback window. */
  approvedAt?: number;
  /** Admin account name who approved this theme. */
  reviewedBy?: string;
  likes: number;
  cssVars: Record<string, string>;
  customCss: string | null;
  /** Declarative extensions — only 'floating' type from user submissions */
  extensions?: AnyExtension[] | null;
  status: ThemeStatus;
  tags?: ThemeTag[];
  clickEffect?: ClickEffectConfig | null;
  forkedFrom?: string;
}

interface SubmitInput {
  name: string;
  author: string;
  cssVars: Record<string, string>;
  customCss?: string | null;
  extensions?: any[];
  tags?: string[];
  clickEffect?: any;
  forkedFrom?: string;
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
    extensions: validateUserExtensions(input.extensions) ?? null,
    status: 'pending',
    tags: Array.isArray(input.tags) ? input.tags.filter(Boolean).slice(0, 5) : undefined,
    clickEffect: input.clickEffect || null,
    forkedFrom: input.forkedFrom || undefined,
  };

  const ok = await set(themeKey(id), theme, { ex: 86400 });
  if (!ok) return null;

  // Pending themes only go to review queue, not public indexes
  await zadd(PENDING_KEY, theme.createdAt, id);

  return theme;
}

export async function approveTheme(id: string, reviewedBy?: string): Promise<boolean> {
  if (!isReady()) return false;

  const theme = await get<CommunityTheme>(themeKey(id));
  if (!theme) return false;

  try {
    theme.status = normaliseStatus(theme.status);
    if (theme.status === 'approved') {
      await zrem(PENDING_KEY, id); // clean up review queue
      return true;
    }
    if (theme.status !== 'pending') return false;

    theme.status = 'approved';
    theme.approvedAt = Date.now();
    if (reviewedBy) theme.reviewedBy = reviewedBy;
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
    if (theme.status !== 'pending' && theme.status !== 'approved') return false;

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

export async function batchApproveThemes(ids: string[], reviewedBy?: string): Promise<{ done: number; failed: number }> {
  let done = 0, failed = 0;
  for (const id of ids) {
    if (await approveTheme(id, reviewedBy)) done++; else failed++;
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
    if (!t) {
      // Stale entry: theme key expired (24h TTL), clean up the index
      await zrem(key, id);
      if (key !== LIKES_KEY) await zrem(LIKES_KEY, id);
      continue;
    }
    const likes = await zscore(LIKES_KEY, id);
    if (likes !== null) t.likes = likes;
    themes.push(t);
  }
  return themes;
}

export async function getTotalCount(): Promise<number> {
  if (!isReady()) return 0;
  return zcard(NEWEST_KEY);
}

export async function likeTheme(id: string, fingerprint: string): Promise<number | null> {
  if (!isReady()) return null;

  // Verify the theme exists before allowing a like
  const existing = await get<CommunityTheme>(themeKey(id));
  if (!existing) return null;

  const setKey = likesSetKey(id);

  // Use sadd return value as the atomic dedup check — if it returns 0,
  // the member already existed and we should NOT increment.
  const added = await sadd(setKey, fingerprint);
  if (added === 0) {
    return (await zscore(LIKES_KEY, id)) ?? 0;
  }

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

/** 24-hour rollback window (ms). Approved themes can be reverted to pending within this period. */
const REVERT_WINDOW = 24 * 60 * 60 * 1000;

/**
 * Rollback an approved theme back to the pending review queue.
 * Only works within 24 hours of approval. Preserves the original createdAt
 * timestamp so the theme's queue priority (TTL) continues uninterrupted.
 */
export async function rollbackTheme(id: string): Promise<{ success: boolean; error?: string }> {
  if (!isReady()) return { success: false, error: 'Redis 不可用' };

  const theme = await get<CommunityTheme>(themeKey(id));
  if (!theme) return { success: false, error: '主题不存在' };
  theme.status = normaliseStatus(theme.status);

  if (theme.status !== 'approved') {
    return { success: false, error: '只能撤回已通过的主题' };
  }

  const approvedAt = theme.approvedAt || 0;
  if (Date.now() - approvedAt > REVERT_WINDOW) {
    return { success: false, error: '已超过 24 小时撤回窗口，不再支持回退' };
  }

  try {
    theme.status = 'pending';
    theme.approvedAt = undefined;
    await set(themeKey(id), theme);
    // Remove from public indexes
    await zrem(NEWEST_KEY, id);
    await zrem(LIKES_KEY, id);
    // Add back to pending queue with ORIGINAL createdAt (preserves TTL)
    await zadd(PENDING_KEY, theme.createdAt, id);
    return { success: true };
  } catch {
    return { success: false, error: '撤回操作失败' };
  }
}

/**
 * Get recently approved themes (within 24h window) that are eligible for rollback.
 */
export async function getRecentlyApproved(): Promise<CommunityTheme[]> {
  if (!isReady()) return [];

  const ids = await zrevrange(NEWEST_KEY, 0, -1) as string[];
  if (!ids || ids.length === 0) return [];

  const cutoff = Date.now() - REVERT_WINDOW;
  const themes: CommunityTheme[] = [];
  for (const id of ids) {
    const t = await get<CommunityTheme>(themeKey(id));
    if (!t) {
      await zrem(NEWEST_KEY, id);
      continue;
    }
    t.status = normaliseStatus(t.status);
    if (t.status === 'approved' && t.approvedAt && t.approvedAt > cutoff) {
      themes.push(t);
    }
  }
  return themes;
}
