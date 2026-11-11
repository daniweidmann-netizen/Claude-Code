import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Play, CalendarDays, Layers, Eye, Plus, MoreHorizontal, Lightbulb, Check, Pause, FileText } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useAppData } from '../../lib/useAppData.js';
import { computeUsage } from '../../lib/usage.js';
import { Notice, Spinner } from '../../components/ui.jsx';
import { ArtThumb } from '../../components/Pickers.jsx';
import IdeaDialog from '../../components/IdeaDialog.jsx';
import { STATUS_LABELS } from '../../lib/videoFlow.js';
import { fmtDateTime, nextFreeSlot } from '../../lib/schedule.js';
import { getVideo, saveVideo } from '../../lib/store.js';
import { timeline } from '../../video/project.js';
import { PLATFORMS } from '../../config/catalog.js';
import { translate as tr } from '../../i18n/index.jsx';

export function StatusBadge({ status }) {
  const s = STATUS_LABELS[status] || STATUS_LABELS.draft;
  return <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${s.cls}`}>{tr(s.label)}</span>;
}

function Stat({ icon: Icon, label, value, sub }) {
  return (
    <div className="card flex items-center gap-4 p-5">
      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-navy-100 dark:bg-navy-800"><Icon className="h-6 w-6" strokeWidth={1.8} /></span>
      <div className="min-w-0">
        <p className="truncate text-[15px] muted">{label}</p>
        <p className="text-3xl font-extrabold tabular-nums">{value}</p>
        {sub && <p className="truncate text-xs muted">{sub}</p>}
      </div>
    </div>
  );
}

const greeting = () => {
  const h = new Date().getHours();
  return h < 11 ? tr("Guten Morgen!") : h < 18 ? tr("Guten Tag!") : tr("Guten Abend!");
};

function SeriesStatus({ series, count }) {
  if (series.active === false) return <span className="inline-flex items-center gap-1.5 rounded-lg bg-amber-100 px-2.5 py-1 text-sm font-semibold text-amber-800 dark:bg-amber-500/15 dark:text-amber-300"><Pause className="h-3.5 w-3.5" />{tr("pausiert")}</span>;
  if (!count) return <span className="inline-flex items-center gap-1.5 rounded-lg bg-navy-100 px-2.5 py-1 text-sm font-semibold text-navy-600 dark:bg-navy-800 dark:text-navy-200"><FileText className="h-3.5 w-3.5" />{tr("Entwurf")}</span>;
  return <span className="inline-flex items-center gap-1.5 rounded-lg bg-accent-100 px-2.5 py-1 text-sm font-semibold text-accent-800 dark:bg-accent-500/15 dark:text-accent-500"><span className="h-2 w-2 rounded-full bg-accent-600 dark:bg-accent-500" />{tr("aktiv")}</span>;
}

// Vorschaubild: erstes Bild des neuesten Videos, sonst Platzhalter-Grafik
function useThumbs(videos) {
  const [thumbs, setThumbs] = useState({});
  useEffect(() => {
    const latest = {};
    videos.forEach((v) => { if (v.series_id && !latest[v.series_id]) latest[v.series_id] = v.id; });
    Object.entries(latest).slice(0, 8).forEach(async ([sid, vid]) => {
      const full = await getVideo(vid).catch(() => null);
      const img = full?.project?.scenes?.find((s) => s.imageUrl)?.imageUrl;
      if (img) setThumbs((t) => ({ ...t, [sid]: img }));
    });
  }, [videos]);
  return thumbs;
}

function ApprovalQueue({ videos, series, reload }) {
  const pending = videos.filter((v) => v.status === 'pending_approval' || v.status === 'ready');
  const next = pending[0];
  const [full, setFull] = useState(null);
  const [busy, setBusy] = useState(false);
  useEffect(() => { setFull(null); if (next) getVideo(next.id).then(setFull).catch(() => {}); }, [next?.id]); // eslint-disable-line react-hooks/exhaustive-deps
  const s = next && series.find((x) => x.id === next.series_id);
  const slot = s ? nextFreeSlot(s, videos) : null;
  const img = full?.project?.scenes?.find((x) => x.imageUrl)?.imageUrl;
  const dur = full?.project ? Math.round(timeline(full.project).total) : null;
  const platforms = (next?.platforms || []).map((p) => PLATFORMS.find((x) => x.id === p)?.label.split(' ')[0]).filter(Boolean).join(', ');

  const approve = async () => {
    setBusy(true);
    await saveVideo({ ...(full || next), status: 'scheduled', scheduled_at: next.scheduled_at || slot?.toISOString() || null });
    await reload();
    setBusy(false);
  };

  return (
    <div className="card p-6">
      <h2 className="text-2xl font-extrabold tracking-tight">{tr("Freigabe-Warteschlange")}</h2>
      <p className="mt-1 muted">{next ? tr("Nächster Post zur Freigabe.") : tr("Nichts wartet auf deine Freigabe.")}</p>
      {next ? (
        <>
          <Link to={`/app/video/${next.id}`} className="relative mt-5 block aspect-video overflow-hidden rounded-2xl bg-navy-800">
            {img ? <img src={img} alt="" className="h-full w-full object-cover" /> : s && <ArtThumb style={s.art_style} seed={7} motif="city" className="h-full w-full object-cover" />}
            <span className="absolute inset-0 m-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-navy-950"><Play className="ml-1 h-7 w-7 fill-navy-950" /></span>
            {dur != null && <span className="absolute bottom-3 right-3 rounded-md bg-black/60 px-2 py-0.5 text-sm font-semibold text-white">{Math.floor(dur / 60)}:{String(dur % 60).padStart(2, '0')}</span>}
          </Link>
          <p className="mt-4 truncate font-semibold">{next.title}</p>
          <p className="mt-1 flex items-center gap-2 text-[15px] font-medium"><CalendarDays className="h-5 w-5" strokeWidth={1.8} />{slot ? fmtDateTime(slot) : tr("kein Zeitplan")}{platforms ? ` · ${platforms}` : ''}</p>
          {next.status === 'ready' || next.status === 'pending_approval' ? null : null}
          <div className="mt-5 grid grid-cols-2 gap-3">
            <Link to={`/app/video/${next.id}`} className="btn-outline py-3"><Eye className="h-5 w-5" />{tr("Vorschau ansehen")}</Link>
            <button onClick={approve} disabled={busy} className="btn-primary py-3">{busy ? <Spinner /> : <Check className="h-5 w-5" />}{tr("Freigeben")}</button>
          </div>
          {pending.length > 1 && <p className="mt-3 text-center text-sm muted">{tr('+ {n} weitere warten', { n: pending.length - 1 })}</p>}
        </>
      ) : (
        <div className="mt-6 rounded-2xl border border-dashed border-navy-200 p-8 text-center text-sm muted dark:border-navy-700">{tr("Exportierte Videos erscheinen hier, bevor sie gepostet werden.")}</div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const { profile } = useAuth();
  const { series, videos, loading, error, reload } = useAppData();
  const [ideaOpen, setIdeaOpen] = useState(false);
  const thumbs = useThumbs(videos);
  if (loading) return <Spinner className="h-6 w-6 text-accent-500" />;
  if (!series.length && !profile?.onboarding_done) return <Navigate to="/app/onboarding" replace />;

  const usage = computeUsage(profile, videos);
  const now = Date.now();
  const upcoming = videos.filter((v) => v.status === 'scheduled' && new Date(v.scheduled_at) > now);
  const activeSeries = series.filter((s) => s.active !== false);
  const limitText = usage.plan.id === 'free' ? tr("Dein Gratis-Video ist aufgebraucht. Wähle einen Plan unter „Konto“.") : tr("Dein monatliches Kontingent ist aufgebraucht.");

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">{greeting()} 👋</h1>
          <p className="mt-1.5 text-lg muted">{tr("Hier ist dein Fortschritt bei TrueReel.")}</p>
        </div>
        {series.length > 0 && <button onClick={() => setIdeaOpen(true)} className="btn-outline"><Lightbulb className="h-4 w-4" />{tr("Eigene Video-Idee")}</button>}
      </div>
      {ideaOpen && <IdeaDialog allSeries={series} onClose={() => setIdeaOpen(false)} canCreate={usage.remaining > 0} limitText={limitText} />}
      {error && <Notice tone="error" className="mb-4">{error}</Notice>}
      {usage.plan.id === 'free' && (
        <Notice tone="info" className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <span>{tr('Gratis-Test: {n} von 1 Video verfügbar. Gratis-Exporte haben ein kleines Wasserzeichen.', { n: usage.remaining })}</span>
          <Link to="/preise" className="btn-primary shrink-0 px-3 py-1.5 text-xs">{tr("Pläne ansehen")}</Link>
        </Notice>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat icon={Play} label={tr("Videos diesen Monat")} value={usage.used} sub={tr('von {n}', { n: usage.limit })} />
        <Stat icon={CalendarDays} label={tr("Geplante Posts")} value={upcoming.length} sub={upcoming[0] ? tr('nächster {d}', { d: fmtDateTime(upcoming[0].scheduled_at) }) : null} />
        <Stat icon={Layers} label={tr("Aktive Serien")} value={activeSeries.length} />
        <Stat icon={Eye} label={tr("Ansichten")} value="–" sub={tr("nach dem ersten Post")} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.45fr_1fr]">
        <section className="card p-6">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-2xl font-extrabold tracking-tight">{tr("Serien")}</h2>
            <Link to="/app/serien/neu" className="btn-primary"><Plus className="h-5 w-5" />{tr("Neue Serie")}</Link>
          </div>
          {series.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-navy-200 p-8 text-center dark:border-navy-700">
              <p className="font-medium">{tr("Noch keine Serie")}</p>
              <Link to="/app/onboarding" className="btn-primary mt-4">{tr("Erste Serie einrichten")}</Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] text-left">
                <thead><tr className="border-b border-navy-100 text-[15px] muted dark:border-navy-800"><th className="py-3 font-medium">{tr("Serie")}</th><th className="py-3 font-medium">{tr("Status")}</th><th className="py-3 font-medium">{tr("Geplante Posts")}</th><th /></tr></thead>
                <tbody>
                  {series.map((s) => {
                    const vids = videos.filter((v) => v.series_id === s.id);
                    const planned = vids.filter((v) => v.status === 'scheduled').length;
                    return (
                      <tr key={s.id} className="border-b border-navy-100 last:border-0 dark:border-navy-800">
                        <td className="py-4 pr-4">
                          <Link to={`/app/serien/${s.id}`} className="flex items-center gap-4">
                            <span className="relative h-16 w-20 shrink-0 overflow-hidden rounded-xl bg-navy-800">
                              {thumbs[s.id] ? <img src={thumbs[s.id]} alt="" className="h-full w-full object-cover" /> : <ArtThumb style={s.art_style} seed={s.title.length * 999} motif={s.episodes?.[0]?.motif || 'city'} className="h-full w-full object-cover" />}
                              <Play className="absolute inset-0 m-auto h-6 w-6 fill-white text-white drop-shadow" />
                            </span>
                            <span className="font-semibold leading-snug">{s.title}</span>
                          </Link>
                        </td>
                        <td className="py-4 pr-4"><SeriesStatus series={s} count={vids.length} /></td>
                        <td className="py-4 pr-4 text-lg font-semibold tabular-nums">{planned}</td>
                        <td className="py-4 text-right"><Link to={`/app/serien/${s.id}`} className="btn-icon" aria-label={tr("Serie öffnen")}><MoreHorizontal className="h-5 w-5" /></Link></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
        <ApprovalQueue videos={videos} series={series} reload={reload} />
      </div>
    </>
  );
}
