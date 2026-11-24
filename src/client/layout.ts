/** Pure layout computation, so it can be unit-tested without a browser. */
export interface Rect { x: number; y: number; w: number; h: number }

export interface Layout {
  portrait: boolean;
  /** Top-left corner of the grid and the edge length of one cell. */
  grid: { x: number; y: number; cell: number };
  /** Area of the expedition track; vertical in landscape. */
  track: Rect & { vertical: boolean };
  header: Rect;
  controls: Rect;
  /** Scale for texts and buttons relative to a 390 px wide phone. */
  ui: number;
}

export function computeLayout(w: number, h: number, cols: number, rows: number): Layout {
  const portrait = h >= w;
  const m = Math.round(Math.min(w, h) * 0.03);
  if (portrait) {
    const ui = Math.min(w / 390, h / 760);
    const header = { x: m, y: m, w: w - 2 * m, h: Math.round(64 * ui) };
    const controls = { x: m, y: h - m - Math.round(190 * ui), w: w - 2 * m, h: Math.round(190 * ui) };
    const trackH = Math.round(84 * ui);
    const track = { x: m, y: header.y + header.h + m, w: w - 2 * m, h: trackH, vertical: false };
    const top = track.y + track.h + m;
    const cell = Math.floor(Math.min((w - 2 * m) / cols, (controls.y - m - top) / rows));
    const grid = { x: Math.round((w - cell * cols) / 2), y: Math.round(top + (controls.y - m - top - cell * rows) / 2), cell };
    return { portrait, grid, track, header, controls, ui };
  }
  const ui = Math.min(w / 900, h / 480);
  const header = { x: m, y: m, w: w - 2 * m, h: Math.round(44 * ui) };
  const controls = { x: m, y: h - m - Math.round(84 * ui), w: w - 2 * m, h: Math.round(84 * ui) };
  const top = header.y + header.h + m;
  const availH = controls.y - m - top;
  const trackW = Math.round(150 * ui);
  const cell = Math.floor(Math.min((w - 4 * m - 2 * trackW) / cols, availH / rows));
  const gx = Math.round((w - cell * cols) / 2);
  const gy = Math.round(top + (availH - cell * rows) / 2);
  const track = { x: Math.max(m, gx - m - trackW), y: gy, w: trackW, h: cell * rows, vertical: true };
  return { portrait, grid: { x: gx, y: gy, cell }, track, header, controls, ui };
}

/** Formats currency minor units as a plain decimal amount. */
export function formatMoney(minor: number): string {
  const sign = minor < 0 ? '-' : '';
  const v = Math.abs(Math.round(minor));
  const whole = Math.floor(v / 100).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'");
  return `${sign}${whole}.${(v % 100).toString().padStart(2, '0')}`;
}

/** Formats a bet multiple without trailing zeros (e.g. 2.5x). */
export function formatMultiple(centibet: number): string {
  return `${(centibet / 100).toFixed(2).replace(/\.?0+$/, '')}×`;
}
