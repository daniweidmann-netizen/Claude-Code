// SEO-Seiten „KI-Video-Generator“ pro Nische (/tools/:slug englisch, /ki-video-generator/:slug deutsch).
import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { TOOLS, TOOL_BASE, toolText, findTool } from '../../shared/tools.js';
import { useI18n } from '../i18n/index.jsx';
import { DemoBox } from './Landing.jsx';

function useMeta(title, description) {
  useEffect(() => {
    if (!title) return;
    document.title = `${title} | TrueReel`;
    document.querySelector('meta[name="description"]')?.setAttribute('content', description || '');
  }, [title, description]);
}
function useLang(lang) {
  const { lang: uiLang, setLang } = useI18n();
  useEffect(() => { if (uiLang !== lang) setLang(lang); }, [lang]); // eslint-disable-line react-hooks/exhaustive-deps
}

export function ToolIndex({ lang }) {
  const T = toolText(lang);
  useMeta(T.indexTitle, T.indexDescription);
  useLang(lang);
  return (
    <div className="section">
      <div className="container-x max-w-4xl">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">{T.indexTitle}</h1>
        <p className="mt-3 text-lg muted">{T.indexDescription}</p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {TOOLS.map((t) => (
            <Link key={t.id} to={`${TOOL_BASE[lang]}/${t[lang].slug}`} className="card card-hover group p-5">
              <h2 className="font-bold">{t[lang].title}</h2>
              <p className="mt-2 text-sm muted">{t[lang].description}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-accent-700 dark:text-accent-400">{t[lang].name}<ArrowRight className="h-4 w-4" /></span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ToolPage({ lang }) {
  const { slug } = useParams();
  const found = findTool(lang, slug);
  const T = toolText(lang);
  useMeta(found?.page.title, found?.page.description);
  useLang(lang);
  if (!found) return <div className="section text-center"><Link className="btn-primary" to={TOOL_BASE[lang]}>{T.indexTitle}</Link></div>;
  const p = found.page;
  const other = lang === 'de' ? 'en' : 'de';
  return (
    <div>
      <section className="relative isolate overflow-hidden">
        <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[420px] w-[800px] -translate-x-1/2 rounded-full bg-accent-500/15 blur-3xl" aria-hidden="true" />
        <div className="container-x max-w-3xl py-14 sm:py-20">
          <Link to={TOOL_BASE[lang]} className="text-sm font-semibold text-accent-700 dark:text-accent-400">← {T.indexTitle}</Link>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">{p.title}</h1>
          <p className="mt-5 text-lg muted">{p.intro}</p>
          <div className="mt-2"><DemoBox topics={p.topics} /></div>
          <p className="mt-3 text-xs muted">{T.note} · <Link to={`${TOOL_BASE[other]}/${found.tool[other].slug}`} className="underline">{other === 'en' ? 'English' : 'Deutsch'}</Link></p>
        </div>
      </section>
      <section className="section section-alt">
        <div className="container-x max-w-3xl">
          <h2 className="h2">{T.stepsTitle}</h2>
          <ol className="mt-8 grid gap-4 sm:grid-cols-3">
            {T.steps.map(([h, d], i) => (
              <li key={h} className="card p-5"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-500 font-extrabold text-navy-950">{i + 1}</span><h3 className="mt-3 font-bold">{h}</h3><p className="mt-1 text-sm muted">{d}</p></li>
            ))}
          </ol>
          <h2 className="h2 mt-16">{T.examplesTitle}</h2>
          <ul className="mt-6 space-y-2">{p.examples.map((e) => <li key={e} className="card flex gap-3 p-4"><Check className="mt-0.5 h-5 w-5 shrink-0 text-accent-700 dark:text-accent-400" />{e}</li>)}</ul>
        </div>
      </section>
      <section className="section">
        <div className="container-x max-w-3xl">
          <h2 className="h2">{T.faqTitle}</h2>
          <dl className="mt-6 space-y-4">{p.faq.map(([q, a]) => <div key={q} className="card p-5"><dt className="font-bold">{q}</dt><dd className="mt-1 text-sm muted">{a}</dd></div>)}</dl>
          <div className="mt-12 text-center"><Link to="/registrieren" className="btn-primary px-8 py-3.5 text-base">{T.cta}<ArrowRight className="h-4 w-4" /></Link></div>
          <h2 className="mt-16 text-lg font-bold">{T.others}</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {TOOLS.filter((x) => x.id !== found.tool.id).map((x) => <Link key={x.id} to={`${TOOL_BASE[lang]}/${x[lang].slug}`} className="rounded-full border border-navy-200 px-3 py-1.5 text-sm hover:border-accent-500 dark:border-navy-700">{x[lang].name}</Link>)}
          </div>
        </div>
      </section>
    </div>
  );
}
