import { Link, Navigate } from 'react-router-dom';
import { Film, Layers, CalendarClock, CheckCircle2, BarChart3, Plus, ArrowRight, Lightbulb } from 'lucide-react';
import { useState } from 'react';
import IdeaDialog from '../../components/IdeaDialog.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useAppData } from '../../lib/useAppData.js';
import { computeUsage } from '../../lib/usage.js';
import { PageHeader } from '../../components/AppLayout.jsx';
import { Notice, Spinner } from '../../components/ui.jsx';
import { STATUS_LABELS } from '../../lib/videoFlow.js';
import { fmtDateTime } from '../../lib/schedule.js';
import { NICHES } from '../../config/catalog.js';

export function StatusBadge({ status }) {
  const s = STATUS_LABELS[status] || STATUS_LABELS.draft;
  return <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${s.cls}`}>{s.label}</span>;
}

function Stat({ icon: Icon, label, value, sub, children }) {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 text-sm muted"><Icon className="h-4 w-4" />{label}</div>
      <p className="mt-2 text-2xl font-bold tabular-nums">{value}</p>
      {sub && <p className="text-xs muted">{sub}</p>}
      {children}
    </div>
  );
}

export default function Dashboard() {
  const { profile } = useAuth();
  const { series, videos, loading, error } = useAppData();
  const [ideaOpen, setIdeaOpen] = useState(false);
  if (loading) return <Spinner className="h-6 w-6 text-accent-500" />;
  if (!series.length && !profile?.onboarding_done) return <Navigate to="/app/onboarding" replace />;

  const usage = computeUsage(profile, videos);
  const now = Date.now();
  const upcoming = videos.filter((v) => v.status === 'scheduled' && new Date(v.scheduled_at) > now).sort((a, b) => new Date(a.scheduled_at) - new Date(b.scheduled_at));
  const pending = videos.filter((v) => v.status === 'pending_approval' || v.status === 'ready');
  const posted = videos.filter((v) => v.status === 'posted');
  const seriesLimit = usage.plan.limits.series;

  return (
    <>
      <PageHeader
        title={`Hallo${profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''} 👋`}
        sub="Dein Überblick über Serien, Posts und Verbrauch."
        actions={<>
          {series.length > 0 && <button onClick={() => setIdeaOpen(true)} className="btn-primary"><Lightbulb className="h-4 w-4" />Eigene Video-Idee</button>}
          <Link to="/app/serien/neu" className={series.length ? 'btn-outline' : 'btn-primary'}><Plus className="h-4 w-4" />Neue Serie</Link>
        </>}
      />
      {ideaOpen && <IdeaDialog allSeries={series} onClose={() => setIdeaOpen(false)} canCreate={usage.remaining > 0} limitText={usage.plan.id === 'free' ? 'Dein Gratis-Video ist aufgebraucht. Wähle einen Plan unter „Konto“.' : 'Dein monatliches Kontingent ist aufgebraucht.'} />}
      {error && <Notice tone="error" className="mb-4">{error}</Notice>}
      {usage.plan.id === 'free' && (
        <Notice tone="info" className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <span>Du nutzt den Gratis-Test: <strong>{usage.remaining} von 1 Video</strong> verfügbar. Gratis-Exporte enthalten ein kleines Wasserzeichen.</span>
          <Link to="/preise" className="btn-dark shrink-0 px-3 py-1.5 text-xs">Pläne ansehen</Link>
        </Notice>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat icon={Film} label={`Videos (${usage.label})`} value={`${usage.used} / ${usage.limit}`}>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-navy-100 dark:bg-navy-800" role="progressbar" aria-valuenow={usage.used} aria-valuemax={usage.limit}>
            <div className="h-full rounded-full bg-accent-500" style={{ width: `${Math.min(100, (usage.used / usage.limit) * 100)}%` }} />
          </div>
        </Stat>
        <Stat icon={Layers} label="Serien" value={series.length} sub={seriesLimit === Infinity ? 'unbegrenzt' : `von max. ${seriesLimit}`} />
        <Stat icon={CalendarClock} label="Geplante Posts" value={upcoming.length} sub={upcoming[0] ? `nächster: ${fmtDateTime(upcoming[0].scheduled_at)}` : 'keine geplant'} />
        <Stat icon={CheckCircle2} label="Gepostet" value={posted.length} sub={`${pending.length} warten auf Freigabe`} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <section className="lg:col-span-2">
          <div className="mb-3 flex items-center justify-between"><h2 className="font-semibold">Deine Serien</h2><Link to="/app/serien" className="text-sm font-medium text-accent-700 dark:text-accent-400">Alle</Link></div>
          {series.length === 0 ? (
            <div className="card flex flex-col items-center p-10 text-center">
              <Layers className="h-8 w-8 text-navy-300" />
              <p className="mt-3 font-medium">Noch keine Serie</p>
              <Link to="/app/onboarding" className="btn-primary mt-4">Erste Serie einrichten</Link>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {series.slice(0, 4).map((s) => {
                const vids = videos.filter((v) => v.series_id === s.id);
                const niche = NICHES.find((n) => n.id === s.niche);
                return (
                  <Link key={s.id} to={`/app/serien/${s.id}`} className="card group p-5 transition hover:border-accent-400">
                    <p className="text-xs muted">{niche?.emoji} {niche?.label}</p>
                    <h3 className="mt-1 font-semibold group-hover:text-accent-700 dark:group-hover:text-accent-400">{s.title}</h3>
                    <p className="mt-3 text-xs muted">{vids.length} Videos · {(s.platforms || []).length} Plattformen · {s.require_approval ? 'mit Freigabe' : 'Auto-Post'}</p>
                  </Link>
                );
              })}
            </div>
          )}

          <h2 className="mb-3 mt-8 font-semibold">Basis-Statistiken</h2>
          <div className="card p-5">
            <div className="grid grid-cols-3 gap-4 text-center">
              {['Aufrufe', 'Likes', 'Follower +'].map((l) => (
                <div key={l}><p className="text-2xl font-bold text-navy-300 dark:text-navy-600">—</p><p className="text-xs muted">{l}</p></div>
              ))}
            </div>
            <p className="mt-4 flex items-center gap-2 text-xs muted"><BarChart3 className="h-4 w-4" />Zahlen erscheinen, sobald eine Plattform verbunden ist und Videos gepostet wurden. Wir zeigen nur echte Daten aus den Plattform-APIs.</p>
          </div>
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between"><h2 className="font-semibold">Als Nächstes</h2><Link to="/app/kalender" className="text-sm font-medium text-accent-700 dark:text-accent-400">Kalender</Link></div>
          <div className="card divide-y divide-navy-100 dark:divide-navy-800">
            {[...pending, ...upcoming].slice(0, 6).map((v) => (
              <Link key={v.id} to={`/app/video/${v.id}`} className="flex items-center justify-between gap-3 p-4 hover:bg-navy-50 dark:hover:bg-navy-800/50">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{v.title}</p>
                  <p className="text-xs muted">{v.scheduled_at ? fmtDateTime(v.scheduled_at) : 'noch nicht geplant'}</p>
                </div>
                <StatusBadge status={v.status} />
              </Link>
            ))}
            {!pending.length && !upcoming.length && (
              <div className="p-6 text-center text-sm muted">
                Nichts geplant.
                {series[0] && <Link to={`/app/serien/${series[0].id}`} className="mt-2 flex items-center justify-center gap-1 font-medium text-accent-700 dark:text-accent-400">Video erstellen <ArrowRight className="h-4 w-4" /></Link>}
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
