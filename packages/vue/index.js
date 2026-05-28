import { ref, computed, provide, inject, onMounted, onUnmounted, watch, defineComponent, h } from 'vue';

const THEME_KEY = Symbol('themedist-theme');

const DEFAULT_API = '/api/v1/today.json';

/**
 * ThemeProvider — Vue 3 component that fetches theme and provides via provide/inject.
 * SSR-safe: skips fetch on the server, hydrates on the client.
 */
export const ThemeProvider = defineComponent({
  name: 'ThemeProvider',
  props: {
    api: { type: String, default: DEFAULT_API }
  },
  setup(props, { slots }) {
    const theme = ref(null);
    const loading = ref(true);

    let cancelled = false;

    onMounted(async () => {
      try {
        const pin = localStorage.getItem('td_runner_pin');
        const url = pin
          ? props.api.replace(/\/api\/v1\/today\.json$/, '/api/v1/theme/' + encodeURIComponent(pin) + '.json')
          : props.api;
        const sep = url.includes('?') ? '&' : '?';
        const res = await fetch(url + sep + 'dual=true');
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const data = await res.json();
        if (!cancelled) { theme.value = data; loading.value = false; }
      } catch (e) {
        if (!cancelled) loading.value = false;
      }
    });

    onUnmounted(() => { cancelled = true; });

    // Apply CSS vars to :root
    watch(theme, (newTheme, oldTheme) => {
      if (typeof document === 'undefined') return;
      // Remove old vars
      if (oldTheme?.cssVars) {
        Object.keys(oldTheme.cssVars).forEach(k => document.documentElement.style.removeProperty(k));
      }
      // Apply new vars
      if (newTheme?.cssVars) {
        Object.entries(newTheme.cssVars).forEach(([k, v]) => document.documentElement.style.setProperty(k, v));
      }
    });

    provide(THEME_KEY, { theme, loading });

    return () => slots.default?.();
  }
});

/**
 * Composable that returns the theme context.
 * Must be called inside a ThemeProvider.
 * Returns { theme: ref(null), loading: ref(true) } when no provider exists.
 */
export function useTheme() {
  const ctx = inject(THEME_KEY, null);
  if (ctx) return ctx;
  return { theme: ref(null), loading: ref(true) };
}

/**
 * Computed CSS string of custom property declarations from the current theme.
 */
export function useThemeCSSVars() {
  const { theme } = useTheme();
  return computed(() => {
    if (!theme.value?.cssVars) return '';
    return Object.entries(theme.value.cssVars).map(([k, v]) => k + ': ' + v + ';').join('\n');
  });
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
