export const prerender = false;

import { listThemes, getTotalCount } from '../../../lib/themes-db';
import { isReady } from '../../../lib/redis';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function GET({ url }: { url: URL }) {
  if (!isReady()) {
    return new Response(JSON.stringify({ themes: [], total: 0, dbAvailable: false }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=60', ...CORS },
    });
  }

  const sort = (url.searchParams.get('sort') || 'new') as 'new' | 'hot';
  const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'));
  const pageSize = Math.min(50, Math.max(1, parseInt(url.searchParams.get('size') || '20')));

  const [themes, total] = await Promise.all([
    listThemes(sort, page, pageSize),
    getTotalCount(),
  ]);

  return new Response(JSON.stringify({ themes, total, dbAvailable: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=60', ...CORS },
  });
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}
