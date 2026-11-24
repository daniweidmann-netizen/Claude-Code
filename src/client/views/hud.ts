import Phaser from 'phaser';
import { formatMoney, type Layout } from '../layout.js';
import { COLOR, FONT } from '../theme.js';
import { Button } from './button.js';

export interface HudActions {
  spin(): void;
  buy(): void;
  betDown(): void;
  betUp(): void;
  info(): void;
  auto(): void;
}

/** Header (title, multiplier, free-spin counter) and the control bar. Pure display plus button callbacks. */
export class Hud {
  private readonly title: Phaser.GameObjects.Text;
  private readonly demo: Phaser.GameObjects.Text;
  private readonly mult: Phaser.GameObjects.Text;
  private readonly fs: Phaser.GameObjects.Text;
  private readonly balance: Phaser.GameObjects.Text;
  private readonly bet: Phaser.GameObjects.Text;
  private readonly win: Phaser.GameObjects.Text;
  readonly spinBtn: Button;
  readonly buyBtn: Button;
  readonly minus: Button;
  readonly plus: Button;
  readonly infoBtn: Button;
  readonly autoBtn: Button;

  constructor(private readonly scene: Phaser.Scene, actions: HudActions) {
    const t = (text: string, color = COLOR.text) => scene.add.text(0, 0, text, { fontFamily: FONT, fontSize: '16px', color });
    this.title = t('TEMPLE OF THE LOST SUN', COLOR.win);
    this.demo = t('DEMO – kein Echtgeld', COLOR.dim);
    this.mult = t('×1', COLOR.win).setOrigin(1, 0);
    this.fs = t('', COLOR.text).setOrigin(1, 0);
    this.balance = t('');
    this.bet = t('').setOrigin(0.5);
    this.win = t('', COLOR.win).setOrigin(0.5);
    this.spinBtn = new Button(scene, 'SPIN', actions.spin, COLOR.goldDark);
    this.buyBtn = new Button(scene, '', actions.buy);
    this.minus = new Button(scene, '−', actions.betDown);
    this.plus = new Button(scene, '+', actions.betUp);
    this.infoBtn = new Button(scene, 'i', actions.info);
    this.autoBtn = new Button(scene, 'AUTO', actions.auto);
  }

  layout(l: Layout): void {
    const u = l.ui, h = l.header, c = l.controls;
    const px = (n: number) => `${Math.max(10, Math.round(n * u))}px`;
    this.title.setFontSize(px(l.portrait ? 19 : 20)).setPosition(h.x, h.y);
    this.demo.setFontSize(px(11)).setPosition(h.x, h.y + this.title.height + 2);
    this.mult.setFontSize(px(26)).setPosition(h.x + h.w, h.y - 2);
    this.infoBtn.layout(h.x + h.w - (l.portrait ? 86 : 110) * u, h.y + 22 * u, 44 * u, 44 * u, 20 * u);
    this.fs.setFontSize(px(12)).setPosition(h.x + h.w, h.y + this.mult.height);
    if (l.portrait) {
      const rowH = c.h / 3, y2 = c.y + rowH * 1.45;
      this.win.setFontSize(px(22)).setPosition(c.x + c.w / 2, c.y + rowH * 0.4);
      this.minus.layout(c.x + 24 * u, y2, 44 * u, 44 * u, 24 * u);
      this.bet.setFontSize(px(12)).setPosition(c.x + 70 * u, y2);
      this.plus.layout(c.x + 116 * u, y2, 44 * u, 44 * u, 24 * u);
      this.spinBtn.layout(c.x + c.w * 0.565, y2, 100 * u, 64 * u, 22 * u);
      this.buyBtn.layout(c.x + c.w - 50 * u, y2, 98 * u, 56 * u, 11 * u);
      this.balance.setFontSize(px(14)).setOrigin(0, 0.5).setPosition(c.x + 4 * u, c.y + rowH * 2.5);
      this.autoBtn.layout(c.x + c.w - 50 * u, c.y + rowH * 2.5, 98 * u, 44 * u, 13 * u);
    } else {
      const y = c.y + c.h / 2;
      this.balance.setFontSize(px(15)).setOrigin(0, 0.5).setPosition(c.x, y - 13 * u);
      this.win.setFontSize(px(17)).setOrigin(0, 0.5).setPosition(c.x, y + 13 * u);
      this.minus.layout(c.x + c.w * 0.3, y, 46 * u, 46 * u, 24 * u);
      this.bet.setFontSize(px(13)).setPosition(c.x + c.w * 0.3 + 56 * u, y);
      this.plus.layout(c.x + c.w * 0.3 + 112 * u, y, 46 * u, 46 * u, 24 * u);
      this.spinBtn.layout(c.x + c.w * 0.665, y, 130 * u, 62 * u, 22 * u);
      this.buyBtn.layout(c.x + c.w * 0.86, y, 132 * u, 54 * u, 12 * u);
      this.autoBtn.layout(c.x + c.w * 0.505, y, 64 * u, 46 * u, 11 * u);
    }
    if (l.portrait) this.win.setOrigin(0.5);
  }

  setBalance(minor: number): void { this.balance.setText(`Guthaben  ${formatMoney(minor)}`); }
  setBet(minor: number, buyPrice: number, buyEnabled: boolean): void {
    this.bet.setText(`Einsatz\n${formatMoney(minor)}`).setAlign('center');
    this.buyBtn.setText(`Expedition\nkaufen ${formatMoney(buyPrice)}`).setVisible(buyEnabled);
  }
  setWin(minor: number): void { this.win.setText(minor > 0 ? `Gewinn  ${formatMoney(minor)}` : ''); }
  setMultiplier(m: number): void {
    this.mult.setText(`×${m}`);
    this.scene.tweens.add({ targets: this.mult, scale: 1.25, duration: 110, yoyo: true });
  }
  setFreeSpins(text: string): void { this.fs.setText(text); }
  /** `autoLeft` > 0 means autoplay is running; its button then stays active so it can be stopped. */
  setBusy(busy: boolean, canSpin: boolean, canBuy: boolean, autoLeft = 0): void {
    const auto = autoLeft > 0;
    this.spinBtn.setEnabled(!busy && !auto && canSpin);
    this.buyBtn.setEnabled(!busy && !auto && canBuy);
    this.minus.setEnabled(!busy && !auto);
    this.plus.setEnabled(!busy && !auto);
    this.infoBtn.setEnabled(!busy && !auto);
    this.autoBtn.setEnabled(auto || (!busy && canSpin)).setText(auto ? `STOP (${autoLeft})` : 'AUTO');
  }
}
