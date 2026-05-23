import { c as createComponent } from './astro-component_C4iwsvtt.mjs';
import 'piccolore';
import './ssr-function_yscoTaBG.mjs';
import 'clsx';

const $$Spec = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Spec;
  const newUrl = new URL(Astro2.url);
  newUrl.pathname = "/api/docs";
  return Astro2.redirect(newUrl.toString(), 301);
}, "E:/GitHub/themeDist/src/pages/api/spec.astro", void 0);

const $$file = "E:/GitHub/themeDist/src/pages/api/spec.astro";
const $$url = "/api/spec";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Spec,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
