import type { PrizeKind } from '../config/types.js';

export type SpinMode = 'base' | 'free';

export interface ClusterWin {
  symbol: number;
  size: number;
  cells: number[];
  /** Win in centibet after the multiplier. */
  win: number;
}

export interface PrizeView {
  kind: PrizeKind;
  /** Centibet. */
  value: number;
}

/** Ordered record of everything that happened in a round; the client only replays this. */
export type GameEvent =
  | { type: 'spinStarted'; mode: SpinMode; freeSpinIndex: number; station: number; steps: number; sunBonus: number }
  | { type: 'gridFilled'; grid: number[] }
  | { type: 'clustersWon'; clusters: ClusterWin[]; multiplier: number; win: number }
  | { type: 'keysCollected'; positions: number[]; baseCamp: number }
  | { type: 'trackAdvanced'; from: number; to: number; steps: number }
  | { type: 'symbolsRemoved'; positions: number[] }
  | { type: 'gridCascaded'; grid: number[] }
  | { type: 'discovery'; positions: number[] }
  | { type: 'treasure'; multiplier: number }
  | { type: 'ancientPower'; position: number }
  | { type: 'relic'; position: number; value: number; sunBonus: number }
  | { type: 'templeReached'; mode: SpinMode; seals: number }
  | { type: 'cascadeLimitReached' }
  | { type: 'spinEnded'; mode: SpinMode; win: number; compass: number }
  | { type: 'freeSpinsAwarded'; spins: number; total: number; baseCamp: number; source: 'compass' | 'retrigger' | 'bonus' }
  | { type: 'templeBonusStarted'; tier: 'base' | 'finale'; seals: number; chambers: number }
  | { type: 'chamberPicked'; chamber: number; prize: PrizeView }
  | { type: 'chambersRevealed'; prizes: { chamber: number; prize: PrizeView }[] }
  | { type: 'maxWinReached' }
  | { type: 'roundEnded'; totalWin: number };
