import { DRAWABLE, PAY_SYMBOL_COUNT, type GameConfig, type PrizeEntry } from './types.js';

const isPosInt = (n: number) => Number.isInteger(n) && n > 0;
const isNonNegInt = (n: number) => Number.isInteger(n) && n >= 0;

/** Returns a list of problems; an empty list means the configuration is usable. */
export function validateConfig(c: GameConfig): string[] {
  const e: string[] = [];
  if (!isPosInt(c.cols) || !isPosInt(c.rows)) e.push('cols/rows must be positive integers');
  if (c.cols * c.rows > 64) e.push('grid too large');
  if (!isPosInt(c.minClusterSize)) e.push('minClusterSize must be a positive integer');
  if (!isPosInt(c.maxCascades)) e.push('maxCascades must be a positive integer');
  if (!isPosInt(c.maxWin)) e.push('maxWin must be a positive integer');
  for (const [mode, w] of Object.entries(c.weights)) {
    if (w.length !== DRAWABLE.length) e.push(`weights.${mode} needs ${DRAWABLE.length} entries`);
    if (!w.every(isNonNegInt)) e.push(`weights.${mode} must be non-negative integers`);
    if (w.slice(0, PAY_SYMBOL_COUNT).some((x) => x === 0)) e.push(`weights.${mode}: pay symbols need weight > 0`);
  }
  if (c.payBrackets[0] !== c.minClusterSize) e.push('first pay bracket must equal minClusterSize');
  for (let i = 1; i < c.payBrackets.length; i++) {
    if (c.payBrackets[i] <= c.payBrackets[i - 1]) e.push('payBrackets must be strictly ascending');
  }
  if (c.paytable.length !== PAY_SYMBOL_COUNT) e.push(`paytable needs ${PAY_SYMBOL_COUNT} rows`);
  for (const row of c.paytable) {
    if (row.length !== c.payBrackets.length) e.push('paytable row length must match payBrackets');
    if (!row.every(isPosInt)) e.push('paytable values must be positive integers');
    if (row.some((v) => v % 10 !== 0)) e.push('paytable values must be multiples of 10 centibet');
    for (let i = 1; i < row.length; i++) if (row[i] < row[i - 1]) e.push('paytable rows must be non-decreasing');
  }
  if (c.stationSteps.length !== 5 || !c.stationSteps.every(isPosInt)) e.push('stationSteps needs five positive integers');
  for (let i = 1; i < c.stationSteps.length; i++) {
    if (c.stationSteps[i] <= c.stationSteps[i - 1]) e.push('stationSteps must be strictly ascending');
  }
  if (!isNonNegInt(c.discoveryWilds)) e.push('discoveryWilds must be a non-negative integer');
  if (!isPosInt(c.treasureMultiplier)) e.push('treasureMultiplier must be a positive integer');
  for (const t of [c.relicValues, c.relicValuesFree]) {
    if (t.length === 0 || !t.every((r) => isPosInt(r.value) && isPosInt(r.weight))) e.push('relic tables invalid');
  }
  const fs = c.freeSpins;
  if (fs.awards.length === 0) e.push('freeSpins.awards empty');
  for (let i = 1; i < fs.awards.length; i++) {
    if (fs.awards[i].minCompass >= fs.awards[i - 1].minCompass) e.push('freeSpins.awards must be sorted by minCompass descending');
  }
  for (const a of fs.awards) {
    if (!isPosInt(a.spins) || a.spins > fs.maxSpins) e.push('freeSpins award spins invalid');
    if (a.baseCamp < 0 || a.baseCamp > fs.maxBaseCamp) e.push('freeSpins award baseCamp invalid');
  }
  if (fs.maxBaseCamp > 4) e.push('maxBaseCamp must stay below station 5');
  const tb = c.templeBonus;
  if (tb.chambers < 2) e.push('templeBonus.chambers must be >= 2');
  if (tb.finale.length !== fs.maxSeals) e.push('templeBonus.finale needs one table per seal');
  const checkTable = (name: string, t: PrizeEntry[], allowFs: boolean) => {
    if (t.length === 0) e.push(`${name}: empty`);
    for (const p of t) {
      if (!isPosInt(p.weight)) e.push(`${name}: weights must be positive integers`);
      if (p.kind === 'freeSpins') {
        if (!allowFs) e.push(`${name}: free-spin prizes are not allowed in the finale`);
      } else if (!isPosInt(p.value) || p.value % 10 !== 0) {
        e.push(`${name}: prize values must be positive multiples of 10 centibet`);
      }
    }
    if (!t.some((p) => p.kind !== 'grand')) e.push(`${name}: needs a non-grand prize`);
  };
  checkTable('templeBonus.base', tb.base, true);
  tb.finale.forEach((t, i) => checkTable(`templeBonus.finale[${i}]`, t, false));
  const fb = c.featureBuy;
  if (!fb || typeof fb.enabled !== 'boolean') e.push('featureBuy missing');
  else {
    if (!isPosInt(fb.price) || fb.price % 10 !== 0) e.push('featureBuy.price must be a positive multiple of 10 centibet');
    if (!isPosInt(fb.spins) || fb.spins > fs.maxSpins) e.push('featureBuy.spins invalid');
    if (!isNonNegInt(fb.baseCamp) || fb.baseCamp > fs.maxBaseCamp) e.push('featureBuy.baseCamp invalid');
    if (fb.price >= c.maxWin) e.push('featureBuy.price must be below maxWin');
  }
  return e;
}

export function assertValidConfig(c: GameConfig): void {
  const problems = validateConfig(c);
  if (problems.length > 0) throw new Error(`Invalid game config:\n- ${problems.join('\n- ')}`);
}
