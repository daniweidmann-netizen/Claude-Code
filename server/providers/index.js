// Registry der austauschbaren KI-Module. Neues Modul: Datei anlegen + hier eintragen.
import { config } from '../config.js';
import llmMock from './llm/mock.js';
import llmAnthropic from './llm/anthropic.js';
import imageMock from './image/mock.js';
import imageOpenAI from './image/openai.js';
import imagePixabay from './image/pixabay.js';
import imageWikimedia from './image/wikimedia.js';
import ttsMock from './tts/mock.js';
import ttsElevenLabs from './tts/elevenlabs.js';
import ttsOpenAI from './tts/openai.js';

const REGISTRY = {
  llm: { mock: llmMock, anthropic: llmAnthropic },
  image: { mock: imageMock, openai: imageOpenAI, pixabay: imagePixabay, wikimedia: imageWikimedia },
  tts: { mock: ttsMock, elevenlabs: ttsElevenLabs, openai: ttsOpenAI },
};

const REQUIRED_KEYS = { anthropic: 'ANTHROPIC_API_KEY', openai: 'OPENAI_API_KEY', elevenlabs: 'ELEVENLABS_API_KEY', pixabay: 'PIXABAY_API_KEY' };

export function provider(kind) {
  const name = config.providers[kind];
  const mod = REGISTRY[kind]?.[name];
  const key = REQUIRED_KEYS[name];
  if (!mod || (key && !process.env[key])) {
    if (name !== 'mock') console.warn(`[providers] ${kind}="${name}" nicht konfiguriert → mock`);
    return REGISTRY[kind].mock;
  }
  return mod;
}

// Diagnose ohne Werte: gewünschter Anbieter und ob der nötige Schlüssel gesetzt ist
export function providerDiagnose() {
  return Object.fromEntries(Object.keys(REGISTRY).map((k) => {
    const wanted = config.providers[k];
    const key = REQUIRED_KEYS[wanted];
    return [k, { gewuenscht: wanted, bekannt: !!REGISTRY[k][wanted], schluessel: key ? (process.env[key] ? `${key} gesetzt` : `${key} FEHLT`) : 'nicht nötig' }];
  }));
}

export function providerStatus() {
  return Object.fromEntries(Object.keys(REGISTRY).map((k) => [k, provider(k).name]));
}

export const historyImageProvider = imageWikimedia;
