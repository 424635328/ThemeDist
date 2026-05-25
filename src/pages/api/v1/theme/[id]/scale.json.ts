import type { APIRoute } from 'astro';
import { getAllThemes } from '../../../../../utils/daily-theme';
import { get as redisGet } from '../../../../../lib/redis';
import { hexToRgb, mixColor, rgbToHex } from '../../../../../utils/color';

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

  const primary = resolveCssVar(cssVars, '--color-primary', '#3b82f6');
  const secondary = resolveCssVar(cssVars, '--color-secondary', '#6366f1');
  const accent = resolveCssVar(cssVars, '--color-accent', '#f43f5e');
  const bg = resolveCssVar(cssVars, '--color-bg', '#ffffff');

  const white: [number, number, number] = [255, 255, 255];
  const black: [number, number, number] = [0, 0, 0];

  function generateScale(hex: string) {
    const baseRgb = hexToRgb(hex);
    return {
      '50': rgbToHex(...mixColor(baseRgb, white, 0.95)),
      '100': rgbToHex(...mixColor(baseRgb, white, 0.8)),
      '200': rgbToHex(...mixColor(baseRgb, white, 0.6)),
      '300': rgbToHex(...mixColor(baseRgb, white, 0.4)),
      '400': rgbToHex(...mixColor(baseRgb, white, 0.2)),
      '500': hex,
      '600': rgbToHex(...mixColor(baseRgb, black, 0.2)),
      '700': rgbToHex(...mixColor(baseRgb, black, 0.4)),
      '800': rgbToHex(...mixColor(baseRgb, black, 0.6)),
      '900': rgbToHex(...mixColor(baseRgb, black, 0.8)),
      '950': rgbToHex(...mixColor(baseRgb, black, 0.9)),
    };
  }

  return new Response(JSON.stringify({
    themeId: id,
    scales: {
      primary: generateScale(primary),
      secondary: generateScale(secondary),
      accent: generateScale(accent),
      background: generateScale(bg),
    },
  }, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=86400, s-maxage=31536000, immutable',
      ...CORS_HEADERS,
    },
  });
};

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}
