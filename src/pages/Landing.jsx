import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Layers, FileText, Image, Mic, Captions, Music, Scissors, CalendarClock, Download, LayoutDashboard,
  Tag, MousePointerClick, Eye, Languages, Mail,
} from 'lucide-react';
import { useI18n } from '../i18n/index.jsx';
import { PhoneFrame, TrustRow } from '../components/ui.jsx';
import { PricingSection, FAQ } from '../components/Pricing.jsx';
import Player from '../video/Player.jsx';
import { scriptToProject } from '../video/project.js';
import { exampleScripts } from '../config/examples.js';
import { NICHES } from '../config/catalog.js';
import { SITE } from '../config/site.js';

function useExampleProject(key, lang) {
  return useMemo(() => {
    const s = exampleScripts(lang)[key];
    const p = scriptToProject(s, { language: lang, artStyle: s.style, captions: { style: s.caption }, voiceId: 'calm-m', music: { trackId: 'calm' } });
    p.scenes.forEach((sc, i) => { sc.seed = 1000 + i * 77 + key.length * 13; });
    return p;
  }, [key, lang]);
}

function Hero() {
  const { t, lang } = useI18n();
  const project = useExampleProject('history', lang);
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,rgba(51,212,163,0.18),transparent_55%)]" aria-hidden="true" />
      <div className="container-x grid items-center gap-12 py-14 sm:py-20 lg:grid-cols-[1.15fr_1fr]">
        <div>
          <span className="chip"><span className="h-1.5 w-1.5 rounded-full bg-accent-500" />{t('hero.badge')}</span>
          <h1 className="mt-5 text-4xl font-extrabold leading-[1.08] sm:text-5xl lg:text-6xl">
            {t('hero.title1')}<br /><span className="text-accent-600 dark:text-accent-400">{t('hero.title2')}</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg muted">{t('hero.sub')}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/registrieren" className="btn-primary px-6 py-3 text-base">{t('hero.cta')}<ArrowRight className="h-4 w-4" /></Link>
            <Link to="/preise" className="btn-outline px-6 py-3 text-base">{t('hero.cta2')}</Link>
          </div>
          <p className="mt-3 text-sm muted">{t('hero.note')}</p>
          <TrustRow className="mt-8" />
        </div>
        <div className="relative">
          <PhoneFrame>
            <Player project={project} autoPlay initialMuted loop controls={false} />
          </PhoneFrame>
          <p className="mt-4 text-center text-xs muted">{t('examples.note')}</p>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const { t } = useI18n();
  return (
    <section id="how" className="section scroll-mt-16 bg-navy-50/60 dark:bg-navy-900/40">
      <div className="container-x">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">{t('nav.how')}</p>
          <h2 className="h2 mt-2">{t('how.title')}</h2>
          <p className="mt-3 muted">{t('how.sub')}</p>
        </div>
        <ol className="mt-12 grid gap-6 md:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <li key={n} className="card p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-900 text-lg font-bold text-accent-400 dark:bg-navy-800">{n}</span>
              <h3 className="mt-4 text-lg font-semibold">{t(`how.s${n}.t`)}</h3>
              <p className="mt-2 text-sm muted">{t(`how.s${n}.d`)}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

const FEATURES = [
  ['series', Layers], ['script', FileText], ['visuals', Image], ['voice', Mic], ['captions', Captions],
  ['music', Music], ['editor', Scissors], ['posting', CalendarClock], ['export', Download], ['dashboard', LayoutDashboard],
];

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
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {FEATURES.map(([k, Icon]) => (
            <div key={k} className="card p-5">
              <Icon className="h-6 w-6 text-accent-600 dark:text-accent-400" />
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
              {n.emoji} {n.label}
            </button>
          ))}
        </div>
        <div className="mt-10 grid items-center gap-10 md:grid-cols-2">
          <PhoneFrame className="max-w-[260px]">
            <Player key={tab + lang} project={project} initialMuted controls={false} autoPlay loop />
          </PhoneFrame>
          <div>
            <h3 className="text-2xl font-semibold">{niche.emoji} {niche.label}</h3>
            <p className="mt-2 muted">{niche.desc}</p>
            <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
              <div className="card p-4"><dt className="muted">Stil</dt><dd className="mt-1 font-semibold capitalize">{project.artStyle}</dd></div>
              <div className="card p-4"><dt className="muted">Untertitel</dt><dd className="mt-1 font-semibold capitalize">{project.captions.style}</dd></div>
              <div className="card col-span-2 p-4"><dt className="muted">Hook</dt><dd className="mt-1 font-medium">„{project.scenes[0].text}“</dd></div>
            </dl>
            {!niche.ready && <p className="mt-4 text-xs muted">Im aktuellen Prototyp ist die Nische „Geschichte“ voll ausgebaut; weitere Nischen folgen bzw. laufen über „Eigenes Thema“.</p>}
          </div>
        </div>
      </div>
    </section>
  );
}

function SocialProof() {
  // Nur anzeigen, wenn echte Daten in SITE.socialProof hinterlegt sind.
  if (!SITE.showSocialProof) return null;
  const { usersCount, videosCreated, testimonials } = SITE.socialProof;
  return (
    <section className="section">
      <div className="container-x">
        <div className="flex justify-center gap-12 text-center">
          {usersCount != null && <div><p className="text-3xl font-bold">{usersCount.toLocaleString('de-CH')}</p><p className="muted text-sm">Creator</p></div>}
          {videosCreated != null && <div><p className="text-3xl font-bold">{videosCreated.toLocaleString('de-CH')}</p><p className="muted text-sm">Videos erstellt</p></div>}
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {testimonials.map((q) => (
            <figure key={q.name} className="card p-6"><blockquote className="text-sm">„{q.quote}“</blockquote><figcaption className="mt-3 text-sm font-semibold">{q.name}<span className="font-normal muted"> · {q.role}</span></figcaption></figure>
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
      <HowItWorks />
      <Features />
      <Examples />
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
          <p className="mt-6 text-center text-sm"><Link to="/preise" className="font-semibold text-accent-700 dark:text-accent-400">Kosten pro Video vergleichen →</Link></p>
        </div>
      </section>
      <section id="faq" className="section scroll-mt-16 bg-navy-50/60 dark:bg-navy-900/40">
        <div className="container-x max-w-3xl">
          <h2 className="h2 mb-8 text-center">{t('faq.title')}</h2>
          <FAQ />
          <p className="mt-6 text-center text-sm muted">
            Noch Fragen? <a className="inline-flex items-center gap-1 font-semibold text-accent-700 dark:text-accent-400" href={`mailto:${SITE.contactEmail}`}><Mail className="h-4 w-4" />{SITE.contactEmail}</a>
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
