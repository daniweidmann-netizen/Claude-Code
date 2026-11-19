// Partner-Programm (nur Inhaber): Links, Besucher, Kunden, Umsatz, Gewinn und Provision pro Partner.
import { useEffect, useState } from 'react';
import { Copy, Check, Plus } from 'lucide-react';
import { PageHeader } from '../../components/AppLayout.jsx';
import { Notice, Spinner } from '../../components/ui.jsx';
import { api } from '../../lib/api.js';
import { translate as tr, getLocale } from '../../i18n/index.jsx';

const money = (n) => `$${Number(n || 0).toLocaleString(getLocale(), { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const thisMonth = () => new Date().toISOString().slice(0, 7);
const linkFor = (code) => `https://truereel.ch/?ref=${code}`;

function CopyBtn({ text }) {
  const [ok, setOk] = useState(false);
  return (
    <button type="button" className="btn-icon h-8 w-8" aria-label={tr('Link kopieren')} title={tr('Link kopieren')}
      onClick={() => { navigator.clipboard?.writeText(text); setOk(true); setTimeout(() => setOk(false), 1500); }}>
      {ok ? <Check className="h-4 w-4 text-accent-700" /> : <Copy className="h-4 w-4" />}
    </button>
  );
}

export default function Partners() {
  const [month, setMonth] = useState(thisMonth());
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [pct, setPct] = useState('');
  const load = () => { setError(''); api(`/affiliates?month=${month}`).then((d) => { setData(d); setPct(String(d.commissionPercent)); }).catch((e) => setError(e.message)); };
  useEffect(() => { setData(null); load(); }, [month]); // eslint-disable-line react-hooks/exhaustive-deps

  const rename = async (code, name) => { await api(`/affiliates/${code}`, { method: 'PUT', body: { name } }); load(); };
  const add = async () => { await api('/affiliates', { method: 'POST', body: { name: tr('Neuer Partner') } }); load(); };
  const savePct = async () => { await api('/affiliate-settings', { method: 'PUT', body: { commissionPercent: Number(pct) } }); load(); };

  const total = data?.rows?.reduce((a, r) => ({ revenue: a.revenue + r.revenue, profit: a.profit + r.profit, commission: a.commission + r.commission }), { revenue: 0, profit: 0, commission: 0 });

  return (
    <div>
      <PageHeader title={tr('Partner-Programm')} subtitle={tr('Jeder Partner hat einen eigenen Link. Hier siehst du, wie viele Kunden er gebracht hat und wie viel Provision du ihm schuldest.')} />
      <div className="mb-5 flex flex-wrap items-end gap-3">
        <label className="text-sm"><span className="label">{tr('Monat')}</span><input type="month" className="input w-auto" value={month} onChange={(e) => setMonth(e.target.value)} /></label>
        <label className="text-sm"><span className="label">{tr('Provision vom Gewinn (%)')}</span>
          <span className="flex gap-2"><input type="number" min="0" max="100" className="input w-24" value={pct} onChange={(e) => setPct(e.target.value)} /><button className="btn-outline" onClick={savePct}>{tr('Speichern')}</button></span>
        </label>
        <button className="btn-primary ml-auto" onClick={add}><Plus className="h-4 w-4" />{tr('Partner hinzufügen')}</button>
      </div>
      {error && <Notice tone="error" className="mb-4">{error}</Notice>}
      {!data ? <Spinner className="h-6 w-6 text-accent-500" /> : (
        <>
          <div className="mb-5 grid gap-4 sm:grid-cols-3">
            <div className="card p-5"><p className="text-sm muted">{tr('Umsatz über Partner')}</p><p className="mt-1 text-2xl font-extrabold">{money(total.revenue)}</p></div>
            <div className="card p-5"><p className="text-sm muted">{tr('Gewinn daraus')}</p><p className="mt-1 text-2xl font-extrabold">{money(total.profit)}</p></div>
            <div className="card p-5"><p className="text-sm muted">{tr('Provisionen total ({p} %)', { p: data.commissionPercent })}</p><p className="mt-1 text-2xl font-extrabold text-accent-700 dark:text-accent-400">{money(total.commission)}</p></div>
          </div>
          <div className="card overflow-x-auto">
            <table className="w-full min-w-[900px] text-sm">
              <thead className="text-left muted">
                <tr className="border-b border-navy-100 dark:border-navy-800">
                  <th className="p-3">{tr('Partner')}</th><th className="p-3">{tr('Link')}</th>
                  <th className="p-3 text-right">{tr('Besucher')}</th><th className="p-3 text-right">{tr('Registriert')}</th>
                  <th className="p-3 text-right">{tr('Aktive Abos')}</th><th className="p-3 text-right">{tr('Umsatz')}</th>
                  <th className="p-3 text-right">{tr('Gewinn')}</th><th className="p-3 text-right">{tr('Provision')}</th>
                </tr>
              </thead>
              <tbody>
                {data.rows.map((r) => (
                  <tr key={r.code} className="border-b border-navy-100 last:border-0 dark:border-navy-800">
                    <td className="p-3"><input className="input py-1.5" defaultValue={r.name} onBlur={(e) => e.target.value !== r.name && rename(r.code, e.target.value)} aria-label={tr('Name des Partners')} /></td>
                    <td className="p-3"><span className="flex items-center gap-1 font-mono text-xs">{linkFor(r.code).replace('https://', '')}<CopyBtn text={linkFor(r.code)} /></span></td>
                    <td className="p-3 text-right tabular-nums">{r.visitors}</td>
                    <td className="p-3 text-right tabular-nums">{r.signups}<span className="muted"> / {r.signupsTotal}</span></td>
                    <td className="p-3 text-right tabular-nums">{r.activeSubs}</td>
                    <td className="p-3 text-right tabular-nums">{money(r.revenue)}</td>
                    <td className="p-3 text-right tabular-nums">{money(r.profit)}</td>
                    <td className="p-3 text-right font-bold tabular-nums">{money(r.commission)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs muted">{tr('Besucher und „Registriert“ zählen den gewählten Monat (nach dem Schrägstrich: total). Umsatz = im Monat bezahlte Rechnungen der geworbenen Kunden. Gewinn = Umsatz minus Zahlungsgebühren und KI-Kosten (Werte aus den Finanz-Einstellungen). Ein Kunde zählt für einen Partner, wenn er innerhalb von 60 Tagen nach dem Klick auf den Link ein Konto erstellt.')}</p>
        </>
      )}
    </div>
  );
}
