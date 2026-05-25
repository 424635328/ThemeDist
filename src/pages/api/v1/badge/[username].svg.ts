import { isReady } from '../../../../lib/redis';
import { listThemes, getTotalCount } from '../../../../lib/themes-db';

export const prerender = false;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

function escXml(s: string): string {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export async function GET({ params }: { params: { username: string } }) {
  try {
    const username = params.username || '';
    if (!username || username.length > 50) {
      const errSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 40"><rect width="320" height="40" rx="6" fill="#444"/><text x="160" y="26" font-family="system-ui,sans-serif" font-size="13" fill="#fff" text-anchor="middle">Invalid username</text></svg>`;
      return new Response(errSvg, { status: 400, headers: { 'Content-Type': 'image/svg+xml; charset=utf-8', 'X-Content-Type-Options': 'nosniff', ...CORS_HEADERS } });
    }

    let totalThemes = 0;
    let totalLikes = 0;
    let topPrimary = '#6366f1';

    if (isReady()) {
      // Fetch all approved themes (max 500 per page for badge generation)
      const themes = await listThemes('new', 1, 500);
      const userThemes = themes.filter(t => t.author === username);
      totalThemes = userThemes.length;
      totalLikes = userThemes.reduce((sum, t) => sum + (t.likes || 0), 0);

      if (userThemes.length > 0) {
        // Find the most-liked theme for accent color
        const best = userThemes.reduce((a, b) => (a.likes || 0) > (b.likes || 0) ? a : b);
        topPrimary = best.cssVars?.['--color-primary'] || '#6366f1';
      }
    }

    const label = escXml(username);
    const rightText = totalThemes > 0
      ? `${totalThemes} Theme${totalThemes !== 1 ? 's' : ''} · ${totalLikes} Like${totalLikes !== 1 ? 's' : ''}`
      : 'No themes yet';

    const leftWidth = Math.max(80, label.length * 10 + 20);
    const rightWidth = Math.max(120, rightText.length * 8 + 24);
    const totalWidth = leftWidth + rightWidth;

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalWidth} 40" width="${totalWidth}" height="40">
  <defs>
    <linearGradient id="rightBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${escXml(topPrimary)}"/>
      <stop offset="100%" stop-color="${escXml(topPrimary)}" stop-opacity="0.85"/>
    </linearGradient>
  </defs>
  <!-- Left: label -->
  <rect x="0" y="0" width="${leftWidth}" height="40" rx="0" fill="#333" stroke="#555" stroke-width="0.5"/>
  <text x="${leftWidth / 2}" y="26" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="700" fill="#fff" text-anchor="middle">${label}</text>
  <!-- Right: stats -->
  <rect x="${leftWidth}" y="0" width="${rightWidth}" height="40" rx="0" fill="url(#rightBg)"/>
  <text x="${leftWidth + rightWidth / 2}" y="26" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="600" fill="#fff" text-anchor="middle">${escXml(rightText)}</text>
  <!-- Border -->
  <rect x="0" y="0" width="${totalWidth}" height="40" rx="6" fill="none" stroke="#555" stroke-width="0.5"/>
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
    console.error('[v1/badge] Error:', err);
    const errSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 40"><rect width="320" height="40" rx="6" fill="#444"/><text x="160" y="26" font-family="system-ui,sans-serif" font-size="13" fill="#fff" text-anchor="middle">Badge unavailable</text></svg>`;
    return new Response(errSvg, { status: 500, headers: { 'Content-Type': 'image/svg+xml; charset=utf-8', ...CORS_HEADERS } });
  }
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}
