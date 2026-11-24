/**
 * Sound effects synthesised at runtime with the Web Audio API. No audio
 * files: every sound is described here in code (own work, no third-party
 * material). Placeholder quality; a composed soundtrack replaces it later.
 */
export type SfxName = 'button' | 'spin' | 'land' | 'win' | 'remove' | 'step' | 'station' | 'relic' | 'bonus' | 'pick' | 'freeSpins' | 'bigWin';

const KEY = 'tls.muted';

export class Sfx {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private _muted = false;

  constructor() {
    try { this._muted = window.localStorage.getItem(KEY) === '1'; } catch { /* storage unavailable */ }
  }

  get muted(): boolean { return this._muted; }

  setMuted(m: boolean): void {
    this._muted = m;
    try { window.localStorage.setItem(KEY, m ? '1' : '0'); } catch { /* storage unavailable */ }
    if (this.master) this.master.gain.value = m ? 0 : 0.5;
  }

  /** Browsers only start audio after a user gesture; call this from one. */
  unlock(): void {
    if (this.ctx) { if (this.ctx.state === 'suspended') void this.ctx.resume(); return; }
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return;
    try {
      this.ctx = new Ctor();
      this.master = this.ctx.createGain();
      this.master.gain.value = this._muted ? 0 : 0.5;
      this.master.connect(this.ctx.destination);
    } catch { this.ctx = null; }
  }

  private tone(freq: number, start: number, dur: number, type: OscillatorType = 'sine', gain = 0.3, slideTo?: number): void {
    const c = this.ctx!, t = c.currentTime + start;
    const o = c.createOscillator(), g = c.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(this.master!);
    o.start(t); o.stop(t + dur + 0.02);
  }

  private noise(start: number, dur: number, gain: number, cutoff: number): void {
    const c = this.ctx!, t = c.currentTime + start;
    const n = Math.max(1, Math.floor(c.sampleRate * dur));
    const buf = c.createBuffer(1, n, c.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n); // presentation only, not game logic
    const src = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
    src.buffer = buf; f.type = 'lowpass'; f.frequency.value = cutoff; g.gain.value = gain;
    src.connect(f).connect(g).connect(this.master!);
    src.start(t);
  }

  /** `level` scales some sounds: station number for `step`/`station`, tier for `win`/`bigWin`. */
  play(name: SfxName, level = 0): void {
    if (!this.ctx || !this.master || this._muted || this.ctx.state !== 'running') return;
    const scale = [262, 294, 330, 392, 440, 523, 587, 659, 784, 880];
    switch (name) {
      case 'button': this.tone(660, 0, 0.06, 'triangle', 0.15); break;
      case 'spin': this.noise(0, 0.22, 0.25, 1400); break;
      case 'land': this.tone(120, 0, 0.12, 'sine', 0.35, 70); this.noise(0, 0.05, 0.12, 900); break;
      case 'win': [0, 2, 4].forEach((s, i) => this.tone(scale[Math.min(9, s + level)], i * 0.07, 0.18, 'triangle', 0.22)); break;
      case 'remove': this.tone(520, 0, 0.09, 'square', 0.08, 260); break;
      case 'step': this.tone(scale[Math.min(9, 2 + level)], 0, 0.1, 'sine', 0.22); break;
      case 'station': this.tone(scale[Math.min(9, 3 + level)], 0, 0.3, 'triangle', 0.22); this.tone(scale[Math.min(9, 5 + level)], 0.08, 0.35, 'sine', 0.18); break;
      case 'relic': [5, 7, 9].forEach((s, i) => this.tone(scale[s] * 2, i * 0.05, 0.4, 'sine', 0.14)); break;
      case 'pick': this.tone(196, 0, 0.25, 'triangle', 0.25, 392); break;
      case 'bonus': [0, 2, 4, 7].forEach((s, i) => this.tone(scale[s], i * 0.11, 0.3, 'sawtooth', 0.12)); break;
      case 'freeSpins': [4, 5, 7, 9].forEach((s, i) => this.tone(scale[s], i * 0.1, 0.32, 'triangle', 0.2)); break;
      case 'bigWin': [0, 2, 4, 5, 7, 9].forEach((s, i) => this.tone(scale[s] * (level > 1 ? 2 : 1), i * 0.09, 0.45, 'triangle', 0.2)); break;
    }
  }
}
