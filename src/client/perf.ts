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

export function perfVerdict(fps: number, slowShare: number, frames: number): string {
  if (frames < 300) return 'Noch zu wenig Daten – spiele etwa 20 Runden (Autoplay zweimal) und öffne diese Ansicht erneut.';
  if (fps >= 55 && slowShare < 0.02) return 'Flüssig: Das Ziel von 60 Bildern pro Sekunde wird praktisch erreicht.';
  if (fps >= 40 && slowShare < 0.1) return 'Brauchbar, aber unter dem Ziel von 60 Bildern pro Sekunde.';
  return 'Zu langsam: Auf diesem Gerät ruckelt die Darstellung. Bitte Gerät und Werte melden.';
}
