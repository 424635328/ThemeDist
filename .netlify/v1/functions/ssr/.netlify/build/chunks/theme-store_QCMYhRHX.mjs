import { c as createComponent } from './astro-component_C4iwsvtt.mjs';
import 'piccolore';
import { r as renderComponent, u as renderTemplate, q as maybeRenderHead, k as addAttribute } from './ssr-function_yscoTaBG.mjs';
import { r as renderScript } from './script_DOSZrVRJ.mjs';
import { $ as $$Layout } from './Layout_C5Si_EoU.mjs';
import { g as getAllOmniThemes, b as getOmniDailyTheme } from './omni-bridge_C96fFqzW.mjs';

const $$ThemeStore = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$ThemeStore;
  const allThemes = getAllOmniThemes();
  const today = getOmniDailyTheme();
  const todayPreset = today.preset;
  function hexToHue(hex) {
    if (!hex || typeof hex !== "string") return 0;
    const c = hex.replace("#", "").trim();
    if (c.length === 3) {
      const chars = c.split("");
      return hexToHue(`#${chars[0]}${chars[0]}${chars[1]}${chars[1]}${chars[2]}${chars[2]}`);
    }
    if (c.length !== 6) return 0;
    const r = parseInt(c.slice(0, 2), 16) / 255;
    const g = parseInt(c.slice(2, 4), 16) / 255;
    const b = parseInt(c.slice(4, 6), 16) / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const d = max - min;
    if (d === 0) return 0;
    let h = 0;
    if (max === r) h = (g - b) / d % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    return Math.round(h * 60);
  }
  function classifyColor(hex) {
    const hue = hexToHue(hex);
    if (hue <= 100 || hue >= 330) return "warm";
    return "cool";
  }
  const themes = allThemes.map((t, i) => {
    const primaryHex = t.cssVars["--color-primary"] || "#000000";
    return {
      preset: t.preset,
      presetName: t.presetName,
      cssVars: t.cssVars,
      isToday: t.preset === todayPreset,
      isHoliday: t.preset.startsWith("holiday-"),
      primaryHex,
      colorFamily: classifyColor(primaryHex),
      index: i
    };
  });
  const BATCH_SIZE = 40;
  const totalCount = themes.length;
  const holidayCount = themes.filter((t) => t.isHoliday).length;
  const dailyCount = totalCount - holidayCount;
  const warmCount = themes.filter((t) => t.colorFamily === "warm").length;
  const coolCount = themes.filter((t) => t.colorFamily === "cool").length;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {}, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="section text-center"> <p class="t-label">Theme Store</p> <h1 class="t-heading mt-2">主题商店</h1> <p class="t-subhead mt-2" style="max-width:560px;margin-inline:auto"> ${totalCount}+ 套预设主题，包含 ${holidayCount} 个节日主题和 ${dailyCount} 个日常主题。节日自动优先，其余按日轮换。
