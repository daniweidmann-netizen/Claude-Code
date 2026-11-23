import { findClusters } from '../clusters/clusters.js';
import { EMPTY, PAY_SYMBOL_COUNT, Sym, type GameConfig, type PrizeEntry } from '../config/types.js';
import { applyGravity, fillEmpty } from '../grid/grid.js';
import { WeightedTable, type Rng } from '../rng/rng.js';
import type { ClusterWin, GameEvent, SpinMode } from './events.js';

/** Precomputed lookup tables for one configuration. Build once, reuse for every round. */
export class Tables {
  readonly base: WeightedTable;
  readonly free: WeightedTable;
  readonly relic: WeightedTable;
  readonly relicFree: WeightedTable;
  readonly bonusBase: WeightedTable;
  readonly bonusFinale: WeightedTable[];
  /** payBySize[symbol][size] in centibet, for size 0..cells. */
  readonly payBySize: Int32Array[];
  readonly cells: number;

  constructor(readonly config: GameConfig) {
    const c = config;
    this.cells = c.cols * c.rows;
    this.base = new WeightedTable(c.weights.base);
    this.free = new WeightedTable(c.weights.free);
    this.relic = new WeightedTable(c.relicValues.map((r) => r.weight));
    this.relicFree = new WeightedTable(c.relicValuesFree.map((r) => r.weight));
    this.bonusBase = new WeightedTable(c.templeBonus.base.map((p) => p.weight));
    this.bonusFinale = c.templeBonus.finale.map((t) => new WeightedTable(t.map((p) => p.weight)));
    this.payBySize = c.paytable.map((row) => {
      const a = new Int32Array(this.cells + 1);
      for (let size = c.minClusterSize; size <= this.cells; size++) {
        let b = 0;
        while (b + 1 < c.payBrackets.length && c.payBrackets[b + 1] <= size) b++;
        a[size] = row[b];
      }
      return a;
    });
  }
}

/** Per-round measurements, filled on every round at negligible cost. All wins in centibet. */
export interface RoundStats {
  baseWin: number;
  baseBonusWin: number;
  freeWin: number;
  finaleWin: number;
  baseHit: boolean;
  baseCascades: number;
  baseStation: number;
  baseBonus: boolean;
  freeSpinsTriggered: boolean;
  freeSpinsFromBonus: boolean;
  freeSpinsPlayed: number;
  finalBaseCamp: number;
  finalSunBonus: number;
  seals: number;
  cascadeLimitHit: boolean;
  maxCascadesInSpin: number;
}

export interface RoundOptions {
  /** Record the event log (client/replay). Off for bulk simulation. */
  recordEvents?: boolean;
  /** Optional histogram [symbol * (cells + 1) + size] of paying clusters. */
  clusterHistogram?: Uint32Array;
}

type Phase = 'new' | 'baseBonus' | 'finale' | 'done';

interface BonusState {
  tier: 'base' | 'finale';
  prizes: PrizeEntry[];
  opened: boolean[];
  picksLeft: number;
}

/**
 * One game round as a resumable state machine.
 *
 *   const round = new Round(tables, rng); round.start();
 *   while (round.awaitingPick) round.pick(chamber);
 *
 * The result depends only on the configuration, the RNG sequence and the picks.
 */
export class Round {
  readonly stats: RoundStats = {
    baseWin: 0, baseBonusWin: 0, freeWin: 0, finaleWin: 0, baseHit: false, baseCascades: 0,
    baseStation: 0, baseBonus: false, freeSpinsTriggered: false, freeSpinsFromBonus: false,
    freeSpinsPlayed: 0, finalBaseCamp: 0, finalSunBonus: 0, seals: 0, cascadeLimitHit: false,
    maxCascadesInSpin: 0,
  };
  readonly events: GameEvent[] | null;
  /** Total round win in centibet. */
  totalWin = 0;
  capped = false;

  private readonly cfg: GameConfig;
  private readonly grid: Int8Array;
  private readonly hist: Uint32Array | undefined;
  private phase: Phase = 'new';
  private bonus: BonusState | null = null;
  private sunBonus = 0;
  private baseCamp = 0;
  private seals = 0;
  private freeAwarded = 0;
  private freeRemaining = 0;

  constructor(private readonly t: Tables, private readonly rng: Rng, opts: RoundOptions = {}) {
    this.cfg = t.config;
    this.grid = new Int8Array(t.cells);
    this.events = opts.recordEvents ? [] : null;
    this.hist = opts.clusterHistogram;
  }

