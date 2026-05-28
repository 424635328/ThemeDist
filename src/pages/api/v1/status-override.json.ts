import type { APIRoute } from 'astro';
import { enrichCssVars } from '../../../utils/omni-bridge';
import { STRUCTURAL_CSS_VARS } from '../../../lib/css-vars-defaults';
import { STATUS_THEMES, VALID_STATUSES } from '../../../lib/status-themes';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

export const GET: APIRoute = async ({ url }) => {
  const status = url.searchParams.get('status') || '';

  if (!status || !STATUS_THEMES[status]) {
    return new Response(JSON.stringify({
      error: 'Invalid or missing status parameter',
      validStatuses: VALID_STATUSES,
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  }

  const cssVars = enrichCssVars({ ...STATUS_THEMES[status], ...STRUCTURAL_CSS_VARS });

  return new Response(JSON.stringify({
    status,
    cssVars,
    filter: status === 'mourning' ? 'grayscale(100%)' : null,
  }, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=300',
      ...CORS_HEADERS,
    },
  });
};

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}
