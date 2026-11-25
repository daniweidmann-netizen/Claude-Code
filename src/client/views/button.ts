import Phaser from 'phaser';
import { DPR, REDUCED_MOTION } from '../env.js';
import { COLOR, DISPLAY } from '../theme.js';

export type Glyph = 'sound' | 'mute' | 'info' | 'minus' | 'plus' | 'fast';

/**
 * Button with a stone face and gold rim. Shapes: pill (text), round (drawn
 * glyph) or image. Disabled buttons are dimmed but stay solid, so they never
 * look like a rendering fault. The touch target is at least 44 CSS pixels.
 */
export class Button extends Phaser.GameObjects.Container {
  private readonly bg: Phaser.GameObjects.Graphics;
  private readonly label: Phaser.GameObjects.Text;
  private readonly sub: Phaser.GameObjects.Text;
  private readonly icon: Phaser.GameObjects.Graphics;
  private image: Phaser.GameObjects.Image | null = null;
  private bw = 100; private bh = 44; private active2 = true;
  private round = false;
  private glyph: Glyph | null = null;
  private accent: number = COLOR.goldDark;
  private subScale = 0.95;

  constructor(scene: Phaser.Scene, text: string, private readonly onClick: () => void) {
    super(scene);
    this.bg = scene.add.graphics();
    this.icon = scene.add.graphics();
    this.label = scene.add.text(0, 0, text, { fontFamily: DISPLAY, fontSize: '16px', color: COLOR.text, align: 'center' }).setOrigin(0.5);
    this.sub = scene.add.text(0, 0, '', { fontFamily: DISPLAY, fontSize: '12px', color: COLOR.win, align: 'center' }).setOrigin(0.5);
    this.add([this.bg, this.icon, this.label, this.sub]);
    scene.add.existing(this);
    this.on('pointerdown', () => { if (this.active2 && !REDUCED_MOTION) this.setScale(0.94); });
    this.on('pointerup', () => { this.setScale(1); if (this.active2) this.onClick(); });
    this.on('pointerout', () => this.setScale(1));
  }

  asRound(glyph: Glyph): this { this.round = true; this.glyph = glyph; this.label.setVisible(false); return this; }
  asImage(key: string): this {
    this.round = true;
    this.image = this.scene.add.image(0, 0, key);
    this.addAt(this.image, 1);
    this.label.setVisible(false);
    return this;
  }
  setGlyph(glyph: Glyph): this { this.glyph = glyph; this.draw(); return this; }
  /** Size of the second line relative to the first (the buy button shows its price larger than its label). */
  setSubScale(k: number): this { this.subScale = k; return this; }
  setAccent(color: number): this { this.accent = color; this.draw(); return this; }

  layout(x: number, y: number, w: number, h: number, fontPx: number): this {
    this.bw = Math.max(w, 44 * DPR); this.bh = Math.max(h, 44 * DPR);
    if (this.round) this.bw = this.bh = Math.max(this.bw, this.bh);
    this.setPosition(Math.round(x), Math.round(y));
    this.label.setFontSize(`${Math.round(fontPx)}px`);
    this.sub.setFontSize(`${Math.round(fontPx * this.subScale)}px`);
    this.setSize(this.bw, this.bh);
    this.setInteractive({ useHandCursor: true });
    this.draw();
    return this;
  }

  setText(text: string, sub = ''): this {
    this.label.setText(text); this.sub.setText(sub);
    this.draw();
    return this;
  }

  setEnabled(on: boolean): this {
    this.active2 = on;
    this.setAlpha(on ? 1 : 0.55);
    this.image?.setTint(on ? 0xffffff : 0x777777);
    return this;
  }

  get enabled(): boolean { return this.active2; }
  get face(): Phaser.GameObjects.Image | null { return this.image; }

  private draw(): void {
    const w = this.bw, h = this.bh, line = Math.max(2, Math.round(1.5 * DPR));
    this.bg.clear(); this.icon.clear();
    if (this.image) {
      this.image.setDisplaySize(w, h);
    } else if (this.round) {
      this.bg.fillStyle(COLOR.stone, 0.96).fillCircle(0, 0, w / 2).lineStyle(line, this.accent, 1).strokeCircle(0, 0, w / 2 - line / 2);
    } else {
      const r = Math.min(h / 2, 14 * DPR);
      this.bg.fillStyle(COLOR.stone, 0.96).fillRoundedRect(-w / 2, -h / 2, w, h, r)
        .lineStyle(line, this.accent, 1).strokeRoundedRect(-w / 2, -h / 2, w, h, r);
    }
    if (this.sub.text) { this.label.setY(-h * 0.18); this.sub.setY(h * 0.2); } else this.label.setY(0);
    if (this.glyph) this.drawGlyph(this.glyph, Math.min(w, h) * 0.26);
  }

  private drawGlyph(g: Glyph, s: number): void {
    const i = this.icon, c = 0xf3ead6, line = Math.max(2, s * 0.22);
    i.fillStyle(c, 1).lineStyle(line, c, 1);
    switch (g) {
      case 'minus': i.fillRect(-s, -line / 2, 2 * s, line); break;
      case 'plus': i.fillRect(-s, -line / 2, 2 * s, line).fillRect(-line / 2, -s, line, 2 * s); break;
      case 'info': i.fillCircle(0, -s * 0.95, line * 0.62).fillRect(-line / 2, -s * 0.4, line, s * 1.4); break;
      case 'fast':
        i.fillTriangle(-s, -s * 0.8, -s, s * 0.8, 0, 0).fillTriangle(0, -s * 0.8, 0, s * 0.8, s, 0); break;
      case 'sound': case 'mute':
        i.fillRect(-s, -s * 0.35, s * 0.55, s * 0.7).fillTriangle(-s * 0.5, -s * 0.35, -s * 0.5, s * 0.35, s * 0.1, s * 0.9).fillTriangle(-s * 0.5, -s * 0.35, s * 0.1, -s * 0.9, s * 0.1, s * 0.9);
        if (g === 'sound') {
          i.beginPath().arc(s * 0.15, 0, s * 0.55, -0.8, 0.8).strokePath();
          i.beginPath().arc(s * 0.15, 0, s * 0.95, -0.8, 0.8).strokePath();
        } else i.lineBetween(s * 0.35, -s * 0.5, s * 1.05, s * 0.5).lineBetween(s * 1.05, -s * 0.5, s * 0.35, s * 0.5);
        break;
    }
  }
}
