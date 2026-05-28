import { getAllThemes } from '../../../../utils/daily-theme';
import { get as redisGet } from '../../../../lib/redis';
import { sanitizeCustomCss, sanitizeExtensionsOutput, processThemePayload } from '../../../../utils/sanitize';
import { generateContrastFix } from '../../../../utils/color';
import { enrichCssVars } from '../../../../utils/omni-bridge';
import { deriveDarkVariant, deriveLightVariant } from '../../../../utils/dark-mode';
import { isLightColor } from '../../../../utils/color';

export const prerender = false;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function buildBody(themeData: any, cssVars: Record<string, string>, processed: any) {
  return {
    preset: themeData.preset || themeData.id,
    presetName: themeData.presetName || themeData.name,
    cssVars,
    customCss: processed.customCss || null,
    extensions: processed.extensions,
    clickEffect: themeData.clickEffect || null,
    logoText: themeData.logoText || null,
    logoColors: themeData.logoColors || null,
    apiVersion: 'v1',
    layerContext: processed.layerContext,
  };
}

export async function GET({ params, url }: { params: { preset: string }; url: URL }) {
  const presetId = params.preset;
  const wcagFix = url.searchParams.get('wcag-fix') as 'aa' | 'aaa' | null;
  const dual = url.searchParams.get('dual') === 'true';

  let themeData: any;
  let cssVars: Record<string, string>;
  let processed: any;
  let themeObj: any;

  // Handle community themes from Redis
  if (presetId.startsWith('community-')) {
    const redisId = presetId.slice('community-'.length);
    try {
      const ct = await redisGet<any>(`td:theme:${redisId}`);
      if (!ct) {
        return new Response(JSON.stringify({ error: 'Theme not found', code: 404 }), {
          status: 404, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
        });
      }
      themeData = ct;
      cssVars = ct.cssVars;
      processed = processThemePayload({
        customCss: sanitizeCustomCss(ct.customCss) || undefined,
        extensions: sanitizeExtensionsOutput(ct.extensions) || undefined,
      });
    } catch {
      return new Response(JSON.stringify({ error: 'Theme not found', code: 404 }), {
        status: 404, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
      });
    }
  } else {
    const themes = getAllThemes();
    const theme = themes.find((t) => t.preset === presetId);
    if (!theme) {
      return new Response(JSON.stringify({ error: 'Theme not found', code: 404 }), {
        status: 404, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
      });
    }
    themeData = theme;
    cssVars = theme.cssVars;
    themeObj = theme;
    processed = processThemePayload({
      customCss: theme.customCss,
      extensions: theme.extensions,
    });
  }

  // WCAG auto-fix
  let wcagFixApplied = false;
  let wcagChanges: any[] = [];
  if (wcagFix) {
    const { fixed, changes } = generateContrastFix(cssVars, wcagFix);
    cssVars = fixed;
    wcagFixApplied = true;
    wcagChanges = changes;
  }

  // Build body
  const body = buildBody(themeData, cssVars, processed);
  if (wcagFixApplied) { (body as any).wcagFixApplied = true; (body as any).wcagChanges = wcagChanges; }

  // Dual-theme
  if (dual) {
    const composedTheme = themeObj || {
      preset: themeData.id || presetId,
      presetName: themeData.name || presetId,
      cssVars,
      customCss: processed.customCss,
      extensions: processed.extensions,
      tags: themeData.tags,
    };
    const bgLum = isLightColor(cssVars['--color-bg'] || '#000000');
    const lightTheme = bgLum ? composedTheme : deriveLightVariant(composedTheme);
    const darkTheme = bgLum ? deriveDarkVariant(composedTheme) : composedTheme;
    (body as any).dual = { light: lightTheme, dark: darkTheme };
  }

  return new Response(JSON.stringify(body, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': presetId.startsWith('community-')
        ? 'public, max-age=3600'
        : 'public, max-age=86400, s-maxage=31536000, immutable',
      ...CORS_HEADERS,
    },
  });
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}
