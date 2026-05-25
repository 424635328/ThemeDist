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

function escHex(s: string): string {
  return escXml(s).replace(/[^#0-9a-fA-F,()% ]/g, '');
}

export async function GET() {
  try {
    const communityDaily = await getDailyCommunityTheme();
    const theme = communityDaily || getDailyTheme();
    const v = theme.cssVars;

    const p = v['--color-primary'] || '#6366f1';
    const s = v['--color-secondary'] || '#818cf8';
    const a = v['--color-accent'] || '#34d399';
    const bg = v['--color-bg'] || '#0f172a';
    const text = v['--color-text'] || '#f8fafc';
    const textMuted = v['--color-text-muted'] || '#94a3b8';
    const surf = v['--color-surface'] || '#1e293b';

    const name = escXml(theme.presetName || 'ThemeDist');

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 110" width="440" height="110">
  <defs>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000" flood-opacity="0.25"/>
    </filter>
    <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="0" stdDeviation="4" flood-color="${escHex(p)}" flood-opacity="0.4"/>
    </filter>
    <linearGradient id="cardBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${escHex(bg)}" stop-opacity="0.95"/>
      <stop offset="100%" stop-color="${escHex(surf)}" stop-opacity="0.95"/>
    </linearGradient>
    <linearGradient id="accentLine" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${escHex(p)}"/>
      <stop offset="50%" stop-color="${escHex(a)}"/>
      <stop offset="100%" stop-color="${escHex(s)}"/>
    </linearGradient>
  </defs>

  <!-- Card background -->
  <rect x="0" y="0" width="440" height="110" rx="14" fill="url(#cardBg)" stroke="${escHex(p)}" stroke-opacity="0.15" stroke-width="1"/>

  <!-- Top accent line -->
  <rect x="0" y="0" width="440" height="3" rx="1.5" fill="url(#accentLine)"/>

  <!-- Left section: theme name -->
  <text x="24" y="36" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="800" fill="${escHex(text)}" letter-spacing="-0.02em">${name}</text>
  <text x="24" y="55" font-family="'JetBrains Mono', 'SF Mono', monospace" font-size="9" font-weight="500" fill="${escHex(textMuted)}" letter-spacing="0.04em">THEMEDIST PALETTE</text>

  <!-- Color swatches -->
  <g transform="translate(160, 20)">
    <circle cx="0" cy="38" r="14" fill="${escHex(p)}" filter="url(#glow)"/>
    <circle cx="34" cy="38" r="14" fill="${escHex(s)}" filter="url(#shadow)"/>
    <circle cx="68" cy="38" r="14" fill="${escHex(a)}" filter="url(#shadow)"/>
    <circle cx="102" cy="38" r="14" fill="${escHex(bg)}" stroke="${escHex(textMuted)}" stroke-opacity="0.35" stroke-width="1.5"/>
    <circle cx="136" cy="38" r="14" fill="${escHex(text)}" filter="url(#shadow)"/>
    <circle cx="170" cy="38" r="14" fill="${escHex(surf)}" stroke="${escHex(textMuted)}" stroke-opacity="0.35" stroke-width="1.5"/>

    <!-- Labels -->
    <text x="0" y="68" font-family="'JetBrains Mono', monospace" font-size="8" fill="${escHex(textMuted)}" text-anchor="middle">PRI</text>
    <text x="34" y="68" font-family="'JetBrains Mono', monospace" font-size="8" fill="${escHex(textMuted)}" text-anchor="middle">SEC</text>
    <text x="68" y="68" font-family="'JetBrains Mono', monospace" font-size="8" fill="${escHex(textMuted)}" text-anchor="middle">ACC</text>
    <text x="102" y="68" font-family="'JetBrains Mono', monospace" font-size="8" fill="${escHex(textMuted)}" text-anchor="middle">BG</text>
    <text x="136" y="68" font-family="'JetBrains Mono', monospace" font-size="8" fill="${escHex(textMuted)}" text-anchor="middle">TXT</text>
    <text x="170" y="68" font-family="'JetBrains Mono', monospace" font-size="8" fill="${escHex(textMuted)}" text-anchor="middle">SUR</text>
  </g>

  <!-- Hex codes row -->
  <g transform="translate(160, 90)">
    <text x="0" y="0" font-family="'JetBrains Mono', monospace" font-size="7.5" fill="${escHex(textMuted)}" text-anchor="middle" opacity="0.7">${escHex(p)}</text>
    <text x="34" y="0" font-family="'JetBrains Mono', monospace" font-size="7.5" fill="${escHex(textMuted)}" text-anchor="middle" opacity="0.7">${escHex(s)}</text>
    <text x="68" y="0" font-family="'JetBrains Mono', monospace" font-size="7.5" fill="${escHex(textMuted)}" text-anchor="middle" opacity="0.7">${escHex(a)}</text>
    <text x="102" y="0" font-family="'JetBrains Mono', monospace" font-size="7.5" fill="${escHex(textMuted)}" text-anchor="middle" opacity="0.7">${escHex(bg)}</text>
    <text x="136" y="0" font-family="'JetBrains Mono', monospace" font-size="7.5" fill="${escHex(textMuted)}" text-anchor="middle" opacity="0.7">${escHex(text)}</text>
    <text x="170" y="0" font-family="'JetBrains Mono', monospace" font-size="7.5" fill="${escHex(textMuted)}" text-anchor="middle" opacity="0.7">${escHex(surf)}</text>
  </g>
</svg>`;

    return new Response(svg.trim(), {
      headers: {
        'Content-Type': 'image/svg+xml; charset=utf-8',
        'X-Content-Type-Options': 'nosniff',
        'Cache-Control': 'public, max-age=1800',
        ...CORS_HEADERS,
      },
    });
  } catch (err) {
    console.error('[v1/today/palette.svg] Error:', err);
    const errSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 110" width="440" height="110"><rect width="440" height="110" rx="14" fill="#1e1e2e" stroke="#444" stroke-width="1"/><text x="220" y="60" font-family="system-ui, sans-serif" font-size="14" font-weight="600" fill="#888" text-anchor="middle">Palette Unavailable</text></svg>`;
    return new Response(errSvg, {
      status: 500,
      headers: {
        'Content-Type': 'image/svg+xml; charset=utf-8',
        'X-Content-Type-Options': 'nosniff',
        ...CORS_HEADERS,
      },
    });
  }
}

export function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}
