import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight, Layers, FileText, Image, Mic, Captions, Music, Scissors, CalendarClock, Download, LayoutDashboard,
  Tag, MousePointerClick, Sparkles, Megaphone, Eye, Languages, Mail, Search, PenSquare, Send, Heart, MessageCircle, Share2,
} from 'lucide-react';
import { useI18n } from '../i18n/index.jsx';
import { PhoneFrame } from '../components/ui.jsx';
import { PricingSection, FAQ } from '../components/Pricing.jsx';
import Player from '../video/Player.jsx';
import { scriptToProject } from '../video/project.js';
import { exampleScripts } from '../config/examples.js';
import { NICHES } from '../config/catalog.js';
import { SITE } from '../config/site.js';
import { translate as tr } from '../i18n/index.jsx';

function useExampleProject(key, lang) {
  return useMemo(() => {
    const s = exampleScripts(lang)[key];
    const p = scriptToProject(s, { language: lang, artStyle: s.style, captions: { style: s.caption }, voiceId: 'calm-m', music: { trackId: 'calm' } });
    p.scenes.forEach((sc, i) => { sc.seed = 1000 + i * 77 + key.length * 13; });
    return p;
  }, [key, lang]);
}

// Beispielvideo für das Handy im Hero (Fotos: Pixabay, frei nutzbar)
const DEMO_SCRIPT = {
  de: { hook: 'Manchmal braucht es nur einen neuen Blick.', scenes: ['Tief in den Bergen liegt ein See, den kaum jemand kennt.', 'Der Weg ist steil – aber oben wartet eine Ruhe, die du kaum noch findest.', 'Und genau dort merkst du: Es hat sich gelohnt.'], cta: 'Würdest du diesen Ort auf deine Liste setzen?' },
  en: { hook: 'Sometimes all it takes is a new perspective.', scenes: ['Deep in the mountains lies a lake almost nobody knows.', 'The trail is steep – but at the top waits a calm you rarely find.', 'And right there you realise: it was worth it.'], cta: 'Would you put this place on your list?' },
};
const DEMO_IMAGES = ['/demo/scene4.jpg', '/demo/scene1.jpg', '/demo/scene0.jpg', '/demo/scene2.jpg', '/demo/scene3.jpg'];

function useHeroProject(lang) {
  return useMemo(() => {
    const d = DEMO_SCRIPT[lang] || DEMO_SCRIPT.de;
    const p = scriptToProject({ title: 'Demo', hook: d.hook, scenes: d.scenes.map((text) => ({ text })), cta: d.cta }, { language: lang, artStyle: 'realistic', captions: { style: 'karaoke', highlight: '#c9f03f', position: 'bottom' }, music: { trackId: 'calm' } });
    p.scenes.forEach((sc, i) => { sc.imageUrl = DEMO_IMAGES[i % DEMO_IMAGES.length]; sc.seed = 100 + i; });
    return p;
  }, [lang]);
}

