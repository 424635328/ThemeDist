import { c as createComponent } from './astro-component_C4iwsvtt.mjs';
import 'piccolore';
import { r as renderComponent, u as renderTemplate, q as maybeRenderHead } from './ssr-function_yscoTaBG.mjs';
import { r as renderScript } from './script_DOSZrVRJ.mjs';
import { $ as $$Layout } from './Layout_C5Si_EoU.mjs';

const $$Submit = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Submit;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {}, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="section text-center" style="padding-bottom:32px"> <p class="t-label">Community Pool</p> <h1 class="t-heading mt-2">分享你的创作</h1> <p class="t-subhead mt-2" style="max-width:560px;margin-inline:auto">
在构建器中调配好了精美的主题？粘贴变量 JSON，一键提交至社区公共主题商店。<br>
提交后生成分享码，管理员审核通过后将永久收录。24 小时内未审核则自动移除。
</p> </section> <section class="submit-container"> <div class="submit-grid"> <!-- LEFT: Editor Form --> <div class="form-wrapper"> <div class="card card-glass form-card"> <div class="form-section-header"> <span class="section-badge">Data Editor</span> <h2 class="section-title">主题数据配置</h2> </div> <!-- Import Options Group --> <div class="import-group"> <button id="btn-import" class="btn btn-outline import-btn" title="从剪贴板读取构建器复制的数据"> <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="4" y="4" width="10" height="10" rx="1.5" stroke="currentColor" stroke-width="1.5"></rect><path d="M2 6v8a2 2 0 002 2h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path></svg>
从剪贴板导入
</button> <button id="btn-demo" class="btn btn-outline demo-btn" title="加载一组精美动态樱花主题体验"> <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M8 1v14M1 8h14" stroke-linecap="round"></path><circle cx="8" cy="8" r="3" fill="var(--color-surface)"></circle></svg>
加载樱花示例
</button> </div> <!-- Code Editors Tab Container --> <div class="tabs-container"> <button id="tab-btn-vars" class="tab-btn active" type="button">🎨 核心 CSS 变量</button> <button id="tab-btn-css" class="tab-btn" type="button">✨ 自定义 CSS (可选)</button> </div> <!-- Tab 1: CSS Variables JSON --> <div id="tab-content-vars" class="tab-content active"> <div class="input-block"> <div class="block-header"> <label for="vars-input" class="input-label">JSON 代码 <span class="required">*</span></label> <button id="btn-format" class="text-btn" title="自动排版美化 JSON 代码">格式化</button> </div> <textarea id="vars-input" spellcheck="false" placeholder="{&quot;--color-primary&quot;:&quot;#ff8fa3&quot;,&quot;--color-bg&quot;:&quot;#fff0f3&quot;,&quot;--font-heading&quot;:&quot;Inter, sans-serif&quot;,&quot;--radii&quot;:&quot;12px&quot;,...}" class="code-textarea"></textarea> <div id="vars-error-container" class="validation-error-container"> <span id="vars-error" class="validation-error"></span> <button id="btn-autofix" class="text-btn autofix-btn" style="display: none;">尝试自动修复</button> </div> <!-- Inline parsed palette helper inside editor card --> <div class="palette-preview-panel"> <span class="palette-title">已识别的色彩配置：</span> <div id="editor-swatches" class="editor-swatches-strip"></div> </div> </div> </div> <!-- Tab 2: Custom CSS Area --> <div id="tab-content-css" class="tab-content"> <div class="input-block"> <label for="css-input" class="input-label">额外的自定义 CSS 样式规则</label> <textarea id="css-input" spellcheck="false" placeholder="/* 可以在这里编写针对当前主题的专属 CSS 动画、粒子效果等 */" class="code-textarea css-textarea"></textarea> </div> </div> <!-- Meta Area --> <div class="meta-row"> <div class="input-block"> <label for="name-input" class="input-label">主题名称 <span class="required">*</span></label> <div class="input-wrapper"> <input id="name-input" type="text" maxlength="40" placeholder="如: 霓虹都市" class="text-input"> <span class="char-counter" id="name-counter">0/40</span> </div> </div> <div class="input-block"> <label for="author-input" class="input-label">作者昵称 <span class="required">*</span></label> <div class="input-wrapper"> <input id="author-input" type="text" maxlength="20" placeholder="你的署名" class="text-input"> <span class="char-counter" id="author-counter">0/20</span> </div> </div> </div> <!-- Submit Button --> <button id="btn-submit" class="btn btn-primary submit-main-btn" disabled> <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2v10M4 8l4 4 4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path></svg>
发布到社区商店
</button> <!-- Submit result container --> <div id="submit-result" class="result-alert-box"></div> </div> <!-- Submitted History (Persist with localstorage) --> <div id="recent-section" class="recent-submissions"> <h3 class="recent-title">我的提交记录</h3> <div id="recent-list" class="recent-list"></div> </div> </div> <!-- RIGHT: Interactive Live Sandbox Preview --> <div class="preview-sticky"> <div class="preview-header-meta"> <span class="section-badge">Interactive Sandbox</span> <div class="badge-live-dot-wrapper" style="display:flex;align-items:center;gap:8px"> <span class="badge-live-dot">LIVE SENSING</span> <span id="sensing-detailed-status" class="sensing-details" style="font-size:10px;font-weight:700;letter-spacing:0.04em;color:var(--color-text-muted);opacity:0.85">Idle</span> </div> </div> <div id="preview-shell" class="preview-browser"> <div class="browser-bar"> <div class="browser-dots"> <span class="dot-red"></span> <span class="dot-yellow"></span> <span class="dot-green"></span> </div> <span class="browser-url">themedist.preview.local</span> </div> <!-- Micro simulated browser progress line indicator --> <div id="browser-loading-bar" class="browser-loading-bar"></div> <!-- Embedded Preview SandBox Iframe --> <div class="iframe-container"> <iframe id="preview-iframe" class="sandbox-iframe" title="实时隔离渲染沙箱"></iframe> <div id="preview-placeholder" class="preview-empty-placeholder"> <div class="placeholder-icon">🎨</div> <p>粘贴 JSON 变量或点击 “加载精美示例”<br>在此处实时交互预览您的主题设计</p> </div> </div> </div> </div> </div> </section> ` })} <!-- 🌸 启动 is:global 彻底清除 Astro 局部哈希隔离，使 JS 渲染的色块和历史列表得到完美美化 -->  ${renderScript($$result, "E:/GitHub/themeDist/src/pages/submit.astro?astro&type=script&index=0&lang.ts")}`;
}, "E:/GitHub/themeDist/src/pages/submit.astro", void 0);

const $$file = "E:/GitHub/themeDist/src/pages/submit.astro";
const $$url = "/submit";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Submit,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
