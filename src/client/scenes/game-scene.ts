import Phaser from 'phaser';
import { CONFIG_V1 } from '../../engine/index.js';
import { LocalGameService, replay, type GameService, type HistoryEntry, type RoundKind } from '../../session/game-service.js';
import { tween } from '../anim.js';
import { Sfx } from '../audio/sfx.js';
import { DPR, REDUCED_MOTION, DEV_TOOLS } from '../env.js';
import { Fx } from '../fx.js';
import { LANG, storeLang, t } from '../i18n.js';
import { FRAME, computeLayout, formatMoney, previewGrid } from '../layout.js';
import { PerfMeter, perfVerdict } from '../perf.js';
import { Presenter } from '../presentation/presenter.js';
import { AUTO_NOTE, MEASURED, historyHtml, paytableHtml, perfHtml, rulesHtml, settingsHtml } from '../rules-text.js';
import { createPlaceholderTextures, preloadReferenceArt } from '../textures.js';
import { COLOR, DEPTH, DISPLAY, TEXT } from '../theme.js';
import { MAX_SCENE_SCALE, SPEED_SCALE, parseSpeedMode, type SpeedMode } from '../timing.js';
import { InfoPanel } from '../ui/info-panel.js';
import { BonusView } from '../views/bonus-view.js';
import { GridView } from '../views/grid-view.js';
import { Hud } from '../views/hud.js';
import { Banner, Modal } from '../views/overlays.js';
import { TrackView } from '../views/track-view.js';

const SPEED_KEY = 'tls.speed';
/** Rounds per autoplay run (demo only). It stops early when a round cannot be paid; a chamber pick always waits for the player. */
const AUTO_ROUNDS = AUTO_NOTE;

/**
 * Prepared rounds for the presentation mode. Seeds were found by searching ordinary engine results
 * of configuration 1.0.0; nothing about the outcome is set here except the seed and the chamber pick.
 */
const DEMO_ROUNDS: { label: 'demo1' | 'demo2' | 'demo3' | 'demo4'; entry: Omit<HistoryEntry, 'configVersion'> }[] = [
  { label: 'demo1', entry: { seed: '5', kind: 'spin', bet: 100, stake: 100, picks: [], win: 220 } },
  { label: 'demo2', entry: { seed: '57', kind: 'spin', bet: 100, stake: 100, picks: [], win: 1130 } },
  { label: 'demo3', entry: { seed: '697', kind: 'spin', bet: 100, stake: 100, picks: [], win: 3880 } },
  { label: 'demo4', entry: { seed: '1168', kind: 'spin', bet: 100, stake: 100, picks: [0], win: 4230 } },
];

