import Phaser from 'phaser';
import { DPR, REDUCED_MOTION } from '../env.js';
import type { Fx } from '../fx.js';
import { t } from '../i18n.js';
import { formatMoney, type Layout } from '../layout.js';
import { COLOR, DEPTH, DISPLAY, TEXT } from '../theme.js';
import { Button } from './button.js';
import { countUp } from './overlays.js';

export interface HudActions {
  spin(): void;
  buy(): void;
  betDown(): void;
  betUp(): void;
  info(): void;
  mute(): void;
  auto(): void;
}

/**
 * Status bar, multiplier medallion, balance/win bar and controls.
 * Pure display plus button callbacks; every number comes from the caller.
 */
export class Hud {
  private readonly plates: Phaser.GameObjects.Graphics;
  private readonly logo: Phaser.GameObjects.Image | null;
  private readonly title: Phaser.GameObjects.Text;
  private readonly demo: Phaser.GameObjects.Text;
  private readonly fs: Phaser.GameObjects.Text;
  private readonly multBig: Phaser.GameObjects.Text;
  private readonly multSmall: Phaser.GameObjects.Text;
  private readonly balLabel: Phaser.GameObjects.Text;
  private readonly balance: Phaser.GameObjects.Text;
  private readonly winLabel: Phaser.GameObjects.Text;
  private readonly win: Phaser.GameObjects.Text;
  private readonly betLabel: Phaser.GameObjects.Text;
  private readonly bet: Phaser.GameObjects.Text;
  readonly spinBtn: Button;
  readonly buyBtn: Button;
  readonly minus: Button;
  readonly plus: Button;
  readonly infoBtn: Button;
  readonly autoBtn: Button;
  readonly muteBtn: Button;
  private l: Layout | null = null;
  private fsBox = { x: 0, y: 0, w: 0, h: 0 };
  private readonly fsPlate: Phaser.GameObjects.Graphics;
  private shownWin = 0;
  private shownMult = 1;
  private freeMode = false;
  private busy = false;

  constructor(private readonly scene: Phaser.Scene, actions: HudActions, private readonly fx: Fx) {
    const txt = (text: string, font: string, color: string) =>
      scene.add.text(0, 0, text, { fontFamily: font, fontSize: '16px', color }).setDepth(DEPTH.hud);
    this.plates = scene.add.graphics().setDepth(DEPTH.plate);
    this.fsPlate = scene.add.graphics().setDepth(DEPTH.hud - 1);
    this.logo = scene.textures.exists('logo') ? scene.add.image(0, 0, 'logo').setOrigin(0, 0.5).setDepth(DEPTH.hud) : null;
    this.title = txt('TEMPLE OF THE LOST SUN', DISPLAY, COLOR.win).setOrigin(0, 0.5).setVisible(this.logo === null);
    this.demo = txt(t('demo'), TEXT, COLOR.dim).setOrigin(0, 0.5);
    this.fs = txt('', DISPLAY, COLOR.win).setOrigin(0.5);
    this.multBig = txt('×1', DISPLAY, COLOR.win).setOrigin(0.5);
    this.multSmall = txt('', TEXT, COLOR.text).setOrigin(0.5);
    this.balLabel = txt(t('balance'), TEXT, COLOR.dim).setOrigin(0, 0.5);
    this.balance = txt('', DISPLAY, COLOR.text).setOrigin(0, 0.5);
    this.winLabel = txt(t('win'), TEXT, COLOR.dim).setOrigin(1, 0.5);
    this.win = txt(formatMoney(0), DISPLAY, COLOR.win).setOrigin(1, 0.5);
    this.betLabel = txt(t('bet'), TEXT, COLOR.dim).setOrigin(0.5);
    this.bet = txt('', DISPLAY, COLOR.text).setOrigin(0.5);
    const b = (btn: Button) => btn.setDepth(DEPTH.hud);
    this.spinBtn = b(new Button(scene, 'SPIN', actions.spin));
    if (scene.textures.exists('spin')) this.spinBtn.asImage('spin'); else this.spinBtn.setAccent(COLOR.gold);
    this.buyBtn = b(new Button(scene, t('buy'), actions.buy)).setAccent(COLOR.turquoise);
    this.minus = b(new Button(scene, '', actions.betDown).asRound('minus'));
    this.plus = b(new Button(scene, '', actions.betUp).asRound('plus'));
    this.infoBtn = b(new Button(scene, '', actions.info).asRound('info'));
    this.muteBtn = b(new Button(scene, '', actions.mute).asRound('sound'));
    this.autoBtn = b(new Button(scene, t('auto'), actions.auto));
  }

