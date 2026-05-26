/**
 * Theme tag suggestion engine — multi-signal weighted scoring.
 * Pure functions — no side effects, no Redis, no I/O.
 */
import type { AnyExtension } from '../themes/types';
import { hexToRgb, getLuminance, getContrastRatio } from '../utils/color';

// ── Public types ──

export interface TagSuggestion {
  tag: string;
  confidence: number;
  reason: string;
}

export interface SuggestTagsInput {
  cssVars: Record<string, string>;
  customCss?: string | null;
  extensions?: AnyExtension[] | null;
  presetName?: string | null;
}

// ── Internal types ──

type SignalSource =
  | 'color' | 'font' | 'content' | 'structure'
  | 'effects' | 'emoji' | 'contrast' | 'harmony';

interface TagSignal {
  tag: string;
  strength: number;
  source: SignalSource;
  reason: string;
}

interface ScoredTag {
  tag: string;
  score: number;
  reasons: string[];
}

// ── Source weights ──

const SOURCE_WEIGHTS: Record<SignalSource, number> = {
  color:    1.00,
  contrast: 0.95,
  font:     0.85,
  effects:  0.80,
  content:  0.70,
  harmony:  0.70,
  structure: 0.65,
  emoji:    0.60,
};

// ── Main ──

export function suggestTags(input: SuggestTagsInput): TagSuggestion[] {
  const { cssVars, customCss, extensions, presetName } = input;
  const textCorpus = buildTextCorpus(customCss, extensions);
  const allText = [presetName || '', textCorpus].join(' ');

  const signals: TagSignal[] = [
    ...analyzeColor(cssVars),
    ...analyzeFont(cssVars),
    ...analyzeContent(allText, presetName),
    ...analyzeEmoji(presetName, extensions),
    ...analyzeStructure(input),
    ...analyzeEffects(cssVars, customCss),
    ...analyzeContrast(cssVars),
    ...analyzeHarmony(cssVars),
  ];

  const scored = aggregateSignals(signals);
  const best = selectTop(scored, cssVars);
  return best;
}

// ── Aggregation ──

function aggregateSignals(signals: TagSignal[]): ScoredTag[] {
  const groups = new Map<string, { totalW: number; totalS: number; reasons: string[] }>();
  for (const s of signals) {
    const w = SOURCE_WEIGHTS[s.source];
    const g = groups.get(s.tag) || { totalW: 0, totalS: 0, reasons: [] };
    g.totalW += w;
    g.totalS += s.strength * w;
    if (!g.reasons.includes(s.reason)) g.reasons.push(s.reason);
    groups.set(s.tag, g);
  }
  return [...groups.entries()].map(([tag, g]) => ({
    tag,
    score: g.totalW > 0 ? g.totalS / g.totalW : 0,
    reasons: g.reasons,
  }));
}

function selectTop(scored: ScoredTag[], cssVars: Record<string, string>): TagSuggestion[] {
  const filtered = scored.filter(s => s.tag !== 'community' && s.score >= 0.40);
  filtered.sort((a, b) => b.score - a.score);

  const result: TagSuggestion[] = [];
  const used = new Set<string>();

  for (const s of filtered) {
    if (used.has(s.tag)) continue;
    used.add(s.tag);
    result.push({
      tag: s.tag,
      confidence: Math.round(clamp(s.score, 0, 1) * 100) / 100,
      reason: s.reasons.join('；'),
    });
    if (result.length >= 5) break;
  }

  ensureMandatory(cssVars, result);
  return result;
}

// ═══════════════════════════════════════════
// 1. COLOR ANALYSIS
// ═══════════════════════════════════════════

