import { describe, expect, it } from 'vitest';
import { PerfMeter, perfVerdict } from '../../src/client/perf.js';

describe('performance meter', () => {
  it('computes average fps, slow-frame share and worst frame', () => {
    const m = new PerfMeter();
    for (let i = 0; i < 90; i++) m.add(1000 / 60);
    for (let i = 0; i < 10; i++) m.add(50);
    m.add(5000); m.add(0); m.add(NaN); // ignored
    const s = m.stats;
    expect(s.frames).toBe(100);
    expect(s.seconds).toBeCloseTo(2, 5);
    expect(s.fps).toBeCloseTo(50, 5);
    expect(s.slowShare).toBeCloseTo(0.1, 5);
    expect(s.worstMs).toBe(50);
    m.reset();
    expect(m.stats).toEqual({ frames: 0, seconds: 0, fps: 0, slowShare: 0, worstMs: 0 });
  });

  it('gives a verdict only with enough data', () => {
    expect(perfVerdict(60, 0, 10)).toMatch(/zu wenig Daten/);
    expect(perfVerdict(59, 0.01, 1000)).toMatch(/^Flüssig/);
    expect(perfVerdict(45, 0.05, 1000)).toMatch(/^Brauchbar/);
    expect(perfVerdict(25, 0.5, 1000)).toMatch(/^Zu langsam/);
  });
});
