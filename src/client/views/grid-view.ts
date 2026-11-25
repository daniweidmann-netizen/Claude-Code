import Phaser from 'phaser';
import { tween, wait } from '../anim.js';
import { DPR, REDUCED_MOTION } from '../env.js';
import type { Fx } from '../fx.js';
import { COLOR, DEPTH, DISPLAY, SYMBOL_ACCENT, symbolKey } from '../theme.js';

const EMPTY = -1;

/**
 * Draws the grid and animates exactly what the event log says. It holds no
 * game logic: after a removal it only compacts the remaining sprites and adds
 * the symbols of the grid it is given.
 *
 * Symbols are never stretched: every animation keeps the aspect ratio, and a
 * mask keeps falling symbols inside the play field.
 */
export class GridView extends Phaser.GameObjects.Container {
  private cell = 100;
  private readonly texSize: number;
  private readonly sprites: (Phaser.GameObjects.Image | null)[];
  private readonly ids: number[];
  private readonly frame: Phaser.GameObjects.Graphics;
  private readonly tiles: Phaser.GameObjects.Image[] = [];
  private readonly auras: Phaser.GameObjects.Image[] = [];
  private readonly shadows: Phaser.GameObjects.Image[] = [];
  private readonly marks: Phaser.GameObjects.Graphics;
  private frameArt: Phaser.GameObjects.Image | null = null;
  private frameHole: number[] | null = null;
  private shimmer = 0;
  private readonly glow: Phaser.GameObjects.Graphics;
  private readonly symbols: Phaser.GameObjects.Container;
  private readonly maskShape: Phaser.GameObjects.Graphics;
  private readonly hasTiles: boolean;

  constructor(scene: Phaser.Scene, private readonly cols: number, private readonly rows: number, private readonly fx: Fx) {
    super(scene);
    const n = cols * rows;
    this.sprites = new Array(n).fill(null);
    this.ids = new Array(n).fill(EMPTY);
    this.texSize = scene.textures.get(symbolKey(0)).getSourceImage().width;
    this.hasTiles = scene.textures.exists('tile');
    this.frame = scene.add.graphics();
    this.add(this.frame);
    for (let i = 0; i < n; i++) {
      if (this.hasTiles) { const t = scene.add.image(0, 0, 'tile'); this.tiles.push(t); this.add(t); }
      const a = scene.add.image(0, 0, 'fx_glow').setAlpha(0).setBlendMode('ADD'); this.auras.push(a); this.add(a);
      const sh = scene.add.image(0, 0, 'fx_shadow').setAlpha(0); this.shadows.push(sh); this.add(sh);
    }
    this.marks = scene.add.graphics();
    this.add(this.marks);
    // Carved frame around the play field; its opening is aligned with the grid.
    const meta = scene.cache.json.get('frameMeta') as { w: number; h: number; hole: number[] } | undefined;
    if (scene.textures.exists('frame') && meta) {
      this.frameArt = scene.add.image(0, 0, 'frame').setOrigin(0, 0);
      this.frameHole = [meta.hole[0] / meta.w, meta.hole[1] / meta.h, meta.hole[2] / meta.w, meta.hole[3] / meta.h];
    }
    // Slow shimmer on Wilds and the Explorer (decoration only).
    if (!REDUCED_MOTION) scene.tweens.addCounter({ from: 0, to: 1, duration: 1400, yoyo: true, repeat: -1, ease: 'Sine.easeInOut', onUpdate: (tw) => { this.shimmer = tw.getValue() ?? 0; this.applyShimmer(); } });
    this.glow = scene.add.graphics();
    this.symbols = scene.add.container(0, 0);
    this.add([this.glow, this.symbols]);
    if (this.frameArt) this.add(this.frameArt);
    this.maskShape = scene.make.graphics({}, false);
    this.symbols.setMask(this.maskShape.createGeometryMask());
    this.setDepth(DEPTH.grid);
    scene.add.existing(this);
  }