  layout(l: Layout): void {
    this.l = l;
    const u = l.ui, s = l.status, c = l.controls, w = l.winBar, m = l.mult;
    const px = (n: number) => `${Math.max(10 * DPR, Math.round(n * u))}px`;
    const p = this.plates.clear();
    const plate = (r: { x: number; y: number; w: number; h: number }, radius: number, accent = false) => {
      p.fillStyle(0x070a11, 0.74).fillRoundedRect(r.x, r.y, r.w, r.h, radius * u);
      p.lineStyle(Math.max(1, DPR), accent ? COLOR.gold : COLOR.goldDark, accent ? 1 : 0.7).strokeRoundedRect(r.x, r.y, r.w, r.h, radius * u);
    };

    // Status bar: small logo, demo note; sound and info as round icon buttons on the right.
    const cy = s.y + s.h / 2, btn = 40 * u;
    this.infoBtn.layout(s.x + s.w - btn / 2, cy, btn, btn, 16 * u);
    this.muteBtn.layout(s.x + s.w - btn * 1.5 - 8 * u, cy, btn, btn, 16 * u);
    if (this.logo) {
      this.logo.setScale((s.h * 1.02) / this.logo.height).setPosition(s.x, cy);
      this.demo.setPosition(s.x + this.logo.displayWidth + 10 * u, cy);
    } else {
      this.title.setFontSize(px(15)).setPosition(s.x, cy);
      this.demo.setPosition(s.x + this.title.width + 10 * u, cy);
    }
    const freeLeft = this.demo.x, freeRight = this.muteBtn.x - btn / 2 - 8 * u;
    this.demo.setFontSize(px(10)).setWordWrapWidth(Math.max(40, freeRight - freeLeft)).setLineSpacing(-2);
    this.fs.setFontSize(px(14)).setPosition((freeLeft + freeRight) / 2, cy);
    this.fsBox = { x: freeLeft, w: freeRight - freeLeft, y: s.y + 3 * u, h: s.h - 6 * u };

    // Multiplier medallion.
    if (l.portrait) {
      // Pill inside the track panel: total on the left, its two parts on the right.
      p.fillStyle(0x1a1408, 0.95).fillRoundedRect(m.x, m.y, m.w, m.h, m.h / 2)
        .lineStyle(Math.max(2, 1.5 * DPR), COLOR.gold, 1).strokeRoundedRect(m.x, m.y, m.w, m.h, m.h / 2);
      this.multBig.setFontSize(px(25)).setOrigin(0.5).setPosition(m.x + m.w * 0.34, m.y + m.h / 2);
      this.multSmall.setFontSize(px(11.5)).setOrigin(0.5).setPosition(m.x + m.w * 0.74, m.y + m.h / 2);
    } else {
      plate(m, 16, true);
      this.multBig.setFontSize(px(34)).setOrigin(0.5).setPosition(m.x + m.w / 2, m.y + m.h * 0.42);
      this.multSmall.setFontSize(px(11.5)).setOrigin(0.5).setPosition(m.x + m.w / 2, m.y + m.h * 0.8);
    }

    // Balance and win.
    plate(w, 12);
    if (l.portrait) {
      const y = w.y + w.h / 2;
      this.balLabel.setFontSize(px(10)).setOrigin(0, 0.5).setPosition(w.x + 12 * u, y - w.h * 0.22);
      this.balance.setFontSize(px(15)).setOrigin(0, 0.5).setPosition(w.x + 12 * u, y + w.h * 0.16);
      this.winLabel.setFontSize(px(10)).setOrigin(1, 0.5).setPosition(w.x + w.w - 12 * u, y - w.h * 0.22);
      this.win.setFontSize(px(21)).setOrigin(1, 0.5).setPosition(w.x + w.w - 12 * u, y + w.h * 0.14);
    } else {
      const x = w.x + w.w / 2;
      this.winLabel.setFontSize(px(10)).setOrigin(0.5).setPosition(x, w.y + w.h * 0.14);
      this.win.setFontSize(px(22)).setOrigin(0.5).setPosition(x, w.y + w.h * 0.36);
      this.balLabel.setFontSize(px(10)).setOrigin(0.5).setPosition(x, w.y + w.h * 0.64);
      this.balance.setFontSize(px(15)).setOrigin(0.5).setPosition(x, w.y + w.h * 0.84);
    }

    // Controls: bet on the left, spin in the middle, auto and buy on the right.
    plate(c, 16);
    const my = c.y + c.h / 2, mx = c.x + c.w / 2;
    if (l.portrait) {
      const spin = Math.min(c.h - 14 * u, 92 * u), rb = 46 * u;
      this.spinBtn.layout(mx, my, spin, spin, 20 * u);
      const leftW = (c.w - spin) / 2, lx = c.x + leftW / 2;
      // Bet: label and amount on top, minus and plus side by side below; nothing overlaps the amount.
      this.betLabel.setFontSize(px(10)).setPosition(lx, c.y + 16 * u);
      this.bet.setFontSize(px(17)).setPosition(lx, c.y + 34 * u);
      this.minus.layout(lx - rb * 0.62, c.y + c.h - 10 * u - rb / 2, rb, rb, 18 * u);
      this.plus.layout(lx + rb * 0.62, c.y + c.h - 10 * u - rb / 2, rb, rb, 18 * u);
      const rx = c.x + c.w - leftW / 2, bw = leftW - 16 * u;
      this.autoBtn.layout(rx, my - 27 * u, bw, 46 * u, 13 * u);
      this.buyBtn.layout(rx, my + 27 * u, bw, 46 * u, 9.5 * u);
    } else {
      const spin = Math.min(c.h - 8 * u, 78 * u), rb = 46 * u;
      this.spinBtn.layout(mx, my, spin, spin, 20 * u);
      const lx = c.x + c.w * 0.2;
      this.betLabel.setFontSize(px(10)).setPosition(lx, my - rb * 0.72);
      this.minus.layout(lx - 78 * u, my + 4 * u, rb, rb, 18 * u);
      this.plus.layout(lx + 78 * u, my + 4 * u, rb, rb, 18 * u);
      this.bet.setFontSize(px(15)).setPosition(lx, my + 4 * u);
      this.autoBtn.layout(c.x + c.w * 0.68, my, 96 * u, 50 * u, 13 * u);
      this.buyBtn.layout(c.x + c.w * 0.87, my, 150 * u, 54 * u, 10.5 * u);
    }
    this.applyFs();
  }