  get done(): boolean { return this.phase === 'done'; }
  get awaitingPick(): boolean { return this.bonus !== null; }
  /** Chambers that can still be picked (empty when no pick is pending). */
  get availableChambers(): number[] {
    if (!this.bonus) return [];
    const out: number[] = [];
    this.bonus.opened.forEach((o, i) => { if (!o) out.push(i); });
    return out;
  }

  start(): void {
    if (this.phase !== 'new') throw new Error('Round already started');
    const compass = this.runSpin('base', 0);
    if (this.capped) return this.finish();
    const fs = this.cfg.freeSpins;
    const award = fs.awards.find((a) => compass >= a.minCompass);
    if (award) {
      this.stats.freeSpinsTriggered = true;
      this.awardFreeSpins(award.spins, award.baseCamp, 'compass');
    }
    if (this.stats.baseBonus) {
      this.phase = 'baseBonus';
      this.openBonus('base', this.t.bonusBase, this.cfg.templeBonus.base, 0);
      return;
    }
    this.afterBaseBonus();
  }

  /** Opens the chosen chamber. Throws if no pick is pending or the chamber is not available. */
  pick(chamber: number): void {
    const b = this.bonus;
    if (!b) throw new Error('No pick pending');
    if (!Number.isInteger(chamber) || chamber < 0 || chamber >= b.prizes.length || b.opened[chamber]) {
      throw new Error(`Chamber ${chamber} is not available`);
    }
    b.opened[chamber] = true;
    b.picksLeft--;
    const prize = b.prizes[chamber];
    this.events?.push({ type: 'chamberPicked', chamber, prize: { kind: prize.kind, value: prize.value } });
    if (prize.kind === 'freeSpins') {
      const f = this.cfg.templeBonus.bonusFreeSpins;
      this.stats.freeSpinsFromBonus = true;
      this.awardFreeSpins(f.spins, f.baseCamp, 'bonus');
    } else {
      this.addWin(prize.value, b.tier === 'base' ? 'baseBonusWin' : 'finaleWin');
    }
    // Every Relic Bonus grants one further pick while closed chambers remain.
    if (prize.kind === 'relic' && b.opened.includes(false) && !this.capped) b.picksLeft++;
    if (b.picksLeft > 0 && !this.capped) return;

    if (this.events) {
      const rest = b.prizes
        .map((p, i) => ({ chamber: i, prize: { kind: p.kind, value: p.value } }))
        .filter((_, i) => !b.opened[i]);
      this.events.push({ type: 'chambersRevealed', prizes: rest });
    }
    this.bonus = null;
    if (this.capped || b.tier === 'finale') return this.finish();
    this.afterBaseBonus();
  }

  private afterBaseBonus(): void {
    const fs = this.cfg.freeSpins;
    let index = 0;
    while (this.freeRemaining > 0) {
      this.freeRemaining--;
      index++;
      this.stats.freeSpinsPlayed++;
      const compass = this.runSpin('free', index);
      if (this.capped) return this.finish();
      if (compass >= fs.retriggerCompass) this.awardFreeSpins(fs.retriggerSpins, this.baseCamp, 'retrigger');
    }
    this.stats.finalBaseCamp = this.baseCamp;
    this.stats.finalSunBonus = this.sunBonus;
    this.stats.seals = this.seals;
    if (this.seals > 0) {
      this.phase = 'finale';
      this.openBonus('finale', this.t.bonusFinale[this.seals - 1], this.cfg.templeBonus.finale[this.seals - 1], this.seals);
      return;
    }
    this.finish();
  }

  private finish(): void {
    this.bonus = null;
    this.phase = 'done';
    this.events?.push({ type: 'roundEnded', totalWin: this.totalWin });
  }

  private awardFreeSpins(spins: number, baseCamp: number, source: 'compass' | 'retrigger' | 'bonus'): void {
    const granted = Math.min(spins, this.cfg.freeSpins.maxSpins - this.freeAwarded);
    this.freeAwarded += granted;
    this.freeRemaining += granted;
    if (baseCamp > this.baseCamp) this.baseCamp = baseCamp;
    this.events?.push({ type: 'freeSpinsAwarded', spins: granted, total: this.freeAwarded, baseCamp: this.baseCamp, source });
  }

