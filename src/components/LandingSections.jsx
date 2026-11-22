// Startseiten-Abschnitte: echte Produktansichten, Videogalerie, Ablauf (automatisch / manuell) und Vertrauen.
// Alle Bilder und Videos stammen aus der echten App bzw. sind mit TrueReel erstellt – keine Mockups.
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CalendarClock, Check, CheckCircle2, Eye, Lock, Mail, MapPin, Play, Send, ShieldCheck, Sparkles, Wand2, X } from 'lucide-react';
import { SITE } from '../config/site.js';
import { useI18n } from '../i18n/index.jsx';

// ── 1. So entstehen deine Videos: sechs Schritte mit echten Aufnahmen aus der App ──
const DEMO_STEPS = {
  de: [
    ['Thema oder Nische auswählen', 'Geschichte, Fakten, POV, Werbung für dein Produkt oder ein eigenes Thema – du entscheidest, worum es in deiner Serie geht.'],
    ['Visuellen Stil festlegen', '13 Bildstile von realistisch bis Anime, dazu der Stil der Untertitel. Jede Vorschau zeigt ein echtes Beispielbild.'],
    ['Stimme und Sprache wählen', '11 Sprachen und mehrere Stimmen – jede kannst du vorher anhören.'],
    ['Länge und Zeitplan bestimmen', 'Videolänge, Wochentage, Uhrzeit und Plattformen. Die Freigabe vor jedem Post ist standardmässig eingeschaltet.'],
    ['Serie erstellen', 'TrueReel plant die Folgen deiner Serie und schreibt das Skript für das erste Video.'],
    ['Ergebnis ansehen und freigeben', 'Im Editor prüfst du Text, Bilder und Stimme, änderst was du willst und gibst das Video frei – oder exportierst es als MP4.'],
  ],
  en: [
    ['Pick a topic or niche', 'History, facts, POV, an ad for your product or your own topic – you decide what your series is about.'],
    ['Choose the visual style', '13 image styles from realistic to anime, plus the caption style. Every preview shows a real sample image.'],
    ['Select voice and language', '11 languages and several voices – you can listen to each one first.'],
    ['Set length and schedule', 'Video length, weekdays, time and platforms. Approval before every post is switched on by default.'],
    ['Create the series', 'TrueReel plans the episodes of your series and writes the script for the first video.'],
    ['Review the result and approve', 'In the editor you check text, images and voice, change whatever you like and approve the video – or export it as an MP4.'],
  ],
};

function AppShot({ n, lang, alt, eager, className = 'block h-auto w-full' }) {
  return <img src={`/app-demo/${lang}-${n}.webp`} alt={alt} width="1280" height="820" loading={eager ? 'eager' : 'lazy'} decoding="async" className={className} />;
}

