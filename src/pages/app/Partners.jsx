// Partner-Programm (nur Inhaber): Bewerbungen, Links, Besucher, Kunden, Umsatz, Gewinn, Provision und Auszahlungen.
import { Fragment, useEffect, useState } from 'react';
import { Copy, Check, Plus, ChevronDown, ExternalLink } from 'lucide-react';
import { PageHeader } from '../../components/AppLayout.jsx';
import { Notice, Spinner } from '../../components/ui.jsx';
import { api } from '../../lib/api.js';
import { translate as tr, getLocale } from '../../i18n/index.jsx';

const money = (n) => `$${Number(n || 0).toLocaleString(getLocale(), { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const thisMonth = () => new Date().toISOString().slice(0, 7);
const linkFor = (code) => `https://truereel.ch/?ref=${code}`;
const METHODS = { iban: 'Banküberweisung (IBAN)', twint: 'TWINT', wise: 'Wise', paypal: 'PayPal', later: 'Noch nicht angegeben' };

function CopyBtn({ text }) {
  const [ok, setOk] = useState(false);
  return (
    <button type="button" className="btn-icon h-8 w-8" aria-label={tr('Kopieren')} title={tr('Kopieren')}
      onClick={() => { navigator.clipboard?.writeText(text); setOk(true); setTimeout(() => setOk(false), 1500); }}>
      {ok ? <Check className="h-4 w-4 text-accent-700" /> : <Copy className="h-4 w-4" />}
    </button>
  );
}

