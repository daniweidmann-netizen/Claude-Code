// SEO-Seiten: Hook-Vorlagen pro Branche (/tiktok-hooks und /en/tiktok-hooks) mit Gratis-Test.
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, Copy, Check } from 'lucide-react';
import { HOOK_PAGES, HOOK_BASE, HOOK_TEXT, findHookPage } from '../../shared/hooks.js';
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

function TryBox({ lang }) {
  const T = HOOK_TEXT[lang];
  return (
    <section className="card mt-12 p-6">
      <h2 className="text-xl font-bold">{T.tryTitle}</h2>
      <p className="mt-1 text-sm muted">{T.trySub}</p>
      <DemoBox />
    </section>
  );
}

function CopyBtn({ text, T }) {
  const [ok, setOk] = useState(false);
  return (
    <button type="button" className="btn-icon h-8 w-8 shrink-0" aria-label={ok ? T.copied : T.copy} title={ok ? T.copied : T.copy}
      onClick={() => { navigator.clipboard?.writeText(text); setOk(true); setTimeout(() => setOk(false), 1500); }}>
      {ok ? <Check className="h-4 w-4 text-accent-700" /> : <Copy className="h-4 w-4" />}
    </button>
  );
}

export function HookIndex({ lang }) {
  const T = HOOK_TEXT[lang];
  useMeta(T.indexTitle, T.indexDescription);
  useLang(lang);
  return (
    <div className="section">
      <div className="container-x max-w-4xl">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">{T.indexTitle}</h1>
        <p className="mt-3 text-lg muted">{T.intro}</p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {HOOK_PAGES.map((p) => (
            <Link key={p.id} to={`${HOOK_BASE[lang]}/${p[lang].slug}`} className="card group p-5 transition hover:border-accent-400">
              <h2 className="font-bold">{p[lang].title}</h2>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-accent-700 dark:text-accent-400">{p[lang].hooks.length} Hooks<ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" /></span>
            </Link>
          ))}
        </div>
        <TryBox lang={lang} />
      </div>
    </div>
  );
}

export function HookPage({ lang }) {
  const { slug } = useParams();
  const found = findHookPage(lang, slug);
  const T = HOOK_TEXT[lang];
  useMeta(found?.page.title, found?.page.description);
  useLang(lang);
  if (!found) return <div className="section text-center"><Link className="btn-primary" to={HOOK_BASE[lang]}>{T.indexTitle}</Link></div>;
  const p = found.page;
  return (
    <div className="section">
      <article className="container-x max-w-3xl">
        <Link to={HOOK_BASE[lang]} className="text-sm font-semibold text-accent-700 dark:text-accent-400">← {T.indexTitle}</Link>
        <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">{p.title}</h1>
        <p className="mt-3 muted">{T.intro}</p>
        <ol className="mt-8 space-y-2">
          {p.hooks.map((h, i) => (
            <li key={i} className="card flex items-center gap-3 p-3.5">
              <span className="w-6 shrink-0 text-right font-bold text-accent-700 dark:text-accent-400">{i + 1}.</span>
              <span className="flex-1">{h}</span>
              <CopyBtn text={h} T={T} />
            </li>
          ))}
        </ol>
        <h2 className="mt-12 text-2xl font-bold">{T.tipsTitle}</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5">{T.tips.map((t) => <li key={t}>{t}</li>)}</ul>
        <TryBox lang={lang} />
        <h2 className="mt-12 text-lg font-bold">{T.others}</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {HOOK_PAGES.filter((x) => x[lang].slug !== slug).map((x) => <Link key={x.id} to={`${HOOK_BASE[lang]}/${x[lang].slug}`} className="rounded-full border border-navy-200 px-3 py-1.5 text-sm hover:border-accent-500 dark:border-navy-700">{x[lang].name}</Link>)}
        </div>
      </article>
    </div>
  );
}
