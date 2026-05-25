export const prerender = false;

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function getEnv(name: string): string | undefined {
  if (typeof import.meta !== 'undefined' && (import.meta as any).env?.[name]) return (import.meta as any).env[name];
  if (typeof process !== 'undefined' && process.env?.[name]) return process.env[name];
  return undefined;
}

function describeByRules(cssVars: Record<string, string>): string {
  const bg = cssVars['--color-bg'] || '#000000';
  const primary = cssVars['--color-primary'] || '#6366f1';
  const text = cssVars['--color-text'] || '#ffffff';

  // Luminance
  let bgLum = 0.5;
  if (bg.startsWith('#') && bg.length >= 7) {
    const r = parseInt(bg.slice(1, 3), 16) / 255;
    const g = parseInt(bg.slice(3, 5), 16) / 255;
    const b = parseInt(bg.slice(5, 7), 16) / 255;
    bgLum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  // Hue-based color family
  let hue = 0;
  let sat = 0;
  if (primary.startsWith('#') && primary.length >= 7) {
    const r = parseInt(primary.slice(1, 3), 16) / 255;
    const g = parseInt(primary.slice(3, 5), 16) / 255;
    const b = parseInt(primary.slice(5, 7), 16) / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const d = max - min;
    if (d > 0) {
      sat = max === 0 ? 0 : d / max;
      if (max === r) hue = ((g - b) / d) % 6;
      else if (max === g) hue = (b - r) / d + 2;
      else hue = (r - g) / d + 4;
      hue = ((hue * 60) % 360 + 360) % 360;
    }
  }

  // Build description
  const depth = bgLum < 0.3 ? '深色' : bgLum < 0.7 ? '中色调' : '浅色';

  let colorName: string;
  if (hue < 15) colorName = '红色调';
  else if (hue < 40) colorName = '橙色调';
  else if (hue < 65) colorName = '黄色调';
  else if (hue < 170) colorName = '绿色调';
  else if (hue < 200) colorName = '青色调';
  else if (hue < 260) colorName = '蓝色调';
  else if (hue < 300) colorName = '紫色调';
  else if (hue < 340) colorName = '粉色调';
  else colorName = '红色调';

  const vividness = sat > 0.6 ? '高饱和度' : sat > 0.3 ? '中等饱和度' : '低饱和度';

  return `一款${depth}的${colorName}主题，${vividness}，主色为 ${primary}。适合${bgLum < 0.5 ? '夜间浏览或沉浸式' : '日间阅读或清爽型'}界面场景。`;
}

export async function POST({ request }: { request: Request }) {
  try {
    const body = await request.json();
    const { cssVars } = body || {};

    if (!cssVars || typeof cssVars !== 'object') {
      return new Response(JSON.stringify({ error: '请提供 cssVars 对象' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...CORS },
      });
    }

    const key = getEnv('OPENAI_API_KEY');
    const baseURL = getEnv('OPENAI_API_BASE') || getEnv('OPENAI_BASE_URL') || 'https://api.openai.com/v1';

    if (key && key.length > 10) {
      try {
        const prompt = `你是一个 UI 色彩专家。分析以下 CSS 变量，用一两句话描述这个主题的风格、氛围和应用场景，不要任何多余寒暄。
变量：${JSON.stringify(cssVars)}`;

        const aiRes = await fetch(`${baseURL.replace(/\/+$/, '')}/chat/completions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: '你是一位专业的 UI/UX 色彩分析师。用简洁优美的中文描述色彩主题。' },
              { role: 'user', content: prompt },
            ],
            temperature: 0.7,
            max_tokens: 200,
          }),
        });

        if (aiRes.ok) {
          const aiData = await aiRes.json();
          const description = aiData.choices?.[0]?.message?.content || '';
          return new Response(JSON.stringify({
            description: description.trim(),
            generatedBy: 'openai',
            apiVersion: 'v1',
          }), { status: 200, headers: { 'Content-Type': 'application/json', ...CORS } });
        }
      } catch (err) {
        console.error('[v1/ai/describe] OpenAI error:', err);
      }
    }

    // Rule engine fallback
    const description = describeByRules(cssVars);
    return new Response(JSON.stringify({
      description,
      generatedBy: 'rule-engine',
      apiVersion: 'v1',
    }), { status: 200, headers: { 'Content-Type': 'application/json', ...CORS } });

  } catch (err) {
    console.error('[v1/ai/describe] Error:', err);
    return new Response(JSON.stringify({ error: '请求格式错误' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...CORS },
    });
  }
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}