function analyzeColor(cssVars: Record<string, string>): TagSignal[] {
  const results: TagSignal[] = [];
  const bg = cssVars['--color-bg'] || '#000000';
  const text = cssVars['--color-text'] || '#ffffff';
  const primary = cssVars['--color-primary'] || '#6366f1';

  const bgRgb = hexToRgb(bg);
  const bgLum = getLuminance(bgRgb[0], bgRgb[1], bgRgb[2]);

  // dark / light
  if (bgLum < 0.4) {
    results.push(makeSignal('dark', clamp(1 - bgLum / 0.4, 0.75, 0.99), 'color', `背景亮度仅 ${bgLum.toFixed(2)}，属于深色主题`));
  } else if (bgLum > 0.6) {
    results.push(makeSignal('light', clamp((bgLum - 0.6) / 0.4, 0.75, 0.99), 'color', `背景亮度 ${bgLum.toFixed(2)}，属于浅色主题`));
  } else {
    const textRgb = hexToRgb(text);
    const textLum = getLuminance(textRgb[0], textRgb[1], textRgb[2]);
    if (textLum > 0.7) {
      results.push(makeSignal('dark', 0.60, 'color', '背景亮度居中，但文字偏亮，整体偏深色'));
    } else if (textLum < 0.3) {
      results.push(makeSignal('light', 0.60, 'color', '背景亮度居中，但文字偏暗，整体偏浅色'));
    } else {
      results.push(makeSignal(bgLum < 0.5 ? 'dark' : 'light', 0.52, 'color', '背景亮度处于中间范围'));
    }
  }

  // Collect hues and saturations from multiple colors
  const keys = ['--color-primary', '--color-secondary', '--color-accent', '--ambient-1', '--ambient-2'];
  const hues: number[] = [];
  const sats: number[] = [];
  for (const k of keys) {
    const v = cssVars[k];
    if (v) {
      const [h, s] = getHueAndSaturation(v);
      if (s > 0.05) { hues.push(h); sats.push(s); }
    }
  }

  // warm / cool — multi-color voting
  let warmVotes = 0, coolVotes = 0;
  for (const h of hues) {
    if ((h >= 0 && h <= 60) || h >= 300) warmVotes++;
    else if (h >= 180 && h <= 270) coolVotes++;
  }
  if (warmVotes > coolVotes + 1) {
    results.push(makeSignal('warm', clamp(0.6 + warmVotes * 0.08, 0.65, 0.95), 'color', `${warmVotes}/${hues.length} 个颜色位于暖色区间`));
  } else if (coolVotes > warmVotes + 1) {
    results.push(makeSignal('cool', clamp(0.6 + coolVotes * 0.08, 0.65, 0.95), 'color', `${coolVotes}/${hues.length} 个颜色位于冷色区间`));
  } else if (hues.length >= 2 && warmVotes === coolVotes) {
    // balanced — skip both warm and cool
  } else if (hues.length > 0) {
    // fall back to primary-only
    const [ph] = getHueAndSaturation(primary);
    if ((ph >= 0 && ph <= 60) || ph >= 300) {
      results.push(makeSignal('warm', 0.62, 'color', `主色色相 ${Math.round(ph)}° 位于暖色区间`));
    } else if (ph >= 180 && ph <= 270) {
      results.push(makeSignal('cool', 0.62, 'color', `主色色相 ${Math.round(ph)}° 位于冷色区间`));
    }
  }

  // vibrant / minimal — average saturation
  if (sats.length > 0) {
    const avgSat = sats.reduce((a, b) => a + b, 0) / sats.length;
    if (avgSat > 0.5) {
      results.push(makeSignal('vibrant', clamp((avgSat - 0.5) / 0.5, 0.6, 0.95), 'color', `多色平均饱和度 ${avgSat.toFixed(2)}，色彩鲜艳`));
    } else if (avgSat < 0.2) {
      results.push(makeSignal('minimal', clamp(1 - avgSat / 0.2, 0.6, 0.90), 'color', `多色平均饱和度仅 ${avgSat.toFixed(2)}，色彩简约`));
    }
  }

  // space — very dark bg + purple/blue primary
  const [ph] = getHueAndSaturation(primary);
  if (bgLum < 0.15 && ph >= 240 && ph <= 300) {
    results.push(makeSignal('space', 0.65, 'color', '极暗背景配合蓝紫主色，富有太空感'));
  }

  // ocean — teal/cyan primary (180-220) + dark bg
  if (ph >= 180 && ph <= 220 && bgLum < 0.5) {
    results.push(makeSignal('ocean', 0.60, 'color', '青蓝色相配合暗色背景，呈现海洋氛围'));
  }

  // industrial — very desaturated across all colors
  if (sats.length >= 3 && sats.every(s => s < 0.15)) {
    results.push(makeSignal('industrial', 0.65, 'color', '全色系饱和度极低，呈现工业/粗野风格'));
  }

  // elegant — moderate saturation, not extreme
  if (sats.length > 0) {
    const avgSat = sats.reduce((a, b) => a + b, 0) / sats.length;
    if (avgSat >= 0.20 && avgSat <= 0.50 && bgLum >= 0.15 && bgLum <= 0.85) {
      results.push(makeSignal('elegant', clamp(0.45 + (0.50 - Math.abs(avgSat - 0.35)) * 0.6, 0.45, 0.65), 'color', '色彩饱和度适中，色调雅致'));
    }
  }

  return results;
}

// ═══════════════════════════════════════════
// 2. FONT ANALYSIS
// ═══════════════════════════════════════════

