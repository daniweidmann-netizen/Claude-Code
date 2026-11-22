// Öffentliche Seite des Partner-Programms: Bedingungen und Bewerbung. Partner geben ihre Angaben selbst ein;
// freigeschaltet wird von Hand – erst danach gibt es den persönlichen Link.
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Link2, Wallet, UserPlus } from 'lucide-react';
import { useI18n } from '../i18n/index.jsx';
import { Notice, Spinner } from '../components/ui.jsx';
import { SITE } from '../config/site.js';

const PERCENT = 20; // externe Partner; muss mit den Einstellungen unter /app/partner übereinstimmen
const MIN_PAYOUT = 'CHF 20';

const T = {
  de: {
    eyebrow: 'Partnerprogramm', title: 'TrueReel empfehlen und mitverdienen',
    sub: `Du empfiehlst TrueReel über deinen persönlichen Link. Für jeden Kunden, der darüber ein Abo abschliesst, erhältst du ${PERCENT} % vom Gewinn – jeden Monat, solange der Kunde zahlt.`,
    steps: [['Bewerben', 'Fülle das Formular aus. Wir prüfen jede Bewerbung von Hand und melden uns per E-Mail.'], ['Link teilen', 'Nach der Freischaltung bekommst du deinen persönlichen Link – für Social Media, Website, Newsletter oder persönliche Empfehlungen.'], ['Provision erhalten', `Wir rechnen monatlich ab und zahlen ab ${MIN_PAYOUT} per Banküberweisung, TWINT, Wise oder PayPal aus.`]],
    termsTitle: 'Die Bedingungen – kurz und ehrlich',
    terms: [
      `Provision: ${PERCENT} % vom Gewinn aus den Zahlungen der von dir geworbenen Kunden. Gewinn = bezahlter Betrag minus Zahlungsgebühren und KI-Kosten für die Videos des Kunden.`,
      'Zuordnung: Ein Kunde zählt für dich, wenn er nach dem Klick auf deinen Link ein Konto erstellt (innerhalb von 60 Tagen, im selben Browser).',
      `Abrechnung: einmal im Monat für den Vormonat. Rückerstattungen werden abgezogen. Auszahlung ab ${MIN_PAYOUT}; kleinere Beträge werden auf den nächsten Monat übertragen.`,
      'Fair werben: keine Spam-Nachrichten, keine erfundenen Versprechen (z. B. garantierte Reichweite oder Einnahmen), keine bezahlten Anzeigen auf den Markennamen „TrueReel“. Kennzeichne deinen Link als Werbung, wo das vorgeschrieben ist.',
      'Keine Provision auf dein eigenes Konto.',
      'Steuern: Die Provision ist dein Einkommen; für die Versteuerung bist du selbst verantwortlich.',
      'Wir können das Programm anpassen oder beenden und kündigen Änderungen mindestens 30 Tage vorher per E-Mail an. Bis dahin verdiente Provisionen zahlen wir aus. Bei Verstössen gegen diese Regeln können wir einen Partner sofort ausschliessen.',
    ],
    formTitle: 'Jetzt bewerben', name: 'Name', email: 'E-Mail-Adresse', country: 'Land', channel: 'Wo möchtest du TrueReel empfehlen?',
    channelPh: 'z. B. TikTok-Kanal @…, Instagram, eigene Website, Newsletter, Kunden meiner Agentur',
    method: 'Auszahlung per', details: { iban: 'IBAN und Kontoinhaber', twint: 'TWINT-Handynummer', wise: 'Wise-E-Mail oder Kontoangaben', paypal: 'PayPal-E-Mail' },
    methods: { iban: 'Banküberweisung (IBAN)', twint: 'TWINT', wise: 'Wise', paypal: 'PayPal', later: 'Gebe ich später an' },
    detailsNote: 'Deine Zahlungsangaben sehen nur wir. Wir verwenden sie ausschliesslich für die Auszahlung.',
    terms1: 'Ich akzeptiere die Bedingungen oben und die ', terms2: 'Datenschutzerklärung', terms3: '.',
    submit: 'Bewerbung senden', sending: 'Wird gesendet …',
    ok: 'Danke! Deine Bewerbung ist bei uns angekommen. Wir prüfen sie und melden uns per E-Mail – meist innerhalb weniger Tage.',
    err: { invalid: 'Bitte fülle alle Pflichtfelder aus und akzeptiere die Bedingungen.', exists: 'Mit dieser E-Mail-Adresse gibt es bereits eine Bewerbung. Schreib uns an ' + SITE.contactEmail + ', falls du etwas ändern möchtest.', too_many: 'Zu viele Versuche. Bitte versuche es in einer Stunde erneut.', fail: 'Das Senden hat nicht geklappt. Bitte versuche es später erneut oder schreib uns an ' + SITE.contactEmail + '.' },
    change: 'Angaben ändern? Schreib uns an',
  },
  en: {
    eyebrow: 'Partner programme', title: 'Recommend TrueReel and earn with it',
    sub: `You recommend TrueReel through your personal link. For every customer who subscribes through it you receive ${PERCENT}% of the profit – every month, for as long as the customer pays.`,
    steps: [['Apply', 'Fill in the form. We review every application by hand and get back to you by email.'], ['Share your link', 'Once approved you get your personal link – for social media, your website, newsletter or personal recommendations.'], ['Get your commission', `We settle monthly and pay out from ${MIN_PAYOUT} by bank transfer, TWINT, Wise or PayPal.`]],
    termsTitle: 'The conditions – short and honest',
    terms: [
      `Commission: ${PERCENT}% of the profit from the payments of the customers you referred. Profit = amount paid minus payment fees and AI costs for the customer’s videos.`,
      'Attribution: a customer counts for you if they create an account after clicking your link (within 60 days, in the same browser).',
      `Settlement: once a month for the previous month. Refunds are deducted. Payout from ${MIN_PAYOUT}; smaller amounts carry over to the next month.`,
      'Promote fairly: no spam, no invented promises (such as guaranteed reach or income), no paid ads on the brand name “TrueReel”. Label your link as advertising where required.',
      'No commission on your own account.',
      'Taxes: the commission is your income; you are responsible for taxing it.',
      'We may change or end the programme and announce changes by email at least 30 days in advance. Commissions earned until then are paid out. If these rules are broken we may exclude a partner immediately.',
    ],
    formTitle: 'Apply now', name: 'Name', email: 'Email address', country: 'Country', channel: 'Where would you like to recommend TrueReel?',
    channelPh: 'e.g. TikTok channel @…, Instagram, your own website, newsletter, clients of my agency',
    method: 'Payout by', details: { iban: 'IBAN and account holder', twint: 'TWINT mobile number', wise: 'Wise email or account details', paypal: 'PayPal email' },
    methods: { iban: 'Bank transfer (IBAN)', twint: 'TWINT', wise: 'Wise', paypal: 'PayPal', later: 'I will provide this later' },
    detailsNote: 'Only we see your payment details. We use them solely for the payout.',
    terms1: 'I accept the conditions above and the ', terms2: 'privacy policy', terms3: '.',
    submit: 'Send application', sending: 'Sending …',
    ok: 'Thank you! Your application has arrived. We will review it and get back to you by email – usually within a few days.',
    err: { invalid: 'Please fill in all required fields and accept the conditions.', exists: 'There is already an application with this email address. Write to ' + SITE.contactEmail + ' if you would like to change something.', too_many: 'Too many attempts. Please try again in an hour.', fail: 'Sending failed. Please try again later or write to ' + SITE.contactEmail + '.' },
    change: 'Need to change your details? Write to',
  },
};

