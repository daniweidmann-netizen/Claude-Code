// Datenmodell eines Video-Projekts + Timeline-Berechnung.
import { DEFAULT_CAPTIONS } from '../config/catalog.js';
import { uid } from '../lib/store.js';

export const VIDEO_W = 1080;
export const VIDEO_H = 1920;
const WORDS_PER_SEC = 2.6;

export const newSeed = () => Math.floor(Math.random() * 1e9);

export function scriptToProject(script, settings) {
  const scenes = [
    { role: 'hook', text: script.hook, visual: script.scenes?.[0]?.visual || script.title },
    ...(script.scenes || []).map((s) => ({ role: 'story', text: s.text, visual: s.visual })),
    { role: 'cta', text: script.cta, visual: script.scenes?.at(-1)?.visual || script.title },
  ].filter((s) => s.text);
  return {
    version: 1,
    title: script.title,
    motif: script.motif || 'city',
    language: settings.language || 'de',
    voiceId: settings.voiceId || 'calm-m',
    artStyle: settings.artStyle || 'cinematic',
    captions: { ...DEFAULT_CAPTIONS, ...(settings.captions || {}) },
    music: { trackId: 'calm', volume: 0.35, customUrl: null, ...(settings.music || {}) },
    notice: script.notice || null,
    scenes: scenes.map((s) => ({ id: uid(), seed: newSeed(), imageUrl: null, audioUrl: null, audioDuration: null, voiceId: null, ...s })),
  };
}

export function estimateDuration(text) {
  const words = (text || '').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(2.2, words / WORDS_PER_SEC + 0.5);
}

export function timeline(project) {
  let t = 0;
  const items = project.scenes.map((s) => {
    const d = s.audioDuration ? s.audioDuration + 0.25 : estimateDuration(s.text);
    const item = { scene: s, start: t, end: t + d, duration: d };
    t += d;
    return item;
  });
  return { items, total: t };
}

export function sceneAt(tl, t) {
  return tl.items.find((i) => t >= i.start && t < i.end) || tl.items.at(-1);
}

// Wort-Timings innerhalb einer Szene (gewichtet nach Wortlänge)
export function wordTimings(text, start, duration) {
  const words = (text || '').split(/\s+/).filter(Boolean);
  const usable = Math.max(0.5, duration - 0.35);
  const weights = words.map((w) => 0.6 + w.length * 0.12);
  const sum = weights.reduce((a, b) => a + b, 0) || 1;
  let t = start + 0.1;
  return words.map((w, i) => {
    const d = (weights[i] / sum) * usable;
    const r = { word: w, start: t, end: t + d };
    t += d;
    return r;
  });
}
