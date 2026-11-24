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
    }
    this.glow = scene.add.graphics();
    this.symbols = scene.add.container(0, 0);
    this.add([this.glow, this.symbols]);
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
    this.frame.clear().fillStyle(0x070a11, 0.86).fillRoundedRect(-p, -p, w + 2 * p, h + 2 * p, p * 2)
      .lineStyle(Math.max(2, p / 2.5), COLOR.goldDark, 1).strokeRoundedRect(-p, -p, w + 2 * p, h + 2 * p, p * 2)
      .lineStyle(Math.max(1, p / 6), COLOR.goldBright, 0.5).strokeRoundedRect(-p * 0.55, -p * 0.55, w + p * 1.1, h + p * 1.1, p * 1.6);
    this.maskShape.clear().fillStyle(0xffffff).fillRect(x - p * 0.5, y - p * 0.5, w + p, h + p);
    for (let i = 0; i < this.cols * this.rows; i++) {
      this.tiles[i]?.setPosition(this.cx(i), this.cy(i)).setDisplaySize(cell * 0.96, cell * 0.96);
      this.auras[i].setPosition(this.cx(i), this.cy(i)).setDisplaySize(cell * 1.05, cell * 1.05);
    }
    this.sprites.forEach((s, i) => { if (s) this.place(s, i); });
  }

  private cx(i: number) { return ((i % this.cols) + 0.5) * this.cell; }
  private cy(i: number) { return (Math.floor(i / this.cols) + 0.5) * this.cell; }
  private scaleFor() { return (this.cell * 0.9) / this.texSize; }
  private place(s: Phaser.GameObjects.Image, i: number) { s.setPosition(this.cx(i), this.cy(i)).setScale(this.scaleFor()).setAlpha(1); }
  private setAura(i: number, id: number) {
    this.auras[i].setTint(SYMBOL_ACCENT[id] ?? 0xffffff).setAlpha(id === EMPTY ? 0 : id === 5 || id === 8 ? 0.42 : 0.2);
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
  }

  /** New spin: clears the grid and drops in all symbols. */
  async fill(grid: number[]): Promise<void> {
    const old = this.sprites.filter((s): s is Phaser.GameObjects.Image => s !== null);
    this.sprites.fill(null); this.ids.fill(EMPTY);
    this.auras.forEach((a) => a.setAlpha(0));
    if (old.length) {
      await tween(this.scene, REDUCED_MOTION
        ? { targets: old, alpha: 0, duration: 120 }
        : { targets: old, y: `+=${this.cell * (this.rows + 0.6)}`, duration: 190, ease: 'Cubic.easeIn' });
      old.forEach((s) => s.destroy());
    }
    if (REDUCED_MOTION) {
      const fresh = grid.map((id, i) => this.spawn(i, id).setAlpha(0));
      await tween(this.scene, { targets: fresh, alpha: 1, duration: 180 });
      grid.forEach((id, i) => this.setAura(i, id));
      return;
    }
    const jobs: Promise<void>[] = [];
    grid.forEach((id, i) => {
      const s = this.spawn(i, id);
      const col = i % this.cols, row = Math.floor(i / this.cols);
      s.y -= this.cell * (this.rows + 1);
      jobs.push(tween(this.scene, {
        targets: s, y: this.cy(i), duration: 270, ease: 'Cubic.easeIn', delay: col * 38 + (this.rows - 1 - row) * 22,
      }).then(() => this.settle(s, i)));
    });
    await Promise.all(jobs);
    grid.forEach((id, i) => this.setAura(i, id));
  }

  /** Tiny rebound after landing; position only, the symbol keeps its shape. */
  private settle(s: Phaser.GameObjects.Image, i: number): Promise<void> {
    return tween(this.scene, { targets: s, y: this.cy(i) - this.cell * 0.045, duration: 60, yoyo: true, ease: 'Sine.easeOut' });
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
    const show = tween(this.scene, { targets: [this.glow, ...labels], alpha: 1, duration: 110 });
    const dim = others.length ? tween(this.scene, { targets: others, alpha: 0.38, duration: 110 }) : Promise.resolve();
    await Promise.all([show, dim]);
    if (REDUCED_MOTION) await wait(this.scene, 420);
    else await tween(this.scene, { targets, scale: this.scaleFor() * 1.1, duration: 150, yoyo: true, repeat: 1, ease: 'Sine.easeInOut' });
    await wait(this.scene, 90);
    await tween(this.scene, { targets: [this.glow, ...labels], alpha: 0, duration: 110 });
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
      this.sprites[i] = null; this.ids[i] = EMPTY;
      this.auras[i].setAlpha(0);
    }
    if (!targets.length) return;
    await tween(this.scene, REDUCED_MOTION
      ? { targets, alpha: 0, duration: 150 }
      : { targets, scale: this.scaleFor() * 0.55, alpha: 0, duration: 170, ease: 'Cubic.easeIn' });
    targets.forEach((s) => s.destroy());
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
            jobs.push(tween(this.scene, { targets: k.s, y: this.cy(i), duration: 150 + dist * 45, ease: 'Cubic.easeIn', delay: c * 18 }).then(() => this.settle(k.s, i)));
          }
        });
        for (let r = 0; r < missing; r++) {
          const i = r * this.cols + c;
          const s = this.spawn(i, grid[i]);
          if (REDUCED_MOTION) { s.setAlpha(0); jobs.push(tween(this.scene, { targets: s, alpha: 1, duration: 180 })); continue; }
          s.y -= this.cell * (missing + 0.6);
          jobs.push(tween(this.scene, { targets: s, y: this.cy(i), duration: 240, ease: 'Cubic.easeIn', delay: 50 + c * 18 + (missing - 1 - r) * 20 }).then(() => this.settle(s, i)));
        }
      }
      await Promise.all(jobs);
      jobs.length = 0;
      this.ids.forEach((id, i) => this.setAura(i, id));
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
      })());
    });
    if (jobs.length) { await Promise.all(jobs); await wait(this.scene, 130); }
  }

  /** Cells currently showing the given symbol. */
  cellsOf(id: number): number[] { return this.ids.flatMap((v, i) => (v === id ? [i] : [])); }
  /** Symbols currently shown, for consistency checks. */
  snapshot(): number[] { return [...this.ids]; }
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
