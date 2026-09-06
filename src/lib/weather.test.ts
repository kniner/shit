import { describe, expect, it } from 'vitest';
import { normalFor, normalIcon, weatherIcon } from './weather';

describe('weather normals', () => {
  it('returns July normals for an Orlando summer date', () => {
    const n = normalFor('2026-07-15');
    expect(n).not.toBeNull();
    expect(n!.source).toBe('normal');
    expect(n!.hi).toBe(92);
    expect(n!.lo).toBe(74);
  });

  it('rejects a malformed date', () => {
    expect(normalFor('not-a-date')).toBeNull();
    expect(normalFor('2026-13-40')).toBeNull();
  });

  it('maps WMO codes to icons', () => {
    expect(weatherIcon(0).label).toBe('Clear');
    expect(weatherIcon(95).icon).toBe('⛈️');
    expect(weatherIcon(undefined).label).toBe('Typical');
  });

  it('picks a normals icon by rainy-day share', () => {
    expect(normalIcon(60)).toBe('⛅');
    expect(normalIcon(20)).toBe('☀️');
  });
});
