// Willkommensangebot nach dem ersten Gratis-Export: echte 48-Stunden-Frist mit Countdown.
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Gift } from 'lucide-react';
import { translate as tr } from '../i18n/index.jsx';

export const offerOpen = (profile) => (profile?.plan || 'free') === 'free' && profile?.offer_until && new Date(profile.offer_until) > new Date();

export default function OfferCard({ profile, percent = 30, className = 'mb-6' }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 30_000); return () => clearInterval(t); }, []);
  if (!offerOpen(profile)) return null;
  const left = Math.max(0, new Date(profile.offer_until).getTime() - now);
  const h = Math.floor(left / 3600e3); const m = Math.floor((left % 3600e3) / 60e3);
  return (
    <section className={`card border-2 border-accent-500 p-5 ${className}`}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <Gift className="mt-0.5 h-6 w-6 shrink-0 text-accent-700 dark:text-accent-400" />
          <div>
            <p className="font-bold">{tr('Gefällt dir dein Video? {p} % auf deinen ersten Monat', { p: percent })}</p>
            <p className="mt-0.5 text-sm muted">{tr('Gilt für jeden Plan und wird an der Kasse automatisch abgezogen. Noch {h} Std. {m} Min.', { h, m })}</p>
          </div>
        </div>
        <Link to="/app/account#plaene" className="btn-primary shrink-0">{tr('Angebot nutzen')}</Link>
      </div>
    </section>
  );
}
