import { getDailyTheme, getAllThemes } from '../../utils/daily-theme';
import { getDailyCommunityTheme } from '../../utils/omni-bridge';

export const prerender = false;

const CACHE = {
  'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=3600',
};

export async function GET() {
  try {
    const communityDaily = await getDailyCommunityTheme();
    const theme = communityDaily || getDailyTheme();

    let css = ':root {\n';
    for (const [k, v] of Object.entries(theme.cssVars)) {
      css += `  ${k}: ${v};\n`;
    }
    css += '}\n';

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
    console.error('[today.css] Unexpected error:', err);
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
