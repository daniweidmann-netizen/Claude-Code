import { useEffect, useRef, useState } from 'react';
import { apiAvailable } from '../../lib/api.js';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Sparkles, ImagePlus, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useAppData } from '../../lib/useAppData.js';
import { NICHES, DEFAULT_CAPTIONS, VIDEO_LENGTHS, DEFAULT_TARGET_SECONDS, ART_STYLES, CAPTION_STYLES, LANGUAGES, VOICES } from '../../config/catalog.js';
import { getPlan } from '../../config/plans.js';
import { ArtStylePicker, VoicePicker, SchedulePicker, PlatformPicker, CaptionStylePicker } from '../../components/Pickers.jsx';
import { Notice, Spinner, Toggle } from '../../components/ui.jsx';
import { planSeries, createCharacter } from '../../video/generate.js';
import { saveSeries, uploadMedia } from '../../lib/store.js';
import { supabase } from '../../lib/supabase.js';
import { fileToJpeg } from '../../lib/imageFile.js';
import { createVideoForEpisode } from '../../lib/videoFlow.js';
import { computeUsage, seriesLimitReached } from '../../lib/usage.js';
import { DEFAULT_SCHEDULE } from '../../lib/schedule.js';
import { translate as tr, getLang } from '../../i18n/index.jsx';

const STEPS = ['Thema', 'Stil', 'Stimme & Sprache', 'Länge & Zeitplan'];

