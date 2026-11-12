import { translateServerError } from '../../i18n/serverErrors.js';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowDown, ArrowUp, GripVertical, ImagePlus, Mic, Plus, RefreshCw, Trash2, CalendarCheck, CheckCircle2,
  Upload, Download, Undo2, ArrowLeft, PenSquare, Film, Eye, Play, Captions, Music, Info, Send, Layers, ChevronDown,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { getVideo, getSeries, saveVideo, deleteVideo, listVideos, uid, uploadMedia, uploadRender, renderDownloadUrl } from '../../lib/store.js';
import { VOICES, CAPTION_FONTS, CAPTION_STYLES, MUSIC_TRACKS, MONETIZATION_MIN_SECONDS } from '../../config/catalog.js';
import { getPlan } from '../../config/plans.js';
import Player from '../../video/Player.jsx';
import { newSeed, timeline, scriptToProject } from '../../video/project.js';
import { fillImages, generateImage, regenerateScript } from '../../video/generate.js';
import { synthesize, speak, stopSpeaking } from '../../video/tts.js';
import { recordVideo, toMp4, download } from '../../video/exporter.js';
import { CaptionStylePicker, MusicPicker, ArtStylePicker, VoicePicker, ArtThumb } from '../../components/Pickers.jsx';
import { Notice, Spinner, Toggle } from '../../components/ui.jsx';
import { StatusBadge } from './Dashboard.jsx';
import { nextFreeSlot, fmtDateTime } from '../../lib/schedule.js';
import { fillVoice } from '../../lib/videoFlow.js';
import { api, apiAvailable } from '../../lib/api.js';
import { translate as tr } from '../../i18n/index.jsx';

const TABS = [
  ['scenes', 'Szenen'],
  ['style', 'Stil'],
  ['voice', 'Stimme'],
  ['captions', 'Untertitel'],
  ['music', 'Musik'],
  ['publish', 'Export & Posten'],
];

