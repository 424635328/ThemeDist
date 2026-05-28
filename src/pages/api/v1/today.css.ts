import { getDailyTheme } from '../../../utils/daily-theme';
import { getDailyCommunityTheme, getDateTheme, getMMDDForTimezone, enrichCssVars } from '../../../utils/omni-bridge';
import { applyOverrides } from '../../../utils/sanitize';
import { isLightColor, generateContrastFix } from '../../../utils/color';
import { deriveDarkVariant, deriveLightVariant } from '../../../utils/dark-mode';
import type { ComposedTheme } from '../../../themes/types';

export const prerender = false;

const CACHE = {
  'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=3600',
};

/** Build :root CSS block from cssVars. */
function buildCssBlock(cssVars: Record<string, string>): string {
  let css = '  ';
  for (const [k, v] of Object.entries(cssVars)) {
    css += `${k}: ${v};\n  `;
  }
  return css;
}

export async function GET({ url }: { url: URL }) {
  try {
    const tz = url.searchParams.get('tz');
    const overridesRaw = url.searchParams.get('overrides');
    const wcagFix = url.searchParams.get('wcag-fix') as 'aa' | 'aaa' | null;
    const dual = url.searchParams.get('dual') === 'true';
    const dualMode = url.searchParams.get('mode') || 'class';
    const locale = url.searchParams.get('locale');

    let theme: ComposedTheme;
    if (tz) {
      const dateStr = getMMDDForTimezone(tz);
      theme = await getDateTheme(dateStr, locale || undefined);
    } else {
      const communityDaily = await getDailyCommunityTheme();
      theme = communityDaily || getDailyTheme();
    }

    let cssVars = theme.cssVars;
    if (overridesRaw) {
      cssVars = applyOverrides(cssVars, overridesRaw);
    }

    // WCAG auto-fix
    if (wcagFix) {
      const { fixed } = generateContrastFix(cssVars, wcagFix);
      cssVars = fixed;
    }

    if (dual) {
      // Generate dual-theme CSS
      const bgLum = isLightColor(cssVars['--color-bg'] || '#000000');
      const lightTheme = bgLum ? { ...theme, cssVars } : deriveLightVariant(theme);
      const darkTheme = bgLum ? deriveDarkVariant(theme) : { ...theme, cssVars };

      const lightVars = bgLum ? cssVars : lightTheme.cssVars;
      const darkVars = bgLum ? darkTheme.cssVars : cssVars;

      const selector = dualMode === 'data'
        ? (scheme: string) => `[data-theme="${scheme}"]`
        : (scheme: string) => `.theme-${scheme}`;

      let css = `${selector('light')} {\n${buildCssBlock(lightVars)}}\n\n`;
      css += `${selector('dark')} {\n${buildCssBlock(darkVars)}}\n`;

      if (theme.customCss) {
        css += `\n/* customCss */\n${theme.customCss}\n`;
      }

      return new Response(css, {
        headers: {
          'Content-Type': 'text/css; charset=utf-8',
          'Access-Control-Allow-Origin': '*',
          ...CACHE,
        },
      });
    }

    // Single-theme mode (original behavior)
    let css = ':root {\n';
    for (const [k, v] of Object.entries(cssVars)) {
      css += `  ${k}: ${v};\n`;
    }
    css += '}\n';

    // Dark/Light mode adaptation
    const bgColor = cssVars['--color-bg'] || '#000000';
    if (isLightColor(bgColor)) {
      css += '\n@media (prefers-color-scheme: dark) {\n';
      css += '  :root {\n';
      css += '    --color-bg: #121212;\n';
      css += '    --color-surface: #1e1e1e;\n';
      css += '    --color-text: #e2e8f0;\n';
      css += '    --color-text-muted: #94a3b8;\n';
      css += '    --color-border: rgba(255,255,255,0.1);\n';
      css += '    --color-bg-dark: #121212;\n';
      css += '    --color-text-dark: #e2e8f0;\n';
      css += '  }\n';
      css += '}\n';
      css += '\n:root {\n';
      css += '  --color-bg-light: ' + bgColor + ';\n';
      css += '  --color-bg-dark: #121212;\n';
      css += '  --color-text-light: ' + (cssVars['--color-text'] || '#1e293b') + ';\n';
      css += '  --color-text-dark: #e2e8f0;\n';
      css += '}\n';
    } else {
      css += '\n@media (prefers-color-scheme: light) {\n';
      css += '  :root {\n';
      css += '    --color-bg: #f8fafc;\n';
      css += '    --color-surface: #ffffff;\n';
      css += '    --color-text: #1e293b;\n';
      css += '    --color-text-muted: #64748b;\n';
      css += '    --color-border: rgba(0,0,0,0.1);\n';
      css += '    --color-bg-light: #f8fafc;\n';
      css += '    --color-text-light: #1e293b;\n';
      css += '  }\n';
      css += '}\n';
      css += '\n:root {\n';
      css += '  --color-bg-dark: ' + bgColor + ';\n';
      css += '  --color-bg-light: #f8fafc;\n';
      css += '  --color-text-dark: ' + (cssVars['--color-text'] || '#e2e8f0') + ';\n';
      css += '  --color-text-light: #1e293b;\n';
      css += '}\n';
    }

    if (theme.customCss) {
      css += `\n/* customCss */\n${theme.customCss}\n`;
    }

    return new Response(css, {
      headers: {
        'Content-Type': 'text/css; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        ...CACHE,
      },
    });
  } catch (err) {
    console.error('[v1/today.css] Unexpected error:', err);
    return new Response('/* Theme unavailable */', {
      status: 500,
      headers: { 'Content-Type': 'text/css', 'Access-Control-Allow-Origin': '*' },
    });
  }
}

export function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, OPTIONS' },
  });
}
