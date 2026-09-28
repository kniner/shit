/**
 * Small 2-D geometry helpers for the park map: build smooth, organic land
 * shapes from the (schematic) attraction coordinates so lands read as painted
 * areas rather than bounding boxes.
 */
export interface Pt {
  x: number;
  y: number;
}

export function centroid(points: Pt[]): Pt {
  const n = points.length || 1;
  return {
    x: points.reduce((s, p) => s + p.x, 0) / n,
    y: points.reduce((s, p) => s + p.y, 0) / n,
  };
}

/** Andrew's monotone-chain convex hull. Returns hull points counter-clockwise. */
export function convexHull(points: Pt[]): Pt[] {
  const pts = [...points].sort((a, b) => a.x - b.x || a.y - b.y);
  if (pts.length <= 2) return pts;
  const cross = (o: Pt, a: Pt, b: Pt) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
  const lower: Pt[] = [];
  for (const p of pts) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0)
      lower.pop();
    lower.push(p);
  }
  const upper: Pt[] = [];
  for (let i = pts.length - 1; i >= 0; i--) {
    const p = pts[i];
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0)
      upper.pop();
    upper.push(p);
  }
  lower.pop();
  upper.pop();
  return lower.concat(upper);
}

/** Push each point outward from the centroid by `pad` px (grows a shape). */
export function expand(points: Pt[], pad: number): Pt[] {
  const c = centroid(points);
  return points.map((p) => {
    const dx = p.x - c.x;
    const dy = p.y - c.y;
    const d = Math.hypot(dx, dy) || 1;
    return { x: p.x + (dx / d) * pad, y: p.y + (dy / d) * pad };
  });
}

/**
 * A closed SVG path smoothly interpolating the given points with a
 * Catmull-Rom → cubic-Bézier conversion. `tension` ~1 gives round, blobby
 * curves. Returns '' for an empty input.
 */
export function smoothClosedPath(points: Pt[], tension = 1): string {
  const p = points;
  const n = p.length;
  if (n === 0) return '';
  if (n === 1) return `M ${p[0].x} ${p[0].y}`;
  const f = (v: number) => v.toFixed(1);
  const d: string[] = [`M ${f(p[0].x)} ${f(p[0].y)}`];
  for (let i = 0; i < n; i++) {
    const p0 = p[(i - 1 + n) % n];
    const p1 = p[i];
    const p2 = p[(i + 1) % n];
    const p3 = p[(i + 2) % n];
    const c1x = p1.x + ((p2.x - p0.x) / 6) * tension;
    const c1y = p1.y + ((p2.y - p0.y) / 6) * tension;
    const c2x = p2.x - ((p3.x - p1.x) / 6) * tension;
    const c2y = p2.y - ((p3.y - p1.y) / 6) * tension;
    d.push(`C ${f(c1x)} ${f(c1y)} ${f(c2x)} ${f(c2y)} ${f(p2.x)} ${f(p2.y)}`);
  }
  d.push('Z');
  return d.join(' ');
}

/**
 * Build an organic, smooth closed region around a cluster of points. With 3+
 * points it smooths a padded convex hull; with 1–2 it wraps them in a rounded
 * blob so tiny lands still look like areas, not slivers.
 */
export function regionPath(points: Pt[], pad = 34): string {
  if (points.length >= 3) {
    return smoothClosedPath(expand(convexHull(points), pad));
  }
  const c = centroid(points);
  const reach = Math.max(38, ...points.map((p) => Math.hypot(p.x - c.x, p.y - c.y))) + pad;
  const ring: Pt[] = Array.from({ length: 10 }, (_, i) => {
    const a = (i / 10) * Math.PI * 2;
    return { x: c.x + Math.cos(a) * reach * 1.1, y: c.y + Math.sin(a) * reach * 0.85 };
  });
  return smoothClosedPath(ring);
}
