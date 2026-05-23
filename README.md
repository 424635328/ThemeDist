# ThemeDist

**每日轮换的主题 CSS 变量分发服务** — 一个 GET 请求，整套网站视觉主题。

ThemeDist 是基于 Astro SSR 的主题分发平台，通过 **OmniConfig 主题数据库**（节日 + 日池主题）配合 **5 组可插拔主题部件**（颜色、排版、间距、壁纸、视觉效果），每日由 Astro SSR 实时计算并输出 34 个 CSS 自定义属性。同时提供主题商店、在线构建器、社区投稿与审核、AI 辅助生成、主题标签分类等完整功能。

支持 **Vercel + Netlify** 双平台部署，一份代码，同时运行。

---

## 目录

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

## 快速开始

在你的网站中引入今日主题：

```html
<script>
fetch('https://themedist.netlify.app/api/today.json')
  .then(r => r.json())
  .then(theme => {
    Object.entries(theme.cssVars).forEach(([k, v]) => {
      document.documentElement.style.setProperty(k, v);
    });
    if (theme.customCss) {
      const s = document.createElement('style');
      s.textContent = theme.customCss;
      document.head.appendChild(s);
    }
  });
</script>
```

完整集成方案（含缓存、降级、节日特效）：

```javascript
(async () => {
  const today = new Date().toISOString().slice(0, 10);
  const cached = JSON.parse(localStorage.getItem('td') || 'null');
  if (cached?.date === today) return applyTheme(cached);

  try {
    const res = await fetch('https://themedist.netlify.app/api/today.json');
    const t = await res.json();
    const data = { date: t.date, cssVars: t.cssVars, customCss: t.customCss, exts: t.extensions };
    localStorage.setItem('td', JSON.stringify(data));
    applyTheme(data);
  } catch {
    const fallback = JSON.parse(localStorage.getItem('td') || 'null');
    if (fallback) applyTheme(fallback);
  }
})();

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

- **每日自动轮换** — Astro SSR 实时计算，无需定时构建。农历节日 → 公历节日 → Crazy Thursday → 社区主题（约 30% 天数）→ 日池兜底
- **农历节日支持** — 基于 `lunar-javascript` 实现，覆盖春节、元宵、端午、中秋、重阳等 30+ 传统农历节日。运行时通过 `OmniConfig.getThemeConfig('auto')` 直接调用 `Lunar.fromDate()` 计算
- **社区主题即发即现** — 用户投稿后自动发布至社区商店，立即可见、可点赞、可分享，长期有效
- **RESTful API** — `GET /api/today.json` 返回完整主题数据；所有接口支持 CORS 跨域
- **CDN 友好缓存** — 浏览器 1h / CDN 24h（今日主题，含 `stale-while-revalidate=3600` 降级），365 天不可变缓存（预设主题端点）
- **CSS 变量体系** — 34 个语义化 CSS 自定义属性（颜色 8 + 排版 8 + 间距 9 + 效果 8 + 氛围 2），覆盖完整 UI 语义
- **双平台部署** — Vercel + Netlify 同时分发，同一份代码自动适配
- **优雅降级** — Redis 不可用时社区功能自动降级为只读，站点核心功能不受影响

### 用户端页面

- **主题商店（Theme Store）** — 浏览、搜索、按分类/色温/标签筛选所有主题（预设 + 社区），社区主题支持按暗色/亮色/暖色/冷色/鲜艳/极简/自然/科技标签筛选，高亮今日主题。社区列表使用 sessionStorage 缓存（5 分钟 TTL），命中缓存瞬间渲染，后台静默刷新
- **主题构建器（Theme Builder）** — 实时编辑 CSS 变量 JSON、注入自定义 CSS、在预设间切换，一键复制应用。支持图片取色（K-means 聚类提取调色板）、AI 描述生成
- **社区投稿（Submit）** — 左侧紧凑表单（粘贴 JSON / AI 生成 / DeepSeek 直调），右侧 16:9 LIVE SENSING 沙箱实时预览。提交后自动发布，本地历史记录含数据库状态检测（收录中/已过期），状态缓存至 localStorage（10 分钟 TTL）
- **AI 主题生成** — 输入文字描述，使用 DeepSeek（用户自带 Key，客户端直接调用，max_tokens: 10000）或内置规则引擎生成完整 CSS 变量主题
- **主题分享页（Share）** — 社区主题详情展示，支持点赞、复制链接、一键应用，含桌面/平板/手机视口切换预览

### 管理端

- **Cookie 认证** — 单管理员登录，HttpOnly + SameSite strict
- **审核面板** — 主题默认自动发布，管理后台可用于手动审核或清理过期主题
- **点赞去重** — 基于 IP + User-Agent + 客户端 UUID 三重哈希，Redis Set 防重复点赞，点赞数实时同步至排行榜

---

## API 使用

详细文档请访问部署后的 `/api/docs` 页面。以下为概览：

### 获取今日主题

```bash
curl https://themedist.netlify.app/api/today.json
```

**响应示例：**

```json
{
  "date": "2026-02-17",
  "generatedAt": "2026-02-17T00:00:00.000Z",
  "preset": "holiday-l01-01",
  "presetName": "Spring Festival (L01-01)",
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
  "customCss": ".spring-festival { /* ... */ }",
  "extensions": [
    { "type": "html", "content": "<div class='lantern-left'>...</div>" }
  ],
  "logoText": "🧧",
  "logoColors": ["#C84B31", "#FFB347"],
  "available": 248,
  "directory": [
    { "preset": "spring", "name": "Spring Blossom", "primary": "#ec4899", "accent": "#10b981", "logoText": null }
  ]
}
```

关键字段：

| 字段 | 说明 |
|------|------|
| `preset` | 主题预设 ID（如 `holiday-l01-01` 表示农历春节） |
| `presetName` | 主题显示名称 |
| `dailyIsCommunity` | `true` 表示今日主题来自社区投稿 |
| `cssVars` | 34 个 CSS 自定义属性键值对 |
| `customCss` | 节日专属 CSS 动画（非节日为 `null`） |
| `extensions` | HTML 装饰片段（非节日为 `null`） |
| `logoText` | 节日 Emoji / 主题 Logo 文字 |
| `logoColors` | Logo 渐变色对 |
| `available` | 可用主题总数（预设 + 社区） |
| `directory` | 主题目录列表（用于商店浏览） |

### 获取指定主题

```bash
# 获取预设主题
curl https://themedist.netlify.app/api/theme/midnight.json

