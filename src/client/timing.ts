/**
 * Central pacing of the presentation. Nothing here touches game logic: the
 * round is complete before the first frame of it is shown, so pace can only
 * change how long each step stays on screen.
 *
 * All durations in the views are written for NORMAL. A mode applies one time
 * scale to every tween and timer. Steps that carry information the player has
 * to read are paused through `hold()`, which guarantees a minimum time in
 * real milliseconds whatever the scale is.
 */
export type SpeedMode = 'normal' | 'fast' | 'skip';
export const SPEED_MODES: readonly SpeedMode[] = ['normal', 'fast', 'skip'];

/** Time scale per mode (2 = twice as fast). */
export const SPEED_SCALE: Record<SpeedMode, number> = { normal: 1, fast: 1.9, skip: 5 };

/** The Temple Bonus and feature summaries never run faster than this, in any mode. */
export const MAX_SCENE_SCALE = 1.6;

/** Pauses at NORMAL pace, in milliseconds: [duration, minimum in real time at any pace]. */
export const HOLD = {
  /** Before a free spin starts: the counter has changed. */
  freeSpinStart: [260, 100],
  /** Base Camp effects at the start of a free spin, shown together. */
  campEffects: [420, 220],
  /** After the grid has landed, before evaluation. */
  afterLanding: [160, 0],
  /** A win stays marked after its presentation. */
  afterWin: [160, 120],
  /** A station has just been unlocked. */
  stationUnlocked: [420, 300],
  /** A station effect has been applied (Wilds placed, multiplier raised). */
  stationEffect: [260, 180],
  /** End of a spin without a win. */
  spinEndNoWin: [360, 120],
  /** End of a spin with a win. */
  spinEndWin: [480, 240],
  /** Between two free spins. */
  betweenFreeSpins: [380, 100],
  /** Extra breath before each of the last two free spins and after their result. */
  lastSpins: [380, 0],
  /** After the last free spin, before the summary. */
  beforeSummary: [600, 300],
} as const satisfies Record<string, readonly [number, number]>;

export type HoldName = keyof typeof HOLD;

/**
 * Milliseconds to wait on a clock that runs `scale` times faster, so that the
 * pause lasts `HOLD[name][0] / scale` but never less than its real-time minimum.
 */
export function holdMs(name: HoldName, scale: number): number {
  const [ms, minReal] = HOLD[name];
  return Math.max(ms, minReal * scale);
}

/** Real duration of a pause in milliseconds at a given scale (for reports and tests). */
export function realHoldMs(name: HoldName, scale: number): number {
  return holdMs(name, scale) / scale;
}

export function parseSpeedMode(value: string | null | undefined): SpeedMode | null {
  return value === 'normal' || value === 'fast' || value === 'skip' ? value : null;
}