// Handy im Stil einer Kurzvideo-App (ohne erfundene Like-Zahlen)
function HeroPhone() {
  const { lang } = useI18n();
  return (
    <div className="relative mx-auto w-full max-w-[300px] rounded-[2.8rem] border-[9px] border-navy-800 bg-black shadow-2xl ring-1 ring-white/10">
      <div className="absolute left-1/2 top-2 z-20 h-6 w-24 -translate-x-1/2 rounded-full bg-black" aria-hidden="true" />
      <div className="relative overflow-hidden rounded-[2.2rem]">
        <video className="block aspect-[9/16] w-full object-cover" src="/showcase/restaurant-pizza.mp4" poster="/showcase/restaurant-pizza.jpg" autoPlay muted loop playsInline preload="auto" aria-label={lang === 'en' ? 'Example video made with TrueReel' : 'Beispielvideo, erstellt mit TrueReel'} />
        <div className="pointer-events-none absolute bottom-24 right-3 flex flex-col items-center gap-5 text-white drop-shadow">
          <Heart className="h-7 w-7 fill-white" /><MessageCircle className="h-7 w-7 fill-white" /><Share2 className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}

// Test ohne Konto: Thema eingeben → Hook + Kurz-Skript sofort sehen
const DEMO_TOPICS = { de: ['Warum Flamingos rosa sind', 'Der kürzeste Krieg der Geschichte', '3 Tipps für besseren Schlaf'], en: ['Why flamingos are pink', 'The shortest war in history', '3 tips for better sleep'] };
export function DemoBox() {
  const { t, lang } = useI18n();
  const navigate = useNavigate();
  const [topic, setTopic] = useState('');
  const [busy, setBusy] = useState(false);
  const [res, setRes] = useState(null);
  const [err, setErr] = useState('');
  const resRef = useRef(null);
  useEffect(() => { if (res) resRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, [res]);
  const run = async (e, value) => {
    e?.preventDefault();
    const tp = (value ?? topic).trim();
    if (tp.length < 3) return setErr(t('demo.short'));
    setTopic(tp); setBusy(true); setErr(''); setRes(null);
    try {
      const r = await fetch('/api/demo/script', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ topic: tp, language: lang === 'en' ? 'en' : 'de' }) });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j.error ? tr(j.error) : t('demo.fail'));
      setRes(j);
    } catch (x) { setErr(x.message || t('demo.fail')); }
    setBusy(false);
  };
  const toVideo = () => {
    try { localStorage.setItem('tr-first-topic', JSON.stringify({ topic, at: Date.now() })); } catch { /* egal */ }
    navigate('/registrieren');
  };
  return (
    <div className="mt-8 max-w-xl">
      <form onSubmit={run} className="card flex flex-col gap-2 p-2 sm:flex-row">
        <label htmlFor="demo-topic" className="sr-only">{t('demo.label')}</label>
        <input id="demo-topic" className="input flex-1 border-0 text-base" maxLength={120} placeholder={t('demo.placeholder')} value={topic} onChange={(e) => setTopic(e.target.value)} />
        <button className="btn-primary px-5 py-3 text-base" disabled={busy}>{busy ? <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" /> : <Sparkles className="h-4 w-4" />}{t('demo.button')}</button>
      </form>
      {!res && !busy && (
        <div className="mt-2 flex flex-wrap gap-2 text-xs">
          <span className="muted">{t('demo.try')}</span>
          {(DEMO_TOPICS[lang] || DEMO_TOPICS.de).map((x) => <button key={x} type="button" className="rounded-full border border-navy-200 px-2.5 py-1 hover:border-accent-500 dark:border-navy-700" onClick={() => run(null, x)}>{x}</button>)}
        </div>
      )}
      {busy && <p className="mt-3 text-sm muted">{t('demo.busy')}</p>}
      {err && <p className="mt-3 text-sm text-red-600 dark:text-red-400" role="alert">{err}</p>}
      {res && (
        <div ref={resRef} className="card mt-4 scroll-mt-20 p-5" aria-live="polite">
          <p className="eyebrow">{t('demo.hook')}</p>
          <p className="mt-1 text-xl font-bold leading-snug">{res.hook}</p>
          <ol className="mt-4 space-y-2 text-sm">
            {res.scenes.map((s, i) => <li key={i} className="flex gap-2"><span className="font-semibold text-accent-700 dark:text-accent-400">{i + 1}.</span><span>{s}</span></li>)}
          </ol>
          {res.cta && <p className="mt-3 text-sm muted">{res.cta}</p>}
          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <button type="button" className="btn-primary px-6 py-3" onClick={toVideo}>{t('demo.toVideo')}<ArrowRight className="h-4 w-4" /></button>
            <button type="button" className="btn-outline" onClick={() => { setRes(null); setTopic(''); }}>{t('demo.again')}</button>
          </div>
          <p className="mt-3 text-xs muted">{t('demo.note')}</p>
        </div>
      )}
    </div>
  );
}

