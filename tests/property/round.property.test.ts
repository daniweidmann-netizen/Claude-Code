import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { CONFIG_V0_1 as CFG, Round, Tables, Xoshiro256, type GameConfig, type GameEvent } from '../../src/engine/index.js';
import { verifyEvents } from '../support/verify-events.js';

function playRound(t: Tables, seed: bigint, record: boolean, pickSeed = 0) {
  const round = new Round(t, Xoshiro256.fromSeed(seed), { recordEvents: record });
  round.start();
  let k = pickSeed;
  while (round.awaitingPick) {
    const a = round.availableChambers;
    round.pick(a[k++ % a.length]);
  }
  return round;
}

/** Feature-rich variant so bonus, free spins and finale occur in a small sample. */
const HOT: GameConfig = (() => {
  const c = structuredClone(CFG);
  c.weights.base = [250, 220, 190, 160, 125, 30, 40, 80];
  c.weights.free = [250, 220, 190, 160, 125, 30, 30, 80];
  return c;
})();

const STONES: GameConfig = { ...structuredClone(HOT), stationSteps: [1, 2, 4, 6, 9] };

describe('round – properties', () => {
  for (const [name, cfg] of [['draft config', CFG], ['feature-rich config', HOT], ['stepping-stone config', STONES]] as const) {
    const t = new Tables(cfg);
    it(`${name}: every event log is consistent with the rules (independent verifier)`, () => {
      const seen = new Set<string>();
      for (let s = 0; s < 4000; s++) {
        const r = playRound(t, BigInt(s), true, s);
        expect(r.done).toBe(true);
        expect(r.totalWin).toBeLessThanOrEqual(cfg.maxWin);
        expect(verifyEvents(cfg, r.events as GameEvent[])).toBe(r.totalWin);
        const st = r.stats;
        expect(st.baseWin + st.baseBonusWin + st.freeWin + st.finaleWin).toBe(r.totalWin);
        expect(st.freeSpinsPlayed).toBeLessThanOrEqual(cfg.freeSpins.maxSpins);
        expect(st.finalBaseCamp).toBeLessThanOrEqual(cfg.freeSpins.maxBaseCamp);
        for (const e of r.events as GameEvent[]) seen.add(e.type);
      }
      if (cfg !== CFG) {
        for (const type of ['freeSpinsAwarded', 'templeBonusStarted', 'chamberPicked', 'relic', 'ancientPower', 'keysCollected']) {
          expect(seen.has(type), `${type} not exercised`).toBe(true);
        }
      }
    });

    it(`${name}: same seed and picks give the identical round; recording does not change the result`, () => {
      fc.assert(
        fc.property(fc.bigUint({ max: (1n << 64n) - 1n }), (seed) => {
          const a = playRound(t, seed, true), b = playRound(t, seed, true), c = playRound(t, seed, false);
          expect(JSON.stringify(a.events)).toBe(JSON.stringify(b.events));
          expect(c.totalWin).toBe(a.totalWin);
          expect(c.stats).toEqual(a.stats);
        }),
        { numRuns: 300, seed: 20261123 },
      );
    });
  }

  it('terminates at the cascade limit even when every grid wins', () => {
    const c = structuredClone(CFG);
    c.weights.base = [1, 0, 0, 0, 0, 0, 0, 0].map((w, i) => (i < 5 ? Math.max(w, i === 0 ? 1000 : 1) : 0));
    c.maxWin = Number.MAX_SAFE_INTEGER;
    const r = playRound(new Tables(c), 5n, false);
    expect(r.done).toBe(true);
    expect(r.stats.cascadeLimitHit).toBe(true);
    expect(r.stats.baseCascades).toBe(c.maxCascades);
  });
});
