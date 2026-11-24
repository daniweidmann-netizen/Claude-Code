import Phaser from 'phaser';
import { tween, wait } from '../anim.js';
import { DPR, REDUCED_MOTION } from '../env.js';
import type { Fx } from '../fx.js';
import { t } from '../i18n.js';
import { stonesBefore, type Rect } from '../layout.js';
import { COLOR, DEPTH, DISPLAY, STATION_COLOR, STATION_NAMES, TEXT } from '../theme.js';

/**
 * Expedition Track: five station medallions with their own emblem and colour,
 * stepping stones between them, the Base Camp flag and the temple seals.
 * A caption always says what the next step is. Display only.
 */
export class TrackView extends Phaser.GameObjects.Container {
  private readonly plate: Phaser.GameObjects.Graphics;
  private readonly path: Phaser.GameObjects.Graphics;
  private readonly medals: (Phaser.GameObjects.Image | Phaser.GameObjects.Arc)[] = [];
  private readonly rings: Phaser.GameObjects.Arc[] = [];
  private readonly caption: Phaser.GameObjects.Text;
  private readonly names: Phaser.GameObjects.Text[] = [];
  private readonly flag: Phaser.GameObjects.Graphics;
  private readonly sealDots: Phaser.GameObjects.Arc[] = [];
  private readonly sealLabel: Phaser.GameObjects.Text;
  private pts: { x: number; y: number }[] = [];
  private stones: { x: number; y: number; step: number }[] = [];
  private radius = 20;
  private station = 0;
  private steps = 0;
  private campAt = 0;
  private campOn = false;
  private seals = 0;
  private sealsOn = false;
  private pulse: Phaser.Tweens.Tween | null = null;
  private captionLock = 0;

  constructor(scene: Phaser.Scene, private readonly need: number[], maxSeals: number, private readonly fx: Fx) {
    super(scene);
    this.plate = scene.add.graphics();
    this.path = scene.add.graphics();
    this.add([this.plate, this.path]);
    for (let i = 0; i < 5; i++) {
      const ring = scene.add.circle(0, 0, 10).setStrokeStyle(3 * DPR, STATION_COLOR[i], 1).setAlpha(0);
      const key = `station${i + 1}`;
      const medal = scene.textures.exists(key) ? scene.add.image(0, 0, key) : scene.add.circle(0, 0, 10, COLOR.stoneLight).setStrokeStyle(2 * DPR, COLOR.goldDark);
      this.rings.push(ring); this.medals.push(medal);
      this.add([ring, medal]);
    }
    for (let i = 0; i < 5; i++) {
      const n = scene.add.text(0, 0, STATION_NAMES[i].toUpperCase(), { fontFamily: DISPLAY, fontSize: '11px', color: COLOR.dim }).setOrigin(0, 0.5).setVisible(false);
      this.names.push(n); this.add(n);
    }
    this.flag = scene.add.graphics();
    this.caption = scene.add.text(0, 0, '', { fontFamily: TEXT, fontSize: '12px', color: COLOR.text }).setOrigin(0, 0.5);
    this.sealLabel = scene.add.text(0, 0, t('seals'), { fontFamily: DISPLAY, fontSize: '10px', color: COLOR.win }).setOrigin(1, 0.5).setVisible(false);
    this.add([this.flag, this.caption, this.sealLabel]);
    for (let i = 0; i < maxSeals; i++) {
      const s = scene.add.circle(0, 0, 5).setStrokeStyle(1.5 * DPR, COLOR.gold).setVisible(false);
      this.sealDots.push(s); this.add(s);
    }
    this.setDepth(DEPTH.hud);
    scene.add.existing(this);
  }

