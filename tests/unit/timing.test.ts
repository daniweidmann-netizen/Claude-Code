import { describe, expect, it } from 'vitest';
import { HOLD, MAX_SCENE_SCALE, SPEED_MODES, SPEED_SCALE, holdMs, parseSpeedMode, realHoldMs, type HoldName } from '../../src/client/timing.js';

describe('pacing', () => {
  it('has three modes with normal as the reference and increasing speed', () => {
    expect(SPEED_MODES).toEqual(['normal', 'fast', 'skip']);
    expect(SPEED_SCALE.normal).toBe(1);
    expect(SPEED_SCALE.fast).toBeGreaterThan(1);
    expect(SPEED_SCALE.skip).toBeGreaterThan(SPEED_SCALE.fast);
    expect(MAX_SCENE_SCALE).toBeLessThan(SPEED_SCALE.fast);
  });

  it('keeps every readable pause at or above its real-time minimum in all modes', () => {
    for (const name of Object.keys(HOLD) as HoldName[]) {
      const [ms, min] = HOLD[name];
      expect(realHoldMs(name, 1)).toBe(ms);
      for (const mode of SPEED_MODES) {
        const real = realHoldMs(name, SPEED_SCALE[mode]);
        expect(real, `${name}/${mode}`).toBeGreaterThanOrEqual(min - 1e-9);
        expect(real, `${name}/${mode}`).toBeLessThanOrEqual(ms + 1e-9);
      }
      // Faster modes never make a pause longer than a slower mode.
      expect(realHoldMs(name, SPEED_SCALE.skip)).toBeLessThanOrEqual(realHoldMs(name, SPEED_SCALE.fast) + 1e-9);
    }
    expect(holdMs('stationUnlocked', 5)).toBe(1600); // 320 ms real at five times speed
  });

  it('accepts only the three mode names', () => {
    expect(parseSpeedMode('fast')).toBe('fast');
    expect(parseSpeedMode('turbo')).toBeNull();
    expect(parseSpeedMode(null)).toBeNull();
  });
});
