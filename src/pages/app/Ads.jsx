// Werbe-Test (nur Inhaber): pro Anzeige ein eigener Link, Ausgaben eintragen, sehen was ein Kunde kostet.
import { useEffect, useState } from 'react';
import { Copy, Check, Plus } from 'lucide-react';
import { PageHeader } from '../../components/AppLayout.jsx';
import { Notice, Spinner } from '../../components/ui.jsx';
import { api } from '../../lib/api.js';
import { translate as tr, getLocale } from '../../i18n/index.jsx';

const money = (n) => (n == null ? '–' : `$${Number(n).toLocaleString(getLocale(), { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
const PLATFORMS = [['tiktok', 'TikTok'], ['instagram', 'Instagram'], ['facebook', 'Facebook'], ['google', 'Google'], ['youtube', 'YouTube'], ['other', 'Andere']];
const linkFor = (c) => `https://truereel.ch/${c.target === 'firmen' ? 'firmen' : ''}?utm_source=${c.platform}&utm_medium=paid&utm_campaign=${c.code}`;

// Ampel: Abo-Kunde unter $80 bzw. Firmen-Anfrage unter $60 = lohnt sich
function verdict(r) {
  if (!r.spend) return { tone: 'muted', text: tr('Ausgaben eintragen') };
  if (r.target === 'firmen') {
    if (!r.leads) return r.spend >= 150 ? { tone: 'bad', text: tr('Noch keine Anfrage – Anzeige ändern') } : { tone: 'muted', text: tr('Noch zu früh') };
    const cpl = r.spend / r.leads;
    return cpl <= 60 ? { tone: 'good', text: tr('Lohnt sich ({v} pro Anfrage)', { v: money(cpl) }) } : { tone: 'warn', text: tr('Teuer ({v} pro Anfrage)', { v: money(cpl) }) };
  }
  if (!r.paying) return r.spend >= 150 ? { tone: 'bad', text: tr('Noch kein Kunde – Anzeige ändern') } : { tone: 'muted', text: tr('Noch zu früh') };
  return r.costPerCustomer <= 80 ? { tone: 'good', text: tr('Lohnt sich') } : r.costPerCustomer <= 150 ? { tone: 'warn', text: tr('Grenzwertig') } : { tone: 'bad', text: tr('Zu teuer') };
}
const TONE = { good: 'bg-emerald-600 text-white', warn: 'bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200', bad: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200', muted: 'bg-navy-100 text-navy-700 dark:bg-navy-800 dark:text-navy-200' };

function CopyBtn({ text }) {
  const [ok, setOk] = useState(false);
  return (
    <button type="button" className="btn-icon h-8 w-8 shrink-0" aria-label={tr('Link kopieren')} title={tr('Link kopieren')}
      onClick={() => { navigator.clipboard?.writeText(text); setOk(true); setTimeout(() => setOk(false), 1500); }}>
      {ok ? <Check className="h-4 w-4 text-accent-700" /> : <Copy className="h-4 w-4" />}
    </button>
  );
}

export default function Ads() {
  const [rows, setRows] = useState(null);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', platform: 'tiktok', target: 'start' });
  const load = () => api('/campaigns').then((d) => setRows(d.rows || [])).catch((e) => setError(e.message));
  useEffect(() => { load(); }, []);
  const add = async (e) => {
    e.preventDefault();
    await api('/campaigns', { method: 'POST', body: { ...form, name: form.name.trim() || tr('Neue Kampagne') } });
    setForm({ ...form, name: '' }); load();
  };
  const save = async (code, body) => { await api(`/campaigns/${code}`, { method: 'PUT', body }); load(); };
  const total = rows?.reduce((a, r) => ({ spend: a.spend + r.spend, signups: a.signups + r.signups, paying: a.paying + r.paying, result: a.result + r.result, leads: a.leads + r.leads }), { spend: 0, signups: 0, paying: 0, result: 0, leads: 0 });

  return (
    <div>
      <PageHeader title={tr('Werbung')} subtitle={tr('Pro Anzeige einen eigenen Link erstellen, Ausgaben eintragen – und sehen, was ein Kunde wirklich kostet.')} />
      <form onSubmit={add} className="card mb-6 grid gap-3 p-4 sm:grid-cols-[1fr_auto_auto_auto] sm:items-end">
        <label className="text-sm"><span className="label">{tr('Name der Anzeige')}</span><input className="input" maxLength={80} placeholder={tr('z. B. TikTok Test 1 – Hook Flamingo')} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
        <label className="text-sm"><span className="label">{tr('Plattform')}</span><select className="input" value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })}>{PLATFORMS.map(([v, l]) => <option key={v} value={v}>{tr(l)}</option>)}</select></label>
        <label className="text-sm"><span className="label">{tr('Ziel')}</span><select className="input" value={form.target} onChange={(e) => setForm({ ...form, target: e.target.value })}><option value="start">{tr('Startseite (Abos)')}</option><option value="firmen">{tr('Firmen-Seite (Anfragen)')}</option></select></label>
        <button className="btn-primary"><Plus className="h-4 w-4" />{tr('Link erstellen')}</button>
      </form>
      {error && <Notice tone="error" className="mb-4">{error}</Notice>}
      {!rows ? <Spinner className="h-6 w-6 text-accent-500" /> : (
        <>
          <div className="mb-5 grid gap-4 sm:grid-cols-4">
            <div className="card p-5"><p className="text-sm muted">{tr('Ausgaben total')}</p><p className="mt-1 text-2xl font-extrabold">{money(total.spend)}</p></div>
            <div className="card p-5"><p className="text-sm muted">{tr('Neue Konten')}</p><p className="mt-1 text-2xl font-extrabold">{total.signups}</p></div>
            <div className="card p-5"><p className="text-sm muted">{tr('Zahlende Kunden / Anfragen')}</p><p className="mt-1 text-2xl font-extrabold">{total.paying} / {total.leads}</p></div>
            <div className="card p-5"><p className="text-sm muted">{tr('Ergebnis (Gewinn − Werbung)')}</p><p className={`mt-1 text-2xl font-extrabold ${total.result < 0 ? 'text-red-600 dark:text-red-400' : 'text-accent-700 dark:text-accent-400'}`}>{money(total.result)}</p></div>
          </div>
          {!rows.length ? <p className="muted">{tr('Noch keine Kampagne. Erstelle oben deinen ersten Werbe-Link.')}</p> : (
            <div className="space-y-4">
              {rows.map((r) => {
                const v = verdict(r);
                return (
                  <div key={r.code} className="card p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <input className="input flex-1 py-1.5 font-semibold" defaultValue={r.name} onBlur={(e) => e.target.value !== r.name && save(r.code, { name: e.target.value })} aria-label={tr('Name der Anzeige')} />
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${TONE[v.tone]}`}>{v.text}</span>
                    </div>
                    <div className="mt-2 flex items-center gap-1 overflow-x-auto font-mono text-xs muted"><span className="whitespace-nowrap">{linkFor(r).replace('https://', '')}</span><CopyBtn text={linkFor(r)} /></div>
                    <div className="mt-3 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4 lg:grid-cols-8">
                      <label><span className="block text-xs muted">{tr('Ausgegeben ($)')}</span><input type="number" min="0" step="0.01" className="input py-1.5" defaultValue={r.spend || ''} onBlur={(e) => Number(e.target.value) !== r.spend && save(r.code, { spend: Number(e.target.value) || 0 })} /></label>
                      <div><span className="block text-xs muted">{tr('Besucher')}</span><b>{r.visitors}</b>{r.costPerVisitor != null && <span className="block text-xs muted">{money(r.costPerVisitor)} {tr('pro Besucher')}</span>}</div>
                      {r.target === 'firmen'
                        ? <div><span className="block text-xs muted">{tr('Firmen-Anfragen')}</span><b>{r.leads}</b>{r.leads > 0 && r.spend > 0 && <span className="block text-xs muted">{money(r.spend / r.leads)} {tr('pro Anfrage')}</span>}</div>
                        : <div><span className="block text-xs muted">{tr('Neue Konten')}</span><b>{r.signups}</b>{r.signupRate != null && <span className="block text-xs muted">{r.signupRate} % {tr('der Besucher')}</span>}</div>}
                      <div><span className="block text-xs muted">{tr('Zahlende Kunden')}</span><b>{r.paying}</b>{r.payRate != null && <span className="block text-xs muted">{r.payRate} % {tr('der Konten')}</span>}</div>
                      <div><span className="block text-xs muted">{tr('Kosten pro Konto')}</span><b>{money(r.costPerSignup)}</b></div>
                      <div><span className="block text-xs muted">{tr('Kosten pro Kunde')}</span><b>{money(r.costPerCustomer)}</b></div>
                      <div><span className="block text-xs muted">{tr('Gewinn aus Abos')}</span><b>{money(r.profit)}</b></div>
                      <div><span className="block text-xs muted">{tr('Ergebnis')}</span><b className={r.result < 0 ? 'text-red-600 dark:text-red-400' : 'text-accent-700 dark:text-accent-400'}>{money(r.result)}</b></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <p className="mt-4 text-xs muted">{tr('So funktioniert es: Den Link in der Anzeige als Ziel eintragen. Wer darüber kommt und innerhalb von 30 Tagen ein Konto erstellt oder eine Firmen-Anfrage sendet, zählt für diese Anzeige (gleicher Browser). Ausgaben trägst du aus dem Werbekonto ein. Faustregel: Ein Abo-Kunde sollte unter $80 kosten, eine Firmen-Anfrage unter $60. Gewinn = bezahlte Rechnungen minus Zahlungsgebühren und KI-Kosten; CHF und USD werden zusammengezählt (Näherung).')}</p>
        </>
      )}
    </div>
  );
}
