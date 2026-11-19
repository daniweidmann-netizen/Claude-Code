// Kurze, freiwillige Frage nach der Herkunft – erst im Dashboard statt bei der Registrierung (weniger Hürden).
import { useState } from 'react';
import { X } from 'lucide-react';
import { track } from '../lib/analytics.js';
import { translate as tr } from '../i18n/index.jsx';

const SOURCES = [['tiktok', 'TikTok'], ['instagram', 'Instagram'], ['youtube', 'YouTube'], ['google', 'Google-Suche'], ['friends', 'Freunde / Empfehlung'], ['other', 'Sonstiges']];
const KEY = 'tr-source-asked';

export default function SourceCard({ profile }) {
  const [hidden, setHidden] = useState(() => { try { return localStorage.getItem(KEY) === '1'; } catch { return true; } });
  const fresh = profile?.created_at && Date.now() - new Date(profile.created_at).getTime() < 14 * 864e5;
  if (hidden || !fresh || profile?.is_admin) return null;
  const done = (source) => {
    if (source) track('source', '/app/quelle', { source });
    try { localStorage.setItem(KEY, '1'); } catch { /* egal */ }
    setHidden(true);
  };
  return (
    <section className="card mb-6 p-4">
      <div className="flex items-start justify-between gap-3">
        <p className="font-semibold">{tr('Wie hast du von TrueReel erfahren?')} <span className="text-sm font-normal muted">({tr('freiwillig')})</span></p>
        <button type="button" className="btn-icon h-8 w-8" onClick={() => done(null)} aria-label={tr('Schliessen')}><X className="h-4 w-4" /></button>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {SOURCES.map(([id, label]) => <button key={id} type="button" className="btn-outline px-3 py-1.5 text-xs" onClick={() => done(id)}>{tr(label)}</button>)}
      </div>
    </section>
  );
}