/** Seed used by the presentation mode: its ordinary result reaches the temple in the base spin. */
const PRESENTATION_SEED = 1168n;

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
  /** Chosen speed mode (a harmless display preference, stored in the browser). */
  private speedMode: SpeedMode = 'normal';
  /** Test override of the time scale (?fast=n); 0 = none. */
  private testScale = 0;
  /** True while the player has asked to rush the round that is being shown. */
  private rushing = false;
  private sceneCap = false;
  /** Presentation mode: 0 = off, otherwise the number of the prepared round being shown. */
  private demoStep = 0;
  private demoStop = false;
  private demoQueued = false;
  private demoChip: Phaser.GameObjects.Text | null = null;
  /** Presentation mode (demo build only): fixed seed, permanent label. */
  private presentation = false;
  private presentChip: Phaser.GameObjects.Text | null = null;
  private tension = false;
  private pendingLayout = false;
  private drift: Phaser.Tweens.Tween | null = null;
  /** True once the player chose an effect level; the automatic step-down then stays out of the way. */
  private fxPinned = false;
  private played = false;

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
    const userParams = new URLSearchParams(window.location.search);
    // Developer and presentation parameters exist only in the demo build (see DEV_TOOLS).
    const params = DEV_TOOLS ? userParams : new URLSearchParams('');
    // ?present=temple: presentation mode. Every round uses one fixed seed whose ordinary result
    // reaches the temple, so the complete Temple Bonus can be shown on demand. The engine,
    // its configuration and all probabilities are untouched; only the seed is not random.
    this.presentation = params.get('present') === 'temple';
    // ?seed=n makes the demo deterministic (testing and replays only).
    const seedParam = this.presentation ? null : params.get('seed');
    let next = seedParam !== null ? BigInt(seedParam) : null;
    this.service = new LocalGameService(CONFIG_V1, {
      balance: Number(params.get('balance') ?? 100_000),
      nextSeed: this.presentation ? () => PRESENTATION_SEED : next !== null ? () => next!++ : undefined,
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
      spin: () => { if (this.busy) this.rush(); else void this.playRound('spin'); },
      speed: (mode) => this.setSpeedMode(mode),
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
      normalSpeed: () => { this.sceneCap = true; this.applySpeed(); },
      resumeSpeed: () => { this.sceneCap = false; this.applySpeed(); },
      setTension: (on) => { this.tension = on; this.applyShade(); },
      scale: () => this.time.timeScale,
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
      { id: 'settings', label: LANG === 'de' ? 'Einstellungen' : 'Settings', html: () => settingsHtml({ volume: this.sfx.volume, muted: this.sfx.muted, fxLevel: this.fx.level, reducedMotion: REDUCED_MOTION, demo: this.demoStep > 0, tools: DEV_TOOLS && !this.presentation }, LANG) },
    ], LANG === 'de' ? 'Schliessen' : 'Close');
    this.info.onClose = () => { this.input.enabled = true; };
    this.info.onAction = (action, value) => {
      if (action === 'perf-reset') { this.perf.reset(); this.info.refresh(); }
      if (action === 'volume') { this.sfx.setVolume(Number(value) / 100); this.sfx.unlock(); this.sfx.play('button'); }
      if (action === 'mute') { this.sfx.setMuted(!this.sfx.muted); this.hud.setMuted(this.sfx.muted); this.info.refresh(); }
      if (action === 'fx') { this.fx.level = (Number(value) as 0 | 1 | 2); this.fxPinned = true; this.relayout(); this.info.refresh(); }
      if (action === 'lang') { storeLang(value === 'de' ? 'de' : 'en'); window.location.reload(); }
      if (action === 'demo' && DEV_TOOLS && !this.presentation) { this.info.close(); if (this.demoStep > 0) this.demoStop = true; else void this.runDemo(); }
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
      if (this.busy && !this.overlayOpen && over.length === 0) this.rush();
    });
    this.input.keyboard?.on('keydown-SPACE', () => {
      if (this.info.isOpen) return;
      if (!this.started) { this.dismissStart(); return; }
      if (this.busy) this.rush(); else if (this.autoLeft === 0) void this.playRound('spin');
    });
    if (params.get('fast') !== null) this.testScale = Number(params.get('fast')) || 4;
    let stored: string | null = null;
    try { stored = window.localStorage.getItem(SPEED_KEY); } catch { /* storage unavailable */ }
    // Normal is the default on first start; ?speed= sets the mode for demonstrations and tests.
    this.speedMode = parseSpeedMode(userParams.get('speed')) ?? parseSpeedMode(stored) ?? 'normal';
    this.hud.setSpeedMode(this.speedMode);
    this.applySpeed();
    if (params.get('start') === '0' || seedParam !== null) { this.started = true; } else this.showStart();
    this.demoQueued = !this.presentation && params.get('demo') === '1';
    if (this.presentation) {
      this.presentChip = this.add.text(0, 0, t('presentChip'), {
        fontFamily: DISPLAY, fontSize: '12px', color: '#2a1703', backgroundColor: '#f2c14e', padding: { x: 8 * DPR, y: 2 * DPR },
      }).setOrigin(0.5, 1).setDepth(DEPTH.start + 1);
      this.relayout();
    }
    if (this.demoQueued && this.started) { this.demoQueued = false; void this.runDemo(); }

    // Read-only hook for automated end-to-end tests.
    const css = (p: { x: number; y: number }) => ({ x: p.x / DPR, y: p.y / DPR });
    if (DEV_TOOLS) (window as unknown as Record<string, unknown>).__tls = {
      state: () => ({
        dpr: DPR, reducedMotion: REDUCED_MOTION, lang: LANG, loadErrors: this.loadErrors, textureSize: this.grid.textureSize,
        canvas: [this.scale.width, this.scale.height], started: this.started, freeMode: this.freeMode, fxLevel: this.fx.level,
        speedMode: this.speedMode, timeScale: this.time.timeScale, spinLog: this.presenter.spinLog.slice(-40), outroMs: this.presenter.outroMs,
        replays: this.replays, perf: this.perf.stats, volume: this.sfx.volume, objects: this.children.length, tweens: this.tweens.getTweens().length, audioLoaded: this.sfx.loadedCount, audioFailed: this.sfx.failed, caption: this.track.captionText,
        demo: this.demoStep, presentation: this.presentation, presentChip: this.presentChip?.text ?? '', tension: this.tension, startButton: this.startPoint ? css(this.startPoint) : null,
        busy: this.busy, rounds: this.rounds, autoLeft: this.autoLeft, info: this.info.isOpen, balance: this.service.balance, bet: this.service.bet,
        modal: this.bonus.open, dialog: this.modal.open, mismatches: this.presenter.mismatches, distortion: this.presenter.distortion,
        grid: this.grid.snapshot(), field: this.grid.fieldCount(), history: this.service.history().slice(0, 5),
        doors: this.bonus.doorPoints().map(css),
        texts: this.hud.texts().map((r) => ({ ...r, x: r.x / DPR, y: r.y / DPR, w: r.w / DPR, h: r.h / DPR })),
        buttons: this.hud.buttons().map((r) => ({ ...r, x: r.x / DPR, y: r.y / DPR, w: r.w / DPR, h: r.h / DPR })),
      }),
      spin: () => void this.playRound('spin'),
      buy: () => void this.playRound('buy'),
      auto: () => this.toggleAuto(),
      banner: () => this.banner.current,
      demo: () => void this.runDemo(),
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

  /**
   * One place decides the time scale: the chosen mode, a temporary rush of the
   * current round, and the cap for scenes whose results must be read (Temple
   * Bonus, feature summary). Only presentation is scaled; the round is already decided.
   */
  private applySpeed(): void {
    let s = this.testScale > 0 ? this.testScale : SPEED_SCALE[this.speedMode];
    if (this.rushing && this.testScale === 0) s = Math.max(s, SPEED_SCALE.skip);
    if (this.sceneCap && this.testScale === 0) s = Math.min(s, MAX_SCENE_SCALE);
    this.setSpeed(s);
  }

  /** Changing the mode takes effect at once, also in the middle of an animation. */
  private setSpeedMode(mode: SpeedMode): void {
    this.speedMode = mode;
    try { window.localStorage.setItem(SPEED_KEY, mode); } catch { /* storage unavailable */ }
    this.hud.setSpeedMode(mode);
    this.sfx.play('button');
    this.applySpeed();
  }

  /** Tap on the sun disc or the play field during a round: show the rest of this round at skip pace. */
  private rush(): void { this.rushing = true; this.applySpeed(); }

  private startPoint: { x: number; y: number } | null = null;

  /** Title screen over the preview grid: logo, claim, one clear start button, demo notice. */
  private showStart(): void {
    const { width: w, height: h } = this.scale;
    const u = Math.min(w, h) / 390;
    const portrait = h >= w;
    const dim = this.add.rectangle(0, 0, w, h, 0x05070c, 0.82).setOrigin(0).setInteractive();
    const items: Phaser.GameObjects.GameObject[] = [dim];
    const logoY = h * (portrait ? 0.33 : 0.3);
    let logoBottom = logoY + 20 * u;
    if (this.textures.exists('logo')) {
      const glow = this.add.image(w / 2, logoY, 'fx_glow').setTint(COLOR.goldBright).setAlpha(0.22).setBlendMode(Phaser.BlendModes.ADD);
      const logo = this.add.image(w / 2, logoY, 'logo');
      logo.setScale(Math.min((w * (portrait ? 0.9 : 0.5)) / logo.width, (h * (portrait ? 0.3 : 0.4)) / logo.height));
      glow.setDisplaySize(logo.displayWidth * 1.25, logo.displayHeight * 1.5);
      logoBottom = logoY + logo.displayHeight / 2;
      items.push(glow, logo);
      if (!REDUCED_MOTION) this.tweens.add({ targets: glow, alpha: 0.38, duration: 2200, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    } else items.push(this.add.text(w / 2, logoY, 'TEMPLE OF THE LOST SUN', { fontFamily: DISPLAY, fontSize: `${Math.round(26 * u)}px`, color: COLOR.win, align: 'center', wordWrap: { width: w * 0.86 } }).setOrigin(0.5));
    const tagY = logoBottom + 20 * u;
    const tag = this.add.text(w / 2, tagY, 'EVERY RELIC REVEALS A SECRET.', { fontFamily: DISPLAY, fontSize: `${Math.round(13 * u)}px`, color: '#f3e3b4' }).setOrigin(0.5).setLetterSpacing(1.5 * u);
    const lineW = Math.min(w * 0.5, tag.width * 0.8);
    const rule = this.add.rectangle(w / 2, tagY + 16 * u, lineW, Math.max(1, Math.round(u)), COLOR.goldBright, 0.55);
    // The start button: a gold pill, at least 56 CSS pixels high.
    const bw = Math.min(w * 0.62, 260 * u, 300 * DPR), bh = Math.min(Math.max(56 * DPR, 58 * u), 68 * DPR);
    const by = Math.min(h * 0.86 - bh, tagY + 62 * u + bh / 2);
    const g = this.add.graphics();
    g.fillStyle(0x05070c, 0.5).fillRoundedRect(w / 2 - bw / 2 + 2 * u, by - bh / 2 + 4 * u, bw, bh, bh / 2);
    g.fillStyle(0xd9a233, 1).fillRoundedRect(w / 2 - bw / 2, by - bh / 2, bw, bh, bh / 2);
    // Lighter upper band for a soft metallic sheen (plain fills: gradients on rounded shapes show seams).
    g.fillStyle(0xf6d27a, 1).fillRoundedRect(w / 2 - bw / 2 + bh * 0.12, by - bh / 2 + bh * 0.1, bw - bh * 0.24, bh * 0.46, bh * 0.23);
    g.lineStyle(Math.max(2, 2 * u), 0xfff6d6, 0.9).strokeRoundedRect(w / 2 - bw / 2, by - bh / 2, bw, bh, bh / 2);
    const go = this.add.text(w / 2, by, t('start'), { fontFamily: DISPLAY, fontSize: `${Math.round(Math.min(24 * u, bh * 0.42))}px`, color: '#2a1703' }).setOrigin(0.5).setLetterSpacing(3 * DPR);
    const button = this.add.container(0, 0, [g, go]);
    const demo = this.add.text(w / 2, by + bh / 2 + 22 * u, t('demoLong'), { fontFamily: TEXT, fontSize: `${Math.round(12 * u)}px`, color: COLOR.dim }).setOrigin(0.5);
    items.push(tag, rule, button, demo);
    if (!REDUCED_MOTION) {
      // Short entrance: logo first, then claim and button.
      [tag, rule, button, demo].forEach((o, n) => { (o as unknown as { alpha: number }).alpha = 0; this.tweens.add({ targets: o, alpha: 1, duration: 320, delay: 180 + n * 90 }); });
      this.tweens.add({ targets: go, scale: 1.05, duration: 1000, yoyo: true, repeat: -1, ease: 'Sine.easeInOut', delay: 700 });
    }
    this.startPoint = { x: w / 2, y: by };
    this.startLayer = this.add.container(0, 0, items).setDepth(DEPTH.start);
    // The whole screen starts the game (the button shows where); the button itself is the obvious target.
    dim.once('pointerup', () => this.dismissStart());
  }

  private dismissStart(): void {
    if (this.started) return;
    this.started = true;
    this.startPoint = null;
    this.sfx.unlock();
    this.sfx.play('button');
    const layer = this.startLayer;
    this.startLayer = null;
    if (layer) {
      const { width: w, height: h } = this.scale;
      // Short, calm transition: a warm flash while the title fades and the play field takes over.
      if (!REDUCED_MOTION) this.fx.flash(w / 2, h * 0.4, COLOR.goldBright, Math.max(w, h) * 0.6, 520);
      void tween(this, { targets: layer, alpha: 0, duration: REDUCED_MOTION ? 160 : 420, ease: 'Sine.easeIn' }).then(() => layer.destroy());
    }
    if (this.demoQueued) { this.demoQueued = false; this.time.delayedCall(500, () => void this.runDemo()); }
  }

  /** Veil over the scenery: stronger in the temple, and a little stronger still for the last two free spins. */
  private applyShade(): void {
    if (!this.shade) return;
    const a = (this.freeMode ? 0.5 : 0.3) + (this.tension ? 0.16 : 0);
    this.tweens.add({ targets: this.shade, fillAlpha: a, duration: REDUCED_MOTION ? 0 : 500 });
  }

  /** Scenery for base game or free spins (cross-fade of the two backgrounds). */
  private setMode(free: boolean): void {
    this.freeMode = free;
    this.sfx.music(free ? 'free' : 'base');
    if (this.bgFree) this.tweens.add({ targets: this.bgFree, alpha: free ? 1 : 0, duration: REDUCED_MOTION ? 0 : 500 });
    // The temple interior is brighter than the jungle: a stronger veil keeps track and status bar as readable as in the base game.
    this.applyShade();
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
    this.presentChip?.setFontSize(Math.round(Math.max(10 * DPR, 11 * l.ui))).setPosition(width / 2, height - 1 * DPR);
    this.demoChip?.setPosition(l.grid.x + (l.grid.cell * cfg.cols) / 2, l.grid.y - l.grid.cell * 0.2).setFontSize(Math.round(Math.max(11 * DPR, l.grid.cell * 0.2)));
    this.grid.layout(l.grid.x, l.grid.y, l.grid.cell);
    this.track.layout(l.track, l.ui, l.portrait ? l.mult.w : 0);
    this.hud.layout(l);
    // Beside the speed selector: the preview note before the first spin, afterwards the maximum win (or the feature win).
    this.previewNote?.setVisible(false);
    this.hud.setFooterText(this.played ? t('maxWinNote', { x: `${(cfg.maxWin / 100).toLocaleString('en-US')}×` }) : t('preview'));
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
    this.played = true;
  }

  private endRound(): void {
    this.rushing = false; this.sceneCap = false;
    this.applySpeed();
    this.busy = false;
    if (this.pendingLayout) this.relayout();
    this.refreshHud();
  }

  /** Shows a finished round again from its seed and picks. Display only: the service and the balance are not touched. */
  private async playReplay(entry: HistoryEntry, label = t('replay')): Promise<void> {
    if (this.busy || this.overlayOpen) return;
    this.busy = true;
    this.markPlayed();
    this.hud.setBusy(true, false, false);
    this.hud.setBalance(this.service.balance);
    this.presenter.beginRound(entry.bet);
    await this.banner.show(label, label === t('replay') ? 500 : 1100);
    await this.presenter.play(replay(this.service.config, entry));
    this.replays++;
    this.endRound();
  }

  /**
   * Presentation mode: four prepared rounds with fixed seeds, shown one after another.
   * Each one is computed by the engine exactly like any other round (same path as a history
   * replay), is labelled as a demonstration and changes neither balance nor history.
   */
  private async runDemo(): Promise<void> {
    if (this.busy || this.overlayOpen || this.autoLeft > 0 || this.demoStep > 0) return;
    this.demoStop = false;
    const { width: w } = this.scale;
    this.demoChip = this.add.text(w / 2, 0, t('demoTitle'), {
      fontFamily: DISPLAY, fontSize: '14px', color: '#2a1703', backgroundColor: '#f2c14e', padding: { x: 10 * DPR, y: 3 * DPR },
    }).setOrigin(0.5).setDepth(DEPTH.start - 1);
    this.relayout();
    await this.banner.show(`${t('demoTitle')}\n${t('demoIntro')}`, 1500);
    for (let i = 0; i < DEMO_ROUNDS.length && !this.demoStop; i++) {
      this.demoStep = i + 1;
      const label = t('demoStep', { i: i + 1, n: DEMO_ROUNDS.length, what: t(DEMO_ROUNDS[i]!.label) });
      this.demoChip.setText(label);
      await this.playReplay({ ...DEMO_ROUNDS[i]!.entry, configVersion: this.service.config.version }, label);
      if (i < DEMO_ROUNDS.length - 1 && !this.demoStop) await new Promise<void>((r) => this.time.delayedCall(900, () => r()));
    }
    this.demoStep = 0;
    this.demoChip.destroy(); this.demoChip = null;
    this.grid.show(previewGrid(this.service.config.cols, this.service.config.rows));
    this.track.reset(0, 0);
    this.hud.setWin(0, false);
    this.refreshHud();
    await this.banner.show(t('demoDone'), 1400);
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
      const chamber = await this.bonus.waitPick(step.availableChambers, this.presenter.pickedInBonus);
      step = this.service.pick(chamber);
      await this.presenter.play(step.events);
    }
    this.rounds++;
    this.endRound();
  }
}
