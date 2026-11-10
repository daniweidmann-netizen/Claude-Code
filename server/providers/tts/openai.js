// Voice-Modul über die OpenAI Speech API (gpt-4o-mini-tts).
// Das Modell versteht Sprech-Anweisungen (instructions) – damit klingt es natürlicher.
import { VOICES } from '../../../src/config/catalog.js';

const LANG_HINT = {
  de: 'Sprich klares, natürliches Hochdeutsch.',
  'de-CH': 'Sprich natürliches Schweizer Hochdeutsch mit leichter Schweizer Färbung, kein Dialekt.',
  en: 'Speak natural, clear English.',
  fr: 'Parle un français naturel et clair.',
  it: 'Parla un italiano naturale e chiaro.',
  es: 'Habla un español natural y claro.',
};

const STYLE = {
  'calm-m': 'Ruhiger, warmer Erzähler wie in einer guten Dokumentation. Natürliche Pausen, nicht gehetzt.',
  'warm-f': 'Warme, freundliche Erzählerin. Lebendig, aber nicht übertrieben.',
  'story-m': 'Spannender Geschichtenerzähler, leicht geheimnisvoll, mit Betonung auf Schlüsselwörtern.',
  'energy-f': 'Energiegeladen und motivierend wie ein Social-Media-Creator, aber gut verständlich.',
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
        instructions: `${LANG_HINT[language] || LANG_HINT.de} ${STYLE[preset.id] || ''} Für ein kurzes Social-Media-Video im Hochformat.`,
        response_format: 'mp3',
      }),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      throw new Error(`TTS-Fehler ${res.status}${res.status === 429 ? ' (Guthaben/Limit prüfen)' : ''} ${detail.slice(0, 120)}`);
    }
    const buf = Buffer.from(await res.arrayBuffer());
    return { audioUrl: `data:audio/mpeg;base64,${buf.toString('base64')}` };
  },
};
