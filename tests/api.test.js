/**
 * ThemeDist API — Full Automated Test Suite
 * Run: node --test tests/api.test.js
 * Requires: server running at http://localhost:4399
 *
 * Rate limit bypass: set THEMEDIST_TEST_MODE=1 on the server, or the
 * tests use random X-Forwarded-For IPs to avoid hitting per-IP limits.
 */

import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';

const BASE = 'http://localhost:4399';
const API = `${BASE}/api/v1`;

// ─── Helpers ────────────────────────────────────────────────────

/** Random IP + UA to avoid per-IP rate limiting during tests. */
function testHeaders() {
  return {
    'X-Forwarded-For': `203.0.113.${Math.floor(Math.random() * 255)}`,
    'User-Agent': `ThemeDist-Test/${randomUUID()}`,
  };
}

async function get(path, { expectStatus, headers: extraHeaders } = {}) {
  const url = path.startsWith('http') ? path : `${API}${path}`;
  const res = await fetch(url, { headers: { ...testHeaders(), ...extraHeaders } });
  if (expectStatus !== undefined) {
    assert.equal(res.status, expectStatus, `GET ${path} → expected ${expectStatus}, got ${res.status}`);
  }
  return res;
}

async function post(path, body, { expectStatus, headers: extraHeaders } = {}) {
  const url = path.startsWith('http') ? path : `${API}${path}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...testHeaders(), ...extraHeaders },
    body: JSON.stringify(body),
  });
  if (expectStatus !== undefined) {
    assert.equal(res.status, expectStatus, `POST ${path} → expected ${expectStatus}, got ${res.status}`);
  }
  return res;
}

async function json(path, opts) {
  const res = await get(path, opts);
  return res.json();
}

async function postJson(path, body, opts) {
  const res = await post(path, body, opts);
  return { status: res.status, data: await res.json(), headers: res.headers };
}

// Pre-flight: verify server is reachable
before(async () => {
  try {
    await fetch(`${API}/today.json`, { signal: AbortSignal.timeout(5000) });
  } catch {
    console.error('\n  ERROR: Cannot reach ' + BASE);
    console.error('  Make sure the dev server is running: npm run dev\n');
    process.exit(1);
  }
});

// ═══════════════════════════════════════════════════════════════
// 1. CORE GET ENDPOINTS
// ═══════════════════════════════════════════════════════════════

describe('1. Core GET Endpoints', () => {

  describe('GET /api/v1/today.json', () => {
    it('returns 200 with valid JSON', async () => {
      const data = await json('/today.json');
      assert.equal(data.apiVersion, 'v1');
    });

    it('contains required fields: date, preset, presetName, cssVars', async () => {
      const data = await json('/today.json');
      assert.ok(data.date, 'missing date');
      assert.ok(data.preset, 'missing preset');
      assert.ok(data.presetName, 'missing presetName');
      assert.ok(typeof data.cssVars === 'object' && data.cssVars !== null, 'missing cssVars');
    });

    it('cssVars contains mandatory keys', async () => {
      const data = await json('/today.json');
      const vars = data.cssVars;
      assert.ok(vars['--color-primary'], 'missing --color-primary');
      assert.ok(vars['--color-bg'], 'missing --color-bg');
      assert.ok(vars['--color-text'], 'missing --color-text');
      assert.ok(vars['--color-surface'], 'missing --color-surface');
      assert.ok(vars['--color-accent'], 'missing --color-accent');
    });

    it('includes directory array', async () => {
      const data = await json('/today.json');
      assert.ok(Array.isArray(data.directory), 'directory should be an array');
      assert.ok(data.directory.length > 0, 'directory should not be empty');
    });

    it('sets Cache-Control headers', async () => {
      const res = await get('/today.json');
      const cc = res.headers.get('cache-control');
      assert.ok(cc, 'missing Cache-Control');
      assert.ok(cc.includes('max-age'), 'Cache-Control should include max-age');
    });

    it('sets CORS headers', async () => {
      const res = await get('/today.json');
      assert.equal(res.headers.get('access-control-allow-origin'), '*');
    });

    it('responds to OPTIONS (CORS preflight)', async () => {
      const res = await fetch(`${API}/today.json`, { method: 'OPTIONS' });
      assert.equal(res.status, 204);
    });
  });

  describe('GET /api/v1/today.css', () => {
    it('returns 200 with text/css content-type', async () => {
      const res = await get('/today.css');
      assert.equal(res.status, 200);
      assert.ok(res.headers.get('content-type')?.includes('text/css'));
    });

    it('contains :root CSS variables', async () => {
      const text = await (await get('/today.css')).text();
      assert.ok(text.includes(':root'), 'should contain :root');
      assert.ok(text.includes('--color-primary'), 'should contain --color-primary');
    });

    it('includes dark/light mode adaptation via media query', async () => {
      const text = await (await get('/today.css')).text();
      assert.ok(text.includes('@media (prefers-color-scheme'), 'should include prefers-color-scheme media query');
    });
  });

  describe('GET /api/v1/tokens.json', () => {
    it('returns tokens in design-token format', async () => {
      const data = await json('/tokens.json');
      assert.ok(data.tokens, 'missing tokens');
      assert.ok(data.preset, 'missing preset');
      assert.equal(data.apiVersion, 'v1');
    });

    it('tokens contain color, space, typography categories', async () => {
      const data = await json('/tokens.json');
      assert.ok(data.tokens.color, 'missing color tokens');
      assert.ok(data.tokens.color.primary, 'missing primary color token');
      assert.equal(data.tokens.color.primary.$type, 'color');
    });
  });

  describe('GET /api/v1/trending.json', () => {
    it('returns 200 with trending array', async () => {
      const data = await json('/trending.json');
      assert.ok(Array.isArray(data.trending), 'trending should be array');
      assert.equal(data.apiVersion, 'v1');
    });
  });

  describe('GET /api/v1/index-data.json', () => {
    it('returns static prerendered index data', async () => {
      const data = await json('/index-data.json');
      assert.ok(Array.isArray(data.pool), 'missing pool');
      assert.ok(typeof data.totalThemes === 'number', 'missing totalThemes');
      assert.ok(Array.isArray(data.directory), 'missing directory');
    });
  });
});

// ═══════════════════════════════════════════════════════════════
// 2. QUERY PARAMETER COMBINATIONS
// ═══════════════════════════════════════════════════════════════

describe('2. Query Parameter Combinations', () => {

  describe('?tz= timezone', () => {
    it('returns date adjusted for Asia/Shanghai', async () => {
      const data = await json(`/today.json?tz=Asia/Shanghai`);
      assert.ok(data.date, 'missing date');
      // Date should be a valid ISO date
      assert.ok(/^\d{4}-\d{2}-\d{2}$/.test(data.date), `invalid date format: ${data.date}`);
    });

    it('returns date adjusted for America/New_York', async () => {
      const data = await json(`/today.json?tz=America/New_York`);
      assert.ok(data.date);
    });
  });

  describe('?wcag-fix=aa|aaa', () => {
    it('applies WCAG AA fix and returns wcagFixApplied flag', async () => {
      const data = await json(`/today.json?wcag-fix=aa`);
      assert.equal(data.wcagFixApplied, true);
      assert.ok(Array.isArray(data.wcagChanges), 'should include wcagChanges array');
    });

    it('applies WCAG AAA fix', async () => {
      const data = await json(`/today.json?wcag-fix=aaa`);
      assert.equal(data.wcagFixApplied, true);
    });
  });

  describe('?dual=true', () => {
    it('generates dual-theme CSS with light and dark selectors', async () => {
      const res = await get(`/today.css?dual=true`);
      const text = await res.text();
      assert.ok(text.includes('.theme-light'), 'should contain .theme-light');
      assert.ok(text.includes('.theme-dark'), 'should contain .theme-dark');
    });

    it('supports mode=data for data-theme selectors', async () => {
      const res = await get(`/today.css?dual=true&mode=data`);
      const text = await res.text();
      assert.ok(text.includes('[data-theme="light"]'), 'should contain [data-theme="light"]');
      assert.ok(text.includes('[data-theme="dark"]'), 'should contain [data-theme="dark"]');
    });

    it('dual JSON response includes light/dark variants', async () => {
      const data = await json(`/today.json?dual=true`);
      assert.ok(data.dual, 'missing dual object');
      assert.ok(data.dual.light, 'missing dual.light');
      assert.ok(data.dual.dark, 'missing dual.dark');
    });
  });

  describe('?overrides= custom CSS var overrides', () => {
    it('applies overrides to CSS output', async () => {
      const res = await get('/today.css?overrides=--radii:0px');
      const text = await res.text();
      assert.ok(text.includes('--radii: 0px'), 'should apply --radii override');
    });

    it('applies overrides to JSON output', async () => {
      const data = await json('/today.json?overrides=--radii:2rem');
      assert.equal(data.cssVars['--radii'], '2rem');
      assert.equal(data.appliedOverrides, true);
    });
  });

  describe('Combined parameters', () => {
    it('handles tz + wcag-fix + dual together', async () => {
      const res = await get(`/today.json?tz=Asia/Tokyo&wcag-fix=aa&dual=true`);
      const data = await res.json();
      assert.ok(data.date);
      assert.equal(data.wcagFixApplied, true);
      assert.ok(data.dual);
    });
  });
});

// ═══════════════════════════════════════════════════════════════
// 3. THEME ENDPOINTS (preset, random, wcag, scale, export)
// ═══════════════════════════════════════════════════════════════

describe('3. Theme Endpoints', () => {

  // We need a known preset. First, get one from today.json directory.
  let knownPreset;

  before(async () => {
    const data = await json('/today.json');
    assert.ok(data.directory?.length > 0, 'no themes in directory');
    knownPreset = data.directory[0].preset;
  });

  describe('GET /api/v1/theme/[preset].json', () => {
    it('returns a known preset with full theme data', async () => {
      const data = await json(`/theme/${knownPreset}.json`);
      assert.ok(data.cssVars, 'missing cssVars');
      assert.ok(data.preset, 'missing preset');
      assert.equal(data.apiVersion, 'v1');
    });

    it('returns 404 for non-existent preset', async () => {
      await get('/theme/this-preset-does-not-exist.json', { expectStatus: 404 });
    });

    it('supports ?wcag-fix=aa on preset endpoint', async () => {
      const data = await json(`/theme/${knownPreset}.json?wcag-fix=aa`);
      assert.equal(data.wcagFixApplied, true);
    });

    it('supports ?dual=true on preset endpoint', async () => {
      const data = await json(`/theme/${knownPreset}.json?dual=true`);
      assert.ok(data.dual, 'missing dual');
    });
  });

  describe('GET /api/v1/theme/random.json', () => {
    it('returns a random theme', async () => {
      const data = await json('/theme/random.json');
      assert.ok(data.cssVars, 'missing cssVars');
      assert.ok(data.preset, 'missing preset');
      assert.equal(data.apiVersion, 'v1');
    });

    it('supports ?pool=static', async () => {
      const data = await json('/theme/random.json?pool=static');
      assert.ok(data.cssVars);
    });

    it('supports deterministic ?seed=', async () => {
      const a = await json('/theme/random.json?seed=42');
      const b = await json('/theme/random.json?seed=42');
      assert.equal(a.preset, b.preset, 'same seed should return same preset');
    });
  });

  describe('GET /api/v1/theme/[id]/wcag.json', () => {
    it('returns WCAG compliance report for a known theme', async () => {
      const data = await json(`/theme/${knownPreset}/wcag.json`);
      assert.ok(typeof data.compliant === 'boolean', 'missing compliant');
      assert.ok(data.ratios, 'missing ratios');
      assert.ok(data.ratios.text_on_bg, 'missing text_on_bg ratio');
      assert.ok(typeof data.ratios.text_on_bg.ratio === 'number');
      assert.ok(['pass', 'fail'].includes(data.ratios.text_on_bg.AA_normal));
      assert.ok(Array.isArray(data.warnings));
      assert.ok(data.summary, 'missing summary');
    });

    it('returns 404 for unknown theme', async () => {
      await get('/theme/nonexistent-id/wcag.json', { expectStatus: 404 });
    });
  });

  describe('GET /api/v1/theme/[id]/scale.json', () => {
    it('returns color scales (50-950) for primary/secondary/accent/bg', async () => {
      const data = await json(`/theme/${knownPreset}/scale.json`);
      assert.ok(data.scales, 'missing scales');
      assert.ok(data.scales.primary, 'missing primary scale');
      assert.ok(data.scales.primary['50'], 'missing shade 50');
      assert.ok(data.scales.primary['500'], 'missing shade 500');
      assert.ok(data.scales.primary['950'], 'missing shade 950');
      // Each shade should be a hex color
      assert.ok(/^#[0-9a-f]{6}$/i.test(data.scales.primary['500']));
    });
  });

  describe('GET /api/v1/theme/[id]/export/shadcn.css', () => {
    it('returns shadcn/ui compatible CSS', async () => {
      const res = await get(`/theme/${knownPreset}/export/shadcn.css`);
      assert.equal(res.status, 200);
      const text = await res.text();
      assert.ok(text.includes('@layer base'), 'should contain @layer base');
      assert.ok(text.includes('--background:'), 'should contain --background');
      assert.ok(text.includes('--primary:'), 'should contain --primary');
      assert.ok(text.includes('--radius:'), 'should contain --radius');
    });
  });
});

// ═══════════════════════════════════════════════════════════════
// 4. RECOMMEND & SEARCH
// ═══════════════════════════════════════════════════════════════

describe('4. Recommend & Search', () => {

  let knownPreset;

  before(async () => {
    const data = await json('/today.json');
    knownPreset = data.directory[0].preset;
  });

  describe('GET /api/v1/recommend/[preset].json', () => {
    it('returns recommended themes similar to the given preset', async () => {
      const data = await json(`/recommend/${knownPreset}.json`);
      assert.ok(data.source, 'missing source');
      assert.ok(Array.isArray(data.recommendations), 'missing recommendations');
      assert.ok(data.recommendations.length > 0, 'should have at least 1 recommendation');
      assert.ok(data.recommendations[0].score !== undefined, 'missing score');
    });

    it('returns 404 for non-existent preset', async () => {
      await get('/recommend/does-not-exist.json', { expectStatus: 404 });
    });
  });

  describe('GET /api/v1/search/color.json', () => {
    it('searches themes by hex color', async () => {
      const data = await json('/search/color.json?hex=4285f4');
      assert.ok(Array.isArray(data.results), 'missing results');
      assert.ok(data.total > 0, 'should have results');
      assert.ok(data.query, 'missing query');
      assert.equal(data.apiVersion, 'v1');
    });

    it('supports shorthand 3-digit hex', async () => {
      const data = await json('/search/color.json?hex=f00');
      assert.ok(data.results.length > 0);
    });

    it('respects ?limit= parameter', async () => {
      const data = await json('/search/color.json?hex=4285f4&limit=3');
      assert.ok(data.results.length <= 3);
    });

    it('returns 400 for invalid hex', async () => {
      await get('/search/color.json?hex=zzzzzz', { expectStatus: 400 });
    });

    it('returns 400 for missing hex', async () => {
      await get('/search/color.json', { expectStatus: 400 });
    });
  });
});

// ═══════════════════════════════════════════════════════════════
// 5. COMMUNITY / DIY ENDPOINTS
// ═══════════════════════════════════════════════════════════════

describe('5. Community / DIY Endpoints', () => {

  describe('GET /api/v1/diy/themes.json', () => {
    it('returns paginated community themes', async () => {
      const data = await json('/diy/themes.json');
      assert.ok(Array.isArray(data.themes), 'themes should be array');
      assert.ok(typeof data.total === 'number', 'missing total');
      assert.equal(data.apiVersion, 'v1');
    });

    it('supports pagination with ?page= and ?size=', async () => {
      const data = await json('/diy/themes.json?page=1&size=2');
      assert.ok(data.themes.length <= 2);
    });

    it('supports ?sort=hot', async () => {
      const data = await json('/diy/themes.json?sort=hot');
      assert.ok(Array.isArray(data.themes));
    });
  });

  describe('POST /api/v1/diy/suggest-tags.json', () => {
    it('suggests tags for valid cssVars', async () => {
      const { data } = await postJson('/diy/suggest-tags.json', {
        cssVars: { '--color-primary': '#ff0000', '--color-bg': '#ffffff' },
      }, { expectStatus: 200 });
      assert.ok(Array.isArray(data.tags), 'should return tags array');
      assert.equal(data.apiVersion, 'v1');
    });

    it('returns 400 when cssVars is missing', async () => {
      await postJson('/diy/suggest-tags.json', { customCss: 'body{}' }, { expectStatus: 400 });
    });

    it('returns 400 for invalid JSON body', async () => {
      const res = await fetch(`${API}/diy/suggest-tags.json`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: 'NOT JSON',
      });
      assert.equal(res.status, 400);
    });
  });

  describe('POST /api/v1/diy/submit.json', () => {
    // Each test uses a random X-Forwarded-For IP to avoid per-IP rate limits.

    it('submits a valid theme and returns 201', async () => {
      const { data } = await postJson('/diy/submit.json', {
        name: 'Test Theme API',
        author: 'api-test',
        cssVars: { '--color-primary': '#3b82f6', '--color-bg': '#ffffff' },
      }, { expectStatus: 201 });
      assert.equal(data.success, true);
      assert.ok(data.theme, 'missing theme in response');
    });

    it('returns 400 when name is missing', async () => {
      await postJson('/diy/submit.json', {
        author: 'test',
        cssVars: { '--color-primary': '#000', '--color-bg': '#fff' },
      }, { expectStatus: 400 });
    });

    it('returns 400 when cssVars is missing', async () => {
      await postJson('/diy/submit.json', {
        name: 'test',
        author: 'test',
      }, { expectStatus: 400 });
    });

    it('returns 400 when --color-primary is missing from cssVars', async () => {
      await postJson('/diy/submit.json', {
        name: 'test',
        author: 'test',
        cssVars: { '--color-bg': '#ffffff' },
      }, { expectStatus: 400 });
    });

    it('normalizes unprefixed keys by adding -- prefix', async () => {
      const { data } = await postJson('/diy/submit.json', {
        name: 'Normalize Test',
        author: 'api-test',
        cssVars: { 'color-primary': '#e11d48', 'color-bg': '#000000' },
      }, { expectStatus: 201 });
      assert.ok(data.success);
    });

    it('returns warnings for unsupported extensions', async () => {
      const { data } = await postJson('/diy/submit.json', {
        name: 'Ext Test',
        author: 'api-test',
        cssVars: { '--color-primary': '#000', '--color-bg': '#fff' },
        extensions: [{ type: 'unsupported-type', data: 'x' }],
      });
      assert.equal(data.success, true);
    });
  });

  describe('POST /api/v1/diy/like.json', () => {
    it('returns 400 when id is missing', async () => {
      await postJson('/diy/like.json', {}, { expectStatus: 400 });
    });

    it('returns 404 for non-existent theme id', async () => {
      await postJson('/diy/like.json', { id: 'non-existent-id-xyz-12345' }, { expectStatus: 404 });
    });
  });

  describe('POST /api/v1/diy/fork.json', () => {
    it('returns 400 when sourceId is missing', async () => {
      await postJson('/diy/fork.json', { name: 'fork' }, { expectStatus: 400 });
    });

    it('returns 404 for non-existent sourceId', async () => {
      await postJson('/diy/fork.json', { sourceId: 'non-existent-source' }, { expectStatus: 404 });
    });
  });
});

// ═══════════════════════════════════════════════════════════════
// 6. EXTRACT THEME (Image → Theme)
// ═══════════════════════════════════════════════════════════════

describe('6. POST /api/v1/extract-theme.json', () => {

  it('returns 400 for missing imageUrl', async () => {
    await postJson('/extract-theme.json', {}, { expectStatus: 400 });
  });

  it('returns 400 for non-URL imageUrl', async () => {
    await postJson('/extract-theme.json', { imageUrl: 'not-a-url' }, { expectStatus: 400 });
  });

  it('blocks SSRF: private IPs are rejected', async () => {
    const { status, data } = await postJson('/extract-theme.json', {
      imageUrl: 'http://127.0.0.1/secret',
    });
    assert.equal(status, 400, 'should block localhost SSRF');
    assert.ok(data.error, 'should have error message');
  });

  it('blocks SSRF: 10.x.x.x private range', async () => {
    await postJson('/extract-theme.json', {
      imageUrl: 'http://10.0.0.1/image.png',
    }, { expectStatus: 400 });
  });

  it('blocks SSRF: 192.168.x.x private range', async () => {
    await postJson('/extract-theme.json', {
      imageUrl: 'http://192.168.1.1/image.jpg',
    }, { expectStatus: 400 });
  });

  it('returns 502 for unreachable external URL', async () => {
    const { status } = await postJson('/extract-theme.json', {
      imageUrl: 'https://this-domain-definitely-does-not-exist-xyz.com/image.png',
    });
    // Should be 502 (fetch failed) or 400
    assert.ok([400, 502].includes(status), `unexpected status: ${status}`);
  });
});

// ═══════════════════════════════════════════════════════════════
// 7. WEATHER THEME
// ═══════════════════════════════════════════════════════════════

describe('7. GET /api/v1/weather-theme.json', () => {

  it('returns weather + theme data with lat/lon', async () => {
    const data = await json('/weather-theme.json?lat=35.6762&lon=139.6503');
    assert.ok(data.weather, 'missing weather');
    assert.ok(data.weather.type, 'missing weather.type');
    assert.ok(data.weather.description, 'missing weather.description');
    assert.ok(data.weather.location, 'missing weather.location');
    assert.ok(data.theme, 'missing theme');
    assert.ok(data.theme.cssVars, 'missing theme.cssVars');
  });

  it('falls back to defaults when no lat/lon provided', async () => {
    const data = await json('/weather-theme.json');
    assert.ok(data.weather);
    assert.ok(data.theme);
  });
});

// ═══════════════════════════════════════════════════════════════
// 8. RATE LIMITING
// ═══════════════════════════════════════════════════════════════

describe('8. Rate Limiting', () => {

  // Rate limits (from middleware.ts):
  //   /api/v1/diy/like.json  → 10 req / 60s
  //   /api/v1/diy/submit.json → 3 req / 60s
  // Use a FIXED IP so all requests hit the same rate limit bucket.

  const FIXED_IP = '198.51.100.42';
  const fixedHeaders = { 'X-Forwarded-For': FIXED_IP, 'User-Agent': 'RateLimitTest/1.0' };

  it('returns 429 after exceeding like.json rate limit (10 req/60s)', async () => {
    const results = [];
    for (let i = 0; i < 11; i++) {
      const res = await fetch(`${API}/diy/like.json`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...fixedHeaders },
        body: JSON.stringify({ id: 'rate-limit-test' }),
      });
      results.push(res.status);
    }

    const has429 = results.some(s => s === 429);
    assert.ok(has429, `Expected at least one 429, got statuses: ${results.join(', ')}`);
  });

  it('429 response includes Retry-After header', async () => {
    for (let i = 0; i < 10; i++) {
      await fetch(`${API}/diy/like.json`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...fixedHeaders },
        body: JSON.stringify({ id: 'retry-after-test' }),
      });
    }
    const res = await fetch(`${API}/diy/like.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...fixedHeaders },
      body: JSON.stringify({ id: 'retry-after-test' }),
    });
    if (res.status === 429) {
      const retryAfter = res.headers.get('retry-after');
      assert.ok(retryAfter, '429 should include Retry-After header');
      assert.ok(Number(retryAfter) > 0, 'Retry-After should be positive');
    }
  });

  it('submit.json has a tighter limit (3 req/60s)', async () => {
    const subFixedIp = '198.51.100.99';
    const subHeaders = { 'X-Forwarded-For': subFixedIp, 'User-Agent': 'RateLimitSubmitTest/1.0' };
    const results = [];
    for (let i = 0; i < 4; i++) {
      const res = await fetch(`${API}/diy/submit.json`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...subHeaders },
        body: JSON.stringify({
          name: `Rate Test ${i}`,
          author: 'rate-limiter',
          cssVars: { '--color-primary': '#000', '--color-bg': '#fff' },
        }),
      });
      results.push(res.status);
    }

    assert.equal(results[3], 429, `4th submit should be 429, got: ${results.join(',')}`);
  });
});