export default function Partners() {
  const [month, setMonth] = useState(thisMonth());
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const [pct, setPct] = useState({ friend: '', external: '' });
  const [open, setOpen] = useState(null);
  const [busy, setBusy] = useState('');
  const load = () => { setError(''); api(`/affiliates?month=${month}`).then((d) => { setData(d); setPct({ friend: String(d.friendPercent), external: String(d.externalPercent) }); }).catch((e) => setError(e.message)); };
  useEffect(() => { setData(null); load(); }, [month]); // eslint-disable-line react-hooks/exhaustive-deps

  const run = async (key, fn) => { setBusy(key); setError(''); setMsg(''); try { await fn(); load(); } catch (e) { setError(e.message); } setBusy(''); };
  const update = (code, body) => run(code, () => api(`/affiliates/${code}`, { method: 'PUT', body }));
  const add = () => run('add', () => api('/affiliates', { method: 'POST', body: { name: tr('Neuer Partner'), kind: 'friend' } }));
  const savePct = () => run('pct', () => api('/affiliate-settings', { method: 'PUT', body: { friendPercent: Number(pct.friend), externalPercent: Number(pct.external) } }));
  const decide = (code, approve) => run(code, async () => {
    const r = await api(`/affiliates/${code}/decide`, { method: 'POST', body: { approve } });
    if (approve) setMsg(r.mailed ? tr('Freigeschaltet – der Partner hat seinen Link per E-Mail erhalten.') : tr('Freigeschaltet. Die E-Mail an den Partner konnte nicht gesendet werden – schick ihm den Link bitte selbst.'));
  });
  const payout = (r, paid) => run(r.code, () => api(`/affiliates/${r.code}/payout`, { method: 'POST', body: { month, paid, amount: r.commission } }));

  const rows = data?.rows || [];
  const pending = rows.filter((r) => r.status === 'pending');
  const partners = rows.filter((r) => r.status !== 'pending' && r.status !== 'rejected');
  const total = partners.reduce((a, r) => ({ revenue: a.revenue + r.revenue, profit: a.profit + r.profit, commission: a.commission + r.commission, open: a.open + (r.paid ? 0 : r.commission) }), { revenue: 0, profit: 0, commission: 0, open: 0 });

  return (
    <div>
      <PageHeader title={tr('Partner-Programm')} subtitle={tr('Jeder Partner hat einen eigenen Link. Hier siehst du, wie viele Kunden er gebracht hat und wie viel Provision du ihm schuldest.')} />
      <div className="mb-5 flex flex-wrap items-end gap-3">
        <label className="text-sm"><span className="label">{tr('Monat')}</span><input type="month" className="input w-auto" value={month} onChange={(e) => setMonth(e.target.value)} /></label>
        <label className="text-sm"><span className="label">{tr('Kollegen (%)')}</span><input type="number" min="0" max="100" className="input w-24" value={pct.friend} onChange={(e) => setPct({ ...pct, friend: e.target.value })} /></label>
        <label className="text-sm"><span className="label">{tr('Externe Partner (%)')}</span><input type="number" min="0" max="100" className="input w-24" value={pct.external} onChange={(e) => setPct({ ...pct, external: e.target.value })} /></label>
        <button className="btn-outline" onClick={savePct} disabled={busy === 'pct'}>{tr('Speichern')}</button>
        <a className="btn-ghost ml-auto" href="/partner" target="_blank" rel="noopener"><ExternalLink className="h-4 w-4" />{tr('Bewerbungsseite')}</a>
        <button className="btn-primary" onClick={add} disabled={busy === 'add'}><Plus className="h-4 w-4" />{tr('Partner hinzufügen')}</button>
      </div>
      <p className="-mt-2 mb-5 text-xs muted">{tr('Provision jeweils vom Gewinn. Externe Partner bewerben sich selbst unter truereel.ch/partner – der dort genannte Satz ist 20 %. Wenn du ihn änderst, sag Bescheid, damit die Seite angepasst wird.')}</p>
      {error && <Notice tone="error" className="mb-4">{error}</Notice>}
      {msg && <Notice tone="success" className="mb-4">{msg}</Notice>}
      {!data ? <Spinner className="h-6 w-6 text-accent-500" /> : (
        <>
          {pending.length > 0 && (
            <div className="card mb-5 border-accent-500/50 p-5">
              <h2 className="font-bold">{tr('Neue Bewerbungen ({n})', { n: pending.length })}</h2>
              <ul className="mt-3 divide-y divide-navy-100 dark:divide-navy-800">
                {pending.map((r) => (
                  <li key={r.code} className="flex flex-wrap items-start justify-between gap-3 py-3 text-sm">
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold">{r.name} · <a className="underline" href={`mailto:${r.email}`}>{r.email}</a>{r.country ? ` · ${r.country}` : ''}</p>
                      <p className="mt-1 whitespace-pre-wrap muted">{r.channel}</p>
                      <p className="mt-1 text-xs muted">{tr('Auszahlung')}: {tr(METHODS[r.payout_method] || r.payout_method || '–')}{r.payout_details ? ` – ${r.payout_details}` : ''}</p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <button className="btn-primary" onClick={() => decide(r.code, true)} disabled={busy === r.code}>{busy === r.code && <Spinner />}{tr('Freischalten')}</button>
                      <button className="btn-outline" onClick={() => decide(r.code, false)} disabled={busy === r.code}>{tr('Ablehnen')}</button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="mb-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="card p-5"><p className="text-sm muted">{tr('Umsatz über Partner')}</p><p className="mt-1 text-2xl font-extrabold">{money(total.revenue)}</p></div>
            <div className="card p-5"><p className="text-sm muted">{tr('Gewinn daraus')}</p><p className="mt-1 text-2xl font-extrabold">{money(total.profit)}</p></div>
            <div className="card p-5"><p className="text-sm muted">{tr('Provisionen total')}</p><p className="mt-1 text-2xl font-extrabold text-accent-700 dark:text-accent-400">{money(total.commission)}</p></div>
            <div className="card p-5"><p className="text-sm muted">{tr('Davon noch offen')}</p><p className="mt-1 text-2xl font-extrabold">{money(total.open)}</p></div>
          </div>
          <div className="card overflow-x-auto">
            <table className="w-full min-w-[1040px] text-sm">
              <thead className="text-left muted">
                <tr className="border-b border-navy-100 dark:border-navy-800">
                  <th className="p-3">{tr('Partner')}</th><th className="p-3">{tr('Art')}</th><th className="p-3">{tr('Link')}</th>
                  <th className="p-3 text-right">{tr('Besucher')}</th><th className="p-3 text-right">{tr('Registriert')}</th>
                  <th className="p-3 text-right">{tr('Aktive Abos')}</th><th className="p-3 text-right">{tr('Umsatz')}</th>
                  <th className="p-3 text-right">{tr('Gewinn')}</th><th className="p-3 text-right">{tr('Provision')}</th><th className="p-3">{tr('Bezahlt')}</th><th className="p-3" />
                </tr>
              </thead>
              <tbody>
                {partners.map((r) => (
                  <Fragment key={r.code}>
                    <tr className="border-b border-navy-100 dark:border-navy-800">
                      <td className="p-3"><input className="input py-1.5" defaultValue={r.name} onBlur={(e) => e.target.value !== r.name && update(r.code, { name: e.target.value })} aria-label={tr('Name des Partners')} /></td>
                      <td className="p-3">
                        <select className="input w-auto py-1.5" value={r.kind} onChange={(e) => update(r.code, { kind: e.target.value })} aria-label={tr('Art')}>
                          <option value="friend">{tr('Kollege')} ({data.friendPercent} %)</option>
                          <option value="external">{tr('Extern')} ({data.externalPercent} %)</option>
                        </select>
                      </td>
                      <td className="p-3"><span className="flex items-center gap-1 font-mono text-xs">{linkFor(r.code).replace('https://', '')}<CopyBtn text={linkFor(r.code)} /></span></td>
                      <td className="p-3 text-right tabular-nums">{r.visitors}</td>
                      <td className="p-3 text-right tabular-nums">{r.signups}<span className="muted"> / {r.signupsTotal}</span></td>
                      <td className="p-3 text-right tabular-nums">{r.activeSubs}</td>
                      <td className="p-3 text-right tabular-nums">{money(r.revenue)}</td>
                      <td className="p-3 text-right tabular-nums">{money(r.profit)}</td>
                      <td className="p-3 text-right font-bold tabular-nums">{money(r.commission)}</td>
                      <td className="p-3">
                        {r.commission > 0 || r.paid ? (
                          <label className="flex items-center gap-2 whitespace-nowrap"><input type="checkbox" className="h-4 w-4 accent-accent-500" checked={!!r.paid} disabled={busy === r.code} onChange={(e) => payout(r, e.target.checked)} />{r.paid ? money(r.paid.amount) : tr('offen')}</label>
                        ) : <span className="muted">–</span>}
                      </td>
                      <td className="p-3"><button type="button" className="btn-icon h-8 w-8" onClick={() => setOpen(open === r.code ? null : r.code)} aria-expanded={open === r.code} aria-label={tr('Angaben des Partners')} title={tr('Angaben des Partners')}><ChevronDown className={`h-4 w-4 transition ${open === r.code ? 'rotate-180' : ''}`} /></button></td>
                    </tr>
                    {open === r.code && (
                      <tr className="border-b border-navy-100 bg-navy-50/60 dark:border-navy-800 dark:bg-navy-900/50">
                        <td colSpan={11} className="p-4">
                          <div className="grid gap-4 md:grid-cols-3">
                            <label className="text-sm"><span className="label">{tr('E-Mail')}</span><input className="input" type="email" defaultValue={r.email || ''} onBlur={(e) => e.target.value !== (r.email || '') && update(r.code, { email: e.target.value })} /></label>
                            <label className="text-sm"><span className="label">{tr('Auszahlung per')}</span>
                              <select className="input" value={r.payout_method || 'later'} onChange={(e) => update(r.code, { payoutMethod: e.target.value })}>{Object.entries(METHODS).map(([k, v]) => <option key={k} value={k}>{tr(v)}</option>)}</select>
                            </label>
                            <label className="text-sm"><span className="label">{tr('Zahlungsangaben')}</span>
                              <span className="flex items-center gap-1"><input className="input" defaultValue={r.payout_details || ''} onBlur={(e) => e.target.value !== (r.payout_details || '') && update(r.code, { payoutDetails: e.target.value })} />{r.payout_details && <CopyBtn text={r.payout_details} />}</span>
                            </label>
                          </div>
                          {r.channel && <p className="mt-3 text-sm muted"><b>{tr('Wirbt über')}:</b> {r.channel}{r.country ? ` · ${r.country}` : ''}</p>}
                          <label className="mt-3 flex items-center gap-2 text-sm"><input type="checkbox" className="h-4 w-4 accent-accent-500" checked={r.active} onChange={(e) => update(r.code, { active: e.target.checked })} />{tr('Link aktiv (neue Kunden werden zugeordnet)')}</label>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs muted">{tr('Besucher und „Registriert“ zählen den gewählten Monat (nach dem Schrägstrich: total). Umsatz = im Monat bezahlte Rechnungen der geworbenen Kunden. Gewinn = Umsatz minus Zahlungsgebühren und KI-Kosten (Werte aus den Finanz-Einstellungen). Ein Kunde zählt für einen Partner, wenn er innerhalb von 60 Tagen nach dem Klick auf den Link ein Konto erstellt.')} {tr('„Bezahlt“ hält fest, dass du die Provision dieses Monats überwiesen hast – die Überweisung selbst machst du bei deiner Bank.')}</p>
        </>
      )}
    </div>
  );
}
