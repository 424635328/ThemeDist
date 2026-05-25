import type { APIRoute } from 'astro';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

const STATUS_THEMES: Record<string, Record<string, string>> = {
  maintenance: {
    '--color-primary': '#71717a',
    '--color-secondary': '#a1a1aa',
    '--color-accent': '#52525b',
    '--color-bg': '#f4f4f5',
    '--color-surface': '#e4e4e7',
    '--color-text': '#18181b',
    '--color-text-muted': '#71717a',
    '--color-border': 'rgba(113,113,122,0.2)',
    '--font-heading': "'Inter', system-ui, sans-serif",
    '--font-body': "'Inter', system-ui, sans-serif",
    '--font-mono': "'JetBrains Mono', monospace",
    '--text-base': 'clamp(1rem, 0.9rem + 0.5vw, 1.125rem)',
    '--text-lg': 'calc(var(--text-base) * 1.25)',
    '--text-xl': 'calc(var(--text-lg) * 1.25)',
    '--text-2xl': 'calc(var(--text-xl) * 1.25)',
    '--text-sm': 'calc(var(--text-base) / 1.25)',
    '--space-unit': '0.25rem',
    '--space-1': 'calc(0.25rem * 1)',
    '--space-2': 'calc(0.25rem * 2)',
    '--space-3': 'calc(0.25rem * 3)',
    '--space-4': 'calc(0.25rem * 4)',
    '--space-6': 'calc(0.25rem * 6)',
    '--space-8': 'calc(0.25rem * 8)',
    '--space-12': 'calc(0.25rem * 12)',
    '--radii': '0.5rem',
    '--content-max': '72rem',
    '--shadow-sm': '0 1px 2px rgba(0,0,0,0.06)',
    '--shadow-md': '0 4px 12px rgba(0,0,0,0.08)',
    '--shadow-lg': '0 12px 32px rgba(0,0,0,0.12)',
    '--glass-bg': 'color-mix(in srgb, var(--color-bg) 85%, transparent)',
    '--glass-blur': 'blur(16px)',
    '--noise-opacity': '0',
    '--ambient-1': 'rgba(113,113,122,0.08)',
    '--ambient-2': 'rgba(161,161,170,0.04)',
  },
  mourning: {
    '--color-primary': '#3f3f46',
    '--color-secondary': '#52525b',
    '--color-accent': '#27272a',
    '--color-bg': '#18181b',
    '--color-surface': '#27272a',
    '--color-text': '#a1a1aa',
    '--color-text-muted': '#71717a',
    '--color-border': 'rgba(63,63,70,0.3)',
    '--font-heading': "'Inter', system-ui, sans-serif",
    '--font-body': "'Inter', system-ui, sans-serif",
    '--font-mono': "'JetBrains Mono', monospace",
    '--text-base': 'clamp(1rem, 0.9rem + 0.5vw, 1.125rem)',
    '--text-lg': 'calc(var(--text-base) * 1.25)',
    '--text-xl': 'calc(var(--text-lg) * 1.25)',
    '--text-2xl': 'calc(var(--text-xl) * 1.25)',
    '--text-sm': 'calc(var(--text-base) / 1.25)',
    '--space-unit': '0.25rem',
    '--space-1': 'calc(0.25rem * 1)',
    '--space-2': 'calc(0.25rem * 2)',
    '--space-3': 'calc(0.25rem * 3)',
    '--space-4': 'calc(0.25rem * 4)',
    '--space-6': 'calc(0.25rem * 6)',
    '--space-8': 'calc(0.25rem * 8)',
    '--space-12': 'calc(0.25rem * 12)',
    '--radii': '0.5rem',
    '--content-max': '72rem',
    '--shadow-sm': '0 1px 2px rgba(0,0,0,0.1)',
    '--shadow-md': '0 4px 12px rgba(0,0,0,0.15)',
    '--shadow-lg': '0 12px 32px rgba(0,0,0,0.2)',
    '--glass-bg': 'color-mix(in srgb, var(--color-bg) 90%, transparent)',
    '--glass-blur': 'blur(16px)',
    '--noise-opacity': '0',
    '--ambient-1': 'rgba(0,0,0,0.15)',
    '--ambient-2': 'rgba(0,0,0,0.08)',
  },
  incident: {
    '--color-primary': '#ef4444',
    '--color-secondary': '#dc2626',
    '--color-accent': '#f97316',
    '--color-bg': '#fef2f2',
    '--color-surface': '#fee2e2',
    '--color-text': '#1f2937',
    '--color-text-muted': '#6b7280',
    '--color-border': 'rgba(239,68,68,0.25)',
    '--font-heading': "'Inter', system-ui, sans-serif",
    '--font-body': "'Inter', system-ui, sans-serif",
    '--font-mono': "'JetBrains Mono', monospace",
    '--text-base': 'clamp(1rem, 0.9rem + 0.5vw, 1.125rem)',
    '--text-lg': 'calc(var(--text-base) * 1.25)',
    '--text-xl': 'calc(var(--text-lg) * 1.25)',
    '--text-2xl': 'calc(var(--text-xl) * 1.25)',
    '--text-sm': 'calc(var(--text-base) / 1.25)',
    '--space-unit': '0.25rem',
    '--space-1': 'calc(0.25rem * 1)',
    '--space-2': 'calc(0.25rem * 2)',
    '--space-3': 'calc(0.25rem * 3)',
    '--space-4': 'calc(0.25rem * 4)',
    '--space-6': 'calc(0.25rem * 6)',
    '--space-8': 'calc(0.25rem * 8)',
    '--space-12': 'calc(0.25rem * 12)',
    '--radii': '0.5rem',
    '--content-max': '72rem',
    '--shadow-sm': '0 1px 2px rgba(0,0,0,0.06)',
    '--shadow-md': '0 4px 12px rgba(0,0,0,0.08)',
    '--shadow-lg': '0 12px 32px rgba(0,0,0,0.12)',
    '--glass-bg': 'color-mix(in srgb, var(--color-bg) 85%, transparent)',
    '--glass-blur': 'blur(16px)',
    '--noise-opacity': '0',
    '--ambient-1': 'rgba(239,68,68,0.1)',
    '--ambient-2': 'rgba(249,115,22,0.05)',
  },
};

export const GET: APIRoute = async ({ url }) => {
  const status = url.searchParams.get('status') || '';

  if (!status || !STATUS_THEMES[status]) {
    return new Response(JSON.stringify({
      error: 'Invalid or missing status parameter',
      validStatuses: Object.keys(STATUS_THEMES),
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  }

  const cssVars = STATUS_THEMES[status];

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
