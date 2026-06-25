import { ITEMS, PARKS } from '../data';
import type { LiveWaits } from './types';

interface QueueTimesRide {
  name: string;
  is_open: boolean;
  wait_time: number;
}

interface QueueTimesResponse {
  lands?: { rides: QueueTimesRide[] }[];
  rides?: QueueTimesRide[];
}

function normalize(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '');
}

// Map normalized live feed names back to our item ids.
const LIVE_NAME_TO_ID = new Map<string, string>();
for (const a of ITEMS) {
  if (a.liveName) LIVE_NAME_TO_ID.set(normalize(a.liveName), a.id);
  LIVE_NAME_TO_ID.set(normalize(a.name), a.id);
}

// queue-times.com doesn't send CORS headers, so a browser on our deployed origin
// can't read it directly — we route through a CORS proxy. Set VITE_WAITS_PROXY
// (e.g. a Cloudflare Worker base URL that takes the target as a suffix) to use
// your own; otherwise fall back to public proxies, trying each in order.
const CONFIGURED_PROXY = import.meta.env.VITE_WAITS_PROXY as string | undefined;
const PROXY_BUILDERS: ((target: string) => string)[] = CONFIGURED_PROXY
  ? [(t) => `${CONFIGURED_PROXY}${encodeURIComponent(t)}`]
  : [
      (t) => `https://corsproxy.io/?url=${encodeURIComponent(t)}`,
      (t) => `https://api.allorigins.win/raw?url=${encodeURIComponent(t)}`,
    ];

function parseRides(data: QueueTimesResponse): LiveWaits {
  const rides: QueueTimesRide[] = data.lands
    ? data.lands.flatMap((l) => l.rides)
    : (data.rides ?? []);
  const out: LiveWaits = {};
  for (const ride of rides) {
    const id = LIVE_NAME_TO_ID.get(normalize(ride.name));
    if (!id) continue;
    out[id] = { wait: ride.wait_time ?? 0, isOpen: !!ride.is_open };
  }
  return out;
}

async function fetchPark(queueTimesId: number, signal?: AbortSignal): Promise<LiveWaits> {
  const target = `https://queue-times.com/parks/${queueTimesId}/queue_times.json`;
  for (const build of PROXY_BUILDERS) {
    try {
      const res = await fetch(build(target), { signal });
      if (!res.ok) continue;
      return parseRides((await res.json()) as QueueTimesResponse);
    } catch {
      // try the next proxy
    }
  }
  return {};
}

/**
 * Fetch current wait times from queue-times.com for every park we cover and
 * map them onto our item ids. Returns an empty object on total failure
 * (offline, CORS, rate limit) so the app degrades gracefully to static data.
 */
export async function fetchLiveWaits(signal?: AbortSignal): Promise<LiveWaits> {
  try {
    // Only parks with a real queue-times id have a live feed (water parks etc.
    // are id 0 and skipped — they degrade to static avg/max waits).
    const parks = Object.values(PARKS).filter((p) => p.queueTimesId > 0);
    const results = await Promise.all(
      parks.map((p) => fetchPark(p.queueTimesId, signal).catch(() => ({}) as LiveWaits)),
    );
    return Object.assign({}, ...results) as LiveWaits;
  } catch {
    return {};
  }
}