export function ProductDemo() {
  const { lang } = useI18n();
  const en = lang === 'en';
  const L = en ? 'en' : 'de';
  const steps = DEMO_STEPS[L];
  const [active, setActive] = useState(0);
  const alt = (i) => (en ? `TrueReel app, step ${i + 1}: ${steps[i][0]}` : `TrueReel-App, Schritt ${i + 1}: ${steps[i][0]}`);
  return (
    <section id="demo" className="section section-alt scroll-mt-16">
      <div className="container-x">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">{en ? 'Real product views' : 'Echte Produktansichten'}</p>
          <h2 className="h2 mt-2">{en ? 'How your videos are made with TrueReel' : 'So entstehen deine Videos mit TrueReel'}</h2>
          <p className="mt-3 muted">{en ? 'No mock-ups: these are screenshots of the actual TrueReel app.' : 'Keine Mockups: Das sind Aufnahmen aus der echten TrueReel-App.'}</p>
        </div>

        {/* Desktop: Schritte links, Aufnahme rechts */}
        <div className="mt-12 hidden items-start gap-8 lg:grid lg:grid-cols-[0.8fr_1.5fr]">
          <ol className="space-y-2">
            {steps.map(([title, desc], i) => (
              <li key={title}>
                <button type="button" onClick={() => setActive(i)} onMouseEnter={() => setActive(i)} aria-current={active === i ? 'step' : undefined}
                  className={`flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition ${active === i ? 'border-accent-500/60 bg-white shadow-sm dark:bg-navy-900' : 'border-transparent hover:bg-white/60 dark:hover:bg-navy-900/60'}`}>
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-extrabold transition ${active === i ? 'bg-accent-500 text-navy-950' : 'bg-navy-100 text-navy-600 dark:bg-navy-800 dark:text-navy-200'}`}>{i + 1}</span>
                  <span className="min-w-0">
                    <span className="block font-bold">{title}</span>
                    {active === i && <span className="mt-1 block text-sm muted">{desc}</span>}
                  </span>
                </button>
              </li>
            ))}
          </ol>
          <figure className="sticky top-24 overflow-hidden rounded-2xl border border-navy-200 bg-navy-950 shadow-2xl dark:border-navy-700">
            <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-2.5" aria-hidden="true">
              <span className="h-2.5 w-2.5 rounded-full bg-white/20" /><span className="h-2.5 w-2.5 rounded-full bg-white/20" /><span className="h-2.5 w-2.5 rounded-full bg-white/20" />
              <span className="ml-3 truncate text-xs text-white/50">truereel.ch/app</span>
            </div>
            <div className="relative aspect-[1280/820]">
              {steps.map((_, i) => (
                <div key={i} className={`absolute inset-0 transition-opacity duration-500 ${active === i ? 'opacity-100' : 'pointer-events-none opacity-0'}`} aria-hidden={active !== i}>
                  {(i === 0 || Math.abs(i - active) <= 1) && <AppShot n={i + 1} lang={L} alt={alt(i)} />}
                </div>
              ))}
            </div>
            <figcaption className="border-t border-white/10 px-4 py-3 text-xs text-white/60">{en ? `Step ${active + 1} of 6` : `Schritt ${active + 1} von 6`} · {steps[active][0]}</figcaption>
          </figure>
        </div>

        {/* Handy & Tablet: Karten zum Wischen */}
        <ol className="-mx-4 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-3 lg:hidden">
          {steps.map(([title, desc], i) => (
            <li key={title} className="card w-[86%] shrink-0 snap-center overflow-hidden sm:w-[60%]">
              {/* Auf dem Handy vergrössert auf den Arbeitsbereich, damit die Ansicht lesbar bleibt */}
              <div className="relative aspect-[4/3] overflow-hidden border-b border-navy-100 bg-navy-950 dark:border-navy-800"><AppShot n={i + 1} lang={L} alt={alt(i)} className="absolute left-[-46%] top-[-7%] h-auto w-[180%] max-w-none" /></div>
              <div className="flex items-start gap-3 p-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-500 text-sm font-extrabold text-navy-950">{i + 1}</span>
                <div><h3 className="font-bold">{title}</h3><p className="mt-1 text-sm muted">{desc}</p></div>
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-1 text-center text-xs muted lg:hidden">{en ? 'Swipe to see all 6 steps →' : 'Wische, um alle 6 Schritte zu sehen →'}</p>

        <div className="mt-10 text-center"><Link to="/registrieren" className="btn-primary px-8 py-3.5 text-base">{en ? 'Try it yourself – 1 video free' : 'Selbst ausprobieren – 1 Video gratis'}<ArrowRight className="h-4 w-4" /></Link></div>
      </div>
    </section>
  );
}

// ── 2. Videogalerie: echte, mit TrueReel erstellte Videos – nach Art filterbar, mit Ton im Vollbild ──
// [Datei, Kategorie, Titel DE, Titel EN, Sprache des Videos]
const GALLERY = [
  ['fakten-pyramide', 'facts', 'Fakten: Cheops-Pyramide', 'Facts: Great Pyramid', 'DE'],
  ['motivation-anfangen', 'motivation', 'Motivation', 'Motivation', 'DE'],
  ['pov-mittelalter', 'pov', 'POV: Zeitreise', 'POV: time travel', 'DE'],
  ['story-ghost-ship', 'story', 'Geschichte: Geisterschiff', 'Story: ghost ship', 'EN'],
  ['story-busstop', 'story', 'Tiergeschichte', 'Animal story', 'EN'],
  ['kravata-hr', 'story', 'Geschichte: Krawatte', 'History: the necktie', 'HR'],
  ['produkt-truereel', 'product', 'Produktvideo', 'Product video', 'DE'],
  ['fitness-ruecken', 'business', 'Fitness', 'Fitness', 'DE'],
  ['restaurant-pho', 'business', 'Restaurant', 'Restaurant', 'DE'],
  ['coiffeur-brautfrisur', 'business', 'Coiffeur', 'Hairdresser', 'DE'],
  ['garage-winterreifen', 'business', 'Garage', 'Garage', 'DE'],
  ['baeckerei-brot', 'business', 'Bäckerei', 'Bakery', 'DE'],
  ['schreinerei-holz', 'business', 'Handwerk', 'Craft', 'DE'],
];
// Nur Einträge, deren Dateien in public/showcase liegen, werden angezeigt.
const GALLERY_READY = new Set(['fakten-pyramide', 'motivation-anfangen', 'pov-mittelalter', 'story-ghost-ship', 'story-busstop', 'kravata-hr', 'produkt-truereel', 'fitness-ruecken', 'restaurant-pho', 'coiffeur-brautfrisur', 'garage-winterreifen', 'baeckerei-brot', 'schreinerei-holz']);
const CATS = [
  ['all', 'Alle', 'All'], ['facts', 'Fakten & Wissen', 'Facts & knowledge'], ['motivation', 'Motivation', 'Motivation'], ['story', 'Geschichten', 'Stories'],
  ['pov', 'POV', 'POV'], ['business', 'Business', 'Business'], ['product', 'Produktvideos', 'Product videos'],
];

function GalleryTile({ item, en, onOpen }) {
  const [id, , de, enTitle, vlang] = item;
  const ref = useRef(null);
  const hover = (play) => { const v = ref.current; if (!v) return; if (play) v.play().catch(() => {}); else { v.pause(); v.currentTime = 0; } };
  return (
    <figure className="w-40 shrink-0 snap-start sm:w-auto">
      <button type="button" onClick={() => onOpen(item)} onMouseEnter={() => hover(true)} onMouseLeave={() => hover(false)} onFocus={() => hover(true)} onBlur={() => hover(false)}
        className="group relative block w-full overflow-hidden rounded-2xl bg-black shadow-lg ring-1 ring-white/10 transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:ring-accent-500/50 focus-visible:ring-2 focus-visible:ring-accent-500"
        aria-label={en ? `Play video: ${enTitle}` : `Video abspielen: ${de}`}>
        <video ref={ref} className="aspect-[9/16] w-full object-cover" src={`/showcase/${id}.mp4`} poster={`/showcase/${id}.jpg`} muted loop playsInline preload="none" tabIndex={-1} aria-hidden="true" />
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/50 via-transparent to-transparent">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-navy-950 shadow-lg transition group-hover:scale-110 group-hover:bg-accent-500"><Play className="ml-0.5 h-5 w-5" fill="currentColor" /></span>
        </span>
      </button>
      <figcaption className="mt-2 flex items-center justify-between gap-2 text-xs muted"><span className="truncate">{en ? enTitle : de}</span><span className="rounded bg-navy-100 px-1.5 py-0.5 font-semibold dark:bg-navy-800">{vlang}</span></figcaption>
    </figure>
  );
}

function Lightbox({ item, en, onClose }) {
  const closeRef = useRef(null);
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow; document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [onClose]);
  const [id, , de, enTitle] = item;
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={en ? enTitle : de} onClick={onClose}>
      <div className="relative w-full max-w-[min(92vw,calc((100dvh-7rem)*9/16))]" onClick={(e) => e.stopPropagation()}>
        <button ref={closeRef} type="button" onClick={onClose} className="absolute -top-11 right-0 flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25" aria-label={en ? 'Close' : 'Schliessen'}><X className="h-5 w-5" /></button>
        <video className="aspect-[9/16] w-full rounded-2xl bg-black" src={`/showcase/full/${id}.mp4`} poster={`/showcase/${id}.jpg`} controls autoPlay playsInline />
        <p className="mt-3 text-center text-xs text-white/70">{en ? enTitle : de} · {en ? 'created with TrueReel – images and voice are AI-generated' : 'mit TrueReel erstellt – Bilder und Stimme sind KI-generiert'}</p>
      </div>
    </div>
  );
}

export function Gallery() {
  const { lang } = useI18n();
  const en = lang === 'en';
  const [cat, setCat] = useState('all');
  const [open, setOpen] = useState(null);
  const all = GALLERY.filter((g) => GALLERY_READY.has(g[0]));
  const cats = CATS.filter(([id]) => id === 'all' || all.some((g) => g[1] === id));
  const items = cat === 'all' ? all : all.filter((g) => g[1] === cat);
  return (
    <section id="beispiele" className="section scroll-mt-16">
      <div className="container-x">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">{en ? 'Examples' : 'Beispiele'}</p>
          <h2 className="h2 mt-2">{en ? 'Made with TrueReel' : 'Mit TrueReel erstellt'}</h2>
          <p className="mt-3 muted">{en ? 'Real videos from different formats – tap one to watch it with sound. Script, images, voice and captions come from TrueReel; images and voices are AI-generated.' : 'Echte Videos aus verschiedenen Formaten – tippe eines an und schau es mit Ton. Skript, Bilder, Stimme und Untertitel stammen von TrueReel; Bilder und Stimmen sind KI-generiert.'}</p>
        </div>
        <div className="-mx-4 mt-8 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:justify-center sm:px-0" role="tablist" aria-label={en ? 'Video type' : 'Videoart'}>
          {cats.map(([id, de, enLabel]) => (
            <button key={id} type="button" role="tab" aria-selected={cat === id} onClick={() => setCat(id)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${cat === id ? 'bg-navy-900 text-white dark:bg-white dark:text-navy-900' : 'bg-navy-50 text-navy-700 hover:bg-navy-100 dark:bg-navy-900 dark:text-navy-200 dark:hover:bg-navy-800'}`}>
              {en ? enLabel : de}
            </button>
          ))}
        </div>
        <div className="-mx-4 mt-8 flex snap-x gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 md:grid-cols-4 lg:grid-cols-5">
          {items.map((item) => <GalleryTile key={item[0]} item={item} en={en} onOpen={setOpen} />)}
        </div>
        <div className="mt-8 text-center"><Link to="/registrieren" className="btn-primary px-8 py-3.5 text-base">{en ? 'Create your first video – free' : 'Dein erstes Video erstellen – gratis'}</Link></div>
      </div>
      {open && <Lightbox item={open} en={en} onClose={() => setOpen(null)} />}
    </section>
  );
}

