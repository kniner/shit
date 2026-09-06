import { useEffect } from 'react';
import { ITEMS_BY_ID } from '../data';
import { RIDE_VIBES, type Franchise } from '../data/rideVibes';
import { RIDE_WARNINGS } from '../data/rideInfo';
import { summarizeTags, TAG_META } from '../lib/tags';
import type { Attraction } from '../lib/types';
import { useActiveDay, useStore } from '../store/useStore';
import { TagControl } from './TagControl';

const KIND_LABEL: Record<Attraction['kind'], string> = {
  ride: 'Ride',
  show: 'Show',
  attraction: 'Attraction',
  dining: 'Character Dining',
  festival: 'Food & Wine',
  entertainment: 'Party Event',
  experience: 'Experience',
  food: 'Food',
};

const THRILL_WORD = ['Gentle', 'Mild thrill', 'Moderate thrill', 'Big thrill'];

const FRANCHISE_LABEL: Record<Franchise, string> = {
  princess: '👑 Princess',
  pixar: 'Pixar',
  space: '🚀 Space',
  adventure: '🗺️ Adventure',
};

const RESERVATION_KINDS: Attraction['kind'][] = ['dining', 'experience'];

/**
 * Full-screen "ride page" overlay: description, waits, ride length, height &
 * safety advisories, vibe tags, the group's tags, and quick actions (tag it,
 * add it to the day). Opened from anywhere via the store's `openDetail`, so ride
 * cards and map markers both lead here.
 */
