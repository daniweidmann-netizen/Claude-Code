import Phaser from 'phaser';
import { tween, wait } from '../anim.js';
import { DPR, REDUCED_MOTION } from '../env.js';
import type { Fx } from '../fx.js';
import { formatMoney } from '../layout.js';
import { COLOR, DEPTH, DISPLAY, TEXT } from '../theme.js';
import { Button } from './button.js';

/** Counts a number up over `ms` and reports each value; returns when done. */
export function countUp(scene: Phaser.Scene, to: number, ms: number, onValue: (v: number) => void): Promise<void> {
  const state = { v: 0 };
  return tween(scene, { targets: state, v: to, duration: ms, ease: 'Cubic.easeOut', onUpdate: () => onValue(state.v) }).then(() => onValue(to));
}

/**
 * Announcements on their own plate (never bare text over the symbols) and the
 * win celebrations. All amounts are passed in; the last value shown is exact.
 */
export class Banner {
  private readonly dim: Phaser.GameObjects.Rectangle;
  private readonly plate: Phaser.GameObjects.Graphics;
  private readonly title: Phaser.GameObjects.Text;
  private readonly amount: Phaser.GameObjects.Text;
  private readonly note: Phaser.GameObjects.Text;

  constructor(private readonly scene: Phaser.Scene, private readonly fx: Fx) {
    this.dim = scene.add.rectangle(0, 0, 10, 10, 0x05070c, 0.7).setOrigin(0).setDepth(DEPTH.celebrate - 3).setVisible(false);
    this.plate = scene.add.graphics().setDepth(DEPTH.banner).setAlpha(0);
    this.title = scene.add.text(0, 0, '', { fontFamily: DISPLAY, fontSize: '28px', color: COLOR.win, align: 'center' }).setOrigin(0.5).setDepth(DEPTH.banner + 1).setAlpha(0);
    this.amount = scene.add.text(0, 0, '', { fontFamily: DISPLAY, fontSize: '40px', color: '#fff6d6', align: 'center' }).setOrigin(0.5).setDepth(DEPTH.celebrate).setAlpha(0);
    this.note = scene.add.text(0, 0, '', { fontFamily: TEXT, fontSize: '16px', color: COLOR.text, align: 'center' }).setOrigin(0.5).setDepth(DEPTH.celebrate).setAlpha(0);
  }

  /** Text currently on screen, or '' (used by end-to-end tests). */
  get current(): string { return this.title.alpha > 0 ? `${this.title.text} ${this.amount.alpha > 0 ? this.amount.text : ''}`.trim() : ''; }

  private drawPlate(cx: number, cy: number, w: number, h: number): void {
    const r = Math.min(h / 2, 18 * DPR);
    this.plate.clear().fillStyle(0x070a11, 0.9).fillRoundedRect(cx - w / 2, cy - h / 2, w, h, r)
      .lineStyle(Math.max(2, 1.5 * DPR), COLOR.gold, 1).strokeRoundedRect(cx - w / 2, cy - h / 2, w, h, r);
  }

  /** Short announcement on a plate in the middle of the play field. */
  async show(message: string, holdMs = 650, y = 0.42): Promise<void> {
    const { width, height } = this.scene.scale;
    const size = Math.round(Math.min(width, height) * 0.058);
    this.title.setDepth(DEPTH.banner + 1).setFontSize(`${size}px`).setWordWrapWidth(width * 0.8).setText(message).setPosition(width / 2, height * y);
    this.drawPlate(width / 2, height * y, Math.min(width * 0.92, this.title.width + size * 2), this.title.height + size * 1.1);
    this.title.setScale(REDUCED_MOTION ? 1 : 0.85).setAlpha(0);
    await tween(this.scene, { targets: [this.title, this.plate], alpha: 1, duration: 150 });
    if (!REDUCED_MOTION) this.scene.tweens.add({ targets: this.title, scale: 1, duration: 150, ease: 'Back.easeOut' });
    await wait(this.scene, holdMs);
    await tween(this.scene, { targets: [this.title, this.plate], alpha: 0, duration: 150 });
  }

