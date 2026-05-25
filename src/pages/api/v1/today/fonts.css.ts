import { getDailyTheme } from '../../../../utils/daily-theme';
import { getDailyCommunityTheme } from '../../../../utils/omni-bridge';

export const prerender = false;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

export async function GET() {
  try {
    const communityDaily = await getDailyCommunityTheme();
    const theme = communityDaily || getDailyTheme();

    const headingFont = theme.cssVars['--font-heading'] || '';
    const bodyFont = theme.cssVars['--font-body'] || '';

    const fonts: string[] = [];
    for (const fontStr of [headingFont, bodyFont]) {
      const match = fontStr.match(/'([^']+)'/);
      if (match) {
        const name = match[1].replace(/ /g, '+');
        if (!fonts.includes(name)) fonts.push(name);
      }
    }

    if (fonts.length === 0) {
      return new Response("/* No custom fonts in today's theme */", {
        headers: {
          'Content-Type': 'text/css; charset=utf-8',
          'Cache-Control': 'public, max-age=3600',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    const families = fonts.map(f => `family=${f}:wght@400;500;700`).join('&');
    const googleFontsUrl = `https://fonts.googleapis.com/css2?${families}&display=swap`;

    const css = `/* ThemeDist Font Injection */
/* Today's theme: ${theme.presetName} */
/* Fonts: ${fonts.join(', ').replace(/\+/g, ' ')} */

@import url('${googleFontsUrl}');
`;

    return new Response(css, {
      headers: {
        'Content-Type': 'text/css; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err) {
    console.error('[v1/today/fonts.css] Error:', err);
    return new Response('/* Font injection unavailable */', {
      status: 500,
      headers: { 'Content-Type': 'text/css', 'Access-Control-Allow-Origin': '*' },
    });
  }
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}
