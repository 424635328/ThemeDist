import type { APIRoute } from 'astro';
import jpeg from 'jpeg-js';
import { PNG } from 'pngjs';
import { hexToRgb, getLuminance, getContrastRatio, rgbToHex } from '../../../utils/color';
import { enrichCssVars } from '../../../utils/omni-bridge';
import { STRUCTURAL_CSS_VARS } from '../../../lib/css-vars-defaults';
import { buildLayerContext } from '../../../utils/sanitize';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const FETCH_TIMEOUT_MS = 5000;
const SAMPLE_STEP = 10; // every 10th pixel
const K_CLUSTERS = 5;
const MAX_KMEANS_ITER = 10;

// Block private / internal IPs to prevent SSRF
const SSRF_BLOCKLIST = [
  /^127\./,
  /^10\./,
  /^172\.(1[6-9]|2\d|3[01])\./,
  /^192\.168\./,
  /^169\.254\./,
  /^0\./,
  /^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./,
  /^localhost$/i,
  /^\[::1\]$/,
  /^\[fe80:/i,
];

function isPrivateHost(hostname: string): boolean {
  return SSRF_BLOCKLIST.some((r) => r.test(hostname));
}

// K-Means clustering — Manhattan distance for speed
function kMeans(pixels: number[][], k: number = K_CLUSTERS, maxIter: number = MAX_KMEANS_ITER) {
  let centroids = pixels.slice(0, k).map(p => [...p]);
  let clusters: number[][][] = [];

  for (let iter = 0; iter < maxIter; iter++) {
    clusters = Array.from({ length: k }, () => [] as number[][]);
    for (const p of pixels) {
      let minDist = Infinity;
      let minIdx = 0;
      for (let i = 0; i < k; i++) {
        const d = Math.abs(p[0] - centroids[i][0]) + Math.abs(p[1] - centroids[i][1]) + Math.abs(p[2] - centroids[i][2]);
        if (d < minDist) { minDist = d; minIdx = i; }
      }
      clusters[minIdx].push(p);
    }
    for (let i = 0; i < k; i++) {
      if (clusters[i].length === 0) continue;
      const sum = clusters[i].reduce((acc, val) => [acc[0] + val[0], acc[1] + val[1], acc[2] + val[2]], [0, 0, 0]);
      centroids[i] = sum.map(v => Math.round(v / clusters[i].length));
    }
  }
  return clusters.map((c, i) => ({ color: centroids[i], count: c.length })).sort((a, b) => b.count - a.count);
}

function buildCssVars(
  primary: string, secondary: string, accent: string,
  bg: string, surface: string, text: string, textMuted: string,
  isDark: boolean,
): Record<string, string> {
  return {
    '--color-primary': primary,
    '--color-secondary': secondary,
    '--color-accent': accent,
    '--color-bg': bg,
    '--color-surface': surface,
    '--color-text': text,
    '--color-text-muted': textMuted,
    '--color-border': isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
    ...STRUCTURAL_CSS_VARS,
    '--ambient-1': isDark ? `color-mix(in srgb, ${primary} 18%, transparent)` : `color-mix(in srgb, ${primary} 8%, transparent)`,
    '--ambient-2': isDark ? `color-mix(in srgb, ${secondary} 8%, transparent)` : `color-mix(in srgb, ${secondary} 4%, transparent)`,
  };
}

export const POST: APIRoute = async ({ request }) => {
  let body: { imageUrl?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  }

  const { imageUrl } = body;
  if (!imageUrl || typeof imageUrl !== 'string' || !/^https?:\/\//.test(imageUrl)) {
    return new Response(JSON.stringify({ error: 'Invalid or missing imageUrl. Must be an http(s) URL.' }), {
      status: 400, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  }

  // SSRF protection: block internal / private hosts
  try {
    const host = new URL(imageUrl).hostname;
    if (isPrivateHost(host)) {
      return new Response(JSON.stringify({ error: 'Internal hosts are not allowed' }), {
        status: 400, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
      });
    }
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid URL' }), {
      status: 400, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  }

  // Fetch image with size + timeout guards
  let imgRes: Response;
  try {
    imgRes = await fetch(imageUrl, { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) });
  } catch (err: any) {
    console.error('[extract-theme] fetch error:', err.message);
    return new Response(JSON.stringify({ error: 'Failed to fetch image' }), {
      status: 502, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  }

  if (!imgRes.ok) {
    return new Response(JSON.stringify({ error: `Upstream returned ${imgRes.status} ${imgRes.statusText}` }), {
      status: 502, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  }

  const contentLength = Number(imgRes.headers.get('content-length'));
  if (contentLength > MAX_IMAGE_SIZE) {
    return new Response(JSON.stringify({ error: 'Image too large (>5MB)' }), {
      status: 413, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  }

  let buffer: ArrayBuffer;
  try {
    buffer = await imgRes.arrayBuffer();
  } catch {
    return new Response(JSON.stringify({ error: 'Failed to read image body' }), {
      status: 500, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  }

  if (buffer.byteLength > MAX_IMAGE_SIZE) {
    return new Response(JSON.stringify({ error: 'Image too large (>5MB)' }), {
      status: 413, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  }

  const mime = imgRes.headers.get('content-type') || '';

  // Decode and sample pixels
  let pixels: number[][] = [];

  try {
    if (mime.includes('jpeg') || mime.includes('jpg')) {
      const rawData = jpeg.decode(buffer, { useTArray: true });
      for (let i = 0; i < rawData.data.length; i += 4 * SAMPLE_STEP) {
        pixels.push([rawData.data[i], rawData.data[i + 1], rawData.data[i + 2]]);
      }
    } else if (mime.includes('png')) {
      const buf = Buffer.from(buffer);
      const png = PNG.sync.read(buf);
      for (let i = 0; i < png.data.length; i += 4 * SAMPLE_STEP) {
        if (png.data[i + 3] > 128) {
          pixels.push([png.data[i], png.data[i + 1], png.data[i + 2]]);
        }
      }
    } else {
      return new Response(JSON.stringify({ error: 'Unsupported format. Only JPEG and PNG are supported.' }), {
        status: 415, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
      });
    }
  } catch (err: any) {
    console.error('[extract-theme] decode error:', err.message);
    return new Response(JSON.stringify({ error: 'Image decode failed' }), {
      status: 500, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  }

  if (pixels.length === 0) {
    return new Response(JSON.stringify({ error: 'No valid pixels found in image' }), {
      status: 422, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  }

  // K-Means clustering
  const palette = kMeans(pixels, K_CLUSTERS);
  const hexPalette = palette.map(p => rgbToHex(p.color[0], p.color[1], p.color[2]));

  // Color semantics engine
  const dominantHex = hexPalette[0];
  const [dr, dg, db] = palette[0].color;
  const dominantLuminance = getLuminance(dr, dg, db);
  const isDark = dominantLuminance < 0.5;

  let bgColor: string;
  let surfaceColor: string;
  let textColor: string;
  let textMutedColor: string;

  if (isDark) {
    bgColor = rgbToHex(Math.floor(dr * 0.4), Math.floor(dg * 0.4), Math.floor(db * 0.4));
    surfaceColor = rgbToHex(Math.floor(dr * 0.6), Math.floor(dg * 0.6), Math.floor(db * 0.6));
    textColor = '#f8fafc';
    textMutedColor = '#94a3b8';
  } else {
    bgColor = rgbToHex(Math.min(255, dr + 30), Math.min(255, dg + 30), Math.min(255, db + 30));
    surfaceColor = '#ffffff';
    textColor = '#0f172a';
    textMutedColor = '#475569';
  }

  // Find the most saturated + contrast-compliant primary from the palette
  let primaryColor = hexPalette[1] || dominantHex;
  let bestScore = -1;

  for (let i = 1; i < palette.length; i++) {
    const hex = hexPalette[i];
    const contrast = getContrastRatio(hex, bgColor);
    const [r, g, b] = palette[i].color;
    const saturationProxy = Math.max(r, g, b) - Math.min(r, g, b);
    const score = (contrast > 4.5 ? 100 : contrast * 10) + saturationProxy;
    if (score > bestScore) {
      bestScore = score;
      primaryColor = hex;
    }
  }

  const secondaryColor = hexPalette[2] || primaryColor;
  const accentColor = hexPalette[3] || primaryColor;

  const cssVars = enrichCssVars(buildCssVars(
    primaryColor, secondaryColor, accentColor,
    bgColor, surfaceColor, textColor, textMutedColor,
    isDark,
  ));

  const customCss = `body { background: linear-gradient(135deg, var(--color-bg) 0%, var(--color-surface) 100%); }`;

  return new Response(JSON.stringify({
    success: true,
    sourcePalette: hexPalette,
    isDark,
    themeName: 'Extracted Theme',
    cssVars,
    customCss,
    apiVersion: 'v1',
    layerContext: buildLayerContext(customCss, null),
  }, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
      ...CORS_HEADERS,
    },
  });
};

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}
