import { getAllThemes } from '../../../../utils/daily-theme';
import { getCommunityThemes } from '../../../../utils/omni-bridge';
import { extractRgbChannels } from '../../../../utils/color';
import type { ThemeTag } from '../../../../themes/types';

export const prerender = false;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function colorDistance(hex1: string, hex2: string): number {
  const c1 = extractRgbChannels(hex1);
  const c2 = extractRgbChannels(hex2);
  if (!c1 || !c2) return Infinity;
  const [r1, g1, b1] = c1.split(',').map(Number);
  const [r2, g2, b2] = c2.split(',').map(Number);
  return Math.sqrt(Math.pow(r1 - r2, 2) + Math.pow(g1 - g2, 2) + Math.pow(b1 - b2, 2));
}

function jaccard(a: ThemeTag[] | undefined, b: ThemeTag[] | undefined): number {
  if (!a || !b || a.length === 0 || b.length === 0) return 0;
  const setA = new Set(a);
  const setB = new Set(b);
  const intersection = new Set([...setA].filter(x => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  return intersection.size / union.size;
}

export async function GET({ params }: { params: { preset: string } }) {
  try {
    const targetPreset = params.preset || '';

    // Find target theme
    const staticThemes = getAllThemes();
    const communityThemes = await getCommunityThemes(100);
    const allThemes = [...staticThemes, ...communityThemes];

    const target = allThemes.find(t => t.preset === targetPreset);
    if (!target) {
      return new Response(JSON.stringify({ error: '主题不存在' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
      });
    }

    const targetPrimary = target.cssVars['--color-primary'] || '#000';
    const targetTags = target.tags;

    // Score all other themes
    const scored = allThemes
      .filter(t => t.preset !== targetPreset)
      .map(t => {
        const primary = t.cssVars['--color-primary'] || '#000';
        const dist = colorDistance(targetPrimary, primary);

        // Normalize color distance to [0, 1] (max meaningful RGB distance ≈ 441)
        const colorScore = Math.max(0, 1 - dist / 441);

        const tagScore = jaccard(targetTags, t.tags);

        // Weighted score: 60% tags, 40% color
        const score = tagScore * 0.6 + colorScore * 0.4;

        return {
          preset: t.preset,
          name: t.presetName,
          primary,
          score: Math.round(score * 1000) / 1000,
          tags: t.tags,
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    return new Response(JSON.stringify({
      source: { preset: target.preset, name: target.presetName, primary: targetPrimary, tags: targetTags },
      recommendations: scored,
      apiVersion: 'v1',
    }, null, 2), {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
        ...CORS_HEADERS,
      },
    });
  } catch (err) {
    console.error('[v1/recommend] Error:', err);
    return new Response(JSON.stringify({ error: '内部服务错误' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  }
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}
