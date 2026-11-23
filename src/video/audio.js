// Prozedural erzeugte Hintergrundmusik (eigene Komposition → lizenzfrei) + Hilfsfunktionen.
import { MUSIC_TRACKS } from '../config/catalog.js';

let sharedCtx = null;
export function audioCtx() {
  if (!sharedCtx) sharedCtx = new (window.AudioContext || window.webkitAudioContext)();
  return sharedCtx;
}

const bufferCache = new Map();

export async function renderMusic(trackId, seconds) {
  const track = MUSIC_TRACKS.find((m) => m.id === trackId);
  if (!track || !track.root) return null;
  const dur = Math.ceil(seconds) + 1;
  const key = `${trackId}|${dur}`;
  if (bufferCache.has(key)) return bufferCache.get(key);
  const sr = 44100;
  const off = new OfflineAudioContext(2, sr * dur, sr);
  const master = off.createGain();
  master.gain.value = 0.5;
  const lp = off.createBiquadFilter();
  lp.type = 'lowpass'; lp.frequency.value = track.lp || 1800;
  master.connect(lp).connect(off.destination);

  const beat = 60 / track.bpm;
  const barLen = beat * 4;
  const progression = [0, 5, 3, 7];
  if (track.kit) renderKit(off, master, track, dur);
  else for (let bar = 0, t = 0; t < dur; bar++, t += barLen) {
    const shift = progression[bar % progression.length];
    track.scale.forEach((iv, i) => {
      const o = off.createOscillator();
      o.type = i === 0 ? 'triangle' : 'sine';
      o.frequency.value = track.root * Math.pow(2, (iv + shift) / 12) * (i === 0 ? 0.5 : 1);
      const g = off.createGain();
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.12 / (i + 1) + 0.04, t + barLen * 0.3);
      g.gain.linearRampToValueAtTime(0, t + barLen * 1.05);
      o.connect(g).connect(master);
      o.start(t); o.stop(t + barLen * 1.1);
    });
    // weicher Puls
    for (let b = 0; b < 4; b++) {
      const bt = t + b * beat;
      if (bt >= dur) break;
      const o = off.createOscillator();
      o.type = 'sine';
      o.frequency.setValueAtTime(track.id === 'calm' ? 70 : 90, bt);
      o.frequency.exponentialRampToValueAtTime(40, bt + 0.25);
      const g = off.createGain();
      g.gain.setValueAtTime(track.id === 'calm' ? 0.1 : 0.22, bt);
      g.gain.exponentialRampToValueAtTime(0.001, bt + 0.3);
      o.connect(g).connect(master);
      o.start(bt); o.stop(bt + 0.32);
    }
  }
  // Ein-/Ausblenden
  master.gain.setValueAtTime(0, 0);
  master.gain.linearRampToValueAtTime(0.5, 1.5);
  master.gain.setValueAtTime(0.5, Math.max(1.5, dur - 2));
  master.gain.linearRampToValueAtTime(0, dur);
  const buf = await off.startRendering();
  normalize(buf, 0.9); // auf ca. -1 dBFS anheben – die Lautstärke regelt danach der Regler
  bufferCache.set(key, buf);
  return buf;
}