function analyzeFont(cssVars: Record<string, string>): TagSignal[] {
  const results: TagSignal[] = [];
  const heading = (cssVars['--font-heading'] || '').toLowerCase();
  const body = (cssVars['--font-body'] || '').toLowerCase();
  const mono = (cssVars['--font-mono'] || '').toLowerCase();
  const all = [heading, body, mono].join(' ');

  // Serif detection
  if (/serif|garamond|times|georgia|baskerville|bodoni|didot|palatino/i.test(all)) {
    results.push(makeSignal('elegant', 0.65, 'font', '使用衬线字体（Serif），风格典雅'));
  }

  // Monospace dominance
  const monoCount = (all.match(/mono|code|console|terminal|typewriter/i) || []).length;
  if (monoCount >= 2) {
    results.push(makeSignal('tech', 0.55, 'font', '多处使用等宽字体，呈现技术风格'));
  } else if (/mono|code/i.test(mono)) {
    results.push(makeSignal('tech', 0.40, 'font', '等宽字体配置'));
  }

  // Cursive / handwriting
  if (/cursive|script|hand|brush|pen/i.test(all)) {
    results.push(makeSignal('fantasy', 0.50, 'font', '使用手写/装饰字体'));
  }

  // All sans-serif → weak minimal
  if (/sans/i.test(heading) && /sans/i.test(body) && !/serif|mono|cursive/i.test(all)) {
    results.push(makeSignal('minimal', 0.35, 'font', '统一使用无衬线字体'));
  }

  return results;
}

// ═══════════════════════════════════════════
// 3. CONTENT ANALYSIS (multilingual keywords)
// ═══════════════════════════════════════════

const CONTENT_GROUPS: Record<string, { tag: string; label: string; patterns: RegExp[] }> = {
  nature: {
    tag: 'nature', label: '自然',
    patterns: [
      /\b(petal|sakura|leaf|leaves|tree|flower|bloom|vine|branch|forest|ocean|sea|wave|river|lake|coral|algae)\b/gi,
      /\b(star|stardust|moon|moonlight|sun|sunlight|sky|cloud|rain|raindrop|snow|snowflake|wind|breeze|storm|firefly|dust|glow|night|earth|mountain)\b/gi,
      /(自然|森林|花|山|星|月|树|樱花|枫叶|草原|沙漠|绿洲|丛林|荒野)/g,
      /\b(sakura|yozakura|hanami|momiji|tsuki|kaze|yama|mori|hana|kawa)\b/gi,
    ],
  },
  tech: {
    tag: 'tech', label: '科技',
    patterns: [
      /\b(code|matrix|terminal|console|command|syntax|binary|neon|glitch|cyber|hacker|data|circuit|robot|digital|byte|bit|protocol)\b/gi,
      /\b(grid|pixel|scanline|cursor|prompt|hud|dashboard|monitor|screen|display|algorithm)\b/gi,
      /(科技|代码|赛博|矩阵|霓虹|终端|黑客|数字|芯片|程序|算法)/g,
    ],
  },
  retro: {
    tag: 'retro', label: '复古',
    patterns: [
      /\b(retro|vintage|80s|90s|arcade|synth|synthwave|cassette|vhs|crt|scanline|8bit|8-bit|chiptune)\b/gi,
      /\b(pixelart|pixel-art|oldschool|nostalgia|throwback)\b/gi,
      /(复古|怀旧|80年代|90年代|像素|街机|合成器|老式)/g,
    ],
  },
  holiday: {
    tag: 'holiday', label: '节日',
    patterns: [
      /\b(christmas|santa|reindeer|snowman|halloween|spooky|pumpkin|ghost|witch|newyear|fireworks|festival|celebration|confetti)\b/gi,
      /(节日|圣诞|春节|中秋|新年|元旦|万圣|国庆|元宵|端午|七夕|重阳|除夕)/g,
    ],
  },
  space: {
    tag: 'space', label: '太空',
    patterns: [
      /\b(galaxy|nebula|cosmic|constellation|astronaut|rocket|orbit|asteroid|comet|lunar|solar|planet|interstellar|starfield)\b/gi,
      /(太空|宇宙|星系|星云|银河|星座|星际|航天|火箭|星球)/g,
    ],
  },
  ocean: {
    tag: 'ocean', label: '海洋',
    patterns: [
      /\b(ocean|sea|abyss|coral|reef|tide|wave|nautical|submarine|deep|trench|maritime|aqua|marine)\b/gi,
      /(海洋|深海|珊瑚|海底|浪|潮汐|碧蓝|湛蓝)/g,
      /\b(umi|nami|kaiyo|shinkai)\b/gi,
    ],
  },
  seasonal: {
    tag: 'seasonal', label: '季节',
    patterns: [
      /\b(spring|summer|autumn|winter|solstice|equinox|blossom|harvest|frost|thaw|monsoon)\b/gi,
      /(春|夏|秋|冬|节气|清明|谷雨|立春|立夏|立秋|立冬|冬至|夏至|春分|秋分)/g,
    ],
  },
  fantasy: {
    tag: 'fantasy', label: '奇幻',
    patterns: [
      /\b(magic|myth|fairy|dragon|wizard|spell|enchanted|mystical|rune|arcane|elf|elven|dwarven|unicorn|phoenix)\b/gi,
      /(魔法|神话|精灵|龙|巫|仙境|符文|梦幻|奇幻|传说|咒语|仙)/g,
      /\b(mahou|yume|yokai|kami|ryu|tengu)\b/gi,
    ],
  },
  industrial: {
    tag: 'industrial', label: '工业',
    patterns: [
      /\b(brutal|brutalist|metal|steel|concrete|mechanical|gear|forge|factory|rust|rivet|iron|copper|alloy)\b/gi,
      /(工业|金属|钢铁|机械|齿轮|混凝土|粗野|生锈|工厂|铸造)/g,
    ],
  },
};

