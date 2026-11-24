import { Round, Tables, Xoshiro256, centibetToMoney, type GameConfig, type GameEvent } from '../engine/index.js';

export type RoundKind = 'spin' | 'buy';

/** What the client learns after starting a round or picking a chamber. */
export interface RoundStep {
  /** Events since the previous step, in order. Prizes of closed chambers are never included. */
  events: GameEvent[];
  awaitingPick: boolean;
  availableChambers: number[];
  done: boolean;
  /** Round win so far in currency minor units. */
  win: number;
  /** Balance after this step (the win is credited when the round is done). */
  balance: number;
}

/** Everything needed to replay a finished demo round bit for bit. */
export interface HistoryEntry {
  seed: string;
  kind: RoundKind;
  bet: number;
  stake: number;
  picks: number[];
  win: number;
  configVersion: string;
}

/** The interface the client talks to. A remote game server implements the same contract. */
export interface GameService {
  readonly config: GameConfig;
  readonly balance: number;
  readonly bet: number;
  readonly betLevels: readonly number[];
  readonly roundActive: boolean;
  setBet(bet: number): void;
  /** Cost of a round of the given kind at the current bet, in minor units. */
  stake(kind: RoundKind): number;
  canStart(kind: RoundKind): boolean;
  start(kind: RoundKind): RoundStep;
  pick(chamber: number): RoundStep;
  history(): readonly HistoryEntry[];
}

export interface LocalServiceOptions {
  /** Demo balance in minor units. */
  balance?: number;
  betLevels?: number[];
  /** Seed source; defaults to the platform's cryptographic generator. */
  nextSeed?: () => bigint;
  historySize?: number;
}

function cryptoSeed(): bigint {
  const a = new Uint32Array(2);
  globalThis.crypto.getRandomValues(a);
  return (BigInt(a[0]) << 32n) | BigInt(a[1]);
}

/**
 * Demo implementation: the engine runs in the same process with play money.
 * Outcomes depend only on the seed and the picks; balance, bet size and
 * history never feed into the random draws.
 */
export class LocalGameService implements GameService {
  readonly betLevels: readonly number[];
  private readonly tables: Tables;
  private readonly nextSeed: () => bigint;
  private readonly historySize: number;
  private readonly log: HistoryEntry[] = [];
  private _balance: number;
  private _bet: number;
  private round: Round | null = null;
  private sent = 0;
  private current: HistoryEntry | null = null;

  constructor(readonly config: GameConfig, opts: LocalServiceOptions = {}) {
    this.tables = new Tables(config);
    this.betLevels = opts.betLevels ?? [20, 50, 100, 200, 500, 1000];
    for (const b of this.betLevels) centibetToMoney(100, b); // validates every level
    this._bet = this.betLevels[Math.min(2, this.betLevels.length - 1)];
    this._balance = opts.balance ?? 100_000;
    this.nextSeed = opts.nextSeed ?? cryptoSeed;
    this.historySize = opts.historySize ?? 50;
  }

  get balance(): number { return this._balance; }
  get bet(): number { return this._bet; }
  get roundActive(): boolean { return this.round !== null; }

  setBet(bet: number): void {
    if (this.round) throw new Error('Bet cannot change during a round');
    if (!this.betLevels.includes(bet)) throw new Error(`Bet ${bet} is not offered`);
    this._bet = bet;
  }

  stake(kind: RoundKind): number {
    return kind === 'buy' ? centibetToMoney(this.config.featureBuy.price, this._bet) : this._bet;
  }

  canStart(kind: RoundKind): boolean {
    if (this.round) return false;
    if (kind === 'buy' && !this.config.featureBuy.enabled) return false;
    return this._balance >= this.stake(kind);
  }

  start(kind: RoundKind): RoundStep {
    if (this.round) throw new Error('A round is already active');
    if (kind === 'buy' && !this.config.featureBuy.enabled) throw new Error('Feature buy is disabled');
    const stake = this.stake(kind);
    if (this._balance < stake) throw new Error('Insufficient balance');
    const seed = this.nextSeed();
    this._balance -= stake;
    this.round = new Round(this.tables, Xoshiro256.fromSeed(seed), { recordEvents: true });
    this.sent = 0;
    this.current = { seed: seed.toString(), kind, bet: this._bet, stake, picks: [], win: 0, configVersion: this.config.version };
    if (kind === 'buy') this.round.startBought(); else this.round.start();
    return this.step();
  }

  pick(chamber: number): RoundStep {
    if (!this.round || !this.round.awaitingPick) throw new Error('No pick pending');
    this.round.pick(chamber); // throws for an unavailable chamber, state unchanged
    this.current!.picks.push(chamber);
    return this.step();
  }

  history(): readonly HistoryEntry[] { return this.log; }

  private step(): RoundStep {
    const r = this.round!;
    const all = r.events!;
    const events = all.slice(this.sent);
    this.sent = all.length;
    const win = centibetToMoney(r.totalWin, this._bet);
    const out: RoundStep = {
      events, awaitingPick: r.awaitingPick, availableChambers: r.availableChambers, done: r.done, win, balance: this._balance,
    };
    if (r.done) {
      this._balance += win;
      out.balance = this._balance;
      this.current!.win = win;
      this.log.unshift(this.current!);
      if (this.log.length > this.historySize) this.log.length = this.historySize;
      this.round = null;
      this.current = null;
    }
    return out;
  }
}

/** Replays a history entry and returns its complete event log. */
export function replay(config: GameConfig, entry: HistoryEntry): GameEvent[] {
  const round = new Round(new Tables(config), Xoshiro256.fromSeed(BigInt(entry.seed)), { recordEvents: true });
  if (entry.kind === 'buy') round.startBought(); else round.start();
  for (const p of entry.picks) round.pick(p);
  if (!round.done) throw new Error('History entry is incomplete');
  return round.events!;
}
