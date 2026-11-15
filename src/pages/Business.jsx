// Video-Service für Firmen: Pakete + Anfrage-Formular (DE/EN)
import { useState } from 'react';
import { Check, Clapperboard, CalendarCheck, MessageSquare, ShieldCheck } from 'lucide-react';
import { useI18n } from '../i18n/index.jsx';
import { Notice, Spinner } from '../components/ui.jsx';
import { SITE } from '../config/site.js';

const C = {
  de: {
    eyebrow: 'Für Firmen', title: 'Kurzvideos für dein Unternehmen – ohne Aufwand für dich',
    sub: 'Wir produzieren jeden Monat Kurzvideos für TikTok, Instagram Reels und YouTube Shorts – passend zu deinem Betrieb. Du gibst kurz Feedback, wir liefern die fertigen Videos mit Untertiteln, Texten und Hashtags.',
    cta: 'Kostenloses Beispielvideo anfragen', ctaSub: 'Unverbindlich – du siehst zuerst ein Video für deinen Betrieb, bevor du dich entscheidest.',
    howTitle: 'So läuft es ab',
    how: [
      ['Kurzes Gespräch', 'Wir klären in 15 Minuten, was dein Betrieb zeigen soll: Angebote, Tipps, Einblicke, Aktionen.'],
      ['Gratis-Beispielvideo', 'Du bekommst ein erstes Video für deinen Betrieb – kostenlos und unverbindlich.'],
      ['Monatliche Videos', 'Jeden Monat erhältst du die vereinbarten Videos plus Posting-Plan, Texte und Hashtags.'],
      ['Feedback & Anpassungen', 'Gefällt etwas nicht, passen wir es an. Nichts wird ohne deine Freigabe veröffentlicht.'],
    ],
    pkgTitle: 'Pakete', perMonth: '/ Monat', popular: 'Beliebt', monthly: 'Monatlich kündbar · Preise in CHF, ohne Mindestlaufzeit',
    pkgs: [
      { id: 'start', name: 'Start', price: 290, f: ['8 Kurzvideos pro Monat', 'Untertitel, Texte & Hashtags', 'Für TikTok, Reels & Shorts', '1 Korrekturrunde pro Video'] },
      { id: 'growth', name: 'Wachstum', price: 490, popular: true, f: ['16 Kurzvideos pro Monat', 'Untertitel, Texte & Hashtags', 'Monatlicher Posting-Plan', 'Eigene Fotos & Logo eingebaut', '2 Korrekturrunden pro Video'] },
      { id: 'full', name: 'Komplett', price: 790, f: ['30 Kurzvideos pro Monat', 'Alles aus „Wachstum“', 'Veröffentlichung auf Wunsch durch uns', 'Kurzer Monatsbericht mit Zahlen', 'Persönliche Ansprechperson'] },
    ],
    choose: 'Dieses Paket anfragen',
    honestTitle: 'Ehrlich gesagt',
    honest: [
      'Bilder und Stimmen werden mit KI erstellt und auf den Plattformen als KI-Inhalt gekennzeichnet. Auf Wunsch bauen wir deine eigenen Fotos und Clips ein.',
      'Wir versprechen keine bestimmten Aufrufe oder Follower – das kann niemand seriös. Wir sorgen für regelmässige, gute Inhalte; das ist die wichtigste Grundlage.',
      'Alle Fakten in den Videos stimmen wir mit dir ab. Nichts geht ohne deine Freigabe online.',
    ],
    formTitle: 'Anfrage senden', formSub: 'Wir melden uns innerhalb von 1–2 Werktagen.',
    name: 'Name', company: 'Firma', email: 'E-Mail', phone: 'Telefon (optional)', industry: 'Branche', industryPh: 'z. B. Restaurant, Coiffeur, Fitness, Handwerk',
    pkg: 'Paket', pkgUnsure: 'Noch unsicher', message: 'Nachricht (optional)', messagePh: 'Was soll man über deinen Betrieb wissen?',
    send: 'Anfrage senden', sent: 'Danke! Deine Anfrage ist angekommen. Wir melden uns innerhalb von 1–2 Werktagen.',
    privacy: 'Wir nutzen deine Angaben nur, um deine Anfrage zu beantworten. Mehr in der Datenschutzerklärung.',
    orMail: 'Lieber per E-Mail?',
  },
  en: {
    eyebrow: 'For businesses', title: 'Short videos for your business – without the effort',
    sub: 'Every month we produce short videos for TikTok, Instagram Reels and YouTube Shorts, tailored to your business. You give quick feedback, we deliver finished videos with captions, texts and hashtags.',
    cta: 'Request a free sample video', ctaSub: 'No commitment – you first see a video for your business before you decide.',
    howTitle: 'How it works',
    how: [
      ['Short call', 'In 15 minutes we clarify what your business should show: offers, tips, behind the scenes, promotions.'],
      ['Free sample video', 'You get a first video for your business – free and without commitment.'],
      ['Monthly videos', 'Every month you receive the agreed videos plus a posting plan, texts and hashtags.'],
      ['Feedback & changes', 'If something doesn’t fit, we change it. Nothing is published without your approval.'],
    ],
    pkgTitle: 'Packages', perMonth: '/ month', popular: 'Popular', monthly: 'Cancel monthly · prices in CHF, no minimum term',
    pkgs: [
      { id: 'start', name: 'Start', price: 290, f: ['8 short videos per month', 'Captions, texts & hashtags', 'For TikTok, Reels & Shorts', '1 revision round per video'] },
      { id: 'growth', name: 'Growth', price: 490, popular: true, f: ['16 short videos per month', 'Captions, texts & hashtags', 'Monthly posting plan', 'Your own photos & logo included', '2 revision rounds per video'] },
      { id: 'full', name: 'Complete', price: 790, f: ['30 short videos per month', 'Everything in “Growth”', 'Publishing by us on request', 'Short monthly report with numbers', 'Personal contact person'] },
    ],
    choose: 'Request this package',
    honestTitle: 'To be honest',
    honest: [
      'Images and voices are created with AI and labelled as AI content on the platforms. On request we include your own photos and clips.',
      'We don’t promise a certain number of views or followers – nobody can do that seriously. We make sure you post good content regularly; that’s the most important foundation.',
      'We agree all facts in the videos with you. Nothing goes live without your approval.',
    ],
    formTitle: 'Send a request', formSub: 'We’ll get back to you within 1–2 business days.',
    name: 'Name', company: 'Company', email: 'Email', phone: 'Phone (optional)', industry: 'Industry', industryPh: 'e.g. restaurant, hair salon, gym, trades',
    pkg: 'Package', pkgUnsure: 'Not sure yet', message: 'Message (optional)', messagePh: 'What should people know about your business?',
    send: 'Send request', sent: 'Thank you! Your request has arrived. We’ll get back to you within 1–2 business days.',
    privacy: 'We only use your details to answer your request. More in the privacy policy.',
    orMail: 'Prefer email?',
  },
};
const ICONS = [MessageSquare, Clapperboard, CalendarCheck, ShieldCheck];

