import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Layers, FileText, Image, Mic, Captions, Music, Scissors, CalendarClock, Download, LayoutDashboard,
  Tag, MousePointerClick, Eye, Languages, Mail, Search, PenSquare, Send, Heart, MessageCircle, Share2,
} from 'lucide-react';
import { useI18n } from '../i18n/index.jsx';
import { PhoneFrame } from '../components/ui.jsx';
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
function HeroPhone({ project }) {
  const { lang } = useI18n();
  const [follow, forYou] = lang === 'en' ? ['Following', 'For You'] : ['Folge ich', 'Für dich'];
  return (
    <div className="relative mx-auto w-full max-w-[300px] rounded-[2.8rem] border-[9px] border-navy-800 bg-black shadow-2xl ring-1 ring-white/10">
      <div className="absolute left-1/2 top-2 z-20 h-6 w-24 -translate-x-1/2 rounded-full bg-black" aria-hidden="true" />
      <div className="relative overflow-hidden rounded-[2.2rem]">
        <Player project={project} autoPlay initialMuted loop controls={false} />
        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-center gap-4 bg-gradient-to-b from-black/50 to-transparent pb-6 pt-9 text-[13px] font-semibold text-white/70">
          <span>{follow}</span><span className="border-b-2 border-white pb-0.5 text-white">{forYou}</span>
          <Search className="absolute right-4 h-4 w-4 text-white" />
        </div>
        <div className="pointer-events-none absolute bottom-24 right-3 flex flex-col items-center gap-5 text-white drop-shadow">
          <Heart className="h-7 w-7 fill-white" /><MessageCircle className="h-7 w-7 fill-white" /><Share2 className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}

function Hero() {
  const { t, lang } = useI18n();
  const project = useHeroProject(lang);
  return (
    <section className="relative overflow-hidden">
      <div className="container-x grid items-center gap-12 py-12 sm:py-16 lg:grid-cols-[1.25fr_1fr]">
        <div>
          <h1 className="text-[2.6rem] font-extrabold leading-[1.04] tracking-[-0.03em] sm:text-6xl lg:text-[4.6rem]">
            {t('hero.title1')}<br />{t('hero.title2')}
          </h1>
          <p className="mt-6 max-w-xl text-lg text-navy-500 dark:text-navy-300 sm:text-xl">{t('hero.sub')}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/registrieren" className="btn-primary px-8 py-3.5 text-base">{t('hero.cta')}</Link>
            <Link to="/preise" className="btn-outline px-8 py-3.5 text-base">{t('hero.cta2')}</Link>
          </div>
          <p className="mt-3 text-sm muted">{t('hero.note')}</p>
        </div>
        <div>
          <HeroPhone project={project} />
          <p className="mt-3 text-center text-[11px] muted">{lang === 'en' ? 'Example video · Photos: Pixabay' : 'Beispielvideo · Fotos: Pixabay'}</p>
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