  /** Repositions everything for a new cell size (no animation). */
  layout(x: number, y: number, cell: number): void {
    this.setPosition(x, y);
    this.cell = cell;
    const w = cell * this.cols, h = cell * this.rows, p = Math.round(cell * 0.07);
    this.frame.clear();
    if (this.frameArt && this.frameHole) {
      // Dark recess behind the tiles, a soft drop shadow, then the carved frame whose opening matches the grid.
      const [hx0, hy0, hx1, hy1] = this.frameHole;
      const fw = (w + p * 1.2) / (hx1 - hx0), fh = (h + p * 1.2) / (hy1 - hy0);
      const fx = -p * 0.6 - hx0 * fw, fy = -p * 0.6 - hy0 * fh;
      this.frame.fillStyle(0x000000, 0.35).fillRoundedRect(fx + p * 0.4, fy + p * 0.9, fw, fh, p * 2);
      this.frame.fillStyle(0x05080e, 0.94).fillRect(-p, -p, w + 2 * p, h + 2 * p);
      this.frameArt.setPosition(fx, fy).setDisplaySize(fw, fh);
    } else {
      this.frame.fillStyle(0x070a11, 0.86).fillRoundedRect(-p, -p, w + 2 * p, h + 2 * p, p * 2)
        .lineStyle(Math.max(2, p / 2.5), COLOR.goldDark, 1).strokeRoundedRect(-p, -p, w + 2 * p, h + 2 * p, p * 2)
        .lineStyle(Math.max(1, p / 6), COLOR.goldBright, 0.5).strokeRoundedRect(-p * 0.55, -p * 0.55, w + p * 1.1, h + p * 1.1, p * 1.6);
    }
    this.maskShape.clear().fillStyle(0xffffff).fillRect(x - p * 0.5, y - p * 0.5, w + p, h + p);
    for (let i = 0; i < this.cols * this.rows; i++) {
      this.tiles[i]?.setPosition(this.cx(i), this.cy(i)).setDisplaySize(cell * 0.96, cell * 0.96);
      this.auras[i].setPosition(this.cx(i), this.cy(i)).setDisplaySize(cell * 1.1, cell * 1.1);
      this.shadows[i].setPosition(this.cx(i), this.cy(i) + cell * 0.36).setDisplaySize(cell * 0.78, cell * 0.24);
    }
    this.sprites.forEach((s, i) => { if (s) this.place(s, i); });
    this.drawMarks();
  }

  private cx(i: number) { return ((i % this.cols) + 0.5) * this.cell; }
  private cy(i: number) { return (Math.floor(i / this.cols) + 0.5) * this.cell; }
  private scaleFor() { return (this.cell * 0.9) / this.texSize; }
  private place(s: Phaser.GameObjects.Image, i: number) { s.setPosition(this.cx(i), this.cy(i)).setScale(this.scaleFor()).setAlpha(1); }
  private setAura(i: number, id: number) {
    this.auras[i].setTint(SYMBOL_ACCENT[id] ?? 0xffffff).setAlpha(id === EMPTY ? 0 : id === 5 || id === 8 ? 0.5 : 0.3);
    this.shadows[i].setAlpha(id === EMPTY ? 0 : 0.6);
  }
  /** Wilds and the Explorer pulse gently so they stand out between cascades. */
  private applyShimmer(): void {
    for (let i = 0; i < this.ids.length; i++) if (this.ids[i] === 5 || this.ids[i] === 8) this.auras[i].setAlpha(0.38 + this.shimmer * 0.4);
  }
  /** Gold ring with an anchor notch around the Explorer: it stays on the grid when it wins. */
  private drawMarks(): void {
    const g = this.marks.clear(), r = this.cell * 0.455;
    this.ids.forEach((id, i) => {
      if (id !== 8) return;
      const x = this.cx(i), y = this.cy(i);
      g.lineStyle(Math.max(2, this.cell * 0.05), COLOR.goldBright, 1).strokeCircle(x, y, r);
      g.fillStyle(COLOR.goldBright, 1).fillTriangle(x - r * 0.16, y + r * 0.96, x + r * 0.16, y + r * 0.96, x, y + r * 1.2);
    });
  }

  private spawn(i: number, id: number): Phaser.GameObjects.Image {
    const s = this.scene.add.image(this.cx(i), this.cy(i), symbolKey(id)).setScale(this.scaleFor());
    this.symbols.add(s);
    this.sprites[i] = s;
    this.ids[i] = id;
    return s;
  }

  /** Shows a grid at once, without animation (start preview). */
  show(grid: number[]): void {
    this.sprites.forEach((s) => s?.destroy());
    this.sprites.fill(null); this.ids.fill(EMPTY);
    grid.forEach((id, i) => { this.spawn(i, id); this.setAura(i, id); });
    this.drawMarks();
  }

