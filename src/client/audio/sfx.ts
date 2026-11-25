import { asset } from '../asset.js';

/**
 * Sound through the Web Audio API. Recorded effects and two music loops are
 * loaded from public/audio after the first user gesture (provenance in
 * assets/ASSET_REGISTER.md). Until a file has arrived, and whenever one is
 * missing, the same event plays a tone synthesised here in code, so the game
 * is never silent because of a failed download.
 */
export type SfxName = 'button' | 'spin' | 'land' | 'win' | 'remove' | 'step' | 'station' | 'relic' | 'bonus' | 'pick' | 'freeSpins' | 'retrigger' | 'complete' | 'bigWin';
export type MusicName = 'base' | 'free';

/** Files under audio/ and their playback gain. `pick` uses the door recording. */
const SAMPLES: Record<string, { file: string; gain: number }> = {
  button: { file: 'button', gain: 0.5 }, spin: { file: 'spin', gain: 0.55 }, land: { file: 'land', gain: 0.9 },
  win: { file: 'win', gain: 0.7 }, winMid: { file: 'winMid', gain: 0.8 }, remove: { file: 'remove', gain: 0.6 },
  step: { file: 'step', gain: 0.8 }, station: { file: 'station', gain: 0.75 }, relic: { file: 'relic', gain: 0.9 },
  bonus: { file: 'bonus', gain: 0.9 }, pick: { file: 'door', gain: 0.9 }, freeSpins: { file: 'freeSpins', gain: 0.9 },
  bigWin: { file: 'bigWin', gain: 1 }, retrigger: { file: 'retrigger', gain: 0.85 }, complete: { file: 'complete', gain: 0.85 },
};
/** Quiet jungle bed under the base-game music. */
const AMBIENCE = { file: 'ambience', gain: 0.5, enabled: false };
const VOL_KEY = 'tls.volume';
const MUSIC: Record<MusicName, string> = { base: 'music_base', free: 'music_free' };
const MUSIC_GAIN = 0.42;

const KEY = 'tls.muted';

export class Sfx {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private _muted = false;
  private _volume = 0.7;
  private ambience: { src: AudioBufferSourceNode; gain: GainNode } | null = null;
  private readonly buffers = new Map<string, AudioBuffer>();
  private loading = false;
  private musicWanted: MusicName | null = null;
  private musicNow: { name: MusicName; src: AudioBufferSourceNode; gain: GainNode } | null = null;
  /** Names of files that could not be loaded or decoded (shown in tests). */
  readonly failed: string[] = [];

  constructor() {
    try {
      this._muted = window.localStorage.getItem(KEY) === '1';
      const v = Number(window.localStorage.getItem(VOL_KEY));
      if (window.localStorage.getItem(VOL_KEY) !== null && v >= 0 && v <= 1) this._volume = v;
    } catch { /* storage unavailable */ }
  }

  /** Master volume 0..1 (separate from mute). */
  get volume(): number { return this._volume; }
  setVolume(v: number): void {
    this._volume = Math.min(1, Math.max(0, v));
    try { window.localStorage.setItem(VOL_KEY, String(this._volume)); } catch { /* storage unavailable */ }
    if (this.master) this.master.gain.value = this._muted ? 0 : this._volume * 0.8;
  }

  get muted(): boolean { return this._muted; }

  setMuted(m: boolean): void {
    this._muted = m;
    try { window.localStorage.setItem(KEY, m ? '1' : '0'); } catch { /* storage unavailable */ }
    if (this.master) this.master.gain.value = m ? 0 : this._volume * 0.8;
  }

  /** Browsers only start audio after a user gesture; call this from one. */
  unlock(): void {
    if (this.ctx) { if (this.ctx.state === 'suspended') void this.ctx.resume(); return; }
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return;
    try {
      this.ctx = new Ctor();
      this.master = this.ctx.createGain();
      this.master.gain.value = this._muted ? 0 : this._volume * 0.8;
      this.master.connect(this.ctx.destination);
      void this.loadAll();
    } catch { this.ctx = null; }
  }

  private async loadOne(key: string, file: string): Promise<void> {
    try {
      const res = await fetch(asset(`audio/${file}.mp3`));
      if (!res.ok) throw new Error(String(res.status));
      const data = await res.arrayBuffer();
      const buf = await new Promise<AudioBuffer>((ok, fail) => { void this.ctx!.decodeAudioData(data, ok, fail)?.catch?.(fail); });
      this.buffers.set(key, buf);
    } catch { this.failed.push(file); }
  }

