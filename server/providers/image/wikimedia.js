// Bild-Modul: Wikimedia Commons – historische Gemälde, Fotos, Stiche. Kein Schlüssel nötig.
// Es werden NUR gemeinfreie (Public Domain) bzw. CC0-Dateien verwendet – keine Lizenzpflichten,
// trotzdem wird die Quelle angegeben. Doku: https://commons.wikimedia.org/w/api.php
const API = 'https://commons.wikimedia.org/w/api.php';
// Wikimedia verlangt einen aussagekräftigen User-Agent (https://meta.wikimedia.org/wiki/User-Agent_policy)
const HEADERS = { 'User-Agent': 'TrueReel/1.0 (https://truereel-der5.onrender.com) video-tool' };

const FREE = /^(public domain|pd|cc0|cc-zero)/i;
const stripHtml = (s) => String(s || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

function isFree(meta = {}) {
  const short = meta.LicenseShortName?.value || '';
  const lic = meta.License?.value || '';
  return FREE.test(short) || FREE.test(lic);
}

async function search(query, mustContain = []) {
  const params = new URLSearchParams({
    action: 'query', format: 'json', origin: '*',
    generator: 'search', gsrnamespace: '6', gsrlimit: '15',
    gsrsearch: `${query} filetype:bitmap`,
    prop: 'imageinfo', iiprop: 'url|extmetadata|size|mime', iiurlwidth: '1080',
    iiextmetadatafilter: 'LicenseShortName|License|Artist',
  });
  let res;
  for (let attempt = 0; attempt < 4; attempt++) {
    if (attempt) await wait(1000 * 2 ** (attempt - 1));
    res = await fetch(`${API}?${params}`, { headers: HEADERS });
    if (res.status !== 429 && res.status < 500) break;
  }
  if (res.status === 429) { console.warn('[wikimedia] gedrosselt – Rückfall auf anderes Bild-Modul'); return []; }
  if (!res.ok) throw new Error(`Wikimedia-Fehler ${res.status}`);
  const pages = Object.values((await res.json()).query?.pages || {});
  return pages
    .map((p) => ({ title: p.title, info: p.imageinfo?.[0] }))
    .filter((p) => p.info && /jpe?g|png/.test(p.info.mime) && p.info.width >= 600 && isFree(p.info.extmetadata))
    // Bei kombinierten Suchen muss das Hauptthema im Dateinamen vorkommen (sonst z. B. falsche Grenzübergänge)
    .filter((p) => !mustContain.length || mustContain.some((w) => p.title.toLowerCase().includes(w)))
    .sort((a, b) => (a.title < b.title ? -1 : 1)); // deterministische Reihenfolge für den Seed
}

async function download(url) {
  for (let attempt = 0; attempt < 3; attempt++) {
    if (attempt) await wait(700 * attempt);
    const res = await fetch(url, { headers: HEADERS });
    if (res.ok) {
      const type = res.headers.get('content-type') || 'image/jpeg';
      return `data:${type};base64,${Buffer.from(await res.arrayBuffer()).toString('base64')}`;
    }
    if (res.status !== 429 && res.status < 500) break;
  }
  return null;
}

function cleanAuthor(html) {
  const a = stripHtml(html);
  if (!a || /unknown|unbekannt|anonymous/i.test(a)) return 'unbekannt';
  return a.slice(0, 80);
}

const STOP = new Set(['a', 'an', 'the', 'of', 'in', 'on', 'at', 'with', 'and', 'or', 'to', 'by', 'for', 'from', 'over', 'after', 'before', 'scene', 'close', 'up']);
const words = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9\s-]/gi, ' ').split(/\s+/).filter((w) => w.length > 2 && !STOP.has(w));

export default {
  name: 'wikimedia',
  async generate({ prompt, archiveQuery, seed = 0 }) {
    const kw = words(prompt);
    const topic = words(archiveQuery).filter((w) => !/^\d+$/.test(w));
    const attempts = [
      archiveQuery && kw.length ? { q: `${archiveQuery} ${kw.slice(0, 2).join(' ')}`, must: topic } : null,
      archiveQuery ? { q: archiveQuery, must: [] } : null,
    ].filter(Boolean);
    for (const { q, must } of attempts) {
      const hits = await search(q, must);
      if (!hits.length) continue;
      const hit = hits[Math.abs(seed) % hits.length];
      const imageUrl = await download(hit.info.thumburl || hit.info.url);
      if (!imageUrl) continue;
      const m = hit.info.extmetadata || {};
      return {
        imageUrl,
        credit: {
          source: 'Wikimedia Commons',
          author: cleanAuthor(m.Artist?.value),
          license: m.LicenseShortName?.value || 'Public domain',
          url: hit.info.descriptionurl,
        },
      };
    }
    return { imageUrl: null };
  },
};