  /**
   * Draws the prizes (grand prize at most once), then shuffles them onto the
   * chambers so every chamber has the same distribution. From here on the
   * outcome of each possible pick is fixed.
   */
  private openBonus(tier: 'base' | 'finale', table: WeightedTable, entries: PrizeEntry[], seals: number): void {
    const n = this.cfg.templeBonus.chambers;
    const prizes: PrizeEntry[] = [];
    let hasGrand = false;
    while (prizes.length < n) {
      const p = entries[table.pick(this.rng)];
      if (p.kind === 'grand') {
        if (hasGrand) continue;
        hasGrand = true;
      }
      prizes.push(p);
    }
    for (let i = n - 1; i > 0; i--) {
      const j = this.rng.nextInt(i + 1);
      const tmp = prizes[i]; prizes[i] = prizes[j]; prizes[j] = tmp;
    }
    this.bonus = { tier, prizes, opened: new Array<boolean>(n).fill(false), picksLeft: 1 };
    this.events?.push({ type: 'templeBonusStarted', tier, seals, chambers: n });
  }

  private addWin(amount: number, source: 'baseWin' | 'baseBonusWin' | 'freeWin' | 'finaleWin'): void {
    const room = this.cfg.maxWin - this.totalWin;
    const paid = amount >= room ? room : amount;
    this.totalWin += paid;
    this.stats[source] += paid;
    if (this.totalWin >= this.cfg.maxWin && !this.capped) {
      this.capped = true;
      this.events?.push({ type: 'maxWinReached' });
    }
  }

  /** Uniformly picks a cell showing a pay symbol and returns it, or -1 if there is none. */
  private randomPayCell(): number {
    const g = this.grid;
    let count = 0;
    for (let i = 0; i < g.length; i++) if (g[i] >= 0 && g[i] < PAY_SYMBOL_COUNT) count++;
    if (count === 0) return -1;
    let k = this.rng.nextInt(count);
    for (let i = 0; i < g.length; i++) {
      if (g[i] >= 0 && g[i] < PAY_SYMBOL_COUNT && k-- === 0) return i;
    }
    return -1;
  }

  /** Executes the effect of one station on the current grid. Returns the new base multiplier T. */
  private applyStation(station: number, mode: SpinMode, treasure: number): number {
    const g = this.grid;
    switch (station) {
      case 1: {
        const positions: number[] = [];
        for (let k = 0; k < this.cfg.discoveryWilds; k++) {
          const p = this.randomPayCell();
          if (p < 0) break;
          g[p] = Sym.WILD;
          positions.push(p);
        }
        this.events?.push({ type: 'discovery', positions });
        return treasure;
      }
      case 2:
        this.events?.push({ type: 'treasure', multiplier: this.cfg.treasureMultiplier });
        return this.cfg.treasureMultiplier;
      case 3: {
        const p = this.randomPayCell();
        if (p >= 0) g[p] = Sym.EXPLORER;
        this.events?.push({ type: 'ancientPower', position: p });
        return treasure;
      }
      case 4: {
        const p = this.randomPayCell();
        if (p >= 0) {
          const free = mode === 'free';
          const idx = (free ? this.t.relicFree : this.t.relic).pick(this.rng);
          const value = (free ? this.cfg.relicValuesFree : this.cfg.relicValues)[idx].value;
          this.sunBonus += value;
          g[p] = Sym.WILD;
          this.events?.push({ type: 'relic', position: p, value, sunBonus: this.sunBonus });
        }
        return treasure;
      }
      default: {
        if (mode === 'base') this.stats.baseBonus = true;
        else if (this.seals < this.cfg.freeSpins.maxSeals) this.seals++;
        this.events?.push({ type: 'templeReached', mode, seals: this.seals });
        return treasure;
      }
    }
  }

