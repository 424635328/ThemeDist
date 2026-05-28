export const prerender = false;

import { submitTheme, getTheme } from '../../../../lib/themes-db';
import { isReady } from '../../../../lib/redis';
import { sanitizeText, sanitizeCustomCss } from '../../../../utils/sanitize';
import { enrichCssVars } from '../../../../utils/omni-bridge';
import { STRUCTURAL_CSS_VARS } from '../../../../lib/css-vars-defaults';
import { getAllThemes } from '../../../../utils/daily-theme';
import type { ComposedTheme } from '../../../../themes/types';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function POST({ request }: { request: Request }) {
  if (!isReady()) {
    return new Response(JSON.stringify({ error: '数据库暂时不可用' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json', ...CORS },
    });
  }

  try {
    const body = await request.json();
    const { sourceId, name, author, overrides } = body;

    if (!sourceId || typeof sourceId !== 'string') {
      return new Response(JSON.stringify({ error: '缺少必填字段: sourceId' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...CORS },
      });
    }

    // Load source theme
    let sourceCssVars: Record<string, string> | undefined;
    let sourceName: string | undefined;

    if (sourceId.startsWith('community-')) {
      const id = sourceId.replace(/^community-/, '');
      const theme = await getTheme(id);
      if (!theme) {
        return new Response(JSON.stringify({ error: '找不到源主题' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json', ...CORS },
        });
      }
      sourceCssVars = theme.cssVars;
      sourceName = theme.name;
    } else {
      const all = getAllThemes();
      const theme = all.find((t: ComposedTheme) => t.preset === sourceId);
      if (!theme) {
        return new Response(JSON.stringify({ error: '找不到源主题' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json', ...CORS },
        });
      }
      sourceCssVars = theme.cssVars;
      sourceName = theme.presetName;
    }

    if (!sourceCssVars) {
      return new Response(JSON.stringify({ error: '源主题缺少样式变量' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...CORS },
      });
    }

    // Merge overrides — only allow -- prefixed keys, validate values
    const cssVars: Record<string, string> = { ...sourceCssVars };
    if (overrides && typeof overrides === 'object') {
      for (const [k, v] of Object.entries(overrides)) {
        let key = String(k).trim();
        if (!key.startsWith('--')) continue;
        cssVars[key] = typeof v === 'string' ? v.trim() : String(v);
      }
    }

    // Enrich cssVars
    const enrichedCssVars = enrichCssVars({ ...STRUCTURAL_CSS_VARS, ...cssVars });

    const theme = await submitTheme({
      name: sanitizeText(name || sourceName || 'Fork'),
      author: sanitizeText(author || 'Anonymous'),
      cssVars: enrichedCssVars,
      customCss: sanitizeCustomCss(null),
      forkedFrom: sourceId,
    });

    if (!theme) {
      return new Response(JSON.stringify({ error: '提交失败，请稍后重试' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...CORS },
      });
    }

    return new Response(JSON.stringify({
      id: theme.id,
      name: theme.name,
      forkedFrom: sourceId,
      status: 'pending',
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json', ...CORS },
    });
  } catch {
    return new Response(JSON.stringify({ error: '请求格式错误' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...CORS },
    });
  }
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}
