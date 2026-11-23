/** Source of randomness used by the engine. The engine knows no concrete implementation. */
export interface Rng {
  /** Uniform integer in [0, n) without modulo bias. Requires 1 <= n <= 2^32. */
  nextInt(n: number): number;
}

const MASK64 = (1n << 64n) - 1n;

/** SplitMix64, used only to expand seeds into generator state. */
export function splitMix64(seed: bigint): () => bigint {
  let x = seed & MASK64;
  return () => {
    x = (x + 0x9e3779b97f4a7c15n) & MASK64;
    let z = x;
    z = ((z ^ (z >> 30n)) * 0xbf58476d1ce4e5b9n) & MASK64;
    z = ((z ^ (z >> 27n)) * 0x94d049bb133111ebn) & MASK64;
    return z ^ (z >> 31n);
  };
}

/**
 * xoshiro256** (Blackman & Vigna) on pairs of 32-bit words, so the hot path
 * needs no BigInt. For simulation, tests and the demo; makes no certification claim.
 */
export class Xoshiro256 implements Rng {
  // state words s0..s3, each as (hi, lo)
  private h0 = 0; private l0 = 0;
  private h1 = 0; private l1 = 0;
  private h2 = 0; private l2 = 0;
  private h3 = 0; private l3 = 0;
  /** High and low half of the most recent 64-bit output. */
  outHi = 0; outLo = 0;

  static fromState(s: readonly [bigint, bigint, bigint, bigint]): Xoshiro256 {
    if (s.every((w) => (w & MASK64) === 0n)) throw new Error('xoshiro256** state must not be all zero');
    const r = new Xoshiro256();
    const hi = (w: bigint) => Number((w >> 32n) & 0xffffffffn);
    const lo = (w: bigint) => Number(w & 0xffffffffn);
    r.h0 = hi(s[0]); r.l0 = lo(s[0]);
    r.h1 = hi(s[1]); r.l1 = lo(s[1]);
    r.h2 = hi(s[2]); r.l2 = lo(s[2]);
    r.h3 = hi(s[3]); r.l3 = lo(s[3]);
    return r;
  }

  /** Seeds the state with SplitMix64. `stream` yields independent generators for one seed. */
  static fromSeed(seed: bigint, stream = 0n): Xoshiro256 {
    const sm = splitMix64((seed ^ ((stream + 1n) * 0xd1342543de82ef95n)) & MASK64);
    return Xoshiro256.fromState([sm(), sm(), sm(), sm()]);
  }

  /** Advances the generator; the 64-bit result is left in outHi/outLo. */
  next64(): void {
    // result = rotl(s1 * 5, 7) * 9
    let h = this.h1, l = this.l1;
    // x * 5 = (x << 2) + x
    let th = ((h << 2) | (l >>> 30)) >>> 0, tl = (l << 2) >>> 0;
    let sl = (tl + l) >>> 0;
    let sh = (th + h + (sl < tl ? 1 : 0)) >>> 0;
    // rotl 7
    let rh = ((sh << 7) | (sl >>> 25)) >>> 0, rl = ((sl << 7) | (sh >>> 25)) >>> 0;
    // x * 9 = (x << 3) + x
    th = ((rh << 3) | (rl >>> 29)) >>> 0; tl = (rl << 3) >>> 0;
    sl = (tl + rl) >>> 0;
    sh = (th + rh + (sl < tl ? 1 : 0)) >>> 0;
    this.outHi = sh; this.outLo = sl;

    // t = s1 << 17
    const tH = ((h << 17) | (l >>> 15)) >>> 0, tL = (l << 17) >>> 0;
    this.h2 ^= this.h0; this.l2 ^= this.l0;
    this.h3 ^= this.h1; this.l3 ^= this.l1;
    this.h1 ^= this.h2; this.l1 ^= this.l2;
    this.h0 ^= this.h3; this.l0 ^= this.l3;
    this.h2 ^= tH; this.l2 ^= tL;
    // s3 = rotl(s3, 45) = swap halves, then rotl 13
    h = this.l3; l = this.h3;
    this.h3 = ((h << 13) | (l >>> 19)) >>> 0;
    this.l3 = ((l << 13) | (h >>> 19)) >>> 0;
    this.h0 >>>= 0; this.l0 >>>= 0; this.h1 >>>= 0; this.l1 >>>= 0; this.h2 >>>= 0; this.l2 >>>= 0;
  }

  /** Next 64-bit output as BigInt (for tests and diagnostics). */
  nextBigInt(): bigint {
    this.next64();
    return (BigInt(this.outHi) << 32n) | BigInt(this.outLo);
  }

  nextInt(n: number): number {
    if (!Number.isInteger(n) || n < 1 || n > 0x100000000) throw new RangeError(`nextInt: invalid bound ${n}`);
    // Rejection sampling on the upper 32 bits: discard the first (2^32 mod n) values.
    const threshold = 0x100000000 % n;
    for (;;) {
      this.next64();
      if (this.outHi >= threshold) return this.outHi % n;
    }
  }
}

/** Cumulative weight table for fast weighted selection. */
export class WeightedTable {
  readonly total: number;
  private readonly cumulative: number[];

  constructor(weights: readonly number[]) {
    let sum = 0;
    this.cumulative = weights.map((w) => (sum += w));
    this.total = sum;
    if (!(sum > 0)) throw new Error('WeightedTable: total weight must be positive');
  }

  /** Returns an index with probability weight[i] / total. Consumes exactly one nextInt call. */
  pick(rng: Rng): number {
    const r = rng.nextInt(this.total);
    const c = this.cumulative;
    let i = 0;
    while (r >= c[i]) i++;
    return i;
  }
}
