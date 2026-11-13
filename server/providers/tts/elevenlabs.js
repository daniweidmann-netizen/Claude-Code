// Voice-Modul über ElevenLabs (Premium-Stimmen). Gleiches Tempo wie alle anderen Stimmen.
import { VOICES } from '../../../src/config/catalog.js';
import { speedUp } from './tempo.js';

const LANG_CODE = { de: 'de', 'de-CH': 'de', en: 'en', fr: 'fr', it: 'it', es: 'es' };

export default {
  name: 'elevenlabs',
  async synthesize({ text, voiceId, language = 'de' }) {
    const preset = VOICES.find((v) => v.id === voiceId) || VOICES[0];
    const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${preset.providerVoice.elevenlabs}?output_format=mp3_44100_128`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'xi-api-key': process.env.ELEVENLABS_API_KEY, Accept: 'audio/mpeg' },
      body: JSON.stringify({
        text,
        model_id: process.env.ELEVENLABS_MODEL || 'eleven_multilingual_v2',
        language_code: process.env.ELEVENLABS_MODEL === 'eleven_flash_v2_5' || process.env.ELEVENLABS_MODEL === 'eleven_turbo_v2_5' ? LANG_CODE[language] : undefined,
        voice_settings: { stability: 0.5, similarity_boost: 0.75, style: 0.15, use_speaker_boost: true },
      }),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      throw new Error(`TTS-Fehler ${res.status} (ElevenLabs) ${detail.slice(0, 120)}`);
    }
    const buf = await speedUp(Buffer.from(await res.arrayBuffer()));
    return { audioUrl: `data:audio/mpeg;base64,${buf.toString('base64')}` };
  },
};
