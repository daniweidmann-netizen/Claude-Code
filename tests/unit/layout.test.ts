import { describe, expect, it } from 'vitest';
import { computeLayout, formatMoney, formatMultiple, winTier } from '../../src/client/layout.js';

const inside = (a: { x: number; y: number; w: number; h: number }, w: number, h: number) =>
  a.x >= 0 && a.y >= 0 && a.x + a.w <= w && a.y + a.h <= h;
const overlap = (a: { x: number; y: number; w: number; h: number }, b: { x: number; y: number; w: number; h: number }) =>
  a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;

describe('layout', () => {
  const sizes: [number, number][] = [[360, 640], [390, 844], [412, 915], [768, 1024], [844, 390], [1280, 720], [1920, 1080], [640, 360], [1024, 768], [600, 600]];
  for (const [w, h] of sizes) {
    it(`fits ${w}×${h} without overlap`, () => {
      const l = computeLayout(w, h, 6, 5);
      const grid = { x: l.grid.x, y: l.grid.y, w: l.grid.cell * 6, h: l.grid.cell * 5 };
      expect(l.grid.cell).toBeGreaterThanOrEqual(w === 640 ? 30 : 40);
      for (const r of [grid, l.track, l.header, l.controls]) expect(inside(r, w, h)).toBe(true);
      expect(overlap(grid, l.track)).toBe(false);
      expect(overlap(grid, l.header)).toBe(false);
      expect(overlap(grid, l.controls)).toBe(false);
      expect(overlap(l.track, l.controls)).toBe(false);
      expect(overlap(l.track, l.header)).toBe(false);
      expect(l.track.vertical).toBe(w > h);
    });
  }

  it('formats money and multiples', () => {
    expect(formatMoney(0)).toBe('0.00');
    expect(formatMoney(5)).toBe('0.05');
    expect(formatMoney(123456789)).toBe("1'234'567.89");
    expect(formatMoney(-250)).toBe('-2.50');
    expect(formatMultiple(250)).toBe('2.5×');
    expect(formatMultiple(1000000)).toBe('10000×');
    expect(formatMultiple(10)).toBe('0.1×');
  });

  it('assigns celebration tiers at 20x, 50x and 200x', () => {
    expect([0, 1990, 2000, 4990, 5000, 19990, 20000, 1000000].map(winTier)).toEqual([0, 0, 1, 1, 2, 2, 3, 3]);
  });
});
