import { getAllThemes } from '../../../../../utils/daily-theme';
import { getThemeWithLikes } from '../../../../../lib/themes-db';

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

export async function GET({ params }: { params: { id: string } }) {
  try {
    const rawId = params.id || '';

    let theme: { presetName: string; cssVars: Record<string, string>; author?: string } | null = null;

    if (rawId.startsWith('community-')) {
      const communityId = rawId.replace('community-', '');
      const ct = await getThemeWithLikes(communityId);
      if (ct) {
        theme = {
          presetName: ct.name,
          cssVars: ct.cssVars,
          author: ct.author,
        };
      }
    }

    if (!theme) {
      const all = getAllThemes();
      const match = all.find(t => t.preset === rawId);
      if (match) {
        theme = { presetName: match.presetName, cssVars: match.cssVars };
      }
    }

    if (!theme) {
      const errSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <defs>
    <linearGradient id="errBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1e1b4b"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#errBg)"/>
  <text x="600" y="300" font-family="system-ui, sans-serif" font-size="42" font-weight="700" fill="#6366f1" text-anchor="middle">Theme Not Found</text>
  <text x="600" y="360" font-family="system-ui, sans-serif" font-size="20" fill="#94a3b8" text-anchor="middle">Check the theme ID and try again</text>
</svg>`;
      return new Response(errSvg, {
        status: 404,
        headers: {
          'Content-Type': 'image/svg+xml; charset=utf-8',
          'X-Content-Type-Options': 'nosniff',
          ...CORS_HEADERS,
        },
      });
    }

    const v = theme.cssVars;
    const p = v['--color-primary'] || '#6366f1';
    const sec = v['--color-secondary'] || '#818cf8';
    const acc = v['--color-accent'] || '#34d399';
    const bg = v['--color-bg'] || '#0f172a';
    const surf = v['--color-surface'] || '#1e293b';
    const text = v['--color-text'] || '#f8fafc';
    const textMuted = v['--color-text-muted'] || '#94a3b8';

    const title = theme.presetName || 'Untitled';
    const author = theme.author || '';

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <defs>
    <!-- Background gradients -->
    <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${escHex(bg)}"/>
      <stop offset="100%" stop-color="${escHex(surf)}"/>
    </linearGradient>
    <radialGradient id="orb1" cx="15%" cy="10%" r="50%">
      <stop offset="0%" stop-color="${escHex(p)}" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="${escHex(p)}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="orb2" cx="85%" cy="80%" r="45%">
      <stop offset="0%" stop-color="${escHex(acc)}" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="${escHex(acc)}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="orb3" cx="50%" cy="50%" r="40%">
      <stop offset="0%" stop-color="${escHex(sec)}" stop-opacity="0.08"/>
      <stop offset="100%" stop-color="${escHex(sec)}" stop-opacity="0"/>
    </radialGradient>

    <!-- Gradient accent bar -->
    <linearGradient id="accentBar" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${escHex(p)}"/>
      <stop offset="35%" stop-color="${escHex(acc)}"/>
      <stop offset="70%" stop-color="${escHex(sec)}"/>
      <stop offset="100%" stop-color="${escHex(p)}"/>
    </linearGradient>

    <!-- Swatch card gradient -->
    <linearGradient id="swatchCard" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${escHex(surf)}" stop-opacity="0.95"/>
      <stop offset="100%" stop-color="${escHex(bg)}" stop-opacity="0.95"/>
    </linearGradient>

    <!-- Glow filter -->
    <filter id="swatchGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="4" stdDeviation="12" flood-color="#000" flood-opacity="0.4"/>
    </filter>

    <!-- Dot pattern -->
    <pattern id="dots" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
      <circle cx="1" cy="1" r="1" fill="${escHex(text)}" opacity="0.04"/>
    </pattern>
  </defs>

  <!-- Base background -->
  <rect width="1200" height="630" fill="url(#bgGrad)"/>

  <!-- Dot texture overlay -->
  <rect width="1200" height="630" fill="url(#dots)"/>

  <!-- Ambient orbs -->
  <rect width="1200" height="630" fill="url(#orb1)"/>
  <rect width="1200" height="630" fill="url(#orb2)"/>
  <rect width="1200" height="630" fill="url(#orb3)"/>

  <!-- Top accent bar -->
  <rect x="0" y="0" width="1200" height="5" fill="url(#accentBar)"/>

  <!-- Decorative geometric circles -->
  <circle cx="1050" cy="140" r="180" fill="none" stroke="${escHex(p)}" stroke-opacity="0.06" stroke-width="2"/>
  <circle cx="1050" cy="140" r="140" fill="none" stroke="${escHex(p)}" stroke-opacity="0.08" stroke-width="1.5"/>
  <circle cx="1050" cy="140" r="100" fill="none" stroke="${escHex(p)}" stroke-opacity="0.1" stroke-width="1"/>
  <circle cx="110" cy="520" r="90" fill="none" stroke="${escHex(acc)}" stroke-opacity="0.08" stroke-width="2"/>
  <circle cx="110" cy="520" r="60" fill="none" stroke="${escHex(acc)}" stroke-opacity="0.1" stroke-width="1.5"/>

  <!-- Title section -->
  <text x="100" y="170" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="72" fill="${escHex(text)}" letter-spacing="-0.03em">${escXml(title)}</text>

  <!-- Subtitle -->
  <text x="105" y="230" font-family="system-ui, -apple-system, sans-serif" font-weight="500" font-size="26" fill="${escHex(textMuted)}" letter-spacing="-0.01em">
    ${author ? 'by ' + escXml(author) + ' · ' : ''}ThemeDist Daily Palette
  </text>

  <!-- Color swatch panel -->
  <rect x="100" y="310" width="1000" height="220" rx="24" fill="url(#swatchCard)" stroke="${escHex(p)}" stroke-opacity="0.12" stroke-width="1.5"/>

  <!-- Swatch row -->
  <g transform="translate(100, 310)">
    <!-- Primary -->
    <rect x="32" y="40" width="130" height="130" rx="20" fill="${escHex(p)}" filter="url(#swatchGlow)"/>
    <text x="97" y="198" font-family="'JetBrains Mono', monospace" font-size="14" font-weight="600" fill="${escHex(text)}" text-anchor="middle">Primary</text>
    <text x="97" y="216" font-family="'JetBrains Mono', monospace" font-size="12" fill="${escHex(textMuted)}" text-anchor="middle">${escHex(p)}</text>

    <!-- Secondary -->
    <rect x="184" y="40" width="130" height="130" rx="20" fill="${escHex(sec)}" filter="url(#swatchGlow)"/>
    <text x="249" y="198" font-family="'JetBrains Mono', monospace" font-size="14" font-weight="600" fill="${escHex(text)}" text-anchor="middle">Secondary</text>
    <text x="249" y="216" font-family="'JetBrains Mono', monospace" font-size="12" fill="${escHex(textMuted)}" text-anchor="middle">${escHex(sec)}</text>

    <!-- Accent -->
    <rect x="336" y="40" width="130" height="130" rx="20" fill="${escHex(acc)}" filter="url(#swatchGlow)"/>
    <text x="401" y="198" font-family="'JetBrains Mono', monospace" font-size="14" font-weight="600" fill="${escHex(text)}" text-anchor="middle">Accent</text>
    <text x="401" y="216" font-family="'JetBrains Mono', monospace" font-size="12" fill="${escHex(textMuted)}" text-anchor="middle">${escHex(acc)}</text>

    <!-- Background -->
    <rect x="488" y="40" width="130" height="130" rx="20" fill="${escHex(bg)}" stroke="${escHex(textMuted)}" stroke-opacity="0.3" stroke-width="2" filter="url(#swatchGlow)"/>
    <text x="553" y="198" font-family="'JetBrains Mono', monospace" font-size="14" font-weight="600" fill="${escHex(text)}" text-anchor="middle">Background</text>
    <text x="553" y="216" font-family="'JetBrains Mono', monospace" font-size="12" fill="${escHex(textMuted)}" text-anchor="middle">${escHex(bg)}</text>

    <!-- Surface -->
    <rect x="640" y="40" width="130" height="130" rx="20" fill="${escHex(surf)}" stroke="${escHex(textMuted)}" stroke-opacity="0.3" stroke-width="2" filter="url(#swatchGlow)"/>
    <text x="705" y="198" font-family="'JetBrains Mono', monospace" font-size="14" font-weight="600" fill="${escHex(text)}" text-anchor="middle">Surface</text>
    <text x="705" y="216" font-family="'JetBrains Mono', monospace" font-size="12" fill="${escHex(textMuted)}" text-anchor="middle">${escHex(surf)}</text>

    <!-- Text -->
    <rect x="792" y="40" width="130" height="130" rx="20" fill="${escHex(text)}" filter="url(#swatchGlow)"/>
    <text x="857" y="198" font-family="'JetBrains Mono', monospace" font-size="14" font-weight="600" fill="${escHex(bg)}" text-anchor="middle">Text</text>
    <text x="857" y="216" font-family="'JetBrains Mono', monospace" font-size="12" fill="${escHex(bg)}" text-anchor="middle" opacity="0.7">${escHex(text)}</text>
  </g>

  <!-- Bottom watermark -->
  <text x="1100" y="610" font-family="system-ui, sans-serif" font-weight="800" font-size="18" fill="${escHex(textMuted)}" text-anchor="end" opacity="0.35" letter-spacing="0.04em">themedist</text>
</svg>`;

    return new Response(svg.trim(), {
      headers: {
        'Content-Type': 'image/svg+xml; charset=utf-8',
        'X-Content-Type-Options': 'nosniff',
        'Cache-Control': 'public, max-age=86400, s-maxage=31536000, immutable',
        ...CORS_HEADERS,
      },
    });
  } catch (err) {
    console.error('[v1/theme/og.svg] Error:', err);
    const errSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630"><rect width="1200" height="630" fill="#0f172a"/><text x="600" y="315" font-family="system-ui, sans-serif" font-size="36" font-weight="700" fill="#94a3b8" text-anchor="middle">OG Image Unavailable</text></svg>`;
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
