import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowDown, ArrowUp, GripVertical, ImagePlus, Mic, Plus, RefreshCw, Trash2, Download, CalendarCheck, CheckCircle2,
  Wand2, Upload, Undo2, ArrowLeft,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { getVideo, getSeries, saveVideo, deleteVideo, listVideos, uid, uploadMedia } from '../../lib/store.js';
import { VOICES, CAPTION_FONTS, MUSIC_TRACKS } from '../../config/catalog.js';
import { getPlan } from '../../config/plans.js';
import Player from '../../video/Player.jsx';
import { newSeed, timeline, scriptToProject } from '../../video/project.js';
import { generateImage, regenerateScript } from '../../video/generate.js';
import { synthesize, speak, stopSpeaking } from '../../video/tts.js';
import { recordVideo, toMp4, download } from '../../video/exporter.js';
import { CaptionStylePicker, MusicPicker, ArtStylePicker, VoicePicker } from '../../components/Pickers.jsx';
import { Notice, Spinner, Toggle } from '../../components/ui.jsx';
import { StatusBadge } from './Dashboard.jsx';
import { nextFreeSlot, fmtDateTime } from '../../lib/schedule.js';
import { apiAvailable } from '../../lib/api.js';

const TABS = [
  ['scenes', 'Szenen'],
  ['style', 'Stil'],
  ['voice', 'Stimme'],
  ['captions', 'Untertitel'],
  ['music', 'Musik'],
  ['publish', 'Export & Posten'],
];

function SceneCard({ scene, index, total, project, onChange, onMove, onDelete, onRegenImage, busy, dragProps }) {
  return (
    <div className="card p-4" {...dragProps}>
      <div className="mb-2 flex items-center gap-2">
        <span className="cursor-grab text-navy-300" aria-hidden="true"><GripVertical className="h-4 w-4" /></span>
        <span className="text-xs font-semibold uppercase tracking-wide muted">{scene.role === 'hook' ? 'Hook' : scene.role === 'cta' ? 'Call-to-Action' : `Szene ${index}`}</span>
        <div className="ml-auto flex items-center">
          <button className="btn-icon" onClick={() => onMove(-1)} disabled={index === 0} aria-label="Nach oben"><ArrowUp className="h-4 w-4" /></button>
          <button className="btn-icon" onClick={() => onMove(1)} disabled={index === total - 1} aria-label="Nach unten"><ArrowDown className="h-4 w-4" /></button>
          <button className="btn-icon text-red-600" onClick={onDelete} disabled={total <= 1} aria-label="Szene löschen"><Trash2 className="h-4 w-4" /></button>
        </div>
      </div>
      <textarea className="input min-h-[72px] resize-y" value={scene.text} onChange={(e) => onChange({ text: e.target.value, audioUrl: null, audioDuration: null })} aria-label="Sprechertext" />
      <div className="mt-2 grid gap-2 sm:grid-cols-[1fr_auto_auto]">
        <input className="input py-2 text-xs" value={scene.visual || ''} placeholder="Bildbeschreibung (für das Bildmodell)" onChange={(e) => onChange({ visual: e.target.value })} aria-label="Bildbeschreibung" />
        <select className="input py-2 text-xs" value={scene.voiceId || ''} onChange={(e) => onChange({ voiceId: e.target.value || null, audioUrl: null, audioDuration: null })} aria-label="Stimme dieser Szene">
          <option value="">Stimme: Standard</option>
          {VOICES.map((v) => <option key={v.id} value={v.id}>{v.label}</option>)}
        </select>
        <div className="flex gap-1">
          <button className="btn-outline px-2.5 py-2 text-xs" onClick={() => speak(scene.text, { lang: project.language, voiceId: scene.voiceId || project.voiceId })} title="Vorhören"><Mic className="h-3.5 w-3.5" /></button>
          <button className="btn-outline px-2.5 py-2 text-xs" onClick={onRegenImage} disabled={busy} title="Bild neu generieren">{busy ? <Spinner className="h-3.5 w-3.5" /> : <RefreshCw className="h-3.5 w-3.5" />}Bild</button>
        </div>
      </div>
      {scene.audioUrl && <p className="mt-2 text-xs text-accent-700 dark:text-accent-400">✓ KI-Voiceover vorhanden</p>}
      {scene.credit && <p className="mt-2 text-xs muted">Bild: <a href={scene.credit.url} target="_blank" rel="noreferrer" className="underline">{scene.credit.author} / {scene.credit.source}</a></p>}
    </div>
  );
}

