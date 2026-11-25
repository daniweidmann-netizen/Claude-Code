import Phaser from 'phaser';
import { CONFIG_V1 } from '../../engine/index.js';
import { LocalGameService, replay, type GameService, type HistoryEntry, type RoundKind } from '../../session/game-service.js';
import { tween } from '../anim.js';
import { Sfx } from '../audio/sfx.js';
import { DPR, REDUCED_MOTION } from '../env.js';
import { Fx } from '../fx.js';
import { LANG, storeLang, t } from '../i18n.js';
import { FRAME, computeLayout, formatMoney, previewGrid } from '../layout.js';
import { PerfMeter, perfVerdict } from '../perf.js';
import { Presenter } from '../presentation/presenter.js';
import { AUTO_NOTE, MEASURED, historyHtml, paytableHtml, perfHtml, rulesHtml, settingsHtml } from '../rules-text.js';
import { createPlaceholderTextures, preloadReferenceArt } from '../textures.js';
import { COLOR, DEPTH, DISPLAY, TEXT } from '../theme.js';
import { InfoPanel } from '../ui/info-panel.js';
import { BonusView } from '../views/bonus-view.js';
import { GridView } from '../views/grid-view.js';
import { Hud } from '../views/hud.js';
import { Banner, Modal } from '../views/overlays.js';
import { TrackView } from '../views/track-view.js';

const TURBO = 4;
/** Rounds per autoplay run (demo only). It stops early when a round cannot be paid; a chamber pick always waits for the player. */
const AUTO_ROUNDS = AUTO_NOTE;

export class GameScene extends Phaser.Scene {
  private service!: GameService;
  private grid!: GridView;
  private track!: TrackView;
  private hud!: Hud;
  private modal!: Modal;
  private bonus!: BonusView;
  private banner!: Banner;
  private fx!: Fx;
  private presenter!: Presenter;
  private info!: InfoPanel;
  private busy = false;
  private autoLeft = 0;
  private rounds = 0;
  private replays = 0;
  private freeMode = false;
  private started = false;
  private startLayer: Phaser.GameObjects.Container | null = null;
  private bg: Phaser.GameObjects.Image | null = null;
  private bgFree: Phaser.GameObjects.Image | null = null;
  private shade: Phaser.GameObjects.Rectangle | null = null;
  private previewNote: Phaser.GameObjects.Text | null = null;
  private readonly perf = new PerfMeter();
  private readonly sfx = new Sfx();
  private readonly loadErrors: string[] = [];
  private baseSpeed = 1;
  private pendingLayout = false;
  private drift: Phaser.Tweens.Tween | null = null;
  /** True once the player chose an effect level; the automatic step-down then stays out of the way. */
  private fxPinned = false;
  private played = false;
  private footerOk = true;

  constructor() { super('game'); }

