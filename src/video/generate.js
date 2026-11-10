// Client-Seite der KI-Pipeline. Ruft die austauschbaren Server-Module auf;
// ist der Server nicht erreichbar, wird lokal der Mock verwendet.
import { api } from '../lib/api.js';
import { mockScript, mockSeriesPlan } from '../../shared/mockScripts.js';

async function withFallback(path, body, fallback) {
  try {
    return await api(path, { method: 'POST', body });
  } catch (e) {
    if (/Failed to fetch|NetworkError|Fehler 50[02]|Fehler 404/.test(e.message)) {
      console.warn(`[TrueReel] ${path} nicht erreichbar – nutze lokalen Mock.`);
      return { ...fallback(), provider: 'mock-offline' };
    }
    throw e;
  }
}

export const planSeries = (input) => withFallback('/generate/series', input, () => mockSeriesPlan(input));

export const generateScript = (input) => withFallback('/generate/script', input, () => mockScript(input));

// Gibt { imageUrl } zurück – oder imageUrl:null, dann nutzt der Renderer die Platzhalter-Grafik.
export async function generateImage({ prompt, style, seed }) {
  try {
    return await api('/generate/image', { method: 'POST', body: { prompt, style, seed } });
  } catch {
    return { imageUrl: null, provider: 'mock-offline' };
  }
}

// Skript einer bestehenden Folge neu schreiben (verbraucht kein neues Video)
export const regenerateScript = (input) => withFallback('/generate/script/preview', input, () => mockScript(input));
