# ThemeDist 深度审计报告

> 审计日期：2026-05-25 | 修复日期：2026-05-25
> 审计范围：`src/` 全部 `.astro`, `.ts`, `.js` 文件 + `public/sdk.js` + README + API Docs

---

## 🔴 高危 / Critical — 全部已修复

### 1. ✅ 会话 Token 使用非密码学哈希

**文件：** `src/lib/auth.ts:8-15`

原实现为 Java-style `hashCode()`，碰撞率极高。**修复：** `createHash('sha256').update(secret).digest('hex')`。

### 2. ✅ CSRF Token 使用 Math.random()

**文件：** `src/lib/auth.ts:18-25`

`Math.random()` 非密码学安全。**修复：** `crypto.randomUUID()`。

### 3. ✅ Decorative HTML 清洗 — allowlist 重构

**文件：** `src/utils/sanitize.ts:224-280`

从 blocklist 重构为 allowlist 模式：
- **白名单标签**：59 个安全标签（div/span/svg/path/style 等），不在白名单内的全部剥离
- **危险标签固定剥离**：script/iframe/form/input/button/select/textarea/meta/base/link/object/embed/applet/frame/frameset/audio/video/source/track/canvas
- **style 标签**：保留但 CSS 内容通过 `sanitizeCustomCss` 清洗（去 @import/url()/expression/javascript:）
- **属性清洗**：剥离所有 `on*` 事件，剥离 `javascript:` 协议

### 4. ✅ SSRF 防护 — extract-theme API

**文件：** `src/pages/api/v1/extract-theme.json.ts`

- 添加内网 IP/hostname 黑名单过滤（127./10./172.16-31/192.168/169.254/0./100.64-127）
- 错误消息脱敏，不再泄露上游响应内容

---

## 🟠 警告 / Warning — 部分已修复

### 5. ⬜ 内存限流 — 设计决策

**文件：** `src/middleware.ts:7`

内存级滑动窗口限流为项目明确的设计选择（README 文档化）。Serverless 多实例场景下每实例独立计数，实用性足够。

> 严重场景可迁移至 Upstash Redis 原子计数器，当前方案轻量无外部依赖。

### 6. ✅ 社区主题 Pending Key 无 TTL

**文件：** `src/lib/themes-db.ts:65`

**修复：** `submitTheme` 中 `set(key, theme, { ex: 86400 })` — 未审核主题 24h 后自动清理。
`approveTheme` 中 `set(key, theme)` 不带 TTL，移除过期时间 → 审核通过后**永久保留**（与 README "审核通过后长期有效"一致）。

### 7. ✅ 天气粒子渲染代码重复 — 新增 API 端点

**文件：** 原 `index.astro:1354-1486` + `lab.astro:361-489`

**修复：** 新增 `/api/v1/today/weather.js` API 端点，将天气粒子渲染 JS 提取为独立脚本：
- 云/雨/雪/太阳/闪电 6 种天气类型的完整粒子渲染
- `DocumentFragment` 批量 DOM 操作
- `prefers-reduced-motion` 无障碍支持
- 移动端自适应密度
- sessionStorage 30 分钟缓存
- 通过 `<script src>` 引入即可自动运行

### 8. ✅ Admin CSRF Token 重复生成

**文件：** `src/pages/api/v1/admin/review.json.ts:23-34`

**修复：** 替换为 `crypto.randomUUID()`，与 `auth.ts` 保持一致。

---

## 🔵 优化 / Optimization — 部分已修复

### 9. ✅ day-of-year 计算逻辑 — 已统一

**文件：** `omni-bridge.ts`(3处) + `pool/[poolId].json.ts`(1处)

**修复：** 创建 `src/utils/date.ts` 导出 `getDayOfYear(date)`，4 处调用全部替换。

### 10. ✅ 默认 CSS 变量多处硬编码 — 已统一

**修复：** 创建 `src/lib/css-vars-defaults.ts` 导出 `STRUCTURAL_CSS_VARS`（24 个非颜色变量）。
以下文件已迁移：
- ✅ `src/lib/fallback.ts`
- ✅ `src/utils/omni-bridge.ts`
- ✅ `src/pages/api/v1/extract-theme.json.ts`

以下保持独立（有意为之）：
- `src/pages/api/v1/ai/generate.json.ts` — AI 使用中性默认值（system-ui 字体、不同间距公式）
- `src/pages/theme-builder.astro` — 客户端 JS，无法 import 服务端模块

### 11. ⬜ 颜色工具函数多处重复

服务器端文件（`omni-bridge.ts`、`ai/generate.json.ts`）的颜色函数工作于特定数据结构（OmniConfig raw → HSL 往返等），与 `color.ts` 的通用工具不完全重叠。客户端 Astro 文件（`theme-builder.astro`、`theme-store.astro`、`admin/index.astro`）中的颜色函数运行在浏览器环境，无法 `import` 服务端 TS 模块。

> 这是前后端分离架构下的自然结果，非简单重复。可考虑将 `color.ts` 中的纯函数编译到客户端，但目前内联方式零依赖、零构建开销，实际成本很低。

### 12. ⬜ Web Component SDK 与首页注入脚本功能重叠

`public/sdk.js`（`<themedist-runner>` Web Component）和 `index.astro` 中的 `injectCode`（IIFE）功能等价。

> SDK 面向外部站点（Shadow DOM 隔离），injectCode 面向本站（全局注入），两条路径各自独立维护是合理的职责分离。

---

## 修复汇总

| # | 类别 | 问题 | 状态 |
|---|------|------|------|
| 1 | 🔴 高危 | sessionToken 非密码学哈希 | ✅ SHA-256 |
| 2 | 🔴 高危 | CSRF Math.random() | ✅ crypto.randomUUID() |
| 3 | 🔴 高危 | Decorative HTML 清洗 | ✅ allowlist 重构 |
| 4 | 🔴 高危 | extract-theme SSRF | ✅ IP 黑名单 + 脱敏 |
| 5 | 🟠 警告 | 内存限流 serverless | ⬜ 文档明确的轻量策略 |
| 6 | 🟠 警告 | Pending 主题无 TTL | ✅ 24h TTL |
| 7 | 🟠 警告 | 天气粒子代码重复 | ✅ `/api/v1/today/weather.js` |
| 8 | 🟠 警告 | CSRF 补充代码重复 | ✅ crypto.randomUUID() |
| 9 | 🔵 优化 | day-of-year 重复 | ✅ `src/utils/date.ts` |
| 10 | 🔵 优化 | CSS 默认值散落 | ✅ `src/lib/css-vars-defaults.ts` |
| 11 | 🔵 优化 | 颜色工具重复 | ⬜ 架构原因，成本可接受 |
| 12 | 🔵 优化 | SDK 与注入脚本重叠 | ⬜ 职责分离，有意为之 |

### 新增文件

| 文件 | 用途 |
|------|------|
| `src/utils/date.ts` | 共享日期工具（`getDayOfYear`, `getMMDD`） |
| `src/lib/css-vars-defaults.ts` | 共享结构性 CSS 变量默认值 |
| `src/pages/api/v1/today/weather.js.ts` | 天气粒子渲染脚本 API |

### 文档更新

| 文件 | 更新内容 |
|------|---------|
| `README.md` | 新增天气粒子章节 + weather.js 端点 + 缓存策略 |
| `src/pages/api/docs.astro` | 新增 weather.js 端点 + 缓存策略 |