const TERM_TRANSLATIONS: Record<string, string> = {
  petal: '花瓣', sakura: '樱花', leaf: '树叶', tree: '树木', flower: '花朵',
  ocean: '海洋', sea: '大海', forest: '森林', wave: '波浪', star: '星星',
  stardust: '星尘', moon: '月亮', sun: '太阳', sky: '天空', cloud: '云',
  rain: '雨', snow: '雪花', wind: '风', firefly: '流萤', dust: '微尘',
  glow: '发光', night: '夜晚', spring: '春天', autumn: '秋天', winter: '冬季',
  galaxy: '星系', nebula: '星云', cosmic: '宇宙', constellation: '星座',
  coral: '珊瑚', abyss: '深渊', reef: '礁石', tide: '潮汐',
  magic: '魔法', dragon: '龙', fairy: '精灵', wizard: '巫师', myth: '神话',
  metal: '金属', steel: '钢铁', concrete: '混凝土', gear: '齿轮',
  code: '代码', matrix: '矩阵', terminal: '终端', neon: '霓虹', glitch: '故障',
  cyber: '赛博', data: '数据', circuit: '电路', pixel: '像素', grid: '网格',
  retro: '复古', vintage: '怀旧', arcade: '街机', synth: '合成器',
  crt: 'CRT', scanline: '扫描线', christmas: '圣诞', santa: '圣诞老人',
  halloween: '万圣节', spooky: '鬼怪', pumpkin: '南瓜', newyear: '新年',
  fireworks: '烟花', festival: '节日', celebration: '庆典',
  樱花: '樱花', 自然: '自然', 森林: '森林', 海洋: '海洋', 深海: '深海',
  太空: '太空', 宇宙: '宇宙', 魔法: '魔法', 工业: '工业', 金属: '金属',
  季节: '季节', 春天: '春天', 夏天: '夏天', 秋天: '秋天', 冬天: '冬季',
};

function analyzeContent(allText: string, presetName?: string | null): TagSignal[] {
  if (!allText) return [];
  const results: TagSignal[] = [];

  for (const { tag, label, patterns } of Object.values(CONTENT_GROUPS)) {
    let matchCount = 0;
    const matched: Set<string> = new Set();
    for (const re of patterns) {
      let m: RegExpExecArray | null;
      while ((m = re.exec(allText)) !== null) {
        matchCount++;
        const term = (m[1] || m[0]).toLowerCase();
        matched.add(term);
        if (matchCount > 30) break;
      }
      re.lastIndex = 0;
    }
    if (matchCount > 0) {
      const terms = [...matched].slice(0, 4).map(t => TERM_TRANSLATIONS[t] || t);
      const strength = clamp(0.40 + matchCount * 0.08, 0.50, 0.80);
      results.push(makeSignal(tag, strength, 'content', `检测到${terms.join('、')}等${label}元素`));
    }
  }

  // presetName bonus — check name directly with higher confidence floor
  if (presetName) {
    for (const { tag, label, patterns } of Object.values(CONTENT_GROUPS)) {
      let matched = false;
      for (const re of patterns) {
        if (re.test(presetName)) { matched = true; break; }
      }
      if (matched) {
        const existing = results.find(r => r.tag === tag);
        if (!existing) {
          results.push(makeSignal(tag, 0.60, 'content', `主题名称暗示${label}风格`));
        } else {
          existing.strength = Math.max(existing.strength, 0.65);
          existing.reason = `主题名称和内容均指向${label}风格`;
        }
      }
    }
  }

  return results;
}

