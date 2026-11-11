import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAppData } from '../../lib/useAppData.js';
import { PageHeader } from '../../components/AppLayout.jsx';
import { Spinner } from '../../components/ui.jsx';
import { slotsForSeries } from '../../lib/schedule.js';
import { STATUS_LABELS } from '../../lib/videoFlow.js';
import { translate as tr, getLocale } from '../../i18n/index.jsx';

const WD = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']; // wird über tr() übersetzt
const dayKey = (d) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
const hm = (d) => d.toLocaleTimeString(getLocale(), { hour: '2-digit', minute: '2-digit' });

export default function Calendar() {
  const { series, videos, loading } = useAppData();
  const [cursor, setCursor] = useState(() => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), 1); });

  const { cells, byDay } = useMemo(() => {
    const first = new Date(cursor);
    const offset = (first.getDay() + 6) % 7;
    const start = new Date(first); start.setDate(1 - offset);
    const cells = Array.from({ length: 42 }, (_, i) => { const d = new Date(start); d.setDate(start.getDate() + i); return d; });
    const byDay = new Map();
    const push = (d, item) => { const k = dayKey(d); if (!byDay.has(k)) byDay.set(k, []); byDay.get(k).push(item); };
    const taken = new Set();
    videos.filter((v) => v.scheduled_at || v.posted_at).forEach((v) => {
      const d = new Date(v.posted_at || v.scheduled_at);
      taken.add(`${v.series_id}|${d.getTime()}`);
      push(d, { type: 'video', d, v, s: series.find((x) => x.id === v.series_id) });
    });
    const now = new Date();
    series.filter((s) => s.active !== false).forEach((s) => {
      const from = cells[0] > now ? cells[0] : now;
      const days = Math.ceil((cells[41] - from) / 86400000) + 1;
      if (days <= 0) return;
      slotsForSeries(s, from, days).forEach((d) => { if (!taken.has(`${s.id}|${d.getTime()}`)) push(d, { type: 'slot', d, s }); });
    });
    byDay.forEach((list) => list.sort((a, b) => a.d - b.d));
    return { cells, byDay };
  }, [cursor, series, videos]);

  if (loading) return <Spinner className="h-6 w-6 text-accent-500" />;
  const month = cursor.toLocaleDateString(getLocale(), { month: 'long', year: 'numeric' });
  const shift = (n) => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + n, 1));
  const today = dayKey(new Date());
  const agenda = cells.filter((d) => d.getMonth() === cursor.getMonth() && byDay.get(dayKey(d))?.length);

  const Item = ({ it }) => it.type === 'video' ? (
    <Link to={`/app/video/${it.v.id}`} className={`block truncate rounded-md px-1.5 py-0.5 text-[11px] font-medium ${STATUS_LABELS[it.v.status]?.cls}`} title={it.v.title}>
      {hm(it.d)} {it.v.title}
    </Link>
  ) : (
    <Link to={`/app/serien/${it.s.id}`} className="block truncate rounded-md border border-dashed border-navy-200 px-1.5 py-0.5 text-[11px] muted dark:border-navy-700" title={`${tr('Freier Slot')} – ${it.s.title}`}>
      {hm(it.d)} {tr('frei')} · {it.s.title}
    </Link>
  );

  return (
    <>
      <PageHeader title={tr("Content-Kalender")} sub={tr("Geplante und gepostete Videos sowie freie Slots aus deinen Zeitplänen.")} actions={
        <div className="flex items-center gap-2">
          <button className="btn-outline px-2" onClick={() => shift(-1)} aria-label={tr("Vorheriger Monat")}><ChevronLeft className="h-4 w-4" /></button>
          <span className="w-40 text-center font-semibold capitalize">{month}</span>
          <button className="btn-outline px-2" onClick={() => shift(1)} aria-label={tr("Nächster Monat")}><ChevronRight className="h-4 w-4" /></button>
        </div>
      } />
      <div className="mb-4 flex flex-wrap gap-3 text-xs">
        {['pending_approval', 'scheduled', 'posted', 'failed'].map((k) => <span key={k} className={`rounded-full px-2 py-0.5 font-semibold ${STATUS_LABELS[k].cls}`}>{tr(STATUS_LABELS[k].label)}</span>)}
        <span className="rounded-full border border-dashed border-navy-300 px-2 py-0.5 muted">{tr("Freier Slot")}</span>
      </div>

      <div className="card hidden overflow-hidden md:block">
        <div className="grid grid-cols-7 border-b border-navy-100 text-center text-xs font-semibold muted dark:border-navy-800">
          {WD.map((w) => <div key={w} className="py-2">{tr(w)}</div>)}
        </div>
        <div className="grid grid-cols-7">
          {cells.map((d) => {
            const items = byDay.get(dayKey(d)) || [];
            const out = d.getMonth() !== cursor.getMonth();
            return (
              <div key={d.toISOString()} className={`min-h-[110px] border-b border-r border-navy-100 p-1.5 dark:border-navy-800 ${out ? 'bg-navy-50/50 dark:bg-navy-950/40' : ''}`}>
                <p className={`mb-1 text-xs font-semibold ${dayKey(d) === today ? 'inline-flex h-5 w-5 items-center justify-center rounded-full bg-accent-500 text-navy-950' : out ? 'muted' : ''}`}>{d.getDate()}</p>
                <div className="space-y-1">
                  {items.slice(0, 3).map((it, i) => <Item key={i} it={it} />)}
                  {items.length > 3 && <p className="text-[11px] muted">{tr('+{n} weitere', { n: items.length - 3 })}</p>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-3 md:hidden">
        {!agenda.length && <div className="card p-6 text-center text-sm muted">{tr("In diesem Monat ist nichts geplant.")}</div>}
        {agenda.map((d) => (
          <div key={d.toISOString()} className="card p-4">
            <p className="mb-2 text-sm font-semibold">{d.toLocaleDateString(getLocale(), { weekday: 'long', day: 'numeric', month: 'long' })}</p>
            <div className="space-y-1.5">{byDay.get(dayKey(d)).map((it, i) => <Item key={i} it={it} />)}</div>
          </div>
        ))}
      </div>
    </>
  );
}
