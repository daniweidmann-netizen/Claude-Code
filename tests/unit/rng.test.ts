import { describe, expect, it } from 'vitest';
import { WeightedTable, Xoshiro256 } from '../../src/engine/index.js';

const M = (1n << 64n) - 1n;
const rotl = (x: bigint, k: bigint) => ((x << k) | (x >> (64n - k))) & M;
/** Straightforward BigInt reference of xoshiro256**. */
function reference(s: bigint[]): () => bigint {
  return () => {
    const result = (rotl((s[1] * 5n) & M, 7n) * 9n) & M;
    const t = (s[1] << 17n) & M;
    s[2] ^= s[0]; s[3] ^= s[1]; s[1] ^= s[2]; s[0] ^= s[3]; s[2] ^= t; s[3] = rotl(s[3], 45n);
    return result;
  };
}

describe('Xoshiro256', () => {
  it('matches the published first outputs for state (1,2,3,4)', () => {
    const r = Xoshiro256.fromState([1n, 2n, 3n, 4n]);
    expect([r.nextBigInt(), r.nextBigInt(), r.nextBigInt(), r.nextBigInt()]).toEqual([
      11520n, 0n, 1509978240n, 1215971899390074240n,
    ]);
  });

  it('matches a BigInt reference implementation over 20 000 outputs', () => {
    const state: [bigint, bigint, bigint, bigint] = [0x123456789abcdef0n, 0xfedcba9876543210n, 0xdeadbeefcafebaben, 0x0f1e2d3c4b5a6978n];
    const fast = Xoshiro256.fromState(state);
    const ref = reference([...state]);
    for (let i = 0; i < 20_000; i++) expect(fast.nextBigInt()).toBe(ref());
  });

  it('is deterministic per seed and differs between streams', () => {
    const a = Xoshiro256.fromSeed(42n), b = Xoshiro256.fromSeed(42n), c = Xoshiro256.fromSeed(42n, 1n);
    const seq = (r: Xoshiro256) => Array.from({ length: 50 }, () => r.nextInt(1000));
    const sa = seq(a);
    expect(seq(b)).toEqual(sa);
    expect(seq(c)).not.toEqual(sa);
  });

  it('rejects an all-zero state and invalid bounds', () => {
    expect(() => Xoshiro256.fromState([0n, 0n, 0n, 0n])).toThrow();
    const r = Xoshiro256.fromSeed(1n);
    expect(() => r.nextInt(0)).toThrow();
    expect(() => r.nextInt(1.5)).toThrow();
  });

  it('nextInt is uniform (chi-square, 13 classes, 1.3M draws)', () => {
    const r = Xoshiro256.fromSeed(7n);
    const k = 13, n = 1_300_000, counts = new Array<number>(k).fill(0);
    for (let i = 0; i < n; i++) counts[r.nextInt(k)]++;
    const chi = counts.reduce((a, c) => a + (c - n / k) ** 2 / (n / k), 0);
    expect(chi).toBeLessThan(32.9); // 99.9 % quantile, 12 degrees of freedom
  });
});

describe('WeightedTable', () => {
  it('maps every integer to the right index', () => {
    const t = new WeightedTable([2, 0, 3]);
    const fixed = (v: number) => ({ nextInt: () => v });
    expect([0, 1, 2, 3, 4].map((v) => t.pick(fixed(v)))).toEqual([0, 0, 2, 2, 2]);
    expect(t.total).toBe(5);
  });

  it('reproduces the weights statistically (chi-square)', () => {
    const w = [250, 220, 190, 160, 125, 12, 8, 35];
    const t = new WeightedTable(w), r = Xoshiro256.fromSeed(99n);
    const n = 2_000_000, counts = new Array<number>(w.length).fill(0);
    for (let i = 0; i < n; i++) counts[t.pick(r)]++;
    const chi = counts.reduce((a, c, i) => a + (c - (n * w[i]) / 1000) ** 2 / ((n * w[i]) / 1000), 0);
    expect(chi).toBeLessThan(24.3); // 99.9 % quantile, 7 degrees of freedom
  });
});
