import type { ParkId } from '../lib/types';

/**
 * Approximate water features per park, in the same grid coordinates as
 * attractions. Purely decorative background so the schematic map reads more
 * like the real park (the castle moat & Rivers of America at MK, the World
 * Showcase Lagoon at EPCOT). A `blob` is a filled polygon; a `ring` is a
 * stroked circle (used for the thin castle moat so it doesn't cover markers).
 */
export interface WaterBlob {
  kind: 'blob';
  points: { x: number; y: number }[];
  label?: string;
}
export interface WaterRing {
  kind: 'ring';
  cx: number;
  cy: number;
  r: number;
}
export interface WaterCircle {
  kind: 'circle';
  cx: number;
  cy: number;
  r: number;
  label?: string;
}
export type WaterFeature = WaterBlob | WaterRing | WaterCircle;

export const PARK_WATER: Record<ParkId, WaterFeature[]> = {
  mk: [
    // Castle moat — a thin ring so the castle & hub markers stay on top.
    { kind: 'ring', cx: 300, cy: 300, r: 44 },
    // Rivers of America, wrapping Tom Sawyer Island on the west side.
    {
      kind: 'blob',
      label: 'Rivers of America',
      points: [
        { x: 92, y: 165 },
        { x: 175, y: 172 },
        { x: 186, y: 220 },
        { x: 168, y: 268 },
        { x: 110, y: 272 },
        { x: 86, y: 225 },
      ],
    },
  ],
  epcot: [
    // World Showcase Lagoon — the big central water the pavilions ring around.
    { kind: 'circle', cx: 300, cy: 470, r: 92, label: 'World Showcase Lagoon' },
  ],
  legoland: [],
  resort: [],
};
