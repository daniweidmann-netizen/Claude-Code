import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ChevronDown, Sparkles } from 'lucide-react';
import { PLANS, priceFor, costPerVideo, formatUSD, YEARLY_DISCOUNT } from '../config/plans.js';
import { useI18n } from '../i18n/index.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { startCheckout } from '../lib/billing.js';
import { StripeBadge, Spinner, Notice } from './ui.jsx';

export function IntervalToggle({ interval, setInterval }) {
  const { t } = useI18n();
  return (
    <div className="inline-flex rounded-2xl border border-navy-200 bg-white p-1 text-base font-semibold dark:border-navy-700 dark:bg-navy-950" role="radiogroup" aria-label="Abrechnungsintervall">
      {['monthly', 'yearly'].map((i) => (
        <button key={i} role="radio" aria-checked={interval === i} onClick={() => setInterval(i)}
          className={`flex items-center gap-2 rounded-xl px-6 py-2.5 transition ${interval === i ? 'bg-navy-100 text-navy-950 dark:bg-navy-800 dark:text-white' : 'text-navy-600 dark:text-white/80'}`}>
          {t(`pricing.${i}`)}
          {i === 'yearly' && <span className="font-bold text-accent-700 dark:text-accent-500">{t('pricing.save')}</span>}
        </button>
      ))}
    </div>
  );
}

export function PricingTable({ interval, currentPlan }) {
  const { t } = useI18n();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(null);
  const [error, setError] = useState('');

  const choose = async (plan) => {
    setError('');
    if (!user) return navigate(`/registrieren?plan=${plan}&interval=${interval}`);
    setBusy(plan);
    try { await startCheckout(plan, interval); } catch (e) { setError(e.message); setBusy(null); }
  };

  return (
    <>
      {error && <Notice tone="error" className="mb-4">{error}</Notice>}
      <div className="grid gap-5 lg:grid-cols-3">
        {PLANS.map((plan) => {
          const p = priceFor(plan, interval);
          const isCurrent = currentPlan === plan.id;
          const hot = plan.popular;
          return (
            <div key={plan.id} className={`relative flex flex-col rounded-2xl p-7 ${hot ? 'bg-accent-500 text-navy-950' : 'card'}`}>
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-3xl font-extrabold tracking-tight">{plan.name}</h3>
                {hot && <span className="rounded-full bg-navy-950 px-3 py-1 text-xs font-bold text-white">{t('pricing.popular')}</span>}
              </div>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-5xl font-extrabold tracking-tight tabular-nums">{formatUSD(p.perMonth, p.perMonth % 1 ? 2 : 0)}</span>
                <span className={`text-xl ${hot ? 'text-navy-900' : 'muted'}`}>/{t('pricing.perMonth').replace('/ ', '')}</span>
              </div>
              <p className={`mt-1 h-5 text-xs ${hot ? 'text-navy-800' : 'muted'}`}>{interval === 'yearly' ? `${formatUSD(p.billed)} ${t('pricing.billedYearly')}` : ''}</p>
              <ul className="mt-4 flex-1 space-y-3 text-[15px]">
                {plan.featureKeys.map((k) => (
                  <li key={k} className="flex gap-2.5"><Check className={`mt-0.5 h-5 w-5 shrink-0 ${hot ? 'text-navy-950' : 'text-accent-700 dark:text-accent-500'}`} strokeWidth={2.5} />{t(k)}</li>
                ))}
              </ul>
              <button onClick={() => choose(plan.id)} disabled={busy || isCurrent}
                className={`btn mt-7 w-full py-3 text-base ${hot ? 'bg-navy-950 text-white hover:bg-navy-800' : 'btn-outline'}`}>
                {busy === plan.id && <Spinner />}
                {isCurrent ? 'Aktueller Plan' : t('pricing.choose')}
              </button>
              <p className={`mt-3 text-center text-sm ${hot ? 'text-navy-900' : 'muted'}`}>{t('trust.cancel')}</p>
            </div>
          );
        })}
      </div>
    </>
  );
}

