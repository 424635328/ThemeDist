import { c as createComponent } from './astro-component_C4iwsvtt.mjs';
import 'piccolore';
import { u as renderTemplate, t as renderSlot, k as addAttribute, r as renderComponent, e as Fragment, s as renderHead, w as unescapeHTML } from './ssr-function_yscoTaBG.mjs';
import { b as getOmniDailyTheme } from './omni-bridge_C96fFqzW.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Layout = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Layout;
  const theme = getOmniDailyTheme();
  const { cssVars, presetName, customCss, extensions, logoText, logoColors } = theme;
  const style = Object.entries(cssVars).map(([k, v]) => `${k}:${v}`).join(";");
  const currentPath = Astro2.url.pathname;
  const themeStyleTag = `<style>:root{${style}}</style>`;
  const customCssTag = customCss ? `<style>${customCss}</style>` : "";
  const extensionsHTML = extensions ? extensions.map((e) => e.content).join("") : "";
  const brandGradient = logoColors && logoColors.length >= 2 ? `linear-gradient(135deg, ${logoColors[0]}, ${logoColors[1]})` : "linear-gradient(135deg, var(--color-primary), var(--color-secondary))";
  function navClass(path) {
    const active = currentPath === path || path !== "/" && currentPath.startsWith(path);
    return active ? "nav-link nav-link-active" : "nav-link";
  }
  return renderTemplate(_a || (_a = __template(['<html lang="zh-CN"> <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>ThemeDist — 每日主题分发</title><meta name="description" content="每天一个独一无二的主题。聚合 227+ 套预设，融合农历节气与公历节日，每日自动轮换。一个 GET 请求即可为你的站点换上新主题。"><meta name="theme-color"', `><meta name="color-scheme" content="dark"><link rel="dns-prefetch" href="https://fonts.googleapis.com"><link rel="dns-prefetch" href="https://fonts.gstatic.com"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400..700&family=JetBrains+Mono:ital,wght@0,400..600;1,400..600&display=swap" rel="stylesheet"><!-- Critical: inject today's CSS variables -->`, "", `<style>
    /* ============================================
       RESET & BASE
       ============================================ */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    html {
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      scroll-behavior: smooth;
    }

    body {
      font-family: "Inter", "PingFang SC", "Microsoft YaHei", "Noto Sans SC", system-ui, -apple-system, sans-serif;
      font-size: 16px;
      line-height: 1.7;
      background: var(--color-bg);
      color: var(--color-text);
      min-height: 100vh;
      transition: background 0.6s ease, color 0.6s ease;
    }

    ::selection {
      background: color-mix(in srgb, var(--color-primary) 30%, transparent);
      color: var(--color-text);
    }

    :focus-visible {
      outline: 2px solid var(--color-primary);
      outline-offset: 2px;
      border-radius: 4px;
    }

    /* scrollbar */
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb {
      background: color-mix(in srgb, var(--color-text-muted) 30%, transparent);
      border-radius: 99px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: color-mix(in srgb, var(--color-text-muted) 50%, transparent);
    }

    /* ============================================
       AMBIENT BACKGROUND
       ============================================ */
    .amb {
      position: fixed; inset: 0; z-index: 0; pointer-events: none; overflow: hidden;
    }
    .amb-orb {
      position: absolute; border-radius: 50%; filter: blur(160px);
      animation: orbDrift 20s ease-in-out infinite;
      will-change: transform;
    }
    .amb-orb:nth-child(1) {
      width: 800px; height: 800px;
      top: -30%; left: -15%;
      background: var(--ambient-1);
      animation-delay: 0s;
    }
    .amb-orb:nth-child(2) {
      width: 600px; height: 600px;
      bottom: -20%; right: -10%;
      background: var(--ambient-2);
      animation-delay: -7s;
    }
    .amb-orb:nth-child(3) {
      width: 500px; height: 500px;
      top: 40%; left: 45%;
      background: var(--ambient-1);
      opacity: 0.6;
      animation-delay: -14s;
    }

    /* grain overlay */
    .amb-grain {
      position: fixed; inset: 0; z-index: 0; pointer-events: none; opacity: 0.035;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
      background-repeat: repeat;
      background-size: 256px 256px;
    }

    @keyframes orbDrift {
      0%, 100% { transform: translate(0, 0) scale(1); }
      25% { transform: translate(4%, -3%) scale(1.08); }
      50% { transform: translate(-2%, 2%) scale(0.94); }
      75% { transform: translate(-3%, -1%) scale(1.05); }
    }

    /* ============================================
       BACK TO TOP
       ============================================ */
    .btop {
      position: fixed; bottom: 32px; right: 32px; z-index: 200;
      width: 44px; height: 44px;
      border-radius: 14px;
      display: flex; align-items: center; justify-content: center;
      background: color-mix(in srgb, var(--color-surface) 80%, transparent);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid var(--color-border);
      color: var(--color-text-muted);
      cursor: pointer;
      opacity: 0; transform: translateY(12px);
      pointer-events: none;
      transition: all 0.3s ease;
      font-size: 18px;
    }
    .btop.visible {
      opacity: 1; transform: translateY(0);
      pointer-events: auto;
    }
    .btop:hover {
      color: var(--color-primary);
      border-color: var(--color-primary);
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.15);
    }

    /* ============================================
       NAVIGATION
       ============================================ */
    .nav {
      position: sticky; top: 0; z-index: 100;
      padding: 0 32px;
      height: 60px;
      display: flex; align-items: center; gap: 4px;
      background: color-mix(in srgb, var(--color-bg) 82%, transparent);
      backdrop-filter: blur(24px) saturate(1.2);
      -webkit-backdrop-filter: blur(24px) saturate(1.2);
      border-bottom: 1px solid var(--color-border);
      transition: background 0.4s, border-color 0.4s;
    }

    .nav-brand {
      font-size: 18px; font-weight: 700;
      letter-spacing: -0.03em;
      background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
      -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
      text-decoration: none;
      margin-right: 20px;
      flex-shrink: 0;
    }

    .nav-badge {
      font-size: 11px; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase;
      background: color-mix(in srgb, var(--color-primary) 18%, transparent);
      color: var(--color-primary);
      padding: 5px 14px; border-radius: 99px;
      margin-right: auto;
      border: 1px solid color-mix(in srgb, var(--color-primary) 25%, transparent);
      transition: background 0.3s, border-color 0.3s;
    }

    .nav-links { display: flex; align-items: center; gap: 4px; }

    .nav-link {
      font-size: 14px; font-weight: 500; color: var(--color-text-muted);
      text-decoration: none; padding: 8px 16px; border-radius: 10px;
      transition: all 0.2s ease;
      white-space: nowrap;
    }
    .nav-link:hover {
      color: var(--color-primary);
      background: color-mix(in srgb, var(--color-primary) 8%, transparent);
    }
    .nav-link-active {
      color: var(--color-primary);
      background: color-mix(in srgb, var(--color-primary) 10%, transparent);
    }

    /* hamburger */
    .nav-toggle {
      display: none;
      background: none; border: none;
      width: 40px; height: 40px;
      align-items: center; justify-content: center;
      cursor: pointer; color: var(--color-text);
      border-radius: 10px;
      font-size: 22px;
    }
    .nav-toggle:hover { background: color-mix(in srgb, var(--color-primary) 8%, transparent); }

    .nav.open .nav-links {
      display: flex;
      flex-direction: column;
      position: absolute;
      top: 60px; left: 0; right: 0;
      background: color-mix(in srgb, var(--color-bg) 95%, transparent);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border-bottom: 1px solid var(--color-border);
      padding: 12px 16px;
      gap: 2px;
    }
    .nav.open .nav-link {
      padding: 12px 16px;
      width: 100%;
      border-radius: 12px;
    }

    @media (max-width: 768px) {
      .nav-toggle { display: flex; }
      .nav-links { display: none; }
      .nav { padding: 0 16px; }
      .nav-badge { display: none; }
    }

    /* ============================================
       LAYOUT
       ============================================ */
    .content {
      position: relative; z-index: 1;
      min-height: calc(100vh - 60px - 200px);
    }

    .section {
      max-width: 1120px;
      margin: 0 auto;
      padding: 100px 32px;
    }
    .section-sm { padding: 60px 32px; }

    @media (max-width: 768px) {
      .section { padding: 56px 20px; }
      .section-sm { padding: 40px 20px; }
    }

    /* ============================================
       FOOTER
       ============================================ */
    .footer {
      position: relative; z-index: 1;
      border-top: 1px solid var(--color-border);
      padding: 40px 32px;
      text-align: center;
      color: var(--color-text-muted);
      font-size: 13px;
      line-height: 1.8;
    }
    .footer a {
      color: var(--color-primary);
      text-decoration: none;
      transition: opacity 0.2s;
    }
    .footer a:hover { opacity: 0.8; }

    /* ============================================
       TYPOGRAPHY
       ============================================ */
    .t-display {
      font-size: clamp(3rem, 6.5vw, 5rem);
      font-weight: 700; letter-spacing: -0.04em;
      line-height: 1.06;
    }
    .t-heading {
      font-size: clamp(1.8rem, 3.5vw, 2.5rem);
      font-weight: 700; letter-spacing: -0.03em;
      line-height: 1.18;
    }
    .t-subhead {
      font-size: clamp(1.05rem, 1.5vw, 1.25rem);
      color: var(--color-text-muted);
      line-height: 1.6;
    }
    .t-label {
      font-size: 12px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase;
      color: var(--color-text-muted);
    }

    .gradient-text {
      background: linear-gradient(135deg, var(--color-primary), var(--color-secondary), var(--color-accent));
      -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    }

    /* ============================================
       CARDS
       ============================================ */
    .card {
      background: color-mix(in srgb, var(--color-surface) 50%, transparent);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid var(--color-border);
      border-radius: 20px;
      padding: 32px;
      transition: all 0.3s ease;
    }
    .card-interact:hover {
      transform: translateY(-4px);
      box-shadow: 0 20px 50px -12px rgba(0,0,0,0.22);
      border-color: color-mix(in srgb, var(--color-primary) 40%, var(--color-border));
      transition: all 0.25s cubic-bezier(0.22, 0.61, 0.36, 1);
    }
    .card-interact:active {
      transform: translateY(-1px);
      transition: all 0.1s ease;
    }
    .card-glass {
      background: color-mix(in srgb, var(--color-bg) 70%, transparent);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid color-mix(in srgb, var(--color-border) 60%, transparent);
    }

    /* ============================================
       BUTTONS
       ============================================ */
    .btn {
      display: inline-flex; align-items: center; gap: 8px;
      height: 46px; padding: 0 26px;
      border-radius: 13px;
      font-size: 14px; font-weight: 600; letter-spacing: -0.01em;
      text-decoration: none; cursor: pointer;
      transition: all 0.25s ease;
      border: none;
      font-family: inherit;
    }
    .btn:active { transform: scale(0.97); }

    .btn-primary {
      background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
      color: #fff;
      box-shadow: 0 4px 18px color-mix(in srgb, var(--color-primary) 35%, transparent);
    }
    .btn-primary:hover {
      box-shadow: 0 8px 28px color-mix(in srgb, var(--color-primary) 50%, transparent);
      transform: translateY(-1px);
    }

    .btn-outline {
      background: transparent;
      color: var(--color-text);
      border: 1.5px solid var(--color-border);
    }
    .btn-outline:hover { border-color: var(--color-primary); color: var(--color-primary); }

    .btn-ghost {
      background: transparent; color: var(--color-text-muted);
      padding: 0 14px; height: 36px;
    }
    .btn-ghost:hover { color: var(--color-primary); background: color-mix(in srgb, var(--color-primary) 6%, transparent); }

    /* ============================================
       CODE
       ============================================ */
    pre {
      background: color-mix(in srgb, var(--color-text) 5%, var(--color-bg));
      border: 1px solid var(--color-border);
      border-radius: 14px;
      padding: 24px;
      overflow-x: auto;
      font-family: "JetBrains Mono", "Fira Code", "Cascadia Code", monospace;
      font-size: 13px;
      line-height: 1.65;
      position: relative;
    }
    .code-block { position: relative; }
    .code-block .copy-btn {
      position: absolute; top: 12px; right: 12px; z-index: 5;
      height: 32px; padding: 0 14px;
      border-radius: 8px;
      font-size: 12px; font-weight: 500;
      background: color-mix(in srgb, var(--color-surface) 70%, transparent);
      border: 1px solid var(--color-border);
      color: var(--color-text-muted);
      cursor: pointer;
      font-family: inherit;
      transition: all 0.2s;
      opacity: 0;
    }
    .code-block:hover .copy-btn { opacity: 1; }
    .code-block .copy-btn:hover {
      border-color: var(--color-primary);
      color: var(--color-primary);
    }
    .code-block .copy-btn.copied {
      border-color: var(--color-primary);
      color: var(--color-primary);
      background: color-mix(in srgb, var(--color-primary) 15%, transparent);
    }

    code {
      font-family: "JetBrains Mono", "Fira Code", "Cascadia Code", monospace;
      font-size: 0.9em;
    }
    :not(pre) > code {
      background: color-mix(in srgb, var(--color-primary) 10%, transparent);
      padding: 2px 8px; border-radius: 5px;
    }
    pre code { background: none; padding: 0; font-size: inherit; }

    /* ============================================
       GRIDS
       ============================================ */
    .grid-2 { display: grid; gap: 24px; grid-template-columns: 1fr 1fr; }
    .grid-3 { display: grid; gap: 24px; grid-template-columns: repeat(3, 1fr); }
    .grid-4 { display: grid; gap: 24px; grid-template-columns: repeat(4, 1fr); }
    .grid-auto { display: grid; gap: 24px; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); }

    @media (max-width: 768px) {
      .grid-2, .grid-3, .grid-4 { grid-template-columns: 1fr; }
      .grid-auto { grid-template-columns: 1fr; }
    }

    /* ============================================
       ANIMATIONS
       ============================================ */
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(32px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .reveal { animation: fadeIn 0.7s ease both; }
    .reveal-d1 { animation-delay: 0.05s; }
    .reveal-d2 { animation-delay: 0.15s; }
    .reveal-d3 { animation-delay: 0.25s; }
    .reveal-d4 { animation-delay: 0.35s; }
    .reveal-d5 { animation-delay: 0.45s; }

    @keyframes pulse-glow {
      0%, 100% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--color-primary) 40%, transparent); }
      50% { box-shadow: 0 0 0 12px color-mix(in srgb, var(--color-primary) 0%, transparent); }
    }
    .pulse-ring {
      animation: pulse-glow 3s ease-in-out infinite;
    }

    /* ============================================
       UTILITY
       ============================================ */
    .text-center { text-align: center; }
    .text-muted { color: var(--color-text-muted); }
    .mt-2 { margin-top: 8px; }
    .mt-4 { margin-top: 16px; }
    .mt-6 { margin-top: 24px; }
    .mt-8 { margin-top: 32px; }
    .mt-12 { margin-top: 48px; }
    .mt-16 { margin-top: 64px; }
    .mb-4 { margin-bottom: 16px; }
    .mb-8 { margin-bottom: 32px; }
    .gap-4 { gap: 16px; }
    .gap-6 { gap: 24px; }
    .gap-8 { gap: 32px; }

    .sr-only {
      position: absolute; width: 1px; height: 1px;
      padding: 0; margin: -1px; overflow: hidden;
      clip: rect(0,0,0,0); border: 0;
    }

    /* toast */
    .toast {
      position: fixed; bottom: 32px; left: 50%; transform: translateX(-50%);
      z-index: 300;
      padding: 12px 24px;
      border-radius: 12px;
      font-size: 13px; font-weight: 600;
      background: var(--color-surface);
      border: 1px solid var(--color-primary);
      color: var(--color-text);
      box-shadow: 0 12px 40px rgba(0,0,0,0.2);
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s ease, transform 0.3s ease;
      transform: translateX(-50%) translateY(8px);
    }
    .toast.show {
      opacity: 1;
      pointer-events: auto;
      transform: translateX(-50%) translateY(0);
    }
  </style>`, '</head> <body> <div class="amb"> <div class="amb-orb"></div> <div class="amb-orb"></div> <div class="amb-orb"></div> </div> <div class="amb-grain"></div> ', ' <nav class="nav" id="nav"> <a href="/" class="nav-brand"', '>ThemeDist</a> <span class="nav-badge">', '</span> <button class="nav-toggle" id="nav-toggle" aria-label="菜单">☰</button> <div class="nav-links" id="nav-links"> <a href="/theme-store"', '>主题商店</a> <a href="/theme-builder"', '>构建器</a> <a href="/submit"', '>提交主题</a> <a href="/api/docs"', '>API 文档</a> </div> </nav> <div class="content"> ', ` </div> <footer class="footer"> <p>ThemeDist — 每日主题分发 API</p> <p style="margin-top:4px"> <a href="/api/docs">API 文档</a> · <a href="/theme-store">主题商店</a> · <a href="/submit">提交主题</a> </p> <p style="margin-top:8px;opacity:0.5">Powered by Astro &amp; Netlify</p> </footer> <div id="preview-bar" style="display:none;position:fixed;top:60px;left:0;right:0;z-index:99;padding:10px 24px;text-align:center;font-size:13px;font-weight:600;background:color-mix(in srgb, var(--color-primary) 15%, var(--color-bg) 90%);border-bottom:1px solid var(--color-primary);color:var(--color-text);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px)"> <span id="preview-bar-name"></span> <button onclick="localStorage.removeItem('themeDistApplied');location.search=''" style="margin-left:14px;font-size:12px;font-weight:600;padding:4px 14px;border-radius:8px;border:1px solid var(--color-primary);background:transparent;color:var(--color-primary);cursor:pointer;font-family:inherit">回到今日主题</button> </div> <button class="btop" id="btop" aria-label="返回顶部" title="返回顶部">↑</button> <div class="toast" id="toast"></div> <script lang="ts">
    // ── Theme preview via ?theme= or localStorage ──
    (function() {
      var APPLY_STORAGE_KEY = 'themeDistApplied';
      var params = new URLSearchParams(location.search);
      var theme = params.get('theme');
      var isPreviewing = false;

      // If "apply to site" was used, check localStorage first
      if (!theme) {
        var stored = localStorage.getItem(APPLY_STORAGE_KEY);
        if (stored) {
          try {
            var data = JSON.parse(stored);
            theme = data.preset;
          } catch(e) {}
        }
      }

      function loadPreview(t) {
        var bar = document.getElementById('preview-bar');
        var nameEl = document.getElementById('preview-bar-name');

        // Check for DIY theme
        var diyVars = sessionStorage.getItem('td-diy-vars');
        var diyCSS = sessionStorage.getItem('td-diy-css');
        var diyExts = sessionStorage.getItem('td-diy-exts');
        var diyName = sessionStorage.getItem('td-diy-name');
        var isDIY = new URLSearchParams(location.search).get('diy') === '1';

        if (diyVars && isDIY) {
          try {
            var vars = JSON.parse(diyVars);
            var root = document.documentElement;
            Object.entries(vars).forEach(function(e) { root.style.setProperty(e[0], e[1]); });
            if (diyCSS) {
              var style = document.getElementById('preview-custom-css') || document.createElement('style');
              style.id = 'preview-custom-css';
              style.textContent = diyCSS;
              if (!style.parentNode) document.head.appendChild(style);
            }
            if (diyExts) {
              var exts = JSON.parse(diyExts);
              var oldExt = document.getElementById('preview-extensions');
              if (oldExt) oldExt.remove();
              if (exts && exts.length) {
                var container = document.createElement('div');
                container.id = 'preview-extensions';
                container.innerHTML = exts.map(function(e) { return e.content; }).join('');
                document.body.insertBefore(container, document.body.firstChild);
              }
            }
            bar.style.display = 'block';
            nameEl.innerHTML = 'DIY 主题已应用: <strong>' + (diyName || 'DIY') + '</strong>';
            isPreviewing = true;
            var badge2 = document.querySelector('.nav-badge');
            if (badge2) badge2.textContent = diyName || 'DIY';
            return;
          } catch(e) {}
        }

        fetch('/api/theme/' + encodeURIComponent(t) + '.json')
          .then(function(r) { return r.ok ? r.json() : null; })
          .then(function(data) {
            if (!data) return;
            var root = document.documentElement;
            Object.entries(data.cssVars).forEach(function(e) {
              root.style.setProperty(e[0], e[1]);
            });
            bar.style.display = 'block';
            nameEl.innerHTML = '主题已应用: <strong>' + data.presetName + '</strong>';
            isPreviewing = true;

            var badge = document.querySelector('.nav-badge');
            if (badge) badge.textContent = data.presetName;

            var oldStyle = document.getElementById('preview-custom-css');
            if (oldStyle) oldStyle.remove();
            if (data.customCss) {
              var style = document.createElement('style');
              style.id = 'preview-custom-css';
              style.textContent = data.customCss;
              document.head.appendChild(style);
            }

            var oldExt = document.getElementById('preview-extensions');
            if (oldExt) oldExt.remove();
            if (data.extensions && data.extensions.length) {
              var container = document.createElement('div');
              container.id = 'preview-extensions';
              container.innerHTML = data.extensions.map(function(e) { return e.content; }).join('');
              document.body.insertBefore(container, document.body.firstChild);
            }

            // If applied (not just preview via ?theme=), store to localStorage
            var stored = localStorage.getItem(APPLY_STORAGE_KEY);
          })
          .catch(function() {});
      }

      if (theme) {
        loadPreview(theme);
      }

      // Esc to dismiss and restore today's theme
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isPreviewing) {
          e.preventDefault();
          localStorage.removeItem(APPLY_STORAGE_KEY);
          var params2 = new URLSearchParams(location.search);
          params2.delete('theme');
          params2.delete('diy');
          var url = location.pathname + (params2.toString() ? '?' + params2.toString() : '');
          location.href = url;
        }
      });

      // Preview links use regular navigation with ?theme= param
      // The loadPreview() call above handles the initial load
      // No SPA interception needed — clean page navigation is more robust
    })();

    // Back to top
    const btop = document.getElementById('btop');
    let btopTimer;
    window.addEventListener('scroll', () => {
      clearTimeout(btopTimer);
      btopTimer = setTimeout(() => {
        btop.classList.toggle('visible', window.scrollY > 400);
      }, 50);
    }, { passive: true });
    btop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    // Mobile nav toggle
    const navToggle = document.getElementById('nav-toggle');
    const nav = document.getElementById('nav');
    let lastScrollY = window.scrollY;

    function closeNav() {
      nav.classList.remove('open');
      navToggle.textContent = '☰';
    }

    navToggle.addEventListener('click', () => {
      nav.classList.toggle('open');
      navToggle.textContent = nav.classList.contains('open') ? '✕' : '☰';
    });

    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target)) closeNav();
    });

    // Close nav on scroll
    window.addEventListener('scroll', () => {
      if (nav.classList.contains('open') && Math.abs(window.scrollY - lastScrollY) > 30) {
        closeNav();
      }
      lastScrollY = window.scrollY;
    }, { passive: true });

    // Toast
    let toastTimer;
    function toast(msg) {
      const el = document.getElementById('toast');
      el.textContent = msg;
      el.classList.add('show');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => el.classList.remove('show'), 2000);
    }
    window.__toast = toast;

    // Copy button for all pre blocks
    document.querySelectorAll('pre').forEach(pre => {
      // Wrap in .code-block wrapper if needed
      let wrapper = pre.parentElement;
      if (!wrapper || !wrapper.classList.contains('code-block')) {
        wrapper = document.createElement('div');
        wrapper.className = 'code-block';
        pre.parentNode.insertBefore(wrapper, pre);
        wrapper.appendChild(pre);
      }

      const btn = document.createElement('button');
      btn.className = 'copy-btn';
      btn.textContent = '复制';
      btn.addEventListener('click', async () => {
        const code = pre.textContent || '';
        try {
          await navigator.clipboard.writeText(code);
          btn.textContent = '已复制';
          btn.classList.add('copied');
          setTimeout(() => { btn.textContent = '复制'; btn.classList.remove('copied'); }, 1800);
        } catch {
          toast('复制失败，请手动选择');
        }
      });
      wrapper.appendChild(btn);
    });

    // Auto-generate heading IDs and make them clickable anchor links
    document.querySelectorAll('.content h2, .content h3').forEach(h => {
      if (!h.id) {
        h.id = (h.textContent || '')
          .trim()
          .toLowerCase()
          .replace(/[^\\w一-鿿]+/g, '-')
          .replace(/^-|-$/g, '');
      }
      h.style.cursor = 'pointer';
      h.setAttribute('title', '点击复制链接');
      h.addEventListener('click', () => {
        const url = new URL(location.href);
        url.hash = h.id;
        navigator.clipboard.writeText(url.toString()).then(() => {
          toast('链接已复制');
        }).catch(() => {});
      });
    });

    // Close mobile nav on link click
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => nav.classList.remove('open'));
    });
  <\/script> </body> </html>`], ['<html lang="zh-CN"> <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>ThemeDist — 每日主题分发</title><meta name="description" content="每天一个独一无二的主题。聚合 227+ 套预设，融合农历节气与公历节日，每日自动轮换。一个 GET 请求即可为你的站点换上新主题。"><meta name="theme-color"', `><meta name="color-scheme" content="dark"><link rel="dns-prefetch" href="https://fonts.googleapis.com"><link rel="dns-prefetch" href="https://fonts.gstatic.com"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400..700&family=JetBrains+Mono:ital,wght@0,400..600;1,400..600&display=swap" rel="stylesheet"><!-- Critical: inject today's CSS variables -->`, "", `<style>
    /* ============================================
       RESET & BASE
       ============================================ */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    html {
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      scroll-behavior: smooth;
    }

    body {
      font-family: "Inter", "PingFang SC", "Microsoft YaHei", "Noto Sans SC", system-ui, -apple-system, sans-serif;
      font-size: 16px;
      line-height: 1.7;
      background: var(--color-bg);
      color: var(--color-text);
      min-height: 100vh;
      transition: background 0.6s ease, color 0.6s ease;
    }

    ::selection {
      background: color-mix(in srgb, var(--color-primary) 30%, transparent);
      color: var(--color-text);
    }

    :focus-visible {
      outline: 2px solid var(--color-primary);
      outline-offset: 2px;
      border-radius: 4px;
    }

    /* scrollbar */
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb {
      background: color-mix(in srgb, var(--color-text-muted) 30%, transparent);
      border-radius: 99px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: color-mix(in srgb, var(--color-text-muted) 50%, transparent);
    }

    /* ============================================
       AMBIENT BACKGROUND
       ============================================ */
    .amb {
      position: fixed; inset: 0; z-index: 0; pointer-events: none; overflow: hidden;
    }
    .amb-orb {
      position: absolute; border-radius: 50%; filter: blur(160px);
      animation: orbDrift 20s ease-in-out infinite;
      will-change: transform;
    }
    .amb-orb:nth-child(1) {
      width: 800px; height: 800px;
      top: -30%; left: -15%;
      background: var(--ambient-1);
      animation-delay: 0s;
    }
    .amb-orb:nth-child(2) {
      width: 600px; height: 600px;
      bottom: -20%; right: -10%;
      background: var(--ambient-2);
      animation-delay: -7s;
    }
    .amb-orb:nth-child(3) {
      width: 500px; height: 500px;
      top: 40%; left: 45%;
      background: var(--ambient-1);
      opacity: 0.6;
      animation-delay: -14s;
    }

    /* grain overlay */
    .amb-grain {
      position: fixed; inset: 0; z-index: 0; pointer-events: none; opacity: 0.035;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
      background-repeat: repeat;
      background-size: 256px 256px;
    }

    @keyframes orbDrift {
      0%, 100% { transform: translate(0, 0) scale(1); }
      25% { transform: translate(4%, -3%) scale(1.08); }
      50% { transform: translate(-2%, 2%) scale(0.94); }
      75% { transform: translate(-3%, -1%) scale(1.05); }
    }

    /* ============================================
       BACK TO TOP
       ============================================ */
    .btop {
      position: fixed; bottom: 32px; right: 32px; z-index: 200;
      width: 44px; height: 44px;
      border-radius: 14px;
      display: flex; align-items: center; justify-content: center;
      background: color-mix(in srgb, var(--color-surface) 80%, transparent);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid var(--color-border);
      color: var(--color-text-muted);
      cursor: pointer;
      opacity: 0; transform: translateY(12px);
      pointer-events: none;
      transition: all 0.3s ease;
      font-size: 18px;
    }
    .btop.visible {
      opacity: 1; transform: translateY(0);
      pointer-events: auto;
    }
    .btop:hover {
      color: var(--color-primary);
      border-color: var(--color-primary);
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.15);
    }

    /* ============================================
       NAVIGATION
       ============================================ */
    .nav {
      position: sticky; top: 0; z-index: 100;
      padding: 0 32px;
      height: 60px;
      display: flex; align-items: center; gap: 4px;
      background: color-mix(in srgb, var(--color-bg) 82%, transparent);
      backdrop-filter: blur(24px) saturate(1.2);
      -webkit-backdrop-filter: blur(24px) saturate(1.2);
      border-bottom: 1px solid var(--color-border);
      transition: background 0.4s, border-color 0.4s;
    }

    .nav-brand {
      font-size: 18px; font-weight: 700;
      letter-spacing: -0.03em;
      background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
      -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
      text-decoration: none;
      margin-right: 20px;
      flex-shrink: 0;
    }

    .nav-badge {
      font-size: 11px; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase;
      background: color-mix(in srgb, var(--color-primary) 18%, transparent);
      color: var(--color-primary);
      padding: 5px 14px; border-radius: 99px;
      margin-right: auto;
      border: 1px solid color-mix(in srgb, var(--color-primary) 25%, transparent);
      transition: background 0.3s, border-color 0.3s;
    }

    .nav-links { display: flex; align-items: center; gap: 4px; }

    .nav-link {
      font-size: 14px; font-weight: 500; color: var(--color-text-muted);
      text-decoration: none; padding: 8px 16px; border-radius: 10px;
      transition: all 0.2s ease;
      white-space: nowrap;
    }
    .nav-link:hover {
      color: var(--color-primary);
      background: color-mix(in srgb, var(--color-primary) 8%, transparent);
    }
    .nav-link-active {
      color: var(--color-primary);
      background: color-mix(in srgb, var(--color-primary) 10%, transparent);
    }

    /* hamburger */
    .nav-toggle {
      display: none;
      background: none; border: none;
      width: 40px; height: 40px;
      align-items: center; justify-content: center;
      cursor: pointer; color: var(--color-text);
      border-radius: 10px;
      font-size: 22px;
    }
    .nav-toggle:hover { background: color-mix(in srgb, var(--color-primary) 8%, transparent); }

    .nav.open .nav-links {
      display: flex;
      flex-direction: column;
      position: absolute;
      top: 60px; left: 0; right: 0;
      background: color-mix(in srgb, var(--color-bg) 95%, transparent);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border-bottom: 1px solid var(--color-border);
      padding: 12px 16px;
      gap: 2px;
    }
    .nav.open .nav-link {
      padding: 12px 16px;
      width: 100%;
      border-radius: 12px;
    }

    @media (max-width: 768px) {
      .nav-toggle { display: flex; }
      .nav-links { display: none; }
      .nav { padding: 0 16px; }
      .nav-badge { display: none; }
    }

    /* ============================================
       LAYOUT
       ============================================ */
    .content {
      position: relative; z-index: 1;
      min-height: calc(100vh - 60px - 200px);
    }

    .section {
      max-width: 1120px;
      margin: 0 auto;
      padding: 100px 32px;
    }
    .section-sm { padding: 60px 32px; }

    @media (max-width: 768px) {
      .section { padding: 56px 20px; }
      .section-sm { padding: 40px 20px; }
    }

    /* ============================================
       FOOTER
       ============================================ */
    .footer {
      position: relative; z-index: 1;
      border-top: 1px solid var(--color-border);
      padding: 40px 32px;
      text-align: center;
      color: var(--color-text-muted);
      font-size: 13px;
      line-height: 1.8;
    }
    .footer a {
      color: var(--color-primary);
      text-decoration: none;
      transition: opacity 0.2s;
    }
    .footer a:hover { opacity: 0.8; }

    /* ============================================
       TYPOGRAPHY
       ============================================ */
    .t-display {
      font-size: clamp(3rem, 6.5vw, 5rem);
      font-weight: 700; letter-spacing: -0.04em;
      line-height: 1.06;
    }
    .t-heading {
      font-size: clamp(1.8rem, 3.5vw, 2.5rem);
      font-weight: 700; letter-spacing: -0.03em;
      line-height: 1.18;
    }
    .t-subhead {
      font-size: clamp(1.05rem, 1.5vw, 1.25rem);
      color: var(--color-text-muted);
      line-height: 1.6;
    }
    .t-label {
      font-size: 12px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase;
      color: var(--color-text-muted);
    }

    .gradient-text {
      background: linear-gradient(135deg, var(--color-primary), var(--color-secondary), var(--color-accent));
      -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    }

    /* ============================================
       CARDS
       ============================================ */
    .card {
      background: color-mix(in srgb, var(--color-surface) 50%, transparent);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid var(--color-border);
      border-radius: 20px;
      padding: 32px;
      transition: all 0.3s ease;
    }
    .card-interact:hover {
      transform: translateY(-4px);
      box-shadow: 0 20px 50px -12px rgba(0,0,0,0.22);
      border-color: color-mix(in srgb, var(--color-primary) 40%, var(--color-border));
      transition: all 0.25s cubic-bezier(0.22, 0.61, 0.36, 1);
    }
    .card-interact:active {
      transform: translateY(-1px);
      transition: all 0.1s ease;
    }
    .card-glass {
      background: color-mix(in srgb, var(--color-bg) 70%, transparent);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid color-mix(in srgb, var(--color-border) 60%, transparent);
    }

    /* ============================================
       BUTTONS
       ============================================ */
    .btn {
      display: inline-flex; align-items: center; gap: 8px;
      height: 46px; padding: 0 26px;
      border-radius: 13px;
      font-size: 14px; font-weight: 600; letter-spacing: -0.01em;
      text-decoration: none; cursor: pointer;
      transition: all 0.25s ease;
      border: none;
      font-family: inherit;
    }
    .btn:active { transform: scale(0.97); }

    .btn-primary {
      background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
      color: #fff;
      box-shadow: 0 4px 18px color-mix(in srgb, var(--color-primary) 35%, transparent);
    }
    .btn-primary:hover {
      box-shadow: 0 8px 28px color-mix(in srgb, var(--color-primary) 50%, transparent);
      transform: translateY(-1px);
    }

    .btn-outline {
      background: transparent;
      color: var(--color-text);
      border: 1.5px solid var(--color-border);
    }
    .btn-outline:hover { border-color: var(--color-primary); color: var(--color-primary); }

    .btn-ghost {
      background: transparent; color: var(--color-text-muted);
      padding: 0 14px; height: 36px;
    }
    .btn-ghost:hover { color: var(--color-primary); background: color-mix(in srgb, var(--color-primary) 6%, transparent); }

    /* ============================================
       CODE
       ============================================ */
    pre {
      background: color-mix(in srgb, var(--color-text) 5%, var(--color-bg));
      border: 1px solid var(--color-border);
      border-radius: 14px;
      padding: 24px;
      overflow-x: auto;
      font-family: "JetBrains Mono", "Fira Code", "Cascadia Code", monospace;
      font-size: 13px;
      line-height: 1.65;
      position: relative;
    }
    .code-block { position: relative; }
    .code-block .copy-btn {
      position: absolute; top: 12px; right: 12px; z-index: 5;
      height: 32px; padding: 0 14px;
      border-radius: 8px;
      font-size: 12px; font-weight: 500;
      background: color-mix(in srgb, var(--color-surface) 70%, transparent);
      border: 1px solid var(--color-border);
      color: var(--color-text-muted);
      cursor: pointer;
      font-family: inherit;
      transition: all 0.2s;
      opacity: 0;
    }
    .code-block:hover .copy-btn { opacity: 1; }
    .code-block .copy-btn:hover {
      border-color: var(--color-primary);
      color: var(--color-primary);
    }
    .code-block .copy-btn.copied {
      border-color: var(--color-primary);
      color: var(--color-primary);
      background: color-mix(in srgb, var(--color-primary) 15%, transparent);
    }

    code {
      font-family: "JetBrains Mono", "Fira Code", "Cascadia Code", monospace;
      font-size: 0.9em;
    }
    :not(pre) > code {
      background: color-mix(in srgb, var(--color-primary) 10%, transparent);
      padding: 2px 8px; border-radius: 5px;
    }
    pre code { background: none; padding: 0; font-size: inherit; }

    /* ============================================
       GRIDS
       ============================================ */
    .grid-2 { display: grid; gap: 24px; grid-template-columns: 1fr 1fr; }
    .grid-3 { display: grid; gap: 24px; grid-template-columns: repeat(3, 1fr); }
    .grid-4 { display: grid; gap: 24px; grid-template-columns: repeat(4, 1fr); }
    .grid-auto { display: grid; gap: 24px; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); }

    @media (max-width: 768px) {
      .grid-2, .grid-3, .grid-4 { grid-template-columns: 1fr; }
      .grid-auto { grid-template-columns: 1fr; }
    }

    /* ============================================
       ANIMATIONS
       ============================================ */
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(32px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .reveal { animation: fadeIn 0.7s ease both; }
    .reveal-d1 { animation-delay: 0.05s; }
    .reveal-d2 { animation-delay: 0.15s; }
    .reveal-d3 { animation-delay: 0.25s; }
    .reveal-d4 { animation-delay: 0.35s; }
    .reveal-d5 { animation-delay: 0.45s; }

    @keyframes pulse-glow {
      0%, 100% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--color-primary) 40%, transparent); }
      50% { box-shadow: 0 0 0 12px color-mix(in srgb, var(--color-primary) 0%, transparent); }
    }
    .pulse-ring {
      animation: pulse-glow 3s ease-in-out infinite;
    }

    /* ============================================
       UTILITY
       ============================================ */
    .text-center { text-align: center; }
    .text-muted { color: var(--color-text-muted); }
    .mt-2 { margin-top: 8px; }
    .mt-4 { margin-top: 16px; }
    .mt-6 { margin-top: 24px; }
    .mt-8 { margin-top: 32px; }
    .mt-12 { margin-top: 48px; }
    .mt-16 { margin-top: 64px; }
    .mb-4 { margin-bottom: 16px; }
    .mb-8 { margin-bottom: 32px; }
    .gap-4 { gap: 16px; }
    .gap-6 { gap: 24px; }
    .gap-8 { gap: 32px; }

    .sr-only {
      position: absolute; width: 1px; height: 1px;
      padding: 0; margin: -1px; overflow: hidden;
      clip: rect(0,0,0,0); border: 0;
    }

    /* toast */
    .toast {
      position: fixed; bottom: 32px; left: 50%; transform: translateX(-50%);
      z-index: 300;
      padding: 12px 24px;
      border-radius: 12px;
      font-size: 13px; font-weight: 600;
      background: var(--color-surface);
      border: 1px solid var(--color-primary);
      color: var(--color-text);
      box-shadow: 0 12px 40px rgba(0,0,0,0.2);
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s ease, transform 0.3s ease;
      transform: translateX(-50%) translateY(8px);
    }
    .toast.show {
      opacity: 1;
      pointer-events: auto;
      transform: translateX(-50%) translateY(0);
    }
  </style>`, '</head> <body> <div class="amb"> <div class="amb-orb"></div> <div class="amb-orb"></div> <div class="amb-orb"></div> </div> <div class="amb-grain"></div> ', ' <nav class="nav" id="nav"> <a href="/" class="nav-brand"', '>ThemeDist</a> <span class="nav-badge">', '</span> <button class="nav-toggle" id="nav-toggle" aria-label="菜单">☰</button> <div class="nav-links" id="nav-links"> <a href="/theme-store"', '>主题商店</a> <a href="/theme-builder"', '>构建器</a> <a href="/submit"', '>提交主题</a> <a href="/api/docs"', '>API 文档</a> </div> </nav> <div class="content"> ', ` </div> <footer class="footer"> <p>ThemeDist — 每日主题分发 API</p> <p style="margin-top:4px"> <a href="/api/docs">API 文档</a> · <a href="/theme-store">主题商店</a> · <a href="/submit">提交主题</a> </p> <p style="margin-top:8px;opacity:0.5">Powered by Astro &amp; Netlify</p> </footer> <div id="preview-bar" style="display:none;position:fixed;top:60px;left:0;right:0;z-index:99;padding:10px 24px;text-align:center;font-size:13px;font-weight:600;background:color-mix(in srgb, var(--color-primary) 15%, var(--color-bg) 90%);border-bottom:1px solid var(--color-primary);color:var(--color-text);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px)"> <span id="preview-bar-name"></span> <button onclick="localStorage.removeItem('themeDistApplied');location.search=''" style="margin-left:14px;font-size:12px;font-weight:600;padding:4px 14px;border-radius:8px;border:1px solid var(--color-primary);background:transparent;color:var(--color-primary);cursor:pointer;font-family:inherit">回到今日主题</button> </div> <button class="btop" id="btop" aria-label="返回顶部" title="返回顶部">↑</button> <div class="toast" id="toast"></div> <script lang="ts">
    // ── Theme preview via ?theme= or localStorage ──
    (function() {
      var APPLY_STORAGE_KEY = 'themeDistApplied';
      var params = new URLSearchParams(location.search);
      var theme = params.get('theme');
      var isPreviewing = false;

      // If "apply to site" was used, check localStorage first
      if (!theme) {
        var stored = localStorage.getItem(APPLY_STORAGE_KEY);
        if (stored) {
          try {
            var data = JSON.parse(stored);
            theme = data.preset;
          } catch(e) {}
        }
      }

      function loadPreview(t) {
        var bar = document.getElementById('preview-bar');
        var nameEl = document.getElementById('preview-bar-name');

        // Check for DIY theme
        var diyVars = sessionStorage.getItem('td-diy-vars');
        var diyCSS = sessionStorage.getItem('td-diy-css');
        var diyExts = sessionStorage.getItem('td-diy-exts');
        var diyName = sessionStorage.getItem('td-diy-name');
        var isDIY = new URLSearchParams(location.search).get('diy') === '1';

        if (diyVars && isDIY) {
          try {
            var vars = JSON.parse(diyVars);
            var root = document.documentElement;
            Object.entries(vars).forEach(function(e) { root.style.setProperty(e[0], e[1]); });
            if (diyCSS) {
              var style = document.getElementById('preview-custom-css') || document.createElement('style');
              style.id = 'preview-custom-css';
              style.textContent = diyCSS;
              if (!style.parentNode) document.head.appendChild(style);
            }
            if (diyExts) {
              var exts = JSON.parse(diyExts);
              var oldExt = document.getElementById('preview-extensions');
              if (oldExt) oldExt.remove();
              if (exts && exts.length) {
                var container = document.createElement('div');
                container.id = 'preview-extensions';
                container.innerHTML = exts.map(function(e) { return e.content; }).join('');
                document.body.insertBefore(container, document.body.firstChild);
              }
            }
            bar.style.display = 'block';
            nameEl.innerHTML = 'DIY 主题已应用: <strong>' + (diyName || 'DIY') + '</strong>';
            isPreviewing = true;
            var badge2 = document.querySelector('.nav-badge');
            if (badge2) badge2.textContent = diyName || 'DIY';
            return;
          } catch(e) {}
        }

        fetch('/api/theme/' + encodeURIComponent(t) + '.json')
          .then(function(r) { return r.ok ? r.json() : null; })
          .then(function(data) {
            if (!data) return;
            var root = document.documentElement;
            Object.entries(data.cssVars).forEach(function(e) {
              root.style.setProperty(e[0], e[1]);
            });
            bar.style.display = 'block';
            nameEl.innerHTML = '主题已应用: <strong>' + data.presetName + '</strong>';
            isPreviewing = true;

            var badge = document.querySelector('.nav-badge');
            if (badge) badge.textContent = data.presetName;

            var oldStyle = document.getElementById('preview-custom-css');
            if (oldStyle) oldStyle.remove();
            if (data.customCss) {
              var style = document.createElement('style');
              style.id = 'preview-custom-css';
              style.textContent = data.customCss;
              document.head.appendChild(style);
            }

            var oldExt = document.getElementById('preview-extensions');
            if (oldExt) oldExt.remove();
            if (data.extensions && data.extensions.length) {
              var container = document.createElement('div');
              container.id = 'preview-extensions';
              container.innerHTML = data.extensions.map(function(e) { return e.content; }).join('');
              document.body.insertBefore(container, document.body.firstChild);
            }

            // If applied (not just preview via ?theme=), store to localStorage
            var stored = localStorage.getItem(APPLY_STORAGE_KEY);
          })
          .catch(function() {});
      }

      if (theme) {
        loadPreview(theme);
      }

      // Esc to dismiss and restore today's theme
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isPreviewing) {
          e.preventDefault();
          localStorage.removeItem(APPLY_STORAGE_KEY);
          var params2 = new URLSearchParams(location.search);
          params2.delete('theme');
          params2.delete('diy');
          var url = location.pathname + (params2.toString() ? '?' + params2.toString() : '');
          location.href = url;
        }
      });

      // Preview links use regular navigation with ?theme= param
      // The loadPreview() call above handles the initial load
      // No SPA interception needed — clean page navigation is more robust
    })();

    // Back to top
    const btop = document.getElementById('btop');
    let btopTimer;
    window.addEventListener('scroll', () => {
      clearTimeout(btopTimer);
      btopTimer = setTimeout(() => {
        btop.classList.toggle('visible', window.scrollY > 400);
      }, 50);
    }, { passive: true });
    btop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    // Mobile nav toggle
    const navToggle = document.getElementById('nav-toggle');
    const nav = document.getElementById('nav');
    let lastScrollY = window.scrollY;

    function closeNav() {
      nav.classList.remove('open');
      navToggle.textContent = '☰';
    }

    navToggle.addEventListener('click', () => {
      nav.classList.toggle('open');
      navToggle.textContent = nav.classList.contains('open') ? '✕' : '☰';
    });

    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target)) closeNav();
    });

    // Close nav on scroll
    window.addEventListener('scroll', () => {
      if (nav.classList.contains('open') && Math.abs(window.scrollY - lastScrollY) > 30) {
        closeNav();
      }
      lastScrollY = window.scrollY;
    }, { passive: true });

    // Toast
    let toastTimer;
    function toast(msg) {
      const el = document.getElementById('toast');
      el.textContent = msg;
      el.classList.add('show');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => el.classList.remove('show'), 2000);
    }
    window.__toast = toast;

    // Copy button for all pre blocks
    document.querySelectorAll('pre').forEach(pre => {
      // Wrap in .code-block wrapper if needed
      let wrapper = pre.parentElement;
      if (!wrapper || !wrapper.classList.contains('code-block')) {
        wrapper = document.createElement('div');
        wrapper.className = 'code-block';
        pre.parentNode.insertBefore(wrapper, pre);
        wrapper.appendChild(pre);
      }

      const btn = document.createElement('button');
      btn.className = 'copy-btn';
      btn.textContent = '复制';
      btn.addEventListener('click', async () => {
        const code = pre.textContent || '';
        try {
          await navigator.clipboard.writeText(code);
          btn.textContent = '已复制';
          btn.classList.add('copied');
          setTimeout(() => { btn.textContent = '复制'; btn.classList.remove('copied'); }, 1800);
        } catch {
          toast('复制失败，请手动选择');
        }
      });
      wrapper.appendChild(btn);
    });

    // Auto-generate heading IDs and make them clickable anchor links
    document.querySelectorAll('.content h2, .content h3').forEach(h => {
      if (!h.id) {
        h.id = (h.textContent || '')
          .trim()
          .toLowerCase()
          .replace(/[^\\\\w一-鿿]+/g, '-')
          .replace(/^-|-$/g, '');
      }
      h.style.cursor = 'pointer';
      h.setAttribute('title', '点击复制链接');
      h.addEventListener('click', () => {
        const url = new URL(location.href);
        url.hash = h.id;
        navigator.clipboard.writeText(url.toString()).then(() => {
          toast('链接已复制');
        }).catch(() => {});
      });
    });

    // Close mobile nav on link click
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => nav.classList.remove('open'));
    });
  <\/script> </body> </html>`])), addAttribute(cssVars["--color-bg"], "content"), renderComponent($$result, "Fragment", Fragment, {}, { "default": async ($$result2) => renderTemplate`${unescapeHTML(themeStyleTag)}` }), customCss && renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": async ($$result2) => renderTemplate`${unescapeHTML(customCssTag)}` })}`, renderHead(), extensions && renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": async ($$result2) => renderTemplate`${unescapeHTML(extensionsHTML)}` })}`, addAttribute(`background:${brandGradient};-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text`, "style"), logoText || presetName, addAttribute(navClass("/theme-store"), "class"), addAttribute(navClass("/theme-builder"), "class"), addAttribute(navClass("/submit"), "class"), addAttribute(navClass("/api/docs"), "class"), renderSlot($$result, $$slots["default"]));
}, "E:/GitHub/themeDist/src/layouts/Layout.astro", void 0);

export { $$Layout as $ };