export default function Editor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const plan = getPlan(profile?.plan);
  const [video, setVideo] = useState(null);
  const [series, setSeries] = useState(null);
  const [tab, setTab] = useState('scenes');
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
      if (!v) return setMsg({ tone: 'error', text: 'Video nicht gefunden.' });
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
      try { await saveVideo(next); setSaved(true); } catch (e) { setMsg({ tone: 'error', text: `Speichern fehlgeschlagen: ${e.message}` }); }
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
    const r = await generateImage({ prompt: scene.visual || scene.text, style: project.artStyle, seed, userId: user.id });
    updateScene(scene.id, { seed, imageUrl: r.imageUrl || null, credit: r.credit || null });
    if (!r.imageUrl) setMsg({ tone: 'info', text: 'Kein Bild gefunden bzw. kein Bild-Modul verbunden – neue Platzhalter-Grafik erzeugt. Tipp: Bildbeschreibung (englisch) anpassen.' });
    setBusy(null);
  };

  const regenAllImages = async () => {
    setBusy('images'); setMsg(null);
    const next = [];
    for (const s of scenes) {
      const seed = newSeed();
      const r = await generateImage({ prompt: s.visual || s.text, style: project.artStyle, seed, userId: user.id });
      next.push({ ...s, seed, imageUrl: r.imageUrl || null, credit: r.credit || null });
    }
    updateProject({ scenes: next });
    if (!next.some((s) => s.imageUrl)) setMsg({ tone: 'info', text: 'Kein Bildmodell verbunden – Platzhalter-Grafiken wurden neu gemischt.' });
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
      ? { tone: 'success', text: 'KI-Voiceover erzeugt. Szenenlängen wurden an die Sprechdauer angepasst.' }
      : { tone: 'info', text: 'Kein TTS-Anbieter verbunden (TTS_PROVIDER). Die Vorschau nutzt die Browser-Stimme; der Export enthält dann nur Musik und Untertitel.' });
    setBusy(null);
  };

  const rewrite = async () => {
    if (!confirm('Skript neu schreiben? Deine Textänderungen gehen verloren.')) return;
    setBusy('script');
    try {
      const script = await regenerateScript({ niche: series?.niche, topic: series?.topic, language: project.language, seriesTitle: series?.title, episodeKey: video.episode_key, episodeTitle: video.title });
      const p = scriptToProject(script, project);
      updateProject({ scenes: p.scenes, title: p.title, notice: p.notice });
    } catch (e) { setMsg({ tone: 'error', text: e.message }); }
    setBusy(null);
  };

  const addScene = () => updateProject({ scenes: [...scenes.slice(0, -1), { id: uid(), role: 'story', text: 'Neuer Text …', visual: '', seed: newSeed(), imageUrl: null, audioUrl: null, voiceId: null }, scenes.at(-1)] });

  const exportVideo = async () => {
    setBusy('export'); setProgress(0); setMsg(null);
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    try {
      const { blob, hasVoice } = await recordVideo(project, { watermark: plan.id === 'free', onProgress: setProgress, signal: ctrl.signal });
      let file = blob, ext = blob.type.includes('mp4') ? 'mp4' : 'webm', note = '';
      if (health?.render === 'ffmpeg') {
        setBusy('transcode');
        try { file = await toMp4(blob); ext = 'mp4'; } catch (e) { note = ` MP4-Umwandlung nicht möglich (${e.message}) – Datei als ${ext.toUpperCase()} gespeichert.`; }
      } else if (ext !== 'mp4') note = ' Server-Rendering (FFmpeg) nicht erreichbar – Datei als WebM gespeichert.';
      download(file, `${(video.title || 'truereel').replace(/[^\w\-äöüÄÖÜ ]+/g, '').trim() || 'truereel'}.${ext}`);
      const nextStatus = video.status === 'draft' ? (series && !series.require_approval ? 'scheduled' : 'pending_approval') : video.status;
      const patch = { status: nextStatus };
      if (nextStatus === 'scheduled' && !video.scheduled_at) {
        const slot = nextFreeSlot(series, await listVideos(user.id));
        patch.scheduled_at = slot?.toISOString() || null;
      }
      update(patch);
      setMsg({ tone: 'success', text: `Export fertig (1080×1920).${hasVoice ? '' : ' Hinweis: ohne Voiceover, da kein TTS-Anbieter verbunden ist.'}${plan.id === 'free' ? ' Gratis-Export mit Wasserzeichen.' : ''}${note}` });
    } catch (e) {
      setMsg({ tone: 'error', text: e.message });
    }
    setBusy(null);
  };

  const approve = async () => {
    const slot = series ? nextFreeSlot(series, await listVideos(user.id)) : null;
    update({ status: 'scheduled', scheduled_at: video.scheduled_at || slot?.toISOString() || null });
    setMsg({ tone: 'success', text: slot ? `Freigegeben und geplant für ${fmtDateTime(video.scheduled_at || slot)}.` : 'Freigegeben.' });
  };

  const remove = async () => {
    if (!confirm('Video löschen? Das verbrauchte Kontingent wird dadurch nicht zurückgesetzt.')) return;
    await deleteVideo(video.id);
    navigate(series ? `/app/serien/${series.id}` : '/app');
  };

  const onMusicUpload = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 2 * 1024 * 1024) {
      updateProject({ music: { ...project.music, customUrl: URL.createObjectURL(f), customName: f.name } });
      setMsg({ tone: 'info', text: 'Grosse Datei: im Prototyp nur für diese Sitzung geladen. In Produktion wird sie in Supabase Storage gespeichert.' });
      return;
    }
    const r = new FileReader();
    r.onload = () => updateProject({ music: { ...project.music, customUrl: r.result, customName: f.name } });
    r.readAsDataURL(f);
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Link to={series ? `/app/serien/${series.id}` : '/app'} className="btn-ghost px-2"><ArrowLeft className="h-4 w-4" /></Link>
        <input className="min-w-0 flex-1 rounded-lg bg-transparent text-xl font-bold focus:bg-white focus:px-2 dark:focus:bg-navy-900 sm:text-2xl" value={video.title} onChange={(e) => update({ title: e.target.value })} aria-label="Titel" />
        <StatusBadge status={video.status} />
        <span className="text-xs muted">{saved ? 'Gespeichert' : 'Speichert …'}</span>
      </div>
      {project.notice && <Notice tone="warn" className="mb-4">{project.notice}</Notice>}
      {msg && <Notice tone={msg.tone} className="mb-4">{msg.text}</Notice>}

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="order-2 lg:order-1">
          <div className="-mx-4 mb-4 flex gap-1 overflow-x-auto px-4 sm:mx-0 sm:px-0" role="tablist">
            {TABS.map(([k, l]) => (
              <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className={`shrink-0 rounded-lg px-3 py-2 text-sm font-medium ${tab === k ? 'bg-navy-900 text-white dark:bg-white dark:text-navy-900' : 'text-navy-600 hover:bg-navy-100 dark:text-navy-300 dark:hover:bg-navy-800'}`}>{l}</button>
            ))}
          </div>

          {tab === 'scenes' && (
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <button className="btn-outline text-xs" onClick={rewrite} disabled={!!busy}>{busy === 'script' ? <Spinner /> : <Wand2 className="h-4 w-4" />}Skript neu schreiben</button>
                <button className="btn-outline text-xs" onClick={regenAllImages} disabled={!!busy}>{busy === 'images' ? <Spinner /> : <ImagePlus className="h-4 w-4" />}Alle Bilder neu</button>
                <button className="btn-outline text-xs" onClick={addScene}><Plus className="h-4 w-4" />Szene</button>
              </div>
              {scenes.map((s, i) => (
                <SceneCard key={s.id} scene={s} index={i} total={scenes.length} project={project}
                  busy={busy === `img-${s.id}`}
                  onChange={(patch) => updateScene(s.id, patch)}
                  onMove={(d) => move(i, i + d)}
                  onDelete={() => updateProject({ scenes: scenes.filter((x) => x.id !== s.id) })}
                  onRegenImage={() => regenImage(s)}
                  dragProps={{
                    draggable: true,
                    onDragStart: () => { dragFrom.current = i; },
                    onDragOver: (e) => e.preventDefault(),
                    onDrop: () => { move(dragFrom.current, i); dragFrom.current = null; },
                  }}
                />
              ))}
              <p className="text-xs muted">Tipp: Szenen per Drag & Drop oder mit den Pfeilen umordnen. Gesamtlänge ca. {Math.round(tl.total)} s.</p>
            </div>
          )}

          {tab === 'style' && (
            <div className="card p-5">
              <h3 className="mb-3 font-semibold">Art-Style</h3>
              <ArtStylePicker value={project.artStyle} motif={project.motif} onChange={(artStyle) => updateProject({ artStyle })} />
              <p className="mt-3 text-xs muted">Bei verbundenem Bildmodell danach „Alle Bilder neu“ ausführen, damit die Bilder im neuen Stil entstehen.</p>
            </div>
          )}

          {tab === 'voice' && (
            <div className="card space-y-5 p-5">
              <VoicePicker language={project.language} voiceId={project.voiceId} onChange={(p) => updateProject({ ...p, scenes: scenes.map((s) => ({ ...s, audioUrl: null, audioDuration: null })) })} />
              <div className="flex flex-wrap items-center gap-3 border-t border-navy-100 pt-5 dark:border-navy-800">
                <button className="btn-primary" onClick={genVoice} disabled={!!busy}>{busy === 'voice' ? <Spinner /> : <Mic className="h-4 w-4" />}KI-Voiceover erzeugen</button>
                <span className="text-xs muted">Anbieter: {health?.providers?.tts || 'offline'}</span>
              </div>
              {plan.limits.customUploads ? (
                <p className="text-xs muted">Eigene Stimme (Voice-Clone) – im Pro-Plan über den TTS-Anbieter verfügbar (in Vorbereitung).</p>
              ) : <p className="text-xs muted">Eigener Voice-Upload ist im Pro-Plan enthalten.</p>}
            </div>
          )}

          {tab === 'captions' && (
            <div className="card space-y-5 p-5">
              <CaptionStylePicker value={project.captions.style} onChange={(style) => updateProject({ captions: { ...project.captions, style } })} />
              <div className="grid gap-4 sm:grid-cols-2">
                <div><label className="label" htmlFor="c-font">Schrift</label><select id="c-font" className="input" value={project.captions.font} onChange={(e) => updateProject({ captions: { ...project.captions, font: e.target.value } })}>{CAPTION_FONTS.map((f) => <option key={f}>{f}</option>)}</select></div>
                <div><label className="label" htmlFor="c-pos">Position</label><select id="c-pos" className="input" value={project.captions.position} onChange={(e) => updateProject({ captions: { ...project.captions, position: e.target.value } })}><option value="top">Oben</option><option value="middle">Mitte</option><option value="bottom">Unten</option></select></div>
                <div><label className="label" htmlFor="c-col">Textfarbe</label><input id="c-col" type="color" className="h-10 w-full cursor-pointer rounded-lg" value={project.captions.color} onChange={(e) => updateProject({ captions: { ...project.captions, color: e.target.value } })} /></div>
                <div><label className="label" htmlFor="c-hi">Hervorhebung</label><input id="c-hi" type="color" className="h-10 w-full cursor-pointer rounded-lg" value={project.captions.highlight} onChange={(e) => updateProject({ captions: { ...project.captions, highlight: e.target.value } })} /></div>
                <div><label className="label" htmlFor="c-size">Grösse ({Math.round(project.captions.size * 100)} %)</label><input id="c-size" type="range" min={0.6} max={1.5} step={0.05} className="w-full accent-accent-500" value={project.captions.size} onChange={(e) => updateProject({ captions: { ...project.captions, size: +e.target.value } })} /></div>
                <div className="flex items-end"><Toggle id="c-up" checked={project.captions.uppercase} onChange={(uppercase) => updateProject({ captions: { ...project.captions, uppercase } })} label="GROSSBUCHSTABEN" /></div>
              </div>
            </div>
          )}

          {tab === 'music' && (
            <div className="card space-y-5 p-5">
              <MusicPicker value={project.music.customUrl ? null : project.music.trackId} onChange={(trackId) => updateProject({ music: { ...project.music, trackId, customUrl: null, customName: null } })} />
              <div><label className="label" htmlFor="m-vol">Lautstärke ({Math.round(project.music.volume * 100)} %)</label><input id="m-vol" type="range" min={0} max={1} step={0.05} className="w-full accent-accent-500" value={project.music.volume} onChange={(e) => updateProject({ music: { ...project.music, volume: +e.target.value } })} /></div>
              <div className="rounded-xl border border-dashed border-navy-200 p-4 dark:border-navy-700">
                <p className="text-sm font-semibold">Eigene Musik</p>
                {plan.limits.customUploads ? (
                  <>
                    <label className="btn-outline mt-2 cursor-pointer text-xs"><Upload className="h-4 w-4" />Audiodatei wählen<input type="file" accept="audio/*" className="sr-only" onChange={onMusicUpload} /></label>
                    {project.music.customName && <p className="mt-2 text-xs">Aktiv: {project.music.customName} <button className="ml-2 underline" onClick={() => updateProject({ music: { ...project.music, customUrl: null, customName: null } })}>entfernen</button></p>}
                    <p className="mt-2 text-xs muted">Lade nur Musik hoch, an der du die Rechte hast.</p>
                  </>
                ) : <p className="mt-1 text-xs muted">Im Pro-Plan enthalten. <Link to="/app/account" className="underline">Upgraden</Link></p>}
              </div>
              <p className="text-xs muted">Die Bibliothek wird von TrueReel selbst erzeugt und ist lizenzfrei nutzbar. ({MUSIC_TRACKS.length - 1} Tracks im Prototyp)</p>
            </div>
          )}

          {tab === 'publish' && (
            <div className="space-y-4">
              <div className="card p-5">
                <h3 className="font-semibold">1. Exportieren</h3>
                <p className="mt-1 text-sm muted">MP4 in 1080×1920 {plan.id === 'free' ? '(Gratis-Test: mit Wasserzeichen)' : 'ohne Wasserzeichen'}. Der Export läuft in Echtzeit (ca. {Math.round(tl.total)} s) – bitte Tab geöffnet lassen.</p>
                {(busy === 'export' || busy === 'transcode') && (
                  <div className="mt-4">
                    <div className="h-2 overflow-hidden rounded-full bg-navy-100 dark:bg-navy-800"><div className="h-full bg-accent-500 transition-all" style={{ width: `${busy === 'transcode' ? 100 : progress * 100}%` }} /></div>
                    <p className="mt-1 text-xs muted">{busy === 'transcode' ? 'Wird in MP4 umgewandelt …' : `${Math.round(progress * 100)} %`}</p>
                  </div>
                )}
                <div className="mt-4 flex gap-2">
                  <button className="btn-primary" onClick={exportVideo} disabled={!!busy}>{busy === 'export' || busy === 'transcode' ? <Spinner /> : <Download className="h-4 w-4" />}Video exportieren</button>
                  {busy === 'export' && <button className="btn-ghost" onClick={() => abortRef.current?.abort()}>Abbrechen</button>}
                </div>
                <p className="mt-3 text-xs muted">Rendering: {health ? (health.render === 'ffmpeg' ? 'Browser + FFmpeg (MP4/H.264)' : 'nur Browser (WebM)') : 'Server offline – nur Browser'}</p>
              </div>

              <div className="card p-5">
                <h3 className="font-semibold">2. Freigeben & planen</h3>
                {video.status === 'scheduled' ? (
                  <>
                    <p className="mt-1 flex items-center gap-2 text-sm"><CalendarCheck className="h-4 w-4 text-accent-600" />Geplant für <strong>{video.scheduled_at ? fmtDateTime(video.scheduled_at) : '—'}</strong> auf {(video.platforms || []).join(', ') || 'keiner Plattform'}</p>
                    <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto]">
                      <input type="datetime-local" className="input" aria-label="Zeitpunkt ändern"
                        value={video.scheduled_at ? new Date(new Date(video.scheduled_at).getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16) : ''}
                        onChange={(e) => update({ scheduled_at: e.target.value ? new Date(e.target.value).toISOString() : null })} />
                      <button className="btn-outline" onClick={() => update({ status: 'pending_approval' })}><Undo2 className="h-4 w-4" />Zurückziehen</button>
                    </div>
                  </>
                ) : video.status === 'posted' ? (
                  <p className="mt-1 flex items-center gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-accent-600" />Gepostet.</p>
                ) : (
                  <>
                    <p className="mt-1 text-sm muted">{series?.require_approval ? 'Nichts geht ohne deine Freigabe live. Prüfe die Vorschau und gib das Video frei – es wird dann im nächsten freien Slot deines Zeitplans gepostet.' : 'Auto-Post ist aktiv: Nach dem Export wird das Video automatisch eingeplant.'}</p>
                    <button className="btn-dark mt-4" onClick={approve} disabled={video.status === 'draft' || !!busy}><CheckCircle2 className="h-4 w-4" />Freigeben & einplanen</button>
                    {video.status === 'draft' && <p className="mt-2 text-xs muted">Zuerst exportieren, damit du das fertige Video geprüft hast.</p>}
                  </>
                )}
                {!(video.platforms || []).length && <p className="mt-3 text-xs muted">Keine Plattform gewählt – das Video erscheint als Erinnerung im Kalender. Plattformen wählst du in den Serien-Einstellungen, verbinden kannst du sie unter <Link className="underline" to="/app/account">Konto</Link>.</p>}
              </div>

              <button className="btn-danger" onClick={remove}><Trash2 className="h-4 w-4" />Video löschen</button>
            </div>
          )}
        </div>

        <aside className="order-1 lg:order-2">
          <div className="lg:sticky lg:top-6">
            <Player framed project={project} watermark={plan.id === 'free'} />
            <p className="mx-auto mt-2 max-w-[300px] text-center text-xs muted">Vorschau 9:16 · Ton an für Stimme & Musik</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