  /**
   * Win presentation by tier: 1 = plate with counter, 2 = full screen with
   * sunburst and coins, 3 = the same, longer and brighter. Also used for the
   * free-spin summary (tier 1 look, own title).
   */
  async celebrate(title: string, minor: number, tier: number, at?: { x: number; y: number }, note = ''): Promise<void> {
    const { width, height } = this.scene.scale;
    const full = tier >= 2;
    const cx = width / 2, cy = full ? height * 0.42 : (at?.y ?? height * 0.42);
    const size = Math.round(Math.min(width, height) * (full ? 0.085 : 0.05));
    const ms = [700, 1400, 2600][Math.min(3, Math.max(1, tier)) - 1];
    this.title.setDepth(DEPTH.celebrate).setFontSize(`${size}px`).setWordWrapWidth(width * 0.9).setText(title).setScale(1);
    this.amount.setFontSize(`${Math.round(size * 1.35)}px`).setText(formatMoney(REDUCED_MOTION ? minor : 0));
    this.note.setText(note).setFontSize(`${Math.round(size * 0.62)}px`).setWordWrapWidth(width * 0.84);
    const noteH = note ? this.note.height + size * 0.35 : 0;
    const blockH = this.title.height + this.amount.height + size * 0.3 + noteH;
    this.title.setPosition(cx, cy - blockH / 2 + this.title.height / 2);
    this.amount.setPosition(cx, this.title.y + this.title.height / 2 + size * 0.3 + this.amount.height / 2);
    this.note.setPosition(cx, cy + blockH / 2 - this.note.height / 2);
    let stopRays = () => undefined as void;
    if (full) {
      this.dim.setSize(width, height).setVisible(true).setAlpha(0);
      this.scene.tweens.add({ targets: this.dim, alpha: 1, duration: 200 });
      stopRays = this.fx.rays(cx, cy, Math.max(width, height) * 0.75);
      this.fx.coinRain(ms + 600, tier === 3 ? 34 : 18);
      this.plate.clear();
    } else {
      this.plate.setDepth(DEPTH.celebrate - 1);
      const pw = Math.min(width * 0.9, Math.max(this.title.width, size * 7) + size * 2);
      this.drawPlate(cx, cy, pw, blockH + size);
    }
    await tween(this.scene, { targets: [this.title, this.amount, this.plate, this.note], alpha: 1, duration: 180 });
    if (!REDUCED_MOTION) {
      await countUp(this.scene, minor, ms, (v) => this.amount.setText(formatMoney(Math.floor(v))));
      this.fx.burst(cx, this.amount.y, COLOR.goldBright, full ? 40 : 14);
      await tween(this.scene, { targets: this.amount, scale: 1.14, duration: 170, yoyo: true });
    } else await wait(this.scene, ms);
    this.amount.setText(formatMoney(minor));
    await wait(this.scene, full ? 1100 : 550);
    stopRays();
    await tween(this.scene, { targets: [this.title, this.amount, this.plate, this.note, ...(full ? [this.dim] : [])], alpha: 0, duration: 200 });
    this.dim.setVisible(false);
    this.plate.setDepth(DEPTH.banner);
  }

  /**
   * Feature entry as a small scene: a picture (the open temple gate), a
   * headline and the conditions the feature starts with.
   */
  async feature(imageKey: string, title: string, lines: string[], holdMs = 1500): Promise<void> {
    const { width, height } = this.scene.scale;
    const u = Math.min(width, height) / 390;
    this.dim.setSize(width, height).setVisible(true).setAlpha(0);
    const img = this.scene.textures.exists(imageKey) ? this.scene.add.image(width / 2, height * 0.36, imageKey).setDepth(DEPTH.celebrate - 1).setAlpha(0) : null;
    if (img) img.setScale(Math.min((width * 0.8) / img.width, (height * 0.36) / img.height));
    const y0 = img ? img.y + img.displayHeight / 2 + 26 * u : height * 0.4;
    this.title.setDepth(DEPTH.celebrate).setFontSize(`${Math.round(32 * u)}px`).setWordWrapWidth(width * 0.9).setText(title).setScale(1).setPosition(width / 2, y0).setAlpha(0);
    this.note.setText(lines.join('\n')).setFontSize(`${Math.round(15 * u)}px`).setWordWrapWidth(width * 0.84).setLineSpacing(4 * u)
      .setPosition(width / 2, y0 + this.title.height / 2 + 12 * u + 0).setOrigin(0.5, 0).setAlpha(0);
    this.plate.clear();
    let stopRays = () => undefined as void;
    if (img) {
      stopRays = this.fx.rays(img.x, img.y + img.displayHeight * 0.08, Math.max(width, height) * 0.6);
      if (!REDUCED_MOTION) { const s = img.scale; img.setScale(s * 0.82); this.scene.tweens.add({ targets: img, scale: s, duration: 520, ease: 'Cubic.easeOut' }); }
      this.fx.burst(img.x, img.y, COLOR.goldBright, 30);
    }
    await tween(this.scene, { targets: [this.dim, this.title, this.note, ...(img ? [img] : [])], alpha: 1, duration: 260 });
    await wait(this.scene, holdMs);
    stopRays();
    await tween(this.scene, { targets: [this.dim, this.title, this.note, ...(img ? [img] : [])], alpha: 0, duration: 240 });
    img?.destroy();
    this.dim.setVisible(false);
    this.note.setOrigin(0.5);
  }

  /** Full-screen flash used for the change into and out of free spins. */
  async wipe(color: number, midway: () => void): Promise<void> {
    const { width, height } = this.scene.scale;
    const r = this.scene.add.rectangle(0, 0, width, height, color, 1).setOrigin(0).setDepth(DEPTH.celebrate + 5).setAlpha(0);
    await tween(this.scene, { targets: r, alpha: REDUCED_MOTION ? 0.85 : 1, duration: 260, ease: 'Sine.easeIn' });
    midway();
    await tween(this.scene, { targets: r, alpha: 0, duration: 420, ease: 'Sine.easeOut' });
    r.destroy();
  }
}

