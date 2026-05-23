export const prerender = false;

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

/**
 * AI 辅助主题生成
 *
 * 根据文字描述生成完整的 CSS 变量主题。
 * - 设置了 OPENAI_API_KEY 环境变量时使用 GPT-4o 生成
 * - 否则使用基于关键词的规则引擎（demo 模式）
 */

const KEYWORD_PALETTES: Record<string, Record<string, string>> = {
  dark: {
    '--color-primary': '#818cf8',
    '--color-secondary': '#a78bfa',
    '--color-accent': '#fbbf24',
    '--color-bg': '#0f172a',
    '--color-surface': '#1e293b',
    '--color-text': '#f1f5f9',
    '--color-text-muted': '#64748b',
    '--color-border': '#334155',
  },
  light: {
    '--color-primary': '#6366f1',
    '--color-secondary': '#8b5cf6',
    '--color-accent': '#06b6d4',
    '--color-bg': '#ffffff',
    '--color-surface': '#f8fafc',
    '--color-text': '#0f172a',
    '--color-text-muted': '#94a3b8',
    '--color-border': '#e2e8f0',
  },
  ocean: {
    '--color-primary': '#0891b2',
    '--color-secondary': '#06b6d4',
    '--color-accent': '#2dd4bf',
    '--color-bg': '#ecfeff',
    '--color-surface': '#cffafe',
    '--color-text': '#164e63',
    '--color-text-muted': '#5eead4',
    '--color-border': '#a5f3fc',
  },
  sunset: {
    '--color-primary': '#f97316',
    '--color-secondary': '#fb923c',
    '--color-accent': '#ef4444',
    '--color-bg': '#fff7ed',
    '--color-surface': '#ffedd5',
    '--color-text': '#7c2d12',
    '--color-text-muted': '#fdba74',
    '--color-border': '#fed7aa',
  },
  forest: {
    '--color-primary': '#16a34a',
    '--color-secondary': '#22c55e',
    '--color-accent': '#d97706',
    '--color-bg': '#f0fdf4',
    '--color-surface': '#dcfce7',
    '--color-text': '#14532d',
    '--color-text-muted': '#86efac',
    '--color-border': '#bbf7d0',
  },
  midnight: {
    '--color-primary': '#6366f1',
    '--color-secondary': '#818cf8',
    '--color-accent': '#c084fc',
    '--color-bg': '#020617',
    '--color-surface': '#0f172a',
    '--color-text': '#e2e8f0',
    '--color-text-muted': '#64748b',
    '--color-border': '#1e293b',
  },
  sakura: {
    '--color-primary': '#ec4899',
    '--color-secondary': '#f472b6',
    '--color-accent': '#a855f7',
    '--color-bg': '#fdf2f8',
    '--color-surface': '#fce7f3',
    '--color-text': '#831843',
    '--color-text-muted': '#f9a8d4',
    '--color-border': '#fbcfe8',
  },
  cyber: {
    '--color-primary': '#22d3ee',
    '--color-secondary': '#2dd4bf',
    '--color-accent': '#f43f5e',
    '--color-bg': '#020617',
    '--color-surface': '#0a0a1a',
    '--color-text': '#e2e8f0',
    '--color-text-muted': '#64748b',
    '--color-border': '#1e293b',
  },
};

function matchKeywords(text: string): string[] {
  const lower = text.toLowerCase();
  const matches: string[] = [];
  if (/海|ocean|sea|blue|aqua|水/i.test(lower)) matches.push('ocean');
  if (/日落|sunset|黄昏|orange|warm|夕/i.test(lower)) matches.push('sunset');
  if (/森林|forest|green|自然|nature|tree|草木/i.test(lower)) matches.push('forest');
  if (/暗|dark|night|夜晚|midnight|黑|深色/i.test(lower)) matches.push('midnight');
  if (/樱花|sakura|pink|粉|花|cute|甜美/i.test(lower)) matches.push('sakura');
  if (/赛博|cyber|cyberpunk|neon|霓虹|科技|tech/i.test(lower)) matches.push('cyber');
  if (/浅|light|bright|明亮|白|clean|简约/i.test(lower)) matches.push('light');
  if (/暗|dark|night|midnight|深色/i.test(lower)) matches.push('dark');
  return matches;
}

function generateFromKeywords(text: string, matches: string[]) {
  // Blend closest palette — pick the first matched or fall back based on text length hash
  const palette = matches.length > 0
    ? KEYWORD_PALETTES[matches[0]]
    : text.length % 2 === 0
      ? KEYWORD_PALETTES.light
      : KEYWORD_PALETTES.dark;

  const hueOffset = (text.length * 7 + text.charCodeAt(0) || 0) % 360;
  const adjustHue = (hex: string, offset: number): string => {
    const c = hex.replace('#', '');
    if (c.length < 6) return hex;
    const r = parseInt(c.slice(0, 2), 16);
    const g = parseInt(c.slice(2, 4), 16);
    const b = parseInt(c.slice(4, 6), 16);
    // Simple hue shift via mixing with a computed color
    const t = offset / 360;
    const nr = Math.round(r * (1 - t * 0.3) + 128 * t * 0.3);
    const ng = Math.round(g * (1 - t * 0.3) + 64 * t * 0.3);
    const nb = Math.round(b * (1 - t * 0.3) + 200 * t * 0.3);
    return `#${nr.toString(16).padStart(2, '0')}${ng.toString(16).padStart(2, '0')}${nb.toString(16).padStart(2, '0')}`;
  };

  const cssVars: Record<string, string> = {};
  for (const [key, val] of Object.entries(palette)) {
    cssVars[key] = adjustHue(val, hueOffset);
  }
  return cssVars;
}

