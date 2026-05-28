import type { ReactNode } from 'react';

export interface ThemeData {
  cssVars?: Record<string, string>;
  [key: string]: unknown;
}

export interface ThemeContextValue {
  theme: ThemeData | null;
  loading: boolean;
}

export interface ThemeProviderProps {
  /** API endpoint to fetch theme from. Defaults to '/api/v1/today.json'. */
  api?: string;
  children: ReactNode;
}

/**
 * ThemeProvider — fetches theme on mount, provides via context.
 * SSR-safe: renders children immediately, hydrates theme on client.
 */
export declare function ThemeProvider(props: ThemeProviderProps): ReactNode;

/**
 * Returns the current theme context value.
 * Must be used inside a ThemeProvider.
 * Returns { theme: null, loading: true } when used outside a provider.
 */
export declare function useTheme(): ThemeContextValue;

/**
 * Returns a CSS string of CSS custom property declarations
 * derived from the current theme's cssVars.
 * Returns an empty string when no theme is loaded.
 */
export declare function useThemeCSSVars(): string;

/**
 * Set or clear the runner pin stored in localStorage.
 * Pass a truthy string to set, falsy value to clear.
 */
export declare function setPin(preset: string | null | undefined): void;

/** Remove the runner pin from localStorage. */
export declare function clearPin(): void;

/** Get the current runner pin from localStorage, or null. */
export declare function getPin(): string | null;

/**
 * Set the colour mode and persist it in localStorage.
 * 'auto' removes the data-theme attribute so the OS preference takes over.
 */
export declare function setMode(mode: 'light' | 'dark' | 'auto'): void;
