import type { Writable } from 'svelte/store';

export interface ThemeData {
  cssVars?: Record<string, string>;
  [key: string]: unknown;
}

export interface ThemeStoreValue {
  theme: ThemeData | null;
  loading: boolean;
}

/**
 * Create a writable Svelte store with theme data.
 * Fetches the theme on creation when running in the browser.
 * SSR-safe: on the server the store starts as { theme: null, loading: true } and no fetch occurs.
 *
 * @param api API endpoint. Defaults to '/api/v1/today.json'.
 */
export declare function createThemeStore(api?: string): Writable<ThemeStoreValue>;

/**
 * Set the theme store in Svelte component context.
 * Call this in a top-level layout component.
 *
 * @param store A store created with createThemeStore().
 */
export declare function setThemeContext(store: Writable<ThemeStoreValue>): void;

/**
 * Get the theme store from Svelte component context.
 * Must be called inside a component whose ancestor called setThemeContext().
 * Returns null if no provider exists.
 */
export declare function useTheme(): Writable<ThemeStoreValue> | null;

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