  preload(): void {
    // Loading screen: a plain progress bar; nothing else can be shown before the art has arrived.
    const { width, height } = this.scale;
    const w = Math.min(width * 0.6, 420 * DPR), h = 8 * DPR;
    const frame = this.add.rectangle(width / 2, height / 2, w + 6 * DPR, h + 6 * DPR).setStrokeStyle(2 * DPR, COLOR.goldDark);
    const bar = this.add.rectangle(width / 2 - w / 2, height / 2, 1, h, COLOR.gold).setOrigin(0, 0.5);
    const label = this.add.text(width / 2, height / 2 - 30 * DPR, t('loading'), { fontFamily: DISPLAY, fontSize: `${16 * DPR}px`, color: COLOR.text }).setOrigin(0.5);
    this.load.on('progress', (p: number) => { bar.width = Math.max(1, w * p); });
    this.load.on('loaderror', (file: { key: string }) => { this.loadErrors.push(file.key); });
    this.load.once('complete', () => { frame.destroy(); bar.destroy(); label.destroy(); });
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
    if (this.textures.exists('bg_portrait')) {
      this.bg = this.add.image(0, 0, 'bg_portrait').setDepth(DEPTH.bg);
      if (this.textures.exists('bgfs_portrait')) this.bgFree = this.add.image(0, 0, 'bgfs_portrait').setDepth(DEPTH.bg).setAlpha(0);
      this.shade = this.add.rectangle(0, 0, 10, 10, 0x05070c, 0.3).setOrigin(0).setDepth(DEPTH.shade);
    }
    this.fx = new Fx(this);
    this.grid = new GridView(this, cfg.cols, cfg.rows, this.fx);
    this.track = new TrackView(this, cfg.stationSteps, cfg.freeSpins.maxSeals, this.fx);
    this.hud = new Hud(this, {
      spin: () => { if (this.busy) this.setSpeed(TURBO); else void this.playRound('spin'); },
      buy: () => void this.confirmBuy(),
      betDown: () => this.changeBet(-1),
      betUp: () => this.changeBet(1),
      betPick: () => void this.pickBet(),
      info: () => { if (!this.busy && !this.overlayOpen) { this.input.enabled = false; this.info.show('rules'); } },
      auto: () => this.toggleAuto(),
      mute: () => { this.sfx.setMuted(!this.sfx.muted); this.hud.setMuted(this.sfx.muted); },
    }, this.fx);
    this.hud.setMuted(this.sfx.muted);
    this.input.on('pointerdown', () => { this.sfx.unlock(); this.sfx.music(this.freeMode ? 'free' : 'base'); });
    this.modal = new Modal(this);
    this.bonus = new BonusView(this, this.fx);
    this.banner = new Banner(this, this.fx);
    this.presenter = new Presenter(this, cfg, {
      grid: this.grid, track: this.track, hud: this.hud, banner: this.banner, bonus: this.bonus, sfx: this.sfx, fx: this.fx,
      setMode: (free) => this.setMode(free),
    });
    this.previewNote = this.add.text(0, 0, t('preview'), { fontFamily: TEXT, fontSize: '12px', color: COLOR.dim }).setOrigin(0.5, 0).setDepth(DEPTH.hud);

    this.info = new InfoPanel([
      { id: 'rules', label: LANG === 'de' ? 'Regeln' : 'Rules', html: () => rulesHtml(cfg, LANG) },
      { id: 'pays', label: LANG === 'de' ? 'Auszahlungen' : 'Paytable', html: () => paytableHtml(cfg, this.service.bet, LANG) },
      { id: 'history', label: LANG === 'de' ? 'Verlauf' : 'History', html: () => historyHtml(this.service.history(), LANG) },
      { id: 'perf', label: LANG === 'de' ? 'Leistung' : 'Performance', html: () => {
        const st = this.perf.stats;
        return perfHtml({
          ...st, dpr: DPR, canvas: `${this.scale.width}×${this.scale.height}`,
          renderer: this.game.renderer.type === Phaser.WEBGL ? 'WebGL' : 'Canvas', reducedMotion: REDUCED_MOTION, fxLevel: this.fx.level,
        }, perfVerdict(st.fps, st.slowShare, st.frames, LANG), LANG);
      } },
      { id: 'settings', label: LANG === 'de' ? 'Einstellungen' : 'Settings', html: () => settingsHtml({ volume: this.sfx.volume, muted: this.sfx.muted, fxLevel: this.fx.level, reducedMotion: REDUCED_MOTION }, LANG) },
    ], LANG === 'de' ? 'Schliessen' : 'Close');
    this.info.onClose = () => { this.input.enabled = true; };
    this.info.onAction = (action, value) => {
      if (action === 'perf-reset') { this.perf.reset(); this.info.refresh(); }
      if (action === 'volume') { this.sfx.setVolume(Number(value) / 100); this.sfx.unlock(); this.sfx.play('button'); }
      if (action === 'mute') { this.sfx.setMuted(!this.sfx.muted); this.hud.setMuted(this.sfx.muted); this.info.refresh(); }
      if (action === 'fx') { this.fx.level = (Number(value) as 0 | 1 | 2); this.fxPinned = true; this.relayout(); this.info.refresh(); }
      if (action === 'lang') { storeLang(value === 'de' ? 'de' : 'en'); window.location.reload(); }
      if (action === 'replay') {
        const entry = this.service.history()[Number(value)];
        if (entry) { this.info.close(); void this.playReplay(entry); }
      }
    };

    this.scale.on('resize', () => { if (this.busy) this.pendingLayout = true; else this.relayout(); });
    this.relayout();
    this.grid.show(previewGrid(cfg.cols, cfg.rows));
    this.refreshHud();

    // Tapping the play field while a round is presented speeds it up; outcomes are already fixed.
    this.input.on('pointerdown', (_p: Phaser.Input.Pointer, over: Phaser.GameObjects.GameObject[]) => {
      if (this.busy && !this.overlayOpen && over.length === 0) this.setSpeed(TURBO);
    });
    this.input.keyboard?.on('keydown-SPACE', () => {
      if (this.info.isOpen) return;
      if (!this.started) { this.dismissStart(); return; }
      if (this.busy) this.setSpeed(TURBO); else if (this.autoLeft === 0) void this.playRound('spin');
    });
    if (params.get('fast') !== null) this.baseSpeed = Number(params.get('fast')) || TURBO;
    this.setSpeed(this.baseSpeed);
    if (params.get('start') === '0' || seedParam !== null) { this.started = true; } else this.showStart();

    // Read-only hook for automated end-to-end tests.
    const css = (p: { x: number; y: number }) => ({ x: p.x / DPR, y: p.y / DPR });
    (window as unknown as Record<string, unknown>).__tls = {
      state: () => ({
        dpr: DPR, reducedMotion: REDUCED_MOTION, lang: LANG, loadErrors: this.loadErrors, textureSize: this.grid.textureSize,
        canvas: [this.scale.width, this.scale.height], started: this.started, freeMode: this.freeMode, fxLevel: this.fx.level,
        replays: this.replays, perf: this.perf.stats, volume: this.sfx.volume, objects: this.children.length, tweens: this.tweens.getTweens().length, audioLoaded: this.sfx.loadedCount, audioFailed: this.sfx.failed, caption: this.track.captionText,
        busy: this.busy, rounds: this.rounds, autoLeft: this.autoLeft, info: this.info.isOpen, balance: this.service.balance, bet: this.service.bet,
        modal: this.bonus.open, dialog: this.modal.open, mismatches: this.presenter.mismatches, distortion: this.presenter.distortion,
        grid: this.grid.snapshot(), history: this.service.history().slice(0, 5),
        doors: this.bonus.doorPoints().map(css),
        texts: this.hud.texts().map((r) => ({ ...r, x: r.x / DPR, y: r.y / DPR, w: r.w / DPR, h: r.h / DPR })),
        buttons: this.hud.buttons().map((r) => ({ ...r, x: r.x / DPR, y: r.y / DPR, w: r.w / DPR, h: r.h / DPR })),
      }),
      spin: () => void this.playRound('spin'),
      buy: () => void this.playRound('buy'),
      auto: () => this.toggleAuto(),
      banner: () => this.banner.current,
    };
  }