// Vorlage für den Inhaber: Werbung für TrueReel selbst (nur echte, überprüfbare Fakten)
const TRUEREEL_PROMO = {
  de: { product: 'TrueReel', link: 'truereel.ch', audience: 'Creators, kleine Firmen und alle, die auf TikTok, Instagram oder YouTube wachsen wollen, ohne selbst vor die Kamera zu stehen', facts: 'Erstellt aus einem Thema automatisch fertige Kurzvideos: Skript, KI-Bilder, Stimme, Untertitel und Musik · gesichtslos, du musst nicht vor die Kamera · 13 Bildstile und viele Sprachen · Serien mit Zeitplan · kann Videos direkt auf YouTube hochladen · erstes Video gratis, keine Kreditkarte nötig; Hook und Skript ohne Konto auf truereel.ch testen' },
  en: { product: 'TrueReel', link: 'truereel.ch', audience: 'Creators, small businesses and anyone who wants to grow on TikTok, Instagram or YouTube without being on camera', facts: 'Turns a topic into finished short videos automatically: script, AI images, voice-over, captions and music · faceless, no camera needed · 13 visual styles and many languages · series with a posting schedule · can upload directly to YouTube · first video free, no credit card needed; test hooks and scripts without an account on truereel.ch' },
};

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
    niche: 'history', topic: '', character: '', promo: { product: '', link: '', facts: '', audience: '' }, photos: [], artStyle: 'cinematic', captionStyle: 'karaoke',
    language: getLang(), voiceId: 'calm-m',
    schedule: DEFAULT_SCHEDULE, platforms: [], requireApproval: true, targetSeconds: DEFAULT_TARGET_SECONDS,
  });
  const set = (patch) => setD((x) => ({ ...x, ...patch }));
  const [llm, setLlm] = useState('mock');
  useEffect(() => { apiAvailable().then((h) => h?.providers?.llm && setLlm(h.providers.llm)); }, []);
  const nicheReady = (n) => n.ready || llm !== 'mock';

  // Schnellstart: Thema aus dem Test auf der Startseite → erstes Video direkt erstellen
  const finishRef = useRef(null);
  const [quick, setQuick] = useState('');
  const [photoBusy, setPhotoBusy] = useState(false);
  useEffect(() => {
    if (loading || !isOnboarding) return;
    let first = null;
    try { first = JSON.parse(localStorage.getItem('tr-first-topic') || 'null'); localStorage.removeItem('tr-first-topic'); } catch { /* egal */ }
    // Anderes Gerät (z. B. Bestätigungs-Mail am Handy geöffnet): Thema aus dem Konto
    const meta = user?.user_metadata;
    if (!first?.topic && meta?.first_topic && !meta.first_topic_used) {
      first = { topic: meta.first_topic, at: meta.first_topic_at };
      supabase?.auth.updateUser({ data: { first_topic_used: true } }).catch(() => {});
    } else if (first?.topic && meta?.first_topic) supabase?.auth.updateUser({ data: { first_topic_used: true } }).catch(() => {});
    if (!first?.topic || Date.now() - (first.at || 0) > 7 * 864e5) return;
    setQuick(first.topic);
    finishRef.current?.({ niche: 'custom', topic: String(first.topic).slice(0, 120) });
  }, [loading]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) return <Spinner className="h-6 w-6 text-accent-500" />;
  const limitReached = seriesLimitReached(profile, series.length);
  const usage = computeUsage(profile, videos);

  const setPromo = (patch) => setD((x) => ({ ...x, promo: { ...x.promo, ...patch } }));
  const addPhotos = async (e) => {
    const files = [...(e.target.files || [])].slice(0, 6 - d.photos.length);
    e.target.value = '';
    if (!files.length) return;
    setPhotoBusy(true); setError('');
    try {
      for (const f of files) {
        const url = await uploadMedia(user.id, await fileToJpeg(f), 'images');
        setD((x) => ({ ...x, photos: [...x.photos, { url, label: '' }].slice(0, 6) }));
      }
    } catch (err) { setError(tr(err.message)); }
    setPhotoBusy(false);
  };
  const setPhoto = (i, patch) => setD((x) => ({ ...x, photos: x.photos.map((p, k) => (k === i ? { ...p, ...patch } : p)) }));
  const promoTopic = () => {
    const p = d.promo;
    return [`Produkt/Angebot: ${p.product.trim()}`, p.link.trim() && `Link: ${p.link.trim()}`, p.audience.trim() && `Zielgruppe: ${p.audience.trim()}`, `Fakten und Vorteile (nur diese verwenden): ${p.facts.trim()}`].filter(Boolean).join('\n');
  };
  const canNext = step !== 0 || ((d.niche !== 'custom' || d.topic.trim().length > 2) && (d.niche !== 'characters' || d.character.trim().length > 5) && (d.niche !== 'promo' || (d.promo.product.trim().length > 1 && d.promo.facts.trim().length > 10)));

  const finish = async (o = {}) => {
    const x = { ...d, ...o };
    setError('');
    try {
      setBusy(tr("Die KI plant deine Serie …"));
      const topic = x.niche === 'promo' ? promoTopic() : x.topic;
      const planRes = await planSeries({ niche: x.niche, topic, language: x.language, character: x.niche === 'characters' ? x.character : undefined });
      let character = null;
      if (x.niche === 'characters') {
        setBusy(tr('Deine Hauptfigur wird gezeichnet …'));
        character = await createCharacter({ description: x.character.trim(), style: x.artStyle, userId: user.id }).catch(() => null);
      }
      const s = await saveSeries({
        user_id: user.id,
        title: planRes.title,
        description: planRes.description,
        niche: x.niche,
        topic: topic || null,
        language: x.language,
        art_style: x.artStyle,
        voice_id: x.voiceId,
        captions: { ...DEFAULT_CAPTIONS, style: x.captionStyle },
        music: { trackId: x.niche === 'promo' ? 'uplift' : ['history', 'pov'].includes(x.niche) ? 'epic' : 'calm', volume: 0.3 }, // Tiergeschichten: ruhige Flächen
        schedule: x.schedule,
        platforms: x.platforms,
        require_approval: x.requireApproval,
        target_seconds: x.targetSeconds,
        episodes: planRes.episodes,
        character,
        product: x.niche === 'promo' && x.photos.length ? { images: x.photos.map((p, i) => ({ url: p.url, label: p.label.trim() || `Foto ${i + 1}` })) } : null,
        active: true,
      });
      if (isOnboarding) await updateProfile({ onboarding_done: true });
      if (usage.remaining > 0) {
        setBusy(tr("Skript für die erste Folge wird geschrieben …"));
        const v = await createVideoForEpisode(user, s, planRes.episodes[0], setBusy);
        navigate(`/app/video/${v.id}`);
      } else navigate(`/app/serien/${s.id}`);
    } catch (e) {
      setError(e.message);
      setBusy('');
    }
  };

  finishRef.current = finish;

  if (limitReached) {
    return (
      <div className="mx-auto max-w-lg">
        <Notice tone="warn">{tr('Dein Plan {p} erlaubt {n} Serie(n).', { p: plan.name, n: plan.limits.series })} <Link to="/app/account" className="font-semibold underline">{tr("Plan upgraden")}</Link></Notice>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      {isOnboarding && (
        <div className="mb-6 text-center">
          <p className="eyebrow">{tr("Willkommen bei TrueReel")}</p>
          <h1 className="mt-1 text-2xl font-bold sm:text-3xl">{tr("Richten wir deine erste Serie ein")}</h1>
          <p className="mt-1 text-sm muted">{quick ? tr('Dein erstes Video zu „{t}“ wird gerade erstellt – das dauert etwa eine Minute.', { t: quick }) : tr("Vier kurze Schritte – alles lässt sich später ändern.")}</p>
        </div>
      )}
      {!isOnboarding && <h1 className="mb-6 text-2xl font-bold">{tr("Neue Serie")}</h1>}

      <ol className="mb-6 grid grid-cols-4 gap-2" aria-label={tr("Fortschritt")}>
        {STEPS.map((s, i) => (
          <li key={s} className="text-center">
            <button type="button" className="group block w-full disabled:cursor-default" onClick={() => setStep(i)} disabled={i >= step || !!busy} aria-current={i === step ? 'step' : undefined} title={i < step ? tr('Zurück zu diesem Schritt') : undefined}>
              <span className={`block h-1.5 rounded-full transition ${i <= step ? 'bg-accent-500' : 'bg-navy-100 dark:bg-navy-800'}`} />
              <span className={`mt-2 block text-[11px] font-medium leading-tight sm:text-xs ${i === step ? '' : 'muted'} ${i < step ? 'group-hover:underline' : ''}`}>{i < step ? '✓ ' : `${i + 1}. `}{tr(s)}</span>
            </button>
          </li>
        ))}
      </ol>

      <div className="card p-5 sm:p-8">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-accent-700 dark:text-accent-400">{tr('Schritt {a} von {b}', { a: step + 1, b: STEPS.length })}</p>
        {step === 0 && (
          <>
            <h2 className="text-lg font-semibold">{tr("Worum soll es gehen?")}</h2>
            <p className="mb-5 text-sm muted">{tr("Wähle eine Nische – oder gib ein eigenes Thema ein.")}</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {NICHES.map((n) => (
                <button key={n.id} type="button" onClick={() => set({ niche: n.id })} className={`option ${d.niche === n.id ? 'option-active' : ''}`} aria-pressed={d.niche === n.id}>
                  <p className="font-semibold">{n.emoji} {tr(n.label)} {!nicheReady(n) && <span className="ml-1 rounded bg-navy-100 px-1.5 py-0.5 text-[10px] font-semibold text-navy-600 dark:bg-navy-800 dark:text-navy-300">{tr("bald")}</span>}</p>
                  <p className="mt-1 text-xs muted">{tr(n.desc)}</p>
                </button>
              ))}
            </div>
            {d.niche === 'characters' && (
              <div className="mt-5 space-y-4">
                <div>
                  <label className="label" htmlFor="character">{tr('Deine Hauptfigur *')}</label>
                  <textarea id="character" className="input min-h-[96px]" maxLength={600} placeholder={tr('z. B. junge Frau Ende 20, kurze rote Haare, Sommersprossen, grüne Regenjacke, mutig und neugierig')} value={d.character} onChange={(e) => set({ character: e.target.value })} />
                  <p className="mt-1 text-xs muted">{tr('Aussehen, Kleidung, Charakter. Die KI zeichnet daraus eine erfundene Person, die in jeder Folge gleich aussieht. Keine echten Personen.')}</p>
                </div>
                <div>
                  <label className="label" htmlFor="topic-ch">{tr('Genre / Thema (optional)')}</label>
                  <input id="topic-ch" className="input" placeholder={tr('z. B. Mystery in einer Kleinstadt, Abenteuer in den Alpen')} value={d.topic} onChange={(e) => set({ topic: e.target.value })} />
                </div>
              </div>
            )}
            {d.niche === 'animalstories' && (
              <div className="mt-5">
                <label className="label" htmlFor="topic-animal">{tr('Tier oder Richtung (optional)')}</label>
                <input id="topic-animal" className="input" placeholder={tr('z. B. Hunde aus dem Tierheim, Strassenkatzen, ein alter Hund und sein Mensch')} value={d.topic} onChange={(e) => set({ topic: e.target.value })} />
              </div>
            )}
            {d.niche === 'promo' && (
              <div className="mt-5 space-y-4">
                {profile?.is_admin && (
                  <button type="button" className="btn-outline" onClick={() => setPromo(getLang() === 'de' ? TRUEREEL_PROMO.de : TRUEREEL_PROMO.en)}>
                    <Sparkles className="h-4 w-4" />{tr('Vorlage: TrueReel (nur für dich sichtbar)')}
                  </button>
                )}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="label" htmlFor="promo-product">{tr('Produkt oder Angebot *')}</label>
                    <input id="promo-product" className="input" maxLength={80} placeholder={tr('z. B. Café Sonne, Handyhüllen-Shop, Yoga-Kurs')} value={d.promo.product} onChange={(e) => setPromo({ product: e.target.value })} />
                  </div>
                  <div>
                    <label className="label" htmlFor="promo-link">{tr('Link oder Ort (optional)')}</label>
                    <input id="promo-link" className="input" maxLength={120} placeholder={tr('z. B. meinshop.ch oder „Bahnhofstrasse 5, Zürich“')} value={d.promo.link} onChange={(e) => setPromo({ link: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label className="label" htmlFor="promo-audience">{tr('Für wen? (optional)')}</label>
                  <input id="promo-audience" className="input" maxLength={120} placeholder={tr('z. B. Studierende, junge Familien, Hundebesitzer')} value={d.promo.audience} onChange={(e) => setPromo({ audience: e.target.value })} />
                </div>
                <div>
                  <label className="label" htmlFor="promo-facts">{tr('Vorteile und Fakten *')}</label>
                  <textarea id="promo-facts" className="input min-h-[110px]" maxLength={800} placeholder={tr('z. B. hausgemachte Kuchen jeden Tag frisch · Terrasse mit Seesicht · Mo–Sa ab 7 Uhr offen')} value={d.promo.facts} onChange={(e) => setPromo({ facts: e.target.value })} />
                  <p className="mt-1 text-xs muted">{tr('Die KI verwendet nur, was du hier angibst – keine erfundenen Zahlen, Bewertungen oder Rabatte. Jede Folge zeigt einen anderen Vorteil.')}</p>
                </div>
                <div>
                  <p className="label">{tr('Fotos von deinem Produkt (empfohlen, bis 6)')}</p>
                  <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
                    {d.photos.map((p, i) => (
                      <div key={p.url} className="space-y-1">
                        <div className="relative aspect-square overflow-hidden rounded-lg bg-navy-100 dark:bg-navy-800">
                          <img src={p.url} alt="" className="h-full w-full object-cover" />
                          <button type="button" className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white" onClick={() => setD((x) => ({ ...x, photos: x.photos.filter((_, k) => k !== i) }))} aria-label={tr('Foto entfernen')}><X className="h-3.5 w-3.5" /></button>
                        </div>
                        <input className="input px-2 py-1 text-xs" maxLength={60} placeholder={tr('Was ist zu sehen?')} value={p.label} onChange={(e) => setPhoto(i, { label: e.target.value })} aria-label={tr('Beschreibung Foto {n}', { n: i + 1 })} />
                      </div>
                    ))}
                    {d.photos.length < 6 && (
                      <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-navy-200 text-xs muted dark:border-navy-700">
                        {photoBusy ? <Spinner className="h-5 w-5" /> : <ImagePlus className="h-6 w-6" />}{tr('Foto hinzufügen')}
                        <input type="file" accept="image/*" multiple className="sr-only" onChange={addPhotos} disabled={photoBusy} />
                      </label>
                    )}
                  </div>
                  <p className="mt-1 text-xs muted">{tr('Szenen mit deinem Produkt zeigen diese echten Fotos (ganz, nicht abgeschnitten). Für Alltags-Situationen erstellt die KI passende Bilder. Lade nur Fotos hoch, an denen du die Rechte hast.')}</p>
                </div>
              </div>
            )}
            {d.niche === 'pov' && (
              <div className="mt-5">
                <label className="label" htmlFor="topic-pov">{tr('Epoche oder Ort (optional)')}</label>
                <input id="topic-pov" className="input" placeholder={tr('z. B. Mittelalter, altes Rom, Schweiz um 1900 – leer lassen für Abwechslung')} value={d.topic} onChange={(e) => set({ topic: e.target.value })} />
              </div>
            )}
            {!['characters', 'pov', 'animalstories', 'promo'].includes(d.niche) && (d.niche === 'custom' || !nicheReady(NICHES.find((n) => n.id === d.niche))) && (
              <div className="mt-5">
                <label className="label" htmlFor="topic">{d.niche === 'custom' ? tr("Dein Thema") : tr("Thema präzisieren (optional)")}</label>
                <input id="topic" className="input" placeholder={tr("z. B. Erfindungen aus der Schweiz")} value={d.topic} onChange={(e) => set({ topic: e.target.value })} />
                {d.niche !== 'custom' && <p className="mt-2 text-xs muted">{tr("Prototyp: Diese Nische nutzt aktuell den „Eigenes Thema“-Ablauf. Voll ausgebaut ist „Geschichte“.")}</p>}
              </div>
            )}
          </>
        )}

        {step === 1 && (
          <>
            <h2 className="text-lg font-semibold">{tr("Visueller Stil")}</h2>
            <p className="mb-5 text-sm muted">{tr("Jede Vorschau zeigt ein echtes Beispielbild im jeweiligen Stil.")}</p>
            <ArtStylePicker value={d.artStyle} onChange={(artStyle) => set({ artStyle })} />
            <h3 className="mb-3 mt-8 font-semibold">{tr("Untertitel-Stil")}</h3>
            <CaptionStylePicker value={d.captionStyle} onChange={(captionStyle) => set({ captionStyle })} />
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-lg font-semibold">{tr("Stimme & Sprache")}</h2>
            <p className="mb-5 text-sm muted">{tr('In dieser Sprache werden Skript und Voiceover erstellt. Jede Stimme kannst du vorher anhören.')}</p>
            <VoicePicker language={d.language} voiceId={d.voiceId} onChange={set} />
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="text-lg font-semibold">{tr("Videolänge")}</h2>
            <p className="mb-4 text-sm muted">{tr('So lang wird jedes Video dieser Serie.')} {tr("TikTok zahlt im Creator-Rewards-Programm nur für Videos über 1 Minute.")}</p>
            <div className="mb-8 grid gap-2 sm:grid-cols-3">
              {VIDEO_LENGTHS.map((l) => (
                <button key={l.seconds} type="button" onClick={() => set({ targetSeconds: l.seconds })} className={`option p-3 ${d.targetSeconds === l.seconds ? 'option-active' : ''}`} aria-pressed={d.targetSeconds === l.seconds}>
                  <p className="text-sm font-semibold">{tr(l.label)}</p>
                  <p className="mt-0.5 text-[11px] muted">{tr(l.desc)}</p>
                </button>
              ))}
            </div>
            <h2 className="text-lg font-semibold">{tr("Zeitplan & Plattformen")}</h2>
            <p className="mb-5 text-sm muted">{tr('Zu diesen Zeiten werden freigegebene Videos eingeplant.')} {tr("Plattformen verbindest du später unter „Konto“. Ohne Verbindung kannst du Videos exportieren und manuell posten.")}</p>
            <SchedulePicker schedule={d.schedule} onChange={(schedule) => set({ schedule })} />
            <h3 className="mb-3 mt-6 font-semibold">{tr('Plattformen')} {plan.limits.platforms < 3 && <span className="text-xs font-normal muted">{tr('(dein Plan: max. {n})', { n: plan.limits.platforms || 1 })}</span>}</h3>
            <PlatformPicker value={d.platforms} onChange={(platforms) => set({ platforms })} max={Math.max(1, plan.limits.platforms)} />
            <div className="mt-6 rounded-xl border border-navy-100 p-4 dark:border-navy-800">
              <Toggle id="approval" checked={d.requireApproval} onChange={(requireApproval) => set({ requireApproval })} label={tr("Vor jedem Post Freigabe einholen (empfohlen)")} />
              {!d.requireApproval && <p className="mt-2 text-xs text-amber-700 dark:text-amber-300">{tr("Videos werden nach dem Rendern ohne Rückfrage zum geplanten Zeitpunkt gepostet.")}</p>}
            </div>
            <div className="mt-6 rounded-xl border border-accent-500/40 bg-accent-500/[0.06] p-4">
              <h3 className="font-semibold">{tr('Deine Serie im Überblick')}</h3>
              <p className="mt-0.5 text-xs muted">{tr('Prüfe deine Auswahl. Alles lässt sich auch nach dem Erstellen in der Serie ändern.')}</p>
              <dl className="mt-3 divide-y divide-navy-100 text-sm dark:divide-navy-800">
                {[
                  [tr('Thema'), `${NICHES.find((n) => n.id === d.niche)?.emoji || ''} ${tr(NICHES.find((n) => n.id === d.niche)?.label || '')}${d.niche === 'promo' && d.promo.product.trim() ? ` – ${d.promo.product.trim()}` : d.topic.trim() ? ` – ${d.topic.trim()}` : ''}`, 0],
                  [tr('Stil'), `${tr(ART_STYLES.find((a) => a.id === d.artStyle)?.label || d.artStyle)} · ${tr('Untertitel')}: ${tr(CAPTION_STYLES.find((c) => c.id === d.captionStyle)?.label || d.captionStyle)}`, 1],
                  [tr('Stimme & Sprache'), `${LANGUAGES.find((l) => l.id === d.language)?.label || d.language} · ${tr(VOICES.find((v) => v.id === d.voiceId)?.label || tr('Premium-Stimme'))}`, 2],
                ].map(([k, v, s]) => (
                  <div key={k} className="flex items-center justify-between gap-3 py-2">
                    <dt className="w-32 shrink-0 muted">{k}</dt>
                    <dd className="min-w-0 flex-1 truncate font-medium">{v}</dd>
                    <button type="button" className="shrink-0 text-xs font-semibold text-accent-700 underline dark:text-accent-400" onClick={() => setStep(s)} disabled={!!busy}>{tr('Ändern')}</button>
                  </div>
                ))}
              </dl>
            </div>
          </>
        )}

        {error && <Notice tone="error" className="mt-6">{error}</Notice>}
        {busy && <Notice className="mt-6 flex items-center gap-2"><Spinner />{busy}</Notice>}

        <div className="mt-8 flex justify-between">
          <button className="btn-ghost" onClick={() => setStep(step - 1)} disabled={step === 0 || !!busy}><ArrowLeft className="h-4 w-4" />{tr("Zurück")}</button>
          {step < STEPS.length - 1 ? (
            <button className="btn-primary" onClick={() => setStep(step + 1)} disabled={!canNext}>{tr("Weiter")}<ArrowRight className="h-4 w-4" /></button>
          ) : (
            <button className="btn-primary" onClick={finish} disabled={!!busy}><Sparkles className="h-4 w-4" />{tr("Serie erstellen")}</button>
          )}
        </div>
      </div>
    </div>
  );
}