export default function Partner() {
  const { lang } = useI18n();
  const t = T[lang === 'en' ? 'en' : 'de'];
  const [f, setF] = useState({ name: '', email: '', country: '', channel: '', payoutMethod: 'iban', payoutDetails: '', terms: false, website: '' });
  const [state, setState] = useState('idle'); // idle | busy | done
  const [error, setError] = useState('');
  const set = (patch) => setF((x) => ({ ...x, ...patch }));
  const icons = [UserPlus, Link2, Wallet];

  const submit = async (e) => {
    e.preventDefault(); setError('');
    const needsDetails = f.payoutMethod !== 'later';
    if (f.name.trim().length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim()) || f.channel.trim().length < 5 || !f.terms || (needsDetails && f.payoutDetails.trim().length < 4)) return setError(t.err.invalid);
    setState('busy');
    try {
      const r = await fetch('/api/affiliate/apply', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...f, lang: lang === 'en' ? 'en' : 'de' }) });
      const j = await r.json().catch(() => null);
      // Erfolg nur, wenn der Server das Speichern bestätigt hat
      if (r.ok && j?.ok === true) return setState('done');
      setError(t.err[j?.error] || t.err.fail);
    } catch { setError(t.err.fail); }
    setState('idle');
  };

  return (
    <>
      <section className="section pb-10">
        <div className="container-x max-w-4xl text-center">
          <p className="eyebrow">{t.eyebrow}</p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">{t.title}</h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg muted">{t.sub}</p>
          <a href="#bewerben" className="btn-primary mt-8 px-8 py-3.5 text-base">{t.formTitle}</a>
        </div>
      </section>

      <section className="pb-16">
        <div className="container-x">
          <ol className="grid gap-4 md:grid-cols-3">
            {t.steps.map(([title, text], i) => {
              const Icon = icons[i];
              return (
                <li key={title} className="card p-6">
                  <div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-500 text-sm font-extrabold text-navy-950">{i + 1}</span><Icon className="h-5 w-5 text-accent-700 dark:text-accent-400" /></div>
                  <h2 className="mt-4 text-lg font-bold">{title}</h2>
                  <p className="mt-1.5 text-sm muted">{text}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container-x grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="h2">{t.termsTitle}</h2>
            <ul className="mt-6 space-y-3 text-sm">
              {t.terms.map((x) => <li key={x} className="flex gap-3"><Check className="mt-0.5 h-4 w-4 shrink-0 text-accent-700 dark:text-accent-400" strokeWidth={2.5} /><span>{x}</span></li>)}
            </ul>
          </div>

          <div id="bewerben" className="scroll-mt-24">
            <div className="card p-6 sm:p-8">
              <h2 className="text-2xl font-bold">{t.formTitle}</h2>
              {state === 'done' ? <Notice tone="success" className="mt-5">{t.ok}</Notice> : (
                <form onSubmit={submit} className="mt-5 space-y-4" noValidate>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div><label className="label" htmlFor="pa-name">{t.name} *</label><input id="pa-name" className="input" autoComplete="name" maxLength={60} required value={f.name} onChange={(e) => set({ name: e.target.value })} /></div>
                    <div><label className="label" htmlFor="pa-email">{t.email} *</label><input id="pa-email" type="email" inputMode="email" className="input" autoComplete="email" maxLength={190} required value={f.email} onChange={(e) => set({ email: e.target.value })} /></div>
                  </div>
                  <div><label className="label" htmlFor="pa-country">{t.country}</label><input id="pa-country" className="input" autoComplete="country-name" maxLength={60} value={f.country} onChange={(e) => set({ country: e.target.value })} /></div>
                  <div><label className="label" htmlFor="pa-channel">{t.channel} *</label><textarea id="pa-channel" className="input min-h-[90px]" maxLength={400} required placeholder={t.channelPh} value={f.channel} onChange={(e) => set({ channel: e.target.value })} /></div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="label" htmlFor="pa-method">{t.method}</label>
                      <select id="pa-method" className="input" value={f.payoutMethod} onChange={(e) => set({ payoutMethod: e.target.value, payoutDetails: '' })}>
                        {Object.entries(t.methods).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                      </select>
                    </div>
                    {f.payoutMethod !== 'later' && (
                      <div><label className="label" htmlFor="pa-details">{t.details[f.payoutMethod]} *</label><input id="pa-details" className="input" maxLength={200} autoComplete="off" required value={f.payoutDetails} onChange={(e) => set({ payoutDetails: e.target.value })} /></div>
                    )}
                  </div>
                  <p className="text-xs muted">{t.detailsNote}</p>
                  <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px]" value={f.website} onChange={(e) => set({ website: e.target.value })} />
                  <label className="flex items-start gap-3 text-sm"><input type="checkbox" className="mt-1 h-4 w-4 accent-accent-500" checked={f.terms} onChange={(e) => set({ terms: e.target.checked })} /><span>{t.terms1}<Link to="/datenschutz" className="underline">{t.terms2}</Link>{t.terms3}</span></label>
                  {error && <Notice tone="error">{error}</Notice>}
                  <button className="btn-primary w-full py-3 text-base" disabled={state === 'busy'}>{state === 'busy' && <Spinner />}{state === 'busy' ? t.sending : t.submit}</button>
                </form>
              )}
            </div>
            <p className="mt-4 text-center text-xs muted">{t.change} <a className="underline" href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a></p>
          </div>
        </div>
      </section>
    </>
  );
}