# 获取社区主题
curl https://themedist.netlify.app/api/theme/community-abc12345.json
```

预设主题返回 365 天不可变缓存头；社区主题返回 1 小时缓存。

### 获取构建时索引数据

```bash
curl https://themedist.netlify.app/api/index-data.json
```

返回日池 ID 列表、公历节日映射、农历节日映射（农历→公历日期转换）和主题目录。

### 社区主题投稿

```bash
curl -X POST https://themedist.netlify.app/api/diy/submit.json \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "My Theme",
    "author": "Nickname",
    "cssVars": { "--color-primary": "#FF6B6B", "--color-bg": "#1a1a2e" },
    "customCss": "body { font-family: sans-serif; }",
    "tags": ["dark", "vibrant"]
  }'
```

必填字段：`name`、`author`、`cssVars`（必须包含 `--color-primary` 和 `--color-bg`）。
可选字段：`customCss`、`tags`（最多 5 个标签）。

主题提交后**自动发布**至社区商店，立即可见和可点赞，长期有效。

### 社区主题列表（带标签筛选）

```bash
# 获取最新主题（分页）
curl "https://themedist.netlify.app/api/diy/themes.json?sort=new&page=1&size=20"

# 按标签筛选
curl "https://themedist.netlify.app/api/diy/themes.json?tag=dark"

# 获取最热主题
curl "https://themedist.netlify.app/api/diy/themes.json?sort=hot"
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
curl -X POST https://themedist.netlify.app/api/diy/like.json \
  -H 'Content-Type: application/json' \
  -d '{"id": "abc12345"}'
```

基于 IP + User-Agent + 客户端 UUID 三重去重，同一用户对同一主题只计一次。

### AI 生成主题

```bash
curl -X POST https://themedist.netlify.app/api/ai/generate.json \
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
curl -X POST https://themedist.netlify.app/api/admin/login.json \
  -H 'Content-Type: application/json' \
  -d '{"account": "admin", "password": "your-password"}'

# 获取待审主题
curl https://themedist.netlify.app/api/admin/review.json \
  -H 'Cookie: admin_session=...'

# 批量批准
curl -X POST https://themedist.netlify.app/api/admin/review.json \
  -H 'Content-Type: application/json' \
  -H 'Cookie: admin_session=...' \
  -d '{"action": "approve", "ids": ["abc12345", "def67890"]}'