// ═══════════════════════════════════════════
// 4. EMOJI ANALYSIS
// ═══════════════════════════════════════════

const EMOJI_MAP: Record<string, { tag: string; label: string; strength: number }[]> = {
  '🌸': [{ tag: 'nature', label: '樱花', strength: 0.85 }, { tag: 'seasonal', label: '春季', strength: 0.70 }],
  '🌺': [{ tag: 'nature', label: '花朵', strength: 0.80 }],
  '🌻': [{ tag: 'nature', label: '向日葵', strength: 0.80 }, { tag: 'seasonal', label: '夏季', strength: 0.65 }],
  '🌿': [{ tag: 'nature', label: '植物', strength: 0.80 }],
  '🌲': [{ tag: 'nature', label: '树木', strength: 0.80 }],
  '🌳': [{ tag: 'nature', label: '森林', strength: 0.80 }],
  '🌊': [{ tag: 'ocean', label: '海浪', strength: 0.90 }],
  '🐠': [{ tag: 'ocean', label: '热带鱼', strength: 0.85 }],
  '🐙': [{ tag: 'ocean', label: '章鱼', strength: 0.80 }],
  '🐚': [{ tag: 'ocean', label: '贝壳', strength: 0.75 }],
  '🦑': [{ tag: 'ocean', label: '鱿鱼', strength: 0.75 }],
  '🐳': [{ tag: 'ocean', label: '鲸鱼', strength: 0.85 }],
  '🦈': [{ tag: 'ocean', label: '鲨鱼', strength: 0.80 }],
  '🚀': [{ tag: 'space', label: '火箭', strength: 0.90 }],
  '🌌': [{ tag: 'space', label: '银河', strength: 0.90 }],
  '🛸': [{ tag: 'space', label: 'UFO', strength: 0.85 }],
  '🛰️': [{ tag: 'space', label: '卫星', strength: 0.80 }],
  '🌟': [{ tag: 'space', label: '星星', strength: 0.65 }, { tag: 'fantasy', label: '闪光', strength: 0.55 }],
  '✨': [{ tag: 'fantasy', label: '闪光', strength: 0.70 }, { tag: 'vibrant', label: '闪烁', strength: 0.50 }],
  '🔮': [{ tag: 'fantasy', label: '水晶球', strength: 0.85 }],
  '🧙': [{ tag: 'fantasy', label: '巫师', strength: 0.80 }],
  '🧙‍♂️': [{ tag: 'fantasy', label: '巫师', strength: 0.80 }],
  '🧙‍♀️': [{ tag: 'fantasy', label: '女巫', strength: 0.80 }],
  '🐉': [{ tag: 'fantasy', label: '龙', strength: 0.85 }],
  '🧚': [{ tag: 'fantasy', label: '仙女', strength: 0.80 }],
  '🧚‍♀️': [{ tag: 'fantasy', label: '仙女', strength: 0.80 }],
  '🦄': [{ tag: 'fantasy', label: '独角兽', strength: 0.85 }],
  '⚙️': [{ tag: 'industrial', label: '齿轮', strength: 0.85 }],
  '⚙': [{ tag: 'industrial', label: '齿轮', strength: 0.85 }],
  '🔧': [{ tag: 'industrial', label: '扳手', strength: 0.80 }],
  '🏭': [{ tag: 'industrial', label: '工厂', strength: 0.75 }],
  '🔩': [{ tag: 'industrial', label: '螺丝', strength: 0.75 }],
  '🪚': [{ tag: 'industrial', label: '锯子', strength: 0.70 }],
  '☀️': [{ tag: 'seasonal', label: '夏季', strength: 0.75 }],
  '☀': [{ tag: 'seasonal', label: '夏季', strength: 0.75 }],
  '🍂': [{ tag: 'seasonal', label: '秋季', strength: 0.80 }],
  '❄️': [{ tag: 'seasonal', label: '冬季', strength: 0.85 }],
  '❄': [{ tag: 'seasonal', label: '冬季', strength: 0.85 }],
  '⛄': [{ tag: 'seasonal', label: '冬季', strength: 0.80 }],
  '🎄': [{ tag: 'holiday', label: '圣诞', strength: 0.90 }],
  '🎃': [{ tag: 'holiday', label: '万圣节', strength: 0.90 }],
  '🏮': [{ tag: 'holiday', label: '灯笼', strength: 0.85 }],
  '🎆': [{ tag: 'holiday', label: '烟花', strength: 0.80 }],
  '🔥': [{ tag: 'vibrant', label: '火焰', strength: 0.65 }],
  '💻': [{ tag: 'tech', label: '电脑', strength: 0.75 }],
  '🖥️': [{ tag: 'tech', label: '显示器', strength: 0.75 }],
  '🖥': [{ tag: 'tech', label: '显示器', strength: 0.75 }],
  '🤖': [{ tag: 'tech', label: '机器人', strength: 0.80 }],
  '👾': [{ tag: 'tech', label: '像素怪物', strength: 0.70 }, { tag: 'retro', label: '游戏', strength: 0.75 }],
  '🕹️': [{ tag: 'retro', label: '游戏', strength: 0.75 }],
  '🕹': [{ tag: 'retro', label: '游戏', strength: 0.75 }],
  '📟': [{ tag: 'retro', label: '寻呼机', strength: 0.75 }],
};

