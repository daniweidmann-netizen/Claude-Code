import { DRAWABLE, EMPTY } from '../config/types.js';
import type { Rng, WeightedTable } from '../rng/rng.js';

/**
 * Grid layout: index = row * cols + col, row 0 is the top row.
 * Draw order (part of the specification): columns left to right, within a
 * column from the bottom empty cell upwards.
 */

/** Fills every EMPTY cell in the specified draw order. Returns the number of cells drawn. */
export function fillEmpty(grid: Int8Array, cols: number, rows: number, table: WeightedTable, rng: Rng): number {
  let drawn = 0;
  for (let c = 0; c < cols; c++) {
    for (let r = rows - 1; r >= 0; r--) {
      const i = r * cols + c;
      if (grid[i] === EMPTY) {
        grid[i] = DRAWABLE[table.pick(rng)];
        drawn++;
      }
    }
  }
  return drawn;
}

/** Lets all symbols fall down within their column; EMPTY cells collect at the top. */
export function applyGravity(grid: Int8Array, cols: number, rows: number): void {
  for (let c = 0; c < cols; c++) {
    let write = rows - 1;
    for (let r = rows - 1; r >= 0; r--) {
      const v = grid[r * cols + c];
      if (v !== EMPTY) {
        if (write !== r) {
          grid[write * cols + c] = v;
          grid[r * cols + c] = EMPTY;
        }
        write--;
      }
    }
  }
}
