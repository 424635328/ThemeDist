import { writable, get } from 'svelte/store';
import { setContext, getContext } from 'svelte';

const THEME_KEY = 'themedist-theme';

const DEFAULT_API = '/api/v1/today.json';

/**
 * Create a writable Svelte store with theme data.
 * Fetches the theme on creation when running in the browser.
 * SSR-safe: on the server the store starts as { theme: null, loading: true } and no fetch occurs.
 *
 * @param {string} [api] - API endpoint. Defaults to '/api/v1/today.json'.
 * @returns {import('svelte/store').Writable<{ theme: object|null, loading: boolean }>}
 */
export function createThemeStore(api = DEFAULT_API) {
  const store = writable({ theme: null, loading: true });

  if (typeof window !== 'undefined') {
    loadTheme(api, store);
  }

  return store;
}

/**
 * Load theme data into a store. Called automatically by createThemeStore on the client.
 */
async function loadTheme(api, store) {
  try {
    const pin = localStorage.getItem('td_runner_pin');
    const url = pin
      ? api.replace(/\/api\/v1\/today\.json$/, '/api/v1/theme/' + encodeURIComponent(pin) + '.json')
      : api;
    const sep = url.includes('?') ? '&' : '?';
    const res = await fetch(url + sep + 'dual=true');
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    store.set({ theme: data, loading: false });

    // Apply CSS vars to :root
    if (data?.cssVars) {
      Object.entries(data.cssVars).forEach(([k, v]) => document.documentElement.style.setProperty(k, v));
    }
  } catch (e) {
    store.set({ theme: null, loading: false });
  }
}

/**
 * Set the theme store in Svelte component context.
 * Call this in a top-level layout component.
 *
 * @param {import('svelte/store').Writable} store - A store created with createThemeStore().
 */
export function setThemeContext(store) {
  setContext(THEME_KEY, store);
}

/**
 * Get the theme store from Svelte component context.
 * Must be called inside a component whose ancestor called setThemeContext().
 * Returns null if no provider exists.
 *
 * @returns {import('svelte/store').Writable<{ theme: object|null, loading: boolean }> | null}
 */
export function useTheme() {
  return getContext(THEME_KEY) || null;
}

export function setPin(preset) {
  if (typeof localStorage === 'undefined') return;
  if (preset) localStorage.setItem('td_runner_pin', preset);
  else localStorage.removeItem('td_runner_pin');
}

export function clearPin() {
  if (typeof localStorage !== 'undefined') localStorage.removeItem('td_runner_pin');
}

export function getPin() {
  if (typeof localStorage === 'undefined') return null;
  return localStorage.getItem('td_runner_pin');
}

export function setMode(mode) {
  if (typeof localStorage === 'undefined' || typeof document === 'undefined') return;
  if (mode === 'light' || mode === 'dark' || mode === 'auto') {
    localStorage.setItem('td_runner_mode', mode);
    if (mode === 'auto') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', mode);
    }
  }
}
