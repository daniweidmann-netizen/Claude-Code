/** Symbol identifiers. Values 0..4 are pay symbols ordered from lowest to highest. */
export const Sym = {
  SAPPHIRE: 0,
  SCARAB: 1,
  CHALICE: 2,
  CROWN: 3,
  MASK: 4,
  WILD: 5,
  COMPASS: 6,
  KEY: 7,
  EXPLORER: 8,
} as const;
export type SymbolId = (typeof Sym)[keyof typeof Sym];

export const PAY_SYMBOL_COUNT = 5;
export const EMPTY = -1;

/** Symbols that can be drawn naturally, in weight-table order. */
export const DRAWABLE: readonly SymbolId[] = [
  Sym.SAPPHIRE, Sym.SCARAB, Sym.CHALICE, Sym.CROWN, Sym.MASK, Sym.WILD, Sym.COMPASS, Sym.KEY,
];

export type PrizeKind = 'treasure' | 'relic' | 'freeSpins' | 'grand';

export interface PrizeEntry {
  kind: PrizeKind;
  /** Win in hundredths of the bet (0 for a pure free-spin prize). */
  value: number;
  weight: number;
}

export interface FreeSpinAward {
  minCompass: number;
  spins: number;
  baseCamp: number;
}

/**
 * Complete game configuration. All payouts are integers in hundredths of the
 * total bet ("centibet"), so the win path never uses floating point.
 */
export interface GameConfig {
  version: string;
  cols: number;
  rows: number;
  minClusterSize: number;
  maxCascades: number;
  /** Maximum round win in centibet. */
  maxWin: number;
  /** Weights in DRAWABLE order. */
  weights: { base: number[]; free: number[] };
  /** Lower bounds of the cluster-size brackets, ascending. */
  payBrackets: number[];
  /** paytable[paySymbol][bracket] in centibet. */
  paytable: number[][];
  /**
   * Cumulative progress steps needed to reach stations 1..5. Every winning
   * cascade and every collected Temple Key is one step. [1,2,3,4,5] means
   * one station per step (GDD v1.0).
   */
  stationSteps: number[];
  discoveryWilds: number;
  treasureMultiplier: number;
  relicValues: { value: number; weight: number }[];
  /** Relic value table used during free spins (S persists there). */
  relicValuesFree: { value: number; weight: number }[];
  freeSpins: {
    awards: FreeSpinAward[];
    retriggerCompass: number;
    retriggerSpins: number;
    maxSpins: number;
    maxBaseCamp: number;
    maxSeals: number;
  };
  templeBonus: {
    chambers: number;
    /** Prize table for a bonus triggered in the base game. */
    base: PrizeEntry[];
    /** Prize tables for the Temple Finale, indexed by seals - 1. */
    finale: PrizeEntry[][];
    bonusFreeSpins: { spins: number; baseCamp: number };
  };
  /**
   * Feature buy: the player pays `price` (centibet) instead of the bet and the
   * round starts directly with `spins` free spins at `baseCamp`; no base spin
   * is played. The win cap stays `maxWin` (relative to the bet, not the price).
   */
  featureBuy: { enabled: boolean; price: number; spins: number; baseCamp: number };
}
