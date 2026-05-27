/**
 * ThemeDist Runner — Web Component SDK
 * v2.0
 *
 * Usage:
 *   <themedist-runner api="https://themedist.netlify.app/api/v1/today.json"></themedist-runner>
 *   <script src="https://themedist.netlify.app/sdk.js" defer></script>
 *
 * CSS variables are injected into global :root so your entire site adapts.
 * Decorations (floating chars, decorative HTML) are isolated in Shadow DOM
 * to prevent style/DOM pollution of the host page.
 *
 * v2.0: Full layer isolation with CSS contract variables, pointer-events safety,
 *       isolation:isolate stacking context, customCss sandboxed in Shadow DOM.
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
      var todayStr = new Date().toISOString().slice(0, 10);

      // 1. Try cached data first
      try {
        var cached = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
      } catch (e) { cached = null; }
      if (cached && cached.date === todayStr) {
        this.applyTheme(cached.data);
        return;
      }

      // 2. Fetch from API
      try {
        var res = await fetch(this.api);
        if (!res.ok) throw new Error('HTTP ' + res.status);
        var theme = await res.json();

        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify({ date: todayStr, data: theme }));
        } catch (e) { /* quota exceeded — ignore */ }
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

      // 2.2 Build Shadow DOM content (isolates customCss + extensions)
      var shadowParts = [];

      // Host isolation: uses contract z-index, prevents pointer-events escape
      shadowParts.push(
        ':host{' +
          'position:fixed;top:0;left:0;width:100vw;height:100vh;' +
          'pointer-events:none!important;' +
          'z-index:var(--td-z-base,-10);' +
          'isolation:isolate;' +
          'overflow:hidden;' +
        '}' +
        '.floating-char{position:fixed;pointer-events:none;z-index:var(--td-z-float,10)}' +
        '.deco-layer{position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none}'
      );

      // 2.3 Inject customCss INSIDE Shadow DOM (sandboxed, won't leak to host)
      if (theme.customCss) {
        shadowParts.push(theme.customCss);
      }

      var styleEl = document.createElement('style');
      styleEl.textContent = shadowParts.join('\n');
      this.shadowRoot.innerHTML = '';
      this.shadowRoot.appendChild(styleEl);

      // 2.4 Render extensions in isolated Shadow DOM
      if (theme.extensions && theme.extensions.length) {
        this.renderShadowExtensions(theme.extensions);
      }

      // 2.5 Inject keyframes into document head (animations need to run globally)
      if (theme.customCss) {
        var globalStyle = document.getElementById('td-runner-keyframes');
        if (!globalStyle) {
          globalStyle = document.createElement('style');
          globalStyle.id = 'td-runner-keyframes';
          document.head.appendChild(globalStyle);
        }
        // Extract only @keyframes blocks for global injection
        var keyframes = '';
        var kfRe = /@keyframes\s+[\s\S]*?\{[\s\S]*?\}\s*\}/g;
        var match;
        while ((match = kfRe.exec(theme.customCss)) !== null) {
          keyframes += match[0] + '\n';
        }
        globalStyle.textContent = keyframes;
      }
    }

    renderShadowExtensions(exts) {
      var decoLayer = document.createElement('div');
      decoLayer.className = 'deco-layer';

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
          ].filter(Boolean).join(';');
          el.textContent = String(ext.char).slice(0, 4);
          decoLayer.appendChild(el);
        } else if (ext.type === 'decorative' && ext.html) {
          var tpl = document.createElement('template');
          tpl.innerHTML = ext.html;
          var frag = tpl.content.cloneNode(true);
          frag.querySelectorAll('*').forEach(function (node) {
            Array.from(node.attributes).forEach(function (attr) {
              if (/^on/i.test(attr.name)) node.removeAttribute(attr.name);
            });
          });
          decoLayer.appendChild(frag);
        }
      });

      self.shadowRoot.appendChild(decoLayer);
    }
  }

  customElements.define('themedist-runner', ThemeDistRunner);
})();
