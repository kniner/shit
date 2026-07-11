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

/**
 * Decorative tree clusters, placed in the green gaps between lands to give the
 * map some landscaping. Purely cosmetic; positions are hand-picked to sit off
 * the walkways and marker clusters.
 */
export const PARK_TREES: Record<ParkId, { x: number; y: number }[]> = {
  mk: [
    { x: 250, y: 405 }, { x: 350, y: 400 }, { x: 235, y: 300 }, { x: 372, y: 300 },
    { x: 300, y: 250 }, { x: 405, y: 120 }, { x: 200, y: 118 }, { x: 95, y: 320 },
    { x: 470, y: 230 }, { x: 130, y: 445 }, { x: 430, y: 400 }, { x: 300, y: 500 },
  ],
  epcot: [
    { x: 300, y: 470 }, { x: 300, y: 175 }, { x: 235, y: 300 }, { x: 375, y: 300 },
    { x: 120, y: 120 }, { x: 480, y: 120 }, { x: 300, y: 250 }, { x: 130, y: 400 },
    { x: 470, y: 400 }, { x: 300, y: 620 },
  ],
  legoland: [],
  resort: [],
};
