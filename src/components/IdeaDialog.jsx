import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lightbulb, FileText, X, Wand2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { createVideoForEpisode } from '../lib/videoFlow.js';
import { Notice, Spinner } from './ui.jsx';

// Neues Video aus eigener Idee (KI schreibt) oder eigenem Text (wortgetreu)
export default function IdeaDialog({ series, allSeries, onClose, canCreate, limitText }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState('idea');
  const [seriesId, setSeriesId] = useState(series?.id || allSeries?.[0]?.id || '');
  const [idea, setIdea] = useState('');
  const [notes, setNotes] = useState('');
  const [ownText, setOwnText] = useState('');
  const [title, setTitle] = useState('');
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const target = (allSeries || [series]).find((s) => s?.id === seriesId);
  const words = ownText.trim() ? ownText.trim().split(/\s+/).length : 0;
  const estSeconds = Math.round(words / 2.1);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!target) return setError('Bitte zuerst eine Serie anlegen.');
    if (mode === 'idea' && idea.trim().length < 5) return setError('Beschreibe deine Idee in ein paar Worten.');
    if (mode === 'text' && words < 10) return setError('Dein Text ist sehr kurz – mindestens ein paar Sätze.');
    setBusy('Wird vorbereitet …');
    try {
      const v = await createVideoForEpisode(user, target, null, setBusy, mode === 'idea'
        ? { idea: idea.trim(), notes: notes.trim(), title: title.trim() || undefined }
        : { ownText: ownText.trim(), title: title.trim() || undefined });
      navigate(`/app/video/${v.id}`);
    } catch (err) {
      setError(err.message);
      setBusy('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-navy-950/60 p-0 sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-label="Eigenes Video">
      <form onSubmit={submit} className="card max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-b-none p-5 sm:rounded-2xl sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">Eigenes Video</h2>
          <button type="button" className="btn-icon" onClick={onClose} aria-label="Schliessen"><X className="h-5 w-5" /></button>
        </div>

        <div className="mb-5 grid grid-cols-2 gap-2">
          <button type="button" onClick={() => setMode('idea')} className={`option p-3 ${mode === 'idea' ? 'option-active' : ''}`} aria-pressed={mode === 'idea'}>
            <p className="flex items-center gap-2 text-sm font-semibold"><Lightbulb className="h-4 w-4" />Eigene Idee</p>
            <p className="mt-0.5 text-[11px] muted">Du gibst das Thema vor, die KI schreibt das Skript.</p>
          </button>
          <button type="button" onClick={() => setMode('text')} className={`option p-3 ${mode === 'text' ? 'option-active' : ''}`} aria-pressed={mode === 'text'}>
            <p className="flex items-center gap-2 text-sm font-semibold"><FileText className="h-4 w-4" />Eigener Text</p>
            <p className="mt-0.5 text-[11px] muted">Dein fertiges Skript – wird wortgetreu übernommen.</p>
          </button>
        </div>

        {allSeries?.length > 1 && (
          <div className="mb-4">
            <label className="label" htmlFor="idea-series">Serie (Stil, Stimme, Sprache, Länge)</label>
            <select id="idea-series" className="input" value={seriesId} onChange={(e) => setSeriesId(e.target.value)}>
              {allSeries.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
            </select>
          </div>
        )}

        {mode === 'idea' ? (
          <div className="space-y-4">
            <div>
              <label className="label" htmlFor="idea">Deine Idee *</label>
              <textarea id="idea" className="input min-h-[90px]" maxLength={1500} placeholder="z. B. Warum die Schweiz vier Landessprachen hat – und wie das im Alltag funktioniert" value={idea} onChange={(e) => setIdea(e.target.value)} />
            </div>
            <div>
              <label className="label" htmlFor="notes">Stichpunkte, Fakten oder Wünsche (optional)</label>
              <textarea id="notes" className="input min-h-[80px]" maxLength={3000} placeholder={'z. B. • Rätoromanisch erwähnen\n• lustiger Ton\n• am Schluss Frage an die Zuschauer'} value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>
            <p className="text-xs muted">Länge, Sprache, Stimme und Stil kommen aus der Serie „{target?.title}“. Bitte Fakten im fertigen Skript kurz gegenlesen.</p>
          </div>
        ) : (
          <div className="space-y-2">
            <label className="label" htmlFor="own">Dein Skript *</label>
            <textarea id="own" className="input min-h-[200px]" maxLength={6000} placeholder={'Erster Satz = Hook.\n\nLeere Zeile = neue Szene.\n\nLetzter Satz = Call-to-Action.'} value={ownText} onChange={(e) => setOwnText(e.target.value)} />
            <p className="text-xs muted">
              {words} Wörter · ca. {estSeconds} s gesprochen
              {(target?.target_seconds || 65) >= 60 && words > 0 && estSeconds < 60 && <span className="text-amber-700 dark:text-amber-300"> · für TikTok-Monetarisierung über 60 s nötig (ca. {Math.ceil(60 * 2.1)} Wörter)</span>}
            </p>
            <p className="text-xs muted">Tipp: Absätze mit einer Leerzeile trennen – jeder Absatz wird eine Szene.</p>
          </div>
        )}

        <div className="mt-4">
          <label className="label" htmlFor="idea-title">Titel (optional)</label>
          <input id="idea-title" className="input" maxLength={90} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="wird sonst automatisch erstellt" />
        </div>

        {!canCreate && <Notice tone="warn" className="mt-4">{limitText}</Notice>}
        {error && <Notice tone="error" className="mt-4">{error}</Notice>}
        {busy && <Notice className="mt-4 flex items-center gap-2"><Spinner />{busy}</Notice>}

        <div className="mt-6 flex justify-end gap-2">
          <button type="button" className="btn-ghost" onClick={onClose} disabled={!!busy}>Abbrechen</button>
          <button className="btn-primary" disabled={!!busy || !canCreate}><Wand2 className="h-4 w-4" />Video erstellen</button>
        </div>
      </form>
    </div>
  );
}