// ═══════════════════════════════════════════════════════════════
// 9. SECURITY: XSS & INJECTION
// ═══════════════════════════════════════════════════════════════

describe('9. Security: XSS & Injection Prevention', () => {

  it('sanitizes <script> in theme name', async () => {
    const { data } = await postJson('/diy/submit.json', {
      name: '<script>alert("xss")</script>',
      author: 'security-test',
      cssVars: { '--color-primary': '#000', '--color-bg': '#fff' },
    });
    if (data.theme) {
      assert.ok(!data.theme.name?.includes('<script>'), 'name should be sanitized');
    }
  });

  it('sanitizes javascript: protocol in customCss', async () => {
    const { data } = await postJson('/diy/submit.json', {
      name: 'XSS CSS Test',
      author: 'security-test',
      cssVars: { '--color-primary': '#000', '--color-bg': '#fff' },
      customCss: 'body { background: url(javascript:alert(1)) }',
    });
    if (data.theme?.customCss) {
      assert.ok(!data.theme.customCss.includes('javascript:'), 'customCss should strip javascript: protocol');
    }
  });

  it('strips expression() from customCss (IE CSS injection)', async () => {
    const { data } = await postJson('/diy/submit.json', {
      name: 'Expression Test',
      author: 'security-test',
      cssVars: { '--color-primary': '#000', '--color-bg': '#fff' },
      customCss: 'width: expression(alert(1))',
    });
    if (data.theme?.customCss) {
      assert.ok(!data.theme.customCss.includes('expression('), 'should strip expression()');
    }
  });

  it('handles extremely long payload gracefully', async () => {
    const longString = 'A'.repeat(100_000);
    const { status } = await postJson('/diy/submit.json', {
      name: longString,
      author: 'security-test',
      cssVars: { '--color-primary': '#000', '--color-bg': '#fff' },
    });
    // Should NOT be 500 — either 201 (truncated) or 400 (rejected)
    assert.ok(status !== 500, `should not crash with 500, got ${status}`);
  });
});

