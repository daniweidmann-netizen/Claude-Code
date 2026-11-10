// Bild-Modul: kostenlose Stockfotos/-illustrationen von Pixabay (https://pixabay.com/api/docs/).
// - Bilder werden serverseitig heruntergeladen und als Data-URL zurückgegeben
//   (Pixabay untersagt dauerhaftes Hotlinking; ausserdem bleibt der Canvas-Export CORS-frei).
// - Jede Szene erhält eine Quellenangabe (credit), die im Editor angezeigt wird.
const API = 'https://pixabay.com/api/';

// Illustrations-Stile suchen Illustrationen, alle anderen Fotos
const IMAGE_TYPE = { anime: 'illustration', comic: 'illustration' };

const STOPWORDS = new Set(['a', 'an', 'the', 'of', 'in', 'on', 'at', 'with', 'and', 'or', 'to', 'by', 'for', 'from', 'over', 'under', 'into', 'after', 'before', 'its', 'their', 'scene']);

function keywords(prompt) {
  return String(prompt || '')
    .toLowerCase()
    .replace(/[^a-z0-9äöüß\s-]/gi, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOPWORDS.has(w));
}

async function search(params) {
  const url = `${API}?${new URLSearchParams({ key: process.env.PIXABAY_API_KEY, safesearch: 'true', per_page: '30', ...params })}`;
  const res = await fetch(url);
  if (res.status === 429) throw new Error('Pixabay-Limit erreicht – bitte kurz warten.');
  if (!res.ok) throw new Error(`Pixabay-Fehler ${res.status}`);
  return (await res.json()).hits || [];
}

async function toDataUrl(src) {
  const res = await fetch(src);
  if (!res.ok) throw new Error(`Bild-Download fehlgeschlagen (${res.status})`);
  const type = res.headers.get('content-type') || 'image/jpeg';
  return `data:${type};base64,${Buffer.from(await res.arrayBuffer()).toString('base64')}`;
}

export default {
  name: 'pixabay',
  async generate({ prompt, style, seed = 0 }) {
    const words = keywords(prompt);
    const image_type = IMAGE_TYPE[style] || 'photo';
    // Von spezifisch zu allgemein suchen, bis etwas gefunden wird
    const attempts = [
      { q: words.slice(0, 5).join(' '), orientation: 'vertical' },
      { q: words.slice(0, 3).join(' '), orientation: 'vertical' },
      { q: words.slice(0, 3).join(' ') },
      { q: words.slice(0, 2).join(' ') },
      { q: words[0] || 'landscape' },
    ];
    for (const a of attempts) {
      if (!a.q) continue;
      const hits = await search({ ...a, image_type });
      if (!hits.length) continue;
      const hit = hits[Math.abs(seed) % hits.length];
      return {
        imageUrl: await toDataUrl(hit.largeImageURL || hit.webformatURL),
        credit: { source: 'Pixabay', author: hit.user, url: hit.pageURL },
      };
    }
    return { imageUrl: null };
  },
};
