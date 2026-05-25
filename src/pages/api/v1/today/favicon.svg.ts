import { getDailyTheme } from '../../../../utils/daily-theme';
import { getDailyCommunityTheme } from '../../../../utils/omni-bridge';

export const prerender = false;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

function escXml(s: string): string {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export async function GET() {
  try {
    const communityDaily = await getDailyCommunityTheme();
    const theme = communityDaily || getDailyTheme();

    const primaryColor = escXml(theme.cssVars['--color-primary'] || '#6366f1');
    const char = escXml((theme.logoText || 'T').substring(0, 1));

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${primaryColor}"/>
      <stop offset="100%" stop-color="${primaryColor}" stop-opacity="0.85"/>
    </linearGradient>
  </defs>
  <rect width="64" height="64" rx="16" fill="url(#bg)"/>
  <text x="32" y="45" font-size="34" font-family="system-ui, -apple-system, sans-serif"
        fill="#fff" text-anchor="middle" font-weight="800" letter-spacing="-0.02em">${char}</text>
</svg>`;

    return new Response(svg.trim(), {
      headers: {
        'Content-Type': 'image/svg+xml; charset=utf-8',
        'X-Content-Type-Options': 'nosniff',
        'Cache-Control': 'public, max-age=3600',
        ...CORS_HEADERS,
      },
    });
  } catch (err) {
    console.error('[v1/today/favicon.svg] Error:', err);
    const errSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="#6366f1"/><text x="32" y="45" font-size="34" font-family="system-ui,sans-serif" fill="#fff" text-anchor="middle" font-weight="800">T</text></svg>`;
    return new Response(errSvg, {
      status: 500,
      headers: { 'Content-Type': 'image/svg+xml; charset=utf-8', ...CORS_HEADERS },
    });
  }
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}
