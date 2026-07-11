import { describe, expect, it } from 'vitest';
import { centroid, convexHull, expand, regionPath, smoothClosedPath } from './mapGeom';

describe('mapGeom', () => {
  it('computes a centroid', () => {
    expect(centroid([{ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 5, y: 6 }])).toEqual({ x: 5, y: 2 });
  });

  it('hulls a square (ignores an interior point)', () => {
    const hull = convexHull([
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 10, y: 10 },
      { x: 0, y: 10 },
      { x: 5, y: 5 }, // interior — must be dropped
    ]);
    expect(hull).toHaveLength(4);
    expect(hull.some((p) => p.x === 5 && p.y === 5)).toBe(false);
  });

  it('expands points away from the centroid', () => {
    const [a] = expand([{ x: 10, y: 0 }, { x: -10, y: 0 }], 5);
    expect(a.x).toBeCloseTo(15); // pushed further out along +x
  });

  it('smoothClosedPath returns a closed cubic path', () => {
    const d = smoothClosedPath([{ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 5, y: 8 }]);
    expect(d.startsWith('M')).toBe(true);
    expect(d.includes('C')).toBe(true);
    expect(d.trim().endsWith('Z')).toBe(true);
  });

  it('regionPath handles a single point (rounded blob) and many points', () => {
    expect(regionPath([{ x: 5, y: 5 }]).includes('C')).toBe(true);
    const many = regionPath([
      { x: 0, y: 0 },
      { x: 20, y: 2 },
      { x: 18, y: 18 },
      { x: 2, y: 20 },
    ]);
    expect(many.startsWith('M')).toBe(true);
    expect(many.endsWith('Z')).toBe(true);
  });
});
