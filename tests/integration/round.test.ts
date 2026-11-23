import { describe, expect, it } from 'vitest';
import { CONFIG_V0_1 as CFG, Round, Sym, Tables, centibetToMoney, type GameEvent } from '../../src/engine/index.js';
import { ScriptedRng, drawFor, drawsForGrid, quietGrid } from '../support/scripted-rng.js';
import { verifyEvents } from '../support/verify-events.js';

const tables = new Tables(CFG);
const WB = CFG.weights.base;
const key = drawFor(WB, Sym.KEY);
const prizeDraw = (index: number) => CFG.templeBonus.base.slice(0, index).reduce((a, p) => a + p.weight, 0);
const play = (draws: number[]) => {
  const rng = new ScriptedRng(draws);
  const round = new Round(tables, rng, { recordEvents: true });
  round.start();
  return { round, rng, events: round.events as GameEvent[] };
};
const types = (ev: GameEvent[]) => ev.map((e) => e.type);

/** Quiet grid with five Sapphires in the bottom row (cells 24..28). */
function gridWithBottomCluster(): number[][] {
  const g = quietGrid(CFG);
  for (let c = 0; c < 5; c++) g[4][c] = Sym.SAPPHIRE;
  g[3][4] = Sym.CHALICE; // would otherwise extend the cluster
  return g;
}

