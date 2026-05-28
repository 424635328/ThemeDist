import type { APIRoute } from 'astro';
import { getAllThemes } from '../../../../../utils/daily-theme';
import { get as redisGet } from '../../../../../lib/redis';
import { getContrastRatio, evalAPCA, generateContrastFix } from '../../../../../utils/color';
import { enrichCssVars } from '../../../../../utils/omni-bridge';

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

export const GET: APIRoute = async ({ params, url }) => {
  const id = params.id!;
  const level = (url.searchParams.get('level') || 'aa') as 'aa' | 'aaa';
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

  // Original evaluation
  const originalEval = {
    text_on_bg: { ...evalWcag(getContrastRatio(text, bg)), apca: evalAPCA(text, bg) },
    primary_on_bg: { ...evalWcag(getContrastRatio(primary, bg)), apca: evalAPCA(primary, bg) },
    secondary_on_bg: { ...evalWcag(getContrastRatio(secondary, bg)), apca: evalAPCA(secondary, bg) },
    muted_on_bg: { ...evalWcag(getContrastRatio(muted, bg)), apca: evalAPCA(muted, bg) },
    text_on_surface: { ...evalWcag(getContrastRatio(text, surface)), apca: evalAPCA(text, surface) },
  };

  // Auto-fix
  const { fixed, changes } = generateContrastFix(cssVars, level);

  // Fixed evaluation
  const fixedBg = resolveCssVar(fixed, '--color-bg', '#ffffff');
  const fixedText = resolveCssVar(fixed, '--color-text', '#000000');
  const fixedPrimary = resolveCssVar(fixed, '--color-primary', '#3b82f6');
  const fixedSecondary = resolveCssVar(fixed, '--color-secondary', '#6366f1');
  const fixedSurface = resolveCssVar(fixed, '--color-surface', fixedBg);
  const fixedMuted = resolveCssVar(fixed, '--color-text-muted', '#6b7280');

  const fixedEval = {
    text_on_bg: { ...evalWcag(getContrastRatio(fixedText, fixedBg)), apca: evalAPCA(fixedText, fixedBg) },
    primary_on_bg: { ...evalWcag(getContrastRatio(fixedPrimary, fixedBg)), apca: evalAPCA(fixedPrimary, fixedBg) },
    secondary_on_bg: { ...evalWcag(getContrastRatio(fixedSecondary, fixedBg)), apca: evalAPCA(fixedSecondary, fixedBg) },
    muted_on_bg: { ...evalWcag(getContrastRatio(fixedMuted, fixedBg)), apca: evalAPCA(fixedMuted, fixedBg) },
    text_on_surface: { ...evalWcag(getContrastRatio(fixedText, fixedSurface)), apca: evalAPCA(fixedText, fixedSurface) },
  };

  // Merge fixed CSS vars with structural defaults and RGB channels
  const fixedEnriched = enrichCssVars(fixed);

  return new Response(JSON.stringify({
    themeId: id,
    level,
    original: { ratios: originalEval },
    fixed: { ratios: fixedEval },
    changes,
    cssVars: fixedEnriched,
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
