import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import React from 'react';

const ThemeContext = createContext(null);

const DEFAULT_API = '/api/v1/today.json';

/**
 * ThemeProvider — fetches theme on mount, provides via context.
 * SSR-safe: renders children immediately, hydrates theme on client.
 */
export function ThemeProvider({ api = DEFAULT_API, children }) {
  const [theme, setTheme] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const pin = typeof localStorage !== 'undefined' ? localStorage.getItem('td_runner_pin') : null;
        const url = pin
          ? api.replace(/\/api\/v1\/today\.json$/, '/api/v1/theme/' + encodeURIComponent(pin) + '.json')
          : api;
        const sep = url.includes('?') ? '&' : '?';
        const res = await fetch(url + sep + 'dual=true');
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const data = await res.json();
        if (!cancelled) { setTheme(data); setLoading(false); }
      } catch (e) {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [api]);

  // Apply CSS vars to :root
  useEffect(() => {
    if (!theme?.cssVars) return;
    const entries = Object.entries(theme.cssVars);
    entries.forEach(([k, v]) => document.documentElement.style.setProperty(k, v));
    return () => entries.forEach(([k]) => document.documentElement.style.removeProperty(k));
  }, [theme]);

  const value = { theme, loading };
  return React.createElement(ThemeContext.Provider, { value }, children);
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  return ctx || { theme: null, loading: true };
}

export function useThemeCSSVars() {
  const { theme } = useTheme();
  if (!theme?.cssVars) return '';
  return Object.entries(theme.cssVars).map(([k, v]) => k + ': ' + v + ';').join('\n');
}

export function setPin(preset) {
  if (preset) localStorage.setItem('td_runner_pin', preset);
  else localStorage.removeItem('td_runner_pin');
}

export function clearPin() { localStorage.removeItem('td_runner_pin'); }

export function getPin() { return localStorage.getItem('td_runner_pin'); }

export function setMode(mode) {
  if (mode === 'light' || mode === 'dark' || mode === 'auto') {
    localStorage.setItem('td_runner_mode', mode);
    if (mode === 'auto') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', mode);
    }
  }
}
