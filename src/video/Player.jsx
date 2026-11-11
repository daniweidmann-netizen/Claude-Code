import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pause, Play, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { drawFrame } from './renderer.js';
import { timeline, sceneAt } from './project.js';
import { audioCtx, renderMusic, decodeUrl, unlockAudio } from './audio.js';
import { speak, stopSpeaking } from './tts.js';

const PW = 540, PH = 960;

export function useImages(project) {
  const [, setVersion] = useState(0);
  const imgs = useRef(new Map());
  useEffect(() => {
    project?.scenes.forEach((s) => {
      if (s.imageUrl && !imgs.current.has(s.imageUrl)) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => setVersion((v) => v + 1);
        img.src = s.imageUrl;
        imgs.current.set(s.imageUrl, img);
      }
    });
  }, [project]);
  return useCallback((s) => {
    const img = s.imageUrl && imgs.current.get(s.imageUrl);
    return img && img.complete && img.naturalWidth ? img : null;
  }, []);
}

export default function Player({ framed = false, project, autoPlay = false, initialMuted = false, loop = false, controls = true, watermark = false, className = '', onTime }) {
  const canvasRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(initialMuted);
  const mutedRef = useRef(initialMuted);
  const [t, setT] = useState(0);
  const tl = useMemo(() => (project ? timeline(project) : { items: [], total: 0 }), [project]);
  const getImage = useImages(project);
  const st = useRef({ raf: 0, startAt: 0, music: null, sceneId: null, voices: [], playId: 0, t: 0 });

  const draw = useCallback((time) => {
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx && project) drawFrame(ctx, project, tl, time, { W: PW, H: PH, getImage, watermark });
  }, [project, tl, getImage, watermark]);

  useEffect(() => { draw(st.current.t); }, [draw]);

  // Sprachaufnahmen vorab dekodieren (Web Audio) – iOS erlaubt sonst nur eine Aufnahme pro Fingertipp
  useEffect(() => {
    project?.scenes.forEach((sc) => { if (sc.audioUrl) decodeUrl(sc.audioUrl).catch(() => {}); });
  }, [project]);

  const stopAudio = () => {
    try { st.current.music?.stop(); } catch {}
    st.current.music = null;
    (st.current.voices || []).forEach((v) => { try { v.stop(); } catch {} });
    st.current.voices = [];
    st.current.sceneId = null;
    stopSpeaking();
  };

  // Alle Szenen-Aufnahmen auf der Web-Audio-Zeitachse einplanen
  const startVoices = async (playId) => {
    if (mutedRef.current || !project) return;
    const ctx = audioCtx();
    for (const item of tl.items) {
      if (!item.scene.audioUrl) continue;
      let buf;
      try { buf = await decodeUrl(item.scene.audioUrl); } catch { continue; }
      if (!st.current.playing || st.current.playId !== playId) return;
      const elapsed = performance.now() / 1000 - st.current.startAt;
      const offset = Math.max(0, elapsed - item.start);
      if (offset >= buf.duration) continue;
      const src = ctx.createBufferSource();
      src.buffer = buf;
      src.connect(ctx.destination);
      src.start(ctx.currentTime + Math.max(0, item.start - elapsed), offset);
      st.current.voices.push(src);
    }
  };

  const startMusic = async (from) => {
    if (mutedRef.current || !project) return;
    const m = project.music || {};
    let buf = null;
    try {
      buf = m.customUrl ? await decodeUrl(m.customUrl) : await renderMusic(m.trackId, tl.total);
    } catch (e) { console.warn('Musik konnte nicht geladen werden', e); }
    if (!buf || !st.current.playing) return;
    const ctx = audioCtx();
    const src = ctx.createBufferSource();
    const g = ctx.createGain();
    g.gain.value = m.volume ?? 0.35;
    src.buffer = buf;
    src.loop = !!m.customUrl;
    src.connect(g).connect(ctx.destination);
    src.start(0, Math.min(from, buf.duration - 0.01));
    st.current.music = src;
  };

  const voiceForScene = (item, time) => {
    if (mutedRef.current || st.current.sceneId === item.scene.id) return;
    st.current.sceneId = item.scene.id;
    stopSpeaking();
    const offset = time - item.start;
    if (item.scene.audioUrl) {
      // wird über startVoices (Web Audio) abgespielt
    } else if (offset < 0.6) {
      speak(item.scene.text, { lang: project.language, voiceId: item.scene.voiceId || project.voiceId });
    }
  };

  const pause = useCallback(() => {
    cancelAnimationFrame(st.current.raf);
    st.current.playing = false;
    stopAudio();
    setPlaying(false);
  }, []);

  const play = useCallback(async (from = st.current.t) => {
    if (!tl.total) return;
    if (from >= tl.total - 0.05) from = 0;
    if (!mutedRef.current) unlockAudio(); // synchron im Fingertipp – wichtig für iOS
    try { await audioCtx().resume(); } catch {}
    stopAudio();
    st.current.playing = true;
    st.current.playId = (st.current.playId || 0) + 1;
    st.current.voices = [];
    st.current.startAt = performance.now() / 1000 - from;
    setPlaying(true);
    startMusic(from);
    startVoices(st.current.playId);
    const tick = () => {
      if (!st.current.playing) return;
      let time = performance.now() / 1000 - st.current.startAt;
      if (time >= tl.total) {
        if (loop) { stopAudio(); st.current.startAt = performance.now() / 1000; time = 0; startMusic(0); startVoices(st.current.playId); }
        else { st.current.t = tl.total; setT(tl.total); draw(tl.total - 0.001); pause(); return; }
      }
      st.current.t = time;
      setT(time);
      onTime?.(time);
      draw(time);
      voiceForScene(sceneAt(tl, time), time);
      st.current.raf = requestAnimationFrame(tick);
    };
    st.current.raf = requestAnimationFrame(tick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tl, draw, loop, project]);

  useEffect(() => {
    if (autoPlay) play(0);
    return () => { cancelAnimationFrame(st.current.raf); st.current.playing = false; stopAudio(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project, autoPlay]);

  const seek = (v) => {
    st.current.t = v;
    setT(v);
    draw(v);
    if (st.current.playing) play(v);
  };

  const toggleMute = () => {
    const was = st.current.playing;
    pause();
    mutedRef.current = !mutedRef.current;
    setMuted(mutedRef.current);
    if (was) play();
  };

  const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

  return (
    <div className={className}>
      <div className={framed ? 'relative mx-auto w-full max-w-[260px] overflow-hidden rounded-[2.4rem] border-[10px] border-navy-900 bg-black shadow-2xl dark:border-navy-700' : 'relative overflow-hidden rounded-[inherit] bg-black'} style={{ aspectRatio: framed ? undefined : '9 / 16' }}>
         <canvas ref={canvasRef} width={PW} height={PH} className="block h-auto w-full" onClick={() => (playing ? pause() : play())} />
        {controls && !playing && (
          <button onClick={() => play()} className="absolute inset-0 m-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-navy-900 shadow-lg transition hover:scale-105" aria-label="Abspielen">
            <Play className="ml-1 h-7 w-7" />
          </button>
        )}
      </div>
      {controls && (
        <div className={`mt-3 flex items-center gap-2 text-xs ${framed ? 'mx-auto max-w-[300px]' : ''} text-navy-500 dark:text-navy-300`}>
          <button className="btn-icon" onClick={() => (playing ? pause() : play())} aria-label={playing ? 'Pause' : 'Abspielen'}>
            {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>
          <button className="btn-icon" onClick={() => seek(0)} aria-label="Zum Anfang"><RotateCcw className="h-4 w-4" /></button>
          <input type="range" min={0} max={tl.total || 1} step={0.05} value={t} onChange={(e) => seek(+e.target.value)} className="flex-1 accent-accent-500" aria-label="Position" />
          <span className="whitespace-nowrap tabular-nums">{fmt(t)} / {fmt(tl.total)}</span>
          <button className="btn-icon" onClick={toggleMute} aria-label={muted ? 'Ton an' : 'Ton aus'}>
            {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
        </div>
      )}
    </div>
  );
}