# Redis 健康检查
curl https://themedist.netlify.app/api/admin/health.json
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

---

## 主题轮换策略

主题由 Astro SSR 端点 `src/pages/api/today.json.ts` 根据服务器日期实时计算，无需定时构建。选择逻辑集中在一处，双平台完全一致。

选择优先级：

1. **农历节日优先** 🏮 — `OmniConfig.getThemeConfig('auto')` 运行时通过 `Lunar.fromDate()` 直接计算当前农历日期，匹配 30+ 农历节日（春节、元宵、端午、中秋、重阳等）
2. **公历节日其次** 📅 — 匹配元旦、情人节、Pi Day、圣诞等公历节日（来自 OmniConfig 配置）
3. **Crazy Thursday** 🍗 — 每周四的特殊覆盖主题
4. **社区主题轮换** 👥 — 约 30% 天数（每 3 天）从已审核社区主题池中按 `dayOfYear % count` 选中一个作为今日主题
5. **每日池兜底** 🎲 — 按 `dayOfYear % poolLength` 从日池主题中轮选

节日主题可附带 `customCss`（专属 CSS 动画）和 `extensions`（HTML 装饰片段，如春节灯笼、中秋月饼等）。

### 农历节日处理流程

```
运行时 (Astro SSR — src/pages/api/today.json.ts)
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

## 项目结构

```
themeDist/
├── .github/
│   └── workflows/
│       └── deploy.yml                  # GitHub Actions：每月 1 号自动构建部署到 Netlify
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
    │   ├── auth.ts                     # 管理员认证（Cookie 会话，HttpOnly）
    │   └── themes-db.ts               # 社区主题 CRUD（提交/审核/点赞/列表，Redis 持久化，含标签）
    ├── pages/
    │   ├── index.astro                 # 首页：Hero、三步接入、功能展示、代码示例
    │   ├── theme-builder.astro         # 主题构建器：实时编辑 CSS 变量、预设切换、图片取色
    │   ├── theme-store.astro           # 主题商店：浏览/搜索/分类/标签筛选/社区标签页
    │   ├── submit.astro                # 社区投稿：JSON 编辑器 + AI 生成（DeepSeek 客户端集成）
    │   ├── share.astro                 # 主题分享页：详情、点赞、复制链接、视口切换预览
    │   ├── admin/
    │   │   └── index.astro             # 管理后台：登录面板 + 审核列表
    │   └── api/
    │       ├── today.json.ts           # ★ GET 今日主题（Astro SSR 动态端点，双平台统一入口）
    │       ├── today.ts                # 主题端点旧版（Vercel Edge，已废弃，直接访问 /api/today 仍可用）
    │       ├── index-data.json.ts      # ★ 构建时数据快照（日池 ID、公历+农历节日映射、目录）
    │       ├── docs.astro              # API 交互式文档页面
    │       ├── spec.astro              # 旧文档 → /api/docs 301 转发
    │       ├── theme/
    │       │   └── [preset].json.ts    # GET 指定预设/社区主题
    │       ├── admin/
    │       │   ├── login.json.ts       # POST 登录/登出
    │       │   ├── review.json.ts      # GET 待审列表 / POST 批量审核
    │       │   └── health.json.ts      # GET Redis 健康状态
    │       ├── diy/
    │       │   ├── submit.json.ts      # POST 提交社区主题（含标签）
    │       │   ├── themes.json.ts      # GET 社区主题列表（分页 + 标签筛选）
    │       │   ├── theme.json.ts       # GET 单个社区主题
    │       │   └── like.json.ts        # POST 点赞（IP+UA+客户端UUID 三重去重）
    │       └── ai/
    │           └── generate.json.ts    # POST AI 主题生成（规则引擎，DeepSeek Key 由客户端直调）
    ├── api/
    │   └── index_config.js             # ★ 核心主题数据库：全部节日规则、日池主题、轮换逻辑（源自 OMNI-MATRIX）
    ├── themes/
    │   ├── types.ts                    # 核心类型定义（ThemePart, ThemePreset, ComposedTheme, ThemeTag）
    │   ├── registry.ts                 # 主题部件注册中心（5 部件）
    │   ├── presets/
    │   │   └── index.ts                # 5 套季节预设定义
    │   └── parts/
    │       ├── colors.ts               # 颜色部件（8 个 CSS 变量）
    │       ├── typography.ts           # 排版部件（Modular Scale）
    │       ├── spacing.ts              # 间距部件（基准 + 梯度）
    │       ├── wallpaper.ts            # 壁纸部件（URL + blend + opacity）
    │       └── effects.ts              # 视觉效果部件（阴影/毛玻璃/噪点/氛围光）
    └── utils/
        ├── daily-theme.ts              # 统一导出入口（转发 omni-bridge 方法）
        ├── omni-bridge.ts              # ★ 核心桥接：OmniConfig → ComposedTheme 转换（含标签推断、社区主题轮换、颜色工具）
        ├── theme-composer.ts           # 主题合成器：部件 + 预设 → 完整 ComposedTheme
        └── sanitize.ts                 # 输入净化（去 HTML 标签/事件处理器/js: 协议/CSS expression）