</p> </section> <section class="section-sm" style="padding-top:0"> <div class="store-controls"> <!-- Search --> <div class="search-wrapper"> <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.35-4.35"></path></svg> <input type="text" id="search" placeholder="搜索主题名称或色值…" autocomplete="off" class="search-input"> <button id="search-clear" class="search-clear" aria-label="清除搜索" hidden>✕</button> </div> <!-- Sort dropdown --> <div class="sort-dropdown" id="sort-dropdown"> <button class="sort-trigger" id="sort-trigger" aria-haspopup="listbox" aria-expanded="false"> <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="sort-icon"><path d="M3 7h18M6 12h12M9 17h6"></path></svg> <span id="sort-label">默认排序</span> <svg width="10" height="6" viewBox="0 0 10 6" fill="none" class="sort-chevron"><path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg> </button> <ul class="sort-menu" id="sort-menu" role="listbox" aria-label="排序方式" hidden> <li class="sort-option sort-option-active" role="option" aria-selected="true" data-value="default"> <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M12 2v4m0 12v4M2 12h4m12 0h4"></path></svg>
默认排序
</li> <li class="sort-option" role="option" aria-selected="false" data-value="name-asc"> <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 8l4-4 4 4M7 4v16M14 8h7M14 16h5"></path></svg>
名称 A → Z
</li> <li class="sort-option" role="option" aria-selected="false" data-value="name-desc"> <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 8l4-4 4 4M7 4v16M21 8h-5M17 16h-3"></path></svg>
名称 Z → A
</li> </ul> </div> </div> <!-- Category filter chips --> <div class="filter-chips" role="group" aria-label="主题分类筛选"> <button class="chip chip-active" data-filter="all" aria-pressed="true">全部 <span class="chip-count">${totalCount}</span></button> <button class="chip" data-filter="holiday" aria-pressed="false">节日 <span class="chip-count">${holidayCount}</span></button> <button class="chip" data-filter="daily" aria-pressed="false">日常 <span class="chip-count">${dailyCount}</span></button> <span class="chip-divider"></span> <button class="chip" data-filter="warm" aria-pressed="false">暖色 <span class="chip-count">${warmCount}</span></button> <button class="chip" data-filter="cool" aria-pressed="false">冷色 <span class="chip-count">${coolCount}</span></button> <span class="chip-divider"></span> <button class="chip" data-filter="community" aria-pressed="false">社区 <span class="chip-count" id="community-chip-count">-</span></button> </div> <!-- Community header bar (visible when community tab active) --> <div id="community-header" style="display:none;max-width:1120px;margin:0 auto 20px"> <div class="comm-header-card"> <div class="comm-header-top"> <div class="comm-header-title-row"> <span class="comm-header-icon"> <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg> </span> <h2 class="comm-header-title">社区精选</h2> <span class="comm-header-count" id="community-header-count">-</span> </div> <div class="comm-header-sort" id="community-sort"> <button class="comm-sort-btn comm-sort-active" data-comm-sort="new"> <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 2v12M3 7l5-5 5 5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
最新
</button> <button class="comm-sort-btn" data-comm-sort="hot"> <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M8 14s-6-3.5-6-7.5a3.5 3.5 0 016-2.2 3.5 3.5 0 016 2.2C14 10.5 8 14 8 14z" stroke-linecap="round" stroke-linejoin="round"></path></svg>
最热
</button> </div> </div> <p class="comm-header-desc">用户投稿的原创主题设计，经管理员审核后收录。点击下方卡片即可预览或一键应用。</p> </div> </div> <!-- Result count --> <div class="result-bar"> <span id="result-count" class="result-count"></span> </div> <!-- Theme grid --> <div class="grid-auto" id="theme-grid"${addAttribute(todayPreset, "data-today-preset")} style="max-width:1120px;margin:0 auto"> ${themes.map((t) => {
    const { cssVars: v, primaryHex: p, preset } = t;
    const bgHex = v["--color-bg"];
    const textHex = v["--color-text"];
    return renderTemplate`<div class="card card-interact theme-card"${addAttribute(t.presetName.toLowerCase(), "data-name")}${addAttribute(preset, "data-preset")}${addAttribute(p.toLowerCase(), "data-color")}${addAttribute(t.isHoliday ? "holiday" : "daily", "data-cat")}${addAttribute(t.colorFamily, "data-family")}${addAttribute(String(t.index), "data-index")}${addAttribute((t.isToday ? "--card-ring:var(--color-primary);" : "--card-ring:transparent;") + (t.index >= BATCH_SIZE ? "display:none" : ""), "style")}${addAttribute(t.index >= BATCH_SIZE ? "1" : void 0, "data-pending")}>  <div class="card-color-bar" aria-hidden="true"> <div class="color-bar-seg"${addAttribute(`flex:3;background:${p}`, "style")}></div> <div class="color-bar-seg"${addAttribute(`flex:1.5;background:${v["--color-secondary"]}`, "style")}></div> <div class="color-bar-seg"${addAttribute(`flex:0.8;background:${v["--color-accent"]}`, "style")}></div> <div class="color-bar-seg"${addAttribute(`flex:2;background:${bgHex}`, "style")}></div> <div class="color-bar-seg"${addAttribute(`flex:1.2;background:${textHex}`, "style")}></div> </div> <div class="card-body">  <div class="card-header"> <h3 class="card-title">${t.presetName}</h3> <div class="card-badges"> ${t.isToday && renderTemplate`<span class="badge badge-today">Today</span>`} ${t.isHoliday && renderTemplate`<span class="badge badge-holiday">节日</span>`} </div> </div>  <div class="swatch-row"> ${[
      { v: "--color-primary", l: "P" },
      { v: "--color-secondary", l: "S" },
      { v: "--color-accent", l: "A" },
      { v: "--color-bg", l: "Bg" },
      { v: "--color-text", l: "Tx" }
    ].map(({ v: varKey, l }) => renderTemplate`<button class="color-dot"${addAttribute(v[varKey], "data-color")}${addAttribute(`${varKey}: ${v[varKey]} — 点击复制`, "title")}${addAttribute(`复制 ${varKey}: ${v[varKey]}`, "aria-label")}${addAttribute(`background:${v[varKey]};--dot-border:${varKey === "--color-bg" ? "var(--color-border)" : "transparent"}`, "style")}> <span class="dot-label"${addAttribute(`color:${varKey === "--color-text" ? bgHex : textHex};text-shadow:0 0 2px ${bgHex}`, "style")}>${l}</span> </button>`)} <span class="card-hex">${p}</span> </div>  <div class="card-actions"> <a${addAttribute(`/?theme=${preset}`, "href")} class="btn-card btn-card-primary js-apply-btn"${addAttribute(preset, "data-preset")}${addAttribute(t.presetName, "data-name")}> <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path></svg>
应用
</a> <a${addAttribute(`?theme=${preset}`, "href")} class="btn-card" title="在本页预览"> <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5"></circle><circle cx="8" cy="8" r="2.5" stroke="currentColor" stroke-width="1.5"></circle></svg>
预览
</a> <a${addAttribute(`/theme-builder?theme=${preset}`, "href")} class="btn-card" title="在构建器中编辑"> <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.5"></rect><rect x="9" y="2" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.5"></rect><rect x="2" y="9" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.5"></rect><rect x="9" y="9" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.5"></rect></svg>
构建器
</a> </div> </div> </div>`;
  })} </div> <!-- Community grid (populated by JS) --> <div class="grid-auto" id="community-grid" style="display:none;max-width:1120px;margin:0 auto"></div> <!-- Empty state --> <p id="no-results" class="empty-state" hidden>未找到匹配的主题 — <a href="?" class="empty-link">清除所有筛选</a></p> <div id="community-empty" class="comm-empty-state" hidden> <div class="comm-empty-icon"> <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="3"></rect><path d="M9 9h6M9 13h6M9 17h4" stroke-linecap="round"></path></svg> </div> <h3 class="comm-empty-title">暂无社区主题</h3> <p class="comm-empty-desc">成为第一个分享主题设计的人</p> <a href="/submit" class="btn btn-primary" style="margin-top:12px;height:38px;padding:0 20px;font-size:13px">提交你的主题</a> </div> <!-- Load more sentinel --> <div id="load-sentinel" class="load-sentinel" aria-hidden="true"></div> </section> ` })} <!-- 🌸 启用 is:global 全局渲染，突破 Astro 作用域对动态生成社区卡片 CSS 的封锁 -->  ${renderScript($$result, "E:/GitHub/themeDist/src/pages/theme-store.astro?astro&type=script&index=0&lang.ts")}`;
}, "E:/GitHub/themeDist/src/pages/theme-store.astro", void 0);

const $$file = "E:/GitHub/themeDist/src/pages/theme-store.astro";
const $$url = "/theme-store";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$ThemeStore,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
