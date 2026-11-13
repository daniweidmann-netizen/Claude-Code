import { useEffect, useRef, useState } from 'react';
import { Play, Square, Check } from 'lucide-react';
import { VOICE_SAMPLE_VERSION, PREMIUM_VOICE_PLANS, ART_STYLES, VOICES, LANGUAGES, CAPTION_STYLES, MUSIC_TRACKS, PLATFORMS, POST_FREQUENCIES } from '../config/catalog.js';
import { renderArt } from '../video/art.js';
import { stopSpeaking } from '../video/tts.js';
import { useAuth } from '../context/AuthContext.jsx';
import { Link } from 'react-router-dom';
import { previewMusic, stopMusicPreview, unlockAudio } from '../video/audio.js';
import { translate as tr } from '../i18n/index.jsx';

export function ArtThumb({ style, seed = 4242, motif = 'pyramid', className = '' }) {
  const ref = useRef(null);
  useEffect(() => {
    const art = renderArt(seed, style, motif);
    const c = ref.current;
    const ctx = c.getContext('2d');
    ctx.drawImage(art, 0, 0, c.width, c.height);
  }, [style, seed, motif]);
  return <canvas ref={ref} width={90} height={160} className={`rounded-lg ${className}`} />;
}

export function ArtStylePicker({ value, onChange, motif }) {
  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
      {ART_STYLES.map((s) => (
        <button key={s.id} type="button" onClick={() => onChange(s.id)} className={`option flex flex-col items-center gap-2 p-2 ${value === s.id ? 'option-active' : ''}`} aria-pressed={value === s.id}>
          <ArtThumb style={s.id} motif={motif} className="h-auto w-full" />
          <span className="text-xs font-semibold">{tr(s.label)}</span>
        </button>
      ))}
    </div>
  );
}


export function VoicePicker({ language, voiceId, onChange }) {
  const { profile } = useAuth();
  const premiumOk = !!profile?.owner || PREMIUM_VOICE_PLANS.includes(profile?.plan);
  const [playing, setPlaying] = useState(null);
  const [failed, setFailed] = useState(false);
  const audioRef = useRef(null);
  const stopAll = () => { stopSpeaking(); if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; } };
  useEffect(() => stopAll, []);
  // Hörprobe mit der echten KI-Stimme (vorab erzeugte Beispiele in /public/voices, gleiches Tempo wie im Video)
  const preview = (id) => {
    stopAll();
    if (playing === id) return setPlaying(null);
    setPlaying(id);
    const lang = LANGUAGES.some((l) => l.id === language) ? language : 'de';
    const a = new Audio(`/voices/${id}-${lang}.mp3?v=${VOICE_SAMPLE_VERSION}`);
    audioRef.current = a;
    setFailed(false);
    a.onended = () => setPlaying(null);
    // Kein Rückfall auf die Gerätestimme – die klingt anders als im Video und verwirrt nur
    a.play().catch(() => { setPlaying(null); setFailed(true); });
  };
  return (
    <div className="space-y-4">
      <div>
        <label className="label" htmlFor="lang">{tr("Sprache")}</label>
        <select id="lang" className="input" value={language} onChange={(e) => onChange({ language: e.target.value })}>
          {LANGUAGES.map((l) => <option key={l.id} value={l.id}>{tr(l.label)}</option>)}
        </select>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {VOICES.map((v) => (
          <div key={v.id} className={`option flex items-center justify-between ${voiceId === v.id ? 'option-active' : ''} ${v.premium && !premiumOk ? 'opacity-70' : ''}`} onClick={() => (!v.premium || premiumOk) && onChange({ voiceId: v.id })} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && (!v.premium || premiumOk) && onChange({ voiceId: v.id })} aria-pressed={voiceId === v.id} aria-disabled={v.premium && !premiumOk}>
            <span className="flex items-center gap-2 text-sm font-semibold">{voiceId === v.id && <Check className="h-4 w-4 text-accent-700" />}{tr(v.label)}{v.premium && <span className="rounded-full bg-accent-500 px-2 py-0.5 text-[10px] font-bold uppercase text-navy-950">{tr('Premium')}</span>}</span>
            <button type="button" className="btn-outline px-3 py-1.5 text-xs" onClick={(e) => { e.stopPropagation(); preview(v.id); }}>
              {playing === v.id ? <Square className="h-3 w-3" /> : <Play className="h-3 w-3" />}{tr("Vorhören")}
            </button>
          </div>
        ))}
      </div>
      <p className="text-xs muted">{tr("Hörprobe mit der echten KI-Stimme – so klingt sie auch im fertigen Video.")}</p>
      {!premiumOk && <p className="text-xs muted">{tr('Premium-Stimmen (besonders natürlich) sind in den Plänen Daily und Pro enthalten.')} <Link to="/preise" className="font-semibold underline">{tr('Pläne ansehen')}</Link></p>}
      {failed && <p className="text-xs text-amber-700 dark:text-amber-300">{tr("Die Hörprobe konnte nicht abgespielt werden. Prüfe, ob dein Handy auf lautlos steht, und tippe nochmals.")}</p>}
    </div>
  );
}