export default function Editor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const plan = getPlan(profile?.plan);
  const [video, setVideo] = useState(null);
  const [series, setSeries] = useState(null);
  const [tab, setTab] = useState('scenes');
  const [selected, setSelected] = useState(null);
  const [seekReq, setSeekReq] = useState(null);
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(null);
  const [progress, setProgress] = useState(0);
  const [saved, setSaved] = useState(true);
  const [health, setHealth] = useState(null);
  const dragFrom = useRef(null);
  const saveTimer = useRef(null);
  const abortRef = useRef(null);

  useEffect(() => {
    (async () => {
      const v = await getVideo(id);
      if (!v) return setMsg({ tone: 'error', text: tr("Video nicht gefunden.") });
      setVideo(v);
      if (v.series_id) setSeries(await getSeries(v.series_id));
    })();
    apiAvailable().then(setHealth);
    return () => { stopSpeaking(); clearTimeout(saveTimer.current); };
  }, [id]);

  const persist = useCallback((next) => {
    setSaved(false);
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      try { await saveVideo(next); setSaved(true); } catch (e) { setMsg({ tone: 'error', text: `${tr('Speichern fehlgeschlagen:')} ${e.message}` }); }
    }, 700);
  }, []);

  const update = (patch) => setVideo((v) => { const next = { ...v, ...patch }; persist(next); return next; });
  const updateProject = (patch) => setVideo((v) => {
    const next = { ...v, project: { ...v.project, ...patch } };
    // Inhaltliche Änderungen nach Export → wieder Entwurf (erneute Freigabe nötig)
    if (['ready', 'pending_approval', 'scheduled'].includes(next.status)) next.status = 'draft';
    persist(next);
    return next;
  });
  const updateScene = (sid, patch) => updateProject({ scenes: video.project.scenes.map((s) => (s.id === sid ? { ...s, ...patch } : s)) });

  if (msg?.tone === 'error' && !video) return <Notice tone="error">{msg.text}</Notice>;
  if (!video) return <Spinner className="h-6 w-6 text-accent-500" />;
  const project = video.project;
  const scenes = project.scenes;
  const tl = timeline(project);

  const move = (from, to) => {
    if (to < 0 || to >= scenes.length || from === to) return;
    const next = [...scenes];
    const [s] = next.splice(from, 1);
    next.splice(to, 0, s);
    updateProject({ scenes: next });
  };

  const regenImage = async (scene) => {
    setBusy(`img-${scene.id}`);
    const seed = newSeed();
    const r = await generateImage({ prompt: scene.visual || scene.text, style: project.artStyle, seed, userId: user.id, niche: project.niche || series?.niche, archiveQuery: project.archiveQuery, exclude: scenes.map((x) => x.credit?.url).filter(Boolean) });
    updateScene(scene.id, { seed, imageUrl: r.imageUrl || null, credit: r.credit || null });
    if (!r.imageUrl) setMsg({ tone: 'info', text: tr("Kein Bild gefunden bzw. kein Bild-Modul verbunden – neue Platzhalter-Grafik erzeugt. Tipp: Bildbeschreibung (englisch) anpassen.") });
    setBusy(null);
  };

  const regenAllImages = async () => {
    setBusy('images'); setMsg(null);
    const reseeded = { ...project, niche: project.niche || series?.niche, scenes: scenes.map((s) => ({ ...s, seed: newSeed() })) };
    const next = (await fillImages(reseeded, user.id)).project.scenes.map((s) => (s.imageUrl ? s : { ...s, imageUrl: null, credit: null }));
    updateProject({ scenes: next });
    if (!next.some((s) => s.imageUrl)) setMsg({ tone: 'info', text: tr("Kein Bildmodell verbunden – Platzhalter-Grafiken wurden neu gemischt.") });
    setBusy(null);
  };

  const genVoice = async () => {
    setBusy('voice'); setMsg(null);
    const next = [];
    let any = false;
    for (const s of scenes) {
      const r = await synthesize(s.text, { lang: project.language, voiceId: s.voiceId || project.voiceId });
      if (r) any = true;
      next.push(r ? { ...s, audioUrl: await uploadMedia(user.id, r.audioUrl, 'audio'), audioDuration: r.duration } : s);
    }
    updateProject({ scenes: next });
    setMsg(any
      ? { tone: 'success', text: tr("KI-Voiceover erzeugt. Szenenlängen wurden an die Sprechdauer angepasst.") }
      : { tone: 'info', text: tr("Kein TTS-Anbieter verbunden (TTS_PROVIDER). Die Vorschau nutzt die Browser-Stimme; der Export enthält dann nur Musik und Untertitel.") });
    setBusy(null);
  };

  const rewrite = async () => {
    if (!confirm(tr("Skript neu schreiben? Deine Textänderungen gehen verloren."))) return;
    setBusy('script');
    try {
      const script = await regenerateScript({ niche: series?.niche, topic: series?.topic, language: project.language, seriesTitle: series?.title, episodeKey: video.episode_key, episodeTitle: video.title, targetSeconds: series?.target_seconds || 65 });
      const p = scriptToProject(script, project);
      updateProject({ scenes: p.scenes, title: p.title, notice: p.notice, archiveQuery: p.archiveQuery });
    } catch (e) { setMsg({ tone: 'error', text: e.message }); }
    setBusy(null);
  };

  const addScene = () => updateProject({ scenes: [...scenes.slice(0, -1), { id: uid(), role: 'story', text: tr("Neuer Text …"), visual: '', seed: newSeed(), imageUrl: null, audioUrl: null, voiceId: null }, scenes.at(-1)] });

  const downloadSaved = async () => {
    setBusy('download'); setMsg(null);
    try {
      const name = `${(video.title || 'truereel').replace(/[^\w\-äöüÄÖÜ ]+/g, '').trim() || 'truereel'}.mp4`;
      const url = await renderDownloadUrl(video.video_path, name);
      const a = document.createElement('a');
      a.href = url; a.download = name; a.rel = 'noopener';
      document.body.appendChild(a); a.click(); a.remove();
    } catch (e) { setMsg({ tone: 'error', text: `${tr('Download fehlgeschlagen:')} ${e.message}` }); }
    setBusy(null);
  };

  const exportVideo = async () => {
    setBusy('export'); setProgress(0); setMsg(null);
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    try {
      let exportProject = project;
      if (health?.providers?.tts && health.providers.tts !== 'mock' && project.scenes.some((s) => !s.audioUrl)) {
        setBusy('voice');
        exportProject = await fillVoice(project, user.id);
        updateProject({ scenes: exportProject.scenes });
        setBusy('export');
      }
      const { blob, hasVoice } = await recordVideo(exportProject, { watermark: plan.id === 'free', onProgress: setProgress, signal: ctrl.signal });
      let file = blob, ext = blob.type.includes('mp4') ? 'mp4' : 'webm', note = '';
      if (health?.render === 'ffmpeg') {
        setBusy('transcode');
        try { file = await toMp4(blob); ext = 'mp4'; } catch (e) { note = ` ${tr('MP4-Umwandlung nicht möglich ({e}) – Datei als {x} gespeichert.', { e: e.message, x: ext.toUpperCase() })}`; }
      } else if (ext !== 'mp4') note = tr(" Server-Rendering (FFmpeg) nicht erreichbar – Datei als WebM gespeichert.");
      const nextStatus = video.status === 'draft' ? (series && !series.require_approval ? 'scheduled' : 'pending_approval') : video.status;
      const patch = { status: nextStatus };
      if (ext === 'mp4') {
        try { const path = await uploadRender(user.id, video.id, file); if (path) patch.video_path = path; }
        catch (e) { note += ` ${e.message}`; }
      }
      if (nextStatus === 'scheduled' && !video.scheduled_at) {
        const slot = nextFreeSlot(series, await listVideos(user.id));
        patch.scheduled_at = slot?.toISOString() || null;
      }
      // Sofort speichern (nicht verzögert), bevor der Download startet
      clearTimeout(saveTimer.current);
      const savedVideo = { ...video, ...patch };
      setVideo((v) => ({ ...v, ...patch }));
      try { await saveVideo(savedVideo); setSaved(true); } catch (e) { note += ` ${tr('Speichern fehlgeschlagen:')} ${e.message}`; }
      // Erst nach dem Speichern herunterladen: auf dem iPhone verlässt der Download die Seite
      download(file, `${(video.title || 'truereel').replace(/[^\w\-äöüÄÖÜ ]+/g, '').trim() || 'truereel'}.${ext}`);
      setMsg({ tone: 'success', text: `${tr("Export fertig (1080×1920).")}${hasVoice ? '' : tr(" Hinweis: ohne Voiceover, da kein TTS-Anbieter verbunden ist.")}${plan.id === 'free' ? tr(" Gratis-Export mit Wasserzeichen.") : ''}${note}` });
    } catch (e) {
      setMsg({ tone: 'error', text: e.message });
    }
    setBusy(null);
  };

  const approve = async () => {
    const slot = series ? nextFreeSlot(series, await listVideos(user.id)) : null;
    update({ status: 'scheduled', scheduled_at: video.scheduled_at || slot?.toISOString() || null });
    setMsg({ tone: 'success', text: slot ? tr('Freigegeben und geplant für {d}.', { d: fmtDateTime(video.scheduled_at || slot) }) : tr('Freigegeben.') });
  };

  const publishNow = async () => {
    setBusy('publish'); setMsg(null);
    try {
      const r = await api(`/videos/${video.id}/publish`, { method: 'POST' });
      const fresh = await getVideo(video.id);
      setVideo(fresh);
      const lines = Object.entries(r.results || {}).map(([pl, x]) => (x.id ? `${pl}: ✓ ${x.url}${x.privacy === 'private' ? tr(" (privat – in YouTube auf „öffentlich“ stellen)") : ''}` : `${pl}: ✗ ${translateServerError(x.error)}`));
      setMsg({ tone: r.ok ? 'success' : 'error', text: lines.join(' · ') || tr("Nichts zu posten.") });
    } catch (e) { setMsg({ tone: 'error', text: e.message }); }
    setBusy(null);
  };

  const remove = async () => {
    if (!confirm(tr("Video löschen? Das verbrauchte Kontingent wird dadurch nicht zurückgesetzt."))) return;
    await deleteVideo(video.id);
    navigate(series ? `/app/serien/${series.id}` : '/app');
  };

  const onMusicUpload = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 2 * 1024 * 1024) {
      updateProject({ music: { ...project.music, customUrl: URL.createObjectURL(f), customName: f.name } });
      setMsg({ tone: 'info', text: tr("Grosse Datei: im Prototyp nur für diese Sitzung geladen. In Produktion wird sie in Supabase Storage gespeichert.") });
      return;
    }
    const r = new FileReader();
    r.onload = () => updateProject({ music: { ...project.music, customUrl: r.result, customName: f.name } });
    r.readAsDataURL(f);
  };

  const fmtDur = (sec) => `${Math.floor(sec / 60)}:${String(Math.round(sec % 60)).padStart(2, '0')}`;
  const sceneLabel = (sc, i) => (sc.role === 'hook' ? 'Hook' : sc.role === 'cta' ? 'Call-to-Action' : tr('Szene {n}', { n: i }));
  const selIdx = Math.max(0, scenes.findIndex((x) => x.id === selected));
  const sel = scenes[selIdx];
  const jump = (i, play = true) => { setSelected(scenes[i].id); setSeekReq({ time: tl.items[i]?.start || 0, play, nonce: Date.now() }); };
  const settingsTabs = TABS.filter(([k]) => k !== 'scenes' && k !== 'publish');

  return (
    <div>
      {/* Kopfzeile */}
      <div className="mb-5 flex flex-col gap-3 xl:flex-row xl:items-center">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <Link to={series ? `/app/serien/${series.id}` : '/app'} className="btn-icon h-10 w-10 shrink-0" aria-label={tr("Zurück")}><ArrowLeft className="h-5 w-5" /></Link>
          <input className="min-w-0 flex-1 rounded-lg bg-transparent text-xl font-extrabold tracking-tight focus:bg-white focus:px-2 dark:focus:bg-navy-900 sm:text-3xl" value={video.title} onChange={(e) => update({ title: e.target.value })} aria-label={tr("Titel")} />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {series && <Link to={`/app/serien/${series.id}`} className="flex items-center gap-2 rounded-xl border border-navy-200 px-3 py-2 text-sm font-medium dark:border-navy-600 sm:px-4 sm:text-[15px]"><Layers className="h-4 w-4" /><span className="max-w-[12rem] truncate">{series.title}</span></Link>}
          <span className="flex items-center gap-2 rounded-xl bg-navy-100 px-3 py-2 text-sm dark:bg-navy-900"><span className={`h-2 w-2 rounded-full ${saved ? 'bg-accent-600 dark:bg-accent-500' : 'animate-pulse bg-amber-500'}`} />{saved ? tr('Gespeichert') : tr("Speichert …")}</span>
          <StatusBadge status={video.status} />
          <button className="btn-icon ml-auto h-10 w-10 rounded-xl border border-navy-200 dark:border-navy-600" onClick={remove} aria-label={tr("Video löschen")} title={tr("Video löschen")}><Trash2 className="h-4 w-4" /></button>
        </div>
      </div>

      {project.notice && <Notice tone="warn" className="mb-4">{project.notice}</Notice>}
      {(series?.target_seconds || 65) >= MONETIZATION_MIN_SECONDS && tl.total < MONETIZATION_MIN_SECONDS && (
        <Notice tone="warn" className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <span>{tr('Dieses Video dauert ca. {s} s. Für die TikTok-Monetarisierung muss es über 60 s lang sein.', { s: Math.round(tl.total) })}{scenes.some((x) => !x.audioUrl) ? tr(" (Die genaue Länge steht nach dem Voiceover fest.)") : ''}</span>
          <span className="flex shrink-0 gap-2">
            <button className="btn-outline px-3 py-1.5 text-xs" onClick={addScene}>{tr("Szene hinzufügen")}</button>
            <button className="btn-primary px-3 py-1.5 text-xs" onClick={rewrite} disabled={!!busy}>{tr("Skript neu (länger)")}</button>
          </span>
        </Notice>
      )}
      {msg && <Notice tone={msg.tone} className="mb-4">{msg.text}</Notice>}

      <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-[1fr_1fr_400px]">
        {/* ── Skript ── */}
        <section className="card flex flex-col p-5">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-extrabold"><PenSquare className="h-5 w-5" />{tr("Skript")}</h2>
          <div className="flex-1 space-y-4">
            {scenes.map((sc, i) => (
              <div key={sc.id}>
                <label className="mb-1.5 block font-bold" htmlFor={`txt-${sc.id}`}>{sceneLabel(sc, i)}</label>
                <textarea id={`txt-${sc.id}`} className={`input min-h-[84px] resize-y text-[15px] leading-relaxed ${sc.id === sel?.id ? 'border-accent-500 dark:border-accent-500' : ''}`}
                  value={sc.text} onFocus={() => setSelected(sc.id)}
                  onChange={(e) => updateScene(sc.id, { text: e.target.value, audioUrl: null, audioDuration: null })} />
              </div>
            ))}
          </div>
          <div className="mt-5 grid gap-2 sm:grid-cols-[1fr_auto]">
            <button className="btn-primary py-3 text-base" onClick={rewrite} disabled={!!busy}>{busy === 'script' ? <Spinner /> : <RefreshCw className="h-5 w-5" />}{tr("Skript neu generieren")}</button>
            <button className="btn-outline py-3" onClick={addScene}><Plus className="h-5 w-5" />{tr("Szene")}</button>
          </div>
        </section>

        {/* ── Szenenliste ── */}
        <section className="card flex flex-col p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-xl font-extrabold"><Film className="h-5 w-5" />{tr("Szenenliste")}</h2>
            <button className="btn-icon" onClick={regenAllImages} disabled={!!busy} title={tr("Alle Bilder neu")} aria-label={tr("Alle Bilder neu")}>{busy === 'images' ? <Spinner /> : <ImagePlus className="h-5 w-5" />}</button>
          </div>
          <ul className="flex-1 space-y-3">
            {scenes.map((sc, i) => {
              const active = sc.id === sel?.id;
              return (
                <li key={sc.id} draggable onDragStart={() => { dragFrom.current = i; }} onDragOver={(e) => e.preventDefault()} onDrop={() => { move(dragFrom.current, i); dragFrom.current = null; }}
                  className={`rounded-2xl border-2 p-3 transition ${active ? 'border-accent-500 bg-accent-50/40 dark:bg-navy-800/60' : 'border-transparent bg-navy-50 dark:bg-navy-800/50'}`}>
                  <div className="flex items-center gap-3">
                    <GripVertical className="h-5 w-5 shrink-0 cursor-grab muted" aria-hidden="true" />
                    <button className="h-16 w-24 shrink-0 overflow-hidden rounded-xl bg-navy-800" onClick={() => jump(i, false)} aria-label={sceneLabel(sc, i)}>
                      {sc.imageUrl ? <img src={sc.imageUrl} alt="" className="h-full w-full object-cover" /> : <ArtThumb style={project.artStyle} seed={sc.seed} motif={project.motif} className="h-full w-full object-cover" />}
                    </button>
                    <button className="min-w-0 flex-1 text-left" onClick={() => jump(i, false)}>
                      <p className="truncate font-bold">{sceneLabel(sc, i)}</p>
                      <p className="text-sm muted tabular-nums">{fmtDur(tl.items[i]?.duration || 0)}{sc.audioUrl ? ' · 🎙️' : ''}</p>
                    </button>
                    <button className="btn-icon h-10 w-10" onClick={() => jump(i, true)} aria-label={tr("Ab hier abspielen")}><Play className="h-5 w-5 fill-current" /></button>
                  </div>
                  {active && (
                    <div className="mt-3 space-y-2 border-t border-navy-100 pt-3 dark:border-navy-700">
                      <input className="input py-2 text-xs" value={sc.visual || ''} placeholder={tr("Bildbeschreibung (englisch, für die Bildsuche)")} onChange={(e) => updateScene(sc.id, { visual: e.target.value })} aria-label={tr("Bildbeschreibung")} />
                      <div className="flex flex-wrap items-center gap-1.5">
                        <select className="input w-auto flex-1 py-2 text-xs" value={sc.voiceId || ''} onChange={(e) => updateScene(sc.id, { voiceId: e.target.value || null, audioUrl: null, audioDuration: null })} aria-label={tr("Stimme dieser Szene")}>
                          <option value="">{tr("Stimme: Standard")}</option>
                          {VOICES.map((v) => <option key={v.id} value={v.id}>{tr(v.label)}</option>)}
                        </select>
                        <button className="btn-outline px-2.5 py-2 text-xs" onClick={() => regenImage(sc)} disabled={!!busy}>{busy === `img-${sc.id}` ? <Spinner className="h-3.5 w-3.5" /> : <RefreshCw className="h-3.5 w-3.5" />}{tr("Bild")}</button>
                        <button className="btn-icon" onClick={() => move(i, i - 1)} disabled={i === 0} aria-label={tr("Nach oben")}><ArrowUp className="h-4 w-4" /></button>
                        <button className="btn-icon" onClick={() => move(i, i + 1)} disabled={i === scenes.length - 1} aria-label={tr("Nach unten")}><ArrowDown className="h-4 w-4" /></button>
                        <button className="btn-icon text-red-600" onClick={() => updateProject({ scenes: scenes.filter((x) => x.id !== sc.id) })} disabled={scenes.length <= 1} aria-label={tr("Szene löschen")}><Trash2 className="h-4 w-4" /></button>
                      </div>
                      {sc.credit && <p className="text-xs muted">{tr("Bild:")} <a href={sc.credit.url} target="_blank" rel="noreferrer" className="underline">{sc.credit.author} / {sc.credit.source}{sc.credit.license ? ` (${sc.credit.license})` : ''}</a></p>}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
          <p className="mt-4 flex items-center gap-2 text-sm muted"><Info className="h-4 w-4" />{tr('Szenen per Drag & Drop umsortieren · Gesamt {d}', { d: fmtDur(tl.total) })}</p>
        </section>

        {/* ── Vorschau ── */}
        <section className="card order-first p-5 lg:order-last lg:col-span-2 xl:order-none xl:col-span-1">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-extrabold"><Eye className="h-5 w-5" />{tr("Vorschau")}</h2>
          <div className="xl:sticky xl:top-20">
            <Player framed project={project} watermark={plan.id === 'free'} seekRequest={seekReq} />
            <div className="mt-5 space-y-3">
              <div className="grid grid-cols-[1fr_auto] gap-2">
                <label className="input flex items-center gap-2 py-0 pr-1"><Mic className="h-5 w-5 shrink-0" />
                  <select className="w-full bg-transparent py-3 text-[15px] focus:outline-none" value={project.voiceId} onChange={(e) => updateProject({ voiceId: e.target.value, scenes: scenes.map((x) => ({ ...x, audioUrl: x.voiceId ? x.audioUrl : null, audioDuration: x.voiceId ? x.audioDuration : null })) })} aria-label={tr("Stimme")}>
                    {VOICES.map((v) => <option key={v.id} value={v.id}>{tr('Stimme')}: {tr(v.label)}</option>)}
                  </select>
                </label>
                <button className="btn-outline px-4" onClick={() => speak(sel?.text || scenes[0].text, { lang: project.language, voiceId: sel?.voiceId || project.voiceId })}><Play className="h-4 w-4 fill-current" />{tr("Vorhören")}</button>
              </div>
              <label className="input flex items-center gap-2 py-0 pr-1"><Captions className="h-5 w-5 shrink-0" />
                <select className="w-full bg-transparent py-3 text-[15px] focus:outline-none" value={project.captions.style} onChange={(e) => updateProject({ captions: { ...project.captions, style: e.target.value } })} aria-label={tr("Untertitel-Stil")}>
                  {CAPTION_STYLES.map((c) => <option key={c.id} value={c.id}>Untertitel: {tr(c.label)}</option>)}
                </select>
              </label>
              <label className="input flex items-center gap-2 py-0 pr-1"><Music className="h-5 w-5 shrink-0" />
                <select className="w-full bg-transparent py-3 text-[15px] focus:outline-none" value={project.music.customUrl ? 'custom' : project.music.trackId} onChange={(e) => e.target.value !== 'custom' && updateProject({ music: { ...project.music, trackId: e.target.value, customUrl: null, customName: null } })} aria-label={tr("Musik")}>
                  {MUSIC_TRACKS.map((m) => <option key={m.id} value={m.id}>Musik: {tr(m.label)}</option>)}
                  {project.music.customUrl && <option value="custom">{tr('Musik')}: {project.music.customName || tr('eigene')}</option>}
                </select>
              </label>
              <button className="btn-primary w-full py-3.5 text-base" onClick={exportVideo} disabled={!!busy}>{['export', 'transcode', 'voice'].includes(busy) ? <Spinner /> : <Upload className="h-5 w-5" />}{tr("Exportieren 1080p")}</button>
              {video.video_path && (
                <button className="btn-outline w-full py-3 text-base" onClick={downloadSaved} disabled={!!busy}>
                  {busy === 'download' ? <Spinner /> : <Download className="h-5 w-5" />}{tr('Video herunterladen (MP4)')}
                </button>
              )}
              {busy === 'voice' && <p className="flex items-center gap-2 text-sm"><Spinner />{tr("Voiceover wird erzeugt …")}</p>}
              {(busy === 'export' || busy === 'transcode') && (
                <div>
                  <div className="h-2 overflow-hidden rounded-full bg-navy-100 dark:bg-navy-800"><div className="h-full bg-accent-500 transition-all" style={{ width: `${busy === 'transcode' ? 100 : progress * 100}%` }} /></div>
                  <p className="mt-1 flex justify-between text-xs muted"><span>{busy === 'transcode' ? tr("Wird in MP4 umgewandelt …") : `${Math.round(progress * 100)} % · Tab bitte offen lassen`}</span>{busy === 'export' && <button className="underline" onClick={() => abortRef.current?.abort()}>{tr("Abbrechen")}</button>}</p>
                </div>
              )}
              <p className="text-center text-xs muted">MP4 · 1080×1920 {plan.id === 'free' ? tr("· Gratis-Test mit Wasserzeichen") : tr("· ohne Wasserzeichen")}</p>
            </div>
          </div>
        </section>
      </div>

      {/* ── Freigeben & Posten ── */}
      <section className="card mt-5 p-5">
        <h2 className="text-xl font-extrabold">{tr("Freigeben & posten")}</h2>
        {video.status === 'scheduled' ? (
          <>
            <p className="mt-2 flex items-center gap-2 text-sm"><CalendarCheck className="h-4 w-4 text-accent-700 dark:text-accent-500" />{tr("Geplant für")} <strong>{video.scheduled_at ? fmtDateTime(video.scheduled_at) : '—'}</strong> auf {(video.platforms || []).join(', ') || tr("keiner Plattform")}</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto] lg:max-w-xl">
              <input type="datetime-local" className="input" aria-label={tr("Zeitpunkt ändern")}
                value={video.scheduled_at ? new Date(new Date(video.scheduled_at).getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16) : ''}
                onChange={(e) => update({ scheduled_at: e.target.value ? new Date(e.target.value).toISOString() : null })} />
              <button className="btn-outline" onClick={() => update({ status: 'pending_approval' })}><Undo2 className="h-4 w-4" />{tr("Zurückziehen")}</button>
            </div>
          </>
        ) : video.status === 'posted' ? (
          <p className="mt-2 flex items-center gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-accent-700 dark:text-accent-500" />{tr("Gepostet.")}</p>
        ) : (
          <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm muted">{video.status === 'draft' ? tr("Zuerst exportieren – so prüfst du das fertige Video vor dem Posten.") : series?.require_approval ? tr("Nichts geht ohne deine Freigabe live. Nach der Freigabe wird im nächsten freien Slot gepostet.") : tr("Auto-Post ist aktiv: Das Video wird automatisch eingeplant.")}</p>
            <button className="btn-primary shrink-0" onClick={approve} disabled={video.status === 'draft' || !!busy}><CheckCircle2 className="h-4 w-4" />{tr("Freigeben & einplanen")}</button>
          </div>
        )}
        {video.video_path && (video.platforms || []).length > 0 && video.status !== 'posted' && (
          <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-navy-100 pt-4 dark:border-navy-800">
            <button className="btn-outline" onClick={publishNow} disabled={!!busy}>{busy === 'publish' ? <Spinner /> : <Send className="h-4 w-4" />}{tr("Jetzt posten")}</button>
            <p className="text-xs muted">{tr('Postet sofort auf {p} statt zum geplanten Zeitpunkt.', { p: (video.platforms || []).join(', ') })}</p>
          </div>
        )}
        {video.post_results && Object.entries(video.post_results).map(([pl, x]) => (
          <p key={pl} className="mt-2 text-xs">{pl}: {x.url ? <a className="underline" href={x.url} target="_blank" rel="noreferrer">{x.url}</a> : <span className="text-red-600">{translateServerError(x.error)}</span>}</p>
        ))}
        {!(video.platforms || []).length && <p className="mt-3 text-xs muted">{tr("Keine Plattform gewählt – Plattformen wählst du in den Serien-Einstellungen, verbinden unter")} <Link className="underline" to="/app/account">{tr("Konto")}</Link>.</p>}
      </section>

      {/* ── Weitere Einstellungen ── */}
      <details className="card group mt-5 p-5" open={tab !== 'scenes'}>
        <summary className="flex cursor-pointer list-none items-center justify-between text-xl font-extrabold">{tr("Weitere Einstellungen")}<ChevronDown className="h-5 w-5 transition group-open:rotate-180" /></summary>
        <div className="mt-4 flex gap-1 overflow-x-auto" role="tablist">
          {settingsTabs.map(([k, l]) => (
            <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className={`shrink-0 rounded-xl px-4 py-2 text-sm font-semibold ${tab === k ? 'bg-accent-500 text-navy-950' : 'text-navy-600 hover:bg-navy-100 dark:text-white/80 dark:hover:bg-navy-800'}`}>{tr(l)}</button>
          ))}
        </div>
        <div className="mt-4">
          {(tab === 'style' || tab === 'scenes') && (
            <div>
              <ArtStylePicker value={project.artStyle} motif={project.motif} onChange={(artStyle) => updateProject({ artStyle })} />
              <p className="mt-3 text-xs muted">{tr("Danach in der Szenenliste „Alle Bilder neu“ tippen, damit die Bilder im neuen Stil gesucht werden.")}</p>
            </div>
          )}
          {tab === 'voice' && (
            <div className="space-y-5">
              <VoicePicker language={project.language} voiceId={project.voiceId} onChange={(p) => updateProject({ ...p, scenes: scenes.map((x) => ({ ...x, audioUrl: null, audioDuration: null })) })} />
              <div className="flex flex-wrap items-center gap-3">
                <button className="btn-primary" onClick={genVoice} disabled={!!busy}>{busy === 'voice' ? <Spinner /> : <Mic className="h-4 w-4" />}{tr("KI-Voiceover erzeugen")}</button>
                <span className="text-xs muted">{tr('Anbieter')}: {health?.providers?.tts || 'offline'}</span>
              </div>
            </div>
          )}
          {tab === 'captions' && (
            <div className="space-y-5">
              <CaptionStylePicker value={project.captions.style} onChange={(style) => updateProject({ captions: { ...project.captions, style } })} />
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div><label className="label" htmlFor="c-font">{tr("Schrift")}</label><select id="c-font" className="input" value={project.captions.font} onChange={(e) => updateProject({ captions: { ...project.captions, font: e.target.value } })}>{CAPTION_FONTS.map((f) => <option key={f}>{f}</option>)}</select></div>
                <div><label className="label" htmlFor="c-pos">{tr("Position")}</label><select id="c-pos" className="input" value={project.captions.position} onChange={(e) => updateProject({ captions: { ...project.captions, position: e.target.value } })}><option value="top">{tr("Oben")}</option><option value="middle">{tr("Mitte")}</option><option value="bottom">{tr("Unten")}</option></select></div>
                <div><label className="label" htmlFor="c-size">Grösse ({Math.round(project.captions.size * 100)} %)</label><input id="c-size" type="range" min={0.6} max={1.5} step={0.05} className="w-full accent-accent-500" value={project.captions.size} onChange={(e) => updateProject({ captions: { ...project.captions, size: +e.target.value } })} /></div>
                <div><label className="label" htmlFor="c-col">{tr("Textfarbe")}</label><input id="c-col" type="color" className="h-10 w-full cursor-pointer rounded-lg" value={project.captions.color} onChange={(e) => updateProject({ captions: { ...project.captions, color: e.target.value } })} /></div>
                <div><label className="label" htmlFor="c-hi">{tr("Hervorhebung")}</label><input id="c-hi" type="color" className="h-10 w-full cursor-pointer rounded-lg" value={project.captions.highlight} onChange={(e) => updateProject({ captions: { ...project.captions, highlight: e.target.value } })} /></div>
                <div className="flex items-end"><Toggle id="c-up" checked={project.captions.uppercase} onChange={(uppercase) => updateProject({ captions: { ...project.captions, uppercase } })} label={tr("GROSSBUCHSTABEN")} /></div>
              </div>
            </div>
          )}
          {tab === 'music' && (
            <div className="space-y-5">
              <MusicPicker value={project.music.customUrl ? null : project.music.trackId} onChange={(trackId) => updateProject({ music: { ...project.music, trackId, customUrl: null, customName: null } })} />
              <div className="lg:max-w-md"><label className="label" htmlFor="m-vol">Lautstärke ({Math.round(project.music.volume * 100)} %)</label><input id="m-vol" type="range" min={0} max={1} step={0.05} className="w-full accent-accent-500" value={project.music.volume} onChange={(e) => updateProject({ music: { ...project.music, volume: +e.target.value } })} /></div>
              <div className="rounded-xl border border-dashed border-navy-200 p-4 dark:border-navy-700">
                <p className="text-sm font-semibold">{tr("Eigene Musik")}</p>
                {plan.limits.customUploads ? (
                  <>
                    <label className="btn-outline mt-2 cursor-pointer text-xs"><Upload className="h-4 w-4" />{tr("Audiodatei wählen")}<input type="file" accept="audio/*" className="sr-only" onChange={onMusicUpload} /></label>
                    {project.music.customName && <p className="mt-2 text-xs">Aktiv: {project.music.customName} <button className="ml-2 underline" onClick={() => updateProject({ music: { ...project.music, customUrl: null, customName: null } })}>{tr("entfernen")}</button></p>}
                    <p className="mt-2 text-xs muted">{tr("Lade nur Musik hoch, an der du die Rechte hast.")}</p>
                  </>
                ) : <p className="mt-1 text-xs muted">{tr("Im Pro-Plan enthalten.")} <Link to="/app/account" className="underline">{tr("Upgraden")}</Link></p>}
              </div>
            </div>
          )}
        </div>
      </details>
    </div>
  );
}
