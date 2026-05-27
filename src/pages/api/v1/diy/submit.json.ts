export const prerender = false;

import { submitTheme } from '../../../../lib/themes-db';
import { isReady } from '../../../../lib/redis';
import { sanitizeText, sanitizeCustomCss, validateUserExtensions, collectExtensionWarnings, sanitizeClickEffect } from '../../../../utils/sanitize';
import { enrichCssVars } from '../../../../utils/omni-bridge';
import { STRUCTURAL_CSS_VARS } from '../../../../lib/css-vars-defaults';

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
    const { name, author, cssVars: rawVars, customCss, extensions: rawExts, clickEffect: rawClickEffect, tags } = body;

    if (!name || !author || !rawVars || typeof rawVars !== 'object') {
      return new Response(JSON.stringify({ error: '缺少必填字段: name, author, cssVars' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...CORS },
      });
    }

    // Normalize keys: ensure -- prefix (defense against AI generating unprefixed keys)
    const cssVars: Record<string, string> = {};
    for (const [k, v] of Object.entries(rawVars)) {
      let key = String(k).trim();
      if (!key.startsWith('--')) key = '--' + key.replace(/^-+/, '');
      cssVars[key] = typeof v === 'string' ? v.trim() : String(v);
    }

    if (!cssVars['--color-primary'] || !cssVars['--color-bg']) {
      return new Response(JSON.stringify({ error: 'cssVars 必须包含 --color-primary 和 --color-bg' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...CORS },
      });
    }

    const extensions = validateUserExtensions(rawExts);
    const extWarnings = collectExtensionWarnings(rawExts);

    // Enrich cssVars: merge structural defaults + generate RGB channel variants
    const enrichedCssVars = enrichCssVars({ ...STRUCTURAL_CSS_VARS, ...cssVars });

    const theme = await submitTheme({
      name: sanitizeText(name),
      author: sanitizeText(author),
      cssVars: enrichedCssVars,
      customCss: sanitizeCustomCss(customCss),
      extensions,
      clickEffect: sanitizeClickEffect(rawClickEffect),
      tags,
    });

    if (!theme) {
      return new Response(JSON.stringify({ error: '提交失败，请稍后重试' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...CORS },
      });
    }

    return new Response(JSON.stringify({ success: true, theme, warnings: extWarnings.length > 0 ? extWarnings : undefined, apiVersion: 'v1' }), {
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
