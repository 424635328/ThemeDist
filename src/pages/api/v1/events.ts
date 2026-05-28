import { getDailyTheme } from '../../../utils/daily-theme';
import { getDailyCommunityTheme } from '../../../utils/omni-bridge';
import { get as redisGet } from '../../../lib/redis';
import { STATUS_THEMES } from '../../../lib/status-themes';

export const prerender = false;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-cache, no-store, must-revalidate',
};

// In-memory event bus for admin hooks to publish to
const listeners = new Set<(event: string, data: any) => void>();

export function subscribeToEvents(cb: (event: string, data: any) => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function broadcastEvent(event: string, data: any) {
  listeners.forEach((cb) => cb(event, data));
}

export async function GET() {
  const now = new Date();
  const timestamp = now.toISOString();

  // Resolve today's theme
  const communityDaily = await getDailyCommunityTheme();
  const theme = communityDaily || getDailyTheme();

  // Check for active status override
  const override = await redisGet<{ status: string; activatedAt: string }>('td:status-override');

  let preset = theme.preset;
  let presetName = theme.presetName;
  let statusOverride: { status: string; activatedAt: string } | null = null;

  if (override && STATUS_THEMES[override.status]) {
    preset = `status-${override.status}`;
    presetName = `紧急覆盖: ${override.status}`;
    statusOverride = override;
  }

  // Determine nextPoll interval
  let nextPoll: number;
  if (statusOverride) {
    nextPoll = 30000; // 30s when override active
  } else {
    const minutesToMidnight = (24 * 60) - (now.getUTCHours() * 60 + now.getUTCMinutes());
    nextPoll = minutesToMidnight <= 2 ? 10000 : 300000;
  }

  const body = JSON.stringify({
    type: 'snapshot',
    theme: {
      preset,
      presetName,
      date: timestamp.slice(0, 10),
    },
    statusOverride,
    nextPoll,
    timestamp,
  }, null, 2);

  return new Response(body, {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...CORS_HEADERS,
      ...NO_CACHE_HEADERS,
    },
  });
}

export function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}
