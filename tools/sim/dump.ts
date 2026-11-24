/**
 * Prints one line per round (wins by source and key stats) for the
 * differential test against tools/reference/reference_engine.py.
 * usage: node dist/tools/sim/dump.js <config.json> <seed> <stream> <rounds> [buy]
 */
import { readFileSync } from 'node:fs';
import { Round, Tables, Xoshiro256, assertValidConfig, type GameConfig } from '../../src/engine/index.js';

const [file, seed, stream, rounds, mode] = process.argv.slice(2);
const cfg = JSON.parse(readFileSync(file, 'utf8')) as GameConfig;
assertValidConfig(cfg);
const tables = new Tables(cfg);
const rng = Xoshiro256.fromSeed(BigInt(seed), BigInt(stream));
const lines: string[] = [];
for (let i = 0; i < Number(rounds); i++) {
  const r = new Round(tables, rng);
  if (mode === 'buy') r.startBought(); else r.start();
  while (r.awaitingPick) r.pick(r.availableChambers[0]);
  const s = r.stats;
  lines.push([r.totalWin, s.baseWin, s.baseBonusWin, s.freeWin, s.finaleWin, s.baseStation, s.baseCascades, s.freeSpinsPlayed].join(','));
  if (lines.length === 10000) { process.stdout.write(lines.join('\n') + '\n'); lines.length = 0; }
}
if (lines.length) process.stdout.write(lines.join('\n') + '\n');
