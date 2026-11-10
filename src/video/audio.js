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
  lp.type = 'lowpass'; lp.frequency.value = 1800;
  master.connect(lp).connect(off.destination);

  const beat = 60 / track.bpm;
  const barLen = beat * 4;
  const progression = [0, 5, 3, 7];
  for (let bar = 0, t = 0; t < dur; bar++, t += barLen) {
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