function Hero() {
  const { t, lang } = useI18n();
  return (
    <section className="relative overflow-hidden">
      <div className="container-x grid items-center gap-12 py-12 sm:py-16 lg:grid-cols-[1.25fr_1fr]">
        <div>
          <h1 className="text-[2.6rem] font-extrabold leading-[1.04] tracking-[-0.03em] sm:text-6xl lg:text-[4.6rem]">
            {t('hero.title1')}<br />{t('hero.title2')}
          </h1>
          <p className="mt-6 max-w-xl text-lg text-navy-500 dark:text-navy-300 sm:text-xl">{t('hero.sub')}</p>
          <DemoBox />
          <p className="mt-4 text-sm muted">
            <span className="mr-2 inline-block rounded-full bg-accent-500 px-2.5 py-0.5 text-xs font-bold text-navy-950">{t('hero.badge')}</span>
            <Link to="/registrieren" className="font-semibold underline">{t('hero.cta')}</Link> · <Link to="/preise" className="underline">{t('hero.cta2')}</Link>
          </p>
        </div>
        <div>
          <HeroPhone />
          <p className="mt-3 text-center text-[11px] muted">{lang === 'en' ? 'Example video · images and voice AI-generated' : 'Beispielvideo · Bilder und Stimme KI-generiert'}</p>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const { t } = useI18n();
  const icons = [Search, PenSquare, Send];
  return (
    <section id="how" className="scroll-mt-16 pb-16 sm:pb-24">
      <div className="container-x">
        <h2 className="h2">{t('how.title')}</h2>
        <ol className="mt-6 grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((n, i) => {
            const Icon = icons[i];
            return (
              <li key={n} className="card flex items-start gap-4 p-6">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-500 text-lg font-extrabold text-navy-950">{n}</span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-bold">{t(`how.s${n}.t`)}</h3>
                  <p className="mt-1 text-sm muted">{t(`how.s${n}.d`)}</p>
                </div>
                <Icon className="h-7 w-7 shrink-0 text-navy-400 dark:text-white" strokeWidth={1.6} />
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

const FEATURES = [
  ['script', FileText], ['visuals', Image], ['voice', Mic], ['captions', Captions], ['posting', CalendarClock], ['promo', Megaphone],
];

const SHOWCASE = [
  ['fitness-ruecken', 'Fitness', 'DE'], ['restaurant-pho', 'Restaurant', 'DE'], ['kravata-hr', 'Geschichte', 'HR'],
  ['coiffeur-brautfrisur', 'Coiffeur', 'DE'], ['garage-winterreifen', 'Garage', 'DE'], ['baeckerei-brot', 'Bäckerei', 'DE'],
  ['schreinerei-holz', 'Handwerk', 'DE'], ['coiffeur-keratin', 'Beauty', 'DE'],
];
function ShowcaseVideo({ id, label, lang }) {
  const ref = useRef(null);
  useEffect(() => {
    const v = ref.current; if (!v || !('IntersectionObserver' in window)) return undefined;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) v.play().catch(() => {}); else v.pause(); }, { threshold: 0.4 });
    io.observe(v); return () => io.disconnect();
  }, []);
  return (
    <figure className="w-40 shrink-0 snap-start sm:w-auto">
      <video ref={ref} className="aspect-[9/16] w-full rounded-2xl bg-black object-cover shadow-lg ring-1 ring-white/10" src={`/showcase/${id}.mp4`} poster={`/showcase/${id}.jpg`} muted loop playsInline preload="none" />
      <figcaption className="mt-2 flex items-center justify-between text-xs muted"><span>{tr(label)}</span><span className="rounded bg-navy-100 px-1.5 py-0.5 font-semibold dark:bg-navy-800">{lang}</span></figcaption>
    </figure>
  );
}
function Showcase() {
  const { lang } = useI18n();
  return (
    <section id="beispiele" className="section scroll-mt-16">
      <div className="container-x">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">{lang === 'en' ? 'Examples' : 'Beispiele'}</p>
          <h2 className="h2 mt-2">{lang === 'en' ? 'Made with TrueReel' : 'Mit TrueReel erstellt'}</h2>
          <p className="mt-3 muted">{lang === 'en' ? 'Every one of these videos was created in a few minutes – script, images, voice and captions. Images and voices are AI-generated.' : 'Jedes dieser Videos ist in wenigen Minuten entstanden – Skript, Bilder, Stimme und Untertitel. Bilder und Stimmen sind KI-generiert.'}</p>
        </div>
        <div className="-mx-4 mt-10 flex snap-x gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-4 sm:overflow-visible sm:px-0">
          {SHOWCASE.map(([id, label, l]) => <ShowcaseVideo key={id} id={id} label={label} lang={l} />)}
        </div>
        <div className="mt-8 text-center"><Link to="/registrieren" className="btn-primary px-8 py-3.5 text-base">{lang === 'en' ? 'Create your first video – free' : 'Dein erstes Video erstellen – gratis'}</Link></div>
      </div>
    </section>
  );
}

function BusinessTeaser() {
  const { lang } = useI18n();
  const en = lang === 'en';
  return (
    <section className="section pt-0">
      <div className="container-x">
        <div className="card flex flex-col items-start gap-5 border-2 border-accent-500 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <p className="eyebrow">{en ? 'For businesses' : 'Für Firmen'}</p>
            <h2 className="mt-1 text-2xl font-bold sm:text-3xl">{en ? 'No time? We make the videos for your business.' : 'Keine Zeit? Wir machen die Videos für dein Unternehmen.'}</h2>
            <p className="mt-2 muted">{en ? '8 to 30 short videos a month for TikTok, Reels and Shorts – from CHF 290, cancel monthly, free sample video first.' : '8 bis 30 Kurzvideos pro Monat für TikTok, Reels und Shorts – ab CHF 290, monatlich kündbar, zuerst ein Gratis-Beispielvideo.'}</p>
          </div>
          <Link to={en ? '/business' : '/firmen'} className="btn-primary shrink-0 px-6 py-3.5 text-base">{en ? 'See packages' : 'Pakete ansehen'}<ArrowRight className="h-4 w-4" /></Link>
        </div>
      </div>
    </section>
  );
}

function Features() {
  const { t } = useI18n();
  return (
    <section id="features" className="section scroll-mt-16">
      <div className="container-x">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">{t('nav.features')}</p>
          <h2 className="h2 mt-2">{t('features.title')}</h2>
          <p className="mt-3 muted">{t('features.sub')}</p>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(([k, Icon]) => (
            <div key={k} className="card p-5">
              <Icon className="h-6 w-6 text-accent-700 dark:text-accent-400" />
              <h3 className="mt-3 font-semibold">{t(`f.${k}.t`)}</h3>
              <p className="mt-1.5 text-sm muted">{t(`f.${k}.d`)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Different() {
  const { t } = useI18n();
  const icons = [Tag, MousePointerClick, Eye, Languages];
  return (
    <section className="section bg-navy-950 text-white">
      <div className="container-x">
        <h2 className="h2 text-center">{t('diff.title')}</h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {icons.map((Icon, i) => (
            <div key={i} className="rounded-2xl border border-navy-800 bg-navy-900/60 p-6">
              <Icon className="h-6 w-6 text-accent-400" />
              <h3 className="mt-4 font-semibold">{t(`diff.${i + 1}.t`)}</h3>
              <p className="mt-2 text-sm text-navy-300">{t(`diff.${i + 1}.d`)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Examples() {
  const { t, lang } = useI18n();
  const [tab, setTab] = useState('history');
  const project = useExampleProject(tab, lang);
  const tabs = NICHES.filter((n) => n.id !== 'custom');
  const niche = NICHES.find((n) => n.id === tab);
  return (
    <section id="examples" className="section scroll-mt-16">
      <div className="container-x">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">{t('nav.examples')}</p>
          <h2 className="h2 mt-2">{t('examples.title')}</h2>
          <p className="mt-3 muted">{t('examples.sub')}</p>
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-2" role="tablist">
          {tabs.map((n) => (
            <button key={n.id} role="tab" aria-selected={tab === n.id} onClick={() => setTab(n.id)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${tab === n.id ? 'bg-navy-900 text-white dark:bg-white dark:text-navy-900' : 'bg-navy-50 text-navy-700 hover:bg-navy-100 dark:bg-navy-900 dark:text-navy-200'}`}>
              {n.emoji} {tr(n.label)}
            </button>
          ))}
        </div>
        <div className="mt-10 grid items-center gap-10 md:grid-cols-2">
          <PhoneFrame className="max-w-[260px]">
            <Player key={tab + lang} project={project} initialMuted controls={false} autoPlay loop />
          </PhoneFrame>
          <div>
            <h3 className="text-2xl font-semibold">{niche.emoji} {tr(niche.label)}</h3>
            <p className="mt-2 muted">{tr(niche.desc)}</p>
            <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
              <div className="card p-4"><dt className="muted">{tr("Stil")}</dt><dd className="mt-1 font-semibold capitalize">{project.artStyle}</dd></div>
              <div className="card p-4"><dt className="muted">{tr("Untertitel")}</dt><dd className="mt-1 font-semibold capitalize">{project.captions.style}</dd></div>
              <div className="card col-span-2 p-4"><dt className="muted">{tr("Hook")}</dt><dd className="mt-1 font-medium">„{project.scenes[0].text}“</dd></div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}

function SocialProof() {
  // Zeigt nur echte, vom Inhaber freigegebene Bewertungen mit Erlaubnis der Kunden
  const { lang } = useI18n();
  const [reviews, setReviews] = useState([]);
  useEffect(() => { fetch('/api/reviews/public').then((r) => r.json()).then((d) => setReviews(d.reviews || [])).catch(() => {}); }, []);
  if (!reviews.length) return null;
  return (
    <section className="section">
      <div className="container-x">
        <h2 className="h2 text-center">{lang === 'en' ? 'What users say' : 'Das sagen Nutzer'}</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {reviews.slice(0, 6).map((r, i) => (
            <figure key={i} className="card p-6">
              <p className="text-accent-700 dark:text-accent-400" aria-label={`${r.rating}/5`}>{'★'.repeat(r.rating)}<span className="text-navy-300 dark:text-navy-600">{'★'.repeat(5 - r.rating)}</span></p>
              <blockquote className="mt-2 text-sm">„{r.text}“</blockquote>
              <figcaption className="mt-3 text-sm font-semibold">{r.display_name || (lang === 'en' ? 'TrueReel user' : 'TrueReel-Nutzer')}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Landing() {
  const { t } = useI18n();
  return (
    <>
      <Hero />
      <Showcase />
      <HowItWorks />
      <Features />
      <BusinessTeaser />
      <Different />
      <SocialProof />
      <section id="pricing" className="section scroll-mt-16">
        <div className="container-x">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <p className="eyebrow">{t('nav.pricing')}</p>
            <h2 className="h2 mt-2">{t('pricing.title')}</h2>
            <p className="mt-3 muted">{t('pricing.sub')}</p>
          </div>
          <PricingSection showCalculator={false} />
          <p className="mt-6 text-center text-sm"><Link to="/preise" className="font-semibold text-accent-700 dark:text-accent-400">{tr("Kosten pro Video vergleichen →")}</Link></p>
        </div>
      </section>
      <section id="faq" className="section scroll-mt-16 bg-navy-50/60 dark:bg-navy-900/40">
        <div className="container-x max-w-3xl">
          <h2 className="h2 mb-8 text-center">{t('faq.title')}</h2>
          <FAQ />
          <p className="mt-6 text-center text-sm muted">
            {tr("Noch Fragen?")} <a className="inline-flex items-center gap-1 font-semibold text-accent-700 dark:text-accent-400" href={`mailto:${SITE.contactEmail}`}><Mail className="h-4 w-4" />{SITE.contactEmail}</a>
          </p>
        </div>
      </section>
      <section className="section">
        <div className="container-x">
          <div className="rounded-3xl bg-navy-900 px-6 py-14 text-center text-white sm:px-12">
            <h2 className="h2">{t('cta.title')}</h2>
            <p className="mt-3 text-navy-300">{t('cta.sub')}</p>
            <Link to="/registrieren" className="btn-primary mt-8 px-6 py-3 text-base">{t('cta.button')}<ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>
    </>
  );
}