function analyzeEmoji(presetName?: string | null, extensions?: AnyExtension[] | null): TagSignal[] {
  const results: TagSignal[] = [];
  const emojiText: string[] = [];
  if (presetName) emojiText.push(presetName);
  if (extensions) {
    for (const ext of extensions) {
      if (ext.type === 'floating' && ext.char) emojiText.push(ext.char);
    }
  }
  if (emojiText.length === 0) return results;

  const full = emojiText.join('');
  const tagHits = new Map<string, { strength: number; labels: string[] }>();

  for (const [emoji, signals] of Object.entries(EMOJI_MAP)) {
    if (full.includes(emoji)) {
      for (const s of signals) {
        const h = tagHits.get(s.tag) || { strength: 0, labels: [] };
        h.strength = Math.max(h.strength, s.strength);
        if (!h.labels.includes(s.label)) h.labels.push(s.label);
        tagHits.set(s.tag, h);
      }
    }
  }

  for (const [tag, h] of tagHits) {
    results.push(makeSignal(tag, Math.min(0.90, h.strength), 'emoji',
      `检测到${h.labels.slice(0, 3).join('、')}相关 Emoji`));
  }

  return results;
}

// ═══════════════════════════════════════════
// 5. STRUCTURE ANALYSIS
// ═══════════════════════════════════════════

const STRUCTURAL_DEFAULTS = new Set([
  '--font-heading', '--font-body', '--font-mono', '--text-base', '--text-lg',
  '--text-xl', '--text-2xl', '--text-sm', '--space-unit', '--space-1',
  '--space-2', '--space-3', '--space-4', '--space-6', '--space-8',
  '--space-12', '--radii', '--content-max', '--shadow-sm', '--shadow-md',
  '--shadow-lg', '--glass-bg', '--glass-blur', '--noise-opacity',
  '--ambient-1', '--ambient-2',
]);

function analyzeStructure(input: SuggestTagsInput): TagSignal[] {
  const { cssVars, customCss, extensions } = input;
  const results: TagSignal[] = [];
  const extCount = extensions?.length ?? 0;
  const cssLen = customCss?.length ?? 0;

  // minimal
  let minimalScore = 0;
  const minimalReasons: string[] = [];
  if (extCount === 0) { minimalScore++; minimalReasons.push('无扩展元素'); }
  if (cssLen < 200) { minimalScore++; minimalReasons.push('自定义 CSS 极少'); }
  const customVarCount = Object.keys(cssVars).filter(k => k.startsWith('--') && !STRUCTURAL_DEFAULTS.has(k)).length;
  if (customVarCount < 5) { minimalScore += 0.5; }

  if (extCount > 5) minimalScore -= 2;
  if (cssLen > 2000) minimalScore -= 2;

  if (minimalScore >= 2) {
    results.push(makeSignal('minimal', clamp(minimalScore * 0.22 + 0.40, 0.55, 0.85), 'structure', minimalReasons.join('，')));
  }

  // animated
  if (cssLen > 2000 && extCount >= 5) {
    results.push(makeSignal('animated', clamp(0.60 + (cssLen - 2000) / 15000, 0.60, 0.85), 'structure', `高度复杂：${extCount} 个扩展 + ${cssLen} 字符 CSS`));
  } else if (cssLen > 8000) {
    results.push(makeSignal('animated', 0.85, 'structure', `极长自定义 CSS（${cssLen} 字符），动画丰富`));
  } else if (extCount >= 8) {
    results.push(makeSignal('animated', 0.70, 'structure', `${extCount} 个扩展元素，内容充实`));
  }

  // elegant — medium complexity
  if (extCount >= 1 && extCount <= 4 && cssLen >= 100 && cssLen <= 2000) {
    results.push(makeSignal('elegant', 0.50, 'structure', '中等复杂度，精心设计'));
  }

  return results;
}

