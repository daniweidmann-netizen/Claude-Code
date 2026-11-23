import type { GameConfig, PrizeEntry } from '../../src/engine/index.js';

export interface BonusExact {
  /** Expected win in bet multiples, excluding the value of awarded free spins. */
  expectedWin: number;
  /** Probability that the bonus awards free spins. */
  pFreeSpins: number;
  /** Probability that the grand prize is won. */
  pGrand: number;
}

/**
 * Exact expectation of one Temple Bonus by enumerating every ordered prize
 * tuple (grand prize at most once, redraw otherwise) and every pick order.
 * Independent of the engine implementation.
 */
export function bonusExact(table: PrizeEntry[], chambers: number): BonusExact {
  const total = table.reduce((a, p) => a + p.weight, 0);
  const nonGrand = table.filter((p) => p.kind !== 'grand').reduce((a, p) => a + p.weight, 0);
  let ev = 0, pFs = 0, pGrand = 0;

  const permutations = (n: number): number[][] =>
    n === 0 ? [[]] : permutations(n - 1).flatMap((p) => Array.from({ length: n }, (_, i) => [...p.slice(0, i), n - 1, ...p.slice(i)]));
  const orders = permutations(chambers);

  const walk = (drawn: PrizeEntry[], prob: number, hasGrand: boolean) => {
    if (drawn.length === chambers) {
      // The shuffle makes every opening order equally likely.
      for (const order of orders) {
        const p = prob / orders.length;
        for (const idx of order) {
          const prize = drawn[idx];
          if (prize.kind === 'freeSpins') pFs += p; else ev += p * prize.value;
          if (prize.kind === 'grand') pGrand += p;
          if (prize.kind !== 'relic') break;
        }
      }
      return;
    }
    for (const prize of table) {
      if (prize.kind === 'grand' && hasGrand) continue;
      walk([...drawn, prize], prob * (prize.weight / (hasGrand ? nonGrand : total)), hasGrand || prize.kind === 'grand');
    }
  };
  walk([], 1, false);
  return { expectedWin: ev / 100, pFreeSpins: pFs, pGrand };
}

export function allBonusExact(cfg: GameConfig): { base: BonusExact; finale: BonusExact[] } {
  const n = cfg.templeBonus.chambers;
  return { base: bonusExact(cfg.templeBonus.base, n), finale: cfg.templeBonus.finale.map((t) => bonusExact(t, n)) };
}

/** Exact probability of at least k Compass symbols on the first drop (binomial). */
export function compassFirstDrop(weights: number[], cells: number, k: number): number {
  const p = weights[6] / weights.reduce((a, b) => a + b, 0);
  let below = 0, c = 1;
  for (let i = 0; i < k; i++) {
    below += c * p ** i * (1 - p) ** (cells - i);
    c = (c * (cells - i)) / (i + 1);
  }
  return 1 - below;
}
