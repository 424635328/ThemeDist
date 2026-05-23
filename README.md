# ThemeDist

**每日轮换的主题 CSS 变量分发服务** — 一个请求，一套完整的网站主题。

ThemeDist 是一个基于 Astro SSR 的主题分发平台，每日自动轮换 200+ 套预设主题配色，覆盖 227+ 个中西方节日（含农历），为第三方网站提供即插即用的 CSS 自定义属性（CSS Custom Properties）。同时提供主题浏览器、在线构建器、社区主题投稿与审核等完整功能。

---

## 目录

- [快速开始](#快速开始)
- [功能特性](#功能特性)
- [API 使用](#api-使用)
  - [获取今日主题](#获取今日主题)
  - [获取指定主题](#获取指定主题)
  - [社区主题投稿](#社区主题投稿)
  - [管理端接口](#管理端接口)
- [CSS 变量参考](#css-变量参考)
- [主题轮换策略](#主题轮换策略)
- [项目结构](#项目结构)
- [技术栈](#技术栈)
- [本地开发](#本地开发)
- [部署](#部署)
- [环境变量](#环境变量)
- [架构说明](#架构说明)
- [许可证](#许可证)

---

## 快速开始

在你的网站中引入今日主题，只需一行代码：

```html
<script>
fetch('https://your-domain.com/api/today.json')
  .then(r => r.json())
  .then(theme => {
    const root = document.documentElement;
    Object.entries(theme.cssVars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  });
</script>
```

或者使用更完整的集成方案（含主题名称展示、自定义 CSS 注入、节日装饰）：

```html
<script>
(async function() {
  const res = await fetch('https://your-domain.com/api/today.json');
  const theme = await res.json();

  // 注入 CSS 变量
  Object.entries(theme.cssVars).forEach(([k, v]) => {
    document.documentElement.style.setProperty(k, v);
  });

  // 注入自定义 CSS（节日主题专属样式）
  if (theme.customCss) {
    const style = document.createElement('style');
    style.textContent = theme.customCss;
    document.head.appendChild(style);
  }

  // 注入 HTML 扩展（节日装饰元素）
  if (theme.extensions) {
    document.body.insertAdjacentHTML('beforeend', theme.extensions);
  }

  console.log(`今日主题: ${theme.preset} ${theme.logo || ''}`);
})();
</script>
```

---

## 功能特性

### 核心功能

- **每日自动轮换** — 200+ 预设主题 + 节日覆盖，UTC 午夜自动切换，通过 Vercel Cron Job 触发重建
- **农历节日支持** — 基于 `lunar-javascript` 实现 227+ 个中西方节日匹配，包括春节、中秋节、端午节、元宵节等农历节日
- **RESTful API** — `GET /api/today.json` 一行请求即获取完整主题；所有接口支持 CORS 跨域
- **CDN 友好缓存** — 合理的 `Cache-Control` 头：浏览器 1h / CDN 24h（今日主题），365 天不可变（指定预设主题）
- **CSS 变量体系** — 28+ 个语义化 CSS 自定义属性，覆盖颜色、排版、间距、阴影、毛玻璃、噪点纹理、氛围背景

### 主题系统

- **5 个主题部件（Theme Parts）** — 颜色、排版、间距、壁纸、视觉效果，可插拔组合
- **5 套季节预设** — Spring Blossom / Summer Vibes / Autumn Harvest / Winter Frost / Midnight
- **Crazy Thursday** — 每周四的特殊主题
- **主题扩展机制** — 每个节日主题可附带自定义 CSS 和 HTML 装饰片段

### 用户端页面

- **主题商店（Theme Store）** — 搜索、排序、按类别/色相/来源筛选，批量浏览所有主题
- **主题构建器（Theme Builder）** — 实时编辑 CSS 变量 JSON、自定义 CSS 注入、图片取色（K-Means 聚类）、AI 提示词生成、一键应用到本站
- **社区投稿（Submit）** — 用户可提交自定义主题（CSS 变量 + 自定义 CSS），经管理员审核后加入公共池
- **主题分享页（Share）** — 社区主题详情页，支持点赞、复制链接、一键应用

### 管理端

- **密码认证** — 基于 Cookie 的单管理员登录
- **审核面板** — 待审主题列表，支持批量批准/拒绝
- **实时数据** — 待审数量、点赞数等实时展示

---

## API 使用

详细的 API 文档请访问部署后的 `/api/docs` 页面。以下为概览：

### 获取今日主题

```bash
curl https://your-domain.com/api/today.json
```

**响应示例：**

```json
{
  "preset": "Mid-Autumn Festival",
  "logo": "🥮",
  "cssVars": {
    "--color-primary": "#D4A574",
    "--color-secondary": "#8B5E3C",
    "--color-accent": "#FFB347",
    "--color-bg": "#1A1410",
    "--color-surface": "#2D2218",
    "--color-text": "#F5E6D3",
    "--color-text-muted": "#B8A088",
    "--color-border": "#3D3024",
    "--font-heading": "'Noto Serif SC', serif",
    "--font-body": "'Noto Sans SC', sans-serif",
    "--font-mono": "'JetBrains Mono', monospace",
    "--text-base": "16px",
    "--text-lg": "20px",
    "--text-xl": "25px",
    "--text-2xl": "31.25px",
    "--text-sm": "12.8px",
    "--space-unit": "8px",
    "--space-1": "8px",
    "--space-2": "16px",
    "--space-3": "24px",
    "--space-4": "32px",
    "--space-6": "48px",
    "--space-8": "64px",
    "--space-12": "96px",
    "--radius-sm": "4px",
    "--radius-md": "8px",
    "--radius-lg": "16px",
    "--content-max": "1200px",
    "--wallpaper-url": "none",
    "--wallpaper-blend": "overlay",
    "--wallpaper-opacity": "0.15",
    "--shadow-sm": "0 1px 3px rgba(0,0,0,0.12)",
    "--shadow-md": "0 4px 12px rgba(0,0,0,0.15)",
    "--shadow-lg": "0 8px 30px rgba(0,0,0,0.2)",
    "--glass-bg": "rgba(45,34,24,0.6)",
    "--glass-blur": "12px",
    "--noise-opacity": "0.03",
    "--ambient-1": "#D4A574",
    "--ambient-2": "#FFB347"
  },
  "customCss": ".theme-mooncake { /* ... */ }",
  "extensions": "<div class='lantern-left'></div><div class='lantern-right'></div>",
  "available": 227,
  "directory": {
    "presets": 5,
    "holidays": 227,
    "dailyPool": 200,
    "community": 42
  }
}
```

### 获取指定主题

```bash
# 获取预设主题
curl https://your-domain.com/api/theme/midnight.json

# 获取社区主题
curl https://your-domain.com/api/theme/community-abc123.json
```

### 社区主题投稿

```bash
curl -X POST https://your-domain.com/api/diy/submit.json \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "我的主题",
    "author": "Nickname",
    "cssVars": { "--color-primary": "#FF6B6B" },
    "customCss": "body { font-family: sans-serif; }"
  }'
```

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
  -d '{"action": "approve", "ids": ["id1", "id2"]}'
```

---

## CSS 变量参考

所有变量均设置在 `:root` 上，在你的 CSS 中直接使用：

```css
.my-card {
  background: var(--color-surface);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-4);
  box-shadow: var(--shadow-md);
}

.glass-panel {
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur));
}
```

### 颜色（7 变量）

| 变量 | 语义 |
|------|------|
| `--color-primary` | 主色 |
| `--color-secondary` | 辅色 |
| `--color-accent` | 强调色 |
| `--color-bg` | 页面背景 |
| `--color-surface` | 卡片/面板背景 |
| `--color-text` | 正文颜色 |
| `--color-text-muted` | 次要文字 |
| `--color-border` | 边框颜色 |

### 排版（8 变量）

| 变量 | 说明 |
|------|------|
| `--font-heading` | 标题字体 |
| `--font-body` | 正文字体 |
| `--font-mono` | 等宽字体 |
| `--text-base` | 基础字号 |
| `--text-lg` | 大号 |
| `--text-xl` | 特大号 |
| `--text-2xl` | 超大号 |
| `--text-sm` | 小号 |

### 间距与布局（9 变量）

| 变量 | 说明 |
|------|------|
| `--space-unit` | 基础间距单元 |
| `--space-1` ~ `--space-12` | 间距梯度 (×1 ~ ×12 unit) |
| `--radius-sm` / `--radius-md` / `--radius-lg` | 圆角梯度 |
| `--content-max` | 内容最大宽度 |

### 视觉效果（6 变量）

| 变量 | 说明 |
|------|------|
| `--shadow-sm` / `--shadow-md` / `--shadow-lg` | 阴影梯度 |
| `--glass-bg` / `--glass-blur` | 毛玻璃背景和模糊值 |
| `--noise-opacity` | SVG 噪点纹理透明度 |

### 氛围背景（3 变量）

| 变量 | 说明 |
|------|------|
| `--ambient-1` | 氛围光球 1 颜色 |
| `--ambient-2` | 氛围光球 2 颜色 |
| `--wallpaper-url` | 可选壁纸图片 URL |
| `--wallpaper-blend` | 壁纸混合模式 |
| `--wallpaper-opacity` | 壁纸透明度 |

---

## 主题轮换策略

每天 UTC 午夜，Vercel Cron Job 触发站点重建。主题选择逻辑如下：

1. **农历节日优先** — 检查当日是否为农历节日（春节、中秋、端午、元宵等）
2. **公历节日其次** — 检查当日是否为公历节日（元旦、情人节、圣诞节、Pi Day 等）
3. **Crazy Thursday** — 每周四使用特殊主题
4. **每日池兜底** — 以上均不命中时，从 200+ 通用主题池中按日期选取

节日主题通常附带专属的 `.customCss` 和 `.extensions`（装饰 HTML 片段），如春节的红灯笼、中秋的月饼图案等。

---

## 项目结构

```
themeDist/
├── astro.config.mjs            # Astro 配置（SSR + Vercel 适配器）
├── vercel.json                 # Vercel 部署配置 + Cron Job
├── netlify.toml                # Netlify 备用部署配置
├── package.json                # 依赖与脚本
├── tsconfig.json               # TypeScript 配置
├── public/
│   └── wallpapers/             # 壁纸图片（可扩展）
└── src/
    ├── api/
    │   └── index_config.js     # ★ 核心配置：6519 行，包含全部主题、节日、轮换逻辑
    ├── layouts/
    │   └── Layout.astro        # 全局布局：导航、氛围背景、主题注入、Toast 系统
    ├── lib/
    │   ├── auth.ts             # 管理员认证（Cookie 会话）
    │   ├── redis.ts            # Upstash Redis 封装（带优雅降级）
    │   └── themes-db.ts        # 社区主题 CRUD（Redis 持久化）
    ├── pages/
    │   ├── index.astro         # 首页：Hero、功能展示、集成代码示例
    │   ├── theme-builder.astro # 主题构建器：实时编辑、图片取色、AI 提示词
    │   ├── theme-store.astro   # 主题商店：浏览、搜索、筛选、点赞
    │   ├── submit.astro        # 社区投稿页
    │   ├── share.astro         # 主题分享页
    │   ├── admin/
    │   │   └── index.astro     # 管理后台：登录 + 审核面板
    │   └── api/
    │       ├── today.json.ts           # GET 今日主题
    │       ├── docs.astro              # API 文档页
    │       ├── theme/[preset].json.ts  # GET 指定预设主题
    │       ├── admin/
    │       │   ├── login.json.ts       # POST 登录/登出
    │       │   └── review.json.ts      # GET/POST 审核操作
    │       └── diy/
    │           ├── submit.json.ts      # POST 提交社区主题
    │           ├── themes.json.ts      # GET 社区主题列表
    │           ├── theme.json.ts       # GET 单个社区主题
    │           └── like.json.ts        # POST 点赞
    ├── themes/
    │   ├── types.ts            # TypeScript 类型定义
    │   ├── registry.ts         # 主题部件注册中心
    │   ├── presets/index.ts    # 5 套季节预设
    │   └── parts/              # 5 个主题部件（颜色、排版、间距、壁纸、效果）
    └── utils/
        ├── daily-theme.ts      # 今日主题获取
        ├── omni-bridge.ts      # OmniConfig ↔ ComposedTheme 桥接
        └── theme-composer.ts   # 主题合成器
```

---

## 技术栈

| 层级 | 技术 |
|------|------|
| **框架** | [Astro](https://astro.build/) 6.x（SSR 模式） |
| **部署适配器** | `@astrojs/vercel`（Serverless） |
| **运行时** | Node.js（ES Modules） |
| **样式方案** | CSS 自定义属性（完全主题驱动，无 CSS 框架依赖） |
| **数据库** | [Upstash Redis](https://upstash.com/)（Serverless Redis） |
| **农历计算** | `lunar-javascript` |
| **ID 生成** | `nanoid` |
| **前端交互** | 原生 JavaScript（无 React/Vue/Svelte 框架） |
| **图片取色** | 客户端 K-Means 聚类（手写实现，无第三方依赖） |
| **部署目标** | Vercel（主） + Netlify（备用） |
| **定时任务** | Vercel Cron Job / Netlify Build Hook（每日 UTC 午夜） |

---

## 本地开发

### 前置条件

- Node.js 18+
- npm 9+
- （可选）Upstash Redis 实例（不配置时社区功能降级为只读）

### 安装与运行

```bash
# 克隆仓库
git clone <repo-url>
cd themeDist

# 安装依赖
npm install

# 启动开发服务器
npm run dev
# 访问 http://localhost:4321

# 生产构建
npm run build

# 预览生产构建
npm run preview
```

### 环境变量

创建 `.env.local` 文件（参考 `.env.local` 中的现有配置）：

```env
# 站点 URL
URL=https://your-domain.com

# 管理员账号密码
ADMIN_ACCOUNT=admin
ADMIN_PASSWORD=your-secure-password

# Upstash Redis（可选，不配置时社区功能只读）
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token
```

---

## 部署

### Vercel（推荐）

1. 将仓库推送到 GitHub
2. 在 Vercel 中导入项目
3. 设置环境变量（同上）
4. 部署完成后，Vercel 会自动根据 `vercel.json` 中的配置设置 Cron Job

`vercel.json` 中的关键配置：

```json
{
  "buildCommand": "astro build",
  "outputDirectory": "dist",
  "crons": [
    {
      "path": "/api/today.json",
      "schedule": "0 0 * * *"
    }
  ]
}
```

### Netlify（备用）

Netlify 部署配置见 `netlify.toml`，使用 Build Hook 触发每日重建。

---

## 环境变量

| 变量 | 必填 | 说明 |
|------|------|------|
| `URL` | 是 | 站点公开 URL |
| `ADMIN_ACCOUNT` | 是 | 管理员用户名 |
| `ADMIN_PASSWORD` | 是 | 管理员密码 |
| `UPSTASH_REDIS_REST_URL` | 否 | Upstash Redis REST URL |
| `UPSTASH_REDIS_REST_TOKEN` | 否 | Upstash Redis 访问令牌 |

---

## 架构说明

### 双层主题模型

1. **OmniConfig（配置层）** — `src/api/index_config.js` 是一个 6519 行的独立主题数据库，包含全部节日规则、日池主题和轮换逻辑。它源自独立项目 OMNI-MATRIX，以纯数据格式存储。
2. **ComposedTheme（运行时层）** — TypeScript 类型化的主题表示，通过 `omni-bridge.ts` 从 OmniConfig 转换而来，包含完整的 CSS 变量展开结果。

### 优雅降级

- **Redis 不可用时** — 所有社区功能（投稿、点赞、审核）降级为只读模式，`dbAvailable` 标记为 false。页面会显示相应提示，不会崩溃。
- **API 兼容** — 所有接口在 Redis 不可用时返回合理的默认值或空数据。

### 缓存策略

| 端点 | 浏览器 | CDN |
|------|--------|-----|
| `/api/today.json` | 1 小时 | 24 小时 |
| `/api/theme/[preset].json` | 24 小时 | 365 天（不可变） |
| `/api/diy/*` | 不缓存 | 不缓存 |
| `/api/admin/*` | 不缓存 | 不缓存 |

### 社区主题审核流程

```
用户投稿 → 状态: pending → 管理员审核 → approve → 进入公共池（by_newest + by_likes）
                                      → reject  → 永久删除
```

点赞去重基于 IP + User-Agent 哈希，存储于 Redis Set，防止同一用户重复点赞。

---

## 许可证

待定