  /** Effects first (small), then the music loops; music starts as soon as its file is ready. */
  private async loadAll(): Promise<void> {
    if (this.loading || !this.ctx) return;
    this.loading = true;
    await Promise.all(Object.entries(SAMPLES).map(([key, s]) => this.loadOne(key, s.file)));
    // The jungle bed is prepared but not shipped yet: the generator only returned a 2-second clip, too short to loop unnoticed.
    if (AMBIENCE.enabled) { await this.loadOne('ambience', AMBIENCE.file); this.applyAmbience(); }
    for (const name of Object.keys(MUSIC) as MusicName[]) {
      await this.loadOne(`music:${name}`, MUSIC[name]);
      if (this.musicWanted === name) this.music(name);
    }
  }

  get loadedCount(): number { return this.buffers.size; }

  /** The jungle bed plays in the base game and fades out inside the temple. */
  private applyAmbience(): void {
    const c = this.ctx, buf = this.buffers.get('ambience');
    if (!c || !this.master || !buf) return;
    if (!this.ambience) {
      const src = c.createBufferSource(), gain = c.createGain();
      src.buffer = buf; src.loop = true; gain.gain.value = 0;
      src.connect(gain).connect(this.master); src.start();
      this.ambience = { src, gain };
    }
    const t = c.currentTime, g = this.ambience.gain.gain;
    g.cancelScheduledValues(t); g.setValueAtTime(g.value, t);
    g.linearRampToValueAtTime(this.musicWanted === 'free' ? 0 : AMBIENCE.gain, t + 1.2);
  }

  /** Switches the background loop with a cross-fade; does nothing until the file is loaded. */
  music(name: MusicName): void {
    this.musicWanted = name;
    this.applyAmbience();
    const c = this.ctx, buf = this.buffers.get(`music:${name}`);
    if (!c || !this.master || !buf || this.musicNow?.name === name) return;
    const t = c.currentTime;
    if (this.musicNow) {
      const old = this.musicNow;
      old.gain.gain.cancelScheduledValues(t); old.gain.gain.setValueAtTime(old.gain.gain.value, t); old.gain.gain.linearRampToValueAtTime(0, t + 0.8);
      old.src.stop(t + 0.9);
    }
    const src = c.createBufferSource(), gain = c.createGain();
    src.buffer = buf; src.loop = true;
    gain.gain.setValueAtTime(0, t); gain.gain.linearRampToValueAtTime(MUSIC_GAIN, t + 1.2);
    src.connect(gain).connect(this.master);
    src.start(t);
    this.musicNow = { name, src, gain };
  }

  /** Lowers the music briefly under a big moment (celebration, bonus) and brings it back. */
  duck(seconds: number): void {
    const c = this.ctx, m = this.musicNow;
    if (!c || !m) return;
    const t = c.currentTime;
    m.gain.gain.cancelScheduledValues(t); m.gain.gain.setValueAtTime(m.gain.gain.value, t);
    m.gain.gain.linearRampToValueAtTime(MUSIC_GAIN * 0.3, t + 0.15);
    m.gain.gain.linearRampToValueAtTime(MUSIC_GAIN, t + seconds);
  }

  private sample(key: string, rate = 1): boolean {
    const buf = this.buffers.get(key), s = SAMPLES[key];
    if (!buf || !s || !this.ctx || !this.master) return false;
    const src = this.ctx.createBufferSource(), g = this.ctx.createGain();
    src.buffer = buf; src.playbackRate.value = rate; g.gain.value = s.gain;
    src.connect(g).connect(this.master);
    src.start();
    return true;
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
    // Recorded sound where available; pitch follows the level for steps and stations, and larger cluster wins use the fuller sample.
    if (name === 'win' ? this.sample(level >= 3 ? 'winMid' : 'win', 1 + Math.min(level, 2) * 0.06)
      : name === 'step' || name === 'station' ? this.sample(name, 1 + level * 0.05)
      : name === 'bigWin' ? this.sample('bigWin', level >= 3 ? 0.9 : 1)
      : this.sample(name)) {
      if (name === 'bigWin' || name === 'bonus' || name === 'freeSpins' || name === 'complete') this.duck(name === 'bigWin' ? 4 : 2.5);
      return;
    }
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
      case 'retrigger': [5, 7, 9].forEach((s, i) => this.tone(scale[s], i * 0.07, 0.25, 'triangle', 0.2)); break;
      case 'complete': [7, 5, 4, 7].forEach((s, i) => this.tone(scale[s], i * 0.12, 0.4, 'triangle', 0.18)); break;
      case 'bigWin': [0, 2, 4, 5, 7, 9].forEach((s, i) => this.tone(scale[s] * (level > 1 ? 2 : 1), i * 0.09, 0.45, 'triangle', 0.2)); break;
    }
  }
}