  /** `reserve` is the width kept free at the right of the caption row (multiplier pill in portrait). */
  layout(r: Rect & { vertical: boolean }, ui: number, reserve = 0): void {
    this.setPosition(r.x, r.y);
    const pad = Math.round(6 * ui);
    this.plate.clear().fillStyle(0x070a11, 0.72).fillRoundedRect(0, 0, r.w, r.h, 14 * ui)
      .lineStyle(Math.max(1, DPR), COLOR.goldDark, 0.7).strokeRoundedRect(0, 0, r.w, r.h, 14 * ui);
    const capH = Math.round((r.vertical ? 36 : 46) * ui);
    this.pts = [];
    if (r.vertical) {
      const R = Math.min((r.w - 2 * pad) * 0.3, (r.h - capH - 2 * pad) / 11.5);
      this.radius = R;
      const x = pad + R + 2, top = pad + R, bottom = r.h - capH - pad - R;
      // The path climbs from the camp at the bottom to the temple at the top.
      for (let i = 0; i <= 5; i++) this.pts.push({ x, y: bottom + R * 0.9 - (i * (bottom + R * 0.9 - top)) / 5 });
      this.caption.setOrigin(0, 0.5).setPosition(pad + 2, r.h - capH / 2 - pad / 2).setWordWrapWidth(r.w - 2 * pad).setLineSpacing(-2 * ui);
    } else {
      const R = Math.min((r.h - capH - 2 * pad) / 2, (r.w - 2 * pad) / 11.4);
      this.radius = R;
      const y = pad + (r.h - capH - 2 * pad) / 2 + pad * 0.5, left = pad + R * 0.45, right = r.w - pad - R;
      for (let i = 0; i <= 5; i++) this.pts.push({ x: left + (i * (right - left)) / 5, y });
      this.caption.setOrigin(0, 0.5).setPosition(pad + 6 * ui, r.h - capH / 2 - pad / 2).setWordWrapWidth(r.w - reserve - 3 * pad - 8 * ui).setLineSpacing(-2 * ui);
    }
    this.caption.setFontSize(`${Math.max(11 * DPR, Math.round(13 * ui))}px`);
    this.names.forEach((n, i) => {
      const p = this.pts[i + 1];
      n.setVisible(r.vertical).setFontSize(`${Math.max(10 * DPR, Math.round(11.5 * ui))}px`);
      if (p) n.setPosition(p.x + this.radius + 8 * ui, p.y).setWordWrapWidth(Math.max(20, r.w - (p.x + this.radius + 8 * ui) - pad)).setLineSpacing(-3 * ui);
    });
    // Stepping stones: one per step that does not complete a station.
    this.stones = [];
    for (let i = 1; i <= 5; i++) {
      const n = stonesBefore(this.need, i), a = this.pts[i - 1], b = this.pts[i];
      const before = i > 1 ? this.need[i - 2] : 0;
      for (let k = 1; k <= n; k++) {
        const f = (i === 1 ? 0.25 : 0) + (k / (n + 1)) * (i === 1 ? 0.75 : 1);
        this.stones.push({ x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f, step: before + k });
      }
    }
    for (let i = 0; i < 5; i++) {
      const p = this.pts[i + 1], m = this.medals[i];
      this.rings[i].setPosition(p.x, p.y).setRadius(this.radius * 1.08);
      m.setPosition(p.x, p.y);
      if (m instanceof Phaser.GameObjects.Image) m.setDisplaySize(this.radius * 2, this.radius * 2); else m.setRadius(this.radius);
    }
    const temple = this.pts[5], d = Math.max(4 * DPR, this.radius * 0.2);
    this.sealDots.forEach((s, i) => {
      s.setRadius(d);
      if (r.vertical) s.setPosition(temple.x + this.radius + d * 2 + i * d * 2.8, temple.y);
      else s.setPosition(r.w - reserve - 2 * pad - d - (this.sealDots.length - 1 - i) * d * 2.8, r.h - capH / 2 - pad / 2);
    });
    const first = this.sealDots[0];
    this.sealLabel.setFontSize(`${Math.max(9 * DPR, Math.round(10 * ui))}px`);
    if (r.vertical) this.sealLabel.setOrigin(0, 0.5).setPosition(temple.x + this.radius + d, temple.y - d * 2.6);
    else this.sealLabel.setOrigin(1, 0.5).setPosition((first?.x ?? r.w) - d * 2, first?.y ?? 0);
    this.redraw();
  }

