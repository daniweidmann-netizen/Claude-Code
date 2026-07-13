export function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

export function stdev(values: number[]): number {
  if (values.length < 2) return 0;
  const m = mean(values);
  const variance = mean(values.map((v) => (v - m) ** 2));
  return Math.sqrt(variance);
}

export function percentile(values: number[], p: number): number {
  if (values.length === 0) return -160;
  const sorted = [...values].sort((a, b) => a - b);
  const idx = Math.min(sorted.length - 1, Math.max(0, Math.floor(p * sorted.length)));
  return sorted[idx];
}

export function coefficientOfVariation(values: number[]): number {
  const m = mean(values);
  if (m === 0) return Infinity;
  return stdev(values) / m;
}

export function clamp01(v: number): number {
  return Math.min(1, Math.max(0, v));
}
