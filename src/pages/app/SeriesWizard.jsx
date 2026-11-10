import { useEffect, useState } from 'react';
import { apiAvailable } from '../../lib/api.js';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useAppData } from '../../lib/useAppData.js';
import { NICHES, DEFAULT_CAPTIONS, VIDEO_LENGTHS, DEFAULT_TARGET_SECONDS } from '../../config/catalog.js';
import { getPlan } from '../../config/plans.js';
import { ArtStylePicker, VoicePicker, SchedulePicker, PlatformPicker, CaptionStylePicker } from '../../components/Pickers.jsx';
import { Notice, Spinner, Toggle } from '../../components/ui.jsx';
import { planSeries } from '../../video/generate.js';
import { saveSeries } from '../../lib/store.js';
import { createVideoForEpisode } from '../../lib/videoFlow.js';
import { computeUsage, seriesLimitReached } from '../../lib/usage.js';
import { DEFAULT_SCHEDULE } from '../../lib/schedule.js';

const STEPS = ['Nische', 'Stil', 'Stimme', 'Zeitplan'];

export default function SeriesWizard() {
  const { user, profile, updateProfile } = useAuth();
  const { series, videos, loading } = useAppData();
  const navigate = useNavigate();
  const isOnboarding = useLocation().pathname.includes('onboarding');
  const plan = getPlan(profile?.plan);
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const [d, setD] = useState({
    niche: 'history', topic: '', artStyle: 'cinematic', captionStyle: 'karaoke',
    language: (profile?.locale || 'de'), voiceId: 'calm-m',
    schedule: DEFAULT_SCHEDULE, platforms: [], requireApproval: true, targetSeconds: DEFAULT_TARGET_SECONDS,
  });
  const set = (patch) => setD((x) => ({ ...x, ...patch }));
  const [llm, setLlm] = useState('mock');
  useEffect(() => { apiAvailable().then((h) => h?.providers?.llm && setLlm(h.providers.llm)); }, []);
  const nicheReady = (n) => n.ready || llm !== 'mock';

  if (loading) return <Spinner className="h-6 w-6 text-accent-500" />;
  const limitReached = seriesLimitReached(profile, series.length);
  const usage = computeUsage(profile, videos);

  const canNext = step !== 0 || d.niche !== 'custom' || d.topic.trim().length > 2;

  const finish = async () => {
    setError('');
    try {
      setBusy('Die KI plant deine Serie …');
      const planRes = await planSeries({ niche: d.niche, topic: d.topic, language: d.language });
      const s = await saveSeries({
        user_id: user.id,
        title: planRes.title,
        description: planRes.description,
        niche: d.niche,
        topic: d.topic || null,
        language: d.language,
        art_style: d.artStyle,
        voice_id: d.voiceId,
        captions: { ...DEFAULT_CAPTIONS, style: d.captionStyle },
        music: { trackId: d.niche === 'history' ? 'epic' : 'calm', volume: 0.3 },
        schedule: d.schedule,
        platforms: d.platforms,
        require_approval: d.requireApproval,
        target_seconds: d.targetSeconds,
        episodes: planRes.episodes,
        active: true,
      });
      if (isOnboarding) await updateProfile({ onboarding_done: true });
      if (usage.remaining > 0) {
        setBusy('Skript für die erste Folge wird geschrieben …');
        const v = await createVideoForEpisode(user, s, planRes.episodes[0], setBusy);
        navigate(`/app/video/${v.id}`);
      } else navigate(`/app/serien/${s.id}`);
    } catch (e) {
      setError(e.message);
      setBusy('');
    }
  };

  if (limitReached) {
    return (
      <div className="mx-auto max-w-lg">
        <Notice tone="warn">Dein Plan <strong>{plan.name}</strong> erlaubt {plan.limits.series} Serie(n). <Link to="/app/account" className="font-semibold underline">Plan upgraden</Link>, um weitere Serien anzulegen.</Notice>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      {isOnboarding && (
        <div className="mb-6 text-center">
          <p className="eyebrow">Willkommen bei TrueReel</p>
          <h1 className="mt-1 text-2xl font-bold sm:text-3xl">Richten wir deine erste Serie ein</h1>
          <p className="mt-1 text-sm muted">Vier kurze Schritte – alles lässt sich später ändern.</p>
        </div>
      )}
      {!isOnboarding && <h1 className="mb-6 text-2xl font-bold">Neue Serie</h1>}

      <ol className="mb-6 grid grid-cols-4 gap-2" aria-label="Fortschritt">
        {STEPS.map((s, i) => (
          <li key={s} className="text-center">
            <div className={`h-1.5 rounded-full ${i <= step ? 'bg-accent-500' : 'bg-navy-100 dark:bg-navy-800'}`} />
            <span className={`mt-2 block text-xs font-medium ${i === step ? '' : 'muted'}`}>{i + 1}. {s}</span>
          </li>
        ))}
      </ol>

      <div className="card p-5 sm:p-8">
        {step === 0 && (
          <>
            <h2 className="text-lg font-semibold">Worum soll es gehen?</h2>
            <p className="mb-5 text-sm muted">Wähle eine Nische – oder gib ein eigenes Thema ein.</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {NICHES.map((n) => (
                <button key={n.id} type="button" onClick={() => set({ niche: n.id })} className={`option ${d.niche === n.id ? 'option-active' : ''}`} aria-pressed={d.niche === n.id}>
                  <p className="font-semibold">{n.emoji} {n.label} {!nicheReady(n) && <span className="ml-1 rounded bg-navy-100 px-1.5 py-0.5 text-[10px] font-semibold text-navy-600 dark:bg-navy-800 dark:text-navy-300">bald</span>}</p>
                  <p className="mt-1 text-xs muted">{n.desc}</p>
                </button>
              ))}
            </div>
            {(d.niche === 'custom' || !nicheReady(NICHES.find((n) => n.id === d.niche))) && (
              <div className="mt-5">
                <label className="label" htmlFor="topic">{d.niche === 'custom' ? 'Dein Thema' : 'Thema präzisieren (optional)'}</label>
                <input id="topic" className="input" placeholder="z. B. Erfindungen aus der Schweiz" value={d.topic} onChange={(e) => set({ topic: e.target.value })} />
                {d.niche !== 'custom' && <p className="mt-2 text-xs muted">Prototyp: Diese Nische nutzt aktuell den „Eigenes Thema“-Ablauf. Voll ausgebaut ist „Geschichte“.</p>}
              </div>
            )}
          </>
        )}

        {step === 1 && (
          <>
            <h2 className="text-lg font-semibold">Visueller Stil</h2>
            <p className="mb-5 text-sm muted">Die Vorschau zeigt Platzhalter-Grafiken. Mit verbundenem Bildmodell entstehen echte Bilder im gewählten Stil.</p>
            <ArtStylePicker value={d.artStyle} onChange={(artStyle) => set({ artStyle })} />
            <h3 className="mb-3 mt-8 font-semibold">Untertitel-Stil</h3>
            <CaptionStylePicker value={d.captionStyle} onChange={(captionStyle) => set({ captionStyle })} />
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="mb-5 text-lg font-semibold">Stimme & Sprache</h2>
            <VoicePicker language={d.language} voiceId={d.voiceId} onChange={set} />
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="text-lg font-semibold">Videolänge</h2>
            <p className="mb-4 text-sm muted">TikTok zahlt im Creator-Rewards-Programm nur für Videos über 1 Minute.</p>
            <div className="mb-8 grid gap-2 sm:grid-cols-3">
              {VIDEO_LENGTHS.map((l) => (
                <button key={l.seconds} type="button" onClick={() => set({ targetSeconds: l.seconds })} className={`option p-3 ${d.targetSeconds === l.seconds ? 'option-active' : ''}`} aria-pressed={d.targetSeconds === l.seconds}>
                  <p className="text-sm font-semibold">{l.label}</p>
                  <p className="mt-0.5 text-[11px] muted">{l.desc}</p>
                </button>
              ))}
            </div>
            <h2 className="text-lg font-semibold">Zeitplan & Plattformen</h2>
            <p className="mb-5 text-sm muted">Plattformen verbindest du später unter „Konto“. Ohne Verbindung kannst du Videos exportieren und manuell posten.</p>
            <SchedulePicker schedule={d.schedule} onChange={(schedule) => set({ schedule })} />
            <h3 className="mb-3 mt-6 font-semibold">Plattformen {plan.limits.platforms < 3 && <span className="text-xs font-normal muted">(dein Plan: max. {plan.limits.platforms || 1})</span>}</h3>
            <PlatformPicker value={d.platforms} onChange={(platforms) => set({ platforms })} max={Math.max(1, plan.limits.platforms)} />
            <div className="mt-6 rounded-xl border border-navy-100 p-4 dark:border-navy-800">
              <Toggle id="approval" checked={d.requireApproval} onChange={(requireApproval) => set({ requireApproval })} label="Vor jedem Post Freigabe einholen (empfohlen)" />
              {!d.requireApproval && <p className="mt-2 text-xs text-amber-700 dark:text-amber-300">Videos werden nach dem Rendern ohne Rückfrage zum geplanten Zeitpunkt gepostet.</p>}
            </div>
          </>
        )}

        {error && <Notice tone="error" className="mt-6">{error}</Notice>}
        {busy && <Notice className="mt-6 flex items-center gap-2"><Spinner />{busy}</Notice>}

        <div className="mt-8 flex justify-between">
          <button className="btn-ghost" onClick={() => setStep(step - 1)} disabled={step === 0 || !!busy}><ArrowLeft className="h-4 w-4" />Zurück</button>
          {step < STEPS.length - 1 ? (
            <button className="btn-primary" onClick={() => setStep(step + 1)} disabled={!canNext}>Weiter<ArrowRight className="h-4 w-4" /></button>
          ) : (
            <button className="btn-primary" onClick={finish} disabled={!!busy}><Sparkles className="h-4 w-4" />Serie erstellen</button>
          )}
        </div>
      </div>
    </div>
  );
}
