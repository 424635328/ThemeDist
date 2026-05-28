/**
 * ThemeDist Runner — Web Component SDK
 * v3.0
 *
 * Usage:
 *   <themedist-runner api="https://themedist.netlify.app/api/v1/today.json"></themedist-runner>
 *   <script src="https://themedist.netlify.app/sdk.js" defer></script>
 *
 * v3.0: User pin (setPin), smart polling (live), dual-theme mode (setMode),
 *       sound micro-interactions, reduced-motion aware.
 */
(function () {
  var CACHE_KEY = 'td_runner_cache';
  var PIN_KEY = 'td_runner_pin';
  var MODE_KEY = 'td_runner_mode';

  function safeDim(v) {
    return /^-?[\d.]+(?:%|px|em|rem|vh|vw|vmin|vmax|s|ms)?$/i.test(v) ? v : '';
  }

  function safeVal(v) {
    return (v || '').toString().slice(0, 128).replace(/[;{}]/g, '').trim();
  }

  // ─── Audio Engine (lazy, Web Audio API) ───
  var audioCtx = null;
  var lastSoundTime = 0;

  function getAudioCtx() {
    if (!audioCtx) {
      try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return null; }
    }
    return audioCtx;
  }

  function playSynthSound(synth) {
    if (!synth) return;
    // Respect reduced-motion
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // Debounce 100ms
    var now = Date.now();
    if (now - lastSoundTime < 100) return;
    lastSoundTime = now;

    var ctx = getAudioCtx();
    if (!ctx) return;
    if (ctx.state === 'suspended') { try { ctx.resume(); } catch (e) { return; } }

    try {
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.type = synth.waveform || 'sine';
      osc.frequency.value = synth.frequency || 440;

      var vol = Math.max(0, Math.min(1, synth.volume || 0.3));
      var attack = (synth.attack || 10) / 1000;
      var release = (synth.release || 100) / 1000;
      var duration = (synth.duration || 200) / 1000;

      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + attack);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);

      osc.connect(gain);
      if (synth.filter) {
        var filter = ctx.createBiquadFilter();
        filter.type = synth.filter.type || 'lowpass';
        filter.frequency.value = synth.filter.cutoff || 2000;
        gain.connect(filter);
        filter.connect(ctx.destination);
      } else {
        gain.connect(ctx.destination);
      }
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + duration + release);
    } catch (e) { /* ignore audio errors */ }
  }

  function bindSoundExtensions(exts) {
    if (!exts) return;
    var clickSounds = [];
    var hoverSounds = [];
    var ambientSounds = [];
    exts.forEach(function (ext) {
      if (ext.type !== 'sound') return;
      if (ext.trigger === 'click') clickSounds.push(ext.synth);
      else if (ext.trigger === 'hover') hoverSounds.push(ext.synth);
      else if (ext.trigger === 'ambient') ambientSounds.push(ext.synth);
    });

    if (clickSounds.length) {
      document.addEventListener('click', function () {
        clickSounds.forEach(playSynthSound);
      }, { once: false, passive: true });
    }
    if (hoverSounds.length) {
      document.addEventListener('mousemove', function () {
        hoverSounds.forEach(playSynthSound);
      }, { once: false, passive: true });
    }
    if (ambientSounds.length) {
      // Play ambient sounds once after first user interaction
      var played = false;
      document.addEventListener('click', function () {
        if (played) return;
        played = true;
        ambientSounds.forEach(playSynthSound);
      }, { once: false, passive: true });
    }
  }

  // ─── Dual-Theme Mode ───
  function applyDualMode(theme, mode) {
    if (!theme.dual) return false;
    var lightVars = theme.dual.light.cssVars || {};
    var darkVars = theme.dual.dark.cssVars || {};
    var selector = mode === 'data'
      ? function (s) { return '[data-theme="' + s + '"]'; }
      : function (s) { return '.theme-' + s; };

    var globalStyle = document.getElementById('td-runner-dual');
    if (!globalStyle) {
      globalStyle = document.createElement('style');
      globalStyle.id = 'td-runner-dual';
      document.head.appendChild(globalStyle);
    }
    var css = selector('light') + ' {\n';
    Object.entries(lightVars).forEach(function (e) { css += '  ' + e[0] + ': ' + e[1] + ';\n'; });
    css += '}\n' + selector('dark') + ' {\n';
    Object.entries(darkVars).forEach(function (e) { css += '  ' + e[0] + ': ' + e[1] + ';\n'; });
    css += '}\n';
    globalStyle.textContent = css;
    return true;
  }

  // ─── Main Component ───
  class ThemeDistRunner extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this._pollTimer = null;
      this._currentTheme = null;
    }

    static get observedAttributes() {
      return ['api', 'save-shadow', 'live'];
    }

    get api() { return this.getAttribute('api') || '/api/v1/today.json'; }
    get saveShadow() { return this.getAttribute('save-shadow') !== 'false'; }
    get live() { return this.hasAttribute('live'); }

    // ── Static: Pin ──
    static setPin(preset) {
      if (preset) localStorage.setItem(PIN_KEY, preset);
      else localStorage.removeItem(PIN_KEY);
    }
    static clearPin() { localStorage.removeItem(PIN_KEY); }
    static getPin() { return localStorage.getItem(PIN_KEY); }

    // ── Static: Theme Mode ──
    static setMode(mode) {
      if (mode === 'light' || mode === 'dark' || mode === 'auto') {
        localStorage.setItem(MODE_KEY, mode);
        // Apply to document immediately
        if (mode === 'auto') {
          document.documentElement.removeAttribute('data-theme');
          var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
          document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
        } else {
          document.documentElement.setAttribute('data-theme', mode);
        }
      }
    }
    static getMode() { return localStorage.getItem(MODE_KEY) || 'auto'; }

    async connectedCallback() {
      var pin = ThemeDistRunner.getPin();
      var apiUrl = pin
        ? this.api.replace(/\/api\/v1\/today\.json$/, '/api/v1/theme/' + encodeURIComponent(pin) + '.json')
        : this.api;

      // Append ?dual=true for dual-theme support
      var sep = apiUrl.includes('?') ? '&' : '?';
      var dualUrl = apiUrl + sep + 'dual=true';

      var todayStr = new Date().toISOString().slice(0, 10);

      // 1. Try cache
      try { var cached = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null'); } catch (e) { cached = null; }
      if (cached && cached.date === todayStr && !pin) {
        this.applyTheme(cached.data);
        this._startPolling(dualUrl);
        return;
      }

      // 2. Fetch
      try {
        var res = await fetch(dualUrl);
        if (!res.ok) throw new Error('HTTP ' + res.status);
        var theme = await res.json();
        if (!pin) {
          try { localStorage.setItem(CACHE_KEY, JSON.stringify({ date: todayStr, data: theme })); } catch (e) { }
        }
        this.applyTheme(theme);
      } catch (err) {
        console.warn('ThemeDist: fetch failed, using stale cache', err.message);
        if (cached) this.applyTheme(cached.data);
      }

      this._startPolling(dualUrl);
    }

    _startPolling(url) {
      if (!this.live || this._pollTimer) return;
      var self = this;
      // Poll every 5 minutes (smart polling replaces SSE)
      this._pollTimer = setInterval(function () {
        fetch(url).then(function (r) { return r.json(); }).then(function (theme) {
          self.applyTheme(theme);
        }).catch(function () { });
      }, 300000);
    }

    disconnectedCallback() {
      if (this._pollTimer) { clearInterval(this._pollTimer); this._pollTimer = null; }
    }

    applyTheme(theme) {
      this._currentTheme = theme;

      // Dual-theme mode
      var mode = ThemeDistRunner.getMode();
      if (theme.dual) {
        applyDualMode(theme, 'data');
        if (mode === 'auto') {
          var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
          document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
        } else {
          document.documentElement.setAttribute('data-theme', mode);
        }
        // Also inject current mode's vars into :root as fallback
        var currentVars = (mode === 'dark' || (mode === 'auto' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches))
          ? theme.dual.dark.cssVars : theme.dual.light.cssVars;
        if (currentVars) {
          Object.entries(currentVars).forEach(function (e) {
            document.documentElement.style.setProperty(e[0], e[1]);
          });
        }
      } else if (theme.cssVars) {
        // Single-theme mode
        Object.entries(theme.cssVars).forEach(function (e) {
          document.documentElement.style.setProperty(e[0], e[1]);
        });
      }

      // Shadow DOM content
      var shadowParts = [];
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

      if (theme.customCss) { shadowParts.push(theme.customCss); }

      var styleEl = document.createElement('style');
      styleEl.textContent = shadowParts.join('\n');
      this.shadowRoot.innerHTML = '';
      this.shadowRoot.appendChild(styleEl);

      // Render extensions (filter out sound from DOM rendering)
      if (theme.extensions && theme.extensions.length) {
        this.renderShadowExtensions(theme.extensions.filter(function (e) { return e.type !== 'sound'; }));
        // Bind sound extensions
        bindSoundExtensions(theme.extensions);
      }

      // Global keyframes
      if (theme.customCss) {
        var globalStyle = document.getElementById('td-runner-keyframes');
        if (!globalStyle) {
          globalStyle = document.createElement('style');
          globalStyle.id = 'td-runner-keyframes';
          document.head.appendChild(globalStyle);
        }
        var keyframes = '';
        var kfRe = /@keyframes\s+[\s\S]*?\{[\s\S]*?\}\s*\}/g;
        var match;
        while ((match = kfRe.exec(theme.customCss)) !== null) { keyframes += match[0] + '\n'; }
        globalStyle.textContent = keyframes;
      }
    }

    renderShadowExtensions(exts) {
      var decoLayer = document.createElement('div');
      decoLayer.className = 'deco-layer';

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

      this.shadowRoot.appendChild(decoLayer);
    }
  }

  customElements.define('themedist-runner', ThemeDistRunner);
})();
