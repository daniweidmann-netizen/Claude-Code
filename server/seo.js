// SEO: pro URL eigener <title>, Beschreibung, Canonical, Sprach-Alternativen und
// für Ratgeber vorgerendertes HTML (Google sieht den Text ohne JavaScript).
import { GUIDES, GUIDE_BASE, findGuide, guideHtml } from '../shared/guides.js';
import { HOOK_PAGES, HOOK_BASE, HOOK_TEXT, HOOKS_UPDATED, findHookPage } from '../shared/hooks.js';
import { TOOLS, TOOL_BASE, TOOLS_UPDATED, toolText, findTool } from '../shared/tools.js';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const PAGES = {
  '/': { title: 'TrueReel – AI short videos for TikTok, Reels & Shorts', description: 'TrueReel creates faceless AI short videos for TikTok, Instagram Reels and YouTube Shorts. Set up a series once – script, images, voice-over and captions for every new episode. First video free, no credit card.' },
  '/firmen': { title: 'Kurzvideos für Firmen – TrueReel', description: 'Wir produzieren jeden Monat Kurzvideos für TikTok, Instagram Reels und YouTube Shorts für dein Unternehmen. Ab CHF 290 pro Monat, monatlich kündbar, kostenloses Beispielvideo.' },
  '/business': { title: 'Short videos for businesses – TrueReel', description: 'Monthly short videos for TikTok, Instagram Reels and YouTube Shorts for your business. From CHF 290 per month, cancel monthly, free sample video.' },
  '/partner': { title: 'Partnerprogramm – TrueReel', description: 'TrueReel empfehlen und mitverdienen: 20 % vom Gewinn für jeden geworbenen Kunden, monatliche Abrechnung. Jetzt als Partner bewerben.' },
  '/preise': { title: 'Pricing – TrueReel', description: 'Transparent pricing for faceless short videos: Hobby, Daily and Pro. Cancel any time. Try your first video free, no credit card.' },
  '/guides': { title: 'Guides – TrueReel', description: 'Practical, honest guides for faceless short-video creators on TikTok, Reels and YouTube Shorts.', lang: 'en', alt: '/ratgeber' },
  '/ratgeber': { title: 'Ratgeber – TrueReel', description: 'Praktische, ehrliche Ratgeber für Faceless-Kurzvideos auf TikTok, Reels und YouTube Shorts.', lang: 'de', alt: '/guides' },
  '/impressum': { title: 'Impressum – TrueReel' },
  '/datenschutz': { title: 'Privacy policy / Datenschutz – TrueReel' },
  '/agb': { title: 'Terms / AGB – TrueReel' },
  '/rueckerstattung': { title: 'Refund policy / Rückerstattung – TrueReel' },
};
const NOINDEX = /^\/(beispiel|app|login|registrieren)(\/|$)/;

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

// Hook-Seiten: Titel, Beschreibung, Sprach-Alternativen und vorgerenderte Liste für Google
function hookMeta(path) {
  const idx = path === HOOK_BASE.de ? 'de' : path === HOOK_BASE.en ? 'en' : null;
  if (idx) {
    const T = HOOK_TEXT[idx];
    return { title: `${T.indexTitle} | TrueReel`, description: T.indexDescription, lang: idx, alt: HOOK_BASE[idx === 'de' ? 'en' : 'de'],
      body: `<main style="max-width:720px;margin:0 auto;padding:32px 16px;font-family:system-ui,sans-serif"><h1>${esc(T.indexTitle)}</h1><p>${esc(T.intro)}</p><ul>${HOOK_PAGES.map((p) => `<li><a href="${HOOK_BASE[idx]}/${p[idx].slug}">${esc(p[idx].title)}</a></li>`).join('')}</ul></main>` };
  }
  const m = path.match(/^(\/en)?\/tiktok-hooks\/([\w-]+)$/);
  if (!m) return null;
  const lang = m[1] ? 'en' : 'de';
  const found = findHookPage(lang, m[2]);
  if (!found) return null;
  const other = lang === 'de' ? 'en' : 'de';
  const p = found.page; const T = HOOK_TEXT[lang];
  return {
    title: `${p.title} | TrueReel`, description: p.description, lang, type: 'article',
    alt: `${HOOK_BASE[other]}/${found.all[other].slug}`,
    jsonLd: { '@context': 'https://schema.org', '@type': 'Article', headline: p.title, description: p.description, dateModified: HOOKS_UPDATED, inLanguage: lang, publisher: { '@type': 'Organization', name: 'TrueReel' } },
    body: `<article style="max-width:720px;margin:0 auto;padding:32px 16px;font-family:system-ui,sans-serif"><h1>${esc(p.title)}</h1><p>${esc(T.intro)}</p><ol>${p.hooks.map((h) => `<li>${esc(h)}</li>`).join('')}</ol><h2>${esc(T.tipsTitle)}</h2><ul>${T.tips.map((t) => `<li>${esc(t)}</li>`).join('')}</ul></article>`,
  };
}

