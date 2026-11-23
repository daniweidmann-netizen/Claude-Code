import { PAY_SYMBOL_COUNT, Sym } from '../config/types.js';

export interface Cluster {
  symbol: number;
  /** Number of cells including wilds. */
  size: number;
  cells: number[];
}

/**
 * Finds all paying clusters. A cluster is an orthogonally connected set of
 * cells showing one pay symbol or a wild (Wild/Explorer), containing at least
 * one pay symbol and at least `minSize` cells. A wild may belong to clusters
 * of several different symbols.
 *
 * Clusters are returned ordered by symbol id, then by lowest cell index.
 */
export function findClusters(grid: ArrayLike<number>, cols: number, rows: number, minSize: number): Cluster[] {
  const n = cols * rows;
  const out: Cluster[] = [];
  const seen = new Int8Array(n);
  const stack = new Int16Array(n);
  for (let s = 0; s < PAY_SYMBOL_COUNT; s++) {
    seen.fill(0);
    for (let start = 0; start < n; start++) {
      if (grid[start] !== s || seen[start]) continue;
      const cells: number[] = [];
      let top = 0;
      stack[top++] = start;
      seen[start] = 1;
      while (top > 0) {
        const p = stack[--top];
        cells.push(p);
        const c = p % cols;
        const r = (p - c) / cols;
        for (let d = 0; d < 4; d++) {
          let q: number;
          if (d === 0) { if (r === 0) continue; q = p - cols; }
          else if (d === 1) { if (r === rows - 1) continue; q = p + cols; }
          else if (d === 2) { if (c === 0) continue; q = p - 1; }
          else { if (c === cols - 1) continue; q = p + 1; }
          if (seen[q]) continue;
          const g = grid[q];
          if (g === s || g === Sym.WILD || g === Sym.EXPLORER) {
            seen[q] = 1;
            stack[top++] = q;
          }
        }
      }
      if (cells.length >= minSize) {
        cells.sort((a, b) => a - b);
        out.push({ symbol: s, size: cells.length, cells });
      }
    }
  }
  return out;
}