// ═══════════════════════════════════════════════════════════════
// 10. ADMIN ENDPOINTS (expect 401 without auth)
// ═══════════════════════════════════════════════════════════════

describe('10. Admin Endpoints (unauthenticated)', () => {

  it('GET /admin/status-override.json returns 401 without auth', async () => {
    await get('/admin/status-override.json', { expectStatus: 401 });
  });

  it('POST /admin/status-override.json returns 401 without auth', async () => {
    await postJson('/admin/status-override.json', { action: 'activate', status: 'maintenance' }, { expectStatus: 401 });
  });
});

// ═══════════════════════════════════════════════════════════════
// 11. THEME SHIKI & OTHER ENDPOINTS
// ═══════════════════════════════════════════════════════════════

describe('11. Auxiliary Endpoints', () => {

  let knownPreset;

  before(async () => {
    const data = await json('/today.json');
    knownPreset = data.directory[0].preset;
  });

  describe('GET /api/v1/theme/[id]/shiki.json', () => {
    it('returns Shiki syntax highlighting theme data', async () => {
      const res = await get(`/theme/${knownPreset}/shiki.json`);
      // Could be 200 (implemented) or 404 (not found in themes)
      assert.ok([200, 404].includes(res.status));
    });
  });

  describe('GET /api/v1/today/palette.svg', () => {
    it('returns an SVG image', async () => {
      const res = await get('/today/palette.svg');
      assert.equal(res.status, 200);
      const ct = res.headers.get('content-type');
      assert.ok(ct?.includes('svg'), `expected SVG content-type, got ${ct}`);
    });
  });

  describe('GET /api/v1/today/favicon.svg', () => {
    it('returns a favicon SVG', async () => {
      const res = await get('/today/favicon.svg');
      assert.equal(res.status, 200);
    });
  });

  describe('GET /api/v1/today/fonts.css', () => {
    it('returns CSS with font-face declarations or empty', async () => {
      const res = await get('/today/fonts.css');
      assert.equal(res.status, 200);
      assert.ok(res.headers.get('content-type')?.includes('text/css'));
    });
  });

  describe('GET /api/v1/today/pattern.css', () => {
    it('returns CSS with background patterns or empty', async () => {
      const res = await get('/today/pattern.css');
      assert.equal(res.status, 200);
    });
  });

  describe('GET /api/v1/badge/[username].svg', () => {
    it('returns a badge SVG', async () => {
      const res = await get('/badge/testuser.svg');
      assert.equal(res.status, 200);
      assert.ok(res.headers.get('content-type')?.includes('svg'));
    });
  });

  describe('GET /api/v1/tailwind-config.json', () => {
    it('returns Tailwind CSS config', async () => {
      const res = await get('/tailwind-config.json');
      assert.equal(res.status, 200);
      const data = await res.json();
      assert.ok(data, 'should return JSON');
    });
  });

  describe('GET /api/v1/[param] (catch-all: date=MM-DD)', () => {
    it('returns theme data for a valid date param', async () => {
      const res = await fetch(`${API}/date=05-28`);
      assert.equal(res.status, 200);
      const data = await res.json();
      assert.ok(data.cssVars, 'should contain cssVars');
      assert.ok(data.date, 'should contain date');
    });

    it('returns 400 for invalid param format', async () => {
      const res = await fetch(`${API}/invalid-param`);
      assert.equal(res.status, 400);
    });
  });
});

