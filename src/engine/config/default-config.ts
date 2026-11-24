import type { GameConfig } from './types.js';

/**
 * Draft v0.1 parameters from GDD v1.0. NOT VALIDATED: these are starting
 * values for the simulation and will change during tuning.
 */
export const CONFIG_V0_1: GameConfig = {
  version: '0.1.0-draft',
  cols: 6,
  rows: 5,
  minClusterSize: 5,
  maxCascades: 50,
  maxWin: 1_000_000,
  weights: {
    //      SAPPH SCARAB CHAL CROWN MASK WILD COMP KEY
    base: [250, 220, 190, 160, 125, 12, 8, 35],
    free: [250, 220, 190, 160, 125, 15, 5, 35],
  },
  payBrackets: [5, 6, 7, 8, 10, 12, 15, 20],
  paytable: [
    [20, 30, 40, 60, 100, 200, 500, 1500],
    [30, 40, 50, 80, 150, 300, 800, 2500],
    [40, 50, 80, 120, 250, 500, 1200, 4000],
    [50, 80, 120, 200, 400, 800, 2000, 7500],
    [100, 150, 250, 400, 800, 1500, 4000, 15000],
  ],
  stationSteps: [1, 2, 3, 4, 5],
  discoveryWilds: 2,
  treasureMultiplier: 2,
  relicValues: [
    { value: 2, weight: 500 },
    { value: 3, weight: 280 },
    { value: 5, weight: 150 },
    { value: 10, weight: 55 },
    { value: 25, weight: 15 },
  ],
  relicValuesFree: [
    { value: 2, weight: 500 },
    { value: 3, weight: 280 },
    { value: 5, weight: 150 },
    { value: 10, weight: 55 },
    { value: 25, weight: 15 },
  ],
  freeSpins: {
    awards: [
      { minCompass: 5, spins: 12, baseCamp: 2 },
      { minCompass: 4, spins: 10, baseCamp: 1 },
      { minCompass: 3, spins: 8, baseCamp: 1 },
    ],
    retriggerCompass: 3,
    retriggerSpins: 4,
    maxSpins: 30,
    maxBaseCamp: 3,
    maxSeals: 3,
  },
  templeBonus: {
    chambers: 3,
    base: [
      { kind: 'treasure', value: 1000, weight: 300 },
      { kind: 'treasure', value: 2000, weight: 240 },
      { kind: 'treasure', value: 4000, weight: 150 },
      { kind: 'treasure', value: 8000, weight: 80 },
      { kind: 'treasure', value: 20000, weight: 30 },
      { kind: 'relic', value: 2500, weight: 100 },
      { kind: 'freeSpins', value: 0, weight: 90 },
      { kind: 'grand', value: 100_000, weight: 10 },
    ],
    finale: [
      [
        { kind: 'treasure', value: 1000, weight: 300 },
        { kind: 'treasure', value: 2000, weight: 240 },
        { kind: 'treasure', value: 4000, weight: 240 },
        { kind: 'treasure', value: 8000, weight: 80 },
        { kind: 'treasure', value: 20000, weight: 30 },
        { kind: 'relic', value: 2500, weight: 100 },
        { kind: 'grand', value: 100_000, weight: 10 },
      ],
      [
        { kind: 'treasure', value: 1000, weight: 150 },
        { kind: 'treasure', value: 2000, weight: 220 },
        { kind: 'treasure', value: 4000, weight: 200 },
        { kind: 'treasure', value: 8000, weight: 140 },
        { kind: 'treasure', value: 20000, weight: 70 },
        { kind: 'relic', value: 2500, weight: 120 },
        { kind: 'grand', value: 250_000, weight: 20 },
      ],
      [
        { kind: 'treasure', value: 2000, weight: 150 },
        { kind: 'treasure', value: 4000, weight: 220 },
        { kind: 'treasure', value: 8000, weight: 200 },
        { kind: 'treasure', value: 20000, weight: 130 },
        { kind: 'relic', value: 2500, weight: 150 },
        { kind: 'grand', value: 500_000, weight: 30 },
      ],
    ],
    bonusFreeSpins: { spins: 8, baseCamp: 2 },
  },
  featureBuy: { enabled: false, price: 10_000, spins: 8, baseCamp: 1 },
};
