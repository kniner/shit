/**
 * Weather for the trip. Near-term dates use a live Open-Meteo forecast (free,
 * no key, CORS-enabled so it works straight from the browser); dates beyond the
 * forecast window fall back to Orlando climate normals so every planned day
 * still shows *something* useful ("typically 92°/74° in July").
 */

export interface DayWeather {
  date: string;
  /** High / low in °F. */
  hi: number;
  lo: number;
  /** Chance of rain (%) — forecast only. */
  precipProb?: number;
  /** WMO weather code (forecast) — drives the icon. */
  code?: number;
  /** Typical share of rainy days this month (%) — normals only. */
  rainPct?: number;
  source: 'forecast' | 'normal';
}

/** Walt Disney World area (Bay Lake / Lake Buena Vista, FL). */
const LAT = 28.385;
const LON = -81.563;

/**
 * Orlando monthly climate normals (°F high/low and rough share of rainy days),
 * indexed by month 0–11. Approximate NOAA-era figures — a planning reference,
 * not a forecast.
 */
const ORLANDO_NORMALS: { hi: number; lo: number; rainPct: number }[] = [
  { hi: 72, lo: 50, rainPct: 25 }, // Jan
  { hi: 75, lo: 52, rainPct: 25 }, // Feb
  { hi: 79, lo: 57, rainPct: 30 }, // Mar
  { hi: 83, lo: 60, rainPct: 25 }, // Apr
  { hi: 88, lo: 66, rainPct: 40 }, // May
  { hi: 91, lo: 72, rainPct: 55 }, // Jun
  { hi: 92, lo: 74, rainPct: 60 }, // Jul
  { hi: 92, lo: 74, rainPct: 60 }, // Aug
  { hi: 90, lo: 73, rainPct: 50 }, // Sep
  { hi: 85, lo: 66, rainPct: 35 }, // Oct
  { hi: 79, lo: 58, rainPct: 25 }, // Nov
  { hi: 74, lo: 52, rainPct: 25 }, // Dec
];

/** Climate-normal weather for any ISO date (no network needed). */
export function normalFor(dateIso: string): DayWeather | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateIso);
  if (!m) return null;
  const month = Number(m[2]) - 1;
  const n = ORLANDO_NORMALS[month];
  if (!n) return null;
  return { date: dateIso, hi: n.hi, lo: n.lo, rainPct: n.rainPct, source: 'normal' };
}

interface OpenMeteoDaily {
  daily?: {
    time?: string[];
    temperature_2m_max?: number[];
    temperature_2m_min?: number[];
    precipitation_probability_max?: number[];
    weather_code?: number[];
  };
}

/**
 * Fetch the Orlando daily forecast (up to ~16 days) keyed by ISO date. Returns
 * an empty object on any failure so callers degrade to climate normals.
 */
export async function fetchForecast(signal?: AbortSignal): Promise<Record<string, DayWeather>> {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}` +
    `&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code` +
    `&temperature_unit=fahrenheit&timezone=America%2FNew_York&forecast_days=16`;
  try {
    const res = await fetch(url, { signal });
    if (!res.ok) return {};
    const data = (await res.json()) as OpenMeteoDaily;
    const d = data.daily;
    if (!d?.time) return {};
    const out: Record<string, DayWeather> = {};
    d.time.forEach((date, i) => {
      const hi = d.temperature_2m_max?.[i];
      const lo = d.temperature_2m_min?.[i];
      if (typeof hi !== 'number' || typeof lo !== 'number') return;
      out[date] = {
        date,
        hi: Math.round(hi),
        lo: Math.round(lo),
        precipProb: d.precipitation_probability_max?.[i],
        code: d.weather_code?.[i],
        source: 'forecast',
      };
    });
    return out;
  } catch {
    return {};
  }
}

/** Map a WMO weather code to an emoji + short label. */
export function weatherIcon(code: number | undefined): { icon: string; label: string } {
  if (code === undefined) return { icon: '🌡️', label: 'Typical' };
  if (code === 0) return { icon: '☀️', label: 'Clear' };
  if (code <= 2) return { icon: '🌤️', label: 'Partly cloudy' };
  if (code === 3) return { icon: '☁️', label: 'Overcast' };
  if (code <= 48) return { icon: '🌫️', label: 'Fog' };
  if (code <= 57) return { icon: '🌦️', label: 'Drizzle' };
  if (code <= 67) return { icon: '🌧️', label: 'Rain' };
  if (code <= 77) return { icon: '❄️', label: 'Snow' };
  if (code <= 82) return { icon: '🌦️', label: 'Showers' };
  if (code <= 86) return { icon: '🌨️', label: 'Snow showers' };
  return { icon: '⛈️', label: 'Thunderstorm' };
}

/** Rough icon for a normals day based on how rainy the month typically is. */
export function normalIcon(rainPct: number | undefined): string {
  if (rainPct === undefined) return '🌡️';
  if (rainPct >= 50) return '⛅';
  if (rainPct >= 30) return '🌤️';
  return '☀️';
}
