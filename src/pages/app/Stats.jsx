import { useEffect, useState } from 'react';
import { PageHeader } from '../../components/AppLayout.jsx';
import { Notice, Spinner } from '../../components/ui.jsx';
import { api } from '../../lib/api.js';
import { translate as tr, getLocale } from '../../i18n/index.jsx';

const BAR = 'bg-[#6b8512] dark:bg-[#7f9c16]'; // validiert gegen hell/dunkel (Lightness-Band, Kontrast)
const fmt = (n, d = 0) => Number(n || 0).toLocaleString(getLocale(), { maximumFractionDigits: d, minimumFractionDigits: d });
const dayLabel = (iso) => new Date(`${iso}T12:00:00Z`).toLocaleDateString(getLocale(), { day: 'numeric', month: 'short' });

function Tile({ label, value, hint }) {
  return (
    <div className="card p-5">
      <p className="text-sm muted">{label}</p>
      <p className="mt-1 text-3xl font-extrabold tabular-nums">{value}</p>
      {hint && <p className="mt-1 text-xs muted">{hint}</p>}
    </div>
  );
}

function DailyChart({ daily }) {
  const [hover, setHover] = useState(null);
  const max = Math.max(1, ...daily.map((d) => d.visitors));
  const cur = hover != null ? daily[hover] : null;
  return (
    <div className="card p-5">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="font-semibold">{tr('Besucher pro Tag')}</h2>
        <p className="text-xs muted tabular-nums" aria-live="polite">
          {cur ? `${dayLabel(cur.date)} · ${fmt(cur.visitors)} ${tr('Besucher')} · ${fmt(cur.views)} ${tr('Aufrufe')}${cur.signups ? ` · ${fmt(cur.signups)} ${tr('Registrierungen')}` : ''}` : `${tr('Max.')} ${fmt(max)}`}
        </p>
      </div>
      <div className="relative mt-4 h-44 border-b border-navy-100 dark:border-navy-700" onMouseLeave={() => setHover(null)}>
        <div className="absolute inset-x-0 top-0 border-t border-dashed border-navy-100 dark:border-navy-800" aria-hidden />
        <div className="absolute inset-0 flex items-end gap-[2px]">
          {daily.map((d, i) => (
            <button key={d.date} type="button" className="group relative flex h-full flex-1 items-end focus:outline-none"
              onMouseEnter={() => setHover(i)} onFocus={() => setHover(i)} onClick={() => setHover(i)}
              aria-label={`${dayLabel(d.date)}: ${d.visitors} ${tr('Besucher')}`}>
              <span className={`block w-full rounded-t-[4px] ${BAR} ${hover === i ? 'opacity-100' : hover != null ? 'opacity-50' : 'opacity-100'}`}
                style={{ height: d.visitors ? `${Math.max(2, (d.visitors / max) * 100)}%` : 0 }} />
            </button>
          ))}
        </div>
      </div>
      <div className="mt-2 flex justify-between text-xs muted tabular-nums">
        <span>{dayLabel(daily[0].date)}</span><span>{dayLabel(daily[daily.length - 1].date)}</span>
      </div>
    </div>
  );
}

function TopList({ title, rows, total, empty }) {
  return (
    <div className="card p-5">
      <h2 className="font-semibold">{title}</h2>
      {!rows.length ? <p className="mt-3 text-sm muted">{empty}</p> : (
        <table className="mt-3 w-full text-sm">
          <tbody>
            {rows.map((r) => (
              <tr key={r.name} className="border-t border-navy-100 first:border-0 dark:border-navy-800">
                <td className="py-2 pr-3">
                  <span className="block truncate">{r.name === '(direkt)' ? tr('Direkt / unbekannt') : r.name}</span>
                  <span className={`mt-1 block h-1 rounded-full ${BAR}`} style={{ width: `${Math.max(2, (r.n / Math.max(1, total)) * 100)}%` }} aria-hidden />
                </td>
                <td className="w-16 py-2 text-right tabular-nums">{fmt(r.n)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default function Stats() {
  const [days, setDays] = useState(30);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => {
    setData(null); setError('');
    api(`/stats?days=${days}`).then(setData).catch((e) => setError(e.message));
  }, [days]);

  return (
    <>
      <PageHeader title={tr('Statistik')} sub={tr('Cookie-frei: keine Cookies, keine Drittanbieter. Ein Besucher wird nur innerhalb eines Tages wiedererkannt.')} />
      <div className="mb-5 flex gap-2" role="group" aria-label={tr('Zeitraum')}>
        {[7, 30, 90].map((d) => (
          <button key={d} onClick={() => setDays(d)} aria-pressed={days === d}
            className={`rounded-lg px-3 py-1.5 text-sm font-semibold ${days === d ? 'bg-navy-900 text-white dark:bg-white dark:text-navy-900' : 'btn-outline'}`}>
            {tr('{n} Tage', { n: d })}
          </button>
        ))}
      </div>
      {error && <Notice tone="error">{error}</Notice>}
      {!data && !error && <Spinner className="h-6 w-6 text-accent-500" />}
      {data?.demo && <Notice>{tr('Im Demo-Modus gibt es keine Statistik.')}</Notice>}
      {data?.totals && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
            <Tile label={tr('Besucher')} value={fmt(data.totals.visitors)} hint={`${fmt(data.totals.pageviews)} ${tr('Seitenaufrufe')}`} />
            <Tile label={tr('Registrierungen')} value={fmt(data.totals.signups)} hint={`${fmt(data.totals.signupRate * 100, 1)} % ${tr('der Besucher')}`} />
            <Tile label={tr('Checkout gestartet')} value={fmt(data.totals.checkouts)} />
            <Tile label={tr('Käufe')} value={fmt(data.totals.purchases)} hint={`$${fmt(data.totals.revenue, 2)} ${tr('Umsatz')}`} />
            <Tile label={tr('Interesse Cinematic-Plan')} value={fmt(data.totals.waitlist)} hint={tr('Einträge insgesamt')} />
          </div>
          <DailyChart daily={data.daily} />
          <div className="grid gap-5 lg:grid-cols-3">
            <TopList title={tr('Herkunft')} rows={data.sources} total={data.totals.pageviews} empty={tr('Noch keine Daten.')} />
            <TopList title={tr('Seiten')} rows={data.pages} total={data.totals.pageviews} empty={tr('Noch keine Daten.')} />
            <TopList title={tr('Geräte')} rows={data.devices} total={data.totals.pageviews} empty={tr('Noch keine Daten.')} />
          </div>
          <p className="text-xs muted">{tr('Tipp: Hänge an Links in deinen Profilen ?ref=tiktok, ?ref=reddit usw. an – dann siehst du unter „Herkunft“ genau, welcher Kanal Besucher bringt.')}</p>
        </div>
      )}
    </>
  );
}