function inferName(text: string): string {
  const maxLen = 5;
  const words = text.trim().split(/\s+/).filter(Boolean);
  // Use first few words as name
  return words.slice(0, maxLen).join(' ').slice(0, 50) || 'AI Generated';
}

function inferTags(text: string, cssVars: Record<string, string>): string[] {
  const tags: string[] = [];
  const lower = text.toLowerCase();
  const bg = cssVars['--color-bg'] || '#000';
  const bgLum = (() => {
    const c = bg.replace('#', '');
    if (c.length < 6) return 0.5;
    const r = parseInt(c.slice(0, 2), 16) / 255;
    const g = parseInt(c.slice(2, 4), 16) / 255;
    const b = parseInt(c.slice(4, 6), 16) / 255;
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  })();

  tags.push(bgLum < 0.3 ? 'dark' : 'light');

  if (/节日|holiday|圣诞|春节|中秋|国庆|christmas|new year/i.test(lower)) tags.push('holiday');
  if (/极简|minimal|clean|简约|simple/i.test(lower)) tags.push('minimal');
  if (/自然|nature|forest|ocean|海|森林|山/i.test(lower)) tags.push('nature');
  if (/科技|tech|cyber|neon|digital|赛博|数字/i.test(lower)) tags.push('tech');
  if (/复古|retro|vintage|old|怀旧/i.test(lower)) tags.push('retro');

  return tags;
}

function generateFallbackTheme(text: string) {
  const matches = matchKeywords(text);
  const cssVars = generateFromKeywords(text, matches);
  const name = inferName(text);
  const tags = inferTags(text, cssVars);

  return {
    name,
    cssVars,
    tags,
    description: `AI 根据「${text.slice(0, 80)}」生成的配色方案`,
    generatedBy: 'rule-engine',
  };
}

export async function POST({ request }: { request: Request }) {
  try {
    const body = await request.json();
    const { description } = body;

    if (!description || typeof description !== 'string' || description.trim().length === 0) {
      return new Response(JSON.stringify({ error: '请提供主题描述文字' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...CORS },
      });
    }

    const key = import.meta.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY;

    if (key && key.length > 10) {
      // AI-powered generation via OpenAI
      try {
        const prompt = `你是一位专业的主题配色设计师。根据用户的文字描述，生成一套完整的 CSS 变量主题配色方案。

用户描述: "${description}"

## 色彩设计法则
- 主色(primary)定义主题性格，辅色(secondary)作邻近过渡，强调色(accent)用对比色/补色制造视觉焦点
- 背景(bg)→表面(surface)→边框(border)→弱化文字(text-muted)→主文字(text) 亮度逐层递增或递减
- 主文字与背景对比度 ≥ 7:1，确保清晰可读
- ambient 氛围色从主色/辅色派生，降低饱和度融入背景
- 阴影使用带色彩倾向的半透明色而非纯黑

## 特效设计要求（customCss 必须实现）
- 必须根据用户描述生成主题相关的纯 CSS 特效动画，**禁止返回空字符串**
- 只能使用纯 CSS（@keyframes 动画、伪元素 ::before/::after、渐变、滤镜、box-shadow），禁止 JavaScript
- 特效方向参考：
  · 赛博朋克 → 霓虹发光边框、扫描线 overlay、故障闪烁 glitch、数字雨粒子
  · 自然/森林 → 飘落叶片、浮动光点、柔和呼吸光晕
  · 海洋 → 波浪动画、浮动气泡
  · 暗黑/星空 → 闪烁星光、流星划过
  · 樱花/甜美 → 飘落花瓣、渐变柔光
  · 节日 → 飘落雪花、闪烁彩灯
  · 复古 → 胶片颗粒噪点、扫描线、暖色辉光
- @keyframes 使用语义化命名

## 必须返回完整的 cssVars（全部 34 项）

### 颜色
--color-primary / --color-secondary / --color-accent / --color-bg / --color-surface / --color-text / --color-text-muted / --color-border

### 氛围
--ambient-1 / --ambient-2

### 阴影
--shadow-sm / --shadow-md / --shadow-lg

### 毛玻璃
--glass-bg / --glass-blur

### 布局
--radii / --content-max

### 字体
--font-heading / --font-body / --font-mono

### 字号
--text-base / --text-lg / --text-xl / --text-2xl / --text-sm

### 间距
--space-unit / --space-1 / --space-2 / --space-3 / --space-4 / --space-6 / --space-8 / --space-12

### 其他
--noise-opacity

返回**纯净 JSON**（不要 markdown 包裹），格式：
{
  "name": "主题名称（中文，2-8字）",
  "tags": ["dark/light", "vibrant/minimal", "warm/cool"],
  "cssVars": { 全部 34 个 CSS 变量 },
  "customCss": "必须：与主题描述匹配的纯 CSS 特效动画（@keyframes + 伪元素实现粒子掉落、霓虹发光等）。禁止返回空字符串"
}`;

        const aiRes = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${key}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.8,
            max_tokens: 4000,
          }),
        });

        if (aiRes.ok) {
          const aiData = await aiRes.json();
          const content = aiData.choices?.[0]?.message?.content || '';
          const cleanJson = content.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '');
          const generated = JSON.parse(cleanJson);

          return new Response(JSON.stringify({
            ...generated,
            description,
            generatedBy: 'openai',
          }), {
            status: 200,
            headers: { 'Content-Type': 'application/json', ...CORS },
          });
        }
      } catch {
        // Fall through to rule engine on AI failure
      }
    }

    // Fallback: keyword-based generation
    const result = generateFallbackTheme(description);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...CORS },
    });
  } catch {
    return new Response(JSON.stringify({ error: '请求格式错误' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...CORS },
    });
  }
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}
