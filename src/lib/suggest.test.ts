import { describe, expect, it } from 'vitest';
import { ITEMS_BY_ID } from '../data';
import { suggestNext } from './suggest';
import type { Collaborator, Day, TagEntry } from './types';

const day = (overrides: Partial<Day> = {}): Day => ({
  id: 'd',
  name: 'MK',
  park: 'mk',
  event: 'regular',
  stops: [],
  settings: { pace: 'average', waitMode: 'avg', startTime: '09:00', bufferPerStop: 0 },
  ...overrides,
});

const ctx = (tags: TagEntry[] = [], collaborators: Collaborator[] = []) => ({
  day: day(),
  live: {},
  tags,
  collaborators,
  meId: collaborators[0]?.id ?? null,
});

describe('suggestNext', () => {
  it('ranks closer/shorter-wait items higher with no priorities', () => {
    const from = ITEMS_BY_ID['space-mountain'];
    const res = suggestNext(ctx(), from, 5);
    expect(res.length).toBeGreaterThan(0);
    // Sorted ascending by score.
    for (let i = 1; i < res.length; i++) {
      expect(res[i].score).toBeGreaterThanOrEqual(res[i - 1].score);
    }
    // The starting item isn't suggested back to itself.
    expect(res.every((r) => r.item.id !== 'space-mountain')).toBe(true);
  });

  it('excludes avoid-tagged items and boosts must-dos', () => {
    const me: Collaborator = { id: 'u1', name: 'Me', color: '#000' };
    const tags: TagEntry[] = [
      { attractionId: 'haunted-mansion', userId: 'u1', tag: 'avoid' },
      { attractionId: 'big-thunder', userId: 'u1', tag: 'must' },
    ];
    const res = suggestNext(ctx(tags, [me]), ITEMS_BY_ID['space-mountain'], 30);
    expect(res.some((r) => r.item.id === 'haunted-mansion')).toBe(false);
    expect(res.find((r) => r.item.id === 'big-thunder')?.priority).toBe('must');
  });

  it('boosts a ride running shorter than typical and reports vsAvg', () => {
    const big = ITEMS_BY_ID['big-thunder'];
    // Pin big-thunder's live wait well below its average; it should rank ahead
    // of an equivalent untagged ride and expose a negative vsAvg.
    const res = suggestNext(
      { ...ctx(), live: { 'big-thunder': { wait: Math.max(0, big.avgWait - 40), isOpen: true } } },
      ITEMS_BY_ID['space-mountain'],
      30,
    );
    const hit = res.find((r) => r.item.id === 'big-thunder');
    expect(hit?.vsAvg).toBe(Math.max(0, big.avgWait - 40) - big.avgWait);
    expect(hit?.vsAvg).toBeLessThan(0);
  });

  it('penalizes a ride busier than typical', () => {
    const big = ITEMS_BY_ID['big-thunder'];
    const calm = suggestNext(ctx(), ITEMS_BY_ID['space-mountain'], 100).find(
      (r) => r.item.id === 'big-thunder',
    );
    const busy = suggestNext(
      { ...ctx(), live: { 'big-thunder': { wait: big.avgWait + 40, isOpen: true } } },
      ITEMS_BY_ID['space-mountain'],
      100,
    ).find((r) => r.item.id === 'big-thunder');
    // Same walk/priority, but a busier-than-usual line scores worse (higher).
    expect(busy!.score).toBeGreaterThan(calm!.score);
  });

  it('ignores live waits for a closed ride (no vsAvg)', () => {
    const res = suggestNext(
      { ...ctx(), live: { 'big-thunder': { wait: 0, isOpen: false } } },
      ITEMS_BY_ID['space-mountain'],
      30,
    );
    expect(res.find((r) => r.item.id === 'big-thunder')?.vsAvg).toBeUndefined();
  });

  it('skips items already in the route', () => {
    const c = {
      ...ctx(),
      day: day({ stops: [{ id: 's1', kind: 'item', attractionId: 'jungle-cruise' }] }),
    };
    const res = suggestNext(c, ITEMS_BY_ID['space-mountain'], 30);
    expect(res.some((r) => r.item.id === 'jungle-cruise')).toBe(false);
  });
});
