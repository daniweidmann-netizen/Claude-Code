import { Round, Tables, Xoshiro256, type GameConfig } from '../../src/engine/index.js';

/** Upper bounds (in bet multiples, exclusive) of the win-distribution classes; class 0 is "no win". */
export const WIN_CLASSES = [0, 1, 2, 5, 10, 20, 50, 100, 500, 1000, 5000, Infinity];
export const WIN_CLASS_LABELS = ['0', '(0, 1x)', '[1x, 2x)', '[2x, 5x)', '[5x, 10x)', '[10x, 20x)', '[20x, 50x)', '[50x, 100x)', '[100x, 500x)', '[500x, 1000x)', '[1000x, 5000x)', '>= 5000x'];

export interface TopWin { win: number; stream: number; round: number }

/** Additive accumulators; all wins in centibet. */
export interface Acc {
  rounds: number;
  sumWin: number;
  sumWinSq: number;
  bySource: { base: number; baseBonus: number; free: number; finale: number };
  roundsWithWin: number;
  baseHits: number;
  winClasses: number[];
  cascades: number[];
  stations: number[];
  baseBonus: number;
  baseBonusWin: number;
  fsRounds: number;
  fsFromCompass: number;
  fsFromBonus: number;
  fsSpins: number;
  fsFeatureWin: number;
  fsFeatureWinSq: number;
  fsBaseCamp: number[];
  fsSunBonusSum: number;
  fsSunBonusMax: number;
  finaleBySeals: number[];
  finaleWinBySeals: number[];
  capped: number;
  cascadeLimit: number;
  maxCascades: number;
  clusters: number[];
  /** RTP of consecutive batches, for batch-means error estimation. */
  batchRtp: number[];
  top: TopWin[];
}

export function emptyAcc(cfg: GameConfig): Acc {
  const cells = cfg.cols * cfg.rows;
  return {
    rounds: 0, sumWin: 0, sumWinSq: 0, bySource: { base: 0, baseBonus: 0, free: 0, finale: 0 },
    roundsWithWin: 0, baseHits: 0, winClasses: new Array<number>(WIN_CLASSES.length).fill(0),
    cascades: new Array<number>(cfg.maxCascades + 1).fill(0), stations: new Array<number>(6).fill(0),
    baseBonus: 0, baseBonusWin: 0, fsRounds: 0, fsFromCompass: 0, fsFromBonus: 0, fsSpins: 0,
    fsFeatureWin: 0, fsFeatureWinSq: 0, fsBaseCamp: new Array<number>(cfg.freeSpins.maxBaseCamp + 1).fill(0),
    fsSunBonusSum: 0, fsSunBonusMax: 0,
    finaleBySeals: new Array<number>(cfg.freeSpins.maxSeals + 1).fill(0),
    finaleWinBySeals: new Array<number>(cfg.freeSpins.maxSeals + 1).fill(0),
    capped: 0, cascadeLimit: 0, maxCascades: 0, clusters: new Array<number>(5 * (cells + 1)).fill(0),
    batchRtp: [], top: [],
  };
}

const TOP_N = 10;

export function merge(a: Acc, b: Acc): Acc {
  const add = (x: number[], y: number[]) => { for (let i = 0; i < x.length; i++) x[i] += y[i]; };
  a.rounds += b.rounds; a.sumWin += b.sumWin; a.sumWinSq += b.sumWinSq;
  a.bySource.base += b.bySource.base; a.bySource.baseBonus += b.bySource.baseBonus;
  a.bySource.free += b.bySource.free; a.bySource.finale += b.bySource.finale;
  a.roundsWithWin += b.roundsWithWin; a.baseHits += b.baseHits;
  add(a.winClasses, b.winClasses); add(a.cascades, b.cascades); add(a.stations, b.stations);
  a.baseBonus += b.baseBonus; a.baseBonusWin += b.baseBonusWin;
  a.fsRounds += b.fsRounds; a.fsFromCompass += b.fsFromCompass; a.fsFromBonus += b.fsFromBonus;
  a.fsSpins += b.fsSpins; a.fsFeatureWin += b.fsFeatureWin; a.fsFeatureWinSq += b.fsFeatureWinSq;
  add(a.fsBaseCamp, b.fsBaseCamp); a.fsSunBonusSum += b.fsSunBonusSum;
  a.fsSunBonusMax = Math.max(a.fsSunBonusMax, b.fsSunBonusMax);
  add(a.finaleBySeals, b.finaleBySeals); add(a.finaleWinBySeals, b.finaleWinBySeals);
  a.capped += b.capped; a.cascadeLimit += b.cascadeLimit; a.maxCascades = Math.max(a.maxCascades, b.maxCascades);
  add(a.clusters, b.clusters);
  a.batchRtp.push(...b.batchRtp);
  a.top = [...a.top, ...b.top].sort((x, y) => y.win - x.win).slice(0, TOP_N);
  return a;
}

