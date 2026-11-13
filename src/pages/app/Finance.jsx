import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Save, Trash2 } from 'lucide-react';
import { PageHeader } from '../../components/AppLayout.jsx';
import { Notice, Spinner } from '../../components/ui.jsx';
import { api } from '../../lib/api.js';
import { PLANS, priceFor } from '../../config/plans.js';
import { translate as tr, getLocale } from '../../i18n/index.jsx';

const money = (n, cur = 'USD') => Number(n || 0).toLocaleString(getLocale(), { style: 'currency', currency: (cur || 'USD').toUpperCase(), maximumFractionDigits: 2 });
const monthKey = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
const monthLabel = (key) => new Date(`${key}-15T12:00:00Z`).toLocaleDateString(getLocale(), { month: 'long', year: 'numeric' });

function Tile({ label, value, hint, tone }) {
  return (
    <div className="card p-5">
      <p className="text-sm muted">{label}</p>
      <p className={`mt-1 text-2xl font-extrabold tabular-nums ${tone === 'neg' ? 'text-red-600 dark:text-red-400' : ''}`}>{value}</p>
      {hint && <p className="mt-1 text-xs muted">{hint}</p>}
    </div>
  );
}

// Hochrechnung: "Was bleibt mir mit X Kunden?" – reine Rechnung im Browser
function Projection({ settings, current }) {
  const [counts, setCounts] = useState(() => Object.fromEntries(PLANS.map((p) => [p.id, { monthly: current?.[p.id]?.monthly || 0, yearly: current?.[p.id]?.yearly || 0 }])));
  const [usage, setUsage] = useState(100);
  const pct = Number(settings.stripePercent || 0) / 100, fix = Number(settings.stripeFixed || 0);
  // KI-Kosten pro Video: Daily und Pro inkl. Premium-Stimme (ElevenLabs), Hobby nur Standard
  const aiFor = (planId) => Number(settings.aiCostPerVideo || 0) + (['daily', 'pro'].includes(planId) ? Number(settings.premiumExtraPerVideo || 0) : 0);
  const fixedCosts = (settings.fixedCosts || []).reduce((s, f) => s + Number(f.amount || 0), 0);
  const rows = useMemo(() => PLANS.flatMap((p) => ['monthly', 'yearly'].map((interval) => {
    const n = Number(counts[p.id][interval]) || 0;
    const price = priceFor(p, interval);
    const revenue = n * price.perMonth;
    const fees = n * (interval === 'yearly' ? (price.billed * pct + fix) / 12 : price.billed * pct + fix);
    const ai = aiFor(p.id);
    const aiCost = n * p.videosPerMonth * (usage / 100) * ai;
    return { plan: p, interval, n, revenue, fees, aiCost, net: revenue - fees - aiCost, perCustomer: n ? (revenue - fees - aiCost) / n : price.perMonth - (interval === 'yearly' ? (price.billed * pct + fix) / 12 : price.billed * pct + fix) - p.videosPerMonth * (usage / 100) * ai };
  })), [counts, usage, pct, fix, settings]); // eslint-disable-line react-hooks/exhaustive-deps
  const sum = (k) => rows.reduce((s, r) => s + r[k], 0);
  const profit = sum('net') - fixedCosts;
  const set = (plan, interval, v) => setCounts((c) => ({ ...c, [plan]: { ...c[plan], [interval]: v } }));
  return (
    <section className="card p-5">
      <h2 className="font-semibold">{tr('Hochrechner')}</h2>
      <p className="mb-4 text-sm muted">{tr('Trag ein, wie viele Kunden du pro Plan hast oder erwartest. Alles wird sofort berechnet (pro Monat, in USD).')}</p>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-sm">
          <thead><tr className="text-left text-xs muted"><th className="py-2 pr-2">{tr('Plan')}</th><th className="pr-2">{tr('Kunden')}</th><th className="pr-2 text-right">{tr('Umsatz')}</th><th className="pr-2 text-right">{tr('Stripe')}</th><th className="pr-2 text-right">{tr('KI-Kosten')}</th><th className="text-right">{tr('Bleibt')}</th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={`${r.plan.id}-${r.interval}`} className="border-t border-navy-100 dark:border-navy-800">
                <td className="py-2 pr-2 font-medium">{r.plan.name} <span className="text-xs muted">{r.interval === 'yearly' ? tr('jährlich') : tr('monatlich')}</span><br /><span className="text-xs muted">{tr('{x} pro Kunde', { x: money(r.perCustomer) })}</span></td>
                <td className="pr-2"><input type="number" min="0" inputMode="numeric" className="input w-20 py-1.5" value={counts[r.plan.id][r.interval]} onChange={(e) => set(r.plan.id, r.interval, e.target.value)} aria-label={`${r.plan.name} ${r.interval}`} /></td>
                <td className="pr-2 text-right tabular-nums">{money(r.revenue)}</td>
                <td className="pr-2 text-right tabular-nums muted">−{money(r.fees)}</td>
                <td className="pr-2 text-right tabular-nums muted">−{money(r.aiCost)}</td>
                <td className="text-right font-semibold tabular-nums">{money(r.net)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-navy-200 dark:border-navy-700"><td className="py-2 font-semibold">{tr('Summe')}</td><td>{rows.reduce((s, r) => s + r.n, 0)}</td><td className="text-right tabular-nums">{money(sum('revenue'))}</td><td className="text-right tabular-nums muted">−{money(sum('fees'))}</td><td className="text-right tabular-nums muted">−{money(sum('aiCost'))}</td><td className="text-right font-semibold tabular-nums">{money(sum('net'))}</td></tr>
            <tr><td className="py-1 muted" colSpan={5}>{tr('Fixkosten')}</td><td className="text-right tabular-nums muted">−{money(fixedCosts)}</td></tr>
            <tr><td className="py-2 text-base font-bold" colSpan={5}>{tr('Gewinn pro Monat')}</td><td className={`text-right text-base font-bold tabular-nums ${profit < 0 ? 'text-red-600 dark:text-red-400' : ''}`}>{money(profit)}</td></tr>
            <tr><td className="pb-2 muted" colSpan={5}>{tr('Gewinn pro Jahr')}</td><td className="text-right tabular-nums muted">{money(profit * 12)}</td></tr>
          </tfoot>
        </table>
      </div>
      <label className="mt-4 block text-sm">
        <span className="font-medium">{tr('Genutzte Videos: {n} %', { n: usage })}</span>
        <input type="range" min="10" max="100" step="5" value={usage} onChange={(e) => setUsage(+e.target.value)} className="mt-2 w-full accent-accent-500" />
        <span className="text-xs muted">{tr('Viele Kunden nutzen nicht alle Videos – das senkt deine KI-Kosten.')}</span>
      </label>
    </section>
  );
}

function SettingsCard({ settings, onSaved }) {
  const [s, setS] = useState(settings);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);
  useEffect(() => setS(settings), [settings]);
  const save = async () => {
    setBusy(true); setMsg(null);
    try { const r = await api('/finance/settings', { method: 'PUT', body: s }); onSaved(r.settings); setMsg({ tone: 'success', text: tr('Gespeichert.') }); }
    catch (e) { setMsg({ tone: 'error', text: e.message }); }
    setBusy(false);
  };
  const setFixed = (i, patch) => setS((x) => ({ ...x, fixedCosts: x.fixedCosts.map((f, j) => (j === i ? { ...f, ...patch } : f)) }));
  return (
    <section className="card space-y-4 p-5">
      <h2 className="font-semibold">{tr('Annahmen & Fixkosten')}</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label className="text-sm"><span className="label">{tr('Premium-Stimme pro Video ($)')}</span><input type="number" step="0.01" min="0" className="input" value={s.premiumExtraPerVideo ?? 0.1} onChange={(e) => setS({ ...s, premiumExtraPerVideo: e.target.value })} /></label>
        <label className="text-sm"><span className="label">{tr('KI-Kosten pro Video ($)')}</span><input type="number" step="0.01" min="0" className="input" value={s.aiCostPerVideo} onChange={(e) => setS({ ...s, aiCostPerVideo: e.target.value })} /></label>
        <label className="text-sm"><span className="label">{tr('Stripe-Gebühr (%)')}</span><input type="number" step="0.1" min="0" className="input" value={s.stripePercent} onChange={(e) => setS({ ...s, stripePercent: e.target.value })} /></label>
        <label className="text-sm"><span className="label">{tr('Stripe pro Zahlung ($)')}</span><input type="number" step="0.01" min="0" className="input" value={s.stripeFixed} onChange={(e) => setS({ ...s, stripeFixed: e.target.value })} /></label>
      </div>
      <div>
        <p className="label">{tr('Fixkosten pro Monat ($)')}</p>
        <div className="space-y-2">
          {(s.fixedCosts || []).map((f, i) => (
            <div key={i} className="flex gap-2">
              <input className="input flex-1" value={f.name} placeholder={tr('Bezeichnung')} onChange={(e) => setFixed(i, { name: e.target.value })} aria-label={tr('Bezeichnung')} />
              <input type="number" step="0.01" min="0" className="input w-28" value={f.amount} onChange={(e) => setFixed(i, { amount: e.target.value })} aria-label={tr('Betrag')} />
              <button className="btn-icon" onClick={() => setS({ ...s, fixedCosts: s.fixedCosts.filter((_, j) => j !== i) })} aria-label={tr('Entfernen')}><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}
        </div>
        <button className="btn-outline mt-2 text-sm" onClick={() => setS({ ...s, fixedCosts: [...(s.fixedCosts || []), { name: '', amount: 0 }] })}><Plus className="h-4 w-4" />{tr('Fixkosten hinzufügen')}</button>
      </div>
      <button className="btn-primary" onClick={save} disabled={busy}>{busy ? <Spinner /> : <Save className="h-4 w-4" />}{tr('Speichern')}</button>
      {msg && <Notice tone={msg.tone}>{msg.text}</Notice>}
      <p className="text-xs muted">{tr('Die KI-Kosten pro Video (Bilder, Standard-Stimme, Skript) und der Zuschlag für Premium-Stimmen (ElevenLabs) sind Schätzungen. Die echten Kosten siehst du bei OpenAI und ElevenLabs unter „Usage“ – passe die Werte hier danach an. Im Hochrechner rechnen Daily und Pro mit Premium-Stimmen.')}</p>
    </section>
  );
}

export default function Finance() {
  const [month, setMonth] = useState(() => monthKey(new Date()));
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => {
    setData(null); setError('');
    api(`/finance?month=${month}`).then(setData).catch((e) => setError(e.message));
  }, [month]);
  const shift = (d) => { const [y, m] = month.split('-').map(Number); setMonth(monthKey(new Date(y, m - 1 + d, 1))); };
  const cur = data?.stripe?.currency || 'usd';
  const totalSubs = data ? Object.values(data.subscriptions).reduce((s, c) => s + c.monthly + c.yearly, 0) : 0;

  return (
    <>
      <PageHeader title={tr('Finanzen')} sub={tr('Einnahmen aus Stripe, geschätzte KI-Kosten und deine Fixkosten – automatisch pro Monat.')} />
      <div className="mb-5 flex items-center gap-2">
        <button className="btn-icon" onClick={() => shift(-1)} aria-label={tr('Vorheriger Monat')}><ChevronLeft className="h-5 w-5" /></button>
        <p className="min-w-[10rem] text-center font-semibold">{monthLabel(month)}</p>
        <button className="btn-icon" onClick={() => shift(1)} aria-label={tr('Nächster Monat')}><ChevronRight className="h-5 w-5" /></button>
      </div>
      {error && <Notice tone="error">{error}</Notice>}
      {!data && !error && <Spinner className="h-6 w-6 text-accent-500" />}
      {data?.demo && <Notice>{tr('Im Demo-Modus gibt es keine Finanzdaten.')}</Notice>}
      {data?.settings && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <Tile label={tr('Einnahmen (netto)')} value={money(data.stripe.net, cur)} hint={tr('{n} Zahlungen · brutto {g} · Gebühren {f}', { n: data.stripe.payments, g: money(data.stripe.gross, cur), f: money(data.stripe.fees, cur) })} />
            <Tile label={tr('KI-Kosten (geschätzt)')} value={money(data.aiCosts)} hint={`${tr('{n} Videos × {c}', { n: data.videos, c: money(data.settings.aiCostPerVideo) })}${data.premiumVideos ? ` + ${tr('{n} mit Premium-Stimme × {c}', { n: data.premiumVideos, c: money(data.settings.premiumExtraPerVideo) })}` : ''}`} />
            <Tile label={tr('Fixkosten')} value={money(data.fixedCosts)} hint={tr('pro Monat')} />
            <Tile label={tr('Gewinn')} value={money(data.profit, cur)} tone={data.profit < 0 ? 'neg' : ''} hint={tr('Einnahmen − KI-Kosten − Fixkosten')} />
          </div>
          {cur.toLowerCase() !== 'usd' && <p className="text-xs muted">{tr('Stripe rechnet in {c} ab, die Kosten sind in USD erfasst – der Gewinn ist deshalb eine Näherung.', { c: cur.toUpperCase() })}</p>}

          <section className="card p-5">
            <h2 className="font-semibold">{tr('Aktive Abos')}</h2>
            <p className="mb-3 text-sm muted">{tr('{n} zahlende Kunden · {f} im Gratis-Test · wiederkehrender Umsatz {m} pro Monat', { n: totalSubs, f: data.freeUsers, m: money(data.mrr) })}</p>
            <table className="w-full text-sm">
              <thead><tr className="text-left text-xs muted"><th className="py-1">{tr('Plan')}</th><th className="text-right">{tr('monatlich')}</th><th className="text-right">{tr('jährlich')}</th></tr></thead>
              <tbody>{PLANS.map((p) => <tr key={p.id} className="border-t border-navy-100 dark:border-navy-800"><td className="py-2 font-medium">{p.name}</td><td className="text-right tabular-nums">{data.subscriptions[p.id].monthly}</td><td className="text-right tabular-nums">{data.subscriptions[p.id].yearly}</td></tr>)}</tbody>
            </table>
          </section>

          <Projection key={JSON.stringify(data.subscriptions) + JSON.stringify(data.settings)} settings={data.settings} current={data.subscriptions} />
          <SettingsCard settings={data.settings} onSaved={(settings) => setData((d) => ({ ...d, settings }))} />
        </div>
      )}
    </>
  );
}
