/**
 * Shared structural (non-color) CSS variable defaults.
 * All theme sources — OmniConfig, community, AI-generated, fallback — use these.
 */

export const STRUCTURAL_CSS_VARS: Record<string, string> = {
  // Typography
  '--font-heading': "'Inter', system-ui, sans-serif",
  '--font-body': "'Inter', system-ui, sans-serif",
  '--font-mono': "'JetBrains Mono', monospace",
  '--text-base': 'clamp(1rem, 0.9rem + 0.5vw, 1.125rem)',
  '--text-lg': 'calc(var(--text-base) * 1.25)',
  '--text-xl': 'calc(var(--text-lg) * 1.25)',
  '--text-2xl': 'calc(var(--text-xl) * 1.25)',
  '--text-sm': 'calc(var(--text-base) / 1.25)',

  // Spacing
  '--space-unit': '0.25rem',
  '--space-1': 'calc(0.25rem * 1)',
  '--space-2': 'calc(0.25rem * 2)',
  '--space-3': 'calc(0.25rem * 3)',
  '--space-4': 'calc(0.25rem * 4)',
  '--space-6': 'calc(0.25rem * 6)',
  '--space-8': 'calc(0.25rem * 8)',
  '--space-12': 'calc(0.25rem * 12)',

  // Layout
  '--radii': '0.75rem',
  '--content-max': '72rem',

  // Shadows
  '--shadow-sm': '0 1px 2px rgba(0,0,0,0.08)',
  '--shadow-md': '0 4px 12px rgba(0,0,0,0.12)',
  '--shadow-lg': '0 12px 32px rgba(0,0,0,0.18)',

  // Glass
  '--glass-bg': 'color-mix(in srgb, var(--color-bg) 85%, transparent)',
  '--glass-blur': 'blur(16px)',

  // Noise
  '--noise-opacity': '0',

  // Z-Index layer contract
  '--td-z-base': '-10',
  '--td-z-float': '10',
  '--td-z-weather': '20',
  '--td-z-fx': '9999',
};