  /** Plays one spin including all cascades. Returns the number of Compass symbols at the end. */
  private runSpin(mode: SpinMode, freeSpinIndex: number): number {
    const { cfg, grid, rng } = this;
    const { cols, rows } = cfg;
    const table = mode === 'base' ? this.t.base : this.t.free;
    const winSource = mode === 'base' ? 'baseWin' : 'freeWin';
    const ev = this.events;

    if (mode === 'base') this.sunBonus = 0;
    const need = cfg.stationSteps;
    let station = mode === 'free' ? this.baseCamp : 0;
    // A free spin starts exactly on its Base Camp station.
    let steps = station > 0 ? need[station - 1] : 0;
    let treasure = 1;
    let cascades = 0;
    let spinWin = 0;
    let sealedThisSpin = false;

    ev?.push({ type: 'spinStarted', mode, freeSpinIndex, station, steps, sunBonus: this.sunBonus });
    grid.fill(EMPTY);
    fillEmpty(grid, cols, rows, table, rng);
    ev?.push({ type: 'gridFilled', grid: Array.from(grid) });
    for (let s = 1; s <= station; s++) treasure = this.applyStation(s, mode, treasure);
    if (ev && station > 0) ev.push({ type: 'gridCascaded', grid: Array.from(grid) });

    for (;;) {
      const clusters = findClusters(grid, cols, rows, cfg.minClusterSize);
      if (clusters.length === 0) break;

      const multiplier = treasure + this.sunBonus;
      let stepWin = 0;
      const wins: ClusterWin[] | null = ev ? [] : null;
      for (const c of clusters) {
        const w = this.t.payBySize[c.symbol][c.size] * multiplier;
        stepWin += w;
        if (this.hist) this.hist[c.symbol * (this.t.cells + 1) + c.size]++;
        wins?.push({ symbol: c.symbol, size: c.size, cells: c.cells, win: w });
      }
      ev?.push({ type: 'clustersWon', clusters: wins!, multiplier, win: stepWin });
      const before = this.totalWin;
      this.addWin(stepWin, winSource);
      spinWin += this.totalWin - before;
      cascades++;
      if (this.capped) break;

      // Progress: one step per winning cascade plus one per Temple Key on the grid.
      const keyCells: number[] = [];
      for (let i = 0; i < grid.length; i++) if (grid[i] === Sym.KEY) keyCells.push(i);
      steps = Math.min(need[4], steps + 1 + keyCells.length);
      let target = station;
      while (target < 5 && need[target] <= steps) target++;
      if (keyCells.length > 0) {
        if (mode === 'free') this.baseCamp = Math.min(cfg.freeSpins.maxBaseCamp, this.baseCamp + keyCells.length);
        ev?.push({ type: 'keysCollected', positions: keyCells, baseCamp: this.baseCamp });
      }
      ev?.push({ type: 'trackAdvanced', from: station, to: target, steps });

      // Remove winning cells (the Explorer stays) and collected keys.
      const removed: number[] | null = ev ? [] : null;
      for (const c of clusters) {
        for (const p of c.cells) {
          if (grid[p] !== Sym.EXPLORER && grid[p] !== EMPTY) { grid[p] = EMPTY; removed?.push(p); }
        }
      }
      for (const p of keyCells) { grid[p] = EMPTY; removed?.push(p); }
      ev?.push({ type: 'symbolsRemoved', positions: removed! });

      applyGravity(grid, cols, rows);
      fillEmpty(grid, cols, rows, table, rng);
      ev?.push({ type: 'gridCascaded', grid: Array.from(grid) });

      if (target > station) {
        for (let s = station + 1; s <= target; s++) {
          if (s === 5 && mode === 'free') {
            if (sealedThisSpin) continue;
            sealedThisSpin = true;
          }
          treasure = this.applyStation(s, mode, treasure);
        }
        station = target;
        ev?.push({ type: 'gridCascaded', grid: Array.from(grid) });
      }

      if (cascades >= cfg.maxCascades) {
        this.stats.cascadeLimitHit = true;
        ev?.push({ type: 'cascadeLimitReached' });
        break;
      }
    }

    let compass = 0;
    for (let i = 0; i < grid.length; i++) if (grid[i] === Sym.COMPASS) compass++;
    if (cascades > this.stats.maxCascadesInSpin) this.stats.maxCascadesInSpin = cascades;
    if (mode === 'base') {
      this.stats.baseHit = cascades > 0;
      this.stats.baseCascades = cascades;
      this.stats.baseStation = station;
    }
    ev?.push({ type: 'spinEnded', mode, win: spinWin, compass });
    return compass;
  }
}

/** Converts a centibet amount into currency minor units for a given bet. */
export function centibetToMoney(centibet: number, bet: number): number {
  if (!Number.isInteger(bet) || bet <= 0 || bet % 10 !== 0) {
    throw new Error('bet must be a positive multiple of 10 minor units');
  }
  return (centibet / 10) * (bet / 10);
}
