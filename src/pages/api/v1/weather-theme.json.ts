import type { APIRoute } from 'astro';
import { getDailyTheme, getAllThemes } from '../../../utils/daily-theme';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

const WEATHER_THEME_MAP: Record<string, string> = {
  clear: 'sunny-day',
  sunny: 'sunny-day',
  rain: 'rainy-mood',
  drizzle: 'rainy-mood',
  thunderstorm: 'thunderstorm',
  snow: 'snow-white',
  clouds: 'cloudy-grey',
  overcast: 'cloudy-grey',
  fog: 'cloudy-grey',
  mist: 'cloudy-grey',
  haze: 'cloudy-grey',
};

function mapWeatherCode(code: number): string {
  if (code === 0) return 'clear';
  if (code >= 1 && code <= 3) return 'clouds';
  if (code >= 45 && code <= 49) return 'fog';
  if (code >= 50 && code <= 69) return 'rain';
  if (code >= 70 && code <= 79) return 'snow';
  if (code >= 80 && code <= 82) return 'rain';
  if (code >= 85 && code <= 86) return 'snow';
  if (code >= 95 && code <= 99) return 'thunderstorm';
  return 'clear';
}

function extractGeo(request: Request, locals: any): { lat: string; lon: string } {
  // 1. Vercel headers
  const vercelLat = request.headers.get('x-vercel-ip-latitude');
  const vercelLon = request.headers.get('x-vercel-ip-longitude');
  if (vercelLat && vercelLon) return { lat: vercelLat, lon: vercelLon };

  // 2. Netlify Astro locals
  const netlifyGeo = locals?.netlify?.context?.geo;
  if (netlifyGeo?.latitude && netlifyGeo?.longitude) {
    return { lat: netlifyGeo.latitude.toString(), lon: netlifyGeo.longitude.toString() };
  }

  // 3. Netlify Edge header
  const nfGeoHeader = request.headers.get('x-nf-geo');
  if (nfGeoHeader) {
    try {
      const geoStr = Buffer.from(nfGeoHeader, 'base64').toString('utf-8');
      const geoJson = JSON.parse(geoStr);
      if (geoJson.latitude && geoJson.longitude) {
        return { lat: geoJson.latitude.toString(), lon: geoJson.longitude.toString() };
      }
    } catch { /* ignore */ }
  }

  return { lat: '39.90', lon: '116.40' };
}

async function reverseGeocode(lat: string, lon: string): Promise<string | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&zoom=10&accept-language=zh`;
    const res = await fetch(url, {
      signal: AbortSignal.timeout(2000),
      headers: { 'User-Agent': 'ThemeDist/1.0 (weather demo)' },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.address?.city || data?.address?.town || data?.address?.county || data?.name || null;
  } catch {
    return null;
  }
}

export const GET: APIRoute = async ({ request, locals, url }) => {
  // Query param overrides take precedence (for client-side geolocation)
  const qLat = url.searchParams.get('lat');
  const qLon = url.searchParams.get('lon');

  let lat: string;
  let lon: string;

  if (qLat && qLon) {
    lat = qLat;
    lon = qLon;
  } else {
    const geo = extractGeo(request, locals);
    lat = geo.lat;
    lon = geo.lon;
  }

  let weatherType = 'clear';
  let weatherDesc = 'Clear Sky';
  let temperature: number | null = null;
  let city: string | null = null;

  // Fire weather + geocode in parallel
  const weatherPromise = (async () => {
    try {
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
      const res = await fetch(weatherUrl, { signal: AbortSignal.timeout(3000) });
      if (res.ok) {
        const data = await res.json();
        const code = data.current_weather?.weathercode;
        temperature = data.current_weather?.temperature ?? null;
        if (code !== undefined && code !== null) {
          weatherType = mapWeatherCode(code);
        }
      }
    } catch { /* use defaults */ }
  })();

  const geocodePromise = reverseGeocode(lat, lon).then(c => { city = c; }).catch(() => {});

  await Promise.all([weatherPromise, geocodePromise]);

  const descMap: Record<string, string> = {
    clear: 'Clear Sky', clouds: 'Cloudy', fog: 'Foggy',
    rain: 'Rainy', snow: 'Snowy', thunderstorm: 'Thunderstorm',
  };
  weatherDesc = descMap[weatherType] || 'Sunny';

  const themes = getAllThemes();
  const presetKey = WEATHER_THEME_MAP[weatherType] || 'sunny-day';
  const weatherTheme = themes.find((t) => t.preset === presetKey);
  const theme = weatherTheme || getDailyTheme();

  return new Response(JSON.stringify({
    weather: {
      type: weatherType,
      description: weatherDesc,
      temperature: temperature !== null ? `${temperature}°C` : null,
      city,
      location: { lat, lon },
    },
    theme: {
      preset: theme.preset,
      presetName: theme.presetName,
      cssVars: theme.cssVars,
      customCss: theme.customCss || null,
      extensions: theme.extensions || null,
    },
  }, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=1800',
      ...CORS_HEADERS,
    },
  });
};

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}