// ═══════════════════════════════════════════
// 6. EFFECTS ANALYSIS
// ═══════════════════════════════════════════

function analyzeEffects(cssVars: Record<string, string>, customCss?: string | null): TagSignal[] {
  const results: TagSignal[] = [];
  if (!customCss) {
    // Still check glass-blur even without customCss
    const gb = (cssVars['--glass-blur'] || '').trim();
    if (gb && gb !== 'blur(0px)' && !gb.startsWith('0')) {
      results.push(makeSignal('glass', 0.75, 'effects', '检测到毛玻璃效果'));
    }
    return results;
  }

  const keyframeCount = (customCss.match(/@keyframes\s+[\w-]+/gi) || []).length;

  // vibrant from keyframes
  if (keyframeCount >= 5) {
    results.push(makeSignal('vibrant', 0.90, 'effects', `包含 ${keyframeCount} 个 @keyframes 动画`));
  } else if (keyframeCount >= 3) {
    results.push(makeSignal('vibrant', 0.70, 'effects', `包含 ${keyframeCount} 个 @keyframes 动画`));
  } else if (keyframeCount >= 1) {
    results.push(makeSignal('vibrant', 0.50, 'effects', '包含自定义动画'));
  }

  // animated
  if (keyframeCount >= 5) {
    results.push(makeSignal('animated', 0.85, 'effects', `${keyframeCount} 个 @keyframes 动画`));
  } else if (keyframeCount >= 3 && /petal|sakura|star|dot|orb|bubble|spark|particle|rain|snow|fall|float|drift/i.test(customCss)) {
    results.push(makeSignal('animated', 0.75, 'effects', `${keyframeCount} 个动画 + 粒子/浮动特效`));
  }

  // glass
  const gb = (cssVars['--glass-blur'] || '').trim();
  if (gb && gb !== 'blur(0px)' && !gb.startsWith('0')) {
    results.push(makeSignal('glass', 0.80, 'effects', '检测到毛玻璃效果（--glass-blur）'));
  }
  if (/backdrop-filter/i.test(customCss)) {
    results.push(makeSignal('glass', 0.75, 'effects', '使用 backdrop-filter 毛玻璃'));
  }
  if (/blur\(\d/i.test(customCss) && !/blur\(0/i.test(customCss)) {
    results.push(makeSignal('glass', 0.55, 'effects', 'CSS 中含有模糊效果'));
  }

  // retro from CRT/scanline
  if (/scanline/i.test(customCss)) {
    results.push(makeSignal('retro', 0.75, 'effects', '检测到扫描线效果'));
  }
  if (/\bcrt\b|8bit|8-bit/i.test(customCss)) {
    results.push(makeSignal('retro', 0.70, 'effects', '检测到 CRT/像素风格'));
  }

  // space from stardust/twinkle
  if (/\b(stardust|twinkle|cosmic|nebula)\b/i.test(customCss)) {
    results.push(makeSignal('space', 0.60, 'effects', '检测到星尘/宇宙粒子特效'));
  }

  // fantasy from glow/magical
  if (/\bglow\b/i.test(customCss) && /mix-blend-mode\s*:\s*screen/i.test(customCss)) {
    results.push(makeSignal('fantasy', 0.50, 'effects', '发光 + 混合模式，富有奇幻感'));
  } else if (/\bglow\b/i.test(customCss)) {
    results.push(makeSignal('fantasy', 0.42, 'effects', '包含发光效果'));
  }

  // seasonal from weather effects
  if (/\b(snow|snowflake)\b/i.test(customCss)) {
    results.push(makeSignal('seasonal', 0.70, 'effects', '检测到雪花特效'));
  }
  if (/\b(autumn|leaf|maple)\b.*\b(fall|drift|float)\b/i.test(customCss)) {
    results.push(makeSignal('seasonal', 0.55, 'effects', '检测到秋季落叶特效'));
  }

  return results;
}

// ═══════════════════════════════════════════
// 7. CONTRAST ANALYSIS
// ═══════════════════════════════════════════

function analyzeContrast(cssVars: Record<string, string>): TagSignal[] {
  const results: TagSignal[] = [];
  const bg = cssVars['--color-bg'] || '#000000';
  const text = cssVars['--color-text'] || '#ffffff';
  const primary = cssVars['--color-primary'] || '#6366f1';

  try {
    const textOnBg = getContrastRatio(text, bg);

    if (textOnBg >= 7) {
      results.push(makeSignal('elegant', 0.55, 'contrast', `文字对比度 ${textOnBg.toFixed(1)}:1，达到 WCAG AAA 标准`));
    }

    if (textOnBg > 10) {
      results.push(makeSignal('industrial', 0.45, 'contrast', `极高对比度 ${textOnBg.toFixed(1)}:1，呈现粗野风格`));
    }

    const priOnBg = getContrastRatio(primary, bg);
    const contrasts = [textOnBg, priOnBg];
    const maxC = Math.max(...contrasts);
    const minC = Math.min(...contrasts);
    if (maxC - minC < 2 && contrasts.length >= 2) {
      results.push(makeSignal('minimal', 0.40, 'contrast', '各元素对比度分布均匀'));
    }
  } catch {
    // ignore — invalid colors
  }

  return results;
}

// ═══════════════════════════════════════════
// 8. HARMONY ANALYSIS
// ═══════════════════════════════════════════

function analyzeHarmony(cssVars: Record<string, string>): TagSignal[] {
  const results: TagSignal[] = [];
  const pri = cssVars['--color-primary'];
  const sec = cssVars['--color-secondary'];
  if (!pri || !sec) return results;

  const [ph] = getHueAndSaturation(pri);
  const [sh] = getHueAndSaturation(sec);

  let hueDiff = Math.abs(ph - sh);
  if (hueDiff > 180) hueDiff = 360 - hueDiff;

  // Complementary (150-210 deg apart)
  if (hueDiff >= 150 && hueDiff <= 210) {
    results.push(makeSignal('vibrant', 0.60, 'harmony', '主色与辅色为互补色，视觉冲击力强'));
  }

  // Analogous (0-60 deg apart)
  if (hueDiff >= 5 && hueDiff <= 60) {
    results.push(makeSignal('elegant', 0.55, 'harmony', '主色与辅色为近似色，搭配和谐'));
    results.push(makeSignal('minimal', 0.35, 'harmony', '近似色搭配，风格统一'));
  }

  // Triadic (~120 deg apart)
  if (hueDiff >= 100 && hueDiff <= 140) {
    results.push(makeSignal('vibrant', 0.55, 'harmony', '主色与辅色为三角配色，层次丰富'));
  }

  return results;
}

// ═══════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════

function makeSignal(tag: string, strength: number, source: SignalSource, reason: string): TagSignal {
  return { tag, strength: clamp(strength, 0, 1), source, reason };
}

function getHueAndSaturation(hex: string): [number, number] {
  const c = hex.replace('#', '').trim();
  if (c.length < 6) return [0, 0];
  const rf = parseInt(c.slice(0, 2), 16) / 255;
  const gf = parseInt(c.slice(2, 4), 16) / 255;
  const bf = parseInt(c.slice(4, 6), 16) / 255;
  const max = Math.max(rf, gf, bf);
  const min = Math.min(rf, gf, bf);
  const d = max - min;
  let h = 0, s = 0;
  if (d !== 0) {
    s = d / max;
    if (max === rf) h = ((gf - bf) / d + (gf < bf ? 6 : 0)) / 6;
    else if (max === gf) h = ((bf - rf) / d + 2) / 6;
    else h = ((rf - gf) / d + 4) / 6;
  }
  return [h * 360, s];
}

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

function buildTextCorpus(customCss?: string | null, extensions?: AnyExtension[] | null): string {
  const parts: string[] = [];
  if (customCss) parts.push(customCss);
  if (extensions) {
    for (const ext of extensions) {
      if (ext.type === 'decorative' && ext.html) parts.push(ext.html);
    }
  }
  return parts.join(' ');
}

function ensureMandatory(cssVars: Record<string, string>, results: TagSuggestion[]): void {
  if (results.some(r => r.tag === 'dark' || r.tag === 'light')) return;

  const bg = cssVars['--color-bg'] || '#000000';
  const c = bg.replace('#', '').trim();
  if (c.length >= 6) {
    const rf = parseInt(c.slice(0, 2), 16) / 255;
    const gf = parseInt(c.slice(2, 4), 16) / 255;
    const bf = parseInt(c.slice(4, 6), 16) / 255;
    const lum = 0.2126 * rf + 0.7152 * gf + 0.0722 * bf;
    results.unshift({
      tag: lum < 0.5 ? 'dark' : 'light',
      confidence: 0.99,
      reason: lum < 0.5 ? '背景颜色偏深（自动推断）' : '背景颜色偏浅（自动推断）',
    });
  } else {
    results.unshift({ tag: 'dark', confidence: 0.50, reason: '无法解析背景色，默认推断为深色' });
  }

  if (results.length > 5) results.pop();
}
