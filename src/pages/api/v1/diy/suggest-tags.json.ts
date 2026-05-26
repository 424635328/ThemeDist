export const prerender = false;

import { suggestTags } from '../../../../lib/tag-suggest';
import type { SuggestTagsInput } from '../../../../lib/tag-suggest';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function POST({ request }: { request: Request }) {
  try {
    const body = await request.json();
    const { cssVars, customCss, extensions, presetName } = body || {};

    if (!cssVars || typeof cssVars !== 'object') {
      return new Response(JSON.stringify({ error: '请提供 cssVars 对象' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json; charset=utf-8', ...CORS },
      });
    }

    const input: SuggestTagsInput = { cssVars, customCss, extensions, presetName };
    const tags = suggestTags(input);

    return new Response(JSON.stringify({ tags, apiVersion: 'v1' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json; charset=utf-8', ...CORS },
    });
  } catch {
    return new Response(JSON.stringify({ error: '请求格式错误' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json; charset=utf-8', ...CORS },
    });
  }
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}
