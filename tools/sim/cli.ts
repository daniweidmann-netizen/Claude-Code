import { execSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { availableParallelism } from 'node:os';
import { dirname } from 'node:path';
import { Worker, isMainThread, parentPort, workerData } from 'node:worker_threads';
import { CONFIG_V0_1, CONFIG_V0_3_CANDIDATE, assertValidConfig, type GameConfig } from '../../src/engine/index.js';
import { allBonusExact, compassFirstDrop } from './bonus-math.js';
import { WIN_CLASS_LABELS, emptyAcc, merge, runStream, type Acc } from './core.js';

interface Job { cfg: GameConfig; seed: string; stream: number; rounds: number; batchSize: number }

if (!isMainThread) {
  const j = workerData as Job;
  parentPort!.postMessage(runStream(j.cfg, BigInt(j.seed), j.stream, j.rounds, j.batchSize));
} else {
  await main();
}

function arg(name: string, fallback: string): string {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}

async function main(): Promise<void> {
  // --config <file.json>: partial overrides merged over the built-in configuration (top-level keys).
  const override = arg('config', '');
  // --preset v0.1 (GDD v1.0 draft) | v0.3 (tuning candidate, default)
  const preset = arg('preset', 'v0.3') === 'v0.1' ? CONFIG_V0_1 : CONFIG_V0_3_CANDIDATE;
  const cfg: GameConfig = override ? { ...preset, ...JSON.parse(readFileSync(override, 'utf8')) } : preset;
  assertValidConfig(cfg);
  const rounds = Number(arg('rounds', '10000000'));
  const seed = arg('seed', '20261123');
  const workers = Number(arg('workers', String(availableParallelism())));
  const out = arg('out', '');
  const per = Math.floor(rounds / workers);
  const batchSize = Math.max(1, Math.floor(per / 25));
  const started = Date.now();

  const parts = await Promise.all(
    Array.from({ length: workers }, (_, stream) =>
      new Promise<Acc>((resolve, reject) => {
        const job: Job = { cfg, seed, stream, rounds: per, batchSize };
        const w = new Worker(new URL(import.meta.url), { workerData: job });
        w.once('message', resolve); w.once('error', reject);
      })),
  );
  const acc = parts.reduce(merge, emptyAcc(cfg));
  const seconds = (Date.now() - started) / 1000;

  let commit = 'unknown';
  try { commit = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim(); } catch { /* not a git checkout */ }
  const configHash = createHash('sha256').update(JSON.stringify(cfg)).digest('hex').slice(0, 16);
  const report = buildReport(cfg, acc, { seed, workers, roundsPerWorker: per, batchSize, seconds, commit, configHash });
  console.log(process.argv.includes('--brief') ? report.text.split('## Win distribution')[0] + report.text.split('## Free-spin feature')[1].split('## Paying clusters')[0] : report.text);
  if (out) {
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(`${out}.md`, report.text);
    writeFileSync(`${out}.json`, JSON.stringify({ meta: report.meta, acc }, null, 1));
  }
}

function buildReport(cfg: GameConfig, a: Acc, run: Record<string, string | number>) {
  const n = a.rounds;
  const pct = (x: number, d = 3) => `${(x * 100).toFixed(d)} %`;
  const mean = a.sumWin / n / 100;
  const variance = a.sumWinSq / n / 10000 - mean * mean;
  const sd = Math.sqrt(variance);
  const se = sd / Math.sqrt(n);
  const b = a.batchRtp;
  const bMean = b.reduce((x, y) => x + y, 0) / b.length;
  const bSe = Math.sqrt(b.reduce((x, y) => x + (y - bMean) ** 2, 0) / (b.length - 1) / b.length);
  const oneIn = (count: number) => (count > 0 ? `1 in ${(n / count).toFixed(1)}` : 'never');
  const exact = allBonusExact(cfg);
  const cells = cfg.cols * cfg.rows;
  const L: string[] = [];
  const row = (...c: (string | number)[]) => L.push(`| ${c.join(' | ')} |`);

  L.push(`# Simulation report – config ${cfg.version}`, '');
  L.push('Draft parameters. Measured values of this run, not certified figures.', '');
  L.push('## Run', '');
  row('Item', 'Value'); row('---', '---');
  row('Rounds', n.toLocaleString('en-US'));
  row('Master seed', run.seed); row('Workers (RNG streams)', run.workers); row('Rounds per worker', run.roundsPerWorker);
  row('Config hash', run.configHash); row('Git commit (code base)', run.commit);
  row('Duration', `${run.seconds} s (${Math.round(n / Number(run.seconds)).toLocaleString('en-US')} rounds/s)`);
  L.push('', '## RTP', '');
  row('Metric', 'Value'); row('---', '---');
  row('RTP', pct(mean, 4));
  row('95 % confidence interval', `${pct(mean - 1.96 * se, 4)} … ${pct(mean + 1.96 * se, 4)}`);
  row('Standard deviation per round', `${sd.toFixed(3)} x bet`);
  row('Standard error (analytic / batch means)', `${pct(se, 4)} / ${pct(bSe, 4)}`);
  row('RTP base game clusters', pct(a.bySource.base / n / 100));
  row('RTP Temple Bonus (base game)', pct(a.bySource.baseBonus / n / 100));
  row('RTP free-spin clusters', pct(a.bySource.free / n / 100));
  row('RTP Temple Finale', pct(a.bySource.finale / n / 100));
  L.push('', '## Frequencies', '');
  row('Metric', 'Value'); row('---', '---');
  row('Hit frequency (base spin with a cluster)', pct(a.baseHits / n));
  row('Rounds with any win', pct(a.roundsWithWin / n));
  row('Free spins (any source)', oneIn(a.fsRounds));
  row('Free spins via Compass', oneIn(a.fsFromCompass));
  row('Temple Bonus in base game', oneIn(a.baseBonus));
  row('Max win reached', `${a.capped} (${oneIn(a.capped)})`);
  row('Cascade limit reached', a.cascadeLimit);
  row('Longest cascade sequence in one spin', a.maxCascades);
  L.push('', '## Win distribution per round', '');
  row('Win', 'Rounds', 'Share'); row('---', '---', '---');
  a.winClasses.forEach((c, i) => row(WIN_CLASS_LABELS[i], c.toLocaleString('en-US'), pct(c / n, 5)));
  L.push('', '## Highest station reached per base spin', '');
  row('Station', 'Share', 'Frequency'); row('---', '---', '---');
  a.stations.forEach((c, i) => row(i, pct(c / n, 4), oneIn(c)));
  L.push('', '## Cascades per base spin', '');
  row('Cascades', 'Share'); row('---', '---');
  a.cascades.forEach((c, i) => { if (c > 0) row(i, pct(c / n, 5)); });
  L.push('', '## Free-spin feature', '');
  if (a.fsRounds > 0) {
    const f = a.fsRounds, fm = a.fsFeatureWin / f / 100;
    row('Metric', 'Value'); row('---', '---');
    row('Features played', f.toLocaleString('en-US'));
    row('Average feature win (incl. finale)', `${fm.toFixed(2)} x bet`);
    row('Standard deviation of feature win', `${Math.sqrt(a.fsFeatureWinSq / f / 10000 - fm * fm).toFixed(2)} x bet`);
    row('Average free spins played', (a.fsSpins / f).toFixed(2));
    row('Average final sun bonus S / maximum', `${(a.fsSunBonusSum / f).toFixed(2)} / ${a.fsSunBonusMax}`);
    row('Final Base Camp 0/1/2/3', a.fsBaseCamp.map((c) => pct(c / f, 1)).join(' / '));
    row('Seals 0/1/2/3', a.finaleBySeals.map((c) => pct(c / f, 1)).join(' / '));
  } else L.push('No free-spin feature occurred.');
  L.push('', '## Temple Bonus: exact expectation vs. simulation', '');
  row('Tier', 'Exact EV (x bet)', 'Simulated mean (x bet)', 'Samples'); row('---', '---', '---', '---');
  row('Base game', exact.base.expectedWin.toFixed(3), a.baseBonus ? (a.baseBonusWin / a.baseBonus / 100).toFixed(3) : '–', a.baseBonus);
  exact.finale.forEach((e, i) => {
    const c = a.finaleBySeals[i + 1];
    row(`Finale, ${i + 1} seal(s)`, e.expectedWin.toFixed(3), c ? (a.finaleWinBySeals[i + 1] / c / 100).toFixed(3) : '–', c);
  });
  L.push('', `Exact probability of free spins from the base-game bonus: ${pct(exact.base.pFreeSpins, 3)}; simulated: ${a.baseBonus ? pct(a.fsFromBonus / a.baseBonus, 3) : '–'}.`);
  L.push(`Exact probability of 3+ Compass on the first drop (base weights): ${pct(compassFirstDrop(cfg.weights.base, cells, 3), 4)} (the simulated trigger rate also counts Compass symbols arriving in cascades).`);
  L.push('', '## Paying clusters per 1 000 rounds (all modes)', '');
  const names = ['Sapphire Gem', 'Golden Scarab', 'Golden Chalice', 'Ruby Crown', 'Jade Mask'];
  const br = cfg.payBrackets;
  row('Symbol', ...br.map((lo, i) => (i + 1 < br.length ? (br[i + 1] - 1 === lo ? `${lo}` : `${lo}–${br[i + 1] - 1}`) : `${lo}+`)));
  row('---', ...br.map(() => '---'));
  names.forEach((name, s) => {
    row(name, ...br.map((lo, i) => {
      const hi = i + 1 < br.length ? br[i + 1] - 1 : cells;
      let c = 0;
      for (let size = lo; size <= hi; size++) c += a.clusters[s * (cells + 1) + size];
      return ((c / n) * 1000).toFixed(3);
    }));
  });
  L.push('', '## Largest wins (replay: same seed, stream and round index)', '');
  row('Win (x bet)', 'Stream', 'Round'); row('---', '---', '---');
  a.top.forEach((t) => row((t.win / 100).toFixed(2), t.stream, t.round));
  L.push('');
  return { text: L.join('\n'), meta: { ...run, rounds: n, rtp: mean, sd, se, batchSe: bSe } };
}
