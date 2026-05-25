import { getDailyTheme } from '../../../utils/daily-theme';
import { getDailyCommunityTheme } from '../../../utils/omni-bridge';

export const prerender = false;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

const CACHE_HEADERS = {
  'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=3600',
};

export async function GET() {
  try {
    const communityDaily = await getDailyCommunityTheme();
    const theme = communityDaily || getDailyTheme();
    const v = theme.cssVars;

    const config = {
      theme: {
        extend: {
          colors: {
            'td-primary': `rgb(var(--color-primary-rgb) / <alpha-value>)`,
            'td-secondary': `rgb(var(--color-secondary-rgb) / <alpha-value>)`,
            'td-accent': `rgb(var(--color-accent-rgb) / <alpha-value>)`,
            'td-bg': 'var(--color-bg)',
            'td-surface': 'var(--color-surface)',
            'td-text': 'var(--color-text)',
            'td-text-muted': 'var(--color-text-muted)',
            'td-border': 'var(--color-border)',
          },
          borderRadius: {
            'td-radii': 'var(--radii)',
          },
          fontFamily: {
            'td-heading': 'var(--font-heading)',
            'td-body': 'var(--font-body)',
            'td-mono': 'var(--font-mono)',
          },
        },
      },
      preset: theme.preset,
      presetName: theme.presetName,
      apiVersion: 'v1',
    };

    return new Response(JSON.stringify(config, null, 2), {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        ...CORS_HEADERS,
        ...CACHE_HEADERS,
      },
    });
  } catch (err) {
    console.error('[v1/tailwind-config.json] Error:', err);
    return new Response(JSON.stringify({ error: '内部服务错误' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  }
}

export function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}