  /** New spin: clears the grid and drops in all symbols. */
  async fill(grid: number[]): Promise<void> {
    const old = this.sprites.filter((s): s is Phaser.GameObjects.Image => s !== null);
    this.sprites.fill(null); this.ids.fill(EMPTY);
    this.auras.forEach((a) => a.setAlpha(0));
    this.shadows.forEach((a) => a.setAlpha(0));
    this.marks.clear();
    if (REDUCED_MOTION) {
      // Cross-fade: the play field is never empty.
      const fresh = grid.map((id, i) => this.spawn(i, id).setAlpha(0));
      if (old.length) void tween(this.scene, { targets: old, alpha: 0, duration: 180 }).then(() => old.forEach((s) => s.destroy()));
      await tween(this.scene, { targets: fresh, alpha: 1, duration: 180 });
      grid.forEach((id, i) => this.setAura(i, id));
      return;
    }
    const jobs: Promise<void>[] = [];
    // The old symbols drop out column by column while the new ones follow right behind them,
    // like one continuous reel movement: there is no frame with an empty play field.
    // Each column moves as one strip: the new symbols sit directly above the old ones and
    // travel the same distance with the same easing, so every column stays filled throughout.
    const strip = old.length > 0;
    const travel = this.cell * (this.rows + 0.35);
    const ms = strip ? 380 : 320;
    for (const s of old) {
      const col = Math.max(0, Math.min(this.cols - 1, Math.floor(s.x / this.cell)));
      this.scene.tweens.add({ targets: s, y: s.y + travel, duration: ms, ease: 'Cubic.easeIn', delay: col * 60, onComplete: () => s.destroy() });
    }
    grid.forEach((id, i) => {
      const s = this.spawn(i, id);
      const col = i % this.cols, row = Math.floor(i / this.cols);
      s.y -= strip ? travel : this.cell * (this.rows + 1);
      jobs.push(tween(this.scene, {
        targets: s, y: this.cy(i), duration: ms, ease: 'Cubic.easeIn', delay: col * 60 + (strip ? 0 : (this.rows - 1 - row) * 22),
      }).then(() => this.settle(s, i)));
    });
    for (let c = 0; c < this.cols; c++) {
      // A puff of dust where each column lands.
      this.scene.time.delayedCall(ms + c * 60 + (strip ? 0 : 88), () => this.fx.flash(this.x + (c + 0.5) * this.cell, this.y + this.cell * this.rows, 0xcdbb95, this.cell * 0.55, 240));
    }
    await Promise.all(jobs);
    grid.forEach((id, i) => this.setAura(i, id));
    this.drawMarks();
  }

  /** Tiny rebound after landing; position only, the symbol keeps its shape. */
  private settle(s: Phaser.GameObjects.Image, i: number): Promise<void> {
    return tween(this.scene, { targets: s, y: this.cy(i) - this.cell * 0.05, duration: 80, yoyo: true, ease: 'Sine.easeOut' });
  }

  /**
   * Marks winning clusters: outline and glow in the symbol's colour, the rest
   * of the grid dims, and the amount appears at the cluster.
   */
  async showWin(clusters: { symbol: number; cells: number[]; label: string }[]): Promise<void> {
    const winning = new Set(clusters.flatMap((c) => c.cells));
    const others = this.sprites.filter((s, i): s is Phaser.GameObjects.Image => s !== null && !winning.has(i));
    const targets = [...winning].map((i) => this.sprites[i]).filter((s): s is Phaser.GameObjects.Image => s !== null);
    if (!targets.length) return;
    const line = Math.max(2, this.cell * 0.05), half = this.cell * 0.47, r = this.cell * 0.14;
    this.glow.clear();
    const labels: Phaser.GameObjects.Text[] = [];
    for (const c of clusters) {
      const color = SYMBOL_ACCENT[c.symbol] ?? COLOR.gold;
      let sx = 0, sy = 0;
      for (const i of c.cells) {
        this.glow.fillStyle(color, 0.22).fillRoundedRect(this.cx(i) - half, this.cy(i) - half, half * 2, half * 2, r)
          .lineStyle(line, color, 1).strokeRoundedRect(this.cx(i) - half, this.cy(i) - half, half * 2, half * 2, r);
        sx += this.cx(i); sy += this.cy(i);
        this.fx.burst(this.x + this.cx(i), this.y + this.cy(i), color, 3);
      }
      const label = this.scene.add.text(sx / c.cells.length, sy / c.cells.length, c.label, {
        fontFamily: DISPLAY, fontSize: `${Math.round(this.cell * 0.36)}px`, color: '#fff6d6', stroke: '#05070c', strokeThickness: Math.round(this.cell * 0.09),
      }).setOrigin(0.5).setAlpha(0);
      this.add(label); labels.push(label);
    }
    this.glow.setAlpha(0);
    const show = tween(this.scene, { targets: [this.glow, ...labels], alpha: 1, duration: 160 });
    const dim = others.length ? tween(this.scene, { targets: others, alpha: 0.38, duration: 160 }) : Promise.resolve();
    await Promise.all([show, dim]);
    if (REDUCED_MOTION) await wait(this.scene, 420);
    else await tween(this.scene, { targets, scale: this.scaleFor() * 1.12, duration: 210, yoyo: true, ease: 'Sine.easeInOut' });
    await wait(this.scene, 280);
    await tween(this.scene, { targets: [this.glow, ...labels], alpha: 0, duration: 140 });
    labels.forEach((l) => l.destroy());
    this.glow.clear();
    if (others.length) this.scene.tweens.add({ targets: others, alpha: 1, duration: 140 });
  }

