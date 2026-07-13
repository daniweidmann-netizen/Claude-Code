import { Sample, SoundCategoryId } from '../types';
import { findPeaks, intervalsOf, windowSince } from './peaks';
import { clamp01, coefficientOfVariation, mean, percentile } from './stats';

/**
 * These detectors are plain rule-based DSP over a rolling loudness (dBFS)
 * stream, not a trained model. They classify by *pattern* (transient shape,
 * beep regularity, burst rate) rather than timbre, so they're a reasonable
 * v1 without shipping an ML model, but they will misfire on sounds that
 * share the same amplitude pattern (e.g. loud clapping can look like a
 * bark burst). `SoundClassifier` is the swap point for a real model later.
 */

export interface DetectionResult {
  category: SoundCategoryId;
  confidence: number;
}

// sensitivity in [0,1], 0.5 = neutral. `scale` is how many dB/units the
// threshold moves across the full sensitivity range.
function tune(base: number, sensitivity: number, scale: number): number {
  return base - (sensitivity - 0.5) * scale;
}

const MIN_HISTORY: Record<SoundCategoryId, number> = {
  glass_break: 1200,
  smoke_alarm: 6000,
  dog_bark: 5000,
  water_drip: 15000,
};

function hasEnoughHistory(window: Sample[], now: number, category: SoundCategoryId): boolean {
  if (window.length < 4) return false;
  return now - window[0].t >= MIN_HISTORY[category];
}

export function detectGlassBreak(all: Sample[], now: number, sensitivity: number): number {
  const window = windowSince(all, now, 2000);
  if (!hasEnoughHistory(window, now, 'glass_break')) return 0;

  const baseline = percentile(window.map((s) => s.db), 0.3);
  let maxJump = 0;
  let peak: Sample = window[0];
  for (let i = 1; i < window.length; i++) {
    const delta = window[i].db - window[i - 1].db;
    if (delta > maxJump) maxJump = delta;
    if (window[i].db > peak.db) peak = window[i];
  }

  const requiredJump = tune(30, sensitivity, 16);
  const requiredPeak = tune(-18, sensitivity, 16);
  if (maxJump < requiredJump || peak.db < requiredPeak) return 0;

  // A lone shatter is a single isolated transient. Repeated jumps of similar
  // size in the same window mean this is really a beeping/barking pattern.
  let bigJumps = 0;
  for (let i = 1; i < window.length; i++) {
    if (window[i].db - window[i - 1].db >= requiredJump * 0.6) bigJumps++;
  }
  if (bigJumps > 1) return 0;

  const after = all.filter((s) => s.t > peak.t + 700 && s.t <= peak.t + 1600);
  const decayed = after.length > 0 && mean(after.map((s) => s.db)) <= baseline + 15;
  if (!decayed) return 0;

  return clamp01(0.45 + (maxJump - requiredJump) / 30 + (peak.db - requiredPeak) / 30);
}

export function detectSmokeAlarm(all: Sample[], now: number, sensitivity: number): number {
  const window = windowSince(all, now, 12000);
  if (!hasEnoughHistory(window, now, 'smoke_alarm')) return 0;

  const baseline = percentile(window.map((s) => s.db), 0.4);
  const threshold = baseline + tune(20, sensitivity, 14);
  const peaks = findPeaks(window, threshold, 250);
  const minCount = Math.round(tune(4, sensitivity, 2));
  if (peaks.length < Math.max(3, minCount)) return 0;

  const intervals = intervalsOf(peaks);
  const meanInterval = mean(intervals);
  if (meanInterval < 250 || meanInterval > 2500) return 0;

  const cv = coefficientOfVariation(intervals);
  // Real alarms are quartz-timed and near-perfectly periodic; this is what
  // separates a beep pattern from irregular barking at similar cadence.
  const requiredCv = tune(0.15, sensitivity, 0.2);
  if (cv > requiredCv) return 0;

  return clamp01(0.5 + (peaks.length - 4) * 0.08 + (requiredCv - cv) * 1.5);
}

export function detectDogBark(all: Sample[], now: number, sensitivity: number): number {
  const window = windowSince(all, now, 10000);
  if (!hasEnoughHistory(window, now, 'dog_bark')) return 0;

  const baseline = percentile(window.map((s) => s.db), 0.4);
  const threshold = baseline + tune(14, sensitivity, 12);
  const peaks = findPeaks(window, threshold, 150);
  const minCount = Math.round(tune(5, sensitivity, 4));
  if (peaks.length < Math.max(3, minCount)) return 0;

  return clamp01(0.45 + (peaks.length - minCount) / 6);
}

export function detectWaterDrip(all: Sample[], now: number, sensitivity: number): number {
  const window = windowSince(all, now, 25000);
  if (!hasEnoughHistory(window, now, 'water_drip')) return 0;

  const dbs = window.map((s) => s.db);
  const baseline = percentile(dbs, 0.4);
  const quietCeiling = tune(-42, sensitivity, 8);
  if (baseline > quietCeiling) return 0;

  const threshold = baseline + tune(9, sensitivity, 6);
  const ceiling = baseline + tune(24, sensitivity, 6);
  const candidates = findPeaks(window, threshold, 300).filter((p) => p.db < ceiling);
  const minCount = Math.round(tune(5, sensitivity, 4));
  if (candidates.length < Math.max(4, minCount)) return 0;

  const intervals = intervalsOf(candidates);
  const meanInterval = mean(intervals);
  if (meanInterval < 300 || meanInterval > 6000) return 0;

  const cv = coefficientOfVariation(intervals);
  const requiredCv = tune(0.5, sensitivity, 0.3);
  if (cv > requiredCv) return 0;

  return clamp01(0.4 + (candidates.length - minCount) * 0.05 + (requiredCv - cv) * 0.5);
}

const DETECTORS: Record<SoundCategoryId, (all: Sample[], now: number, sensitivity: number) => number> = {
  glass_break: detectGlassBreak,
  smoke_alarm: detectSmokeAlarm,
  dog_bark: detectDogBark,
  water_drip: detectWaterDrip,
};

export function runDetectors(
  samples: Sample[],
  now: number,
  sensitivity: number,
  enabled: Record<SoundCategoryId, boolean>
): DetectionResult[] {
  const results: DetectionResult[] = [];
  for (const category of Object.keys(DETECTORS) as SoundCategoryId[]) {
    if (!enabled[category]) continue;
    const confidence = DETECTORS[category](samples, now, sensitivity);
    if (confidence > 0) results.push({ category, confidence });
  }
  return results.sort((a, b) => b.confidence - a.confidence);
}
