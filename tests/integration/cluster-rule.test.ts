import { describe, expect, it } from 'vitest';
import { CONFIG_V1, Round, Sym, Tables, Xoshiro256, type GameEvent } from '../../src/engine/index.js';

/**
 * The approved rule (CR-01): a win needs at least FIVE equal symbols that are connected
 * horizontally or vertically. Diagonal contact does not connect. This test checks the rule
 * on the wins the engine actually pays in real rounds of the frozen configuration,
 * independently of the cluster search itself.
 */
describe('cluster rule of configuration 1.0.0 in real rounds', () => {
  const { cols, rows } = CONFIG_V1;
  const tables = new Tables(CONFIG_V1);

  it('is configured as five, with the first pay bracket at five', () => {
    expect(CONFIG_V1.minClusterSize).toBe(5);
    expect(CONFIG_V1.payBrackets[0]).toBe(5);
  });

  it('pays only orthogonally connected groups of five or more, and misses none', () => {
    let wins = 0, smallest = Infinity;
    for (let seed = 1; seed <= 4000; seed++) {
      const round = new Round(tables, Xoshiro256.fromSeed(BigInt(seed)), { recordEvents: true });
      round.start();
      while (!round.done) round.pick(round.availableChambers[0]!);
      let grid: number[] = [];
      for (const e of round.events as GameEvent[]) {
        if (e.type === 'gridFilled' || e.type === 'gridCascaded') grid = e.grid;
        if (e.type !== 'clustersWon') continue;
        for (const c of e.clusters) {
          wins++;
          smallest = Math.min(smallest, c.size);
          expect(c.size).toBeGreaterThanOrEqual(5);
          expect(c.cells.length).toBe(c.size);
          // Every cell shows the symbol or a wild.
          for (const p of c.cells) expect([c.symbol, Sym.WILD, Sym.EXPLORER]).toContain(grid[p]);
          // Connected through horizontal and vertical neighbours only.
          const inCluster = new Set(c.cells);
          const reached = new Set([c.cells[0]!]);
          const todo = [c.cells[0]!];
          while (todo.length) {
            const p = todo.pop()!;
            const col = p % cols, row = (p - col) / cols;
            const near = [row > 0 ? p - cols : -1, row < rows - 1 ? p + cols : -1, col > 0 ? p - 1 : -1, col < cols - 1 ? p + 1 : -1];
            for (const q of near) if (q >= 0 && inCluster.has(q) && !reached.has(q)) { reached.add(q); todo.push(q); }
          }
          expect(reached.size).toBe(c.size);
          // Complete: no orthogonal neighbour outside the cluster shows the same symbol or a wild.
          for (const p of c.cells) {
            const col = p % cols, row = (p - col) / cols;
            const near = [row > 0 ? p - cols : -1, row < rows - 1 ? p + cols : -1, col > 0 ? p - 1 : -1, col < cols - 1 ? p + 1 : -1];
            for (const q of near) if (q >= 0 && !inCluster.has(q)) expect([c.symbol, Sym.WILD, Sym.EXPLORER]).not.toContain(grid[q]);
          }
        }
      }
    }
    expect(wins).toBeGreaterThan(1000);
    expect(smallest).toBe(5);
  });
});
