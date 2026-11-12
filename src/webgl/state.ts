/**
 * Shared, mutable (non-React) state between the DOM and the WebGL layer.
 * Written by DOM listeners / the Director, read inside useFrame — no re-renders.
 */
export type Tier = 1 | 2 | 3;

export const MOODS = ["nacht", "beeren", "produkt", "ritual", "finale"] as const;
export type Mood = (typeof MOODS)[number];

export const world = {
  tier: 2 as Tier,
  /** Smoothed pointer in [-1, 1] */
  pointer: { x: 0, y: 0, tx: 0, ty: 0 },
  /** Product drag rotation (radians), velocity for inertia */
  drag: { yaw: 0, vel: 0, active: false },
  /** Pointer currently over the active pouch stage */
  hover: false,
  /** Seconds since the 3D layer became visible (intro animation) */
  introStart: -1,
  /** Normalised visibility weight per mood (sum 1) */
  mood: { nacht: 1, beeren: 0, produkt: 0, ritual: 0, finale: 0 } as Record<Mood, number>,
  /** Progress (0..1) of the berry chapter through the viewport */
  berries: 0,
  /** Current blended pouch pose (world units / radians) */
  pouch: { x: 0, y: 0, z: 0, h: 2, yaw: 0, pitch: 0, roll: 0, spin: 0, visible: 1 },
  /** Blend weights per stage (for stage-specific extras) */
  stage: { hero: 1, berries: 0, product: 0, ritual: 0, finale: 0 } as Record<string, number>,
  /** Pouch position in NDC, used by the backdrop glow */
  pouchNdc: { x: 0.3, y: 0.1 },
};
