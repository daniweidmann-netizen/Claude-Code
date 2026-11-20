// „Dein Video ist fertig“-Fenster für Gratis-Nutzer: im Moment der grössten Begeisterung die Pläne zeigen.
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, ShieldCheck, Check } from 'lucide-react';
import { PLANS, priceFor, costPerVideo, formatUSD } from '../config/plans.js';
import { offerOpen } from './OfferCard.jsx';
import { translate as tr } from '../i18n/index.jsx';

const PER = { hobby: '3 Videos pro Woche', daily: '1 Video pro Tag', pro: '2 Videos pro Tag' };

export default function UpgradeModal({ profile, onClose, done = true }) {
  useEffect(() => {
    const k = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k);
  }, [onClose]);
  const offer = offerOpen(profile);
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-labelledby="upg-title" onClick={onClose}>
      <div className="card relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-b-none p-6 sm:rounded-2xl sm:p-8" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="btn-icon absolute right-3 top-3" onClick={onClose} aria-label={tr('Schliessen')}><X className="h-5 w-5" /></button>
        <p className="text-4xl" aria-hidden="true">🎉</p>
        <h2 id="upg-title" className="mt-2 text-2xl font-extrabold">{done ? tr('Dein Video ist fertig!') : tr('Dein Gratis-Video ist aufgebraucht')}</h2>
        <p className="mt-1 muted">{tr('Wer regelmässig postet, wächst. Mit einem Plan entstehen deine Videos automatisch – ohne Wasserzeichen.')}</p>
        {offer && <p className="mt-4 rounded-xl bg-accent-500/15 px-4 py-3 text-sm font-semibold ring-1 ring-accent-500/30">{tr('Willkommensangebot: 30 % auf deinen ersten Monat – wird an der Kasse automatisch abgezogen.')}</p>}
        <ul className="mt-5 space-y-2">
          {PLANS.map((p) => (
            <li key={p.id} className={`flex items-center justify-between gap-3 rounded-xl border p-3.5 ${p.popular ? 'border-accent-500 bg-accent-500/10' : 'border-navy-100 dark:border-navy-800'}`}>
              <div>
                <p className="font-bold">{p.name} {p.popular && <span className="ml-1 rounded-full bg-accent-500 px-2 py-0.5 text-[10px] font-bold text-navy-950">{tr('Empfohlen')}</span>}</p>
                <p className="text-xs muted">{tr(PER[p.id])} · {formatUSD(costPerVideo(p, 'monthly'))} {tr('pro Video')}</p>
              </div>
              <p className="shrink-0 font-extrabold tabular-nums">{formatUSD(priceFor(p, 'monthly').perMonth, 0)}<span className="text-xs font-normal muted">{tr('/Monat')}</span></p>
            </li>
          ))}
        </ul>
        <Link to="/app/account#plaene" onClick={onClose} className="btn-primary mt-6 w-full py-3.5 text-base">{tr('Plan wählen')}</Link>
        <ul className="mt-4 space-y-1.5 text-sm">
          <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-accent-700 dark:text-accent-400" />{tr('7 Tage Geld zurück, wenn es nicht passt')}</li>
          <li className="flex items-center gap-2"><Check className="h-4 w-4 text-accent-700 dark:text-accent-400" />{tr('Jederzeit mit 1 Klick kündbar')}</li>
          <li className="flex items-center gap-2"><Check className="h-4 w-4 text-accent-700 dark:text-accent-400" />{tr('Sichere Zahlung via Stripe')}</li>
        </ul>
        <button type="button" className="mt-4 w-full text-center text-sm muted underline" onClick={onClose}>{tr('Später')}</button>
      </div>
    </div>
  );
}
