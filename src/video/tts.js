// Voiceover: Browser-Stimme (Web Speech API) für Vorschau, Server-TTS für Export.
import { LANGUAGES, VOICES } from '../config/catalog.js';
import { api } from '../lib/api.js';

export const browserTTSAvailable = () => typeof window !== 'undefined' && 'speechSynthesis' in window;

function pickVoice(lang, preset) {
  const bcp = LANGUAGES.find((l) => l.id === lang)?.bcp47 || 'de-DE';
  const all = window.speechSynthesis.getVoices();
  const sameLang = all.filter((v) => v.lang?.toLowerCase().startsWith(bcp.slice(0, 2).toLowerCase()));
  const exact = sameLang.filter((v) => v.lang === bcp);
  const pool = exact.length ? exact : sameLang;
  if (!pool.length) return null;
  const femaleHints = /female|frau|anna|helena|marie|amelie|petra|zira|samantha|victoria|karen|google.*(de|fr|it|es)/i;
  const wantsFemale = preset?.gender === 'female';
  const match = pool.find((v) => femaleHints.test(v.name) === wantsFemale);
  return match || pool[VOICES.indexOf(preset) % pool.length] || pool[0];
}

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
  try {
    const r = await api('/generate/voice', { method: 'POST', body: { text, language: lang, voiceId } });
    if (!r.audioUrl) return null;
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
