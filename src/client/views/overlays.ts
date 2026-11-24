import Phaser from 'phaser';
import { tween, wait } from '../anim.js';
import { formatMoney } from '../layout.js';
import { COLOR, FONT } from '../theme.js';
import { Button } from './button.js';

export interface PrizeLabel { title: string; detail: string }

/** Short centred announcement (station effects, free spins, big events). */
export class Banner {
  private readonly text: Phaser.GameObjects.Text;
  constructor(private readonly scene: Phaser.Scene) {
    this.text = scene.add.text(0, 0, '', {
      fontFamily: FONT, fontSize: '28px', color: COLOR.win, align: 'center', stroke: '#000000', strokeThickness: 6,
    }).setOrigin(0.5).setDepth(50).setAlpha(0);
  }
  async show(message: string, holdMs = 650): Promise<void> {
    const { width, height } = this.scene.scale;
    this.text.setText(message).setFontSize(`${Math.round(Math.min(width, height) * 0.06)}px`)
      .setPosition(width / 2, height * 0.42).setScale(0.6).setAlpha(0);
    await tween(this.scene, { targets: this.text, scale: 1, alpha: 1, duration: 180, ease: 'Back.easeOut' });
    await wait(this.scene, holdMs);
    await tween(this.scene, { targets: this.text, alpha: 0, duration: 160 });
  }
}

/** Modal layer used for the Temple Bonus chambers and for confirmations. */
export class Modal {
  private readonly dim: Phaser.GameObjects.Rectangle;
  private readonly title: Phaser.GameObjects.Text;
  private readonly body: Phaser.GameObjects.Text;
  private items: Phaser.GameObjects.GameObject[] = [];
  private chambers: { btn: Button; text: Phaser.GameObjects.Text }[] = [];

  constructor(private readonly scene: Phaser.Scene) {
    this.dim = scene.add.rectangle(0, 0, 10, 10, 0x000000, 0.72).setOrigin(0).setDepth(60).setVisible(false).setInteractive();
    const style = { fontFamily: FONT, color: COLOR.win, align: 'center' as const };
    this.title = scene.add.text(0, 0, '', style).setOrigin(0.5).setDepth(61).setVisible(false);
    this.body = scene.add.text(0, 0, '', { ...style, color: COLOR.text }).setOrigin(0.5).setDepth(61).setVisible(false);
  }

  get open(): boolean { return this.dim.visible; }

  private frame(title: string, body: string): { w: number; h: number; u: number } {
    const { width: w, height: h } = this.scene.scale;
    const u = Math.min(w, h) / 390;
    this.dim.setSize(w, h).setVisible(true);
    this.title.setText(title).setFontSize(`${Math.round(24 * u)}px`).setPosition(w / 2, h * 0.24).setVisible(true);
    this.body.setText(body).setFontSize(`${Math.round(14 * u)}px`).setWordWrapWidth(w * 0.84).setPosition(w / 2, h * 0.34).setVisible(true);
    return { w, h, u };
  }

  close(): void {
    this.items.forEach((o) => o.destroy());
    this.items = []; this.chambers = [];
    this.dim.setVisible(false); this.title.setVisible(false); this.body.setVisible(false);
  }

  /** Yes/no question; resolves with the answer. */
  confirm(title: string, body: string, yes: string, no: string): Promise<boolean> {
    const { w, h, u } = this.frame(title, body);
    return new Promise((resolve) => {
      const done = (v: boolean) => { this.close(); resolve(v); };
      const a = new Button(this.scene, yes, () => done(true), COLOR.goldDark).layout(w / 2 + 80 * u, h * 0.55, 140 * u, 52 * u, 15 * u).setDepth(62);
      const b = new Button(this.scene, no, () => done(false)).layout(w / 2 - 80 * u, h * 0.55, 140 * u, 52 * u, 15 * u).setDepth(62);
      this.items.push(a, b);
    });
  }

  /** Shows the closed chambers of a Temple Bonus. */
  showChambers(title: string, body: string, count: number): void {
    this.close();
    const { w, h, u } = this.frame(title, body);
    const cw = Math.min(104 * u, (w * 0.9) / count - 8), ch = cw * 1.35;
    for (let i = 0; i < count; i++) {
      const x = w / 2 + (i - (count - 1) / 2) * (cw + 10);
      const btn = new Button(this.scene, `Kammer ${i + 1}`, () => this.onPick?.(i), COLOR.panelLight).layout(x, h * 0.55, cw, ch, 14 * u).setDepth(62);
      const text = this.scene.add.text(x, h * 0.55 + ch / 2 + 16 * u, '', { fontFamily: FONT, fontSize: `${Math.round(12 * u)}px`, color: COLOR.dim, align: 'center' }).setOrigin(0.5, 0).setDepth(62);
      this.chambers.push({ btn, text });
      this.items.push(btn, text);
    }
  }

  private onPick: ((chamber: number) => void) | null = null;

  /** Waits until the player opens one of the available chambers. */
  waitPick(available: number[]): Promise<number> {
    this.chambers.forEach((c, i) => c.btn.setEnabled(available.includes(i)));
    return new Promise((resolve) => {
      this.onPick = (i) => {
        if (!available.includes(i)) return;
        this.onPick = null;
        this.chambers.forEach((c) => c.btn.setEnabled(false));
        resolve(i);
      };
    });
  }

  async reveal(chamber: number, prize: PrizeLabel, chosen: boolean): Promise<void> {
    const c = this.chambers[chamber];
    if (!c) return;
    c.btn.setText(prize.title).setAlpha(chosen ? 1 : 0.55);
    c.text.setText(chosen ? prize.detail : `${prize.detail}\n(nicht gewählt)`).setColor(chosen ? COLOR.win : COLOR.dim);
    if (chosen) await tween(this.scene, { targets: c.btn, scale: 1.12, duration: 160, yoyo: true });
  }
}

export function prizeLabel(kind: string, centibet: number, bet: number): PrizeLabel {
  const money = formatMoney((centibet / 10) * (bet / 10));
  const mult = `${centibet / 100}×`;
  switch (kind) {
    case 'freeSpins': return { title: 'Free\nSpins', detail: 'Free Spins' };
    case 'relic': return { title: `Relic\n${mult}`, detail: `${money}\n+ weitere Kammer` };
    case 'grand': return { title: `Haupt-\nschatz\n${mult}`, detail: money };
    default: return { title: `Schatz\n${mult}`, detail: money };
  }
}
