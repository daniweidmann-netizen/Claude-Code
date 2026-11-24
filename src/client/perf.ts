/**
 * Frame-time statistics, collected only while a round is being presented
 * (that is when animation load is highest). Pure arithmetic, no browser API.
 */
export class PerfMeter {
  private frames = 0;
  private total = 0;
  private slow = 0;
  private worst = 0;

  /** Record one frame of `ms` milliseconds. Gaps over one second (tab in background) are ignored. */
  add(ms: number): void {
    if (!(ms > 0) || ms > 1000) return;
    this.frames++; this.total += ms;
    if (ms > 1000 / 30) this.slow++;
    if (ms > this.worst) this.worst = ms;
  }

  reset(): void { this.frames = 0; this.total = 0; this.slow = 0; this.worst = 0; }

  get stats(): { frames: number; seconds: number; fps: number; slowShare: number; worstMs: number } {
    return {
      frames: this.frames, seconds: this.total / 1000,
      fps: this.total > 0 ? (this.frames * 1000) / this.total : 0,
      slowShare: this.frames > 0 ? this.slow / this.frames : 0, worstMs: this.worst,
    };
  }
}

export function perfVerdict(fps: number, slowShare: number, frames: number, lang: 'en' | 'de' = 'en'): string {
  const de = lang === 'de';
  if (frames < 300) return de
    ? 'Noch zu wenig Daten – spiele etwa 20 Runden (Autoplay zweimal) und öffne diese Ansicht erneut.'
    : 'Not enough data yet – play about 20 rounds (autoplay twice) and open this view again.';
  if (fps >= 55 && slowShare < 0.02) return de
    ? 'Flüssig: Das Ziel von 60 Bildern pro Sekunde wird praktisch erreicht.'
    : 'Smooth: the target of 60 frames per second is practically reached.';
  if (fps >= 40 && slowShare < 0.1) return de
    ? 'Brauchbar, aber unter dem Ziel von 60 Bildern pro Sekunde.'
    : 'Usable, but below the target of 60 frames per second.';
  return de
    ? 'Zu langsam: Auf diesem Gerät ruckelt die Darstellung. Bitte Gerät und Werte melden.'
    : 'Too slow: the display stutters on this device. Please report the device and these figures.';
}