// Neuere Stücke (track.kit): echte Akkordfolgen plus Bausteine wie Bass, gezupfte Töne, Arpeggio und Schlagwerk.
function renderKit(off, master, track, dur) {
  const k = track.kit; const beat = 60 / track.bpm; const barLen = beat * 4;
  const f = (semi, oct = 0) => track.root * Math.pow(2, semi / 12 + oct);
  const noise = off.createBuffer(1, off.sampleRate, off.sampleRate);
  { const d = noise.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; }
  // Ton mit schnellem Anschlag und ausklingender Hüllkurve
  const tone = (type, freq, t, peak, decay, attack = 0.006) => {
    if (t >= dur) return;
    const o = off.createOscillator(); o.type = type; o.frequency.value = freq;
    const g = off.createGain();
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(peak, t + attack); g.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay);
    o.connect(g).connect(master); o.start(t); o.stop(t + attack + decay + 0.05);
  };
  const sweep = (from, to, t, peak, decay) => {
    if (t >= dur) return;
    const o = off.createOscillator(); o.type = 'sine';
    o.frequency.setValueAtTime(from, t); o.frequency.exponentialRampToValueAtTime(to, t + decay * 0.8);
    const g = off.createGain(); g.gain.setValueAtTime(peak, t); g.gain.exponentialRampToValueAtTime(0.0001, t + decay);
    o.connect(g).connect(master); o.start(t); o.stop(t + decay + 0.05);
  };
  const hiss = (t, peak, decay, cutoff) => {
    if (t >= dur) return;
    const s = off.createBufferSource(); s.buffer = noise; s.loop = true;
    const hp = off.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = cutoff;
    const g = off.createGain(); g.gain.setValueAtTime(peak, t); g.gain.exponentialRampToValueAtTime(0.0001, t + decay);
    s.connect(hp).connect(g).connect(master); s.start(t); s.stop(t + decay + 0.02);
  };
  for (let bar = 0, t = 0; t < dur; bar++, t += barLen) {
    const chord = track.chords[bar % track.chords.length];
    const drums = bar >= (k.from || 0); // Schlagwerk kann später einsetzen
    if (k.pad) chord.forEach((iv, i) => {
      [0, 4].forEach((cents, n) => { // zwei leicht verstimmte Stimmen → breiter Klang
        const o = off.createOscillator(); o.type = i === 0 ? 'triangle' : 'sine'; o.frequency.value = f(iv, i === 0 ? -1 : 0); o.detune.value = n ? cents : -cents;
        const g = off.createGain(); const peak = k.pad * (0.07 / (i + 1) + 0.025);
        g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(peak, t + barLen * 0.35); g.gain.linearRampToValueAtTime(0, t + barLen * 1.08);
        o.connect(g).connect(master); o.start(t); o.stop(t + barLen * 1.12);
      });
    });
    if (k.drone) [[0, -1], [7, -1]].forEach(([iv, oct], i) => {
      const o = off.createOscillator(); o.type = 'sawtooth'; o.frequency.value = f(iv, oct);
      const lp = off.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 260;
      const g = off.createGain(); const peak = k.drone * (i ? 0.05 : 0.09);
      g.gain.setValueAtTime(peak * 0.6, t); g.gain.linearRampToValueAtTime(peak, t + barLen * 0.5); g.gain.linearRampToValueAtTime(peak * 0.6, t + barLen);
      o.connect(lp).connect(g).connect(master); o.start(t); o.stop(t + barLen + 0.02);
    });
    if (k.shimmer) chord.slice(2).forEach((iv, i) => tone('sine', f(iv, 1), t + barLen * (0.25 + i * 0.3), k.shimmer, barLen * 0.9, barLen * 0.2));
    (k.bass || []).forEach((b) => tone('sine', f(chord[0], f(chord[0], -1) < 55 ? 0 : -1), t + b * beat, 0.3, beat * 0.9));
    if (k.pluck) k.pluck.notes.forEach(([b, idx, oct]) => {
      const notes = idx < 0 ? chord : [chord[idx % chord.length]];
      notes.forEach((iv) => { tone('triangle', f(iv, oct), t + b * beat, k.pluck.gain / notes.length ** 0.5, k.pluck.decay); tone('sine', f(iv, oct + 1), t + b * beat, k.pluck.gain * 0.25 / notes.length ** 0.5, k.pluck.decay * 0.5); });
    });
    if (k.arp && drums) {
      const order = [0, 1, 2, 3, 2, 1]; const step = beat / k.arp.div;
      for (let n = 0; n < 4 * k.arp.div; n++) tone(k.arp.wave, f(chord[order[n % order.length] % chord.length], k.arp.octave), t + n * step, k.arp.gain, step * 1.4);
    }
    if (drums) {
      (k.kick || []).forEach((b) => sweep(120, 42, t + b * beat, 0.3, 0.26));
      (k.snare || []).forEach((b) => { hiss(t + b * beat, 0.11, 0.15, 1500); tone('triangle', 185, t + b * beat, 0.08, 0.1); });
      if (k.hat) for (let b = k.hat / 2; b < 4; b += k.hat) hiss(t + b * beat, 0.05, 0.045, 7000);
      (k.toms || []).forEach(([b, hz]) => { sweep(hz * 1.5, hz * 0.7, t + b * beat, 0.55, 0.55); hiss(t + b * beat, 0.05, 0.08, 900); });
    }
    if (k.tick) for (let b = 0; b < 4; b++) tone('sine', b % 2 ? 1400 : 1800, t + b * beat, 0.07, 0.03, 0.001);
    if (k.heart) [0, 0.32].forEach((d, i) => sweep(64, 38, t + d, i ? 0.3 : 0.42, 0.26)); // Herzschlag: zwei dumpfe Schläge pro Takt
  }
}

function normalize(buf, target) {
  let peak = 0;
  for (let c = 0; c < buf.numberOfChannels; c++) {
    const d = buf.getChannelData(c);
    for (let i = 0; i < d.length; i++) { const a = Math.abs(d[i]); if (a > peak) peak = a; }
  }
  if (!peak) return;
  const k = target / peak;
  for (let c = 0; c < buf.numberOfChannels; c++) {
    const d = buf.getChannelData(c);
    for (let i = 0; i < d.length; i++) d[i] *= k;
  }
}

// iPhone/iPad: Ton auch bei aktivem Lautlos-Schalter abspielen und Sprachausgabe
// freischalten. Muss direkt in einem Fingertipp (Klick-Handler) aufgerufen werden.
export function unlockAudio() {
  try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch {}
  try { audioCtx().resume(); } catch {}
  try {
    if ('speechSynthesis' in window && !unlockAudio.speechDone) {
      const u = new SpeechSynthesisUtterance(' ');
      u.volume = 0;
      window.speechSynthesis.speak(u);
      unlockAudio.speechDone = true;
    }
  } catch {}
}

export async function decodeUrl(url) {
  if (!url) return null;
  if (bufferCache.has(url)) return bufferCache.get(url);
  const res = await fetch(url);
  const buf = await audioCtx().decodeAudioData(await res.arrayBuffer());
  bufferCache.set(url, buf);
  return buf;
}

// Kurzes Vorhören eines Musik-Tracks
let previewNode = null;
export async function previewMusic(trackId, seconds = 8) {
  stopMusicPreview();
  const buf = await renderMusic(trackId, seconds);
  if (!buf) return;
  const ctx = audioCtx();
  await ctx.resume();
  previewNode = ctx.createBufferSource();
  previewNode.buffer = buf;
  previewNode.connect(ctx.destination);
  previewNode.start();
}
export function stopMusicPreview() {
  try { previewNode?.stop(); } catch {}
  previewNode = null;
}
