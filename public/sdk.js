/**
 * ThemeDist Runner — Web Component SDK
 * v1.0
 *
 * Usage:
 *   <themedist-runner api="https://themedist.netlify.app/api/v1/today.json" save-shadow="true"></themedist-runner>
 *   <script src="https://themedist.netlify.app/sdk.js" defer></script>
 *
 * CSS variables are injected into global :root so your entire site adapts.
 * Decorations (floating chars, decorative HTML) are isolated in Shadow DOM
 * to prevent style/DOM pollution of the host page.
 */
(function () {
  const CACHE_KEY = 'td_runner_cache';

  function safeDim(v) {
    return /^-?[\d.]+(?:%|px|em|rem|vh|vw|vmin|vmax|s|ms)?$/i.test(v) ? v : '';
  }

  function safeVal(v) {
    return (v || '').toString().slice(0, 128).replace(/[;{}]/g, '').trim();
  }

  class ThemeDistRunner extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }

    static get observedAttributes() {
      return ['api', 'save-shadow'];
    }

    get api() {
      return this.getAttribute('api') || '/api/v1/today.json';
    }

    get saveShadow() {
      return this.getAttribute('save-shadow') !== 'false';
    }

    async connectedCallback() {
      const todayStr = new Date().toISOString().slice(0, 10);

      // 1. Try cached data first
      const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
      if (cached && cached.date === todayStr) {
        this.applyTheme(cached.data);
        return;
      }

      // 2. Fetch from API
      try {
        const res = await fetch(this.api);
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const theme = await res.json();

        const cacheData = { date: todayStr, data: theme };
        localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
        this.applyTheme(theme);
      } catch (err) {
        console.warn('ThemeDist: fetch failed, using stale cache', err.message);
        if (cached) this.applyTheme(cached.data);
      }
    }

    applyTheme(theme) {
      // 2.1 Inject CSS variables into global :root
      if (theme.cssVars) {
        Object.entries(theme.cssVars).forEach(function (entry) {
          document.documentElement.style.setProperty(entry[0], entry[1]);
        });
      }

      // 2.2 Inject global custom CSS (animations, keyframes)
      if (theme.customCss) {
        var styleEl = document.getElementById('td-runner-global-css');
        if (!styleEl) {
          styleEl = document.createElement('style');
          styleEl.id = 'td-runner-global-css';
          document.head.appendChild(styleEl);
        }
        styleEl.textContent = theme.customCss;
      }

      // 2.3 Render extensions in isolated Shadow DOM
      if (theme.extensions && theme.extensions.length) {
        this.renderShadowExtensions(theme.extensions);
      }
    }

    renderShadowExtensions(exts) {
      // Clear previous decorations
      this.shadowRoot.innerHTML = '';

      // Base reset styles inside Shadow DOM
      var resetStyle = document.createElement('style');
      resetStyle.textContent =
        ':host{position:fixed;top:0;left:0;width:0;height:0;pointer-events:none;z-index:2147483647}' +
        '.floating-char{position:fixed;pointer-events:none}';
      this.shadowRoot.appendChild(resetStyle);

      var self = this;
      exts.slice(0, 20).forEach(function (ext) {
        if (ext.type === 'floating' && ext.char) {
          var el = document.createElement('div');
          el.className = 'floating-char';
          el.style.cssText = [
            ext.top && 'top:' + safeDim(ext.top),
            ext.left && 'left:' + safeDim(ext.left),
            ext.right && 'right:' + safeDim(ext.right),
            ext.bottom && 'bottom:' + safeDim(ext.bottom),
            ext.fontSize && 'font-size:' + safeDim(ext.fontSize),
            ext.animation && 'animation:' + safeVal(ext.animation),
            typeof ext.opacity === 'number' && 'opacity:' + ext.opacity,
            typeof ext.zIndex === 'number' && 'z-index:' + ext.zIndex,
          ].filter(Boolean).join(';');
          el.textContent = String(ext.char).slice(0, 4);
          self.shadowRoot.appendChild(el);
        } else if (ext.type === 'decorative' && ext.html) {
          var tpl = document.createElement('template');
          tpl.innerHTML = ext.html;
          var frag = tpl.content.cloneNode(true);
          frag.querySelectorAll('*').forEach(function (node) {
            Array.from(node.attributes).forEach(function (attr) {
              if (/^on/i.test(attr.name)) node.removeAttribute(attr.name);
            });
          });
          self.shadowRoot.appendChild(frag);
        }
      });
    }
  }

  customElements.define('themedist-runner', ThemeDistRunner);
})();
