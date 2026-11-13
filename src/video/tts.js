// Voiceover: Browser-Stimme (Web Speech API) für Vorschau, Server-TTS für Export.
import { LANGUAGES, VOICES } from '../config/catalog.js';
import { api } from '../lib/api.js';

export const browserTTSAvailable = () => typeof window !== 'undefined' && 'speechSynthesis' in window;

// Qualitätsrangfolge: neuronale/Premium-Stimmen klingen deutlich natürlicher als die Standardstimmen
const QUALITY = [/premium/i, /enhanced|erweitert|verbessert/i, /neural|natural|online/i, /google/i, /siri/i];
const quality = (v) => { const i = QUALITY.findIndex((re) => re.test(v.name)); return i === -1 ? QUALITY.length : i; };
const FEMALE = /female|frau|anna|helena|marie|amelie|petra|katja|leni|zira|samantha|victoria|karen|ava|allison|susan|serena|alice|paulina|mónica|monica|amélie|audrey|joana|sara|nora/i;

function pickVoice(lang, preset) {
  const bcp = LANGUAGES.find((l) => l.id === lang)?.bcp47 || 'de-DE';
  const all = window.speechSynthesis.getVoices();
  const base = bcp.slice(0, 2).toLowerCase();
  const pool = all.filter((v) => v.lang?.toLowerCase().replace('_', '-').startsWith(base));
  if (!pool.length) return null;
  const wantsFemale = preset?.gender === 'female';
  const score = (v) => quality(v) * 10 + (v.lang === bcp ? 0 : 3) + (FEMALE.test(v.name) === wantsFemale ? 0 : 5);
  return [...pool].sort((a, b) => score(a) - score(b))[0];
}

/** Liste der verfügbaren Stimmen einer Sprache (für Hinweise im UI) */
export function availableVoices(lang) {
  if (!browserTTSAvailable()) return [];
  const base = (LANGUAGES.find((l) => l.id === lang)?.bcp47 || 'de-DE').slice(0, 2).toLowerCase();
  return window.speechSynthesis.getVoices().filter((v) => v.lang?.toLowerCase().startsWith(base));
}
export const hasHighQualityVoice = (lang) => availableVoices(lang).some((v) => quality(v) < 3);

export function speak(text, { lang = 'de', voiceId = 'calm-m', onEnd } = {}) {
  if (!browserTTSAvailable()) { onEnd?.(); return () => {}; }
  const preset = VOICES.find((v) => v.id === voiceId) || VOICES[0];
  const u = new SpeechSynthesisUtterance(text);
  u.lang = LANGUAGES.find((l) => l.id === lang)?.bcp47 || 'de-DE';
  const v = pickVoice(lang, preset);
  if (v) u.voice = v;
  u.pitch = preset.pitch;
  u.rate = preset.rate;
  u.onend = () => onEnd?.();
  window.speechSynthesis.speak(u);
  return () => window.speechSynthesis.cancel();
}

export const stopSpeaking = () => browserTTSAvailable() && window.speechSynthesis.cancel();

// Server-TTS: liefert { audioUrl, duration } oder null, wenn nur Mock verfügbar ist.
export async function synthesize(text, { lang, voiceId }) {
  let r = null;
  // Bis zu 3 Versuche: kurze Server-Aussetzer (z. B. Neustart nach Update) dürfen kein Video ohne Stimme erzeugen
  for (let attempt = 0; attempt < 3 && !r; attempt++) {
    if (attempt) await new Promise((res) => setTimeout(res, attempt * 2000));
    try { r = await api('/generate/voice', { method: 'POST', body: { text, language: lang, voiceId } }); } catch { r = null; }
  }
  try {
    if (!r?.audioUrl) return null;
    const duration = await new Promise((resolve) => {
      const a = new Audio(r.audioUrl);
      a.onloadedmetadata = () => resolve(a.duration);
      a.onerror = () => resolve(null);
    });
    return { audioUrl: r.audioUrl, duration };
  } catch {
    return null;
  }
}