/** Confirmation dialog in the game's style. */
export class Modal {
  private readonly dim: Phaser.GameObjects.Rectangle;
  private readonly plate: Phaser.GameObjects.Graphics;
  private readonly title: Phaser.GameObjects.Text;
  private readonly body: Phaser.GameObjects.Text;
  private items: Phaser.GameObjects.GameObject[] = [];

  constructor(private readonly scene: Phaser.Scene) {
    this.dim = scene.add.rectangle(0, 0, 10, 10, 0x05070c, 0.82).setOrigin(0).setDepth(DEPTH.scene).setVisible(false).setInteractive();
    this.plate = scene.add.graphics().setDepth(DEPTH.scene + 1).setVisible(false);
    this.title = scene.add.text(0, 0, '', { fontFamily: DISPLAY, color: COLOR.win, align: 'center' }).setOrigin(0.5).setDepth(DEPTH.sceneUi).setVisible(false);
    this.body = scene.add.text(0, 0, '', { fontFamily: TEXT, color: COLOR.text, align: 'center' }).setOrigin(0.5, 0).setDepth(DEPTH.sceneUi).setVisible(false);
  }

  get open(): boolean { return this.dim.visible; }

  close(): void {
    this.items.forEach((o) => o.destroy());
    this.items = [];
    [this.dim, this.plate, this.title, this.body].forEach((o) => o.setVisible(false));
  }

  /** Choice from a short list (bet levels); resolves with the index or -1 when dismissed. */
  choose(title: string, labels: string[], current: number): Promise<number> {
    const { width: w, height: h } = this.scene.scale;
    const u = Math.min(w, h) / 390, pw = Math.min(w * 0.92, 420 * u);
    const cols = 3, rows = Math.ceil(labels.length / cols), bw = (pw - 36 * u - (cols - 1) * 10 * u) / cols, bh = 52 * u;
    const ph = 70 * u + rows * (bh + 10 * u) + 10 * u, top = (h - ph) / 2;
    this.dim.setSize(w, h).setVisible(true);
    this.body.setVisible(false);
    this.title.setText(title).setFontSize(`${Math.round(20 * u)}px`).setPosition(w / 2, top + 34 * u).setVisible(true);
    this.plate.clear().fillStyle(0x0b0f18, 0.98).fillRoundedRect((w - pw) / 2, top, pw, ph, 18 * u)
      .lineStyle(Math.max(2, 1.5 * DPR), COLOR.gold, 1).strokeRoundedRect((w - pw) / 2, top, pw, ph, 18 * u).setVisible(true);
    return new Promise((resolve) => {
      const done = (v: number) => { this.dim.off('pointerup'); this.close(); resolve(v); };
      labels.forEach((label, i) => {
        const x = (w - pw) / 2 + 18 * u + bw / 2 + (i % cols) * (bw + 10 * u);
        const y = top + 66 * u + bh / 2 + Math.floor(i / cols) * (bh + 10 * u);
        const b = new Button(this.scene, label, () => done(i)).layout(x, y, bw, bh, 16 * u).setDepth(DEPTH.sceneUi);
        if (i === current) b.setAccent(COLOR.goldBright);
        this.items.push(b);
      });
      // A tap outside the panel dismisses it.
      this.dim.once('pointerup', (p: Phaser.Input.Pointer) => { if (p.y < top || p.y > top + ph) done(-1); });
    });
  }

  /** Yes/no question; resolves with the answer. */
  confirm(title: string, body: string, yes: string, no: string): Promise<boolean> {
    const { width: w, height: h } = this.scene.scale;
    const u = Math.min(w, h) / 390, pw = Math.min(w * 0.92, 420 * u);
    this.dim.setSize(w, h).setVisible(true);
    this.title.setText(title).setFontSize(`${Math.round(22 * u)}px`).setVisible(true);
    this.body.setText(body).setFontSize(`${Math.round(14.5 * u)}px`).setWordWrapWidth(pw - 36 * u).setLineSpacing(4 * u).setVisible(true);
    const ph = this.title.height + this.body.height + 130 * u, top = (h - ph) / 2;
    this.plate.clear().fillStyle(0x0b0f18, 0.98).fillRoundedRect((w - pw) / 2, top, pw, ph, 18 * u)
      .lineStyle(Math.max(2, 1.5 * DPR), COLOR.gold, 1).strokeRoundedRect((w - pw) / 2, top, pw, ph, 18 * u).setVisible(true);
    this.title.setPosition(w / 2, top + 22 * u + this.title.height / 2);
    this.body.setPosition(w / 2, this.title.y + this.title.height / 2 + 12 * u);
    const by = top + ph - 44 * u, bw = (pw - 54 * u) / 2;
    return new Promise((resolve) => {
      const done = (v: boolean) => { this.close(); resolve(v); };
      const a = new Button(this.scene, yes, () => done(true)).setAccent(COLOR.gold).layout(w / 2 + bw / 2 + 9 * u, by, bw, 52 * u, 14 * u).setDepth(DEPTH.sceneUi);
      const b = new Button(this.scene, no, () => done(false)).layout(w / 2 - bw / 2 - 9 * u, by, bw, 52 * u, 14 * u).setDepth(DEPTH.sceneUi);
      this.items.push(a, b);
    });
  }
}
