export const prerender = false;

import { isReady } from '../../../../lib/redis';
import { getPendingCount, getTotalCount } from '../../../../lib/themes-db';

export async function GET() {
  const ready = isReady();
  const pending = ready ? await getPendingCount() : -1;
  const approved = ready ? await getTotalCount() : -1;

  return new Response(JSON.stringify({
    redis: ready ? 'connected' : 'disconnected',
    pending,
    approved,
    apiVersion: 'v1',
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}