  /** Brief highlight without a win (keys, compasses). */
  async highlight(cells: number[], color: number = COLOR.gold): Promise<void> {
    const targets = cells.map((i) => this.sprites[i]).filter((s): s is Phaser.GameObjects.Image => s !== null);
    if (!targets.length) return;
    cells.forEach((i) => this.fx.flash(this.x + this.cx(i), this.y + this.cy(i), color, this.cell * 0.7));
    if (REDUCED_MOTION) { await tween(this.scene, { targets, alpha: 0.5, duration: 150, yoyo: true }); return; }
    await tween(this.scene, { targets, scale: this.scaleFor() * 1.12, duration: 140, yoyo: true, ease: 'Sine.easeInOut' });
  }

  /** Removes symbols: they dissolve into sparks. */
  async clear(positions: number[]): Promise<void> {
    const targets: Phaser.GameObjects.Image[] = [];
    for (const i of positions) {
      const s = this.sprites[i];
      if (s) {
        targets.push(s);
        this.fx.burst(this.x + this.cx(i), this.y + this.cy(i), SYMBOL_ACCENT[this.ids[i]] ?? COLOR.gold, 7);
      }
      // Afterglow in the symbol's colour, so an emptied tile never looks like a gap.
      this.fx.flash(this.x + this.cx(i), this.y + this.cy(i), SYMBOL_ACCENT[this.ids[i]] ?? COLOR.gold, this.cell * 0.62, 420);
      this.sprites[i] = null; this.ids[i] = EMPTY;
      this.auras[i].setAlpha(0);
      this.shadows[i].setAlpha(0);
    }
    this.drawMarks();
    if (!targets.length) return;
    // The dissolve runs on its own: falling starts while the last sparks are still in the air (no pause).
    void tween(this.scene, REDUCED_MOTION
      ? { targets, alpha: 0, duration: 150 }
      : { targets, scale: this.scaleFor() * 0.55, alpha: 0, duration: 260, ease: 'Cubic.easeIn' }).then(() => targets.forEach((s) => s.destroy()));
    await wait(this.scene, REDUCED_MOTION ? 180 : 150);
  }

