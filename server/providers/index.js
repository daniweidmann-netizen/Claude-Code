// Registry der austauschbaren KI-Module. Neues Modul: Datei anlegen + hier eintragen.
import { config } from '../config.js';
import llmMock from './llm/mock.js';
import llmAnthropic from './llm/anthropic.js';
import imageMock from './image/mock.js';
import imageOpenAI from './image/openai.js';
import ttsMock from './tts/mock.js';
import ttsElevenLabs from './tts/elevenlabs.js';
import ttsOpenAI from './tts/openai.js';

const REGISTRY = {
  llm: { mock: llmMock, anthropic: llmAnthropic },
  image: { mock: imageMock, openai: imageOpenAI },
  tts: { mock: ttsMock, elevenlabs: ttsElevenLabs, openai: ttsOpenAI },
};

const REQUIRED_KEYS = { anthropic: 'ANTHROPIC_API_KEY', openai: 'OPENAI_API_KEY', elevenlabs: 'ELEVENLABS_API_KEY' };

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

export function providerStatus() {
  return Object.fromEntries(Object.keys(REGISTRY).map((k) => [k, provider(k).name]));
}
