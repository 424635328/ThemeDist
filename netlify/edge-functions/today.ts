import type { Context } from 'netlify:edge';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const CACHE = {
  'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=3600',
};

function getDayOfYear(d: Date): number {
  const start = new Date(d.getFullYear(), 0, 0);
  const diff = d.getTime() - start.getTime() +
    (start.getTimezoneOffset() - d.getTimezoneOffset()) * 60 * 1000;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function getMMDD(d: Date): string {
  return String(d.getMonth() + 1).padStart(2, '0') + '-' +
         String(d.getDate()).padStart(2, '0');
}

interface DirEntry {
  preset: string;
  name: string;
  primary: string;
  accent: string;
  logoText: string | null;
  community?: boolean;
}

interface IndexData {
  pool: string[];
  poolLength: number;
  gregorianHolidays: Record<string, string>;
  directory: DirEntry[];
}

/** Fetch theme data from the site's own prerendered endpoint */
async function fetchTheme(origin: string, preset: string): Promise<any> {
  const res = await fetch(`${origin}/api/theme/${preset}.json`);
  if (!res.ok) throw new Error(`theme fetch failed: ${res.status}`);
  return res.json();
}

/** Fetch theme index data (pool, holidays, directory) */
async function fetchIndex(origin: string): Promise<IndexData> {
  const res = await fetch(`${origin}/api/index-data.json`);
  if (!res.ok) throw new Error(`index fetch failed: ${res.status}`);
  return res.json();
}

// ── Upstash Redis helpers ──

function upstashUrl(): string | null {
  return Deno.env.get('UPSTASH_REDIS_REST_URL') || null;
}

function upstashToken(): string | null {
  return Deno.env.get('UPSTASH_REDIS_REST_TOKEN') || null;
}

async function redisGet(key: string): Promise<any> {
  const url = upstashUrl();
  const token = upstashToken();
  if (!url || !token) return null;
  try {
    const res = await fetch(`${url}/get/${key}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await res.json();
    return body?.result ?? null;
  } catch {
    return null;
  }
}

async function redisZcard(key: string): Promise<number> {
  const url = upstashUrl();
  const token = upstashToken();
  if (!url || !token) return 0;
  try {
    const res = await fetch(`${url}/zcard/${key}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await res.json();
    return body?.result ?? 0;
  } catch {
    return 0;
  }
}

async function redisZrevrange(key: string, start: number, stop: number): Promise<string[]> {
  const url = upstashUrl();
  const token = upstashToken();
  if (!url || !token) return [];
  try {
    const res = await fetch(`${url}/zrevrange/${key}/${start}/${stop}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await res.json();
    return Array.isArray(body?.result) ? body.result : [];
  } catch {
    return [];
  }
}

export default async (request: Request, context: Context) => {
  // CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS });
  }
  if (request.method !== 'GET') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const origin = new URL(request.url).origin;
    const today = new Date();
    const dayOfYear = getDayOfYear(today);
    const mmdd = getMMDD(today);

    // Fetch the build-time index data (pool order, holidays, directory)
    const idx = await fetchIndex(origin);

    // Determine today's preset
    let preset: string;

    // 1. Gregorian holiday
    if (idx.gregorianHolidays[mmdd]) {
      preset = idx.gregorianHolidays[mmdd];
    }
    // 2. Crazy Thursday
    else if (today.getDay() === 4) {
      preset = 'crazy-thursday';
    }
    // 3. Daily pool rotation
    else {
      preset = idx.pool[dayOfYear % idx.poolLength] || idx.pool[0];
    }

    // Community daily theme — takes over every 3rd day
    let dailyIsCommunity = false;
    let communityTheme: any = null;
    const redisUrl = upstashUrl();
    const redisToken = upstashToken();

    if (redisUrl && redisToken && dayOfYear % 3 === 2) {
      const count = await redisZcard('td:themes:by_newest');
      if (count > 0) {
        const idx2 = dayOfYear % count;
        const ids = await redisZrevrange('td:themes:by_newest', idx2, idx2);
        if (ids.length > 0) {
          const ct = await redisGet(`td:theme:${ids[0]}`);
          if (ct) {
            communityTheme = {
              preset: `community-${ct.id}`,
              presetName: ct.name,
              cssVars: ct.cssVars,
              customCss: ct.customCss || null,
              extensions: null,
              logoText: null,
              logoColors: null,
            };
            dailyIsCommunity = true;
          }
        }
      }
    }

    // Fetch theme data from static endpoint
    let themeData: any;
    if (communityTheme) {
      themeData = communityTheme;
    } else {
      themeData = await fetchTheme(origin, preset);
    }

    // Community directory entries
    let communityDir: DirEntry[] = [];
    if (redisUrl && redisToken) {
      try {
        const ids = await redisZrevrange('td:themes:by_newest', 0, 9);
        for (const id of ids) {
          const ct = await redisGet(`td:theme:${id}`);
          if (ct) {
            communityDir.push({
              preset: `community-${ct.id}`,
              name: ct.name,
              primary: ct.cssVars['--color-primary'],
              accent: ct.cssVars['--color-accent'],
              logoText: null,
              community: true,
            });
          }
        }
      } catch { /* skip */ }
    }

    const response = {
      date: mmdd.slice(0, 2) === String(today.getMonth() + 1).padStart(2, '0')
        ? today.toISOString().slice(0, 10)
        : today.toISOString().slice(0, 10),
      generatedAt: new Date().toISOString(),
      preset: themeData.preset,
      presetName: themeData.presetName,
      cssVars: themeData.cssVars,
      customCss: themeData.customCss || null,
      extensions: themeData.extensions || null,
      logoText: themeData.logoText || null,
      logoColors: themeData.logoColors || null,
      available: idx.directory.length + communityDir.length,
      directory: [...idx.directory, ...communityDir],
      dailyIsCommunity,
    };

    return new Response(JSON.stringify(response, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        ...CORS,
        ...CACHE,
      },
    });
  } catch (err) {
    console.error('[edge/today] error, falling back:', err);
    // Fallback: pass through to the prerendered static file
    return context.next();
  }
};