  private redraw(): void {
    const g = this.path.clear();
    const lw = Math.max(2, this.radius * 0.12);
    g.lineStyle(lw, 0x2a3144, 1).beginPath().moveTo(this.pts[0].x, this.pts[0].y);
    this.pts.slice(1).forEach((p) => g.lineTo(p.x, p.y));
    g.strokePath();
    if (this.station > 0) {
      g.lineStyle(lw, COLOR.gold, 1).beginPath().moveTo(this.pts[0].x, this.pts[0].y);
      for (let i = 1; i <= this.station; i++) g.lineTo(this.pts[i].x, this.pts[i].y);
      g.strokePath();
    }
    // Camp marker at the start.
    g.fillStyle(this.steps > 0 || this.station > 0 ? COLOR.gold : 0x4a5268, 1).fillCircle(this.pts[0].x, this.pts[0].y, this.radius * 0.2);
    const s = this.radius * 0.17;
    for (const st of this.stones) {
      const on = this.steps >= st.step;
      g.fillStyle(on ? COLOR.goldBright : 0x2a3144, 1).lineStyle(Math.max(1, DPR), on ? COLOR.gold : 0x4a5268, 1);
      g.beginPath().moveTo(st.x, st.y - s).lineTo(st.x + s, st.y).lineTo(st.x, st.y + s).lineTo(st.x - s, st.y).closePath().fillPath().strokePath();
    }
    this.medals.forEach((m, i) => {
      const reached = i + 1 <= this.station;
      if (m instanceof Phaser.GameObjects.Image) m.setTint(reached ? 0xffffff : 0x7a8298);
      else m.setFillStyle(reached ? STATION_COLOR[i] : COLOR.stoneLight);
      this.names[i]?.setColor(reached ? COLOR.win : COLOR.dim);
    });
    // Base Camp flag above its station.
    this.flag.clear();
    if (this.campOn && this.campAt > 0) {
      const p = this.pts[this.campAt], h = this.radius * 0.95, x = p.x + this.radius * 0.62, y = p.y - this.radius * 0.55;
      this.flag.lineStyle(Math.max(2, DPR * 1.5), 0xf3ead6, 1).lineBetween(x, y, x, y - h);
      this.flag.fillStyle(COLOR.danger, 1).fillTriangle(x, y - h, x + h * 0.7, y - h * 0.72, x, y - h * 0.45);
    }
    this.sealDots.forEach((d, i) => d.setVisible(this.sealsOn).setFillStyle(i < this.seals ? COLOR.goldBright : 0x1d2431));
    this.sealLabel.setVisible(this.sealsOn);
    this.updatePulse();
    if (this.scene.time.now >= this.captionLock) this.caption.setText(this.nextText()).setColor(COLOR.text);
  }

  private nextText(): string {
    if (this.station >= 5) return t('trackDone');
    if (this.steps === 0 && this.station === 0) return t('trackIdle');
    const n = this.need[this.station] - this.steps;
    return t(n === 1 ? 'nextStation' : 'nextStationPl', { name: STATION_NAMES[this.station], n });
  }

  private updatePulse(): void {
    this.pulse?.stop(); this.pulse = null;
    this.rings.forEach((r) => r.setAlpha(0).setScale(1));
    if (this.station === 0 || REDUCED_MOTION) { if (this.station > 0) this.rings[this.station - 1].setAlpha(0.9); return; }
    const ring = this.rings[this.station - 1];
    ring.setAlpha(0.9);
    this.pulse = this.scene.tweens.add({ targets: ring, scale: 1.16, alpha: 0.25, duration: 800, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
  }

  /** Sets station and steps without animation (start of a spin). */
  reset(station: number, steps: number): void { this.station = station; this.steps = steps; this.redraw(); }

  /** Advances to the given progress, station by station, with each station's own unlock. */
  async advance(to: number, steps: number): Promise<void> {
    this.steps = steps;
    if (to <= this.station) { this.redraw(); await wait(this.scene, 90); return; }
    while (this.station < to) {
      this.station++;
      this.redraw();
      const m = this.medals[this.station - 1], p = this.worldOf(this.station), color = STATION_COLOR[this.station - 1];
      this.fx.flash(p.x, p.y, color, this.radius * 2.6, 420);
      this.fx.burst(p.x, p.y, color, 14);
      if (REDUCED_MOTION) await wait(this.scene, 170);
      else await tween(this.scene, { targets: m, scale: m.scale * 1.28, duration: 130, yoyo: true, ease: 'Sine.easeOut' });
    }
  }

  /** Shows an effect text in the caption line for a moment, in the station's colour. */
  announce(text: string, station: number, ms = 1300): void {
    const c = STATION_COLOR[station - 1] ?? COLOR.goldBright;
    this.caption.setText(text).setColor(`#${c.toString(16).padStart(6, '0')}`);
    this.captionLock = this.scene.time.now + ms;
    this.scene.time.delayedCall(ms + 20, () => { if (this.scene.time.now >= this.captionLock) this.caption.setText(this.nextText()).setColor(COLOR.text); });
  }

  setBaseCamp(station: number, visible: boolean): void { this.campAt = station; this.campOn = visible; this.redraw(); }
  setSeals(count: number, visible: boolean): void { this.seals = count; this.sealsOn = visible; this.redraw(); }

  /** Screen position of a station (1..5) or of the camp (0). */
  worldOf(station: number): { x: number; y: number } {
    const p = this.pts[Math.max(0, Math.min(5, station))] ?? { x: 0, y: 0 };
    return { x: this.x + p.x, y: this.y + p.y };
  }
  get captionText(): string { return this.caption.text; }
}
