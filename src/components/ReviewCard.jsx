// Bewertungs-Karte im Dashboard: Sterne, Text, Erlaubnis zur Veröffentlichung.
import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { api } from '../lib/api.js';
import { translate as tr, getLang } from '../i18n/index.jsx';
import { Notice, Spinner } from './ui.jsx';

export default function ReviewCard({ firstName }) {
  const [state, setState] = useState('loading'); // loading | form | done | hidden
  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');
  const [name, setName] = useState(firstName || '');
  const [publishOk, setPublishOk] = useState(true);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    let dismissed = false;
    try { dismissed = localStorage.getItem('tr-review-hide') === '1'; } catch { /* egal */ }
    api('/reviews/mine').then(({ review }) => {
      if (review) setState('done'); else setState(dismissed ? 'hidden' : 'form');
    }).catch(() => setState('hidden'));
  }, []);

  if (state === 'loading' || state === 'hidden') return null;
  if (state === 'done') return null;

  const submit = async (e) => {
    e.preventDefault();
    if (!rating) return setMsg({ tone: 'warn', text: tr('Bitte wähle zuerst 1 bis 5 Sterne.') });
    setBusy(true); setMsg(null);
    try {
      await api('/reviews', { method: 'POST', body: { rating, text, displayName: name, publishOk, lang: getLang() } });
      setMsg({ tone: 'success', text: tr('Danke für deine Bewertung! 🙏') });
      setTimeout(() => setState('done'), 2500);
    } catch (err) { setMsg({ tone: 'error', text: err.message }); }
    setBusy(false);
  };

  return (
    <section className="card mb-6 p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold">{tr('Wie gefällt dir TrueReel?')}</h2>
          <p className="mt-0.5 text-sm muted">{tr('Deine ehrliche Meinung hilft uns – und anderen Creators bei der Entscheidung.')}</p>
        </div>
        <button type="button" className="text-xs muted underline" onClick={() => { try { localStorage.setItem('tr-review-hide', '1'); } catch { /* egal */ } setState('hidden'); }}>{tr('Später')}</button>
      </div>
      <form onSubmit={submit} className="mt-4 space-y-3">
        <div className="flex gap-1" role="radiogroup" aria-label={tr('Sterne')}>
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} type="button" role="radio" aria-checked={rating === n} aria-label={`${n}`} onClick={() => setRating(n)} className="p-1">
              <Star className={`h-8 w-8 ${n <= rating ? 'fill-accent-500 text-accent-500' : 'text-navy-300 dark:text-navy-600'}`} />
            </button>
          ))}
        </div>
        <textarea className="input min-h-[80px]" maxLength={600} placeholder={tr('Was gefällt dir? Was können wir besser machen? (optional)')} value={text} onChange={(e) => setText(e.target.value)} aria-label={tr('Deine Bewertung')} />
        <div className="grid gap-3 sm:grid-cols-2">
          <input className="input" maxLength={40} placeholder={tr('Vorname (wird angezeigt)')} value={name} onChange={(e) => setName(e.target.value)} aria-label={tr('Vorname')} />
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={publishOk} onChange={(e) => setPublishOk(e.target.checked)} />{tr('Darf mit meinem Vornamen auf truereel.ch gezeigt werden')}</label>
        </div>
        {msg && <Notice tone={msg.tone}>{msg.text}</Notice>}
        <button className="btn-primary" disabled={busy}>{busy && <Spinner />}{tr('Bewertung senden')}</button>
      </form>
    </section>
  );
}
