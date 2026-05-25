import type { APIRoute } from 'astro';
import { getDailyTheme } from '../../../../utils/daily-theme';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

export const GET: APIRoute = async () => {
  const theme = getDailyTheme();
  const primary = (theme.cssVars['--color-primary'] || '#6366f1').replace('#', '');
  const border = (theme.cssVars['--color-border'] || 'rgba(100,100,255,0.15)');
  const bg = theme.cssVars['--color-bg'] || '#0f0f23';

  // Extract RGB from border rgba for the stroke color
  const rgbaMatch = border.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
  const strokeRgb = rgbaMatch ? `${rgbaMatch[1]},${rgbaMatch[2]},${rgbaMatch[3]}` : primary;
  const strokeOpacity = rgbaMatch ? (parseFloat(border.match(/[\d.]+\)$/)?.[0] || '0.25')) : 0.25;

  // Generate a theme-aware geometric SVG pattern
  const svg = [
    `<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">`,
    `  <defs>`,
    `    <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">`,
    `      <circle cx="30" cy="30" r="1.5" fill="rgb(${strokeRgb})" opacity="${strokeOpacity * 0.6}"/>`,
    `      <circle cx="0" cy="0" r="1" fill="rgb(${strokeRgb})" opacity="${strokeOpacity * 0.4}"/>`,
    `      <circle cx="60" cy="0" r="1" fill="rgb(${strokeRgb})" opacity="${strokeOpacity * 0.4}"/>`,
    `      <circle cx="0" cy="60" r="1" fill="rgb(${strokeRgb})" opacity="${strokeOpacity * 0.4}"/>`,
    `      <circle cx="60" cy="60" r="1" fill="rgb(${strokeRgb})" opacity="${strokeOpacity * 0.4}"/>`,
    `      <path d="M0 30 L60 30" stroke="rgb(${strokeRgb})" stroke-width="0.5" opacity="${strokeOpacity * 0.3}"/>`,
    `      <path d="M30 0 L30 60" stroke="rgb(${strokeRgb})" stroke-width="0.5" opacity="${strokeOpacity * 0.3}"/>`,
    `    </pattern>`,
    `    <pattern id="accent" width="180" height="180" patternUnits="userSpaceOnUse">`,
    `      <circle cx="90" cy="90" r="40" fill="none" stroke="#${primary}" stroke-width="0.6" opacity="0.12"/>`,
    `      <circle cx="90" cy="90" r="70" fill="none" stroke="#${primary}" stroke-width="0.4" opacity="0.08"/>`,
    `    </pattern>`,
    `  </defs>`,
    `  <rect width="60" height="60" fill="url(#grid)"/>`,
    `  <rect width="60" height="60" fill="url(#accent)"/>`,
    `</svg>`,
  ].join('\n');

  const encodedSvg = svg
    .replace(/\s+/g, ' ')
    .replace(/"/g, "'")
    .replace(/%/g, '%25')
    .replace(/#/g, '%23')
    .replace(/\{/g, '%7B')
    .replace(/\}/g, '%7D')
    .replace(/</g, '%3C')
    .replace(/>/g, '%3E');

  const css = [
    `/* ThemeDist Pattern — ${theme.presetName} */`,
    `body.themedist-pattern {`,
    `  background-color: ${bg};`,
    `  background-image: url("data:image/svg+xml,${encodedSvg}");`,
    `}`,
  ].join('\n');

  return new Response(css, {
    headers: {
      'Content-Type': 'text/css',
      'Cache-Control': 'public, max-age=3600',
      ...CORS_HEADERS,
    },
  });
};

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}
