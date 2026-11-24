import Phaser from 'phaser';
import { DPR } from '../env.js';
import { COLOR, FONT } from '../theme.js';

/** Rounded text button with a minimum touch target, enabled/disabled state and keyboard-free activation. */
export class Button extends Phaser.GameObjects.Container {
  private readonly bg: Phaser.GameObjects.Graphics;
  private readonly label: Phaser.GameObjects.Text;
  private bw = 100; private bh = 44; private active2 = true;
  private fill: number;

  constructor(scene: Phaser.Scene, text: string, private readonly onClick: () => void, fill = COLOR.panelLight) {
    super(scene);
    this.fill = fill;
    this.bg = scene.add.graphics();
    this.label = scene.add.text(0, 0, text, { fontFamily: FONT, fontSize: '16px', color: COLOR.text, align: 'center' }).setOrigin(0.5);
    this.add([this.bg, this.label]);
    scene.add.existing(this);
    this.on('pointerdown', () => { if (this.active2) this.setScale(0.96); });
    this.on('pointerup', () => { this.setScale(1); if (this.active2) this.onClick(); });
    this.on('pointerout', () => this.setScale(1));
  }

  layout(x: number, y: number, w: number, h: number, fontPx: number): this {
    this.bw = Math.max(w, 44 * DPR); this.bh = Math.max(h, 44 * DPR); // 44 CSS px touch target
    this.setPosition(x, y);
    this.label.setFontSize(`${Math.round(fontPx)}px`);
    this.setSize(this.bw, this.bh);
    this.setInteractive({ useHandCursor: true });
    this.draw();
    return this;
  }

  setText(text: string): this { this.label.setText(text); return this; }

  setEnabled(on: boolean): this {
    this.active2 = on;
    this.setAlpha(on ? 1 : 0.4);
    return this;
  }

  get enabled(): boolean { return this.active2; }

  private draw(): void {
    const r = Math.min(this.bh / 2, 16);
    this.bg.clear().fillStyle(this.fill, 1).fillRoundedRect(-this.bw / 2, -this.bh / 2, this.bw, this.bh, r)
      .lineStyle(2, COLOR.goldDark, 1).strokeRoundedRect(-this.bw / 2, -this.bh / 2, this.bw, this.bh, r);
  }
}
