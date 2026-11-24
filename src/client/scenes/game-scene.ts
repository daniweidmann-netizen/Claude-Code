import Phaser from 'phaser';
import { CONFIG_V1 } from '../../engine/index.js';
import { LocalGameService, type GameService, type RoundKind } from '../../session/game-service.js';
import { computeLayout, formatMoney } from '../layout.js';
import { Presenter } from '../presentation/presenter.js';
import { historyHtml, paytableHtml, rulesHtml } from '../rules-text.js';
import { InfoPanel } from '../ui/info-panel.js';
import { createPlaceholderTextures, preloadReferenceArt } from '../textures.js';
import { COLOR } from '../theme.js';
import { GridView } from '../views/grid-view.js';
import { Hud } from '../views/hud.js';
import { Banner, Modal } from '../views/overlays.js';
import { TrackView } from '../views/track-view.js';

const TURBO = 4;
/** Rounds per autoplay run (demo only). It stops early when a round cannot be paid; a chamber pick always waits for the player. */
const AUTO_ROUNDS = 10;

export class GameScene extends Phaser.Scene {
  private service!: GameService;
  private grid!: GridView;
  private track!: TrackView;
  private hud!: Hud;
  private modal!: Modal;
  private presenter!: Presenter;
  private busy = false;
  private autoLeft = 0;
  private info!: InfoPanel;
  private rounds = 0;

  constructor() { super('game'); }

  preload(): void {
    if (new URLSearchParams(window.location.search).get('art') !== 'placeholder') preloadReferenceArt(this);
  }

  create(): void {
    const params = new URLSearchParams(window.location.search);
    // ?seed=n makes the demo deterministic (testing and replays only).
    const seedParam = params.get('seed');
    let next = seedParam !== null ? BigInt(seedParam) : null;
    this.service = new LocalGameService(CONFIG_V1, {
      balance: Number(params.get('balance') ?? 100_000),
      nextSeed: next !== null ? () => next!++ : undefined,
    });
    const cfg = this.service.config;

    createPlaceholderTextures(this);
    this.cameras.main.setBackgroundColor(COLOR.bg);
    this.grid = new GridView(this, cfg.cols, cfg.rows);
    this.track = new TrackView(this, cfg.stationSteps, cfg.freeSpins.maxSeals);
    this.hud = new Hud(this, {
      spin: () => void this.playRound('spin'),
      buy: () => void this.confirmBuy(),
      betDown: () => this.changeBet(-1),
      betUp: () => this.changeBet(1),
      info: () => { if (!this.busy && !this.modal.open) { this.input.enabled = false; this.info.show('rules'); } },
      auto: () => this.toggleAuto(),
    });
    this.info = new InfoPanel([
      { id: 'rules', label: 'Regeln', html: () => rulesHtml(cfg) },
      { id: 'pays', label: 'Auszahlungen', html: () => paytableHtml(cfg, this.service.bet) },
      { id: 'history', label: 'Verlauf', html: () => historyHtml(this.service.history()) },
    ]);
    this.info.onClose = () => { this.input.enabled = true; };
    this.modal = new Modal(this);
    this.presenter = new Presenter(this, cfg, { grid: this.grid, track: this.track, hud: this.hud, banner: new Banner(this), modal: this.modal });

    this.scale.on('resize', () => this.relayout());
    this.relayout();
    this.refreshHud();

    // Tapping the playfield while a round is presented speeds it up; outcomes are already fixed.
    this.input.on('pointerdown', (_p: Phaser.Input.Pointer, over: Phaser.GameObjects.GameObject[]) => {
      if (this.busy && !this.modal.open && over.length === 0) this.setSpeed(TURBO);
    });
    this.input.keyboard?.on('keydown-SPACE', () => { if (this.info.isOpen) return; if (this.busy) this.setSpeed(TURBO); else if (this.autoLeft === 0) void this.playRound('spin'); });
    if (params.get('fast') !== null) this.baseSpeed = Number(params.get('fast')) || TURBO;
    this.setSpeed(this.baseSpeed);

    // Read-only hook for automated end-to-end tests.
    (window as unknown as Record<string, unknown>).__tls = {
      state: () => ({
        busy: this.busy, rounds: this.rounds, autoLeft: this.autoLeft, info: this.info.isOpen, balance: this.service.balance, bet: this.service.bet,
        modal: this.modal.open, mismatches: this.presenter.mismatches, grid: this.grid.snapshot(),
        history: this.service.history().slice(0, 5),
      }),
      spin: () => void this.playRound('spin'),
      buy: () => void this.playRound('buy'),
      auto: () => this.toggleAuto(),
    };
  }

