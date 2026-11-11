// Client-Seite der KI-Pipeline. Ruft die austauschbaren Server-Module auf;
// ist der Server nicht erreichbar, wird lokal der Mock verwendet.
import { api } from '../lib/api.js';
import { uploadMedia } from '../lib/store.js';
import { mockScript, mockSeriesPlan } from '../../shared/mockScripts.js';

async function withFallback(path, body, fallback) {
  try {
    return await api(path, { method: 'POST', body });
  } catch (e) {
    if (/Failed to fetch|NetworkError|Load failed/.test(e.message) || [404, 500, 502].includes(e.status)) {
      console.warn(`[TrueReel] ${path} nicht erreichbar – nutze lokalen Mock.`);
      return { ...fallback(), provider: 'mock-offline' };
    }
    throw e;
  }
}

export const planSeries = (input) => withFallback('/generate/series', input, () => mockSeriesPlan(input));

export const generateScript = (input) => withFallback('/generate/script', input, () => mockScript(input));

// Gibt { imageUrl, credit } zurück – oder imageUrl:null, dann nutzt der Renderer die Platzhalter-Grafik.
export async function generateImage({ prompt, style, seed, userId, niche, archiveQuery, exclude = [] }) {
  try {
    const r = await api('/generate/image', { method: 'POST', body: { prompt, style, seed, niche, archiveQuery, exclude } });
    if (r.imageUrl && userId) r.imageUrl = await uploadMedia(userId, r.imageUrl);
    return r;
  } catch {
    return { imageUrl: null, provider: 'mock-offline' };
  }
}

// Skript einer bestehenden Folge neu schreiben (verbraucht kein neues Video)
export const regenerateScript = (input) => withFallback('/generate/script/preview', input, () => mockScript(input));

// Holt für alle Szenen Bilder (falls ein Bild-Modul verbunden ist). Fehler einzelner Szenen sind unkritisch.
export async function fillImages(project, userId, onProgress) {
  // Mehrere Szenen gleichzeitig (KI-Bilder brauchen je ~15 s); Reihenfolge bleibt erhalten.
  const list = project.scenes;
  const scenes = new Array(list.length);
  const used = [];
  let found = 0;
  let done = 0;
  let next = 0;
  const worker = async () => {
    while (next < list.length) {
      const i = next++;
      const s = list[i];
      const r = await generateImage({ prompt: s.visual || s.text, style: project.artStyle, seed: s.seed, userId, niche: project.niche, archiveQuery: project.archiveQuery, exclude: [...used] });
      if (r.credit?.url) used.push(r.credit.url);
      if (r.imageUrl) found++;
      scenes[i] = r.imageUrl ? { ...s, imageUrl: r.imageUrl, credit: r.credit || null } : s;
      onProgress?.(++done, list.length);
    }
  };
  await Promise.all(Array.from({ length: Math.min(4, list.length) }, worker));
  return { project: { ...project, scenes }, found, provider: found ? 'ok' : 'none' };
}