  /** Brings the view to `grid`: gravity and refill after a removal, in-place changes otherwise. */
  async cascade(grid: number[]): Promise<void> {
    const jobs: Promise<void>[] = [];
    if (this.ids.includes(EMPTY)) {
      for (let c = 0; c < this.cols; c++) {
        const kept: { s: Phaser.GameObjects.Image; id: number }[] = [];
        for (let r = 0; r < this.rows; r++) {
          const i = r * this.cols + c;
          const s = this.sprites[i];
          if (s) kept.push({ s, id: this.ids[i] });
          this.sprites[i] = null; this.ids[i] = EMPTY;
        }
        const missing = this.rows - kept.length;
        kept.forEach((k, n) => {
          const i = (missing + n) * this.cols + c;
          this.sprites[i] = k.s; this.ids[i] = k.id;
          if (REDUCED_MOTION) k.s.y = this.cy(i);
          else if (Math.abs(k.s.y - this.cy(i)) > 0.5) {
            const dist = (this.cy(i) - k.s.y) / this.cell;
            jobs.push(tween(this.scene, { targets: k.s, y: this.cy(i), duration: 220 + dist * 60, ease: 'Cubic.easeIn', delay: c * 22 }).then(() => this.settle(k.s, i)));
          }
        });
        for (let r = 0; r < missing; r++) {
          const i = r * this.cols + c;
          const s = this.spawn(i, grid[i]);
          if (REDUCED_MOTION) { s.setAlpha(0); jobs.push(tween(this.scene, { targets: s, alpha: 1, duration: 180 })); continue; }
          s.y -= this.cell * (missing + 0.6);
          jobs.push(tween(this.scene, { targets: s, y: this.cy(i), duration: 340, ease: 'Cubic.easeIn', delay: 60 + c * 22 + (missing - 1 - r) * 30 }).then(() => this.settle(s, i)));
        }
      }
      await Promise.all(jobs);
      jobs.length = 0;
      this.ids.forEach((id, i) => this.setAura(i, id));
      this.drawMarks();
    }
    // Whatever still differs was changed by a station effect: a flash of light and a cross-fade at full size.
    grid.forEach((id, i) => {
      if (this.ids[i] === id) return;
      const old = this.sprites[i];
      this.ids[i] = id;
      const color = SYMBOL_ACCENT[id] ?? COLOR.gold;
      const fresh = this.scene.add.image(this.cx(i), this.cy(i), symbolKey(id)).setScale(this.scaleFor()).setAlpha(0);
      this.symbols.add(fresh);
      this.sprites[i] = fresh;
      this.fx.flash(this.x + this.cx(i), this.y + this.cy(i), color, this.cell * 0.95, 380);
      this.fx.burst(this.x + this.cx(i), this.y + this.cy(i), color, 10);
      jobs.push((async () => {
        const out = old ? tween(this.scene, { targets: old, alpha: 0, duration: 150 }) : Promise.resolve();
        await Promise.all([out, tween(this.scene, { targets: fresh, alpha: 1, duration: 190 })]);
        old?.destroy();
        this.setAura(i, id);
        this.drawMarks();
      })());
    });
    if (jobs.length) { await Promise.all(jobs); await wait(this.scene, 130); }
  }

  /**
   * The Sun Relic's moment: its emblem and value appear on the cell before the
   * cell turns into a Wild (the transformation itself follows with the next grid state).
   */
  async showRelic(cell: number, value: number): Promise<void> {
    const key = this.scene.textures.exists('station4') ? 'station4' : symbolKey(5);
    const size = this.cell * 0.98;
    const img = this.scene.add.image(this.cx(cell), this.cy(cell), key).setDisplaySize(size, size).setAlpha(0);
    const label = this.scene.add.text(this.cx(cell), this.cy(cell) + this.cell * 0.02, `+${value}`, {
      fontFamily: DISPLAY, fontSize: `${Math.round(this.cell * 0.4)}px`, color: '#fff6d6', stroke: '#05070c', strokeThickness: Math.round(this.cell * 0.1),
    }).setOrigin(0.5).setAlpha(0);
    this.add([img, label]);
    this.fx.raysBrief(this.x + this.cx(cell), this.y + this.cy(cell), this.cell * 1.3, COLOR.goldBright, 900);
    if (!REDUCED_MOTION) { img.setScale(img.scale * 0.6); this.scene.tweens.add({ targets: img, scale: size / img.width, duration: 260, ease: 'Back.easeOut' }); }
    await tween(this.scene, { targets: [img, label], alpha: 1, duration: 180 });
    await wait(this.scene, 520);
    await tween(this.scene, { targets: [img, label], alpha: 0, duration: 200 });
    img.destroy(); label.destroy();
  }

  /** Cells currently showing the given symbol. */
  cellsOf(id: number): number[] { return this.ids.flatMap((v, i) => (v === id ? [i] : [])); }
  /** Symbols currently shown, for consistency checks. */
  snapshot(): number[] { return [...this.ids]; }
  /** Number of symbols whose centre is inside the play field right now (leaving and arriving ones included). */
  fieldCount(): number {
    const h = this.cell * this.rows;
    let n = 0;
    for (const s of this.symbols.list as Phaser.GameObjects.Image[]) if (s.y >= 0 && s.y <= h && s.alpha > 0.3) n++;
    return n;
  }
  /** Largest deviation of any symbol from its natural aspect ratio (must stay 0). */
  maxDistortion(): number {
    let worst = 0;
    for (const s of this.sprites) if (s) worst = Math.max(worst, Math.abs(s.scaleX - s.scaleY) / Math.max(s.scaleY, 1e-6));
    return worst;
  }
  center(i: number): { x: number; y: number } { return { x: this.x + this.cx(i), y: this.y + this.cy(i) }; }
  get middle(): { x: number; y: number } { return { x: this.x + (this.cell * this.cols) / 2, y: this.y + (this.cell * this.rows) / 2 }; }
  get textureSize(): number { return this.texSize; }
  get lineWidth(): number { return Math.max(2, 1.5 * DPR); }
}
