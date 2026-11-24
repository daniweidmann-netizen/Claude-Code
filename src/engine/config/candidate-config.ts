import { CONFIG_V0_1 } from './default-config.js';
import type { GameConfig, PrizeEntry } from './types.js';

const grand = (table: PrizeEntry[], value: number): PrizeEntry[] =>
  table.map((p) => (p.kind === 'grand' ? { ...p, value } : p));

/**
 * Tuning candidate v0.3 (GDD v1.1). See docs/00_PROJECT_STATUS.md for its
 * validation status and docs/math/reports/ for the measurements.
 *
 * Compared with the v0.1 draft:
 *  - stationSteps [1,2,4,6,9] (stepping stones, CR-09),
 *  - flatter symbol weights (per 10 000), no natural Wild,
 *  - lower paytable, lower base-game treasure prizes,
 *  - steeper Sun Relic values in free spins and larger grand prizes
 *    (higher volatility; the win cap is reachable through the gold finale).
 */
export const CONFIG_V0_3_CANDIDATE: GameConfig = {
  ...CONFIG_V0_1,
  version: '0.3.2-candidate',
  stationSteps: [1, 2, 4, 6, 9],
  weights: {
    //      SAPPH SCARAB CHAL  CROWN MASK  WILD COMP KEY
    base: [2000, 1950, 1900, 1850, 1800, 0, 92, 200],
    free: [2000, 1950, 1900, 1850, 1800, 0, 60, 91],
  },
  paytable: [
    [10, 20, 30, 40, 70, 130, 350, 1000],
    [20, 30, 30, 50, 90, 190, 500, 1750],
    [30, 30, 50, 80, 160, 320, 750, 2500],
    [30, 50, 80, 130, 260, 510, 1250, 5000],
    [70, 90, 160, 260, 510, 940, 2500, 10000],
  ],
  relicValuesFree: [
    { value: 5, weight: 480 },
    { value: 10, weight: 290 },
    { value: 25, weight: 150 },
    { value: 50, weight: 60 },
    { value: 100, weight: 20 },
  ],
  templeBonus: {
    ...CONFIG_V0_1.templeBonus,
    base: [
      { kind: 'treasure', value: 700, weight: 300 },
      { kind: 'treasure', value: 1400, weight: 240 },
      { kind: 'treasure', value: 3000, weight: 150 },
      { kind: 'treasure', value: 5600, weight: 80 },
      { kind: 'treasure', value: 14000, weight: 30 },
      { kind: 'relic', value: 2500, weight: 100 },
      { kind: 'freeSpins', value: 0, weight: 90 },
      { kind: 'grand', value: 250_000, weight: 10 },
    ],
    finale: [
      grand(CONFIG_V0_1.templeBonus.finale[0], 250_000),
      grand(CONFIG_V0_1.templeBonus.finale[1], 500_000),
      grand(CONFIG_V0_1.templeBonus.finale[2], 1_000_000),
    ],
  },
};
