import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Plus, Trash2, Film, Save, Wand2, Lightbulb, Download } from 'lucide-react';
import { renderDownloadUrl } from '../../lib/store.js';
import IdeaDialog from '../../components/IdeaDialog.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useAppData } from '../../lib/useAppData.js';
import { PageHeader } from '../../components/AppLayout.jsx';
import { Notice, Spinner, Toggle } from '../../components/ui.jsx';
import { NICHES, ART_STYLES, VOICES, LANGUAGES, VIDEO_LENGTHS } from '../../config/catalog.js';
import { getPlan } from '../../config/plans.js';
import { deleteSeries, saveSeries } from '../../lib/store.js';
import { createVideoForEpisode } from '../../lib/videoFlow.js';
import { computeUsage } from '../../lib/usage.js';
import { fmtDateTime, normalizeSchedule } from '../../lib/schedule.js';
import { SchedulePicker, PlatformPicker, ArtThumb } from '../../components/Pickers.jsx';
import { StatusBadge } from './Dashboard.jsx';
import { translate as tr } from '../../i18n/index.jsx';

export function SeriesList() {
  const { series, videos, loading } = useAppData();
  if (loading) return <Spinner className="h-6 w-6 text-accent-500" />;
  return (
    <>
      <PageHeader title={tr("Serien")} sub={tr("Jede Serie hat eigenen Stil, Stimme und Zeitplan.")} actions={<Link to="/app/serien/neu" className="btn-primary"><Plus className="h-4 w-4" />{tr("Neue Serie")}</Link>} />
      {!series.length && <div className="card p-10 text-center muted">{tr("Noch keine Serien.")} <Link className="font-semibold text-accent-700 dark:text-accent-400" to="/app/serien/neu">{tr("Jetzt eine anlegen")}</Link>.</div>}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {series.map((s) => {
          const niche = NICHES.find((n) => n.id === s.niche);
          const vids = videos.filter((v) => v.series_id === s.id);
          return (
            <Link key={s.id} to={`/app/serien/${s.id}`} className="card flex gap-4 p-4 transition hover:border-accent-400">
              <ArtThumb style={s.art_style} seed={s.title.length * 999} motif={s.episodes?.[0]?.motif || 'city'} className="h-28 w-auto" />
              <div className="min-w-0">
                <p className="text-xs muted">{niche?.emoji} {tr(niche?.label)}</p>
                <h3 className="font-semibold">{s.title}</h3>
                <p className="mt-1 line-clamp-2 text-xs muted">{s.description}</p>
                <p className="mt-2 text-xs muted">{tr('{v} Videos · {e} Folgen geplant', { v: vids.length, e: s.episodes?.length || 0 })}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}

export function SeriesDetail() {
  const { id } = useParams();
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const { series: all, videos: allVideos, loading, reload } = useAppData();
  const series = all.find((s) => s.id === id);
  const [draft, setDraft] = useState(null);
  const [busy, setBusy] = useState(null);
  const [msg, setMsg] = useState(null);
  const [ideaOpen, setIdeaOpen] = useState(() => new URLSearchParams(window.location.search).has('idee'));
  useEffect(() => { if (series) setDraft({ ...series, schedule: normalizeSchedule(series.schedule) }); }, [series]);

  if (loading) return <Spinner className="h-6 w-6 text-accent-500" />;
  if (!series || !draft) return <Notice tone="error">{tr("Serie nicht gefunden.")}</Notice>;
  const videos = allVideos.filter((v) => v.series_id === id);
  const usage = computeUsage(profile, allVideos);
  const plan = getPlan(profile?.plan);
  const niche = NICHES.find((n) => n.id === series.niche);

  const create = async (ep) => {
    if (usage.remaining <= 0) return setMsg({ tone: 'warn', text: usage.plan.id === 'free' ? tr("Dein Gratis-Video ist aufgebraucht. Wähle einen Plan unter „Konto“.") : tr("Dein monatliches Kontingent ist aufgebraucht.") });
    setBusy(ep.key); setMsg(null);
    try {
      const v = await createVideoForEpisode(user, series, ep);
      navigate(`/app/video/${v.id}`);
    } catch (e) { setMsg({ tone: 'error', text: e.message }); setBusy(null); }
  };

  const save = async () => {
    setBusy('save');
    try { await saveSeries(draft); await reload(); setMsg({ tone: 'success', text: tr("Einstellungen gespeichert.") }); } catch (e) { setMsg({ tone: 'error', text: e.message }); }
    setBusy(null);
  };

  const remove = async () => {
    if (!confirm(`Serie „${series.title}“ inkl. aller Videos löschen?`)) return;
    await deleteSeries(series.id);
    navigate('/app/serien');
  };

  const set = (patch) => setDraft((d) => ({ ...d, ...patch }));

  return (
    <>
      <PageHeader title={series.title} sub={`${niche?.emoji} ${tr(niche?.label)} · ${series.description || ''}`} actions={<>
        <button onClick={() => setIdeaOpen(true)} className="btn-primary"><Lightbulb className="h-4 w-4" />{tr("Eigene Idee / eigener Text")}</button>
        <button onClick={remove} className="btn-danger"><Trash2 className="h-4 w-4" />{tr("Löschen")}</button>
      </>} />
      {ideaOpen && <IdeaDialog series={series} onClose={() => setIdeaOpen(false)} canCreate={usage.remaining > 0} limitText={usage.plan.id === 'free' ? tr("Dein Gratis-Video ist aufgebraucht. Wähle einen Plan unter „Konto“.") : tr("Dein monatliches Kontingent ist aufgebraucht.")} />}
      {msg && <Notice tone={msg.tone} className="mb-4">{msg.text}</Notice>}
      <div className="grid gap-6 lg:grid-cols-3">
        <section className="space-y-6 lg:col-span-2">
          <div className="card">
            <h2 className="border-b border-navy-100 p-4 font-semibold dark:border-navy-800">{tr("Folgen")}</h2>
            <ul className="divide-y divide-navy-100 dark:divide-navy-800">
              {(series.episodes || []).map((ep, i) => {
                const vid = videos.find((v) => v.episode_key === ep.key);
                return (
                  <li key={ep.key} className="flex items-center justify-between gap-3 p-4">
                    <div className="min-w-0">
                      <p className="text-xs muted">{tr('Folge {n}', { n: i + 1 })}</p>
                      <p className="truncate font-medium">{ep.title}</p>
                    </div>
                    {vid ? (
                      <Link to={`/app/video/${vid.id}`} className="flex items-center gap-2"><StatusBadge status={vid.status} /><span className="text-sm font-medium text-accent-700 dark:text-accent-400">{tr("Öffnen")}</span></Link>
                    ) : (
                      <button className="btn-outline shrink-0 px-3 py-1.5 text-xs" disabled={!!busy} onClick={() => create(ep)}>
                        {busy === ep.key ? <Spinner /> : <Wand2 className="h-3.5 w-3.5" />}{tr("Video erstellen")}
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="card">
            <h2 className="border-b border-navy-100 p-4 font-semibold dark:border-navy-800">{tr("Videos")}</h2>
            {!videos.length && <p className="p-4 text-sm muted">{tr("Noch keine Videos.")}</p>}
            <ul className="divide-y divide-navy-100 dark:divide-navy-800">
              {videos.map((v) => (
                <li key={v.id} className="flex items-center gap-1 pr-2 hover:bg-navy-50 dark:hover:bg-navy-800/40"><Link to={`/app/video/${v.id}`} className="flex min-w-0 flex-1 items-center justify-between gap-3 p-4">
                  <span className="flex min-w-0 items-center gap-2"><Film className="h-4 w-4 shrink-0 muted" /><span className="truncate text-sm font-medium">{v.title}</span></span>
                  <span className="flex shrink-0 items-center gap-2 text-xs muted">{v.scheduled_at && fmtDateTime(v.scheduled_at)}<StatusBadge status={v.status} /></span>
                </Link>
                {v.video_path && <DownloadButton video={v} />}</li>
              ))}
            </ul>
          </div>
        </section>

        <aside className="card space-y-5 p-5">
          <h2 className="font-semibold">{tr("Einstellungen")}</h2>
          <div><label className="label" htmlFor="s-title">{tr("Titel")}</label><input id="s-title" className="input" value={draft.title} onChange={(e) => set({ title: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label" htmlFor="s-style">{tr("Stil")}</label><select id="s-style" className="input" value={draft.art_style} onChange={(e) => set({ art_style: e.target.value })}>{ART_STYLES.map((s) => <option key={s.id} value={s.id}>{tr(s.label)}</option>)}</select></div>
            <div><label className="label" htmlFor="s-voice">{tr("Stimme")}</label><select id="s-voice" className="input" value={draft.voice_id} onChange={(e) => set({ voice_id: e.target.value })}>{VOICES.map((s) => <option key={s.id} value={s.id}>{tr(s.label)}</option>)}</select></div>
          </div>
          <div><label className="label" htmlFor="s-lang">{tr("Sprache")}</label><select id="s-lang" className="input" value={draft.language} onChange={(e) => set({ language: e.target.value })}>{LANGUAGES.map((s) => <option key={s.id} value={s.id}>{tr(s.label)}</option>)}</select></div>
          <div><label className="label" htmlFor="s-len">{tr("Videolänge")}</label><select id="s-len" className="input" value={draft.target_seconds || 65} onChange={(e) => set({ target_seconds: +e.target.value })}>{VIDEO_LENGTHS.map((l) => <option key={l.seconds} value={l.seconds}>{tr(l.label)} – {tr(l.desc)}</option>)}</select></div>
          <div><p className="label">{tr("Zeitplan")}</p><SchedulePicker schedule={draft.schedule} onChange={(schedule) => set({ schedule })} /></div>
          <div><p className="label">{tr("Plattformen")}</p><PlatformPicker value={draft.platforms} onChange={(platforms) => set({ platforms })} max={Math.max(1, plan.limits.platforms)} /></div>
          <Toggle id="s-approval" checked={draft.require_approval} onChange={(require_approval) => set({ require_approval })} label={tr("Freigabe vor dem Posten")} />
          <button className="btn-primary w-full" onClick={save} disabled={!!busy}>{busy === 'save' ? <Spinner /> : <Save className="h-4 w-4" />}{tr("Speichern")}</button>
          <p className="text-xs muted">{tr("Stil, Stimme und Sprache gelten für neu erstellte Videos.")}</p>
        </aside>
      </div>
    </>
  );
}

function DownloadButton({ video }) {
  const [busy, setBusy] = useState(false);
  const go = async () => {
    setBusy(true);
    try {
      const name = `${(video.title || 'truereel').replace(/[^\w\-äöüÄÖÜ ]+/g, '').trim() || 'truereel'}.mp4`;
      const url = await renderDownloadUrl(video.video_path, name);
      const a = document.createElement('a');
      a.href = url; a.download = name; a.rel = 'noopener';
      document.body.appendChild(a); a.click(); a.remove();
    } catch (e) { alert(`${tr('Download fehlgeschlagen:')} ${e.message}`); }
    setBusy(false);
  };
  return (
    <button type="button" className="btn-icon h-10 w-10 shrink-0" onClick={go} disabled={busy} aria-label={tr('Video herunterladen (MP4)')} title={tr('Video herunterladen (MP4)')}>
      {busy ? <Spinner /> : <Download className="h-5 w-5" />}
    </button>
  );
}
