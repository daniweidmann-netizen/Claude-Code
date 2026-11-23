import { EMPTY, PAY_SYMBOL_COUNT, Sym, type GameConfig, type GameEvent } from '../../src/engine/index.js';

/**
 * Independent re-check of an event log. Deliberately shares no code with the
 * engine: clusters are found with union-find instead of flood fill.
 * Returns the total win implied by the log.
 */
export function verifyEvents(cfg: GameConfig, events: GameEvent[]): number {
  const n = cfg.cols * cfg.rows;
  let grid: number[] = [];
  let afterRemoval: number[] | null = null;
  let treasure = 1, sun = 0, station = 0, steps = 0, total = 0, keysNow = 0;
  let lastClusters: number[] = [];
  const fail = (m: string): never => { throw new Error(`event log invalid: ${m}`); };
  const isWild = (v: number) => v === Sym.WILD || v === Sym.EXPLORER;

  const clustersOf = (g: number[]) => {
    const found: { symbol: number; cells: number[] }[] = [];
    for (let s = 0; s < PAY_SYMBOL_COUNT; s++) {
      const parent = Array.from({ length: n }, (_, i) => i);
      const root = (x: number): number => (parent[x] === x ? x : (parent[x] = root(parent[x])));
      const ok = (i: number) => g[i] === s || isWild(g[i]);
      for (let i = 0; i < n; i++) {
        if (!ok(i)) continue;
        if (i % cfg.cols < cfg.cols - 1 && ok(i + 1)) parent[root(i)] = root(i + 1);
        if (i + cfg.cols < n && ok(i + cfg.cols)) parent[root(i)] = root(i + cfg.cols);
      }
      const groups = new Map<number, number[]>();
      for (let i = 0; i < n; i++) if (ok(i)) groups.set(root(i), [...(groups.get(root(i)) ?? []), i]);
      for (const cells of groups.values()) {
        if (cells.length >= cfg.minClusterSize && cells.some((i) => g[i] === s)) found.push({ symbol: s, cells });
      }
    }
    return found;
  };
  const payFor = (symbol: number, size: number) => {
    let b = 0;
    while (b + 1 < cfg.payBrackets.length && cfg.payBrackets[b + 1] <= size) b++;
    return cfg.paytable[symbol][b];
  };

  for (const e of events) {
    switch (e.type) {
      case 'spinStarted':
        treasure = 1; station = e.station; steps = e.steps;
        if (steps !== (station > 0 ? cfg.stationSteps[station - 1] : 0)) fail('steps at spin start');
        if (e.mode === 'base') sun = 0;
        if (e.sunBonus !== sun) fail('sunBonus at spin start');
        break;
      case 'gridFilled':
        grid = [...e.grid];
        if (grid.length !== n || grid.includes(EMPTY)) fail('incomplete grid');
        break;
      case 'clustersWon': {
        const expect = clustersOf(grid);
        if (expect.length === 0) fail('win without cluster');
        if (expect.length !== e.clusters.length) fail('cluster count');
        const key = (c: { symbol: number; cells: number[] }) => `${c.symbol}:${[...c.cells].sort((a, b) => a - b).join(',')}`;
        const want = new Set(expect.map(key));
        let sum = 0;
        for (const c of e.clusters) {
          if (!want.has(key(c))) fail('cluster cells');
          if (c.size !== c.cells.length) fail('cluster size');
          if (c.win !== payFor(c.symbol, c.size) * (treasure + sun)) fail('cluster win');
          sum += c.win;
        }
        if (e.multiplier !== treasure + sun || e.win !== sum) fail('step win');
        total += sum;
        keysNow = grid.filter((v) => v === Sym.KEY).length;
        lastClusters = [...new Set(e.clusters.flatMap((c) => c.cells))];
        break;
      }
      case 'keysCollected':
        if (e.positions.length !== keysNow || e.positions.some((p) => grid[p] !== Sym.KEY)) fail('keys');
        break;
      case 'trackAdvanced':
        steps = Math.min(cfg.stationSteps[4], steps + 1 + keysNow);
        if (e.from !== station || e.steps !== steps || e.to !== cfg.stationSteps.filter((s) => s <= steps).length) fail('track');
        station = e.to;
        break;
      case 'symbolsRemoved': {
        const want = new Set<number>(lastClusters.filter((p) => grid[p] !== Sym.EXPLORER));
        grid.forEach((v, i) => { if (v === Sym.KEY) want.add(i); });
        if (want.size !== e.positions.length || e.positions.some((p) => !want.has(p))) fail('removed set');
        afterRemoval = [...grid];
        for (const p of e.positions) afterRemoval[p] = EMPTY;
        break;
      }
      case 'gridCascaded':
        if (e.grid.length !== n || e.grid.includes(EMPTY)) fail('incomplete grid after cascade');
        if (afterRemoval) {
          for (let c = 0; c < cfg.cols; c++) {
            const kept: number[] = [];
            for (let r = 0; r < cfg.rows; r++) { const v = afterRemoval[r * cfg.cols + c]; if (v !== EMPTY) kept.push(v); }
            const offset = cfg.rows - kept.length;
            kept.forEach((v, k) => { if (e.grid[(offset + k) * cfg.cols + c] !== v) fail('gravity'); });
          }
          afterRemoval = null;
        }
        grid = [...e.grid];
        break;
      case 'treasure': treasure = e.multiplier; break;
      case 'relic':
        sun += e.value;
        if (e.sunBonus !== sun) fail('sun bonus');
        break;
      case 'chamberPicked':
        total += e.prize.kind === 'freeSpins' ? 0 : e.prize.value;
        break;
      case 'roundEnded': {
        const capped = events.some((x) => x.type === 'maxWinReached');
        if (capped ? e.totalWin !== cfg.maxWin || total < cfg.maxWin : e.totalWin !== total) fail('total win');
        return e.totalWin;
      }
      default: break;
    }
  }
  return fail('no roundEnded event');
}
