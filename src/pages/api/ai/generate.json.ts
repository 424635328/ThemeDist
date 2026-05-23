export const prerender = false;

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

/**
 * AI 辅助主题生成
 *
 * 根据文字描述生成完整的 CSS 变量主题。
 * - 设置了 OPENAI_API_KEY 环境变量时使用 GPT 生成
 * - 否则使用基于关键词的规则引擎（demo 模式）
 */

const KEYWORD_PALETTES: Record<string, Record<string, string>> = {
  dark: {
    '--color-primary': '#818cf8', '--color-secondary': '#a78bfa', '--color-accent': '#fbbf24',
    '--color-bg': '#0f172a', '--color-surface': '#1e293b', '--color-text': '#f1f5f9',
    '--color-text-muted': '#64748b', '--color-border': '#334155',
  },
  light: {
    '--color-primary': '#6366f1', '--color-secondary': '#8b5cf6', '--color-accent': '#06b6d4',
    '--color-bg': '#ffffff', '--color-surface': '#f8fafc', '--color-text': '#0f172a',
    '--color-text-muted': '#94a3b8', '--color-border': '#e2e8f0',
  },
  ocean: {
    '--color-primary': '#0891b2', '--color-secondary': '#06b6d4', '--color-accent': '#2dd4bf',
    '--color-bg': '#ecfeff', '--color-surface': '#cffafe', '--color-text': '#164e63',
    '--color-text-muted': '#5eead4', '--color-border': '#a5f3fc',
  },
  sunset: {
    '--color-primary': '#f97316', '--color-secondary': '#fb923c', '--color-accent': '#ef4444',
    '--color-bg': '#fff7ed', '--color-surface': '#ffedd5', '--color-text': '#7c2d12',
    '--color-text-muted': '#fdba74', '--color-border': '#fed7aa',
  },
  forest: {
    '--color-primary': '#16a34a', '--color-secondary': '#22c55e', '--color-accent': '#d97706',
    '--color-bg': '#f0fdf4', '--color-surface': '#dcfce7', '--color-text': '#14532d',
    '--color-text-muted': '#86efac', '--color-border': '#bbf7d0',
  },
  midnight: {
    '--color-primary': '#6366f1', '--color-secondary': '#818cf8', '--color-accent': '#c084fc',
    '--color-bg': '#020617', '--color-surface': '#0f172a', '--color-text': '#e2e8f0',
    '--color-text-muted': '#64748b', '--color-border': '#1e293b',
  },
  sakura: {
    '--color-primary': '#ec4899', '--color-secondary': '#f472b6', '--color-accent': '#a855f7',
    '--color-bg': '#fdf2f8', '--color-surface': '#fce7f3', '--color-text': '#831843',
    '--color-text-muted': '#f9a8d4', '--color-border': '#fbcfe8',
  },
  cyber: {
    '--color-primary': '#22d3ee', '--color-secondary': '#2dd4bf', '--color-accent': '#f43f5e',
    '--color-bg': '#020617', '--color-surface': '#0a0a1a', '--color-text': '#e2e8f0',
    '--color-text-muted': '#64748b', '--color-border': '#1e293b',
  },
};

// 补全生成主题必备的其他 CSS 变量
const DEFAULT_VARS: Record<string, string> = {
  '--ambient-1': 'rgba(255, 255, 255, 0.05)',
  '--ambient-2': 'rgba(0, 0, 0, 0.05)',
  '--shadow-sm': '0 1px 2px rgba(0,0,0,0.05)',
  '--shadow-md': '0 4px 6px rgba(0,0,0,0.1)',
  '--shadow-lg': '0 10px 15px rgba(0,0,0,0.1)',
  '--glass-bg': 'rgba(255, 255, 255, 0.05)',
  '--glass-blur': '8px',
  '--radii': '0.5rem',
  '--content-max': '1200px',
  '--font-heading': 'system-ui, sans-serif',
  '--font-body': 'system-ui, sans-serif',
  '--font-mono': 'ui-monospace, monospace',
  '--text-sm': '0.875rem',
  '--text-base': '1rem',
  '--text-lg': '1.125rem',
  '--text-xl': '1.25rem',
  '--text-2xl': '1.5rem',
  '--space-unit': '0.25rem',
  '--space-1': 'calc(var(--space-unit) * 1)',
  '--space-2': 'calc(var(--space-unit) * 2)',
  '--space-3': 'calc(var(--space-unit) * 3)',
  '--space-4': 'calc(var(--space-unit) * 4)',
  '--space-6': 'calc(var(--space-unit) * 6)',
  '--space-8': 'calc(var(--space-unit) * 8)',
  '--space-12': 'calc(var(--space-unit) * 12)',
  '--noise-opacity': '0.02',
};

