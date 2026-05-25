import type { APIRoute } from 'astro';
import { getAllThemes } from '../../../../../utils/daily-theme';
import { get as redisGet } from '../../../../../lib/redis';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

function resolve(vars: Record<string, string>, key: string, fallback: string): string {
  return vars[key] || fallback;
}

export const GET: APIRoute = async ({ params }) => {
  const id = params.id!;
  let cssVars: Record<string, string>;
  let tags: string[] = [];
  let presetName = id;

  if (id.startsWith('community-')) {
    const redisId = id.slice('community-'.length);
    try {
      const ct = await redisGet<any>(`td:theme:${redisId}`);
      if (!ct) {
        return new Response(JSON.stringify({ error: 'Theme not found', code: 404 }), {
          status: 404, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
        });
      }
      cssVars = ct.cssVars;
      tags = ct.tags || [];
      presetName = ct.name || id;
    } catch {
      return new Response(JSON.stringify({ error: 'Theme not found', code: 404 }), {
        status: 404, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
      });
    }
  } else {
    const themes = getAllThemes();
    const theme = themes.find((t) => t.preset === id);
    if (!theme) {
      return new Response(JSON.stringify({ error: 'Theme not found', code: 404 }), {
        status: 404, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
      });
    }
    cssVars = theme.cssVars;
    tags = theme.tags || [];
    presetName = theme.presetName;
  }

  const bg = resolve(cssVars, '--color-bg', '#0f0f23');
  const text = resolve(cssVars, '--color-text', '#f4f4f5');
  const primary = resolve(cssVars, '--color-primary', '#6366f1');
  const secondary = resolve(cssVars, '--color-secondary', '#818cf8');
  const accent = resolve(cssVars, '--color-accent', '#f43f5e');
  const muted = resolve(cssVars, '--color-text-muted', '#a1a1aa');
  const surface = resolve(cssVars, '--color-surface', '#1a1a2e');

  const isDark = tags.includes('dark') || !tags.includes('light');

  const shikiTheme = {
    name: `ThemeDist - ${presetName}`,
    type: isDark ? 'dark' : 'light',
    semanticHighlighting: true,
    colors: {
      'editor.background': bg,
      'editor.foreground': text,
      'editorLineNumber.foreground': muted,
      'editorLineNumber.activeForeground': text,
      'editor.selectionBackground': primary + '40',
      'editor.selectionHighlightBackground': primary + '30',
      'editorCursor.foreground': primary,
      'editorBracketMatch.background': primary + '25',
      'editorBracketMatch.border': primary + '50',
      'activityBar.background': bg,
      'activityBar.foreground': primary,
      'sideBar.background': surface,
      'sideBar.foreground': text,
      'sideBarTitle.foreground': primary,
      'tab.activeBackground': surface,
      'tab.activeForeground': text,
      'tab.inactiveBackground': bg,
      'tab.inactiveForeground': muted,
      'statusBar.background': surface,
      'statusBar.foreground': text,
      'titleBar.activeBackground': bg,
      'titleBar.activeForeground': text,
      'input.background': surface,
      'input.foreground': text,
      'input.border': bg,
      'focusBorder': primary + '80',
      'list.activeSelectionBackground': primary + '30',
      'list.hoverBackground': primary + '15',
    },
    tokenColors: [
      { scope: ['comment', 'punctuation.definition.comment'],
        settings: { fontStyle: 'italic', foreground: muted } },
      { scope: ['keyword', 'storage.type', 'storage.modifier'],
        settings: { foreground: primary, fontStyle: 'bold' } },
      { scope: ['keyword.operator', 'keyword.control'],
        settings: { foreground: accent } },
      { scope: ['string', 'markup.inline.raw', 'string.quoted'],
        settings: { foreground: secondary } },
      { scope: ['constant.numeric', 'constant.language', 'constant.character'],
        settings: { foreground: accent } },
      { scope: ['entity.name.function', 'support.function', 'entity.name.method'],
        settings: { foreground: primary } },
      { scope: ['entity.name.type', 'entity.name.class', 'support.type'],
        settings: { foreground: secondary } },
      { scope: ['variable', 'variable.other', 'variable.parameter'],
        settings: { foreground: text } },
      { scope: ['variable.language', 'variable.other.constant'],
        settings: { foreground: accent } },
      { scope: ['punctuation', 'meta.brace'],
        settings: { foreground: muted } },
      { scope: ['markup.heading', 'markup.bold'],
        settings: { foreground: text, fontStyle: 'bold' } },
      { scope: ['markup.italic'],
        settings: { foreground: text, fontStyle: 'italic' } },
      { scope: ['markup.link', 'string.other.link'],
        settings: { foreground: primary, fontStyle: 'underline' } },
    ],
  };

  return new Response(JSON.stringify(shikiTheme, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=86400, s-maxage=31536000, immutable',
      ...CORS_HEADERS,
    },
  });
};

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}
