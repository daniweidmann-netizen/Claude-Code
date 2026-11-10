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
    <div className="inline-flex rounded-xl border border-navy-200 bg-white p-1 text-sm font-semibold dark:border-navy-700 dark:bg-navy-900" role="radiogroup" aria-label="Abrechnungsintervall">
      {['monthly', 'yearly'].map((i) => (
        <button key={i} role="radio" aria-checked={interval === i} onClick={() => setInterval(i)}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 transition ${interval === i ? 'bg-navy-900 text-white dark:bg-white dark:text-navy-900' : 'text-navy-600 dark:text-navy-300'}`}>
          {t(`pricing.${i}`)}
          {i === 'yearly' && <span className="rounded-md bg-accent-100 px-1.5 py-0.5 text-xs text-accent-800">{t('pricing.save')}</span>}
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
      <div className="grid gap-6 lg:grid-cols-3">
        {PLANS.map((plan) => {
          const p = priceFor(plan, interval);
          const isCurrent = currentPlan === plan.id;
          return (
            <div key={plan.id} className={`card relative flex flex-col p-6 ${plan.popular ? 'border-2 border-accent-500 dark:border-accent-500 lg:-my-3 lg:py-9' : ''}`}>
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 rounded-full bg-accent-500 px-3 py-1 text-xs font-bold text-navy-950">
                  <Sparkles className="h-3 w-3" />{t('pricing.popular')}
                </span>
              )}
              <h3 className="text-lg font-semibold">{plan.name}</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold tabular-nums">{formatUSD(p.perMonth, p.perMonth % 1 ? 2 : 0)}</span>
                <span className="muted">{t('pricing.perMonth')}</span>
              </div>
              <p className="mt-1 h-5 text-xs muted">
                {interval === 'yearly' ? `${formatUSD(p.billed)} ${t('pricing.billedYearly')}` : ''}
              </p>
              <p className="mt-3 text-sm font-medium text-accent-700 dark:text-accent-400">
                ≈ {formatUSD(costPerVideo(plan, interval))} {t('pricing.perVideo')}
              </p>
              <ul className="mt-6 flex-1 space-y-3 text-sm">
                {plan.featureKeys.map((k) => (
                  <li key={k} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-accent-600" />{t(k)}</li>
                ))}
              </ul>
              <button onClick={() => choose(plan.id)} disabled={busy || isCurrent}
                className={`mt-8 w-full ${plan.popular ? 'btn-primary' : 'btn-dark'}`}>
                {busy === plan.id && <Spinner />}
                {isCurrent ? 'Aktueller Plan' : t('pricing.choose')}
              </button>
            </div>
          );
        })}
      </div>
    </>
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
      {showCalculator && <div className="mt-12"><CostCalculator interval={interval} /></div>}
    </div>
  );
}