// ── 3. Mehr als ein Videogenerator: Was automatisch läuft – und wo du entscheidest ──
export function Workflow() {
  const { lang } = useI18n();
  const en = lang === 'en';
  const phases = en ? [
    [Wand2, 'Creation', 'Automatic', 'TrueReel plans the episodes of your series. For each episode it writes the script and creates images, voice-over, captions and music. You start a new episode with one click and export the finished video as an MP4.'],
    [CalendarClock, 'Scheduling', 'Automatic', 'You set weekdays and time once per series. Every approved video gets the next free slot – the calendar shows what is planned and when.'],
    [Eye, 'Approval', 'Your decision', 'By default nothing goes live without you: you see every video first and can change text, images and voice. You can switch approval off per series.'],
    [Send, 'Publishing', 'YouTube: automatic', 'Approved videos are posted to YouTube Shorts automatically at the planned time. TikTok and Instagram Reels are not connected yet – until then you upload the MP4 yourself.'],
  ] : [
    [Wand2, 'Erstellung', 'Automatisch', 'TrueReel plant die Folgen deiner Serie. Für jede Folge schreibt es das Skript und erstellt Bilder, Voiceover, Untertitel und Musik. Eine neue Folge startest du mit einem Klick, das fertige Video exportierst du als MP4.'],
    [CalendarClock, 'Planung', 'Automatisch', 'Wochentage und Uhrzeit legst du einmal pro Serie fest. Jedes freigegebene Video bekommt den nächsten freien Termin – der Kalender zeigt, was wann geplant ist.'],
    [Eye, 'Freigabe', 'Deine Entscheidung', 'Standardmässig geht nichts ohne dich online: Du siehst jedes Video vorher und kannst Text, Bilder und Stimme ändern. Die Freigabe lässt sich pro Serie abschalten.'],
    [Send, 'Veröffentlichung', 'YouTube: automatisch', 'Freigegebene Videos werden zum geplanten Zeitpunkt automatisch auf YouTube Shorts gepostet. TikTok und Instagram Reels sind noch nicht angebunden – bis dahin lädst du die MP4 selbst hoch.'],
  ];
  const compare = en ? {
    a: ['A typical AI video generator', ['One video per prompt', 'Style, voice and language set again every time', 'No plan for the next videos', 'You organise posting yourself']],
    b: ['The TrueReel workflow', ['A series with planned episodes and a common thread', 'Style, voice and language defined once', 'Schedule and content calendar included', 'Approval, then automatic posting to YouTube Shorts']],
  } : {
    a: ['Ein üblicher KI-Videogenerator', ['Ein Video pro Eingabe', 'Stil, Stimme und Sprache jedes Mal neu einstellen', 'Kein Plan für die nächsten Videos', 'Das Posten organisierst du selbst']],
    b: ['Der TrueReel-Workflow', ['Eine Serie mit geplanten Folgen und rotem Faden', 'Stil, Stimme und Sprache einmal festgelegt', 'Zeitplan und Content-Kalender inklusive', 'Freigabe, danach automatisches Posten auf YouTube Shorts']],
  };
  return (
    <section id="workflow" className="section scroll-mt-16">
      <div className="container-x">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">{en ? 'Set up once' : 'Einmal einrichten'}</p>
          <h2 className="h2 mt-2">{en ? 'More than a video generator' : 'Mehr als ein Videogenerator'}</h2>
          <p className="mt-3 muted">{en ? 'You set up a series once. After that, new videos take one click instead of an afternoon. This is what runs automatically – and where you decide.' : 'Du richtest eine Serie einmal ein. Danach kostet dich ein neues Video einen Klick statt einen Nachmittag. Das läuft automatisch – und hier entscheidest du.'}</p>
        </div>
        <ol className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {phases.map(([Icon, title, tag, text], i) => (
            <li key={title} className="card relative p-6">
              <div className="flex items-center justify-between gap-3">
                <span className="icon-tile"><Icon className="h-5 w-5" /></span>
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${i === 2 ? 'bg-navy-100 text-navy-700 dark:bg-navy-800 dark:text-navy-100' : 'bg-accent-500/15 text-accent-800 dark:text-accent-400'}`}>{tag}</span>
              </div>
              <h3 className="mt-4 text-lg font-bold"><span className="mr-1.5 muted">{i + 1}.</span>{title}</h3>
              <p className="mt-1.5 text-sm muted">{text}</p>
            </li>
          ))}
        </ol>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-navy-100 p-6 dark:border-navy-800">
            <h3 className="font-bold muted">{compare.a[0]}</h3>
            <ul className="mt-3 space-y-2 text-sm muted">{compare.a[1].map((x) => <li key={x} className="flex gap-2.5"><span className="mt-2 h-px w-3 shrink-0 bg-current" aria-hidden="true" />{x}</li>)}</ul>
          </div>
          <div className="rounded-2xl border border-accent-500/50 bg-accent-500/[0.06] p-6">
            <h3 className="flex items-center gap-2 font-bold"><Sparkles className="h-4 w-4 text-accent-700 dark:text-accent-400" />{compare.b[0]}</h3>
            <ul className="mt-3 space-y-2 text-sm">{compare.b[1].map((x) => <li key={x} className="flex gap-2.5"><Check className="mt-0.5 h-4 w-4 shrink-0 text-accent-700 dark:text-accent-400" strokeWidth={2.5} />{x}</li>)}</ul>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── 4. Vertrauen: wer dahinter steht, wie wir mit Daten und KI-Inhalten umgehen ──
export function Trust() {
  const { lang } = useI18n();
  const en = lang === 'en';
  const cards = en ? [
    [MapPin, 'Who is behind it', <>TrueReel is built and run by Daniel Weidmann in Grafstal, Switzerland. You reach a person, not a ticket system: <a className="font-semibold underline" href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a></>],
    [Lock, 'Your data', <>We work according to the Swiss FADP and the GDPR. Payments run through Stripe – we never see or store your card details. Everything else is in the <Link className="font-semibold underline" to="/datenschutz">privacy policy</Link>.</>],
    [CheckCircle2, 'Honestly labelled', 'Example videos are marked as AI-generated. We publish no invented reviews, user numbers or reach promises – customer reviews appear here once real ones exist.'],
    [ShieldCheck, 'Try it without risk', <>One video free, no credit card. Paid plans can be cancelled monthly in your account, and there is a 7-day money-back rule (<Link className="font-semibold underline" to="/rueckerstattung">conditions</Link>).</>],
  ] : [
    [MapPin, 'Wer dahinter steht', <>TrueReel wird von Daniel Weidmann in Grafstal (Schweiz) entwickelt und betrieben. Du erreichst einen Menschen, kein Ticketsystem: <a className="font-semibold underline" href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a></>],
    [Lock, 'Deine Daten', <>Wir arbeiten nach Schweizer DSG und DSGVO. Zahlungen laufen über Stripe – deine Kartendaten sehen und speichern wir nie. Alles Weitere steht in der <Link className="font-semibold underline" to="/datenschutz">Datenschutzerklärung</Link>.</>],
    [CheckCircle2, 'Ehrlich gekennzeichnet', 'Beispielvideos sind als KI-generiert markiert. Wir veröffentlichen keine erfundenen Bewertungen, Nutzerzahlen oder Reichweiten-Versprechen – Kundenstimmen erscheinen hier, sobald es echte gibt.'],
    [ShieldCheck, 'Ohne Risiko testen', <>Ein Video gratis, ohne Kreditkarte. Bezahlte Pläne kündigst du monatlich im Konto, und es gilt eine 7-Tage-Geld-zurück-Regel (<Link className="font-semibold underline" to="/rueckerstattung">Bedingungen</Link>).</>],
  ];
  return (
    <section id="vertrauen" className="section section-alt scroll-mt-16">
      <div className="container-x">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">{en ? 'Transparency' : 'Transparenz'}</p>
          <h2 className="h2 mt-2">{en ? 'What you can rely on' : 'Worauf du dich verlassen kannst'}</h2>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map(([Icon, title, body]) => (
            <div key={title} className="card p-6">
              <span className="icon-tile"><Icon className="h-5 w-5" /></span>
              <h3 className="mt-4 text-lg font-bold">{title}</h3>
              <p className="mt-1.5 text-sm muted">{body}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-center text-sm muted">
          {en ? 'Questions before you start?' : 'Fragen, bevor du startest?'} <a className="inline-flex items-center gap-1 font-semibold text-accent-700 dark:text-accent-400" href={`mailto:${SITE.contactEmail}`}><Mail className="h-4 w-4" />{SITE.contactEmail}</a>
        </p>
      </div>
    </section>
  );
}