  setBalance(minor: number): void { this.balance.setText(formatMoney(minor)); }

  setBet(minor: number, buyPrice: number, buyEnabled: boolean): void {
    this.bet.setText(formatMoney(minor));
    this.buyBtn.setText(t('buy'), formatMoney(buyPrice)).setVisible(buyEnabled);
  }

  /** Shows the win; with `animate` it counts up from the value shown before. The final text is always exactly `minor`. */
  setWin(minor: number, animate = false): void {
    const from = this.shownWin;
    this.shownWin = minor;
    if (!animate || REDUCED_MOTION || minor <= from) { this.win.setText(formatMoney(minor)); return; }
    const span = minor - from;
    void countUp(this.scene, span, Math.min(700, 260 + span / 4), (v) => {
      if (this.shownWin === minor) this.win.setText(formatMoney(from + Math.floor(v)));
    }).then(() => { if (this.shownWin === minor) this.win.setText(formatMoney(minor)); });
    this.scene.tweens.add({ targets: this.win, scale: 1.12, duration: 110, yoyo: true });
    if (this.l) this.fx.flash(this.win.x - (this.win.originX === 1 ? this.win.width / 2 : 0), this.win.y, COLOR.goldBright, this.l.winBar.h * 0.9, 300);
  }

  /** Multiplier M = base + sun bonus, with both parts readable. */
  setMultiplier(base: number, sun: number): void {
    const m = base + sun;
    this.multSmall.setText(sun > 0 ? `${base} + ${sun}` : '');
    this.multBig.setText(`×${m}`);
    if (m !== this.shownMult && this.l) {
      const up = m > this.shownMult;
      this.shownMult = m;
      if (up) {
        this.fx.flash(this.multBig.x, this.multBig.y, COLOR.goldBright, this.l.mult.w * 0.75, 380);
        this.fx.burst(this.multBig.x, this.multBig.y, COLOR.goldBright, 10);
        if (!REDUCED_MOTION) this.scene.tweens.add({ targets: this.multBig, scale: 1.3, duration: 130, yoyo: true, ease: 'Sine.easeOut' });
      }
    }
  }