```

---

## 架构说明

### 双层主题模型

1. **OmniConfig（配置层）** — `src/api/index_config.js` 是独立的主题数据库，包含全部节日规则（公历 + 农历 30+ 条）、日池主题和轮换逻辑。源自独立项目 OMNI-MATRIX，以纯数据格式存储，`getThemeConfig(strategy, date)` 为核心入口。

2. **ComposedTheme（运行时层）** — TypeScript 类型化的主题表示（`src/themes/types.ts`），通过 `omni-bridge.ts` 从 OmniConfig 原始数据转换为前端可消费的 CSS 变量展开结果。新增 `tags` 和 `ThemeTag` 类型支持分类。

### 部件系统

除了 OmniConfig 数据源，项目还维护一套独立的**可插拔主题部件系统**（`src/themes/parts/`），支持通过 5 组部件 + 5 套预设定义主题，由 `theme-composer.ts` 合成。这套系统与 OmniConfig 并行存在，主要用于首页/主题商店/构建器的界面展示。

每个部件是一个 `ThemePart` 模块，提供 `defaults`（默认 CSS 变量值）和 `generate(options)` 函数（合并默认值与覆盖项）。

| 部件 | 变量数 | 说明 |
|------|--------|------|
| `colors` | 8 | 颜色调色板（主色/辅色/强调色/背景/表面/文字/边框） |
| `typography` | 8 | 字体栈 + Modular Scale 字号 |
| `spacing` | 9 | 间距梯度 + 圆角 + 最大宽度 |
| `wallpaper` | 3 | 背景图 URL + CSS blend + 透明度 |
| `effects` | 8 | 阴影 + 毛玻璃 + 噪点纹理 + 氛围光球 |
| **总计** | **36** | （实际输出 34 个，wallpaper 在无背景图时省略 3 个） |

### 每日主题选择流程

```
GET /api/today.json（Vercel + Netlify 统一路由）
  │
  └─ Astro SSR 端点: src/pages/api/today.json.ts
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
用户投稿 → status: approved (存入 Redis，长期有效，含 tags)
  → 直接进入公共池（by_newest + by_likes 有序集合）立即可见
  → 点赞数据实时同步至排行榜
  → 社区主题可被每日轮换选中（约 30% 天数）
