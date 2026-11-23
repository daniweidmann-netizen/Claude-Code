import { CONFIG_V0_1 } from './default-config.js';
import type { GameConfig } from './types.js';

/**
 * Tuning candidate v0.2. NOT VALIDATED.
 *
 * Differs from the GDD v1.0 draft in:
 *  - stationSteps [1,2,4,6,9] ("stepping stones", proposed as CR-09 – a rule
 *    change that still needs approval),
 *  - flatter symbol weights (per 10 000), no natural Wild,
 *  - paytable scaled to about 75 %.
 * Everything else is unchanged from v0.1.
 */
export const CONFIG_V0_2_CANDIDATE: GameConfig = {
  ...CONFIG_V0_1,
  version: '0.2.0-candidate',
  stationSteps: [1, 2, 4, 6, 9],
  weights: {
    //      SAPPH SCARAB CHAL  CROWN MASK  WILD COMP KEY
    base: [2000, 1950, 1900, 1850, 1800, 0, 100, 200],
    free: [2000, 1950, 1900, 1850, 1800, 0, 60, 131],
  },
  paytable: [
    [10, 20, 30, 50, 80, 150, 400, 1200],
    [20, 30, 40, 60, 110, 220, 600, 2000],
    [30, 40, 60, 90, 190, 380, 900, 3000],
    [40, 60, 90, 150, 300, 600, 1500, 5500],
    [80, 110, 190, 300, 600, 1100, 3000, 11000],
  ],
};