export function CaptionStylePicker({ value, onChange }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
      {CAPTION_STYLES.map((c) => (
        <button key={c.id} type="button" onClick={() => onChange(c.id)} className={`option p-3 ${value === c.id ? 'option-active' : ''}`} aria-pressed={value === c.id}>
          <p className="text-sm font-semibold">{tr(c.label)}</p>
          <p className="mt-0.5 text-[11px] muted">{tr(c.desc)}</p>
        </button>
      ))}
    </div>
  );
}

export function MusicPicker({ value, onChange }) {
  const [playing, setPlaying] = useState(null);
  useEffect(() => () => stopMusicPreview(), []);
  const toggle = async (id) => {
    if (playing === id) { stopMusicPreview(); return setPlaying(null); }
    unlockAudio();
    setPlaying(id);
    await previewMusic(id, 8);
    setTimeout(() => setPlaying((p) => (p === id ? null : p)), 8000);
  };
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {MUSIC_TRACKS.map((m) => (
        <div key={m.id} role="button" tabIndex={0} onClick={() => onChange(m.id)} onKeyDown={(e) => e.key === 'Enter' && onChange(m.id)} className={`option flex items-center justify-between p-3 ${value === m.id ? 'option-active' : ''}`}>
          <span className="text-sm font-medium">{tr(m.label)}{m.mood && <span className="ml-2 text-xs muted">{tr(m.mood)}</span>}</span>
          {m.root && (
            <button type="button" className="btn-icon" onClick={(e) => { e.stopPropagation(); toggle(m.id); }} aria-label={tr("Vorhören")}>
              {playing === m.id ? <Square className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

export function SchedulePicker({ schedule, onChange }) {
  const set = (patch) => onChange({ ...schedule, ...patch });
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        {POST_FREQUENCIES.map((f) => (
          <button key={f.id} type="button" onClick={() => set({ frequency: f.id, times: f.id === '2d' ? ['12:00', '19:00'] : [schedule.times?.[0] || '18:00'] })} className={`option p-3 text-center text-sm font-semibold ${schedule.frequency === f.id ? 'option-active' : ''}`}>{tr(f.label)}</button>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {(schedule.times || ['18:00']).map((t, i) => (
          <div key={i}>
            <label className="label" htmlFor={`time-${i}`}>{tr('Uhrzeit')} {schedule.times.length > 1 ? i + 1 : ''}</label>
            <input id={`time-${i}`} type="time" className="input" value={t} onChange={(e) => { const times = [...schedule.times]; times[i] = e.target.value; set({ times }); }} />
          </div>
        ))}
      </div>
      {schedule.frequency === '3w' && (
        <div>
          <p className="label">{tr("Wochentage")}</p>
          <div className="flex flex-wrap gap-2">
            {['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'].map((d, i) => {
              const on = schedule.days?.includes(i);
              return <button key={d} type="button" onClick={() => set({ days: on ? schedule.days.filter((x) => x !== i) : [...(schedule.days || []), i].sort() })} className={`h-9 w-11 rounded-lg border text-sm font-semibold ${on ? 'border-accent-500 bg-accent-50 text-accent-800 dark:bg-accent-900/30 dark:text-accent-200' : 'border-navy-200 dark:border-navy-700'}`}>{d}</button>;
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export function PlatformPicker({ value = [], onChange, max = 3 }) {
  return (
    <div className="grid gap-2 sm:grid-cols-3">
      {PLATFORMS.map((p) => {
        const on = value.includes(p.id) && !p.soon;
        const disabled = p.soon || (!on && value.filter((x) => !PLATFORMS.find((q) => q.id === x)?.soon).length >= max);
        return (
          <button key={p.id} type="button" disabled={disabled} onClick={() => onChange(on ? value.filter((x) => x !== p.id) : [...value.filter((x) => !PLATFORMS.find((q) => q.id === x)?.soon), p.id])} className={`option p-3 text-sm font-semibold disabled:opacity-50 ${on ? 'option-active' : ''}`} aria-pressed={on}>
            {tr(p.label)}
            {p.soon && <span className="ml-2 rounded-full bg-navy-100 px-2 py-0.5 text-[11px] font-semibold text-navy-600 dark:bg-navy-800 dark:text-navy-200">{tr('bald verfügbar')}</span>}
          </button>
        );
      })}
    </div>
  );
}