```

点赞去重：基于 IP + User-Agent 前 64 字符 + 客户端 UUID（`localStorage` 持久化，首次访问生成）的三重哈希，存储于 Redis Set，确保同一用户对同一主题只计一次。NAT 环境下共享 IP 的用户因持有不同客户端 UUID，不会互相阻塞。

### 缓存策略

| 端点 | 浏览器 | CDN |
|------|--------|-----|
| `/api/today.json` | 1 小时 (`max-age=3600`) | 24 小时 + 1h 降级 (`s-maxage=86400, stale-while-revalidate=3600`) |
| `/api/theme/*.json`（预设） | 24 小时 | 365 天（`immutable`） |
| `/api/theme/*.json`（社区） | 1 小时 | 不使用 CDN 缓存 |
| `/api/index-data.json` | 1 小时 (`max-age=3600`) | 24 小时 (`s-maxage=86400`) |
| `/api/diy/*` | 1 分钟或不缓存 | 不使用 CDN 缓存 |
| `/api/ai/generate.json` | 不缓存 | 不使用 CDN 缓存 |
| `/api/admin/*` | 不缓存 | 不使用 CDN 缓存 |

### 客户端缓存

| 数据 | 存储 | TTL | 说明 |
|------|------|-----|------|
| 社区主题列表 | sessionStorage | 5 分钟 | 命中缓存时瞬间渲染，后台静默拉取 |
| 提交记录状态 | localStorage | 10 分钟 | 缓存 DB 状态（收录中/已过期） |
| 今日主题 | localStorage | 至次日 | 集成方推荐实现，含降级回退 |
| 点赞状态 | localStorage | 永久 | 客户端防重复点击 |

### 优雅降级

- **Redis 不可用** — 所有社区功能（投稿、点赞、审核、列表）返回空数据或 503，`dbAvailable` 标记为 `false`。客户端缓存确保已加载数据仍可见
- **每日主题分发** — Redis 不可用时社区主题自动降级为纯日池轮换 + 节假日逻辑，不影响 `/api/today.json` 输出
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
| **CI/CD** | GitHub Actions（Netlify 每月自动构建）；Vercel Git Integration（自动部署） |

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
URL=http://localhost:4321
ADMIN_ACCOUNT=admin
ADMIN_PASSWORD=your-secure-password
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token
```

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
4. `/api/today.json` 由 Astro SSR 端点（`src/pages/api/today.json.ts`）动态处理，Vercel 与 Netlify 使用相同的代码路径。

### Netlify

采用 **GitHub Actions 自动构建并部署**到 Netlify 的方式。`/api/today.json` 由 Astro SSR 端点统一处理。

**触发方式：**

| 事件 | 说明 |
|------|------|
| `schedule` (cron: `0 0 1 * *`) | 每月 1 号 UTC 午夜自动重建（更新农历映射、预渲染数据） |
| `workflow_dispatch` | GitHub 页面手动触发 |

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
| `UPSTASH_REDIS_REST_URL` | 手动设置 | 手动设置 | `.env.local` |
| `UPSTASH_REDIS_REST_TOKEN` | 手动设置 | 手动设置 | `.env.local` |
| `KV_REST_API_URL` | Vercel KV 自动注入 | 不适用 | 不适用 |
| `KV_REST_API_TOKEN` | Vercel KV 自动注入 | 不适用 | 不适用 |
| `OPENAI_API_KEY` | 可选（服务端降级用） | 可选（服务端降级用） | `.env.local`（可选） |

> **注意**：Vercel KV 本质是 Upstash Redis。Netlify 上需设置 `UPSTASH_REDIS_REST_URL` 和 `UPSTASH_REDIS_REST_TOKEN`，值与 Vercel KV 的 `KV_REST_API_URL` / `KV_REST_API_TOKEN` 一致。
>
> **AI 密钥说明**：`OPENAI_API_KEY` 仅作为服务端规则引擎的增强备选，非必需。推荐用户在提交页面使用客户端 DeepSeek 集成（自带 Key，浏览器直调 DeepSeek API，不经本服务器）。

---

## 未来计划

| 功能 | 说明 | 状态 |
|------|------|------|
| **社区主题纳入每日轮换池** | 社区主题有机会被 `/api/today.json` 选中（约 30% 天数） | ✅ 已完成 |
| **社区主题即发即现** | 投稿后自动发布至社区商店，立即可见可点赞 | ✅ 已完成 |
| **主题分类与标签** | 支持为主题添加标签（暗色/亮色/节日/极简等），按分类浏览 | ✅ 已完成 |
| **AI 辅助主题生成** | 根据文字描述，通过 DeepSeek（客户端直调）或规则引擎生成主题 | ✅ 已完成 |
| **客户端缓存优化** | sessionStorage（5min TTL）+ localStorage（10min TTL）减少重复请求 | ✅ 已完成 |
| **LIVE SENSING 沙箱** | 提交页 16:9 比例全屏沙箱实时预览 | ✅ 已完成 |
| **双平台同步部署** | 一套代码自动部署 Vercel + Netlify 双平台 | ✅ 已完成 |
| **农历节日支持** | 30+ 农历节日，OmniConfig 运行时通过 Lunar.fromDate() 计算 | ✅ 已完成 |
| **RSS / Webhook 通知** | 每日主题更新后推送通知 | 待规划 |
| **多管理员支持** | 审核权限分离，支持多个管理员账号协同操作 | 待规划 |
| **主题使用统计** | 各主题被 API 请求的次数、点赞趋势等可视化数据 | 待规划 |
| **API 速率限制** | 可选的分级限流策略，保障服务稳定性 | 待规划 |
| **Theme Preview 截图** | 为主题自动生成可视化预览图 | 待规划 |

---

## 许可证

待定
