import Phaser from 'phaser';
import { tween } from '../anim.js';
import type { Rect } from '../layout.js';
import { COLOR, FONT, STATION_NAMES } from '../theme.js';

/** Expedition Track: start plus five stations, the explorer marker, Base Camp flag and temple seals. */
export class TrackView extends Phaser.GameObjects.Container {
  private readonly path: Phaser.GameObjects.Graphics;
  private readonly nodes: Phaser.GameObjects.Arc[] = [];
  private readonly labels: Phaser.GameObjects.Text[] = [];
  private readonly marker: Phaser.GameObjects.Arc;
  private readonly camp: Phaser.GameObjects.Text;
  private readonly seals: Phaser.GameObjects.Arc[] = [];
  private pts: { x: number; y: number }[] = [];
  private station = 0;
  private campAt = 0;

  constructor(scene: Phaser.Scene, private readonly stepsNeeded: number[], maxSeals: number) {
    super(scene);
    this.path = scene.add.graphics();
    this.add(this.path);
    for (let i = 0; i <= 5; i++) {
      const node = scene.add.circle(0, 0, 10, COLOR.panelLight).setStrokeStyle(2, COLOR.goldDark);
      const label = scene.add.text(0, 0, i === 0 ? 'Start' : STATION_NAMES[i - 1], { fontFamily: FONT, fontSize: '12px', color: COLOR.dim }).setOrigin(0.5);
      this.nodes.push(node); this.labels.push(label);
      this.add([node, label]);
    }
    this.camp = scene.add.text(0, 0, '⛺', { fontSize: '16px' }).setOrigin(0.5).setVisible(false);
    this.marker = scene.add.circle(0, 0, 8, COLOR.gold).setStrokeStyle(2, 0xffffff);
    this.add([this.camp, this.marker]);
    for (let i = 0; i < maxSeals; i++) {
      const s = scene.add.circle(0, 0, 6, COLOR.panelLight).setStrokeStyle(2, COLOR.gold).setVisible(false);
      this.seals.push(s); this.add(s);
    }
    scene.add.existing(this);
  }

  layout(r: Rect & { vertical: boolean }, ui: number): void {
    this.setPosition(r.x, r.y);
    const R = Math.max(8, Math.round(11 * ui));
    this.pts = [];
    for (let i = 0; i <= 5; i++) {
      // Vertical: the path climbs from the bottom (start) to the temple at the top.
      this.pts.push(r.vertical
        ? { x: R + 6, y: r.h - R - (i * (r.h - 2 * R)) / 5 }
        : { x: R + 4 + (i * (r.w - 2 * R - 8)) / 5, y: R + 4 });
    }
    this.path.clear().lineStyle(3, COLOR.line, 1).beginPath().moveTo(this.pts[0].x, this.pts[0].y);
    this.pts.slice(1).forEach((p) => this.path.lineTo(p.x, p.y));
    this.path.strokePath();
    const size = `${Math.max(9, Math.round(11 * ui))}px`;
    this.pts.forEach((p, i) => {
      this.nodes[i].setPosition(p.x, p.y).setRadius(i === 5 ? R * 1.25 : R);
      const text = i === 0 ? 'Start' : `${STATION_NAMES[i - 1]}`;
      this.labels[i].setText(r.vertical ? text : text.replace(' ', '\n')).setFontSize(size).setAlign('center');
      if (r.vertical) this.labels[i].setOrigin(0, 0.5).setPosition(p.x + R + 8, p.y);
      else this.labels[i].setOrigin(0.5, 0).setPosition(p.x, p.y + R + 6);
    });
    this.marker.setRadius(R * 0.7);
    this.seals.forEach((s, i) => {
      const top = this.pts[5];
      if (r.vertical) s.setPosition(top.x + R + 16 + i * 16, top.y - R - 8);
      else s.setPosition(top.x - i * 15, top.y + R + 6 + parseInt(size, 10) * 2.6);
    });
    this.refresh();
  }

  private refresh(): void {
    const p = this.pts[this.station] ?? { x: 0, y: 0 };
    this.marker.setPosition(p.x, p.y);
    const c = this.pts[this.campAt];
    if (c) this.camp.setPosition(c.x, c.y - 18);
    this.nodes.forEach((n, i) => n.setFillStyle(i > 0 && i <= this.station ? COLOR.gold : COLOR.panelLight));
    this.labels.forEach((l, i) => l.setColor(i > 0 && i <= this.station ? COLOR.text : COLOR.dim));
  }

  /** Sets the marker without animation (start of a spin). */
  reset(station: number): void { this.station = station; this.refresh(); }

  async advance(to: number): Promise<void> {
    while (this.station < to) {
      this.station++;
      const p = this.pts[this.station];
      await tween(this.scene, { targets: this.marker, x: p.x, y: p.y, duration: 200, ease: 'Sine.easeInOut' });
      this.refresh();
      const n = this.nodes[this.station];
      await tween(this.scene, { targets: n, scale: 1.5, duration: 110, yoyo: true });
    }
  }

  setBaseCamp(station: number, visible: boolean): void {
    this.campAt = station;
    this.camp.setVisible(visible && station > 0);
    this.refresh();
  }

  setSeals(count: number, visible: boolean): void {
    this.seals.forEach((s, i) => s.setVisible(visible).setFillStyle(i < count ? COLOR.gold : COLOR.panelLight));
  }

  /** Steps required for each station, shown in the rules later. */
  get steps(): number[] { return this.stepsNeeded; }
}