export function CostTable({ interval }) {
  const { t } = useI18n();
  return (
    <div>
      <h3 className="mb-4 text-3xl font-extrabold tracking-tight">{t('pricing.perVideo') === 'per video' ? 'Cost per video' : 'Kosten pro Video'}</h3>
      <div className="card overflow-hidden p-0">
        <table className="w-full text-left text-[15px]">
          <thead><tr className="border-b border-navy-100 text-sm muted dark:border-navy-800"><th className="px-6 py-4 font-medium">Plan</th><th className="px-6 py-4 font-medium">Videos/Monat</th><th className="px-6 py-4 font-medium">{t('pricing.perVideo') === 'per video' ? 'Cost per video' : 'Kosten pro Video'}</th></tr></thead>
          <tbody>
            {PLANS.map((plan) => (
              <tr key={plan.id} className="border-b border-navy-100 last:border-0 dark:border-navy-800">
                <td className="px-6 py-4 font-bold">{plan.name}</td>
                <td className="px-6 py-4 tabular-nums">{plan.videosPerMonth}</td>
                <td className="px-6 py-4 font-bold tabular-nums">{formatUSD(costPerVideo(plan, interval))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function CostCalculator({ interval }) {
  const { t } = useI18n();
  const [need, setNeed] = useState(30);
  const rows = useMemo(() => PLANS.map((plan) => {
    const enough = plan.videosPerMonth >= need;
    const perVideoUsed = priceFor(plan, interval).perMonth / Math.min(need, plan.videosPerMonth);
    return { plan, enough, perVideoUsed };
  }), [need, interval]);
  const recommended = rows.filter((r) => r.enough).sort((a, b) => a.plan.monthly - b.plan.monthly)[0]?.plan.id;
  return (
    <div className="card p-6 sm:p-8">
      <h3 className="text-xl font-semibold">{t('calc.title')}</h3>
      <p className="mt-1 text-sm muted">{t('calc.sub')}</p>
      <div className="mt-6 flex items-center gap-4">
        <input type="range" min={1} max={60} value={need} onChange={(e) => setNeed(+e.target.value)} className="flex-1 accent-accent-500" aria-label={t('calc.videos')} />
        <span className="w-36 whitespace-nowrap text-right text-sm font-semibold tabular-nums">{need} {t('calc.videos')}</span>
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {rows.map(({ plan, enough, perVideoUsed }) => (
          <div key={plan.id} className={`rounded-xl border p-4 ${plan.id === recommended ? 'border-accent-500 bg-accent-50/60 dark:bg-accent-900/20' : 'border-navy-100 dark:border-navy-800'}`}>
            <div className="flex items-center justify-between">
              <span className="font-semibold">{plan.name}</span>
              {plan.id === recommended && <span className="text-xs font-semibold text-accent-700 dark:text-accent-400">{t('calc.recommend')}</span>}
            </div>
            {enough ? (
              <>
                <p className="mt-2 text-2xl font-bold tabular-nums">{formatUSD(perVideoUsed)}</p>
                <p className="text-xs muted">{t('pricing.perVideo')}{plan.videosPerMonth > need ? ` · ${plan.videosPerMonth - need} ${t('calc.unused')}` : ''}</p>
              </>
            ) : (
              <p className="mt-2 text-sm muted">max. {plan.videosPerMonth} / Monat – {t('calc.notEnough')}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function FAQ() {
  const { t } = useI18n();
  const [open, setOpen] = useState(0);
  const items = [1, 2, 3, 4, 5, 6, 7, 8];
  return (
    <div className="divide-y divide-navy-100 rounded-2xl border border-navy-100 dark:divide-navy-800 dark:border-navy-800">
      {items.map((i, idx) => (
        <div key={i}>
          <button className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-medium" onClick={() => setOpen(open === idx ? -1 : idx)} aria-expanded={open === idx}>
            {t(`faq.${i}.q`)}
            <ChevronDown className={`h-5 w-5 shrink-0 transition ${open === idx ? 'rotate-180' : ''}`} />
          </button>
          {open === idx && <p className="px-5 pb-5 text-sm muted">{t(`faq.${i}.a`)}</p>}
        </div>
      ))}
    </div>
  );
}

export function PricingSection({ showCalculator = true, currentPlan }) {
  const { t } = useI18n();
  const [interval, setInterval] = useState('monthly');
  return (
    <div>
      <div className="mb-10 flex flex-col items-center gap-4 text-center">
        <IntervalToggle interval={interval} setInterval={setInterval} />
        <p className="text-xs muted">{t('pricing.vat')} {interval === 'yearly' && `(${Math.round(YEARLY_DISCOUNT * 100)} % Rabatt)`}</p>
      </div>
      <PricingTable interval={interval} currentPlan={currentPlan} />
      <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl border border-dashed border-navy-200 p-6 text-center dark:border-navy-700 sm:flex-row sm:text-left">
        <div>
          <p className="font-semibold">{t('pricing.freeTitle')}</p>
          <p className="text-sm muted">{t('pricing.freeText')}</p>
        </div>
        <div className="flex items-center gap-3">
          <StripeBadge />
          <a href="/registrieren" className="btn-outline">{t('pricing.freeCta')}</a>
        </div>
      </div>
      {showCalculator && <div className="mt-14"><CostTable interval={interval} /></div>}
      {showCalculator && <div className="mt-10"><CostCalculator interval={interval} /></div>}
    </div>
  );
}
