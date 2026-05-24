/**
 * Theme access layer — all themes flow through omni-bridge as the single pipeline.
 * OmniConfig entries, community themes, and fallback themes all conform to ComposedTheme.
 */
export { getOmniDailyTheme as getDailyTheme, getAllOmniThemes as getAllThemes, omniToComposed } from './omni-bridge';