export default function Business() {
  const { lang } = useI18n();
  const c = C[lang === 'en' ? 'en' : 'de'];
  const [f, setF] = useState({ name: '', company: '', email: '', phone: '', industry: '', package: 'growth', message: '', website: '' });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const pick = (id) => { setF((x) => ({ ...x, package: id })); document.getElementById('anfrage')?.scrollIntoView({ behavior: 'smooth' }); };
  const submit = async (e) => {
    e.preventDefault(); setBusy(true); setMsg(null);
    try {
      const r = await fetch('/api/business-inquiry', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...f, lang }) });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(d.error || 'Error');
      setMsg({ tone: 'success', text: c.sent });
      setF({ ...f, name: '', company: '', email: '', phone: '', industry: '', message: '' });
    } catch (err) { setMsg({ tone: 'error', text: err.message }); }
    setBusy(false);
  };

  return (
    <div className="section">
      <div className="container-x">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-wider text-accent-700 dark:text-accent-400">{c.eyebrow}</p>
          <h1 className="mt-2 text-4xl font-bold sm:text-5xl">{c.title}</h1>
          <p className="mt-4 text-lg muted">{c.sub}</p>
          <a href="#anfrage" className="btn-primary mt-7 px-6 py-3.5 text-base">{c.cta}</a>
          <p className="mt-2 text-sm muted">{c.ctaSub}</p>
        </div>

        <h2 className="h2 mt-20 text-center">{c.howTitle}</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {c.how.map(([t, d], i) => { const Icon = ICONS[i]; return (
            <div key={t} className="card p-5">
              <Icon className="h-6 w-6 text-accent-700 dark:text-accent-400" />
              <h3 className="mt-3 font-bold">{i + 1}. {t}</h3>
              <p className="mt-1 text-sm muted">{d}</p>
            </div>
          ); })}
        </div>

        <h2 className="h2 mt-20 text-center">{c.pkgTitle}</h2>
        <p className="mt-2 text-center text-sm muted">{c.monthly}</p>
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {c.pkgs.map((p) => (
            <div key={p.id} className={`card flex flex-col p-6 ${p.popular ? 'border-2 border-accent-500' : ''}`}>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-extrabold">{p.name}</h3>
                {p.popular && <span className="rounded-full bg-accent-500 px-2.5 py-0.5 text-xs font-bold text-navy-950">{c.popular}</span>}
              </div>
              <p className="mt-3"><span className="text-4xl font-extrabold tabular-nums">CHF {p.price}</span> <span className="muted">{c.perMonth}</span></p>
              <ul className="mt-5 flex-1 space-y-2 text-sm">
                {p.f.map((x) => <li key={x} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-accent-700 dark:text-accent-400" />{x}</li>)}
              </ul>
              <button className={`${p.popular ? 'btn-primary' : 'btn-outline'} mt-6 w-full`} onClick={() => pick(p.id)}>{c.choose}</button>
            </div>
          ))}
        </div>

        <div className="card mx-auto mt-12 max-w-3xl p-6">
          <h2 className="text-lg font-bold">{c.honestTitle}</h2>
          <ul className="mt-3 space-y-2 text-sm muted">{c.honest.map((x) => <li key={x}>• {x}</li>)}</ul>
        </div>

        <div id="anfrage" className="card mx-auto mt-12 max-w-2xl scroll-mt-24 p-6 sm:p-8">
          <h2 className="text-2xl font-bold">{c.formTitle}</h2>
          <p className="mt-1 text-sm muted">{c.formSub}</p>
          <form onSubmit={submit} className="mt-6 grid gap-4 sm:grid-cols-2">
            <div><label className="label" htmlFor="b-name">{c.name}</label><input id="b-name" className="input" autoComplete="name" value={f.name} onChange={set('name')} required /></div>
            <div><label className="label" htmlFor="b-company">{c.company}</label><input id="b-company" className="input" autoComplete="organization" value={f.company} onChange={set('company')} required /></div>
            <div><label className="label" htmlFor="b-email">{c.email}</label><input id="b-email" type="email" className="input" autoComplete="email" value={f.email} onChange={set('email')} required /></div>
            <div><label className="label" htmlFor="b-phone">{c.phone}</label><input id="b-phone" type="tel" className="input" autoComplete="tel" value={f.phone} onChange={set('phone')} /></div>
            <div><label className="label" htmlFor="b-industry">{c.industry}</label><input id="b-industry" className="input" placeholder={c.industryPh} value={f.industry} onChange={set('industry')} /></div>
            <div><label className="label" htmlFor="b-pkg">{c.pkg}</label>
              <select id="b-pkg" className="input" value={f.package} onChange={set('package')}>
                {c.pkgs.map((p) => <option key={p.id} value={p.id}>{p.name} – CHF {p.price}</option>)}
                <option value="unsure">{c.pkgUnsure}</option>
              </select>
            </div>
            <div className="sm:col-span-2"><label className="label" htmlFor="b-msg">{c.message}</label><textarea id="b-msg" rows={4} className="input" placeholder={c.messagePh} value={f.message} onChange={set('message')} /></div>
            <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" value={f.website} onChange={set('website')} aria-hidden="true" />
            {msg && <Notice tone={msg.tone} className="sm:col-span-2">{msg.text}</Notice>}
            <button className="btn-primary sm:col-span-2" disabled={busy}>{busy && <Spinner />}{c.send}</button>
            <p className="text-xs muted sm:col-span-2">{c.privacy} {c.orMail} <a className="underline" href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a></p>
          </form>
        </div>
      </div>
    </div>
  );
}
