import { DRAWABLE, type GameConfig, type Rng } from '../../src/engine/index.js';

/** Test-only RNG that returns a prepared sequence of nextInt results. */
export class ScriptedRng implements Rng {
  private i = 0;
  constructor(private readonly values: number[]) {}
  nextInt(n: number): number {
    if (this.i >= this.values.length) throw new Error(`ScriptedRng exhausted after ${this.i} draws`);
    const v = this.values[this.i++];
    if (v < 0 || v >= n) throw new Error(`ScriptedRng: value ${v} out of range for nextInt(${n}) at draw ${this.i - 1}`);
    return v;
  }
  get remaining(): number { return this.values.length - this.i; }
}

/** nextInt value that makes the weighted symbol table return `symbol`. */
export function drawFor(weights: number[], symbol: number): number {
  const idx = DRAWABLE.indexOf(symbol as (typeof DRAWABLE)[number]);
  let sum = 0;
  for (let i = 0; i < idx; i++) sum += weights[i];
  return sum;
}

/** Draw values that produce the given grid (rows top to bottom) on an initial fill. */
export function drawsForGrid(cfg: GameConfig, weights: number[], rowsTopDown: number[][]): number[] {
  const out: number[] = [];
  for (let c = 0; c < cfg.cols; c++) {
    for (let r = cfg.rows - 1; r >= 0; r--) out.push(drawFor(weights, rowsTopDown[r][c]));
  }
  return out;
}

/** A grid without any two equal orthogonal neighbours. */
export function quietGrid(cfg: GameConfig): number[][] {
  return Array.from({ length: cfg.rows }, (_, r) => Array.from({ length: cfg.cols }, (_, c) => (c + 2 * r) % 5));
}