  private baseSpeed = 1;
  private setSpeed(s: number): void { this.tweens.timeScale = s; this.time.timeScale = s; }

  private relayout(): void {
    const { width, height } = this.scale;
    const cfg = this.service.config;
    const l = computeLayout(width, height, cfg.cols, cfg.rows);
    this.grid.layout(l.grid.x, l.grid.y, l.grid.cell);
    this.track.layout(l.track, l.ui);
    this.hud.layout(l);
  }

  private refreshHud(): void {
    const s = this.service;
    this.hud.setBalance(s.balance);
    this.hud.setBet(s.bet, s.stake('buy'), s.config.featureBuy.enabled);
    this.hud.setBusy(this.busy, s.canStart('spin'), s.canStart('buy'), this.autoLeft);
  }

  private changeBet(dir: number): void {
    if (this.busy) return;
    const levels = this.service.betLevels;
    const i = levels.indexOf(this.service.bet) + dir;
    if (i < 0 || i >= levels.length) return;
    this.service.setBet(levels[i]);
    this.refreshHud();
  }

  private toggleAuto(): void {
    if (this.autoLeft > 0) { this.autoLeft = 0; this.refreshHud(); return; }
    if (this.busy || this.modal.open || !this.service.canStart('spin')) return;
    this.autoLeft = AUTO_ROUNDS;
    void this.runAuto();
  }

  private async runAuto(): Promise<void> {
    while (this.autoLeft > 0 && this.service.canStart('spin')) {
      this.autoLeft--;
      await this.playRound('spin');
      if (this.autoLeft > 0) await new Promise<void>((r) => this.time.delayedCall(250, () => r()));
    }
    this.autoLeft = 0;
    this.refreshHud();
  }

  private async confirmBuy(): Promise<void> {
    if (this.busy || this.autoLeft > 0 || this.modal.open || !this.service.canStart('buy')) return;
    const price = formatMoney(this.service.stake('buy'));
    const ok = await this.modal.confirm(
      'Expedition kaufen?',
      `Preis: ${price} (58× Einsatz).\nDu startest direkt mit 8 Free Spins, Base Camp auf Station 1.\nEin Gewinn ist nicht garantiert.`,
      `Kaufen ${price}`, 'Abbrechen',
    );
    if (ok) await this.playRound('buy');
  }

  private async playRound(kind: RoundKind): Promise<void> {
    if (this.busy || this.modal.open || !this.service.canStart(kind)) return;
    this.busy = true;
    const before = this.service.balance;
    const stake = this.service.stake(kind);
    this.presenter.beginRound(this.service.bet);
    let step = this.service.start(kind);
    // The win is credited by the service at once; the display follows the presentation.
    this.hud.setBalance(before - stake);
    this.hud.setBusy(true, false, false, this.autoLeft);
    await this.presenter.play(step.events);
    while (!step.done) {
      this.setSpeed(this.baseSpeed);
      const chamber = await this.modal.waitPick(step.availableChambers);
      step = this.service.pick(chamber);
      await this.presenter.play(step.events);
    }
    this.setSpeed(this.baseSpeed);
    this.busy = false;
    this.rounds++;
    this.refreshHud();
  }
}