  /** Free-spin counter in the status bar; an empty text returns to the demo note. */
  setFreeSpins(text: string): void {
    this.fs.setText(text);
    if (this.fsBox.w > 0 && this.fs.width > this.fsBox.w - this.fsBox.h * 0.6) this.fs.setText(text.replace(/^[A-Z ]+ (\d)/, 'FS $1'));
    const on = text !== '';
    if (on && !this.freeMode && !REDUCED_MOTION) this.scene.tweens.add({ targets: this.fs, scale: 1.25, duration: 140, yoyo: true });
    this.freeMode = on;
    this.applyFs();
  }

  /** Brief emphasis of the counter (retrigger). */
  pulseFreeSpins(): void {
    this.fx.flash(this.fs.x, this.fs.y, COLOR.goldBright, this.fs.width, 420);
    if (!REDUCED_MOTION) this.scene.tweens.add({ targets: this.fs, scale: 1.4, duration: 160, yoyo: true });
  }

  private applyFs(): void {
    this.fs.setVisible(this.freeMode);
    this.demo.setVisible(!this.freeMode);
    // The counter sits on its own gold-rimmed chip so it reads on any background.
    this.fsPlate.clear();
    if (this.freeMode && this.fsBox.w > 0) {
      const b = this.fsBox, w = Math.min(b.w, this.fs.width + b.h), x = b.x + (b.w - w) / 2;
      this.fsPlate.fillStyle(0x1a1408, 0.95).fillRoundedRect(x, b.y, w, b.h, b.h / 2)
        .lineStyle(Math.max(2, 1.5 * DPR), COLOR.gold, 1).strokeRoundedRect(x, b.y, w, b.h, b.h / 2);
    }
  }

  setMuted(muted: boolean): void { this.muteBtn.setGlyph(muted ? 'mute' : 'sound'); }

  /** `autoLeft` > 0 means autoplay is running; its button then stays active so it can be stopped. */
  setBusy(busy: boolean, canSpin: boolean, canBuy: boolean, autoLeft = 0): void {
    const auto = autoLeft > 0;
    this.busy = busy;
    // While a round is shown the spin button is the fast-forward control.
    this.spinBtn.setEnabled(busy || (!auto && canSpin));
    this.buyBtn.setEnabled(!busy && !auto && canBuy);
    this.minus.setEnabled(!busy && !auto);
    this.plus.setEnabled(!busy && !auto);
    this.infoBtn.setEnabled(!busy && !auto);
    this.autoBtn.setEnabled(auto || (!busy && canSpin)).setText(auto ? t('stop', { n: autoLeft }) : t('auto')).setAccent(auto ? COLOR.danger : COLOR.goldDark);
  }

  /** One turn of the sun disc when a round starts. */
  spinKick(): void {
    const face = this.spinBtn.face;
    if (face && !REDUCED_MOTION) { face.setAngle(0); this.scene.tweens.add({ targets: face, angle: 360, duration: 520, ease: 'Cubic.easeOut' }); }
  }

  get isBusy(): boolean { return this.busy; }
  get multiplierPoint(): { x: number; y: number } { return { x: this.multBig.x, y: this.multBig.y }; }
  get winPoint(): { x: number; y: number } { return { x: this.win.x, y: this.win.y }; }
  /** Texts for layout checks in end-to-end tests. */
  texts(): { name: string; x: number; y: number; w: number; h: number; text: string }[] {
    const list: [string, Phaser.GameObjects.Text][] = [['demo', this.demo], ['fs', this.fs], ['multBig', this.multBig], ['multSmall', this.multSmall], ['balLabel', this.balLabel], ['balance', this.balance], ['winLabel', this.winLabel], ['win', this.win], ['betLabel', this.betLabel], ['bet', this.bet]];
    return list.filter(([, o]) => o.visible && o.text !== '').map(([name, o]) => { const b = o.getBounds(); return { name, x: b.x, y: b.y, w: b.width, h: b.height, text: o.text }; });
  }
  buttons(): { name: string; x: number; y: number; w: number; h: number }[] {
    const list: [string, Button][] = [['spin', this.spinBtn], ['buy', this.buyBtn], ['minus', this.minus], ['plus', this.plus], ['info', this.infoBtn], ['mute', this.muteBtn], ['auto', this.autoBtn]];
    return list.filter(([, o]) => o.visible).map(([name, o]) => ({ name, x: o.x - o.width / 2, y: o.y - o.height / 2, w: o.width, h: o.height }));
  }
}
