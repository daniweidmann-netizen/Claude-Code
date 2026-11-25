/** Pure layout computation, so it can be unit-tested without a browser. All values in canvas pixels. */
export interface Rect { x: number; y: number; w: number; h: number }

export interface Layout {
  portrait: boolean;
  /** Scale for texts and controls: 1 on a 390 px wide phone (per canvas pixel density). */
  ui: number;
  /** Slim top bar: small logo, demo note, free-spin counter, sound and info. */
  status: Rect;
  /** Expedition Track (horizontal in portrait, vertical in landscape). */
  track: Rect & { vertical: boolean };
  /** Multiplier medallion. */
  mult: Rect;
  /** Top-left corner of the grid and the edge length of one cell. */
  grid: { x: number; y: number; cell: number };
  /** Balance and win. */
  winBar: Rect;
  /** Bet, spin, auto, buy. */
  controls: Rect;
}

/** Room the carved frame takes around the grid, in cells (sides, top with the sun emblem, bottom). */
export const FRAME = { side: 0.3, top: 0.46, bottom: 0.4 };

export function computeLayout(w: number, h: number, cols: number, rows: number): Layout {
  const portrait = h >= w;
  const m = Math.round(Math.min(w, h) * 0.03);
  if (portrait) {
    const ui = Math.min(w / 390, h / 700);
    const u = (n: number) => Math.round(n * ui);
    const status = { x: m, y: m, w: w - 2 * m, h: u(40) };
    const trackY = status.y + status.h + u(6);
    const controls = { x: m, y: h - m - u(116), w: w - 2 * m, h: u(116) };
    const winBar = { x: m, y: controls.y - u(8) - u(46), w: w - 2 * m, h: u(46) };
    const bottom = winBar.y - u(10);
    // The grid is usually limited by the width; spare height goes to the Expedition Track (the game's signature).
    const minTrack = u(92), maxTrack = u(132);
    const fv = FRAME.top + FRAME.bottom;
    const cell = Math.floor(Math.min((w - m) / (cols + 2 * FRAME.side), (bottom - trackY - minTrack - u(10)) / (rows + fv)));
    const spare = bottom - trackY - u(10) - cell * (rows + fv);
    const trackH = Math.max(minTrack, Math.min(maxTrack, spare));
    const track = { x: m, y: trackY, w: w - 2 * m, h: trackH, vertical: false };
    const multH = u(40), multW = u(118);
    const mult = { x: track.x + track.w - multW - u(6), y: track.y + track.h - multH - u(6), w: multW, h: multH };
    const top = track.y + track.h + u(10);
    const grid = { x: Math.round((w - cell * cols) / 2), y: Math.round(top + (bottom - top - cell * (rows + fv)) / 2 + cell * FRAME.top), cell };
    return { portrait, ui, status, track, mult, grid, winBar, controls };
  }
  const ui = Math.min(w / 900, h / 440);
  const u = (n: number) => Math.round(n * ui);
  const status = { x: m, y: m, w: w - 2 * m, h: u(40) };
  const controls = { x: m, y: h - m - u(84), w: w - 2 * m, h: u(84) };
  const top = status.y + status.h + u(8), bottom = controls.y - u(8);
  const sideW = u(150);
  const fv = FRAME.top + FRAME.bottom;
  const cell = Math.floor(Math.min((w - 4 * m - 2 * sideW) / (cols + 2 * FRAME.side), (bottom - top) / (rows + fv)));
  const gx = Math.round((w - cell * cols) / 2), gy = Math.round(top + (bottom - top - cell * (rows + fv)) / 2 + cell * FRAME.top);
  const track = { x: Math.max(m, gx - Math.round(cell * FRAME.side) - m - sideW), y: gy, w: sideW, h: cell * rows, vertical: true };
  const rx = gx + cell * cols + Math.round(cell * FRAME.side) + m;
  const rw = Math.min(sideW, w - m - rx);
  const mult = { x: rx, y: gy, w: rw, h: Math.min(u(110), Math.floor(cell * rows * 0.45)) };
  const winBar = { x: rx, y: mult.y + mult.h + u(8), w: rw, h: Math.min(u(120), cell * rows - mult.h - u(8)) };
  return { portrait, ui, status, track, mult, grid: { x: gx, y: gy, cell }, winBar, controls };
}

/** Formats currency minor units as a plain decimal amount. */
export function formatMoney(minor: number): string {
  const sign = minor < 0 ? '-' : '';
  const v = Math.abs(Math.round(minor));
  const whole = Math.floor(v / 100).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `${sign}${whole}.${(v % 100).toString().padStart(2, '0')}`;
}

/** Formats a bet multiple without trailing zeros (e.g. 2.5x). */
export function formatMultiple(centibet: number): string {
  return `${(centibet / 100).toFixed(2).replace(/\.?0+$/, '')}×`;
}

/**
 * Presentation tiers by round win in bet multiples. Display thresholds only;
 * they follow the measured win distribution of configuration 1.0.0
 * (2G-round acceptance run): about 1.5 % of rounds reach "good", 0.33 %
 * "big" and 0.10 % "epic". Tier 0 gets no extra presentation.
 */
export const WIN_TIERS = [
  { from: 5, key: 'winGood' },
  { from: 20, key: 'winBig' },
  { from: 100, key: 'winEpic' },
] as const;

export function winTier(centibet: number): number {
  let tier = 0;
  WIN_TIERS.forEach((t, i) => { if (centibet >= t.from * 100) tier = i + 1; });
  return tier;
}

/**
 * Fixed arrangement shown before the first spin. It is a picture, not a game
 * result: it contains no cluster and is never evaluated.
 */
export function previewGrid(cols: number, rows: number): number[] {
  const g: number[] = [];
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) g.push((c + 2 * r) % 5);
  g[cols + 1] = 6; g[2 * cols + 4] = 7; g[3 * cols + 2] = 5;
  return g;
}

/** Stepping stones strictly between station i-1 and station i (i = 1..5) for the given thresholds. */
export function stonesBefore(stationSteps: number[], i: number): number {
  return stationSteps[i - 1] - (i > 1 ? stationSteps[i - 2] : 0) - 1;
}
