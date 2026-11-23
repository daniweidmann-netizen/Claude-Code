import { describe, expect, it } from 'vitest';
import { CONFIG_V0_1, CONFIG_V0_2_CANDIDATE, EMPTY, Sym, applyGravity, findClusters, validateConfig } from '../../src/engine/index.js';

const W = Sym.WILD, X = Sym.EXPLORER, K = Sym.KEY, C = Sym.COMPASS;
const find = (rows: number[][]) => findClusters(rows.flat(), 6, 5, 5);

describe('findClusters', () => {
  it('finds no cluster on a grid without equal neighbours', () => {
    expect(find(Array.from({ length: 5 }, (_, r) => Array.from({ length: 6 }, (_, c) => (c + 2 * r) % 5)))).toEqual([]);
  });

  it('needs five orthogonally connected symbols; diagonals do not connect', () => {
    const four = [
      [0, 0, 0, 0, 1, 2],
      [1, 2, 3, 4, 0, 1],
      [2, 3, 4, 1, 2, 3],
      [3, 4, 0, 1, 2, 3],
      [4, 0, 1, 2, 3, 4],
    ];
    expect(find(four)).toEqual([]); // four in a row plus a diagonal neighbour at (1,4)
    four[1][4] = 3;
    four[1][3] = 0;
    expect(find(four)).toEqual([{ symbol: 0, size: 5, cells: [0, 1, 2, 3, 9] }]);
  });

  it('counts wilds and the Explorer, and lets one wild serve two symbols', () => {
    const g = [
      [0, 0, W, 1, 1, 2],
      [0, 0, 3, 1, 1, 4],
      [2, 3, 4, 2, 3, 2],
      [3, 4, 2, 3, 4, 3],
      [4, 2, 3, 4, 2, 4],
    ];
    expect(find(g)).toEqual([
      { symbol: 0, size: 5, cells: [0, 1, 2, 6, 7] },
      { symbol: 1, size: 5, cells: [2, 3, 4, 9, 10] },
    ]);
    g[0][2] = X;
    expect(find(g)).toHaveLength(2);
  });

  it('joins two groups through a wild and ignores wild-only groups, keys and compasses', () => {
    const joined = [
      [0, 0, W, 0, 0, 2],
      [1, 2, 3, 4, 1, 3],
      [W, W, W, W, W, 4],
      [K, K, K, K, K, C],
      [C, C, C, C, C, K],
    ];
    const res = find(joined);
    expect(res.find((c) => c.symbol === 0)).toEqual({ symbol: 0, size: 5, cells: [0, 1, 2, 3, 4] });
    for (const c of res) expect(c.cells.some((p) => joined.flat()[p] === c.symbol)).toBe(true);
    expect(find([[W, W, W, W, W, W], [K, K, K, K, K, K], [C, C, C, C, C, C], [K, K, K, K, K, K], [C, C, C, C, C, C]])).toEqual([]);
  });

  it('reports a full grid of one symbol as a single cluster of 30', () => {
    const res = find(Array.from({ length: 5 }, () => new Array<number>(6).fill(4)));
    expect(res).toHaveLength(1);
    expect(res[0].size).toBe(30);
  });
});

describe('applyGravity', () => {
  it('drops symbols within their column and keeps their order', () => {
    const E = EMPTY;
    const g = Int8Array.from([
      1, E, 3, 0, 0, 0,
      E, E, 4, 0, 0, 0,
      2, 5, E, 0, 0, 0,
      E, E, E, 0, 0, 0,
      3, 6, E, 0, 0, 0,
    ]);
    applyGravity(g, 6, 5);
    expect(Array.from(g)).toEqual([
      E, E, E, 0, 0, 0,
      E, E, E, 0, 0, 0,
      1, E, E, 0, 0, 0,
      2, 5, 3, 0, 0, 0,
      3, 6, 4, 0, 0, 0,
    ]);
  });
});

describe('validateConfig', () => {
  it('accepts the draft and the candidate configuration', () => {
    expect(validateConfig(CONFIG_V0_1)).toEqual([]);
    expect(validateConfig(CONFIG_V0_2_CANDIDATE)).toEqual([]);
  });
  it('reports broken configurations', () => {
    const bad = structuredClone(CONFIG_V0_1);
    bad.paytable[0][0] = 25;
    bad.weights.base.pop();
    bad.templeBonus.finale[0].push({ kind: 'freeSpins', value: 0, weight: 1 });
    expect(validateConfig(bad).length).toBeGreaterThanOrEqual(3);
  });
});
