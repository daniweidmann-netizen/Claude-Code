// Bild-Modul: kostenlose Stockfotos/-illustrationen von Pixabay (https://pixabay.com/api/docs/).
// - Bilder werden serverseitig heruntergeladen und als Data-URL zurückgegeben
//   (Pixabay untersagt dauerhaftes Hotlinking; ausserdem bleibt der Canvas-Export CORS-frei).
// - Jede Szene erhält eine Quellenangabe (credit), die im Editor angezeigt wird.
const API = 'https://pixabay.com/api/';

// Illustrations-Stile suchen Illustrationen, alle anderen Fotos
const IMAGE_TYPE = { anime: 'illustration', comic: 'illustration', manga: 'illustration' };

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
  const res = await fetch(url, { headers: HEADERS });
  if (res.status === 429) throw new Error('Pixabay-Limit erreicht – bitte kurz warten.');
  if (!res.ok) throw new Error(`Pixabay-Fehler ${res.status}`);
  return (await res.json()).hits || [];
}

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const HEADERS = { 'User-Agent': 'TrueReel/1.0 (+https://truereel.ch)' };

// Pixabays CDN drosselt schnelle Folge-Downloads (429) → mit Pause erneut versuchen
async function toDataUrl(src) {
  let last = 0;
  for (let attempt = 0; attempt < 4; attempt++) {
    if (attempt) await wait(800 * 2 ** (attempt - 1));
    const res = await fetch(src, { headers: HEADERS });
    if (res.ok) {
      const type = res.headers.get('content-type') || 'image/jpeg';
      return `data:${type};base64,${Buffer.from(await res.arrayBuffer()).toString('base64')}`;
    }
    last = res.status;
    if (res.status !== 429 && res.status < 500) break;
  }
  throw new Error(`Bild-Download fehlgeschlagen (${last})`);
}

export default {
  name: 'pixabay',
  async generate({ prompt, style, seed = 0, exclude = [] }) {
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
      const hits = (await search({ ...a, image_type })).filter((h) => !exclude.includes(h.pageURL));
      if (!hits.length) continue;
      const hit = hits[Math.abs(seed) % hits.length];
      let imageUrl;
      try {
        imageUrl = await toDataUrl(hit.largeImageURL || hit.webformatURL);
      } catch {
        imageUrl = await toDataUrl(hit.webformatURL); // kleinere Variante als Rückfall
      }
      return {
        imageUrl,
        credit: { source: 'Pixabay', author: hit.user, url: hit.pageURL },
      };
    }
    return { imageUrl: null };
  },
};
