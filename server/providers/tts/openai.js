import { VOICES } from '../../../src/config/catalog.js';

export default {
  name: 'openai',
  async synthesize({ text, voiceId }) {
    const preset = VOICES.find((v) => v.id === voiceId) || VOICES[0];
    const res = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      body: JSON.stringify({ model: process.env.OPENAI_TTS_MODEL || 'gpt-4o-mini-tts', voice: preset.providerVoice.openai, input: text, response_format: 'mp3' }),
    });
    if (!res.ok) throw new Error(`TTS-Fehler ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    return { audioUrl: `data:audio/mpeg;base64,${buf.toString('base64')}` };
  },
};
