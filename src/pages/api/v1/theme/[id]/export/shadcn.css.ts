import type { APIRoute } from 'astro';
import { getAllThemes } from '../../../../../../utils/daily-theme';
import { get as redisGet } from '../../../../../../lib/redis';
import { hexToRgb, rgbToHslString, getLuminance } from '../../../../../../utils/color';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

function resolveCssVar(vars: Record<string, string>, key: string, fallback: string): string {
  return vars[key] || fallback;
}

export const GET: APIRoute = async ({ params }) => {
  const id = params.id!;
  let cssVars: Record<string, string>;

  if (id.startsWith('community-')) {
    const redisId = id.slice('community-'.length);
    try {
      const ct = await redisGet<any>(`td:theme:${redisId}`);
      if (!ct) {
        return new Response(JSON.stringify({ error: 'Theme not found', code: 404 }), {
          status: 404, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
        });
      }
      cssVars = ct.cssVars;
    } catch {
      return new Response(JSON.stringify({ error: 'Theme not found', code: 404 }), {
        status: 404, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
      });
    }
  } else {
    const themes = getAllThemes();
    const theme = themes.find((t) => t.preset === id);
    if (!theme) {
      return new Response(JSON.stringify({ error: 'Theme not found', code: 404 }), {
        status: 404, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
      });
    }
    cssVars = theme.cssVars;
  }

  const toHsl = (hex: string) => rgbToHslString(...hexToRgb(hex));
  const getFg = (bgHex: string) => getLuminance(...hexToRgb(bgHex)) > 0.5 ? '222.2 84% 4.9%' : '210 40% 98%';

  const bg = resolveCssVar(cssVars, '--color-bg', '#ffffff');
  const text = resolveCssVar(cssVars, '--color-text', '#000000');
  const surface = resolveCssVar(cssVars, '--color-surface', bg);
  const primary = resolveCssVar(cssVars, '--color-primary', '#3b82f6');
  const secondary = resolveCssVar(cssVars, '--color-secondary', '#6366f1');
  const muted = resolveCssVar(cssVars, '--color-text-muted', '#6b7280');
  const border = resolveCssVar(cssVars, '--color-border', '#e2e8f0');
  const radii = resolveCssVar(cssVars, '--radii', '0.5rem');

  const css = [
    '@layer base {',
    '  :root {',
    `    --background: ${toHsl(bg)};`,
    `    --foreground: ${toHsl(text)};`,
    `    --card: ${toHsl(surface)};`,
    `    --card-foreground: ${toHsl(text)};`,
    `    --primary: ${toHsl(primary)};`,
    `    --primary-foreground: ${getFg(primary)};`,
    `    --secondary: ${toHsl(secondary)};`,
    `    --secondary-foreground: ${getFg(secondary)};`,
    `    --muted: ${toHsl(surface)};`,
    `    --muted-foreground: ${toHsl(muted)};`,
    `    --accent: ${toHsl(surface)};`,
    `    --accent-foreground: ${toHsl(text)};`,
    `    --border: ${toHsl(border)};`,
    `    --input: ${toHsl(border)};`,
    `    --ring: ${toHsl(primary)};`,
    `    --radius: ${radii};`,
    '  }',
    '}',
  ].join('\n');

  return new Response(css, {
    headers: {
      'Content-Type': 'text/css',
      'Cache-Control': 'public, max-age=86400, s-maxage=31536000, immutable',
      ...CORS_HEADERS,
    },
  });
};

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}
