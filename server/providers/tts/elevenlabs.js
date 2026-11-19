// Voice-Modul über ElevenLabs (Premium-Stimmen). Gleiches Tempo wie alle anderen Stimmen.
import { VOICES } from '../../../src/config/catalog.js';
import { speedUp } from './tempo.js';

// ElevenLabs erlaubt im Starter-Plan nur wenige gleichzeitige Anfragen → Warteschlange (max. 2 parallel), bei 429 kurz warten und erneut
let active = 0; const waiting = [];
const acquire = () => new Promise((r) => { if (active < 2) { active++; r(); } else waiting.push(r); });
const release = () => { const n = waiting.shift(); if (n) n(); else active--; };

const LANG_CODE = { de: 'de', 'de-CH': 'de', en: 'en', fr: 'fr', it: 'it', es: 'es', pt: 'pt', hr: 'hr', tr: 'tr' };

export default {
  name: 'elevenlabs',
  async synthesize(args) {
    await acquire();
    try {
      for (let i = 0; ; i++) {
        try { return await synth(args); }
        catch (e) { if (i < 3 && /TTS-Fehler 429/.test(e.message)) { await new Promise((r) => setTimeout(r, 1500 * (i + 1))); continue; } throw e; }
      }
    } finally { release(); }
  },
};

async function synth({ text, voiceId, language = 'de' }) {
  {
    const preset = VOICES.find((v) => v.id === voiceId) || VOICES[0];
    // Text mit Gefühls-Anweisungen ([sad], [softly] …) → ausdrucksstarkes Modell v3, natürliches Tempo
    const emotional = /\[[a-z][a-z ]{1,28}\]/i.test(text);
    const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${preset.providerVoice.elevenlabs}?output_format=mp3_44100_128`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'xi-api-key': process.env.ELEVENLABS_API_KEY, Accept: 'audio/mpeg' },
      body: JSON.stringify({
        text,
        model_id: emotional ? 'eleven_v3' : (process.env.ELEVENLABS_MODEL || 'eleven_multilingual_v2'),
        language_code: process.env.ELEVENLABS_MODEL === 'eleven_flash_v2_5' || process.env.ELEVENLABS_MODEL === 'eleven_turbo_v2_5' ? LANG_CODE[language] : undefined,
        voice_settings: emotional ? { stability: 0.0, similarity_boost: 0.8 } : { stability: 0.5, similarity_boost: 0.75, style: 0.15, use_speaker_boost: true },
      }),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      throw new Error(`TTS-Fehler ${res.status} (ElevenLabs) ${detail.slice(0, 120)}`);
    }
    const raw = Buffer.from(await res.arrayBuffer());
    const buf = emotional ? raw : await speedUp(raw);
    return { audioUrl: `data:audio/mpeg;base64,${buf.toString('base64')}` };
  }
}
