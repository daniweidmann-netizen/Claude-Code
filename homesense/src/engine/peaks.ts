import { Sample } from '../types';

export interface Peak {
  t: number;
  db: number;
}

/**
 * Greedy peak picker: groups consecutive samples above `thresholdDb` into a
 * region and keeps that region's loudest sample, then merges any resulting
 * peaks closer than `minSeparationMs` (keeping the louder one). Works on a
 * plain dB stream, no FFT needed.
 */
export function findPeaks(samples: Sample[], thresholdDb: number, minSeparationMs: number): Peak[] {
  const raw: Peak[] = [];
  let region: Peak | null = null;

  for (const s of samples) {
    if (s.db >= thresholdDb) {
      if (!region || s.db > region.db) region = { t: s.t, db: s.db };
    } else if (region) {
      raw.push(region);
      region = null;
    }
  }
  if (region) raw.push(region);

  const merged: Peak[] = [];
  for (const p of raw) {
    const last = merged[merged.length - 1];
    if (last && p.t - last.t < minSeparationMs) {
      if (p.db > last.db) merged[merged.length - 1] = p;
    } else {
      merged.push(p);
    }
  }
  return merged;
}

export function windowSince(samples: Sample[], now: number, spanMs: number): Sample[] {
  return samples.filter((s) => now - s.t <= spanMs);
}

export function intervalsOf(peaks: Peak[]): number[] {
  const out: number[] = [];
  for (let i = 1; i < peaks.length; i++) out.push(peaks[i].t - peaks[i - 1].t);
  return out;
}