describe('round – scripted scenarios', () => {
  it('pays nothing and ends on a grid without clusters', () => {
    const { round, rng, events } = play(drawsForGrid(CFG, WB, quietGrid(CFG)));
    expect(round.done).toBe(true);
    expect(round.totalWin).toBe(0);
    expect(round.stats.baseHit).toBe(false);
    expect(rng.remaining).toBe(0);
    expect(types(events)).toEqual(['spinStarted', 'gridFilled', 'spinEnded', 'roundEnded']);
  });

  it('pays a 5-cluster, cascades, reaches Discovery and places two wilds', () => {
    const draws = [
      ...drawsForGrid(CFG, WB, gridWithBottomCluster()),
      key, key, key, key, key, // refill of the five removed cells
      0, 10,                  // Discovery: positions among the pay cells
    ];
    const { round, rng, events } = play(draws);
    expect(round.done).toBe(true);
    expect(round.totalWin).toBe(20); // 0.20 x bet
    expect(round.stats).toMatchObject({ baseHit: true, baseCascades: 1, baseStation: 1, baseBonus: false });
    expect(rng.remaining).toBe(0);
    const won = events.find((e) => e.type === 'clustersWon');
    expect(won).toMatchObject({ multiplier: 1, win: 20, clusters: [{ symbol: Sym.SAPPHIRE, size: 5, cells: [24, 25, 26, 27, 28] }] });
    const discovery = events.find((e) => e.type === 'discovery');
    expect(discovery && discovery.type === 'discovery' && discovery.positions.length).toBe(2);
    expect(verifyEvents(CFG, events)).toBe(20);
    expect(centibetToMoney(round.totalWin, 200)).toBe(40);
  });

  it('keys jump the track to the Temple; all station effects run in order; the pick decides the prize', () => {
    const g = gridWithBottomCluster();
    g[0][0] = g[0][2] = g[0][4] = g[1][5] = Sym.KEY; // 1 cascade + 4 keys = station 5
    const scenario = (picks: number[], prizeIdx: number[], shuffle: [number, number]) => {
      const draws = [
        ...drawsForGrid(CFG, WB, g),
        ...new Array<number>(9).fill(key), // refill: 5 cluster cells + 4 keys
        0, 12,                             // Discovery
        7,                                 // Ancient Power position
        3, 999,                            // Relic position, value index (last entry: +25)
        ...prizeIdx.map(prizeDraw), ...shuffle,
      ];
      const { round, rng, events } = play(draws);
      expect(round.awaitingPick).toBe(true);
      expect(round.done).toBe(false);
      expect(events.some((e) => e.type === 'chamberPicked' || e.type === 'chambersRevealed')).toBe(false);
      for (const p of picks) round.pick(p);
      expect(round.done).toBe(true);
      expect(rng.remaining).toBe(0);
      verifyEvents(CFG, events);
      return { round, events };
    };

    // prizes drawn: 10x, 200x, 20x; shuffle (2,1) keeps the order
    const a = scenario([1], [0, 4, 1], [2, 1]);
    expect(a.round.totalWin).toBe(20 + 20000);
    expect(a.round.stats).toMatchObject({ baseStation: 5, baseBonus: true, baseBonusWin: 20000, baseWin: 20 });
    expect(types(a.events).filter((t) => ['discovery', 'treasure', 'ancientPower', 'relic', 'templeReached'].includes(t)))
      .toEqual(['discovery', 'treasure', 'ancientPower', 'relic', 'templeReached']);
    const relic = a.events.find((e) => e.type === 'relic');
    expect(relic).toMatchObject({ value: 25, sunBonus: 25 });
    const revealed = a.events.find((e) => e.type === 'chambersRevealed');
    expect(revealed).toMatchObject({ prizes: [{ chamber: 0, prize: { value: 1000 } }, { chamber: 2, prize: { value: 2000 } }] });

    // same draws, different pick -> different prize
    expect(scenario([0], [0, 4, 1], [2, 1]).round.totalWin).toBe(20 + 1000);

    // Relic Bonus (index 5) pays 25x and grants a second pick
    const r = scenario([0, 2], [5, 4, 1], [2, 1]);
    expect(r.round.totalWin).toBe(20 + 2500 + 2000);

    // invalid picks are rejected
    const draws = [...drawsForGrid(CFG, WB, g), ...new Array<number>(9).fill(key), 0, 12, 7, 3, 999, ...[5, 4, 1].map(prizeDraw), 2, 1];
    const { round } = play(draws);
    expect(() => round.pick(3)).toThrow();
    round.pick(0);
    expect(() => round.pick(0)).toThrow();
    round.pick(1);
    expect(() => round.pick(2)).toThrow(); // round is over
  });

  it('a second grand prize is redrawn', () => {
    const g = gridWithBottomCluster();
    g[0][0] = g[0][2] = g[0][4] = g[1][5] = Sym.KEY;
    const grand = prizeDraw(7);
    const { round } = play([
      ...drawsForGrid(CFG, WB, g), ...new Array<number>(9).fill(key), 0, 12, 7, 3, 0,
      grand, grand, prizeDraw(0), prizeDraw(1), 2, 1,
    ]);
    round.pick(0);
    expect(round.totalWin).toBe(20 + 100_000);
    const rest = (round.events as GameEvent[]).find((e) => e.type === 'chambersRevealed');
    expect(rest).toMatchObject({ prizes: [{ prize: { value: 1000 } }, { prize: { value: 2000 } }] });
  });

  it('with stepping stones a station needs several steps', () => {
    const cfg = structuredClone(CFG);
    cfg.stationSteps = [1, 2, 4, 6, 9];
    const g = gridWithBottomCluster();
    g[0][0] = g[0][2] = Sym.KEY; // 1 cascade + 2 keys = 3 steps -> station 2, not 3
    const rng = new ScriptedRng([...drawsForGrid(cfg, WB, g), ...new Array<number>(7).fill(key), 0, 12]);
    const round = new Round(new Tables(cfg), rng, { recordEvents: true });
    round.start();
    expect(round.done).toBe(true);
    expect(rng.remaining).toBe(0);
    expect(round.stats.baseStation).toBe(2);
    expect((round.events as GameEvent[]).find((e) => e.type === 'trackAdvanced')).toMatchObject({ from: 0, to: 2, steps: 3 });
    verifyEvents(cfg, round.events as GameEvent[]);
  });

  it('caps the round win at the maximum and ends the round', () => {
    const cfg = structuredClone(CFG);
    cfg.maxWin = 10;
    const { round, events } = (() => {
      const rng = new ScriptedRng(drawsForGrid(cfg, WB, gridWithBottomCluster()));
      const round = new Round(new Tables(cfg), rng, { recordEvents: true });
      round.start();
      return { round, events: round.events as GameEvent[] };
    })();
    expect(round).toMatchObject({ done: true, capped: true, totalWin: 10 });
    expect(types(events).slice(-3)).toEqual(['maxWinReached', 'spinEnded', 'roundEnded']);
  });
});
