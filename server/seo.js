// SEO: pro URL eigener <title>, Beschreibung, Canonical, Sprach-Alternativen und
// für Ratgeber vorgerendertes HTML (Google sieht den Text ohne JavaScript).
import { GUIDES, GUIDE_BASE, findGuide, guideHtml } from '../shared/guides.js';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const PAGES = {
  '/': { title: 'TrueReel – Faceless videos that perform', description: 'TrueReel creates faceless short videos for TikTok, Instagram Reels and YouTube Shorts – with AI script, voiceover, captions and auto-posting. 1 free video, no credit card.' },
  '/preise': { title: 'Pricing – TrueReel', description: 'Transparent pricing for faceless short videos: Hobby, Daily and Pro. Cancel any time. Try 1 video free, no credit card.' },
  '/guides': { title: 'Guides – TrueReel', description: 'Practical, honest guides for faceless short-video creators on TikTok, Reels and YouTube Shorts.', lang: 'en', alt: '/ratgeber' },
  '/ratgeber': { title: 'Ratgeber – TrueReel', description: 'Praktische, ehrliche Ratgeber für Faceless-Kurzvideos auf TikTok, Reels und YouTube Shorts.', lang: 'de', alt: '/guides' },
  '/impressum': { title: 'Impressum – TrueReel' },
  '/datenschutz': { title: 'Privacy policy / Datenschutz – TrueReel' },
  '/agb': { title: 'Terms / AGB – TrueReel' },
  '/rueckerstattung': { title: 'Refund policy / Rückerstattung – TrueReel' },
};
const NOINDEX = /^\/(app|login|registrieren)(\/|$)/;

function guideMeta(path) {
  const m = path.match(/^\/(guides|ratgeber)\/([\w-]+)\/?$/);
  if (!m) return null;
  const lang = m[1] === 'ratgeber' ? 'de' : 'en';
  const found = findGuide(lang, m[2]);
  if (!found) return null;
  const other = lang === 'de' ? 'en' : 'de';
  const p = found.page;
  const jsonLd = { '@context': 'https://schema.org', '@type': 'Article', headline: p.title, description: p.description, dateModified: p.updated, inLanguage: lang, publisher: { '@type': 'Organization', name: 'TrueReel' } };
  return {
    title: `${p.title} | TrueReel`,
    description: p.description,
    lang,
    alt: found.guide[other] ? `${GUIDE_BASE[other]}/${found.guide[other].slug}` : null,
    type: 'article',
    body: `<article style="max-width:720px;margin:0 auto;padding:32px 16px;font-family:system-ui,sans-serif"><h1>${esc(p.title)}</h1>${guideHtml(p.body)}</article>`,
    jsonLd,
  };
}

function indexBody(lang) {
  return `<main style="max-width:720px;margin:0 auto;padding:32px 16px;font-family:system-ui,sans-serif"><h1>${lang === 'de' ? 'Ratgeber' : 'Guides'}</h1><ul>${GUIDES.map((g) => `<li><a href="${GUIDE_BASE[lang]}/${g[lang].slug}">${esc(g[lang].title)}</a> – ${esc(g[lang].description)}</li>`).join('')}</ul></main>`;
}

export function renderHtml(template, path, appUrl) {
  const clean = path.split('?')[0].replace(/\/+$/, '') || '/';
  const meta = guideMeta(clean) || PAGES[clean] || null;
  let html = template;
  const url = `${appUrl}${clean === '/' ? '' : clean}`;
  const head = [`<link rel="canonical" href="${url}">`];
  if (NOINDEX.test(clean)) head.push('<meta name="robots" content="noindex">');
  if (meta?.alt) {
    head.push(`<link rel="alternate" hreflang="${meta.lang}" href="${url}">`);
    head.push(`<link rel="alternate" hreflang="${meta.lang === 'de' ? 'en' : 'de'}" href="${appUrl}${meta.alt}">`);
  }
  if (meta?.jsonLd) head.push(`<script type="application/ld+json">${JSON.stringify(meta.jsonLd).replace(/</g, '\\u003c')}</script>`);
  if (meta?.title) {
    html = html.replace(/<title>.*?<\/title>/, `<title>${esc(meta.title)}</title>`)
      .replace(/(<meta property="og:title" content=")[^"]*"/, `$1${esc(meta.title)}"`);
  }
  if (meta?.description) {
    html = html.replace(/(<meta name="description" content=")[^"]*"/, `$1${esc(meta.description)}"`)
      .replace(/(<meta property="og:description" content=")[^"]*"/, `$1${esc(meta.description)}"`);
  }
  if (meta?.type) html = html.replace('<meta property="og:type" content="website" />', `<meta property="og:type" content="${meta.type}" />`);
  if (meta?.lang) html = html.replace(/<html lang="\w+"/, `<html lang="${meta.lang}"`);
  html = html.replace('</head>', `${head.join('')}<meta property="og:url" content="${url}"></head>`);
  const body = meta?.body || (clean === '/guides' ? indexBody('en') : clean === '/ratgeber' ? indexBody('de') : null);
  if (body) html = html.replace('<div id="root"></div>', `<div id="root">${body}</div>`);
  return html;
}

export function sitemap(appUrl) {
  const today = new Date().toISOString().slice(0, 10);
  const urls = [['/', today], ['/preise', today], ['/guides', today], ['/ratgeber', today],
    ...GUIDES.flatMap((g) => ['en', 'de'].map((l) => [`${GUIDE_BASE[l]}/${g[l].slug}`, g[l].updated])),
    ['/impressum', today], ['/datenschutz', today], ['/agb', today], ['/rueckerstattung', today]];
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(([u, d]) => `  <url><loc>${appUrl}${u === '/' ? '/' : u}</loc><lastmod>${d}</lastmod></url>`).join('\n')}\n</urlset>\n`;
}

export const robots = (appUrl) => `User-agent: *\nAllow: /\nDisallow: /app\nDisallow: /api/\n\nSitemap: ${appUrl}/sitemap.xml\n`;
