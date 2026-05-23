# ThemeDist

**每日轮换的主题 CSS 变量分发服务** — 一个 GET 请求，整套网站视觉主题。

ThemeDist 是基于 Astro SSR 的主题分发平台，通过 **OmniConfig 主题数据库**（~6500 行，200+ 预设主题 + 227+ 节日）配合 **5 组可插拔主题部件**（颜色、排版、间距、壁纸、视觉效果），每日自动计算并输出完整的 CSS 自定义属性集。同时提供主题商店、在线构建器、社区投稿与审核、AI 辅助生成、主题标签分类等完整功能。

支持 **Vercel + Netlify** 双平台部署，一份代码，同时运行。

---

## 目录

- [快速开始](#快速开始)
- [功能特性](#功能特性)
- [AI 主题生成](#ai-主题生成)
- [主题分类与标签](#主题分类与标签)
- [API 使用](#api-使用)
- [CSS 变量参考](#css-变量参考)
- [主题轮换策略](#主题轮换策略)
- [项目结构](#项目结构)
- [技术栈](#技术栈)
- [本地开发](#本地开发)
- [部署](#部署)
  - [Vercel](#vercel)
  - [Netlify（GitHub Actions）](#netlifygithub-actions)
  - [环境变量对照](#环境变量对照)
- [架构说明](#架构说明)
- [未来计划](#未来计划)
- [许可证](#许可证)

---

## 快速开始

在你的网站中引入今日主题：

```html
<script>
fetch('/api/today.json')
  .then(r => r.json())
  .then(theme => {
    Object.entries(theme.cssVars).forEach(([k, v]) => {
      document.documentElement.style.setProperty(k, v);
    });
  });
</script>
```

完整集成方案（含缓存、降级、节日特效）：

```javascript
(async () => {
  const today = new Date().toISOString().slice(0, 10);
  const cached = JSON.parse(localStorage.getItem('td') || 'null');
  if (cached?.date === today) return applyTheme(cached);

  const res = await fetch('https://your-domain.com/api/today.json');
  const t = await res.json();
  const data = { date: t.date, cssVars: t.cssVars, customCss: t.customCss, exts: t.extensions };
  localStorage.setItem('td', JSON.stringify(data));
  applyTheme(data);
})().catch(() => {
  const fallback = JSON.parse(localStorage.getItem('td') || 'null');
  if (fallback) applyTheme(fallback);
});

function applyTheme(d) {
  Object.entries(d.cssVars).forEach(([k, v]) => document.documentElement.style.setProperty(k, v));
  if (d.customCss) {
    const s = document.createElement('style');
    s.textContent = d.customCss;
    document.head.appendChild(s);
  }
  if (d.exts) {
    d.exts.forEach(e => {
      if (e.type === 'html') document.body.insertAdjacentHTML('beforeend', e.content);
    });
  }
}
```

---

## 功能特性

### 核心功能

- **每日自动轮换** — 200+ 预设主题 + 227+ 节日覆盖 + 社区主题轮换（约 30% 天数），通过 Vercel Cron Job / GitHub Actions 定时触发每日 UTC 午夜重建
- **社区主题纳入每日池** — 审核通过的社区主题有机会被 `/api/today.json` 选中（每 3 天约 1 天），出现在每日分发中
- **农历节日支持** — 基于 `lunar-javascript` 实现，涵盖春节、中秋、端午、重阳、元宵等中国传统农历节日及公历节日
- **RESTful API** — `GET /api/today.json` 返回完整主题数据；所有接口支持 CORS 跨域
- **CDN 友好缓存** — 浏览器 1h / CDN 24h（今日主题），365 天不可变缓存（预设主题端点）
- **CSS 变量体系** — 34 个语义化 CSS 自定义属性（颜色 8 + 排版 8 + 间距 10 + 效果 6 + 氛围 2），覆盖完整 UI 语义
- **双平台部署** — Vercel + Netlify 同时分发，同一份代码自动适配
- **优雅降级** — Redis 不可用时社区功能自动降级为只读，站点核心功能不受影响

### 主题系统

- **双层数据模型** — OmniConfig（纯数据层，6500+ 行节日/主题规则）→ ComposedTheme（运行时层，完整的 CSS 变量展开）
- **5 组可插拔部件** — Color Palette / Typography / Spacing & Shape / Wallpaper / Visual Effects，各部件独立定义默认值与生成逻辑
- **5 套季节预设** — Spring Blossom / Summer Vibes / Autumn Harvest / Winter Frost / Midnight
- **Crazy Thursday** — 每周四自动切换特殊主题
- **节日装饰扩展** — 节日主题可附带自定义 CSS 动画和 HTML 装饰片段
- **主题分类与标签** — 预设主题自动推断标签（暗色/亮色/暖色/冷色/鲜艳/极简），社区主题支持提交时指定标签，按标签浏览筛选

### 用户端页面

- **主题商店（Theme Store）** — 浏览、搜索、按分类/色温/标签筛选所有主题（预设 + 社区），社区主题支持按暗色/亮色/暖色/冷色/鲜艳/极简/自然/科技标签筛选，高亮今日主题
- **主题构建器（Theme Builder）** — 实时编辑 CSS 变量 JSON、注入自定义 CSS、在预设间切换，一键复制应用
- **社区投稿（Submit）** — 粘贴 CSS 变量 JSON，或使用 AI 辅助生成主题，提交自定义主题，管理员审核后进入公共池
- **AI 主题生成** — 输入文字描述，使用 DeepSeek（用户自带 Key，客户端直接调用）或内置规则引擎生成完整 CSS 变量主题
- **主题分享页（Share）** — 社区主题详情展示，支持点赞、复制链接、一键应用

### 管理端

- **Cookie 认证** — 单管理员登录，HttpOnly + SameSite strict
- **审核面板** — 待审主题列表，支持批量批准/拒绝，实时待审数量
- **点赞去重** — 基于 IP + User-Agent 哈希，Redis Set 防重复点赞

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
- 使用 `deepseek-chat` 模型，定制系统 prompt 输出结构化主题数据

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

## API 使用

详细文档请访问部署后的 `/api/docs` 页面。以下为概览：

### 获取今日主题

```bash
curl https://your-domain.com/api/today.json
```

**响应示例：**

```json
{
  "date": "2026-05-23",
  "generatedAt": "2026-05-23T00:00:00.000Z",
  "preset": "holiday-l05-05",
  "presetName": "Dragon Boat Festival (L05-05)",
  "dailyIsCommunity": false,
  "cssVars": {
    "--color-primary": "#C84B31",
    "--color-secondary": "#2D6A4F",
    "--color-accent": "#FFB347",
    "--color-bg": "#1A1410",
    "--color-surface": "#2D2218",
    "--color-text": "#F5E6D3",
    "--color-text-muted": "#B8A088",
    "--color-border": "rgba(255,179,71,0.18)",
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
    "--ambient-1": "#C84B31",
    "--ambient-2": "#FFB347"
  },
  "customCss": ".theme-dragon-boat { /* ... */ }",
  "extensions": [
    { "type": "html", "content": "<div class='zongzi-left'>...</div>" }
  ],
  "logoText": "🐉",
  "logoColors": ["#C84B31", "#FFB347"],
  "available": 248,
  "directory": [
    { "preset": "spring", "name": "Spring Blossom", "primary": "#ec4899", "accent": "#10b981", "logoText": null }
  ]
}
```

新增字段：
- `dailyIsCommunity` — `true` 表示今日主题来自社区投稿

### 获取指定主题

```bash
# 获取预设主题
curl https://your-domain.com/api/theme/midnight.json

# 获取社区主题
curl https://your-domain.com/api/theme/community-abc12345.json
```

预设主题返回 365 天不可变缓存头；社区主题返回 1 小时缓存。

### 社区主题投稿

```bash
curl -X POST https://your-domain.com/api/diy/submit.json \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "My Theme",
    "author": "Nickname",
    "cssVars": { "--color-primary": "#FF6B6B", "--color-bg": "#1a1a2e" },
    "customCss": "body { font-family: sans-serif; }",
    "tags": ["dark", "vibrant"]
  }'
```

必填字段：`name`, `author`, `cssVars`（必须包含 `--color-primary` 和 `--color-bg`）。
可选字段：`customCss`, `tags`（最多 5 个标签）。

### 社区主题列表（带标签筛选）

```bash
# 获取最新主题（分页）
curl https://your-domain.com/api/diy/themes.json?sort=new&page=1&size=20

# 按标签筛选
curl https://your-domain.com/api/diy/themes.json?tag=dark

# 获取最热主题
curl https://your-domain.com/api/diy/themes.json?sort=hot
```

查询参数：
- `sort` — `new`（最新，默认）或 `hot`（最热）
- `page` — 页码（默认 1）
- `size` — 每页数量（默认 20，最大 50）
- `tag` — 按标签筛选（可选）

### AI 生成主题

```bash
curl -X POST https://your-domain.com/api/ai/generate.json \
  -H 'Content-Type: application/json' \
  -d '{
    "description": "深色赛博朋克风，紫绿霓虹"
  }'
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
curl -X POST https://your-domain.com/api/admin/login.json \
  -H 'Content-Type: application/json' \
  -d '{"account": "admin", "password": "your-password"}'

# 获取待审主题
curl https://your-domain.com/api/admin/review.json \
  -H 'Cookie: admin_session=...'

# 批量批准
curl -X POST https://your-domain.com/api/admin/review.json \
  -H 'Content-Type: application/json' \
  -H 'Cookie: admin_session=...' \
  -d '{"action": "approve", "ids": ["abc12345", "def67890"]}'
```

---

## CSS 变量参考

所有变量由 `GET /api/today.json` 的 `cssVars` 字段返回，在 CSS 中直接使用 `var(--xxx)` 引用：

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

### 间距与布局（10 变量）

| 变量 | 说明 |
|------|------|
| `--space-unit` | 基础间距单元（0.25rem） |
| `--space-1` ~ `--space-12` | 间距梯度（unit × 1/2/3/4/6/8/12） |
| `--radii` | 统一圆角（0.75rem） |
| `--content-max` | 内容最大宽度（72rem） |

### 视觉效果（6 变量）

| 变量 | 说明 |
|------|------|
| `--shadow-sm` / `--shadow-md` / `--shadow-lg` | 三级阴影 |
| `--glass-bg` / `--glass-blur` | 毛玻璃背景色和模糊值 |
| `--noise-opacity` | 噪点纹理透明度（0 = 关闭） |

### 氛围背景（2 变量）

| 变量 | 说明 |
|------|------|
| `--ambient-1` | 氛围光球 1 颜色 |
| `--ambient-2` | 氛围光球 2 颜色 |

---

## 主题轮换策略

每天 UTC 午夜，定时任务触发站点重建。主题选择逻辑（由 `src/utils/omni-bridge.ts` + `src/api/index_config.js` 实现）：

1. **农历节日优先** 🏮 — 基于 `lunar-javascript` 计算当日农历，匹配春节/中秋/端午/清明/重阳等 20+ 传统节日
2. **公历节日其次** 📅 — 匹配元旦/情人节/Pi Day/圣诞等 200+ 公历节日
3. **Crazy Thursday** 🍗 — 每周四的特殊覆盖主题
4. **社区主题轮换** 👥 — 以上均不命中时，约 30% 天数（每 3 天）从已审核社区主题池中按 `dayOfYear % count` 选中一个作为今日主题
5. **每日池兜底** 🎲 — 以上均不命中时，按 `dayOfYear % poolLength` 从 200+ 通用主题池中轮选

节日主题可附带 `.customCss`（专属 CSS 动画）和 `.extensions`（HTML 装饰片段，如春节灯笼、中秋月饼等）。

---

## 项目结构

```
themeDist/
├── .github/
│   └── workflows/
│       └── deploy.yml              # GitHub Actions：Netlify 自动构建与部署
├── astro.config.mjs                # Astro 配置（SSR + 条件适配器，Vercel/Netlify 自动切换）
├── vercel.json                     # Vercel 部署 + Cron Job + CORS 头
├── netlify.toml                    # Netlify 部署配置 + 定时构建 + CORS 头
├── package.json                    # 依赖（含双适配器）与脚本
├── tsconfig.json                   # TypeScript 配置
├── .env.local                      # 本地开发环境变量模板
├── public/
│   └── wallpapers/                 # 壁纸图片（可扩展）
├── docs/
│   └── agents/                     # 领域文档与工作流定义
└── src/
    ├── api/
    │   ├── index_config.js         # ★ 核心主题数据库：6500+ 行，全部节日规则、日池主题、轮换逻辑（源自 OMNI-MATRIX）
    │   ├── theme.js                # 遗留 Vercel handler（未使用）
    │   └── theme/config.js         # 遗留 Vercel handler（未使用）
    ├── layouts/
    │   └── Layout.astro            # 全局布局：导航、氛围背景、主题注入、字体加载
    ├── lib/
    │   ├── redis.ts                # Upstash Redis 封装（set/get/zadd/zrevrange 等，带优雅降级）
    │   ├── auth.ts                 # 管理员认证（Cookie 会话，HttpOnly）
    │   └── themes-db.ts            # 社区主题 CRUD（提交/审核/点赞/列表，Redis 持久化，含标签）
    ├── pages/
    │   ├── index.astro             # 首页：Hero、三步接入、功能展示、代码示例
    │   ├── theme-builder.astro     # 主题构建器：实时编辑 CSS 变量、预设切换、预览
    │   ├── theme-store.astro       # 主题商店：浏览/搜索/分类/标签筛选/社区标签页
    │   ├── submit.astro            # 社区投稿：JSON 编辑器 + AI 生成（DeepSeek 客户端集成）
    │   ├── share.astro             # 主题分享页：详情、点赞、复制链接
    │   ├── admin/
    │   │   └── index.astro         # 管理后台：登录面板 + 审核列表
    │   └── api/
    │       ├── today.json.ts               # GET 今日主题（核心端点，含社区轮换）
    │       ├── docs.astro                  # API 交互式文档（支持双平台动态域名）
    │       ├── spec.astro                  # 旧文档 → /api/docs 301 转发
    │       ├── theme/[preset].json.ts      # GET 指定预设/社区主题
    │       ├── admin/
    │       │   ├── login.json.ts           # POST 登录/登出
    │       │   └── review.json.ts          # GET 待审列表 / POST 批量审核
    │       ├── diy/
    │       │   ├── submit.json.ts          # POST 提交社区主题（含 tags）
    │       │   ├── themes.json.ts          # GET 社区主题列表（分页 + 标签筛选）
    │       │   ├── theme.json.ts           # GET 单个社区主题
    │       │   └── like.json.ts            # POST 点赞（IP+UA 去重）
    │       └── ai/
    │           └── generate.json.ts        # POST AI 主题生成（规则引擎，DeepSeek Key 由客户端直调）
    ├── themes/
    │   ├── types.ts                # 核心类型定义（ThemeTag, ThemePart, ThemePreset, ComposedTheme）
    │   ├── registry.ts             # 主题部件注册中心
    │   ├── presets/index.ts        # 5 套季节预设定义
    │   └── parts/
    │       ├── colors.ts           # 颜色部件（8 个 CSS 变量）
    │       ├── typography.ts       # 排版部件（Modular Scale）
    │       ├── spacing.ts          # 间距部件（基准 + 梯度）
    │       ├── wallpaper.ts        # 壁纸部件（URL + blend + opacity）
    │       └── effects.ts          # 视觉效果部件（阴影/毛玻璃/噪点）
    └── utils/
        ├── daily-theme.ts          # 统一导出入口（转发 omni-bridge 方法）
        ├── omni-bridge.ts          # ★ 核心桥接：OmniConfig → ComposedTheme 转换（含标签推断、社区主题轮换查询）
        └── theme-composer.ts       # 主题合成器：部件 + 预设 → 完整 ComposedTheme
```

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
| **农历计算** | `lunar-javascript` |
| **ID 生成** | `nanoid`（8 字符） |
| **前端交互** | 原生 JavaScript（无前端框架依赖） |
| **部署目标** | Vercel + Netlify 双平台 |
| **CI/CD** | GitHub Actions（Netlify 自动构建）；Vercel Git Integration（自动部署） |
| **定时任务** | Vercel Cron Job / GitHub Actions Scheduled Workflow（每日 UTC 午夜） |

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
npm run build            # 默认 Vercel 适配器
ADAPTER=netlify npm run build   # Netlify 适配器

npm run preview          # 预览生产构建
```

### 本地环境变量

创建 `.env.local` 文件：

```env
URL=http://localhost:4321
ADMIN_ACCOUNT=admin
ADMIN_PASSWORD=your-secure-password
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token
```

> `OPENAI_API_KEY` 为可选变量，仅服务端规则引擎降级时使用。推荐用户使用客户端 DeepSeek 集成（详见 [AI 主题生成](#ai-主题生成)）。

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
4. 部署后 `vercel.json` 中的 Cron Job 自动生效

`vercel.json` 关键配置：

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "astro",
  "crons": [{ "path": "/api/today.json", "schedule": "0 0 * * *" }]
}
```

### Netlify（GitHub Actions）

采用 **GitHub Actions 自动构建并部署**到 Netlify 的方式。

**触发方式：**

| 事件 | 说明 |
|------|------|
| `push` 到 `main` | 每次提交自动构建部署 |
| 定时 `0 0 * * *` | 每日 UTC 午夜自动重建（主题轮换） |
| `workflow_dispatch` | GitHub 页面手动触发 |

**GitHub Secrets 配置：**

前往 GitHub 仓库 → Settings → Secrets and variables → Actions → 添加：

| Secret | 说明 | 获取位置 |
|--------|------|---------|
| `NETLIFY_AUTH_TOKEN` | Netlify 个人访问令牌 | Netlify User settings → Personal access tokens |
| `NETLIFY_SITE_ID` | Netlify 站点 ID | Netlify Site settings → General → Site ID |
| `URL` | 站点公开 URL | `https://your-site.netlify.app` |

**Netlify Runtime 环境变量：**

Netlify Dashboard → Site settings → Environment variables → 添加（scope 选择 **All scopes** 或至少 **Functions**）：

| 变量 | 必填 | 说明 |
|------|------|------|
| `UPSTASH_REDIS_REST_URL` | 是 | Upstash Redis REST URL |
| `UPSTASH_REDIS_REST_TOKEN` | 是 | Upstash Redis 访问令牌 |
| `ADMIN_ACCOUNT` | 是 | 管理员用户名 |
| `ADMIN_PASSWORD` | 是 | 管理员密码 |
| `URL` | 是 | 站点公开 URL |

### 环境变量对照

| 变量 | Vercel | Netlify | 本地开发 |
|------|--------|---------|---------|
| `URL` | 手动设置 | 手动设置 | `.env.local` |
| `ADMIN_ACCOUNT` | 手动设置 | 手动设置 | `.env.local` |
| `ADMIN_PASSWORD` | 手动设置 | 手动设置 | `.env.local` |
| `UPSTASH_REDIS_REST_URL` | 手动设置（或使用 Vercel KV） | 手动设置 | `.env.local` |
| `UPSTASH_REDIS_REST_TOKEN` | 手动设置（或使用 Vercel KV） | 手动设置 | `.env.local` |
| `KV_REST_API_URL` | Vercel KV 自动注入 | 不适用 | 不适用 |
| `KV_REST_API_TOKEN` | Vercel KV 自动注入 | 不适用 | 不适用 |
| `OPENAI_API_KEY` | 可选（服务端降级用） | 可选（服务端降级用） | `.env.local`（可选） |

> **注意**：Vercel KV 本质是 Upstash Redis。Netlify 上需设置 `UPSTASH_REDIS_REST_URL` 和 `UPSTASH_REDIS_REST_TOKEN`，值与 Vercel KV 的 `KV_REST_API_URL` / `KV_REST_API_TOKEN` 一致。
>
> **AI 密钥说明**：`OPENAI_API_KEY` 仅作为服务端规则引擎的增强备选，非必需。推荐用户在提交页面使用客户端 DeepSeek 集成（自带 Key，浏览器直调 DeepSeek API，不经本服务器）。

---

## 架构说明

### 双层主题模型

1. **OmniConfig（配置层）** — `src/api/index_config.js`（~6500 行）是独立的主题数据库，包含全部节日规则、200+ 日池主题和轮换逻辑。源自独立项目 OMNI-MATRIX，以纯数据格式存储，`getThemeConfig(strategy, date)` 为核心入口。

2. **ComposedTheme（运行时层）** — TypeScript 类型化的主题表示（`src/themes/types.ts`），通过 `omni-bridge.ts` 从 OmniConfig 原始数据转换为前端可消费的 CSS 变量展开结果。新增 `tags` 和 `ThemeTag` 类型支持分类。

### 部件系统

除了 OmniConfig 数据源，项目还维护一套独立的**可插拔主题部件系统**（`src/themes/parts/`），支持通过 5 组部件 + 5 套预设定义主题，由 `theme-composer.ts` 合成。这套系统与 OmniConfig 并行存在，主要用于首页/主题商店/构建器的界面展示。

### 社区主题纳入每日轮换

```
getDailyCommunityTheme()
  → 检查 Redis 是否就绪
  → 获取已审核社区主题数量
  → dayOfYear % 3 === 2 时（约 30% 天数）选中社区主题
  → dayOfYear % count 确定具体主题
  → 从 Redis 加载并转换为 ComposedTheme
  → 返回作为今日主题 / null（兜底每日池）
```

### 标签推断

预设主题通过 `inferTags()` 自动分析颜色属性：
- **亮度** → dark / light（背景色 luminance < 0.3）
- **色相** → warm / cool（主色 hue 区间）
- **饱和度** → vibrant / minimal（饱和度阈值 0.5）
- **类型标记** → holiday（节日主题）

社区主题优先使用提交时指定的标签，未指定时通过 `inferTagsFromVars()` 自动推断。

### 缓存策略

| 端点 | 浏览器 | CDN |
|------|--------|-----|
| `/api/today.json` | 1 小时 (`max-age=3600`) | 24 小时 (`s-maxage=86400`) |
| `/api/theme/*.json`（预设） | 24 小时 | 365 天（`immutable`） |
| `/api/theme/*.json`（社区） | 1 小时 | 不使用 CDN 缓存 |
| `/api/diy/*` | 1 分钟或不缓存 | 不使用 CDN 缓存 |
| `/api/ai/generate.json` | 不缓存 | 不使用 CDN 缓存 |
| `/api/admin/*` | 不缓存 | 不使用 CDN 缓存 |

### 优雅降级

- **Redis 不可用时** — 所有社区功能（投稿、点赞、审核、列表）返回空数据或 503，`dbAvailable` 标记为 `false`。页面显示相应降级提示，不会崩溃。
- **每日主题分发与 Redis 完全解耦** — 每日主题纯靠 OmniConfig 静态数据，Redis 故障不影响 `/api/today.json` 和首页渲染。
- **AI 生成降级** — DeepSeek Key 未设置时自动降级为内置规则引擎，无需任何外部依赖。
- **客户端降级** — 推荐实现 localStorage 缓存 + fetch 失败回退策略，确保网络问题不阻塞页面渲染。

### 社区主题生命周期

```
用户投稿 → status: pending (存入 Redis, 24h TTL, 含 tags)
  → 管理员审核
    → approve → 进入公共池（by_newest + by_likes 有序集合）
    → reject  → 删除主题及关联数据（点赞集、索引）
  → 24h 自动过期（TTL），待审索引自动清理
  → 已审核社区主题可被每日轮换选中（约 30% 天数）
```

点赞去重：基于 IP + User-Agent 前 64 字符的哈希，存储于 Redis Set，确保同一用户对同一主题只计一次。

---

## 未来计划

| 功能 | 说明 | 状态 |
|------|------|------|
| **社区主题纳入每日轮换池** | 审核通过的社区主题有机会被 `/api/today.json` 选中，出现在每日分发中 | ✅ 已完成 |
| **主题分类与标签** | 支持为主题添加标签（暗色/亮色/节日/极简等），按分类浏览 | ✅ 已完成 |
| **AI 辅助主题生成** | 根据文字描述，通过 DeepSeek（用户自带 Key，客户端直调）或规则引擎生成 CSS 变量主题 | ✅ 已完成 |
| **RSS / Webhook 通知** | 每日主题更新后推送通知，便于自动化工作流集成 | 待规划 |
| **多管理员支持** | 审核权限分离，支持多个管理员账号协同操作 | 待规划 |
| **主题使用统计** | 各主题被 API 请求的次数、点赞趋势等可视化数据 | 待规划 |
| **API 速率限制** | 可选的分级限流策略，保障服务稳定性 | 待规划 |
| **Theme Preview 截图** | 为主题自动生成可视化预览图，便于商店和分享页展示 | 待规划 |
| **双平台同步部署** | 一套代码自动部署 Vercel + Netlify 双平台 | ✅ 已完成 |

---

## 许可证

待定
