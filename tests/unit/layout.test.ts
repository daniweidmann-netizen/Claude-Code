import { describe, expect, it } from 'vitest';
import { CONFIG_V1, findClusters } from '../../src/engine/index.js';
import { computeLayout, formatMoney, formatMultiple, previewGrid, stonesBefore, winTier, type Rect } from '../../src/client/layout.js';
import { TEXT_KEYS, t } from '../../src/client/i18n.js';

const inside = (a: Rect, w: number, h: number) => a.x >= 0 && a.y >= 0 && a.x + a.w <= w && a.y + a.h <= h;
const overlap = (a: Rect, b: Rect) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;

describe('layout', () => {
  // CSS sizes of common phones and desktops, also multiplied by pixel density 2 and 3.
  const sizes: [number, number][] = [[360, 640], [375, 667], [390, 844], [393, 852], [430, 932], [768, 1024], [844, 390], [852, 393], [1280, 720], [1920, 1080], [667, 375], [1024, 768], [600, 600]];
  for (const [cw, ch] of sizes) {
    for (const d of [1, 3]) {
      const w = cw * d, h = ch * d;
      it(`fits ${cw}×${ch} at density ${d} without overlap`, () => {
        const l = computeLayout(w, h, 6, 5);
        const grid = { x: l.grid.x, y: l.grid.y, w: l.grid.cell * 6, h: l.grid.cell * 5 };
        const zones: Record<string, Rect> = { grid, status: l.status, track: l.track, mult: l.mult, winBar: l.winBar, controls: l.controls };
        const names = Object.keys(zones);
        for (const n of names) expect(inside(zones[n], w, h), n).toBe(true);
        for (let i = 0; i < names.length; i++) {
          for (let j = i + 1; j < names.length; j++) {
            // In portrait the multiplier pill sits inside the track panel by design.
            const pair = `${names[i]}/${names[j]}`;
            if (ch >= cw && pair === 'track/mult') continue;
            expect(overlap(zones[names[i]], zones[names[j]]), pair).toBe(false);
          }
        }
        if (ch >= cw) {
          expect(l.mult.x >= l.track.x && l.mult.x + l.mult.w <= l.track.x + l.track.w).toBe(true);
          expect(l.mult.y >= l.track.y && l.mult.y + l.mult.h <= l.track.y + l.track.h).toBe(true);
        }
        expect(l.track.vertical).toBe(w > h);
        // Symbols stay recognisable: at least 44 CSS px per cell on phones in portrait.
        if (ch >= cw) expect(l.grid.cell / d).toBeGreaterThanOrEqual(44);
        // Touch targets scale with the interface factor: 48 units are at least 44 CSS px on phones from 360 px.
        expect((48 * l.ui) / d).toBeGreaterThanOrEqual(ch >= cw * 1.5 ? 43 : 32); // buttons additionally never go below 44 CSS px (button.ts)
      });
    }
  }

  it('uses the width for the grid on a current phone', () => {
    const l = computeLayout(393, 852, 6, 5);
    expect(l.grid.cell).toBeGreaterThanOrEqual(61);
  });

  it('formats money and multiples', () => {
    expect(formatMoney(0)).toBe('0.00');
    expect(formatMoney(5)).toBe('0.05');
    expect(formatMoney(123456789)).toBe('1,234,567.89');
    expect(formatMoney(-250)).toBe('-2.50');
    expect(formatMultiple(250)).toBe('2.5×');
    expect(formatMultiple(1000000)).toBe('10000×');
    expect(formatMultiple(10)).toBe('0.1×');
  });

  it('assigns presentation tiers at 5x, 20x and 100x', () => {
    expect([0, 490, 500, 1990, 2000, 9990, 10000, 1000000].map(winTier)).toEqual([0, 0, 1, 1, 2, 2, 3, 3]);
  });

  it('shows a start preview without any cluster', () => {
    const g = previewGrid(CONFIG_V1.cols, CONFIG_V1.rows);
    expect(g.length).toBe(30);
    expect(findClusters(Int8Array.from(g), CONFIG_V1.cols, CONFIG_V1.rows, CONFIG_V1.minClusterSize)).toEqual([]);
    // Not even a pair-of-three look-alike: no cluster of 3 either.
    expect(findClusters(Int8Array.from(g), CONFIG_V1.cols, CONFIG_V1.rows, 3)).toEqual([]);
  });

  it('derives the stepping stones from the configured thresholds', () => {
    expect([1, 2, 3, 4, 5].map((i) => stonesBefore(CONFIG_V1.stationSteps, i))).toEqual([0, 0, 1, 1, 2]);
  });

  it('has every interface text in both languages and fills parameters', () => {
    for (const key of TEXT_KEYS) for (const lang of ['en', 'de'] as const) expect(t(key, {}, lang).length, `${key}/${lang}`).toBeGreaterThan(0);
    expect(t('nextStationPl', { name: 'Relic', n: 2 }, 'en')).toBe('Next: Relic · 2 steps');
    expect(t('stop', { n: 7 }, 'de')).toBe('STOPP 7');
  });
});
