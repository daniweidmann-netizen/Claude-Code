import { useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { GUIDES, GUIDE_BASE, findGuide, guideHtml } from '../../shared/guides.js';
import { useI18n } from '../i18n/index.jsx';

const TEXT = {
  en: { title: 'Guides', sub: 'Practical, honest guides for faceless short-video creators.', read: 'Read guide', other: 'Diesen Ratgeber auf Deutsch lesen', updated: 'Updated', back: 'All guides', cta: 'Try TrueReel – 1 video free', notFound: 'Guide not found.' },
  de: { title: 'Ratgeber', sub: 'Praktische, ehrliche Ratgeber für Faceless-Kurzvideos.', read: 'Ratgeber lesen', other: 'Read this guide in English', updated: 'Aktualisiert', back: 'Alle Ratgeber', cta: 'TrueReel testen – 1 Video gratis', notFound: 'Ratgeber nicht gefunden.' },
};

function useMeta(title, description) {
  useEffect(() => {
    if (!title) return;
    document.title = `${title} | TrueReel`;
    document.querySelector('meta[name="description"]')?.setAttribute('content', description || '');
  }, [title, description]);
}

const fmtDate = (iso, lang) => new Date(`${iso}T12:00:00Z`).toLocaleDateString(lang === 'de' ? 'de-CH' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

// Liste – Sprache folgt der URL (/guides = Englisch, /ratgeber = Deutsch)
export function GuideIndex({ lang }) {
  const T = TEXT[lang];
  useMeta(T.title, T.sub);
  const { lang: uiLang, setLang } = useI18n();
  useEffect(() => { if (uiLang !== lang) setLang(lang); }, [lang]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className="section">
      <div className="container-x max-w-4xl">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">{T.title}</h1>
        <p className="mt-3 text-lg muted">{T.sub}</p>
        <div className="mt-10 grid gap-5">
          {GUIDES.map((g) => (
            <Link key={g.id} to={`${GUIDE_BASE[lang]}/${g[lang].slug}`} className="card group p-6 transition hover:border-accent-400">
              <h2 className="text-xl font-bold">{g[lang].title}</h2>
              <p className="mt-2 text-sm muted">{g[lang].description}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-accent-700 dark:text-accent-400">{T.read}<ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" /></span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export function GuidePage({ lang }) {
  const { slug } = useParams();
  const found = findGuide(lang, slug);
  const T = TEXT[lang];
  const otherLang = lang === 'de' ? 'en' : 'de';
  const html = useMemo(() => (found ? guideHtml(found.page.body) : ''), [found]);
  useMeta(found?.page.title, found?.page.description);
  const { lang: uiLang, setLang } = useI18n();
  useEffect(() => { if (uiLang !== lang) setLang(lang); }, [lang]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!found) return <div className="section text-center"><p className="muted">{T.notFound}</p><Link className="btn-primary mt-6" to={GUIDE_BASE[lang]}>{T.back}</Link></div>;
  const other = found.guide[otherLang];
  return (
    <div className="section">
      <article className="container-x prose-guide max-w-3xl">
        <Link to={GUIDE_BASE[lang]} className="text-sm font-semibold text-accent-700 dark:text-accent-400">← {T.back}</Link>
        <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">{found.page.title}</h1>
        <p className="mt-3 text-sm muted">
          {T.updated}: {fmtDate(found.page.updated, lang)}
          {other && <> · <Link className="underline" to={`${GUIDE_BASE[otherLang]}/${other.slug}`}>{T.other}</Link></>}
        </p>
        <div className="mt-6" dangerouslySetInnerHTML={{ __html: html }} />
        <div className="mt-12 rounded-2xl bg-accent-500 p-6 text-navy-950 sm:p-8">
          <p className="text-xl font-extrabold">{lang === 'de' ? 'Faceless-Videos, ohne alles selbst zu machen' : 'Faceless videos without doing everything yourself'}</p>
          <Link to="/registrieren" className="btn mt-4 bg-navy-950 text-white hover:bg-navy-800">{T.cta}</Link>
        </div>
      </article>
    </div>
  );
}