/**
 * Plays `rounds` rounds on RNG stream `stream` of `seed`. One generator runs
 * through the whole stream, so (config, seed, stream, rounds) fixes the result.
 * Picks always take the first closed chamber; chambers are exchangeable.
 */
export function runStream(cfg: GameConfig, seed: bigint, stream: number, rounds: number, batchSize: number): Acc {
  const tables = new Tables(cfg);
  const rng = Xoshiro256.fromSeed(seed, BigInt(stream));
  const acc = emptyAcc(cfg);
  const hist = new Uint32Array(acc.clusters.length);
  const opts = { clusterHistogram: hist };
  let batchWin = 0, batchCount = 0, topMin = 0;

  for (let i = 0; i < rounds; i++) {
    const r = new Round(tables, rng, opts);
    r.start();
    while (r.awaitingPick) r.pick(r.availableChambers[0]);
    const s = r.stats, w = r.totalWin;

    acc.rounds++; acc.sumWin += w; acc.sumWinSq += w * w;
    acc.bySource.base += s.baseWin; acc.bySource.baseBonus += s.baseBonusWin;
    acc.bySource.free += s.freeWin; acc.bySource.finale += s.finaleWin;
    if (w > 0) acc.roundsWithWin++;
    if (s.baseHit) acc.baseHits++;
    let k = 0;
    if (w > 0) { const x = w / 100; k = 1; while (x >= WIN_CLASSES[k]) k++; }
    acc.winClasses[k]++;
    acc.cascades[s.baseCascades]++; acc.stations[s.baseStation]++;
    if (s.baseBonus) { acc.baseBonus++; acc.baseBonusWin += s.baseBonusWin; }
    if (s.freeSpinsPlayed > 0) {
      acc.fsRounds++;
      if (s.freeSpinsTriggered) acc.fsFromCompass++;
      if (s.freeSpinsFromBonus) acc.fsFromBonus++;
      acc.fsSpins += s.freeSpinsPlayed;
      const fw = s.freeWin + s.finaleWin;
      acc.fsFeatureWin += fw; acc.fsFeatureWinSq += fw * fw;
      acc.fsBaseCamp[s.finalBaseCamp]++;
      acc.fsSunBonusSum += s.finalSunBonus;
      if (s.finalSunBonus > acc.fsSunBonusMax) acc.fsSunBonusMax = s.finalSunBonus;
      acc.finaleBySeals[s.seals]++; acc.finaleWinBySeals[s.seals] += s.finaleWin;
    }
    if (r.capped) acc.capped++;
    if (s.cascadeLimitHit) acc.cascadeLimit++;
    if (s.maxCascadesInSpin > acc.maxCascades) acc.maxCascades = s.maxCascadesInSpin;
    if (w > topMin || acc.top.length < TOP_N) {
      acc.top.push({ win: w, stream, round: i });
      acc.top.sort((x, y) => y.win - x.win);
      if (acc.top.length > TOP_N) acc.top.length = TOP_N;
      topMin = acc.top[acc.top.length - 1].win;
    }
    batchWin += w;
    if (++batchCount === batchSize) { acc.batchRtp.push(batchWin / (batchCount * 100)); batchWin = 0; batchCount = 0; }
  }
  for (let i = 0; i < hist.length; i++) acc.clusters[i] = hist[i];
  return acc;
}
