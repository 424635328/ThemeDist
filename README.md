# ThemeDist

**每日轮换的主题 CSS 变量分发服务** — 一个 GET 请求，整套网站视觉主题。

ThemeDist 是基于 Astro SSR 的主题分发平台，通过 **OmniConfig 主题数据库**（150+ 套节日 + 日池主题，含 35+ 农历节日、90+ 公历节日）每日由 Astro SSR 实时计算并输出 34 个 CSS 自定义属性。同时提供主题商店、在线构建器、社区投稿与审核、AI 辅助生成、主题标签分类、JSON 即装预览等完整功能。

支持 **Vercel + Netlify** 双平台部署，一份代码，同时运行。

---

## 目录

- [项目用途](#这个项目有什么用)
- [快速开始](#快速开始)
- [功能特性](#功能特性)
- [API 使用](#api-使用)
- [CSS 变量参考](#css-变量参考)
- [主题轮换策略](#主题轮换策略)
- [AI 主题生成](#ai-主题生成)
- [主题分类与标签](#主题分类与标签)
- [项目结构](#项目结构)
- [架构说明](#架构说明)
- [技术栈](#技术栈)
- [本地开发](#本地开发)
- [部署](#部署)
- [未来计划](#未来计划)
- [许可证](#许可证)

---

## 这个项目有什么用？？？

**ThemeDist** 简单来说，是一个**网页“每日穿搭”分发服务**。它主要是为了帮网页开发者解决 **“如何让自己的网站根据节日、日期自动切换视觉风格”** 这一需求。

### 1. 它能帮你的网站实现什么？（核心作用）

如果你把这个服务接入到你自己的网站中，你的网站就能实现**每日自动换肤**：
* **节日自动变装**：如果是农历春节，你的网站会自动变成红色调，甚至飘起红灯笼（Emoji 装饰）；如果是端午节，自动切换成青绿色的龙舟氛围；如果是地球日，自动变为绿色自然风。
* **周四特殊梗**：到了星期四，网站能自动切入恶搞的“疯四”KFC 红色主题。
* **日常不重样**：在没有节日的普通日子里，它会在拥有的 150+ 套预设主题池（或经过审核的社区投稿主题）中每日轮换，让用户每天访问你的网站都有新鲜感。

---

### 2. 它解决了开发者的哪些痛点？

在没有这种服务之前，开发者如果想让网站“逢年过节变个装”，通常需要：
1. **手动写多套 CSS**：为每个节日单独设计、调试一套配色。
2. **写复杂的日期判断逻辑**：特别是农历节日（如中秋、春节），在前端用 JS 计算农历非常繁琐，且会增加前端打包体积。
3. **手动部署或配置定时任务**：到了节日当天凌晨，手动去修改代码并重新发布网站。

而使用 **ThemeDist** 之后：
* **一劳永逸**：你只需要在网站的 HTML 里引入一个 API 链接，所有的日期计算、节日匹配、主题色选择、甚至氛围特效（如飘落的 Emoji）全部由 ThemeDist 服务端实时计算好并分发给你。
* **零维护成本**：你不需要在节日当天做任何操作，服务器到了 UTC 0点（北京时间早8点）会自动计算并切换主题。

---

### 3. 技术上它是如何工作的？

它的工作机制非常轻量且模块化：

1. **获取“穿搭指南”**：你的网页向 ThemeDist 发送一个 `GET` 请求（或者直接引入一个 `<link>` 样式表）。
2. **应用 CSS 变量**：API 会返回 34 个标准化的 CSS 自定义属性（即 CSS 变量），比如：
   * `--color-primary`（主色调）
   * `--color-bg`（背景色）
   * `--font-heading`（标题字体）
   * `--space-4`（间距）
3. **自动套用**：你的网页样式（CSS）只要使用了这些变量（例如 `background: var(--color-bg)`），就会在收到变量的瞬间自动改变颜色和布局。
4. **安全特效**：如果当天主题含有动画（比如灯笼摆动）或悬浮字符，它提供了经过安全过滤（防止恶意脚本注入 XSS）的 HTML 和 CSS 动画，供你安全地渲染在页面上。

---

### 4. 适合什么样的人和项目？

* **个人博客/主页**：让自己的小站更有生机，跟随现实世界的节日一同变化。
* **后台管理系统/SaaS 平台**：为用户提供一种“每日心情主题”的趣味功能，提升用户体验。
* **运营活动网站**：无需为每次短期节日活动重新设计、部署网页，直接套用现成的主题分发。

**总结：**
ThemeDist 就像是一个免维护的云端视觉运营助手。你只需要把网页的颜色、间距等样式“托管”给它的 CSS 变量，后续的每日轮换、节日换装、特效加载就全都不需要你再操心了。

## 快速开始

在你的网站中引入今日主题：

```html
<script>
fetch('https://themedist.netlify.app/api/v1/today.json')
  .then(r => r.json())
  .then(t => applyTheme(t))
  .catch(() => {
    const fb = JSON.parse(localStorage.getItem('td') || 'null');
    if (fb) applyTheme(fb);
  });

function applyTheme(t) {
  // 1. CSS 变量注入 :root
  Object.entries(t.cssVars).forEach(([k, v]) =>
    document.documentElement.style.setProperty(k, v));

  // 2. 自定义 CSS（安全注入：textContent，绝无 innerHTML）
  if (t.customCss) {
    let s = document.getElementById('td-custom-css');
    if (!s) { s = document.createElement('style'); s.id = 'td-custom-css'; document.head.appendChild(s); }
    s.textContent = t.customCss;
  }

  // 3. 声明式装饰元素 — 完整渲染逻辑见下方「完整集成方案」的 renderExtensions 函数
  // 此处省略，生产环境请使用下方完整方案（含缓存、降级、XSS 安全渲染）

  // 4. 写入缓存
  const today = new Date().toISOString().slice(0, 10);
  localStorage.setItem('td', JSON.stringify({ date: today, cssVars: t.cssVars, customCss: t.customCss, exts: t.extensions }));
}
</script>
```

完整集成方案（含缓存、降级、双类型扩展渲染）：

```javascript
(async () => {
  const today = new Date().toISOString().slice(0, 10);
  const cached = JSON.parse(localStorage.getItem('td') || 'null');
  if (cached?.date === today) return applyTheme(cached);

  try {
    const res = await fetch('https://themedist.netlify.app/api/v1/today.json');
    if (!res.ok) throw new Error('API unavailable');
    const t = await res.json();
    const data = { date: t.date, cssVars: t.cssVars, customCss: t.customCss, exts: t.extensions };
    localStorage.setItem('td', JSON.stringify(data));
    applyTheme(data);
  } catch {
    const fallback = JSON.parse(localStorage.getItem('td') || 'null');
    if (fallback) applyTheme(fallback);
  }
})();

// ── 主题应用核心 ──

function applyTheme(d) {
  // CSS 变量 → :root
  Object.entries(d.cssVars).forEach(([k, v]) =>
    document.documentElement.style.setProperty(k, v));

  // 自定义 CSS → <style>（安全：textContent）
  let styleEl = document.getElementById('td-custom-css');
  if (d.customCss) {
    if (!styleEl) { styleEl = document.createElement('style'); styleEl.id = 'td-custom-css'; document.head.appendChild(styleEl); }
    styleEl.textContent = d.customCss;
  } else if (styleEl) {
    styleEl.remove();
  }

  // 扩展元素渲染
  const oldExts = document.getElementById('td-extensions');
  if (oldExts) oldExts.innerHTML = '';
  if (d.exts && d.exts.length) renderExtensions(d.exts);
}

// ── 扩展元素渲染（无 innerHTML） ──

// 轻量 CSS 值清洗（防御 XSS）
function safeVal(v) { return (v||'').toString().slice(0,128).replace(/[;{}]/g,'').replace(/url\s*\(/gi,'').replace(/expression\s*\(/gi,'').replace(/javascript\s*:/gi,'').replace(/@import/gi,'').trim(); }
function safeDim(v) { var s = safeVal(v); return /^-?[\d.]+(?:%|px|em|rem|vh|vw|s|ms)?$/i.test(s) ? s : ''; }

function renderExtensions(exts) {
  let container = document.getElementById('td-extensions');
  if (!container) { container = document.createElement('div'); container.id = 'td-extensions'; document.body.prepend(container); }

  exts.slice(0, 20).forEach(function(ext) {
    if (ext.type === 'floating' && ext.char) {
      // floating: document.createElement 安全创建，绝无 innerHTML
      var el = document.createElement('div');
      var t = safeDim(ext.top), l = safeDim(ext.left), r = safeDim(ext.right), b = safeDim(ext.bottom);
      var fs = safeDim(ext.fontSize), anim = safeVal(ext.animation || '');
      var z = (typeof ext.zIndex === 'number' && ext.zIndex > -2 && ext.zIndex < 100000) ? ext.zIndex : null;
      var op = (typeof ext.opacity === 'number' && ext.opacity >= 0 && ext.opacity <= 1) ? ext.opacity : null;
      el.style.cssText = [
        'position:fixed', 'pointer-events:none',
        t && 'top:' + t, l && 'left:' + l, r && 'right:' + r, b && 'bottom:' + b,
        fs && 'font-size:' + fs, anim && 'animation:' + anim,
        z != null && 'z-index:' + z, op != null && 'opacity:' + op
      ].filter(Boolean).join(';');
      el.textContent = String(ext.char).slice(0, 4);
      container.appendChild(el);

    } else if (ext.type === 'decorative' && ext.html) {
      // decorative: <template> 安全解析 HTML，剥离 on* 事件
      var tpl = document.createElement('template');
      tpl.innerHTML = ext.html;
      var frag = tpl.content.cloneNode(true);
      frag.querySelectorAll('*').forEach(function(node) {
        Array.from(node.attributes).forEach(function(attr) {
          if (/^on/i.test(attr.name)) node.removeAttribute(attr.name);
        });
      });
      container.appendChild(frag);
    }
    // 注意："javascript" 类型不支持且会被服务端拒绝（API 响应的 warnings 字段会提示）
  });
}
```

> **FOUC 消除**：推荐在 `<head>` 中同步引入 `<link rel="stylesheet" href="/api/v1/today.css">`，阻塞式加载 CSS 变量，消除无样式闪烁。配合上述 JS 注入 customCss + extensions 即可完整覆盖。

---

## 功能特性

### 核心功能

- **每日自动轮换** — Astro SSR 实时计算，无需定时构建。农历节日 → 公历节日 → Crazy Thursday → 社区主题（约 30% 天数）→ 日池兜底
- **农历节日支持** — 基于 `lunar-javascript` 实现，覆盖春节、元宵、端午、中秋、重阳等 35+ 传统农历节日（含二十四节气）。运行时通过 `Lunar.fromDate()` 直接计算当前农历日期并匹配对应主题
- **社区主题投稿与审核** — 用户投稿后进入待审队列，管理员审核通过后自动发布至社区商店。通过后可点赞、可分享，长期有效。API 返回 `warnings` 提示不支持的扩展类型（如 `javascript`）
- **RESTful API** — `GET /api/v1/today.json` 返回完整主题数据；所有接口支持 CORS 跨域
- **CDN 友好缓存** — 浏览器 1h / CDN 24h（今日主题，含 `stale-while-revalidate=3600` 降级），365 天不可变缓存（预设主题端点）
- **CSS 变量体系** — 34 个语义化 CSS 自定义属性（颜色 8 + 排版 8 + 间距 10 + 效果 6 + 氛围 2），覆盖完整 UI 语义
- **双平台部署** — Vercel + Netlify 同时分发，同一份代码自动适配
- **优雅降级** — Redis 不可用时社区功能自动降级为只读，站点核心功能不受影响

### 用户端页面

- **主题商店（Theme Store）** — 浏览、搜索、按分类/色温/标签筛选所有主题（预设 + 社区），社区主题支持按暗色/亮色/暖色/冷色/鲜艳/极简/自然/科技标签筛选，高亮今日主题。社区列表使用 sessionStorage 缓存（5 分钟 TTL），命中缓存瞬间渲染，后台静默刷新
- **主题构建器（Theme Builder）** — 实时编辑 CSS 变量、自定义 CSS、声明式扩展（floating + decorative），各编辑器独立格式化 + 实时计数。智能检测不支持类型并实时提示。支持图片取色（K-means 聚类提取调色板）、AI 描述生成、一键应用至全站
- **社区投稿（Submit）** — 三栏编辑器（CSS 变量 / 自定义 CSS / Extensions），实时校验 extensions 类型（floating / decorative）并警告不支持的类型（如 javascript）。右侧 16:9 LIVE SENSING 沙箱实时预览。提交后 API 返回 warnings 提示被移除的字段。本地历史记录含数据库状态检测
- **AI 主题生成** — 输入文字描述，使用 DeepSeek（用户自带 Key，客户端直接调用，max_tokens: 10000）或内置规则引擎生成完整 CSS 变量主题
- **主题分享页（Share）** — 社区主题详情展示，支持点赞、复制链接、一键应用，含桌面/平板/手机视口切换预览
- **主题预览（Theme Preview）** — 粘贴 JSON 配置即刻变装预览，支持格式化、载入示例、清空还原，无需提交即可实时体验任意主题

### 管理端

- **Cookie 认证 + CSRF** — 单管理员登录，HttpOnly + SameSite strict，写操作需 CSRF Token
- **投稿限流** — 内存级滑动窗口限流（投稿 3次/分钟，点赞 10次/分钟），超限返回 429
- **审核面板** — 主题提交后默认进入待审队列，管理员审核通过后发布至社区商店
- **点赞去重** — Redis Set 防重复点赞（IP + User-Agent 哈希），点赞数实时同步至排行榜

---

## API 使用

详细文档请访问部署后的 `/api/docs` 页面。以下为完整端点概览：

### 完整端点索引

| 方法 | 路径 | 分类 | 说明 | 缓存 |
|------|------|------|------|------|
| GET | `/api/v1/today.json` | 核心 | 今日主题完整数据（cssVars + extensions + directory） | 浏览器 1h / CDN 24h |
| GET | `/api/v1/today.css` | 核心 | 今日主题纯 CSS（`:root{}` 变量，消除 FOUC） | 浏览器 1h / CDN 24h |
| GET | `/api/v1/date=MM-DD` | 核心 | 按日期查询主题（如 `/api/v1/date=02-14`） | 浏览器 1h |
| GET | `/api/v1/theme/{id}.json` | 核心 | 指定预设/社区主题完整数据 | 预设 365d / 社区 1h |
| GET | `/api/v1/theme/random.json` | 工具 | 随机主题（支持 `?pool=static\|community\|all` 和 `?seed=N`） | 不缓存 |
| GET | `/api/v1/index-data.json` | 核心 | 构建时索引（日池/节日映射/目录） | 浏览器 1h / CDN 24h |
| | | | | |
| GET | `/api/v1/theme/{id}/wcag.json` | 诊断 | WCAG 无障碍诊断（AA/AAA 对比度评估） | 浏览器 1h |
| GET | `/api/v1/theme/{id}/scale.json` | 诊断 | Tailwind 风格 50~950 色阶（4 组） | 365d immutable |
| GET | `/api/v1/theme/{id}/export/shadcn.css` | 诊断 | Shadcn UI HSL 变量适配器 | 365d immutable |
| GET | `/api/v1/theme/{id}/shiki.json` | 诊断 | Shiki/VS Code TextMate Token 颜色映射 | 365d immutable |
| GET | `/api/v1/theme/{id}/og.svg` | 工具 | OG 社交分享卡片（1200×630 SVG） | 365d immutable |
| | | | | |
| GET | `/api/v1/weather-theme.json` | 环境 | 天气自适应主题（IP/Geolocation + Open-Meteo） | 30min |
| GET | `/api/v1/status-override.json?status=` | 环境 | 系统状态覆盖（maintenance/mourning/incident） | 5min |
| | | | | |
| GET | `/api/v1/tailwind-config.json` | 工具 | Tailwind CSS 配置生成（RGB 通道 + `<alpha-value>`） | 浏览器 1h |
| GET | `/api/v1/tokens.json` | 工具 | W3C DTCG 设计令牌 JSON 导出 | 浏览器 1h |
| GET | `/api/v1/today/pattern.css` | 工具 | 动态 SVG 背景纹理（主题色几何图案） | 浏览器 1h |
| GET | `/api/v1/today/weather.js` | 工具 | 天气粒子渲染脚本（云/雨/雪/太阳/闪电），`<script src>` 引入 | 浏览器 1h / CDN 24h |
| GET | `/api/v1/today/favicon.svg` | 工具 | 动态 Favicon（主色圆角矩形 + Logo 首字） | 浏览器 1h |
| GET | `/api/v1/today/fonts.css` | 工具 | 自动字体注入（Google Fonts @import） | 浏览器 1h |
| GET | `/api/v1/today/palette.svg` | 工具 | 今日主题调色盘 SVG 徽章 | 浏览器 1h |
| GET | `/api/v1/search/color.json?hex=&limit=` | 工具 | 颜色相似度搜索（RGB 欧几里得距离） | 浏览器 1h |
| GET | `/api/v1/recommend/{id}.json` | 工具 | 智能推荐引擎（Jaccard + 颜色距离） | 浏览器 1h |
| GET | `/api/v1/trending.json` | 工具 | 趋势排行榜（热度 = 点赞×10 + 使用量×1） | 5min |
| GET | `/api/v1/badge/{username}.svg` | 工具 | GitHub 动态徽章（shields.io 风格） | 浏览器 1h |
| POST | `/api/v1/extract-theme.json` | 工具 | 图片取色（K-means + UI 语义映射，纯 JS） | 不缓存 |
| POST | `/api/v1/ai/describe.json` | AI | AI 逆向描述（CSS 变量→中文风格分析） | 不缓存 |
| | | | | |
| GET | `/api/v1/diy/themes.json` | 社区 | 社区主题列表（分页 + 排序 + 标签筛选） | 1min |
| GET | `/api/v1/diy/theme.json?id=` | 社区 | 单个社区主题详情（含点赞数） | 5min |
| POST | `/api/v1/diy/submit.json` | 社区 | 提交社区主题（进入审核队列） | 不缓存 |
| POST | `/api/v1/diy/suggest-tags.json` | 社区 | 8 维度分析主题，推荐 19 类标签及置信度 | 不缓存 |
| POST | `/api/v1/diy/like.json` | 社区 | 点赞社区主题（IP+UA+UUID 三重去重） | 不缓存 |
| | | | | |
| POST | `/api/v1/ai/generate.json` | AI | AI 主题生成（规则引擎，或 DeepSeek 客户端直调） | 不缓存 |
| | | | | |
| POST | `/api/v1/telemetry/hit` | 遥测 | 匿名遥测上报（HyperLogLog + Sorted Set） | 不缓存 |
| POST | `/api/v1/pool/create.json` | 池 | 创建自定义轮换池 | 不缓存 |
| GET | `/api/v1/pool/{poolId}.json` | 池 | 自定义轮换池每日轮换查询 | 1h |
| | | | | |
| GET | `/api/v1/admin/health.json` | 管理 | Redis 健康检查（pending/approved 计数） | 不缓存 |
| POST | `/api/v1/admin/login.json` | 管理 | 管理员登录（Cookie + CSRF） | 不缓存 |
| GET/POST | `/api/v1/admin/review.json` | 管理 | 审核待审主题 / 批量批准 | 不缓存 |

### 演示页面

| 路径 | 说明 |
|------|------|
| `/weather-demo` | 天气感知演示 — 浏览器定位 + 实时天气视觉渲染（云/雨/雪/太阳） |
| `/lab` | 全场景 API 展厅 — 天气/纹理/高亮/缓动/WCAG 五合一联动 |
| `/theme-store` | 主题商店 — 浏览/搜索/筛选所有主题 |
| `/theme-builder` | 主题构建器 — 实时编辑 CSS 变量/自定义 CSS/Extensions |
| `/submit` | 社区投稿 — 三栏编辑器 + AI 生成 + LIVE SENSING 沙箱 |

### 获取今日主题

```bash
curl https://themedist.netlify.app/api/v1/today.json
```

**响应示例：**

```json
{
  "date": "2026-05-25",
  "generatedAt": "2026-05-25T08:41:18.181Z",
  "preset": "holiday-145",
  "presetName": "DONT PANIC",
  "dailyIsCommunity": false,
  "apiVersion": "v1",
  "cssVars": {
    "--color-primary": "#000080",
    "--color-secondary": "#4285F4",
    "--color-accent": "#4285f4",
    "--color-bg": "#00001a",
    "--color-surface": "#0f0f29",
    "--color-text": "#e6e6fa",
    "--color-text-muted": "#87ceeb",
    "--color-border": "rgba(66,133,244,0.18)",
    "--font-heading": "'Inter', system-ui, sans-serif",
    "--font-body": "'Inter', system-ui, sans-serif",
    "--font-mono": "'JetBrains Mono', monospace",
    "--text-base": "clamp(1rem, 0.9rem + 0.5vw, 1.125rem)",
    "--text-lg": "calc(var(--text-base) * 1.25)",
    "--text-xl": "calc(var(--text-lg) * 1.25)",
    "--text-2xl": "calc(var(--text-xl) * 1.25)",
    "--text-sm": "calc(var(--text-base) / 1.25)",
    "--space-unit": "0.25rem",
    "--space-1": "calc(0.25rem * 1)",
    "--space-2": "calc(0.25rem * 2)",
    "--space-3": "calc(0.25rem * 3)",
    "--space-4": "calc(0.25rem * 4)",
    "--space-6": "calc(0.25rem * 6)",
    "--space-8": "calc(0.25rem * 8)",
    "--space-12": "calc(0.25rem * 12)",
    "--radii": "0.75rem",
    "--content-max": "72rem",
    "--shadow-sm": "0 1px 2px rgba(0,0,0,0.08)",
    "--shadow-md": "0 4px 12px rgba(0,0,0,0.12)",
    "--shadow-lg": "0 12px 32px rgba(0,0,0,0.18)",
    "--glass-bg": "color-mix(in srgb, var(--color-bg) 85%, transparent)",
    "--glass-blur": "blur(16px)",
    "--noise-opacity": "0",
    "--ambient-1": "rgba(0,0,128,0.18)",
    "--ambient-2": "rgba(66,133,244,0.08)"
  },
  "customCss": "\n  .text-logo { font-weight: 900; }\n",
  "extensions": [
    { "type": "floating", "char": "🧻", "top": "15%", "left": "5%", "fontSize": "30px", "opacity": 0.3, "animation": "swing 4s ease-in-out infinite" }
  ],
  "logoText": "DONT PANIC",
  "logoColors": ["#4285F4", "#34A853", "#FBBC05", "#EA4335"],
  "available": 151,
  "directory": [
    { "preset": "yozakura-reverie", "name": "🌸 Yozakura", "primary": "#ff8fa3", "accent": "#ff8fa3", "logoText": "YOZAKURA" },
    { "preset": "arknights-babel-epic", "name": "ARKNIGHTS", "primary": "#2c3540", "accent": "#b34747", "logoText": "ARKNIGHTS" }
  ]
}
```

关键字段：

| 字段 | 说明 |
|------|------|
| `preset` | 主题预设 ID（如 `holiday-l01-01` 表示农历春节） |
| `presetName` | 主题显示名称 |
| `dailyIsCommunity` | `true` 表示今日主题来自社区投稿 |
| `apiVersion` | API 版本号，当前为 `"v1"` |
| `cssVars` | 34 个 CSS 自定义属性键值对（含自动生成的 `-rgb` 通道变体，共约 44 个） |
| `customCss` | 主题专属 CSS 动画（无自定义 CSS 时为空字符串 `""`） |
| `extensions` | 声明式装饰元素数组，支持 `floating`（安全浮动字符）和 `decorative`（经清洗的 HTML 片段）。始终为数组，无扩展时为空数组 `[]` |
| `clickEffect` | 声明式点击特效配置，含 `spawn` 数组。无特效时为 `null`。详见 [API 文档](https://themedist.vercel.app/api/docs#clickeffect-ref) |
| `logoText` | 主题 Logo 文字标识 |
| `logoColors` | Logo 渐变色 hex 字符串数组 |
| `available` | 可用主题总数（预设 + 社区） |
| `directory` | 主题目录列表，每项含 `preset` / `name` / `primary` / `accent` / `logoText` |
| `dailyIsCommunity` | `true` 表示今日主题来自社区投稿 |
| `appliedOverrides` | 仅在使用 `?overrides=` 查询参数时出现，值为 `true` |

### 获取今日主题（安全代理）

```bash
curl https://themedist-monitor.vercel.app/api/v1/today-safe
```

从 ThemeDist 代理获取最新 `today.json` 数据（**Vercel 优先，Netlify 备用**），经安全处理流水线（HTML 剥离 → XSS 扫描 → Schema 校验）后输出。下游主题渲染器可直接安全消费，无需自行处理输入净化。

**响应格式：** `application/json`

```json
{
  "date": "2026-05-25",
  "generatedAt": "2026-05-25T07:29:19.537Z",
  "preset": "holiday-145",
  "presetName": "DONT PANIC",
  "cssVars": { "--color-primary": "#000080", "--color-bg": "#00001a" },
  "customCss": "\n  .text-logo { font-weight: 900; }\n",
  "extensions": [{ "type": "floating", "char": "🧻", "top": "15%" }],
  "logoText": "DONT PANIC",
  "logoColors": ["#4285F4", "#34A853", "#FBBC05", "#EA4335"],
  "available": 151,
  "directory": [{ "preset": "yozakura-reverie", "name": "🌸 Yozakura" }],
  "dailyIsCommunity": false,
  "apiVersion": "v1",
  "_meta": {
    "sanitized": true,
    "schemaValid": true,
    "timestamp": "2026-05-25T08:24:52.742Z"
  }
}
```

关键字段：

| 字段 | 说明 |
|------|------|
| `_meta.sanitized` | `true` 表示所有字符串字段已完成 XSS 清洗（HTML 标签、事件处理器、`javascript:` 协议） |
| `_meta.schemaValid` | `true` 表示响应结构通过 schema 校验 |
| `_meta.fallback` | 仅回退时存在，`true` 表示当前主题校验失败，已回退至上次安全快照 |
| `_meta.reason` | 回退原因（如 `"Current theme failed validation"`） |
| `_meta.timestamp` | 代理处理时间戳 |

**异常处理：** 两个上游平台（Vercel、Netlify）均不可达时返回 `502 Bad Gateway`。安全扫描未通过时自动回退至 KV 中缓存的上次安全快照。

**XSS 清洗范围：** 移除 HTML 标签、事件处理器（`onerror`、`onload` 等）、`javascript:` 协议、CSS `expression()`。清洗后的数据可直接注入 DOM。

### 系统监控 API（themedist-monitor）

ThemeDist 提供独立的监控站点 [themedist-monitor](https://themedist-monitor.vercel.app/)，持续监控双平台健康状态与主题安全。以下为对外提供的 API：

#### 平台实时状态 — `/api/v1/status`

```bash
curl https://themedist-monitor.vercel.app/api/v1/status
```

返回双平台（Vercel / Netlify）实时状态、延迟、缓存命中率，以及最新主题快照。支持 CORS 跨域，含 OPTIONS 预检。缓存 30s。

**响应示例：**
```json
{
  "overall": "healthy",
  "platforms": {
    "vercel": { "status": "online", "latencyMs": 486, "cacheStatus": "MISS", "error": null },
    "netlify": { "status": "online", "latencyMs": 866, "cacheStatus": "HIT", "error": null }
  },
  "theme": { "date": "2026-05-25", "presetName": "DONT PANIC", "themeCount": 151, "isSafe": true },
  "checkedAt": "2026-05-25T08:23:28.072Z"
}
```

#### 综合仪表盘数据 — `/api/v1/data`

```bash
curl https://themedist-monitor.vercel.app/api/v1/data
```

返回完整仪表盘数据：平台状态、24h 延迟时序、SLA（7 天/30 天可用率）、CDN 命中率、性能日志、未解决告警、安全事件。缓存 30s。

**关键指标示例：**
```json
{
  "status": { "vercel": { "status": "online", "latencyMs": 890 }, "netlify": { "status": "online", "latencyMs": 1563 }, "db": "healthy" },
  "metrics": {
    "avgLatency24h": { "vercel": 1245, "netlify": 1829 },
    "cdnHitRate": 50,
    "themeCount": 151,
    "sla": {
      "vercel": { "d7": 90.24, "d30": 90.24 },
      "netlify": { "d7": 90.24, "d30": 90.24 }
    }
  },
  "alerts": { "unresolved": 1, "recent": 20 },
  "securityIncidents": 50,
  "metricsHistory": { "vercel": 28, "netlify": 28 },
  "timestamp": "2026-05-25T08:51:02.001Z"
}
```

#### 主题安全状态 — `/api/v1/security-status`

```bash
curl https://themedist-monitor.vercel.app/api/v1/security-status
```

返回当前主题的安全扫描结果。支持 CORS 跨域。

**响应示例：**
```json
{
  "status": "safe",
  "message": "Current theme is safe to use",
  "securityStatus": "safe",
  "flaggedReasons": [],
  "schemaValid": true,
  "themeName": "DONT PANIC",
  "checkedAt": "2026-05-25",
  "timestamp": "2026-05-25T08:41:20.915Z"
}
```

#### 其他监控端点

| 端点 | 方法 | 说明 |
|------|------|------|
| `/api/v1/monitor` | GET, POST, DELETE | 触发全量监控检查（含限流/Cron鉴权） |
| `/api/v1/probe` | GET | 多区域拨测（Edge Runtime，Vercel Cron 06:00 UTC） |
| `/api/v1/telemetry` | POST | RUM 用户端页面加载耗时上报 |
| `/api/v1/alerts/resolve` | POST | 告警处理（单条或批量） |
| `/api/v1/badges/[type]` | GET | SVG 状态徽章（支持 vercel/netlify/theme/database/uptime） |
| `/api/v1/diagnose` | GET | 服务端网络连通性诊断（含限流） |
| `/api/v1/debug-kv` | GET | KV 存储读写测试（运维调试） |

> 完整监控 API 文档见 [themedist-monitor API 文档](https://themedist-monitor.vercel.app/api/v1/status)。

### 获取指定预设主题

```bash
curl https://themedist.netlify.app/api/v1/theme/yozakura-reverie.json
```

返回 365 天不可变缓存头（`immutable`）。

### 获取指定日期的主题

```bash
curl https://themedist.netlify.app/api/v1/date=02-14
```

按 `MM-DD` 格式指定日期，返回该日期的主题数据。响应格式与 `/api/v1/today.json` 一致。

日期的主题选取规则：农历节日 → 公历节日 → 疯狂星期四 → 社区主题（每 3 天轮入一次） → 每日主题池轮换。

### 在站点上预览指定日期的主题

```
/date=02-14
```

直接在 ThemeDist 站点上体验任意日期的主题。访问后自动将该日期的主题应用到整个站点，并持久化到 localStorage —— 之后再浏览站内其他页面（主题商店、构建器等），主题不会丢失。

点击顶栏的「回到今日主题」按钮即可恢复当日默认主题。

> 该功能可用于节日前预览效果，或给访客分享「看看你生日那天的主题」。

### 获取指定社区主题

```bash
curl "https://themedist.netlify.app/api/v1/diy/theme.json?id=La59KWMz"
```

返回完整社区主题数据（含作者、点赞数、标签等元信息），缓存 5 分钟。

### 获取构建时索引数据

```bash
curl https://themedist.netlify.app/api/v1/index-data.json
```

返回日池 ID 列表（当前 10 个预设）、97 个公历节日映射、38 个农历节日映射（农历→公历日期转换）和主题目录（前 20 个）。

**响应示例：**
```json
{
  "pool": ["yozakura-reverie", "arknights-babel-epic", "crimson-abyss", "abyss", "hyperspace-cinema", "retro-os-1995-ultimate", "retro-mirage", "cosmos-pro", "aurora-ethereal-pro", "flare"],
  "poolLength": 10,
  "totalThemes": 147,
  "gregorianHolidays": { "01-01": "holiday-01-01", "02-14": "holiday-02-14", "..." : "..." },
  "lunarHolidays": { "02-18": "holiday-l01-01", "..." : "..." },
  "directory": [{ "preset": "yozakura-reverie", "name": "🌸 Yozakura", "primary": "#ff8fa3", "..." : "..." }],
  "apiVersion": "v1"
}
```

### 社区主题投稿

```bash
curl -X POST https://themedist.netlify.app/api/v1/diy/submit.json \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "My Theme",
    "author": "Nickname",
    "cssVars": { "--color-primary": "#FF6B6B", "--color-bg": "#1a1a2e" },
    "customCss": "body { font-family: sans-serif; }",
    "extensions": [{ "type": "floating", "char": "✨" }],
    "tags": ["dark", "vibrant"]
  }'
```

必填字段：`name`、`author`、`cssVars`（必须包含 `--color-primary` 和 `--color-bg`）。
可选字段：`customCss`（最大 16KB）、`extensions`（最大 20 个，仅支持 `floating` 和 `decorative` 类型）、`clickEffect`（点击特效声明，详见 API 文档）、`tags`（最多 5 个）。

成功响应（201）：

```json
{
  "success": true,
  "theme": { "id": "abc12345", "name": "My Theme", ... },
  "warnings": ["不支持的类型 \"javascript\"，已自动移除。请改用 \"floating\" 或 \"decorative\"。"]
}
```

> **`warnings` 字段**：当提交的 extensions 包含不支持的类型（如 `"javascript"`）时，系统静默移除并在 `warnings` 中报告原因。不影响主题提交成功，但提醒用户扩展已被过滤。

主题提交后进入**审核队列**，管理员审核通过后发布至社区商店。

### 标签推荐

```bash
curl -X POST https://themedist.netlify.app/api/v1/diy/suggest-tags.json \
  -H 'Content-Type: application/json' \
  -d '{
    "cssVars": { "--color-primary": "#ff6b6b", "--color-bg": "#1a1a2e" },
    "customCss": "@keyframes drift { ... }",
    "extensions": [...],
    "presetName": "示例主题"
  }'
```

8 维度加权评分引擎，分析色彩（亮度/色相/多色协调）、字体（衬线/等宽/手写）、内容（中/英/日三语关键词）、结构（复杂度）、特效（动画/毛玻璃/扫描线/粒子）、Emoji 语义、WCAG 对比度、色调和谐度，覆盖 19 种标签（dark/light/warm/cool/vibrant/minimal/nature/tech/retro/holiday/space/ocean/animated/elegant/glass/seasonal/fantasy/industrial/community），返回最多 5 个带置信度和中文原因的标签建议。

响应（200）：

```json
{
  "tags": [
    { "tag": "dark", "confidence": 0.98, "reason": "背景亮度仅 0.01，属于深色主题" },
    { "tag": "warm", "confidence": 0.88, "reason": "主色色相 349° 位于暖色区间" },
    { "tag": "vibrant", "confidence": 0.74, "reason": "包含 3 个 @keyframes 动画" }
  ],
  "apiVersion": "v1"
}
```

### 社区主题列表（带标签筛选）

```bash
# 获取最新主题（分页）
curl "https://themedist.netlify.app/api/v1/diy/themes.json?sort=new&page=1&size=20"

# 按标签筛选
curl "https://themedist.netlify.app/api/v1/diy/themes.json?tag=dark"

# 获取最热主题
curl "https://themedist.netlify.app/api/v1/diy/themes.json?sort=hot"
```

查询参数：

| 参数 | 说明 | 默认值 |
|------|------|--------|
| `sort` | `new`（最新）/ `hot`（最热） | `new` |
| `page` | 页码 | `1` |
| `size` | 每页数量（最大 50） | `20` |
| `tag` | 按标签筛选（可选） | — |

### 社区主题点赞

```bash
curl -X POST https://themedist.netlify.app/api/v1/diy/like.json \
  -H 'Content-Type: application/json' \
  -d '{"id": "abc12345"}'
```

基于 IP + User-Agent + 客户端 UUID 三重去重，同一用户对同一主题只计一次。

### AI 生成主题

```bash
curl -X POST https://themedist.netlify.app/api/v1/ai/generate.json \
  -H 'Content-Type: application/json' \
  -d '{"description": "深色赛博朋克风，紫绿霓虹"}'
```

响应：

```json
{
  "name": "赛博霓虹",
  "cssVars": {
    "--color-primary": "#a78bfa",
    "--color-secondary": "#22d3ee",
    "--color-accent": "#f43f5e",
    "--color-bg": "#020617",
    "--color-surface": "#0a0a1a",
    "--color-text": "#e2e8f0",
    "--color-text-muted": "#64748b",
    "--color-border": "#1e293b"
  },
  "tags": ["dark", "tech", "vibrant"],
  "description": "AI 根据「深色赛博朋克风，紫绿霓虹」生成的配色方案",
  "generatedBy": "rule-engine"
}
```

> 推荐在提交页面使用客户端 DeepSeek 集成（自带 Key，浏览器直接调用 DeepSeek API），效果远优于规则引擎。详情见 [AI 主题生成](#ai-主题生成) 章节。

### 管理端接口

```bash
# 登录
curl -X POST https://themedist.netlify.app/api/v1/admin/login.json \
  -H 'Content-Type: application/json' \
  -d '{"account": "admin", "password": "your-password"}'

# 获取待审主题
curl https://themedist.netlify.app/api/v1/admin/review.json \
  -H 'Cookie: admin_session=...'

# 批量批准
curl -X POST https://themedist.netlify.app/api/v1/admin/review.json \
  -H 'Content-Type: application/json' \
  -H 'Cookie: admin_session=...' \
  -d '{"action": "approve", "ids": ["abc12345", "def67890"]}'

# Redis 健康检查
curl https://themedist.netlify.app/api/v1/admin/health.json
```

**健康检查响应：**
```json
{
  "redis": "connected",
  "pending": 6,
  "approved": 4,
  "apiVersion": "v1"
}
```

### 便捷工具接口

```bash
# Tailwind CSS 配置生成（含 RGB 通道 + <alpha-value> 支持）
curl https://themedist.netlify.app/api/v1/tailwind-config.json

# 今日主题调色盘 SVG 徽章（可嵌入 README / 博客）
curl https://themedist.netlify.app/api/v1/today/palette.svg

# 随机主题
curl https://themedist.netlify.app/api/v1/theme/random.json

# OG 社交分享卡片（1200×630 SVG）
curl https://themedist.netlify.app/api/v1/theme/yozakura-reverie/og.svg
```

### 高级功能接口 (NEW)

```bash
# W3C DTCG 设计令牌导出
curl https://themedist.netlify.app/api/v1/tokens.json

# 动态 Favicon
curl https://themedist.netlify.app/api/v1/today/favicon.svg

# 自动字体注入（Google Fonts @import）
curl https://themedist.netlify.app/api/v1/today/fonts.css

# 颜色相似度搜索
curl "https://themedist.netlify.app/api/v1/search/color.json?hex=ff8fa3&limit=10"

# 智能推荐引擎
curl https://themedist.netlify.app/api/v1/recommend/yozakura-reverie.json

# 趋势排行榜
curl https://themedist.netlify.app/api/v1/trending.json

# GitHub 动态徽章（作者统计）
curl https://themedist.netlify.app/api/v1/badge/username.svg

# AI 逆向描述（分析主题→中文描述）
curl -X POST https://themedist.netlify.app/api/v1/ai/describe.json \
  -H 'Content-Type: application/json' \
  -d '{"cssVars":{"--color-primary":"#ff8fa3","--color-bg":"#030108"}}'

# 匿名遥测上报
curl -X POST https://themedist.netlify.app/api/v1/telemetry/hit \
  -H 'Content-Type: application/json' \
  -d '{"themeId":"yozakura-reverie","host":"example.com"}'

# 自定义轮换池 — 创建
curl -X POST https://themedist.netlify.app/api/v1/pool/create.json \
  -H 'Content-Type: application/json' \
  -d '{"name":"My Pool","themeIds":["yozakura-reverie","abyss","flare"]}'

# 自定义轮换池 — 每日轮换查询
curl https://themedist.netlify.app/api/v1/pool/YOUR_POOL_ID.json
```

### 主题诊断与导出接口 (NEW)

```bash
# WCAG 无障碍诊断（对比度评估 + AA/AAA 合规检查）
curl https://themedist.netlify.app/api/v1/theme/yozakura-reverie/wcag.json

# Tailwind 风格色阶生成（50~950，含 primary/secondary/accent/bg）
curl https://themedist.netlify.app/api/v1/theme/yozakura-reverie/scale.json

# Shadcn UI 适配器（HSL 变量 + 前景色自动推断）
curl https://themedist.netlify.app/api/v1/theme/yozakura-reverie/export/shadcn.css

# 图片取色（K-means 聚类 + UI 语义映射，零原生依赖）
curl -X POST https://themedist.netlify.app/api/v1/extract-theme.json \
  -H 'Content-Type: application/json' \
  -d '{"imageUrl":"https://example.com/poster.jpg"}'

# Shiki / VS Code 代码高亮主题（TextMate Token 颜色映射）
curl https://themedist.netlify.app/api/v1/theme/yozakura-reverie/shiki.json

# 动态 SVG 背景纹理（主题色几何图案，可作 CSS background-image）
curl https://themedist.netlify.app/api/v1/today/pattern.css

# 天气粒子渲染脚本（云/雨/雪/太阳/闪电，自动定位 + 缓存）
curl https://themedist.netlify.app/api/v1/today/weather.js
```

### 环境感知接口 (NEW)

```bash
# 天气自适应主题（基于 IP 经纬度 + Open-Meteo 免费 API）
# 支持 ?lat=&lon= 查询参数覆盖 IP 检测，返回城市名 + 温度 + 天气类型
curl https://themedist.netlify.app/api/v1/weather-theme.json
curl "https://themedist.netlify.app/api/v1/weather-theme.json?lat=35.68&lon=139.76"

# 在线演示:
# /weather-demo — 天气感知演示页（浏览器定位 + 实时天气视觉渲染）
# /lab — 全场景 API 展厅（天气/纹理/高亮/缓动/WCAG 五合一联动演示）

# 系统状态覆盖主题（maintenance / mourning / incident）
curl "https://themedist.netlify.app/api/v1/status-override.json?status=maintenance"
```

### 查询参数

| 参数 | 适用于 | 说明 |
|------|--------|------|
| `?tz=America/New_York` | `today.json`, `today.css` | 按指定时区计算今日日期，如 `?tz=Asia/Shanghai` |
| `?overrides=--radii:0px;--font-body:monospace` | `today.json`, `today.css` | 微调 CSS 变量值，按 `;` 分隔，最多 20 对 |

---

## CSS 变量参考

所有变量由 `GET /api/v1/today.json` 的 `cssVars` 字段返回，在 CSS 中直接使用 `var(--xxx)` 引用：

```css
.my-card {
  background: var(--color-surface);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  border-radius: var(--radii);
  padding: var(--space-4);
  box-shadow: var(--shadow-md);
}

.glass-panel {
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
}
```

### 颜色（8 变量）

| 变量 | 语义 |
|------|------|
| `--color-primary` | 品牌主色 |
| `--color-secondary` | 辅色 |
| `--color-accent` | 强调色 |
| `--color-bg` | 页面背景 |
| `--color-surface` | 卡片/面板背景 |
| `--color-text` | 正文颜色 |
| `--color-text-muted` | 次要文字 |
| `--color-border` | 边框（基于 accent 推导的 rgba） |

### 排版（8 变量）

| 变量 | 说明 |
|------|------|
| `--font-heading` | 标题字体栈 |
| `--font-body` | 正文字体栈 |
| `--font-mono` | 等宽字体栈 |
| `--text-base` | 基础字号（clamp 流式） |
| `--text-lg` | 大号（base × 1.25） |
| `--text-xl` | 特大号（lg × 1.25） |
| `--text-2xl` | 超大号（xl × 1.25） |
| `--text-sm` | 小号（base / 1.25） |

### 间距与布局（9 变量）

| 变量 | 说明 |
|------|------|
| `--space-unit` | 基础间距单元（0.25rem） |
| `--space-1` ~ `--space-12` | 间距梯度（unit × 1/2/3/4/6/8/12） |
| `--radii` | 统一圆角（0.75rem） |
| `--content-max` | 内容最大宽度（72rem） |

### 视觉效果（8 变量）

| 变量 | 说明 |
|------|------|
| `--shadow-sm` / `--shadow-md` / `--shadow-lg` | 三级阴影 |
| `--glass-bg` / `--glass-blur` | 毛玻璃背景色和模糊值 |
| `--noise-opacity` | 噪点纹理透明度（0 = 关闭） |
| `--ambient-1` / `--ambient-2` | 氛围光球颜色 |

### RGB 通道变体

所有以 `--color-` 开头的 CSS 变量均自动附带 `-rgb` 通道变体，格式为逗号分隔的 `R, G, B`：

| 变量示例 | 值示例 |
|----------|--------|
| `--color-primary-rgb` | `66, 133, 244` |
| `--color-bg-rgb` | `15, 15, 41` |
| `--color-text-rgb` | `230, 230, 250` |
| `--color-border-rgb` | `66, 133, 244` |

### Tailwind CSS 集成

使用 RGB 通道变量配合 Tailwind 不透明度修饰符：

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: "rgb(var(--color-primary-rgb) / <alpha-value>)",
        secondary: "rgb(var(--color-secondary-rgb) / <alpha-value>)",
        accent: "rgb(var(--color-accent-rgb) / <alpha-value>)",
      },
    },
  },
};
```

或直接请求自动生成的配置：

```bash
curl https://themedist.netlify.app/api/v1/tailwind-config.json
```

### 暗色/亮色适配

`/api/v1/today.css` 自动根据今日主题的背景亮度输出 `@media (prefers-color-scheme: dark)` 或 `@media (prefers-color-scheme: light)` 适配块。
同时提供 `--color-bg-dark` / `--color-bg-light` / `--color-text-dark` / `--color-text-light` 便利变量。

---

## SDK / Web Component

ThemeDist 提供官方轻量化 Web Component `<themedist-runner>`，一行标签即可完成 CSS 变量注入、装饰渲染、缓存降级。

```html
<!-- 一行标签，全自动主题接入 -->
<themedist-runner api="/api/v1/today.json" save-shadow="true"></themedist-runner>
<script src="https://themedist.netlify.app/sdk.js" defer></script>
```

**特性：**
- **CSS 变量**注入全局 `:root`，全站自动适配
- **装饰元素**隔离在 Shadow DOM，防止样式/DOM 污染宿主页面
- **localStorage 缓存**，同日访问零网络开销
- **网络降级**，fetch 失败时自动使用过期缓存
- **XSS 安全**，`textContent` 设置字符，`<template>` 安全解析 HTML

---

## 天气粒子渲染

ThemeDist 提供独立的天气粒子渲染脚本，可通过 `<script src>` 引入，自动获取用户地理位置并渲染对应的天气视觉特效（云层/雨滴/雪花/太阳/闪电）。

```html
<!-- 一行引入，自动渲染天气粒子 -->
<script src="https://themedist.netlify.app/api/v1/today/weather.js" defer></script>
```

**特性：**
- **自动定位** — 浏览器 Geolocation API 优先，IP fallback
- **sessionStorage 缓存** — 30 分钟 TTL，减少 API 请求
- **prefers-reduced-motion** — 尊重系统无障碍设置
- **移动端自适应** — 减少粒子密度，降低性能开销
- **纯 CSS 动画** — 云 drift / 雨 fall / 雪 snowfall+sway / 太阳 rotate / 闪电 flash
- **DOM 安全** — `DocumentFragment` 批量插入，`textContent` 设置字符，零 innerHTML

---

## Extensions 扩展元素

`extensions` 是一个声明式装饰元素数组，每个元素无需执行脚本即可安全渲染。支持两种类型：

### `floating` — 浮动字符

通过 `document.createElement('div')` 创建，绝无 innerHTML。适合 emoji / 字符装饰：

```json
{ "type": "floating", "char": "🪷", "top": "20%", "left": "5%", "fontSize": "30px", "opacity": 0.3, "animation": "swing 4s ease-in-out infinite" }
```

| 字段 | 必填 | 限制 |
|------|------|------|
| `type` | 是 | `"floating"` |
| `char` | 是 | ≤ 4 个 Unicode 码点 |
| `top/left/right/bottom` | 否 | CSS 尺寸 (px/%/em/rem/vh/vw) |
| `fontSize` | 否 | CSS 尺寸 |
| `opacity` | 否 | 0.0 ~ 1.0，自动 clamp |
| `animation` | 否 | CSS animation 值，XSS 清洗 |
| `zIndex` | 否 | -1 ~ 99999 |

### `decorative` — 装饰 HTML

使用 `<template>` + `DocumentFragment` 安全解析，渲染前剥离 `on*` 事件、`<script>`、`<iframe>`、`javascript:` 协议：

```json
{ "type": "decorative", "html": "<div class=\"particle-layer\"><span class=\"sparkle\" style=\"left:12vw;animation-delay:-3s\"></span></div>" }
```

> **不支持 JavaScript 类型**：`"type": "javascript"` 因安全原因不被支持。提交时会被移除并在 API 响应的 `warnings` 中报告。请将 JS 逻辑转为 `decorative` HTML + `customCss` CSS 动画。

### 自动粒子生成

系统会从 `customCss` 中解析含 `animation` 的 CSS 类，自动生成 DOM 粒子元素（数量根据类名启发式决定：particle/dot/orb/bubble/spark/star → 20，float/drift/sway → 12，rain/snow/fall → 30，其他 → 8）。如已在 `extensions` 中手动声明该类元素，系统自动跳过以避免重复。

---

## 主题轮换策略

主题由 Astro SSR 端点 `src/pages/api/v1/today.json.ts` 根据服务器日期实时计算，无需定时构建。选择逻辑集中在一处，双平台完全一致。

选择优先级：

1. **农历节日优先** 🏮 — `OmniConfig.getThemeConfig('auto')` 运行时通过 `Lunar.fromDate()` 直接计算当前农历日期，匹配 35+ 农历节日（春节、元宵、端午、中秋、重阳等）
2. **公历节日其次** 📅 — 匹配元旦、情人节、Pi Day、圣诞等公历节日（来自 OmniConfig 配置）
3. **Crazy Thursday** 🍗 — 每周四的特殊覆盖主题
4. **社区主题轮换** 👥 — 约 30% 天数（每 3 天）从已审核社区主题池中按 `dayOfYear % count` 选中一个作为今日主题
5. **每日池兜底** 🎲 — 按 `dayOfYear % poolLength` 从日池主题中轮选

节日主题可附带 `customCss`（专属 CSS 动画）和 `extensions`（声明式装饰元素，如浮动 emoji、特效层等）。

### 农历节日处理流程

```
运行时 (Astro SSR — src/pages/api/v1/today.json.ts)
  └─ getDailyTheme() → OmniConfig.getThemeConfig('auto')
  └─ Lunar.fromDate(new Date()) → 获取当前农历月日
  └─ 遍历 config.holidays 中的 Lxx-xx 键进行匹配
  └─ 命中 → 返回对应农历节日主题（含 customCss、extensions）
```


---

## AI 主题生成

ThemeDist 提供两级 AI 主题生成能力，帮助用户快速创建配色方案。

### 客户端 DeepSeek 集成（推荐）

用户自带 DeepSeek API Key，在浏览器中直接调用 DeepSeek API，**Key 从不经过本服务器**：

```
用户输入描述 → 浏览器 fetch api.deepseek.com → 解析 JSON → 填入编辑器
```

- API Key 仅存储在 `localStorage` 中，隐私声明在 UI 中明确展示
- Key 格式校验（`sk-` 前缀），状态指示器显示已设置/未设置
- 使用 `deepseek-v4-flash` 模型，定制系统 prompt 输出结构化主题数据

### 服务端规则引擎（降级方案）

未设置 DeepSeek Key 时自动降级为内置规则引擎：
- 8 套预设色板（暗色/亮色/海洋/日落/森林/午夜/樱花/赛博）
- 基于关键词匹配（中英文，如"森林""ocean""赛博"）
- 文本长度哈希混入色相偏移，同一描述每次生成一致

---

## 主题分类与标签

所有主题携带预计算或用户指定的分类标签，支持按标签浏览筛选。

### 标签体系

| 标签 | 说明 | 来源 |
|------|------|------|
| `dark` / `light` | 深色/浅色模式 | 自动推断（背景亮度） |
| `warm` / `cool` | 暖色系/冷色系 | 自动推断（主色色相） |
| `vibrant` / `minimal` | 鲜艳/极简 | 自动推断（主色饱和度） |
| `holiday` | 节日主题 | 预设数据标记 |
| `community` | 社区投稿 | 自动标记 |
| `nature` / `tech` / `retro` | 自然/科技/复古 | 社区提交时指定或 AI 推断 |

### 社区主题标签

- 提交时可附带标签（通过 `tags: ["dark", "vibrant"]` 字段）
- 未指定标签时自动根据 CSS 变量推断
- 主题商店社区标签页支持按标签筛选

---

## 项目结构

```
themeDist/
├── .github/
│   └── workflows/
│       └── deploy.yml                  # GitHub Actions：定时（每月 1 号）+ 手动触发，构建并部署到 Netlify
├── astro.config.mjs                    # Astro 配置（SSR + ADAPTER 环境变量切换 Vercel/Netlify）
├── vercel.json                         # Vercel 部署 + CORS 头
├── netlify.toml                        # Netlify 部署 + CORS 头
├── package.json                        # 依赖与脚本
├── tsconfig.json                       # TypeScript 配置
├── public/
│   └── favicon.svg                     # 站点图标
├── docs/
│   └── agents/                         # 领域文档与工作流定义
└── src/
    ├── env.d.ts                        # Astro TypeScript 客户端类型引用
    ├── layouts/
    │   └── Layout.astro                # 全局布局：导航、氛围背景、主题注入、Toast 通知
    ├── lib/
    │   ├── redis.ts                    # Upstash Redis 封装（set/get/zadd/zrevrange 等，带优雅降级）
    │   ├── auth.ts                     # 管理员认证（Cookie 会话 + CSRF Token）
    │   ├── themes-db.ts               # 社区主题 CRUD（提交/审核/点赞/列表，Redis 持久化）
    │   ├── cache.ts                    # 内存缓存（today 2min / community 5min TTL，减少 Redis 穿透）
    │   └── fallback.ts                # 静态兜底主题注册表（Redis 全挂时使用）
    ├── middleware.ts                    # Astro 中间件（投稿/点赞滑动窗口限流）
    ├── pages/
    │   ├── index.astro                 # 首页：Hero、三步接入、功能展示、代码示例、智能天气氛围叠加
    │   ├── weather-demo.astro         # 天气感知演示页（浏览器定位 + 实时天气视觉渲染）
    │   ├── lab.astro                  # 全场景 API 展厅（5 模块联动演示）
    │   ├── theme-builder.astro         # 主题构建器：CSS 变量/自定义 CSS/Extensions 三栏编辑，实时校验，智能格式化，图片取色
    │   ├── theme-store.astro           # 主题商店：浏览/搜索/分类/标签筛选/社区标签页
    │   ├── submit.astro                # 社区投稿：三栏编辑器 + AI 生成（DeepSeek 客户端集成），extensions 实时校验 + 提交后 warnings
    │   ├── share.astro                 # 主题分享页：详情、点赞、复制链接、视口切换预览，iframe 沙箱 extensions 自动生成
    │   ├── admin/
    │   │   └── index.astro             # 管理后台：登录面板 + 审核列表（含扩展类型指示）
    │   └── api/
    │       ├── docs.astro
    │       ├── spec.astro
    │       └── v1/
    │           ├── today.json.ts           # ★ GET 今日主题（Astro SSR 动态端点，双平台统一入口）
    │           ├── today.css.ts            # ★ GET 今日主题 CSS（阻塞式 <link> 引入，消除 FOUC）
    │           ├── index-data.json.ts      # ★ 构建时数据快照（日池 ID、公历+农历节日映射、目录）
    │           ├── [param].ts              # GET 指定日期主题（/api/v1/date=MM-DD）
    │           ├── weather-theme.json.ts   # GET 天气自适应主题（双平台 geo + Open-Meteo）
    │           ├── status-override.json.ts # GET 系统状态覆盖（maintenance/mourning/incident）
    │           ├── tokens.json.ts          # GET W3C DTCG 设计令牌导出
    │           ├── tailwind-config.json.ts # GET Tailwind CSS 配置生成
    │           ├── trending.json.ts        # GET 趋势排行榜
    │           ├── extract-theme.json.ts   # POST 图片取色（K-means + UI 语义映射）
    │           ├── theme/
    │           │   ├── [preset].json.ts    # GET 指定预设/社区主题
    │           │   ├── random.json.ts      # GET 随机主题
    │           │   └── [id]/
    │           │       ├── og.svg.ts       # GET OG 社交分享卡片
    │           │       ├── wcag.json.ts    # GET WCAG 无障碍诊断
    │           │       ├── scale.json.ts   # GET 色阶生成
    │           │       ├── shiki.json.ts   # GET Shiki 代码高亮主题
    │           │       └── export/
    │           │           └── shadcn.css.ts # GET Shadcn UI 适配器
    │           ├── today/
    │           │   ├── palette.svg.ts      # GET 调色盘 SVG 徽章
    │           │   ├── favicon.svg.ts      # GET 动态 Favicon
    │           │   ├── fonts.css.ts        # GET 自动字体注入
    │           │   └── pattern.css.ts      # GET 动态 SVG 背景纹理
    │           ├── search/
    │           │   └── color.json.ts       # GET 颜色相似度搜索
    │           ├── recommend/
    │           │   └── [preset].json.ts    # GET 智能推荐引擎
    │           ├── badge/
    │           │   └── [username].svg.ts   # GET GitHub 动态徽章
    │           ├── telemetry/
    │           │   └── hit.ts              # POST 匿名遥测上报
    │           ├── pool/
    │           │   ├── create.json.ts      # POST 创建自定义轮换池
    │           │   └── [poolId].json.ts    # GET 轮换池每日查询
    │           ├── admin/
    │           │   ├── login.json.ts       # POST 登录/登出
    │           │   ├── review.json.ts      # GET 待审列表 / POST 批量审核
    │           │   └── health.json.ts      # GET Redis 健康状态
    │           ├── diy/
    │           │   ├── submit.json.ts      # POST 提交社区主题（含标签）
    │           │   ├── themes.json.ts      # GET 社区主题列表（分页 + 标签筛选）
    │           │   ├── theme.json.ts       # GET 单个社区主题
    │           │   └── like.json.ts        # POST 点赞（IP+UA+客户端UUID 三重去重）
    │           └── ai/
    │               └── generate.json.ts    # POST AI 主题生成（规则引擎，DeepSeek Key 由客户端直调）
    ├── api/
    │   └── index_config.js             # ★ 核心主题数据库：全部节日规则、日池主题、轮换逻辑（源自 OMNI-MATRIX）
    ├── themes/
    │   └── types.ts                    # 核心类型定义（ComposedTheme, ThemeExtension, ThemeTag）
    └── utils/
        ├── daily-theme.ts              # 统一导出入口（转发 omni-bridge 方法）
        ├── omni-bridge.ts              # ★ 唯一主题管道：OmniConfig/社区主题 → ComposedTheme 转换
        ├── color.ts                    # 颜色数学工具（hex↔RGB 转换、HSL、对比度、色插值）
        └── sanitize.ts                 # 输入净化（去 HTML 标签/CSS expression/@import/url()）
```

---

## 架构说明

### 单一主题管道

**OmniConfig（数据源）** — `src/api/index_config.js` 包含全部节日规则（公历 90+ 条 + 农历 35+ 条，含二十四节气）、日池主题（10 套）和轮换逻辑。源自独立项目 OMNI-MATRIX，以纯数据格式存储。

**ComposedTheme（统一输出）** — 所有主题（OmniConfig 预设、社区投稿、AI 生成）通过 `omni-bridge.ts` 转换为唯一的 `ComposedTheme` 格式，确保 API 输出的一致性和类型安全。无论来源，输出的 `cssVars`、`extensions`、`tags` 等字段结构完全对齐。

### 每日主题选择流程

```
GET /api/v1/today.json（Vercel + Netlify 统一路由）
  │
  └─ Astro SSR 端点: src/pages/api/v1/today.json.ts
       │
       ├─ 1. getDailyCommunityTheme()
       │     ├─ 检查 Redis 可用性
       │     ├─ dayOfYear % 3 === 2 → 从 td:themes:by_newest 选取社区主题
       │     └─ 否则 → null（不覆盖预设）
       ├─ 2. getDailyTheme()（OmniConfig.getThemeConfig('auto')）
       │     ├─ 通过 Lunar.fromDate() 检查农历节日
       │     ├─ 匹配公历节日（MM-DD）
       │     ├─ 星期四是 Thursday → Crazy Thursday 主题
       │     └─ 否则 → dailyPool[dayOfYear % poolLength] 日池轮换
       ├─ 3. 社区主题优先于预设（communityDaily || dailyTheme）
       ├─ 4. 获取完整目录（预设 20 + 社区 10）
       └─ 5. 返回 JSON（含 cssVars, directory, available 等）
              └─ 失败时 → 500 + JSON error
```

双端（Vercel / Netlify）运行完全相同的代码路径，主题选择结果一致。


### 社区主题生命周期

```
用户投稿 → status: pending（存入审核队列）
  → 管理员 approved → 进入公共池（by_newest + by_likes 有序集合）立即可见
  → 点赞数据实时同步至排行榜
  → 社区主题可被每日轮换选中（约 30% 天数）
```

点赞去重：基于 IP + User-Agent 前 64 字符 + 客户端 UUID（`localStorage` 持久化，首次访问生成）的三重哈希，存储于 Redis Set，确保同一用户对同一主题只计一次。NAT 环境下共享 IP 的用户因持有不同客户端 UUID，不会互相阻塞。

### 缓存策略

| 端点 | 浏览器 | CDN |
|------|--------|-----|
| `/api/v1/today.json` | 1 小时 (`max-age=3600`) | 24 小时 + 1h 降级 (`s-maxage=86400, stale-while-revalidate=3600`) |
| `/api/v1/theme/*.json`（预设） | 24 小时 | 365 天（`immutable`） |
| `/api/v1/theme/community-*.json` | 1 小时 (`max-age=3600`) | 不使用 CDN 缓存 |
| `/api/v1/index-data.json` | 1 小时 (`max-age=3600`) | 24 小时 (`s-maxage=86400`) |
| `/api/v1/today/weather.js` | 1 小时 (`max-age=3600`) | 24 小时 (`s-maxage=86400`) |
| `/api/v1/diy/theme.json?id=` | 5 分钟 (`max-age=300`) | 不使用 CDN 缓存 |
| `/api/v1/diy/themes.json` | 1 分钟 (`max-age=60`) | 不使用 CDN 缓存 |
| `/api/v1/diy/submit.json` | 不缓存（POST） | 不使用 CDN 缓存 |
| `/api/v1/diy/like.json` | 不缓存（POST） | 不使用 CDN 缓存 |
| `/api/v1/ai/generate.json` | 不缓存 | 不使用 CDN 缓存 |
| `/api/v1/admin/*` | 不缓存 | 不使用 CDN 缓存 |

### 客户端缓存

| 数据 | 存储 | TTL | 说明 |
|------|------|-----|------|
| 社区主题列表 | sessionStorage | 5 分钟 | 命中缓存时瞬间渲染，后台静默拉取 |
| 提交记录状态 | localStorage | 10 分钟 | 缓存 DB 状态（收录中/已过期） |
| 今日主题 | localStorage | 至次日 | 集成方推荐实现，含降级回退 |
| 点赞状态 | localStorage | 永久 | 客户端防重复点击 |

### 优雅降级

- **Redis 不可用** — 所有社区功能（投稿、点赞、审核、列表）返回空数据或 503，`dbAvailable` 标记为 `false`。客户端缓存确保已加载数据仍可见
- **每日主题分发** — Redis 不可用时社区主题自动降级为纯日池轮换 + 节假日逻辑，不影响 `/api/v1/today.json` 输出
- **AI 生成降级** — DeepSeek Key 未设置时自动降级为内置规则引擎，无需任何外部依赖
- **客户端降级** — 所有列表页优先展示缓存数据，请求失败时缓存内容持续可见

---

## 技术栈

| 层级 | 技术 |
|------|------|
| **框架** | [Astro](https://astro.build/) 6.x（SSR 模式） |
| **部署适配器** | `@astrojs/vercel` + `@astrojs/netlify`（通过 `ADAPTER` 环境变量切换） |
| **运行时** | Node.js（ES Modules） |
| **样式方案** | CSS 自定义属性（完全主题驱动，零 CSS 框架依赖） |
| **数据库** | [Upstash Redis](https://upstash.com/)（Serverless Redis，HTTPS REST API） |
| **AI 引擎** | DeepSeek API（用户自带 Key，浏览器端直调，不经服务器）或内置规则引擎 |
| **农历计算** | `lunar-javascript`（构建时使用，运行时通过预计算映射检索） |
| **ID 生成** | `nanoid`（8 字符） |
| **前端交互** | 原生 JavaScript（无前端框架依赖） |
| **部署目标** | Vercel + Netlify 双平台（Astro SSR 运行时计算） |
| **CI/CD** | GitHub Actions（push 时部署 Netlify，cron/manual 并行部署双平台）；Vercel Git Integration（push 自动部署） |

---

## 本地开发

### 前置条件

- Node.js 18+
- npm 9+
- （可选）Upstash Redis 实例（不配置时社区功能降级为只读）
- （可选）DeepSeek API Key（AI 生成使用，在页面中直接配置，服务器不需要）

### 安装与运行

```bash
git clone <repo-url>
cd themeDist

npm install
npm run dev
# 访问 http://localhost:4321
```

构建命令：

```bash
npm run build                    # 默认 Vercel 适配器
ADAPTER=netlify npm run build    # Netlify 适配器

npm run preview                  # 预览生产构建
```

### 本地环境变量

创建 `.env.local` 文件：

```env
ADMIN_ACCOUNT=admin
ADMIN_PASSWORD=your-secure-password
KV_REST_API_URL=https://xxx.upstash.io
KV_REST_API_TOKEN=your-token
KV_URL=rediss://default:your-token@xxx.upstash.io:6379
```

> `KV_URL` 与 `KV_REST_API_URL` / `KV_REST_API_TOKEN` 二选一即可，底层都是 Upstash Redis。

---

## 部署

项目支持 **Vercel** 和 **Netlify** 双平台同时部署，同一份 `main` 分支代码自动适配两个平台。

### 双平台适配原理

`astro.config.mjs` 通过环境变量 `ADAPTER` 在构建时切换适配器：

```js
const adapter = process.env.ADAPTER === 'netlify' ? netlify() : vercel();
```

- **Vercel**：默认（不设 `ADAPTER`），使用 `@astrojs/vercel`
- **Netlify**：构建时注入 `ADAPTER=netlify`，使用 `@astrojs/netlify`

### Vercel

1. 推送仓库到 GitHub
2. 在 Vercel 中导入项目（Framework 自动检测为 Astro）
3. 在 Vercel Dashboard 设置环境变量
4. `/api/v1/today.json` 由 Astro SSR 端点（`src/pages/api/v1/today.json.ts`）动态处理，Vercel 与 Netlify 使用相同的代码路径。

### Netlify

采用 **GitHub Actions 自动构建并部署**到 Netlify 的方式。`/api/v1/today.json` 由 Astro SSR 端点统一处理。

**触发方式：**

| 事件 | 说明 |
|------|------|
| `push` (branches: `main`) | 推送即部署 Netlify（与 Vercel Git Integration 同步） |
| `schedule` (cron: `0 0 1 * *`) | 每月 1 号 UTC 午夜重建（刷新农历映射、预渲染数据）并并行部署双平台 |
| `workflow_dispatch` | GitHub 页面手动触发，并行部署双平台 |

> 主题每日轮换由 Astro SSR 实时计算，无需定时重建。每月重建仅用于刷新农历→公历日期映射和预渲染快照。

**GitHub Secrets 配置：**

| Secret | 说明 | 获取位置 |
|--------|------|---------|
| `NETLIFY_AUTH_TOKEN` | Netlify 个人访问令牌 | Netlify User settings → Personal access tokens |
| `NETLIFY_SITE_ID` | Netlify 站点 ID | Netlify Site settings → General → Site ID |
| `URL` | 站点公开 URL | `https://your-site.netlify.app` |

**Netlify Runtime 环境变量：**

Netlify Dashboard → Site settings → Environment variables → 添加：

| 变量 | 必填 | 说明 |
|------|------|------|
| `KV_REST_API_URL` | 是 | Upstash Redis REST URL |
| `KV_REST_API_TOKEN` | 是 | Upstash Redis 访问令牌 |
| `ADMIN_ACCOUNT` | 是 | 管理员用户名 |
| `ADMIN_PASSWORD` | 是 | 管理员密码 |
| `URL` | 是 | 站点公开 URL |

### 环境变量对照

| 变量 | Vercel | Netlify | 本地开发 |
|------|--------|---------|---------|
| `ADMIN_ACCOUNT` | 手动设置 | 手动设置 | `.env.local` |
| `ADMIN_PASSWORD` | 手动设置 | 手动设置 | `.env.local` |
| `URL` | 手动设置 | 手动设置 | 不强制 |
| `KV_REST_API_URL` | Vercel KV 自动注入 | 手动设置 | `.env.local` |
| `KV_REST_API_TOKEN` | Vercel KV 自动注入 | 手动设置 | `.env.local` |
| `OPENAI_API_KEY` | 可选（服务端降级用） | 可选（服务端降级用） | `.env.local`（可选） |

> **注意**：Vercel KV 本质是 Upstash Redis。Netlify 上需手动设置 `KV_REST_API_URL` 和 `KV_REST_API_TOKEN`，值与 Vercel 自动注入的 `KV_REST_API_URL` / `KV_REST_API_TOKEN` 一致。代码同时兼容 `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` 命名（优先级更高）。
>
> **AI 密钥说明**：`OPENAI_API_KEY` 仅作为服务端规则引擎的增强备选，非必需。推荐用户在提交页面使用客户端 DeepSeek 集成（自带 Key，浏览器直调 DeepSeek API，不经本服务器）。

---

## 未来计划

| 功能 | 说明 | 状态 |
|------|------|------|
| **社区主题纳入每日轮换池** | 社区主题有机会被 `/api/v1/today.json` 选中（约 30% 天数） | ✅ 已完成 |
| **社区主题投稿与审核** | 投稿后进入待审队列，管理员审核通过后发布 | ✅ 已完成 |
| **XSS 安全防护** | CSS/HTML 注入过滤（@import/url()/expression/事件处理器），声明式扩展渲染 | ✅ 已完成 |
| **CSRF 保护** | 管理员写操作需 Double Submit Cookie 校验 | ✅ 已完成 |
| **主题分类与标签** | 支持为主题添加标签（暗色/亮色/节日/极简等），按分类浏览 | ✅ 已完成 |
| **AI 辅助主题生成** | 根据文字描述，通过 DeepSeek（客户端直调）或规则引擎生成主题 | ✅ 已完成 |
| **客户端缓存优化** | sessionStorage（5min TTL）+ localStorage（10min TTL）减少重复请求 | ✅ 已完成 |
| **LIVE SENSING 沙箱** | 提交页 16:9 比例全屏沙箱实时预览 | ✅ 已完成 |
| **双平台同步部署** | 一套代码自动部署 Vercel + Netlify 双平台 | ✅ 已完成 |
| **农历节日支持** | 35+ 农历节日，OmniConfig 运行时通过 Lunar.fromDate() 计算 | ✅ 已完成 |
| **系统监控台** | themedist-monitor 独立监控站点，11 个 API 端点覆盖状态/安全/告警/拨测/徽章 | ✅ 已完成 |
| **Shadcn UI 适配器** | HSL 变量转换 + 前景色自动推断 | ✅ 已完成 |
| **WCAG 无障碍诊断** | 对比度评估 + AA/AAA 合规检查 | ✅ 已完成 |
| **色阶生成** | 黑白插值法 Tailwind 风格 50~950 色阶 | ✅ 已完成 |
| **天气自适应主题** | Open-Meteo 免费 API + IP 地理位置 | ✅ 已完成 |
| **系统状态覆盖** | maintenance / mourning / incident 主题覆盖 | ✅ 已完成 |
| **图片取色 API** | K-means 聚类提取 + UI 语义映射，纯 JS 零原生依赖 | ✅ 已完成 |
| **Shiki 代码高亮主题** | TextMate Token 颜色映射，VS Code / Shiki 兼容 | ✅ 已完成 |
| **动态 SVG 纹理** | 主题色生成几何图案 CSS background-image | ✅ 已完成 |
| **全场景 API 展厅** | /lab 页面，5 模块联动演示 | ✅ 已完成 |
| **RSS / Webhook 通知** | 每日主题更新后推送通知 | 待规划 |
| **多管理员支持** | 审核权限分离，支持多个管理员账号协同操作 | 待规划 |
| **主题使用统计** | 各主题被 API 请求的次数、点赞趋势等可视化数据 | 待规划 |
| **设计令牌导出** | W3C DTCG 规范 JSON 导出 | ✅ 已完成 |
| **动态 Favicon** | 主色 SVG 图标 | ✅ 已完成 |
| **颜色相似度搜索** | RGB 欧几里得距离排序 | ✅ 已完成 |
| **智能推荐引擎** | Jaccard + 颜色距离加权 | ✅ 已完成 |
| **匿名遥测** | HyperLogLog + Sorted Set | ✅ 已完成 |
| **趋势排行榜** | 热度聚合 Top 20 | ✅ 已完成 |
| **自定义轮换池** | 创建/轮换双端点 | ✅ 已完成 |
| **自动字体注入** | Google Fonts @import | ✅ 已完成 |
| **GitHub 动态徽章** | shields.io 风格 | ✅ 已完成 |
| **AI 逆向描述** | CSS→中文风格分析 | ✅ 已完成 |
| **API 速率限制** | 投稿/点赞接口滑动窗口限流（投稿 3次/分钟，点赞 10次/分钟），超限 429 | ✅ 已完成 |
| **Extensions 类型支持** | 支持 `floating`（浮动字符）和 `decorative`（装饰 HTML），`javascript` 类型拒绝并返回 warnings | ✅ 已完成 |
| **智能格式化** | theme-builder 各编辑器独立格式化按钮，智能检测当前 tab 格式化对应内容 | ✅ 已完成 |
| **Extensions 实时校验** | submit + theme-builder 两端实时检测不支持类型并提示，提交后 warnings 展示 | ✅ 已完成 |
| **存储格式归一化** | `extensions` 字段统一为 `null` 或数组（不再出现 `undefined`），JSON 始终完整 | ✅ 已完成 |
| **渲染一致性** | share 页 iframe、首页 Apply、theme-builder 预览、submit 预览四路径 extensions 渲染逻辑统一 | ✅ 已完成 |
| **SDK / Web Component** | 官方轻量化 `<themedist-runner>` 自定义元素，Shadow DOM 隔离装饰，一行标签接入 | ✅ 已完成 |
| **Tailwind CSS 原生适配** | RGB 通道变量 + `/api/v1/tailwind-config.json` 一键生成 Tailwind 配置 | ✅ 已完成 |
| **暗色/亮色协同适配** | `/api/v1/today.css` 自动输出 `@media (prefers-color-scheme)` 适配块 | ✅ 已完成 |
| **时区感知** | 支持 `?tz=America/New_York` 查询参数，按目标时区计算今日主题 | ✅ 已完成 |
| **主题参数覆盖** | 支持 `?overrides=--radii:0px` 查询参数，微调 CSS 变量 | ✅ 已完成 |
| **调色盘 SVG 徽章** | `/api/v1/today/palette.svg` 返回可嵌入 README 的动态配色徽章 | ✅ 已完成 |
| **OG 社交分享卡片** | `/api/v1/theme/[id]/og.svg` 返回 1200×630 主题展示卡片 | ✅ 已完成 |
| **随机主题接口** | `/api/v1/theme/random.json` 从全池随机返回主题 | ✅ 已完成 |

---

## 许可证

本项目基于 **GNU General Public License v3.0 (GPL-3.0)** 发布。详见 [LICENSE](LICENSE) 文件。

Copyright (C) 2026 Tony