// Nischen-Generator-Seiten (Tools): Meta, Sprach-Alternativen, FAQ-Schema und vorgerenderter Text
function toolMeta(path) {
  const idx = path === TOOL_BASE.de ? 'de' : path === TOOL_BASE.en ? 'en' : null;
  if (idx) {
    const T = toolText(idx);
    return { title: `${T.indexTitle} | TrueReel`, description: T.indexDescription, lang: idx, alt: TOOL_BASE[idx === 'de' ? 'en' : 'de'],
      body: `<main style="max-width:720px;margin:0 auto;padding:32px 16px;font-family:system-ui,sans-serif"><h1>${esc(T.indexTitle)}</h1><p>${esc(T.indexDescription)}</p><ul>${TOOLS.map((t) => `<li><a href="${TOOL_BASE[idx]}/${t[idx].slug}">${esc(t[idx].title)}</a></li>`).join('')}</ul></main>` };
  }
  const m = path.match(/^\/(tools|ki-video-generator)\/([\w-]+)$/);
  if (!m) return null;
  const lang = m[1] === 'tools' ? 'en' : 'de';
  const found = findTool(lang, m[2]);
  if (!found) return null;
  const p = found.page; const T = toolText(lang); const other = lang === 'de' ? 'en' : 'de';
  return {
    title: `${p.title} | TrueReel`, description: p.description, lang, alt: `${TOOL_BASE[other]}/${found.tool[other].slug}`,
    jsonLd: { '@context': 'https://schema.org', '@type': 'FAQPage', inLanguage: lang, mainEntity: p.faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
    body: `<article style="max-width:720px;margin:0 auto;padding:32px 16px;font-family:system-ui,sans-serif"><h1>${esc(p.title)}</h1><p>${esc(p.intro)}</p><h2>${esc(T.stepsTitle)}</h2><ol>${T.steps.map(([h, d]) => `<li><b>${esc(h)}</b> – ${esc(d)}</li>`).join('')}</ol><h2>${esc(T.examplesTitle)}</h2><ul>${p.examples.map((e) => `<li>${esc(e)}</li>`).join('')}</ul><h2>${esc(T.faqTitle)}</h2>${p.faq.map(([q, a]) => `<h3>${esc(q)}</h3><p>${esc(a)}</p>`).join('')}</article>`,
  };
}

function indexBody(lang) {
  return `<main style="max-width:720px;margin:0 auto;padding:32px 16px;font-family:system-ui,sans-serif"><h1>${lang === 'de' ? 'Ratgeber' : 'Guides'}</h1><ul>${GUIDES.map((g) => `<li><a href="${GUIDE_BASE[lang]}/${g[lang].slug}">${esc(g[lang].title)}</a> – ${esc(g[lang].description)}</li>`).join('')}</ul></main>`;
}

export function renderHtml(template, path, appUrl, acceptLanguage = '') {
  const clean = path.split('?')[0].replace(/\/+$/, '') || '/';
  const meta = guideMeta(clean) || hookMeta(clean) || toolMeta(clean) || PAGES[clean] || null;
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
  // Sprache ans Browser-Signal anpassen, damit kein automatisches Übersetzen angeboten wird
  const browserDe = /^de\b/i.test(String(acceptLanguage).trim());
  const pageLang = meta?.lang || (browserDe ? 'de' : null);
  if (pageLang) html = html.replace(/<html lang="\w+"/, `<html lang="${pageLang}"`);
  html = html.replace('</head>', `${head.join('')}<meta property="og:url" content="${url}"></head>`);
  const body = meta?.body || (clean === '/guides' ? indexBody('en') : clean === '/ratgeber' ? indexBody('de') : null);
  if (body) html = html.replace('<div id="root"></div>', `<div id="root">${body}</div>`);
  return html;
}

export function sitemap(appUrl) {
  const today = new Date().toISOString().slice(0, 10);
  const urls = [['/', today], ['/preise', today], ['/partner', today], ['/firmen', today], ['/business', today], ['/guides', today], ['/ratgeber', today],
    ...GUIDES.flatMap((g) => ['en', 'de'].map((l) => [`${GUIDE_BASE[l]}/${g[l].slug}`, g[l].updated])),
    [HOOK_BASE.de, HOOKS_UPDATED], [HOOK_BASE.en, HOOKS_UPDATED], [TOOL_BASE.de, TOOLS_UPDATED], [TOOL_BASE.en, TOOLS_UPDATED],
    ...TOOLS.flatMap((t) => ['de', 'en'].map((l) => [`${TOOL_BASE[l]}/${t[l].slug}`, TOOLS_UPDATED])),
    ...HOOK_PAGES.flatMap((p) => ['de', 'en'].map((l) => [`${HOOK_BASE[l]}/${p[l].slug}`, HOOKS_UPDATED])),
    ['/impressum', today], ['/datenschutz', today], ['/agb', today], ['/rueckerstattung', today]];
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(([u, d]) => `  <url><loc>${appUrl}${u === '/' ? '/' : u}</loc><lastmod>${d}</lastmod></url>`).join('\n')}\n</urlset>\n`;
}

export const robots = (appUrl) => `User-agent: *\nAllow: /\nDisallow: /app\nDisallow: /api/\n\nSitemap: ${appUrl}/sitemap.xml\n`;
