import type { Ref, ComputedRef, DefineComponent, Component } from 'vue';

export interface ThemeData {
  cssVars?: Record<string, string>;
  [key: string]: unknown;
}

export interface ThemeContextValue {
  theme: Ref<ThemeData | null>;
  loading: Ref<boolean>;
}

export interface ThemeProviderProps {
  /** API endpoint to fetch theme from. Defaults to '/api/v1/today.json'. */
  api?: string;
}

/**
 * ThemeProvider — Vue 3 component that fetches theme and provides via provide/inject.
 * SSR-safe: skips fetch on the server, hydrates on the client.
 */
export declare const ThemeProvider: DefineComponent<ThemeProviderProps>;

/**
 * Composable that returns the theme context as reactive refs.
 * Must be called inside a ThemeProvider.
 * Returns { theme: ref(null), loading: ref(true) } when no provider exists.
 */
export declare function useTheme(): ThemeContextValue;

/**
 * Computed CSS string of custom property declarations from the current theme.
 */
export declare function useThemeCSSVars(): ComputedRef<string>;

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
