import { COOLDOWN_MS } from '../constants/categories';
import { runDetectors } from '../engine/detectors';
import { AppSettings, DetectionEvent, Sample, SoundCategoryId } from '../types';

const BUFFER_SPAN_MS = 30_000;
const ANALYSIS_INTERVAL_MS = 1000;

// Safety-relevance order used to arbitrate when multiple categories match
// on the same tick, so one physical event doesn't fan out into several
// simultaneous notifications.
const PRIORITY: SoundCategoryId[] = ['glass_break', 'smoke_alarm', 'dog_bark', 'water_drip'];

export class SoundEngine {
  private buffer: Sample[] = [];
  private lastAnalysisAt = 0;
  private lastFiredAt: Partial<Record<SoundCategoryId, number>> = {};

  addSample(db: number, t: number): void {
    this.buffer.push({ t, db });
    const cutoff = t - BUFFER_SPAN_MS;
    while (this.buffer.length > 0 && this.buffer[0].t < cutoff) {
      this.buffer.shift();
    }
  }

  reset(): void {
    this.buffer = [];
    this.lastAnalysisAt = 0;
    this.lastFiredAt = {};
  }

  /** Call periodically (e.g. from a timer). Returns a detection at most once per tick. */
  tick(now: number, settings: AppSettings): DetectionEvent | null {
    if (now - this.lastAnalysisAt < ANALYSIS_INTERVAL_MS) return null;
    this.lastAnalysisAt = now;

    const matches = runDetectors(this.buffer, now, settings.sensitivity, settings.enabledCategories);
    if (matches.length === 0) return null;

    const eligible = matches.filter((m) => {
      const last = this.lastFiredAt[m.category];
      return !last || now - last >= COOLDOWN_MS[m.category];
    });
    if (eligible.length === 0) return null;

    eligible.sort((a, b) => PRIORITY.indexOf(a.category) - PRIORITY.indexOf(b.category));
    const winner = eligible[0];
    this.lastFiredAt[winner.category] = now;

    return {
      id: `${winner.category}-${now}`,
      category: winner.category,
      confidence: winner.confidence,
      timestamp: now,
    };
  }
}
