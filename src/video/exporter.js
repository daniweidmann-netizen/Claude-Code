import { translate as tr } from '../i18n/index.jsx';
// Export: Rendert das Video in Echtzeit auf ein 1080×1920-Canvas, nimmt es mit
// MediaRecorder auf (inkl. Musik + Server-Voiceover) und lässt es serverseitig
// per FFmpeg in MP4 (H.264/AAC) umwandeln.
import { drawFrame } from './renderer.js';
import { timeline, VIDEO_W, VIDEO_H } from './project.js';
import { audioCtx, renderMusic, decodeUrl, unlockAudio } from './audio.js';
import { api } from '../lib/api.js';

function pickMime() {
  const types = ['video/mp4;codecs=avc1', 'video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm'];
  return types.find((t) => window.MediaRecorder?.isTypeSupported?.(t)) || 'video/webm';
}

async function loadImages(project) {
  const map = new Map();
  await Promise.all(project.scenes.filter((s) => s.imageUrl).map((s) => new Promise((res) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => { map.set(s.imageUrl, img); res(); };
    img.onerror = res;
    img.src = s.imageUrl;
  })));
  return (s) => map.get(s.imageUrl) || null;
}

export async function recordVideo(project, { watermark = false, onProgress, signal } = {}) {
  if (!window.MediaRecorder) throw new Error(tr('Dieser Browser unterstützt keinen Video-Export (MediaRecorder fehlt).'));
  const tl = timeline(project);
  const canvas = document.createElement('canvas');
  canvas.width = VIDEO_W; canvas.height = VIDEO_H;
  const ctx = canvas.getContext('2d');
  const getImage = await loadImages(project);

  unlockAudio();
  const actx = audioCtx();
  await actx.resume();
  const dest = actx.createMediaStreamDestination();
  const sources = [];
  const t0 = actx.currentTime + 0.25;

  const m = project.music || {};
  const musicBuf = m.customUrl ? await decodeUrl(m.customUrl).catch(() => null) : await renderMusic(m.trackId, tl.total);
  if (musicBuf) {
    const s = actx.createBufferSource();
    const g = actx.createGain();
    g.gain.value = m.volume ?? 0.35;
    s.buffer = musicBuf; s.loop = !!m.customUrl;
    s.connect(g).connect(dest);
    s.start(t0); s.stop(t0 + tl.total);
    sources.push(s);
  }
  let hasVoice = false;
  for (const item of tl.items) {
    if (!item.scene.audioUrl) continue;
    const buf = await decodeUrl(item.scene.audioUrl).catch(() => null);
    if (!buf) continue;
    hasVoice = true;
    const s = actx.createBufferSource();
    s.buffer = buf;
    s.connect(dest);
    s.start(t0 + item.start);
    sources.push(s);
  }

  const stream = new MediaStream([...canvas.captureStream(30).getVideoTracks(), ...dest.stream.getAudioTracks()]);
  const mimeType = pickMime();
  const rec = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 8_000_000 });
  const chunks = [];
  rec.ondataavailable = (e) => e.data.size && chunks.push(e.data);
  const done = new Promise((res) => { rec.onstop = res; });

  drawFrame(ctx, project, tl, 0, { getImage, watermark });
  await new Promise((r) => setTimeout(r, Math.max(0, (t0 - actx.currentTime) * 1000)));
  rec.start(500);
  const startPerf = performance.now();
  await new Promise((resolve) => {
    const tick = () => {
      const t = (performance.now() - startPerf) / 1000;
      if (signal?.aborted || t >= tl.total) return resolve();
      drawFrame(ctx, project, tl, t, { getImage, watermark });
      onProgress?.(t / tl.total);
      // setTimeout statt rAF: läuft auch weiter, wenn der Tab im Hintergrund ist (gedrosselt)
      setTimeout(tick, 1000 / 30);
    };
    tick();
  });
  rec.stop();
  sources.forEach((s) => { try { s.stop(); } catch {} });
  await done;
  if (signal?.aborted) throw new Error(tr('Export abgebrochen'));
  return { blob: new Blob(chunks, { type: mimeType.split(';')[0] }), mimeType, hasVoice };
}

// Lädt die Aufnahme hoch und erhält ein MP4 (H.264, 1080×1920) zurück.
export async function toMp4(blob) {
  const fd = new FormData();
  fd.append('video', blob, blob.type.includes('mp4') ? 'input.mp4' : 'input.webm');
  const res = await api('/render/mp4', { method: 'POST', body: fd, raw: true });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'MP4-Umwandlung fehlgeschlagen');
  }
  return res.blob();
}

export function download(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}