// 安全获取环境变量（兼容 Vite / Next.js / Node）
function getEnv(name: string): string | undefined {
  // 静态替换优先
  if (name === 'OPENAI_API_KEY' && typeof import.meta !== 'undefined' && (import.meta as any).env?.OPENAI_API_KEY) return (import.meta as any).env.OPENAI_API_KEY;
  if (name === 'OPENAI_API_BASE' && typeof import.meta !== 'undefined' && (import.meta as any).env?.OPENAI_API_BASE) return (import.meta as any).env.OPENAI_API_BASE;
  
  // 动态读取 fallback
  if (typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env[name]) return (import.meta as any).env[name];
  if (typeof process !== 'undefined' && process.env && process.env[name]) return process.env[name];
  return undefined;
}

function hexToHSL(hex: string) {
  let r = parseInt(hex.slice(1, 3), 16) / 255;
  let g = parseInt(hex.slice(3, 5), 16) / 255;
  let b = parseInt(hex.slice(5, 7), 16) / 255;
  let max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: h * 360, s, l };
}

function HSLToHex(h: number, s: number, l: number) {
  h /= 360;
  let r, g, b;
  if (s === 0) {
    r = g = b = l; 
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  const toHex = (x: number) => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function adjustHue(hex: string, offset: number): string {
  if (!hex || hex.length < 6) return hex;
  const fullHex = hex.length === 4 ? `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}` : hex;
  const { h, s, l } = hexToHSL(fullHex);
  const newH = (h + offset + 360) % 360;
  return HSLToHex(newH, s, l);
}

function matchKeywords(text: string): string[] {
  const lower = text.toLowerCase();
  const matches: string[] = [];
  if (/海|ocean|sea|blue|aqua|水/i.test(lower)) matches.push('ocean');
  if (/日落|sunset|黄昏|orange|warm|夕/i.test(lower)) matches.push('sunset');
  if (/森林|forest|green|自然|nature|tree|草木/i.test(lower)) matches.push('forest');
  if (/樱花|sakura|pink|粉|花|cute|甜美/i.test(lower)) matches.push('sakura');
  if (/赛博|cyber|cyberpunk|neon|霓虹|科技|tech/i.test(lower)) matches.push('cyber');
  if (/暗|dark|night|夜晚|midnight|黑|深色/i.test(lower)) matches.push('midnight');
  else if (/浅|light|bright|明亮|白|clean|简约/i.test(lower)) matches.push('light');
  return matches;
}

function generateFromKeywords(text: string, matches: string[]) {
  const hasMatch = matches.length > 0;
  const paletteName = hasMatch ? matches[0] : (text.length % 2 === 0 ? 'light' : 'dark');
  const palette = KEYWORD_PALETTES[paletteName];

  // 若无特定关键词，则根据文本生成固定的色相偏移随机化颜色
  const hueOffset = hasMatch ? 0 : (text.length * 15 + (text.charCodeAt(0) || 0) * 7) % 360;

  const cssVars: Record<string, string> = { ...DEFAULT_VARS };
  for (const [key, val] of Object.entries(palette)) {
    cssVars[key] = hueOffset === 0 ? val : adjustHue(val, hueOffset);
  }
  return cssVars;
}

function inferName(text: string): string {
  const words = text.trim().split(/\s+/).filter(Boolean);
  // 剔除常见的无意义修饰词，保留核心词
  const cleanWords = words.filter(w => !['a', 'an', 'the', 'generate', 'theme', '配色', '主题', '生成'].includes(w.toLowerCase()));
  return cleanWords.slice(0, 4).join(' ').slice(0, 20) || 'AI Generated';
}

function inferTags(text: string, cssVars: Record<string, string>): string[] {
  const tags: string[] = [];
  const lower = text.toLowerCase();
  const bg = cssVars['--color-bg'] || '#000000';
  
  let bgLum = 0.5;
  if (bg.startsWith('#') && bg.length >= 7) {
    const r = parseInt(bg.slice(1, 3), 16) / 255;
    const g = parseInt(bg.slice(3, 5), 16) / 255;
    const b = parseInt(bg.slice(5, 7), 16) / 255;
    bgLum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  tags.push(bgLum < 0.5 ? 'dark' : 'light');

  if (/节日|holiday|圣诞|春节|中秋|国庆|christmas/i.test(lower)) tags.push('holiday');
  if (/极简|minimal|clean|简约|simple/i.test(lower)) tags.push('minimal');
  if (/自然|nature|forest|ocean|海|森林|山/i.test(lower)) tags.push('nature');
  if (/科技|tech|cyber|neon|digital|赛博|数字/i.test(lower)) tags.push('tech');
  if (/复古|retro|vintage|old|怀旧/i.test(lower)) tags.push('retro');

  if (tags.length === 1) tags.push(bgLum < 0.5 ? 'cool' : 'warm');

  return tags.slice(0, 4);
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
    customCss: `/* 默认无特效。您所描述的 "${text.slice(0, 20)}" 主题可通过配置 OPENAI API 获得真正的 AI 专属动画特效。 */`,
    description: `规则引擎根据「${text.slice(0, 80)}」生成的预设配色方案`,
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

    const key = getEnv('OPENAI_API_KEY');
    const baseURL = getEnv('OPENAI_API_BASE') || getEnv('OPENAI_BASE_URL') || 'https://api.openai.com/v1';

    if (key && key.length > 10) {
      try {
        const systemPrompt = `你是一位专业的主题配色设计师。根据用户的文字描述，生成一套完整的 CSS 变量主题配色方案。

## 色彩设计法则
- 主色(primary)定义主题性格，辅色(secondary)作邻近过渡，强调色(accent)用对比色/补色制造视觉焦点
- 背景(bg)→表面(surface)→边框(border)→弱化文字(text-muted)→主文字(text) 亮度逐层递增或递减
- 主文字与背景对比度 ≥ 7:1，确保清晰可读
- ambient 氛围色从主色/辅色派生，降低饱和度融入背景
- 阴影使用带色彩倾向的半透明色而非纯黑

## 特效设计要求（customCss 必须实现）
- 必须根据用户描述生成主题相关的纯 CSS 特效动画，**禁止返回空字符串**
- 只能使用纯 CSS（@keyframes 动画、伪元素 ::before/::after、渐变、滤镜、box-shadow），禁止 JavaScript
- 示例启发方向：
  · 雷雨/夜黑风高 → 雨丝斜落（repeating-linear-gradient）、闪电（@keyframes opacity）
  · 赛博朋克 → 霓虹发光边框、扫描线 overlay、故障闪烁 glitch、数字雨粒子
  · 樱花/自然 → 飘落花瓣、浮动光点、柔和呼吸光晕
- @keyframes 使用语义化命名

## 必须返回完整的 cssVars（全部 34 项）
包含以下键，值必须为有效的 CSS 属性值：
--color-primary, --color-secondary, --color-accent, --color-bg, --color-surface, --color-text, --color-text-muted, --color-border, --ambient-1, --ambient-2, --shadow-sm, --shadow-md, --shadow-lg, --glass-bg, --glass-blur, --radii, --content-max, --font-heading, --font-body, --font-mono, --text-base, --text-lg, --text-xl, --text-2xl, --text-sm, --space-unit, --space-1, --space-2, --space-3, --space-4, --space-6, --space-8, --space-12, --noise-opacity

请返回以下 JSON 格式：
{
  "name": "主题名称（中文，2-8字）",
  "tags": ["dark/light", "vibrant/minimal", "warm/cool"],
  "cssVars": { "对应键名": "值" },
  "customCss": "与主题描述匹配的纯 CSS 特效动画"
}`;

        const aiRes = await fetch(`${baseURL.replace(/\/+$/, '')}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${key}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            response_format: { type: 'json_object' },
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: `用户描述: "${description}"\n\n请严格返回 JSON 格式。` }
            ],
            temperature: 0.8,
            max_tokens: 6000,
          }),
        });

        if (aiRes.ok) {
          const aiData = await aiRes.json();
          const content = aiData.choices?.[0]?.message?.content || '{}';
          
          // 安全提取 JSON（防止模型无视指令输出 Markdown 前缀）
          const match = content.match(/\{[\s\S]*\}/);
          const cleanJson = match ? match[0] : content;
          const generated = JSON.parse(cleanJson);

          if (!generated.cssVars || !generated.name) {
             throw new Error("AI 响应结构不符合要求");
          }

          return new Response(JSON.stringify({
            ...generated,
            description,
            generatedBy: 'openai',
          }), {
            status: 200,
            headers: { 'Content-Type': 'application/json', ...CORS },
          });
        } else {
          console.error('[Theme API] OpenAI 请求失败:', await aiRes.text());
        }
      } catch (err) {
        console.error('[Theme API] AI 解析与生成过程发生异常:', err);
        // 出错自动降级到规则引擎
      }
    }

    // 降级: 基于关键词及 HSL 色相偏移生成的规则引擎
    const result = generateFallbackTheme(description);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...CORS },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: '请求格式或服务器内部错误' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...CORS },
    });
  }
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}