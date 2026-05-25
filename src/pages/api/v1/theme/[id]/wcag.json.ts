import type { APIRoute } from 'astro';
import { getAllThemes } from '../../../../../utils/daily-theme';
import { get as redisGet } from '../../../../../lib/redis';
import { hexToRgb, getLuminance, getContrastRatio } from '../../../../../utils/color';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

function resolveCssVar(vars: Record<string, string>, key: string, fallback: string): string {
  return vars[key] || fallback;
}

function evalWcag(ratio: number) {
  return {
    ratio: Number(ratio.toFixed(2)),
    AA_normal: ratio >= 4.5 ? 'pass' : 'fail',
    AA_large: ratio >= 3.0 ? 'pass' : 'fail',
    AAA_normal: ratio >= 7.0 ? 'pass' : 'fail',
    AAA_large: ratio >= 4.5 ? 'pass' : 'fail',
  };
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

  const bg = resolveCssVar(cssVars, '--color-bg', '#ffffff');
  const text = resolveCssVar(cssVars, '--color-text', '#000000');
  const primary = resolveCssVar(cssVars, '--color-primary', '#3b82f6');
  const secondary = resolveCssVar(cssVars, '--color-secondary', '#6366f1');
  const surface = resolveCssVar(cssVars, '--color-surface', bg);
  const muted = resolveCssVar(cssVars, '--color-text-muted', '#6b7280');

  const textOnBg = getContrastRatio(text, bg);
  const primaryOnBg = getContrastRatio(primary, bg);
  const secondaryOnBg = getContrastRatio(secondary, bg);
  const mutedOnBg = getContrastRatio(muted, bg);
  const textOnSurface = getContrastRatio(text, surface);

  const allRatios = [textOnBg, primaryOnBg, secondaryOnBg, mutedOnBg, textOnSurface];
  const compliant = textOnBg >= 4.5;

  const warnings: string[] = [];
  if (textOnBg < 4.5) warnings.push('正文颜色在背景上对比度低于 4.5:1 (WCAG AA)，存在严重无障碍阅读障碍');
  if (textOnBg < 3.0) warnings.push('正文颜色在背景上对比度低于 3.0:1 (WCAG AA 大文本)，急需修复');
  if (primaryOnBg < 3.0) warnings.push('主色在背景上对比度低于 3.0:1，按钮/链接可能难以辨识');

  return new Response(JSON.stringify({
    themeId: id,
    compliant,
    summary: {
      worst: Number(Math.min(...allRatios).toFixed(2)),
      best: Number(Math.max(...allRatios).toFixed(2)),
      average: Number((allRatios.reduce((a, b) => a + b, 0) / allRatios.length).toFixed(2)),
    },
    ratios: {
      text_on_bg: evalWcag(textOnBg),
      primary_on_bg: evalWcag(primaryOnBg),
      secondary_on_bg: evalWcag(secondaryOnBg),
      muted_on_bg: evalWcag(mutedOnBg),
      text_on_surface: evalWcag(textOnSurface),
    },
    warnings,
  }, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600',
      ...CORS_HEADERS,
    },
  });
};

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}
