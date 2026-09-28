import { useStore } from '../store/useStore';

/**
 * At-a-glance live-wait status for the wishlist: whether the queue-times feed is
 * connected, how many rides are open right now, and a manual refresh. Explains
 * why ride cards may show no "Live" badge (parks closed / feed down).
 */
export function LiveWaitsBar() {
  const live = useStore((s) => s.live);
  const status = useStore((s) => s.liveStatus);
  const refresh = useStore((s) => s.refreshLive);

  const openCount = Object.values(live).filter((w) => w.isOpen).length;
  const busy = status === 'loading' || status === 'idle';

  let dot = 'bg-slate-300';
  let text = 'Checking live wait times…';
  if (status === 'ok' && openCount > 0) {
    dot = 'bg-emerald-500';
    text = `Live waits on · ${openCount} rides open now`;
  } else if (status === 'ok') {
    dot = 'bg-amber-400';
    text = 'Live feed connected · parks look closed right now';
  } else if (status === 'unavailable') {
    dot = 'bg-rose-400';
    text = 'Live waits unavailable — using typical estimates';
  }

  return (
    <div className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600">
      <span className="flex items-center gap-2">
        <span className={`h-2 w-2 shrink-0 rounded-full ${dot} ${busy ? 'animate-pulse' : ''}`} />
        {text}
      </span>
      <button
        onClick={() => void refresh()}
        disabled={busy}
        className="shrink-0 rounded-md border border-slate-300 px-2 py-0.5 font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
        title="Refresh live wait times from queue-times.com"
      >
        ↻ Refresh
      </button>
    </div>
  );
}