export function AttractionDetail() {
  const detailId = useStore((s) => s.detailId);
  const close = useStore((s) => s.closeDetail);
  const doc = useStore((s) => s.doc);
  const meId = useStore((s) => s.meId);
  const live = useStore((s) => s.live);
  const addStop = useStore((s) => s.addStop);
  const removeStop = useStore((s) => s.removeStop);
  const completed = useStore((s) => s.doc.completed);
  const toggleCompleted = useStore((s) => s.toggleCompleted);
  const day = useActiveDay();

  const ownerId = doc.ownerId ?? doc.collaborators[0]?.id;
  const isOwner = meId != null && ownerId === meId;

  // Close on Escape.
  useEffect(() => {
    if (!detailId) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [detailId, close]);

  if (!detailId) return null;
  const item = ITEMS_BY_ID[detailId];
  if (!item) return null;

  const warn = RIDE_WARNINGS[item.id];
  const vibe = RIDE_VIBES[item.id];
  const summary = summarizeTags(item.id, doc.tags, doc.collaborators, meId);
  const lw = live[item.id];
  const stop = day.stops.find((s) => s.attractionId === item.id);
  const isDone = completed.includes(item.id);
  const showWaits = !RESERVATION_KINDS.includes(item.kind) && item.kind !== 'food';

  const vibeChips: string[] = [];
  if (vibe) {
    if (vibe.dark) vibeChips.push('Indoor dark ride');
    if (vibe.water) vibeChips.push('💦 May get wet');
    if (vibe.kids) vibeChips.push('🧸 Great for little kids');
    if (vibe.indoor) vibeChips.push('❄️ Indoor / AC');
    if (vibe.classic) vibeChips.push('Classic Disney');
    if (vibe.immersive) vibeChips.push('Headliner');
    if (vibe.spectacle) vibeChips.push('Show / spectacle');
    for (const f of vibe.franchises ?? []) vibeChips.push(FRANCHISE_LABEL[f]);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-0 sm:items-center sm:p-4"
      onClick={close}
      role="dialog"
      aria-modal="true"
      aria-label={item.name}
    >
      <div
        className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white p-5 shadow-xl sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-xl font-extrabold leading-tight">{item.name}</h2>
            <p className="mt-0.5 text-xs text-slate-500">
              {KIND_LABEL[item.kind]} · {item.land}
              {summary.consensus && (
                <span className="ml-1 font-semibold" style={{ color: TAG_META[summary.consensus].color }}>
                  · group: {TAG_META[summary.consensus].label}
                </span>
              )}
            </p>
          </div>
          <button
            onClick={close}
            className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-sm font-bold text-slate-500 hover:bg-slate-200"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Description */}
        <p className="text-sm leading-relaxed text-slate-700">
          {item.description ||
            item.note ||
            'A Walt Disney World experience — details coming; tap the menu link or ask a cast member for specifics.'}
        </p>

        {/* Stats */}
        <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-slate-900 p-3 text-center text-white">
          {showWaits ? (
            <>
              <Stat label="Typical" value={`${item.avgWait}m`} />
              <Stat label="Peak" value={`${item.maxWait}m`} />
              <Stat
                label={item.kind === 'ride' ? 'Ride' : 'Time'}
                value={`${item.duration}m`}
              />
            </>
          ) : (
            <>
              <Stat label="Type" value={item.kind === 'dining' ? 'Dining' : 'Reserve'} />
              <Stat label="Length" value={`${item.duration}m`} />
              <Stat label="Book" value="MDE" />
            </>
          )}
        </div>
        {showWaits && lw && (
          <p className="mt-1.5 text-center text-xs">
            <span className={lw.isOpen ? 'font-semibold text-emerald-600' : 'text-slate-400'}>
              Live now: {lw.isOpen ? `${lw.wait} min` : 'closed'}
            </span>{' '}
            <span className="text-slate-400">· via queue-times.com</span>
          </p>
        )}

        {/* Vibe */}
        {vibe && (
          <div className="mt-4">
            <h3 className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-500">The vibe</h3>
            <div className="flex flex-wrap gap-1.5 text-[11px]">
              <span className="rounded-full bg-indigo-100 px-2 py-0.5 font-semibold text-indigo-700">
                {THRILL_WORD[vibe.thrill]}
              </span>
              {vibeChips.map((c) => (
                <span key={c} className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-600">
                  {c}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Safety */}
        {warn && (warn.heightMin || warn.pregnancy || warn.motion || warn.bigTall) && (
          <div className="mt-4">
            <h3 className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-500">
              Before you ride
            </h3>
            <ul className="space-y-1 text-xs text-slate-600">
              {warn.heightMin && (
                <li>📏 Must be <strong>{warn.heightMin}″</strong> tall to ride</li>
              )}
              {warn.pregnancy && <li>🤰 Not recommended for expectant mothers</li>}
              {warn.motion && <li>🌀 May cause motion sickness</li>}
              {warn.bigTall && <li>📐 May not fit larger or very tall guests (≈6′8″+)</li>}
            </ul>
          </div>
        )}

        {/* Who wants it */}
        {summary.entries.length > 0 && (
          <div className="mt-4">
            <h3 className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-500">
              Who's tagged it
            </h3>
            <div className="flex flex-wrap gap-1.5 text-[11px]">
              {summary.entries.map((e, i) => (
                <span
                  key={`${e.collaborator.id}-${i}`}
                  className="flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5"
                >
                  <span className="h-2 w-2 rounded-full" style={{ background: e.collaborator.color }} />
                  {e.collaborator.name}
                  <span className="font-semibold" style={{ color: TAG_META[e.tag].color }}>
                    {TAG_META[e.tag].short}
                  </span>
                </span>
              ))}
            </div>
          </div>
        )}

        {item.url && (
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block text-sm font-semibold text-indigo-600 hover:underline"
          >
            {item.kind === 'dining' || item.kind === 'food' ? 'View menu ↗' : 'Official page ↗'}
          </a>
        )}

        {/* Your tag */}
        <div className="mt-4 border-t border-slate-100 pt-4">
          <h3 className="mb-1.5 text-xs font-bold uppercase tracking-wide text-slate-500">Your tag</h3>
          <TagControl attractionId={item.id} summary={summary} />
        </div>

        {/* Actions */}
        <div className="mt-4 flex flex-wrap gap-2">
          {isOwner && (
            <button
              onClick={() => (stop ? removeStop(stop.id) : addStop(item.id))}
              className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold ${
                stop
                  ? 'bg-slate-900 text-white'
                  : 'border border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {stop ? `✓ In ${day.name}` : `+ Add to ${day.name}`}
            </button>
          )}
          {showWaits && (
            <button
              onClick={() => toggleCompleted(item.id)}
              className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold ${
                isDone
                  ? 'bg-emerald-500 text-white'
                  : 'border border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              {isDone ? '✓ Rode it' : 'Mark as done'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wide text-slate-400">{label}</p>
      <p className="text-base font-bold">{value}</p>
    </div>
  );
}
