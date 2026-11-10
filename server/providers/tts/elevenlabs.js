import { VOICES } from '../../../src/config/catalog.js';

export default {
  name: 'elevenlabs',
  async synthesize({ text, voiceId }) {
    const preset = VOICES.find((v) => v.id === voiceId) || VOICES[0];
    const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${preset.providerVoice.elevenlabs}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'xi-api-key': process.env.ELEVENLABS_API_KEY, Accept: 'audio/mpeg' },
      body: JSON.stringify({ text, model_id: 'eleven_multilingual_v2' }),
    });
    if (!res.ok) throw new Error(`TTS-Fehler ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    return { audioUrl: `data:audio/mpeg;base64,${buf.toString('base64')}` };
  },
};