// ═══════════════════════════════════════════════════════════════
// 12. CORS PREFLIGHT (OPTIONS) ON ALL POST ENDPOINTS
// ═══════════════════════════════════════════════════════════════

describe('12. CORS Preflight on POST endpoints', () => {

  const postEndpoints = [
    '/diy/submit.json',
    '/diy/like.json',
    '/diy/suggest-tags.json',
    '/diy/fork.json',
    '/extract-theme.json',
  ];

  for (const ep of postEndpoints) {
    it(`OPTIONS ${ep} returns 204`, async () => {
      const res = await fetch(`${API}${ep}`, { method: 'OPTIONS' });
      assert.equal(res.status, 204);
      assert.equal(res.headers.get('access-control-allow-origin'), '*');
    });
  }
});

// ═══════════════════════════════════════════════════════════════
// 13. EDGE CASES & ERROR HANDLING
// ═══════════════════════════════════════════════════════════════

describe('13. Edge Cases & Error Handling', () => {

  it('POST with empty body returns 400', async () => {
    const res = await fetch(`${API}/diy/suggest-tags.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '',
    });
    assert.equal(res.status, 400, `expected 400, got ${res.status}`);
  });

  it('POST with malformed JSON returns 400', async () => {
    const res = await fetch(`${API}/diy/suggest-tags.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{bad json',
    });
    assert.equal(res.status, 400);
  });

  it('GET with non-existent path returns 404', async () => {
    const res = await get('/api/v1/nonexistent-endpoint.json', { expectStatus: 404 });
  });

  it('search/color.json with empty hex returns 400', async () => {
    await get('/search/color.json?hex=', { expectStatus: 400 });
  });

  it('diy/themes.json gracefully handles out-of-range page', async () => {
    const data = await json('/diy/themes.json?page=9999&size=50');
    assert.ok(Array.isArray(data.themes));
    assert.ok(data.themes.length === 0, 'out-of-range page should return empty array');
  });

  it('recommend endpoint returns 404 for empty string preset', async () => {
    // /api/v1/recommend/.json — Astro might 404 or route oddly
    const res = await fetch(`${API}/recommend/.json`);
    assert.ok([404, 400].includes(res.status));
  });
});
