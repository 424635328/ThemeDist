import { getDailyTheme } from '../../../utils/daily-theme';
import { getDailyCommunityTheme } from '../../../utils/omni-bridge';

export const prerender = false;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

function cssVarsToTokens(cssVars: Record<string, string>) {
  const tokens: any = {};
  for (const [key, value] of Object.entries(cssVars)) {
    if (key.endsWith('-rgb')) continue;
    if (key.startsWith('--color-') || key.startsWith('--ambient-')) {
      (tokens.color ||= {})[key.replace(/^--(color|ambient)-/, '')] = { $value: value, $type: 'color' };
    } else if (key.startsWith('--space-') || key === '--radii' || key === '--content-max') {
      (tokens.space ||= {})[key.replace(/^--/, '')] = { $value: value, $type: 'dimension' };
    } else if (key.startsWith('--font-')) {
      (tokens.typography ||= {})[key.replace(/^--font-/, '')] = { $value: value, $type: 'fontFamily' };
    } else if (key.startsWith('--text-')) {
      (tokens.fontSize ||= {})[key.replace(/^--text-/, '')] = { $value: value, $type: 'dimension' };
    } else if (key.startsWith('--shadow-') || key.startsWith('--glass-') || key.startsWith('--noise-')) {
      (tokens.effects ||= {})[key.replace(/^--/, '')] = { $value: value, $type: 'other' };
    }
  }
  return tokens;
}

export async function GET() {
  try {
    const communityDaily = await getDailyCommunityTheme();
    const theme = communityDaily || getDailyTheme();

    return new Response(JSON.stringify({
      preset: theme.preset,
      presetName: theme.presetName,
      tokens: cssVarsToTokens(theme.cssVars),
      apiVersion: 'v1',
    }, null, 2), {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        ...CORS_HEADERS,
        'Cache-Control': 'public, max-age=3600, s-maxage=86400',
      },
    });
  } catch (err) {
    console.error('[v1/tokens.json] Error:', err);
    return new Response(JSON.stringify({ error: '内部服务错误' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  }
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}
