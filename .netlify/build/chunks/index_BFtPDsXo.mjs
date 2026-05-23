import { c as createComponent } from './astro-component_C4iwsvtt.mjs';
import 'piccolore';
import { r as renderComponent, u as renderTemplate, q as maybeRenderHead, k as addAttribute } from './ssr-function_yscoTaBG.mjs';
import { r as renderScript } from './script_DOSZrVRJ.mjs';
import { $ as $$Layout } from './Layout_C5Si_EoU.mjs';
import { i as isAdmin } from './auth_Ccxb5js3.mjs';

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Index;
  const authed = isAdmin(Astro2.cookies);
  const siteUrl = Astro2.url.origin;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {}, { "default": async ($$result2) => renderTemplate`  ${maybeRenderHead()}<div id="admin-dashboard-container"${addAttribute(authed ? "true" : "false", "data-authed")}${addAttribute(siteUrl, "data-site-url")}> ${!authed ? renderTemplate`<section class="section text-center login-section"> <div class="login-container"> <div class="login-brand"> <div class="login-logo-shield"> <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"> <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path> </svg> </div> <p class="t-label">Security Gate</p> <h1 class="t-heading mt-2">管理员鉴权</h1> </div> <div class="card card-glass login-card"> <form id="login-form"> <div class="form-group"> <label class="form-label">账号</label> <div class="input-wrapper"> <span class="input-icon"> <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> </span> <input type="text" name="account" id="login-account" autocomplete="username" placeholder="请输入管理员账号" class="dashboard-input"> </div> </div> <div class="form-group"> <label class="form-label">密码</label> <div class="input-wrapper"> <span class="input-icon"> <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg> </span> <input type="password" name="password" id="login-password" autocomplete="current-password" placeholder="请输入密码" class="dashboard-input"> </div> </div> <p id="login-error" class="login-error-text"></p> <button type="submit" class="btn btn-primary login-btn"> <span>验证登录</span> <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg> </button> </form> </div> </div> </section>` : renderTemplate`<section class="section-sm admin-section"> <div class="admin-header-row"> <div> <p class="t-label admin-label"> <span class="pulse-icon-green"></span>
Admin Control Center
</p> <h1 class="t-heading mt-1" style="font-size:28px">审核社区主题</h1> </div> <div class="admin-meta-controls"> <span id="pending-count-badge" class="badge-pending-pill">加载中…</span> <button id="btn-logout" class="btn btn-outline logout-btn"> <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
退出登录
</button> </div> </div> <!-- System Dangling Keys Warn Box --> <div id="dangling-keys-warning" class="card dangling-warning-box"> <div class="warning-title-row"> <svg width="18" height="18" viewBox="0 0 16 16" fill="none"><path d="M8 2l6 11H2L8 2z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"></path><path d="M8 6v3.5M8 11.5h.01" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path></svg>
待审索引可能失效 (Dangling Residual)
</div> <p class="warning-text">
Redis 待审核总数显示为 <strong id="dangling-badge-count">0</strong>，但并没有获取到对应数据详情。
            这往往是因为直接清理数据库造成的<strong>空悬索引残留</strong>。请点击「刷新」或让系统管理员在 Redis 中移去多余的 <code>themes:pending</code> 集合元素。
</p> </div> <!-- Toolbar (Sticky floating control bar) --> <div id="toolbar" class="admin-toolbar"> <div class="toolbar-left"> <label class="select-all-label"> <input type="checkbox" id="select-all" class="custom-checkbox"> <span>全选本页</span> </label> <span id="selected-count" class="selected-counter">已选 0 个主题</span> </div> <div class="toolbar-actions"> <button id="btn-approve" class="btn btn-primary action-btn-green" disabled> <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5L13 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg> <span>通过选中</span> </button> <button id="btn-reject" class="btn btn-outline action-btn-red" disabled> <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path></svg> <span>批量驳回</span> </button> <button id="btn-refresh" class="btn btn-ghost action-btn-refresh"> <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M2 8a6 6 0 0110.47-4M14 8a6 6 0 01-10.47 4M2 2v4h4M14 14v-4h-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg> <span>刷新</span> </button> </div> </div> <!-- Loading state --> <div id="loading-state-admin" class="loading-state-container"> <div class="spinner-lg"></div> <p class="text-muted">正在获取主题快照，请稍后…</p> </div> <!-- Empty state --> <div id="empty-state" class="empty-state-container"> <div class="empty-icon">🎉</div> <h2>没有积压待审的主题</h2> <p class="text-muted">当前社区公共主题商店运行秩序井然，无残留任务。</p> </div> <!-- Theme list container --> <div id="theme-list-admin" class="theme-grid-admin"></div> <!-- Error state --> <div id="error-state-admin" class="error-state-container"> <div class="error-icon">⚠️</div> <h2>状态拉取失败</h2> <p class="text-muted">可能是网络会话过期或 Redis 服务断开连接。</p> <button id="btn-retry" class="btn btn-primary" style="margin-top:12px">重新连接</button> </div> </section>`} </div> ` })} <!-- 💡 BINGO! 增加 is:global 关键字，彻底解除 Astro 样式对动态生成 DOM 树的局部隔离 -->  ${renderScript($$result, "E:/GitHub/themeDist/src/pages/admin/index.astro?astro&type=script&index=0&lang.ts")}`;
}, "E:/GitHub/themeDist/src/pages/admin/index.astro", void 0);

const $$file = "E:/GitHub/themeDist/src/pages/admin/index.astro";
const $$url = "/admin";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
