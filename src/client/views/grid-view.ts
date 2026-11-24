import Phaser from 'phaser';
import { tween, wait } from '../anim.js';
import { REDUCED_MOTION } from '../env.js';
import { COLOR, symbolKey } from '../theme.js';

const EMPTY = -1;

/**
 * Draws the grid and animates exactly what the event log says. It holds no
 * game logic: after a removal it only compacts the remaining sprites and adds
 * the symbols of the grid it is given.
 */
export class GridView extends Phaser.GameObjects.Container {
  private cell = 100;
  /** Edge length of the symbol textures in use (art and placeholders differ). */
  private readonly texSize: number;
  private readonly sprites: (Phaser.GameObjects.Image | null)[];
  private readonly ids: number[];
  private readonly frame: Phaser.GameObjects.Graphics;

  constructor(scene: Phaser.Scene, private readonly cols: number, private readonly rows: number) {
    super(scene);
    this.sprites = new Array(cols * rows).fill(null);
    this.ids = new Array(cols * rows).fill(EMPTY);
    this.texSize = scene.textures.get(symbolKey(0)).getSourceImage().width;
    this.frame = scene.add.graphics();
    this.add(this.frame);
    scene.add.existing(this);
  }

  /** Repositions everything for a new cell size (no animation). */
  layout(x: number, y: number, cell: number): void {
    this.setPosition(x, y);
    this.cell = cell;
    const w = cell * this.cols, h = cell * this.rows;
    const p = Math.round(cell * 0.06);
    this.frame.clear().fillStyle(COLOR.panel, 0.92).fillRoundedRect(-p, -p, w + 2 * p, h + 2 * p, p * 2)
      .lineStyle(Math.max(2, p / 3), COLOR.goldDark, 1).strokeRoundedRect(-p, -p, w + 2 * p, h + 2 * p, p * 2);
    this.sprites.forEach((s, i) => { if (s) this.place(s, i); });
  }

  private cx(i: number) { return ((i % this.cols) + 0.5) * this.cell; }
  private cy(i: number) { return (Math.floor(i / this.cols) + 0.5) * this.cell; }
  private scaleFor() { return (this.cell * 0.94) / this.texSize; }
  private place(s: Phaser.GameObjects.Image, i: number) { s.setPosition(this.cx(i), this.cy(i)).setScale(this.scaleFor()).setAlpha(1); }

  private spawn(i: number, id: number): Phaser.GameObjects.Image {
    const s = this.scene.add.image(this.cx(i), this.cy(i), symbolKey(id)).setScale(this.scaleFor());
    this.add(s);
    this.sprites[i] = s;
    this.ids[i] = id;
    return s;
  }

  /** New spin: clears the grid and drops in all symbols. */
  async fill(grid: number[]): Promise<void> {
    const old = this.sprites.filter((s): s is Phaser.GameObjects.Image => s !== null);
    this.sprites.fill(null); this.ids.fill(EMPTY);
    if (old.length) {
      await tween(this.scene, REDUCED_MOTION
        ? { targets: old, alpha: 0, duration: 120 }
        : { targets: old, y: `+=${this.cell * this.rows}`, alpha: 0, duration: 180, ease: 'Quad.easeIn' });
      old.forEach((s) => s.destroy());
    }
    const jobs: Promise<void>[] = [];
    if (REDUCED_MOTION) {
      const fresh = grid.map((id, i) => this.spawn(i, id).setAlpha(0));
      await tween(this.scene, { targets: fresh, alpha: 1, duration: 180 });
      return;
    }
    grid.forEach((id, i) => {
      const s = this.spawn(i, id);
      const col = i % this.cols, row = Math.floor(i / this.cols);
      s.y -= this.cell * (this.rows + 1); s.setAlpha(0);
      jobs.push(tween(this.scene, {
        targets: s, y: this.cy(i), alpha: 1, duration: 300, ease: 'Bounce.easeOut',
        delay: col * 45 + (this.rows - 1 - row) * 25,
      }));
    });
    await Promise.all(jobs);
  }

  async highlight(cells: number[]): Promise<void> {
    const targets = cells.map((i) => this.sprites[i]).filter((s): s is Phaser.GameObjects.Image => s !== null);
    if (!targets.length) return;
    targets.forEach((s) => this.bringToTop(s));
    if (REDUCED_MOTION) { await tween(this.scene, { targets, alpha: 0.45, duration: 160, yoyo: true, repeat: 1 }); return; }
    await tween(this.scene, { targets, scale: this.scaleFor() * 1.16, duration: 150, yoyo: true, repeat: 1, ease: 'Sine.easeInOut' });
  }

  async clear(positions: number[]): Promise<void> {
    const targets: Phaser.GameObjects.Image[] = [];
    for (const i of positions) {
      const s = this.sprites[i];
      if (s) targets.push(s);
      this.sprites[i] = null; this.ids[i] = EMPTY;
    }
    if (!targets.length) return;
    await tween(this.scene, REDUCED_MOTION ? { targets, alpha: 0, duration: 150 } : { targets, scale: 0, alpha: 0, duration: 190, ease: 'Back.easeIn' });
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
            jobs.push(tween(this.scene, { targets: k.s, y: this.cy(i), duration: 230, ease: 'Quad.easeIn' }));
          }
        });
        for (let r = 0; r < missing; r++) {
          const i = r * this.cols + c;
          const s = this.spawn(i, grid[i]);
          s.setAlpha(0);
          if (REDUCED_MOTION) { jobs.push(tween(this.scene, { targets: s, alpha: 1, duration: 180 })); continue; }
          s.y -= this.cell * (missing + 0.5);
          jobs.push(tween(this.scene, { targets: s, y: this.cy(i), alpha: 1, duration: 280, ease: 'Quad.easeIn', delay: 60 + c * 25 }));
        }
      }
      await Promise.all(jobs);
      jobs.length = 0;
    }
    // Whatever still differs was changed by a station effect: transform in place.
    grid.forEach((id, i) => {
      if (this.ids[i] === id) return;
      const s = this.sprites[i] ?? this.spawn(i, id);
      this.ids[i] = id;
      jobs.push((async () => {
        if (REDUCED_MOTION) {
          await tween(this.scene, { targets: s, alpha: 0, duration: 100 });
          s.setTexture(symbolKey(id));
          await tween(this.scene, { targets: s, alpha: 1, duration: 140 });
          return;
        }
        await tween(this.scene, { targets: s, scaleX: 0, duration: 110, ease: 'Quad.easeIn' });
        s.setTexture(symbolKey(id));
        await tween(this.scene, { targets: s, scaleX: this.scaleFor(), duration: 150, ease: 'Back.easeOut' });
      })());
    });
    if (jobs.length) { await Promise.all(jobs); await wait(this.scene, 120); }
  }

  /** Symbols currently shown, for consistency checks. */
  snapshot(): number[] { return [...this.ids]; }

  center(i: number): { x: number; y: number } { return { x: this.x + this.cx(i), y: this.y + this.cy(i) }; }

  get textureSize(): number { return this.texSize; }
}
