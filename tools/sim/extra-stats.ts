/**
 * Supplementary measurements that the main simulator does not record: retrigger frequency and
 * multiplier statistics. Reads the event log of ordinary rounds; changes nothing in the game.
 * usage: node dist/tools/sim/extra-stats.js <config.json> <seed> <stream> <rounds>
 * Prints one JSON object with additive counters (sum several streams by adding the fields).
 */
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { Round, Tables, Xoshiro256, assertValidConfig, type GameConfig, type GameEvent } from '../../src/engine/index.js';

const [file, seed, stream, rounds] = process.argv.slice(2);
const cfg = JSON.parse(readFileSync(file, 'utf8')) as GameConfig;
assertValidConfig(cfg);
const tables = new Tables(cfg);
const rng = Xoshiro256.fromSeed(BigInt(seed), BigInt(stream));
const a = {
  configHash: createHash('sha256').update(JSON.stringify(cfg)).digest('hex'),
  rounds: 0, sumWin: 0,
  features: 0, featuresWithRetrigger: 0, retriggers: 0, freeSpins: 0, retriggersCapped: 0,
  // winning cascades: count, sum of multiplier, sum of win, sum of win before multiplier
  baseCascades: 0, baseMultSum: 0, baseWin: 0, baseRawWin: 0,
  freeCascades: 0, freeMultSum: 0, freeWin: 0, freeRawWin: 0,
  baseMultHist: {} as Record<string, number>,
};
for (let i = 0; i < Number(rounds); i++) {
  const r = new Round(tables, rng, { recordEvents: true });
  r.start();
  while (r.awaitingPick) r.pick(r.availableChambers[0]!);
  a.rounds++; a.sumWin += r.totalWin;
  let mode: 'base' | 'free' = 'base', feature = false, retr = 0;
  for (const e of r.events as GameEvent[]) {
    if (e.type === 'spinStarted') { mode = e.mode; if (mode === 'free') a.freeSpins++; }
    else if (e.type === 'freeSpinsAwarded') {
      feature = true;
      if (e.source === 'retrigger') { retr++; if (e.spins < cfg.freeSpins.retriggerSpins) a.retriggersCapped++; }
    } else if (e.type === 'clustersWon') {
      // The log holds the win as calculated; a win cut by the 10,000x cap is rare and ignored here.
      if (mode === 'base') {
        a.baseCascades++; a.baseMultSum += e.multiplier; a.baseWin += e.win; a.baseRawWin += e.win / e.multiplier;
        a.baseMultHist[e.multiplier] = (a.baseMultHist[e.multiplier] ?? 0) + 1;
      } else { a.freeCascades++; a.freeMultSum += e.multiplier; a.freeWin += e.win; a.freeRawWin += e.win / e.multiplier; }
    }
  }
  if (feature) { a.features++; a.retriggers += retr; if (retr > 0) a.featuresWithRetrigger++; }
}
process.stdout.write(JSON.stringify(a) + '\n');