  private get overlayOpen(): boolean { return this.modal.open || this.bonus.open || !this.started; }

  override update(_time: number, delta: number): void {
    if (!this.busy) return;
    this.perf.add(delta);
    // Effect budget: step down when the device cannot hold the frame rate.
    const st = this.perf.stats;
    if (!this.fxPinned && st.frames > 0 && st.frames % 240 === 0 && this.fx.level > 0) {
      if (st.fps < 32) this.fx.level = 0; else if (st.fps < 45 && this.fx.level === 2) this.fx.level = 1;
    }
  }

  private setSpeed(s: number): void { this.tweens.timeScale = s; this.time.timeScale = s; }

  /** Start screen over the preview grid: large logo and one clear action. */
  private showStart(): void {
    const { width: w, height: h } = this.scale;
    const u = Math.min(w, h) / 390;
    const dim = this.add.rectangle(0, 0, w, h, 0x05070c, 0.8).setOrigin(0).setInteractive();
    const items: Phaser.GameObjects.GameObject[] = [dim];
    if (this.textures.exists('logo')) {
      const logo = this.add.image(w / 2, h * 0.36, 'logo');
      logo.setScale(Math.min((w * 0.84) / logo.width, (h * 0.26) / logo.height));
      items.push(logo);
    } else items.push(this.add.text(w / 2, h * 0.36, 'TEMPLE OF THE LOST SUN', { fontFamily: DISPLAY, fontSize: `${Math.round(26 * u)}px`, color: COLOR.win, align: 'center', wordWrap: { width: w * 0.86 } }).setOrigin(0.5));
    const tag = this.add.text(w / 2, h * 0.52, 'EVERY RELIC REVEALS A SECRET.', { fontFamily: DISPLAY, fontSize: `${Math.round(12.5 * u)}px`, color: COLOR.text }).setOrigin(0.5);
    const go = this.add.text(w / 2, h * 0.64, t('tapStart'), { fontFamily: DISPLAY, fontSize: `${Math.round(22 * u)}px`, color: COLOR.win }).setOrigin(0.5);
    const demo = this.add.text(w / 2, h * 0.75, t('demoLong'), { fontFamily: TEXT, fontSize: `${Math.round(12 * u)}px`, color: COLOR.dim }).setOrigin(0.5);
    items.push(tag, go, demo);
    if (!REDUCED_MOTION) this.tweens.add({ targets: go, alpha: 0.45, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    this.startLayer = this.add.container(0, 0, items).setDepth(DEPTH.start);
    dim.once('pointerup', () => this.dismissStart());
  }

  private dismissStart(): void {
    if (this.started) return;
    this.started = true;
    this.sfx.unlock();
    const layer = this.startLayer;
    this.startLayer = null;
    if (layer) void tween(this, { targets: layer, alpha: 0, duration: 260 }).then(() => layer.destroy());
  }

  /** Scenery for base game or free spins (cross-fade of the two backgrounds). */
  private setMode(free: boolean): void {
    this.freeMode = free;
    this.sfx.music(free ? 'free' : 'base');
    if (this.bgFree) this.tweens.add({ targets: this.bgFree, alpha: free ? 1 : 0, duration: REDUCED_MOTION ? 0 : 500 });
    // The temple interior is brighter than the jungle: a stronger veil keeps track and status bar as readable as in the base game.
    if (this.shade) this.tweens.add({ targets: this.shade, fillAlpha: free ? 0.5 : 0.3, duration: REDUCED_MOTION ? 0 : 500 });
  }

  private relayout(): void {
    this.pendingLayout = false;
    const { width, height } = this.scale;
    const cfg = this.service.config;
    const l = computeLayout(width, height, cfg.cols, cfg.rows);
    for (const [img, base] of [[this.bg, 'bg'], [this.bgFree, 'bgfs']] as const) {
      if (!img) continue;
      img.setTexture(`${base}_${l.portrait ? 'portrait' : 'landscape'}`);
      // Cover the screen, anchored to the centre.
      img.setPosition(width / 2, height / 2).setScale(Math.max(width / img.width, height / img.height));
    }
    this.shade?.setSize(width, height);
    this.grid.layout(l.grid.x, l.grid.y, l.grid.cell);
    this.track.layout(l.track, l.ui, l.portrait ? l.mult.w : 0);
    this.hud.layout(l);
    // Free space under the grid: preview note before the first spin, afterwards the maximum win (or the feature win).
    const gridBottom = l.grid.y + l.grid.cell * (cfg.rows + FRAME.bottom);
    const gap = l.portrait ? l.winBar.y - gridBottom : 0;
    const noteY = l.portrait ? gridBottom + gap / 2 : l.status.y + l.status.h / 2;
    this.previewNote?.setFontSize(`${Math.max(10 * DPR, Math.round(11 * l.ui))}px`).setOrigin(0.5).setPosition(width / 2, noteY).setVisible(!this.played && gap >= 20 * l.ui);
    this.hud.setFooter(t('maxWinNote', { x: `${(cfg.maxWin / 100).toLocaleString('en-US')}×` }), width / 2, noteY, this.played && (l.portrait ? gap >= 20 * l.ui : true));
    if (!l.portrait) this.hud.setFooter(t('maxWinNote', { x: `${(cfg.maxWin / 100).toLocaleString('en-US')}×` }), l.status.x + l.status.w * 0.5, noteY, this.played);
    this.footerOk = l.portrait ? gap >= 20 * l.ui : true;
    this.fx.ambient(true);
    // Living scenery: sunlight breathing behind the temple's sun disc and a very slow drift of the background.
    this.fx.sunShafts(width / 2, l.portrait ? height * 0.07 : height * 0.02, Math.max(width, height) * 0.55);
    this.drift?.stop();
    if (!REDUCED_MOTION && this.bg) {
      const targets = [this.bg, ...(this.bgFree ? [this.bgFree] : [])];
      const base = this.bg.scale;
      targets.forEach((t) => t.setScale(base * 1.0));
      this.drift = this.tweens.add({ targets, scale: base * 1.035, duration: 16000, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    }
    if (this.startLayer) { this.startLayer.destroy(); this.startLayer = null; this.showStart(); }
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
    this.sfx.play('button');
    this.service.setBet(levels[i]);
    this.refreshHud();
  }

  private async pickBet(): Promise<void> {
    if (this.busy || this.autoLeft > 0 || this.overlayOpen) return;
    const levels = this.service.betLevels;
    const i = await this.modal.choose(t('betTitle'), levels.map((b) => formatMoney(b)), levels.indexOf(this.service.bet));
    if (i >= 0 && !this.busy) { this.sfx.play('button'); this.service.setBet(levels[i]); this.refreshHud(); }
  }

  private toggleAuto(): void {
    if (this.autoLeft > 0) { this.autoLeft = 0; this.refreshHud(); return; }
    if (this.busy || this.overlayOpen || !this.service.canStart('spin')) return;
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
    if (this.busy || this.autoLeft > 0 || this.overlayOpen || !this.service.canStart('buy')) return;
    const fb = this.service.config.featureBuy;
    const price = formatMoney(this.service.stake('buy'));
    const ok = await this.modal.confirm(
      t('buyTitle'),
      t('buyBody', { price, x: fb.price / 100, spins: fb.spins, camp: fb.baseCamp, rtp: LANG === 'de' ? MEASURED.buyRtp : MEASURED.buyRtp.replace(',', '.') }),
      t('buyYes', { price }), t('cancel'),
    );
    if (ok) await this.playRound('buy');
  }

  /** After the first round the preview note makes way for the maximum-win line. */
  private markPlayed(): void {
    this.previewNote?.setVisible(false);
    if (!this.played) { this.played = true; this.hud.setFooter(t('maxWinNote', { x: `${(this.service.config.maxWin / 100).toLocaleString('en-US')}×` }), 0, 0, this.footerOk); }
  }

  private endRound(): void {
    this.setSpeed(this.baseSpeed);
    this.busy = false;
    if (this.pendingLayout) this.relayout();
    this.refreshHud();
  }

  /** Shows a finished round again from its seed and picks. Display only: the service and the balance are not touched. */
  private async playReplay(entry: HistoryEntry): Promise<void> {
    if (this.busy || this.overlayOpen) return;
    this.busy = true;
    this.markPlayed();
    this.hud.setBusy(true, false, false);
    this.presenter.beginRound(entry.bet);
    await this.banner.show(t('replay'), 500);
    await this.presenter.play(replay(this.service.config, entry));
    this.replays++;
    this.endRound();
  }

  private async playRound(kind: RoundKind): Promise<void> {
    if (this.busy || this.overlayOpen || !this.service.canStart(kind)) return;
    this.busy = true;
    this.markPlayed();
    const before = this.service.balance;
    const stake = this.service.stake(kind);
    this.presenter.beginRound(this.service.bet);
    let step = this.service.start(kind);
    // The win is credited by the service at once; the display follows the presentation.
    this.hud.setBalance(before - stake);
    this.hud.setBusy(true, false, false, this.autoLeft);
    this.hud.spinKick();
    await this.presenter.play(step.events);
    while (!step.done) {
      this.setSpeed(this.baseSpeed);
      const chamber = await this.bonus.waitPick(step.availableChambers, this.presenter.pickedInBonus);
      step = this.service.pick(chamber);
      await this.presenter.play(step.events);
    }
    this.rounds++;
    this.endRound();
  }
}
