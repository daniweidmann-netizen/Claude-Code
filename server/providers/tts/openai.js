// Voice-Modul über die OpenAI Speech API (gpt-4o-mini-tts).
// Das Modell versteht Sprech-Anweisungen (instructions) – damit klingt es natürlicher.
import { spawn } from 'node:child_process';
import { VOICES } from '../../../src/config/catalog.js';
import { config } from '../../config.js';

// Etwas zügigeres Sprechtempo wirkt in Kurzvideos lebendiger. Das Modell ignoriert
// Tempo-Vorgaben, darum wird das fertige Audio mit FFmpeg (atempo, Tonhöhe bleibt) beschleunigt.
const TEMPO = Number(process.env.VOICE_TEMPO || 1.18);

function speedUp(buf) {
  if (!(TEMPO > 0.5 && TEMPO < 2) || TEMPO === 1) return Promise.resolve(buf);
  return new Promise((resolve) => {
    const p = spawn(config.ffmpegPath, ['-loglevel', 'error', '-i', 'pipe:0', '-filter:a', `atempo=${TEMPO}`, '-c:a', 'libmp3lame', '-b:a', '128k', '-f', 'mp3', 'pipe:1']);
    const out = [];
    p.stdout.on('data', (d) => out.push(d));
    p.on('error', () => resolve(buf)); // kein FFmpeg → Originaltempo
    p.on('close', (code) => resolve(code === 0 && out.length ? Buffer.concat(out) : buf));
    p.stdin.on('error', () => {});
    p.stdin.end(buf);
  });
}

const LANG_HINT = {
  de: 'Sprich klares, natürliches Hochdeutsch.',
  'de-CH': 'Sprich natürliches Schweizer Hochdeutsch mit leichter Schweizer Färbung, kein Dialekt.',
  en: 'Speak natural, clear English.',
  fr: 'Parle un français naturel et clair.',
  it: 'Parla un italiano naturale e chiaro.',
  es: 'Habla un español natural y claro.',
};

// Stil-Anweisungen auf Englisch (sprachneutral) – die Sprache selbst steuert LANG_HINT
const STYLE = {
  'calm-m': 'Calm, warm male narrator like a good documentary. Natural pauses, never rushed.',
  'clear-m': 'Clear, confident male narrator. Friendly and direct, like a popular explainer channel.',
  'story-m': 'Gripping storyteller, slightly mysterious, building suspense and emphasizing key words.',
  'warm-f': 'Warm, friendly female narrator. Lively but not exaggerated.',
  'soft-f': 'Soft, calm female narrator. Relaxed, trustworthy and pleasant to listen to.',
  'energy-f': 'Energetic and motivating like a social media creator, but easy to understand.',
};

export default {
  name: 'openai',
  async synthesize({ text, voiceId, language = 'de' }) {
    const preset = VOICES.find((v) => v.id === voiceId) || VOICES[0];
    const res = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      body: JSON.stringify({
        model: process.env.OPENAI_TTS_MODEL || 'gpt-4o-mini-tts',
        voice: preset.providerVoice.openai,
        input: text,
        instructions: `${LANG_HINT[language] || LANG_HINT.de} ${STYLE[preset.id] || ''} This is the voiceover for a short vertical social media video. Sound like a native speaker of that language with a natural rhythm: short pauses after each sentence, light emphasis on the key words, varied intonation. Never sound robotic, monotone or overly dramatic.`,
        response_format: 'mp3',
      }),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      throw new Error(`TTS-Fehler ${res.status}${res.status === 429 ? ' (Guthaben/Limit prüfen)' : ''} ${detail.slice(0, 120)}`);
    }
    const buf = await speedUp(Buffer.from(await res.arrayBuffer()));
    return { audioUrl: `data:audio/mpeg;base64,${buf.toString('base64')}` };
  },
};
