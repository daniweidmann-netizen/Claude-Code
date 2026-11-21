// Posten-Fenster für TikTok nach den Vorgaben der Content Posting API:
// Konto anzeigen, Sichtbarkeit ohne Vorauswahl, Interaktionen, Werbe-Kennzeichnung, Einverständnis-Hinweis.
import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { api } from '../lib/api.js';
import { Notice, Spinner } from './ui.jsx';
import { translate as tr } from '../i18n/index.jsx';

const PRIVACY_LABEL = { PUBLIC_TO_EVERYONE: 'Öffentlich (alle)', MUTUAL_FOLLOW_FRIENDS: 'Freunde', FOLLOWER_OF_CREATOR: 'Follower', SELF_ONLY: 'Nur ich' };

export default function TikTokPostDialog({ defaultTitle, durationSec, onCancel, onConfirm }) {
  const [info, setInfo] = useState(null);
  const [error, setError] = useState('');
  const [o, setO] = useState({ title: defaultTitle || '', privacy: '', allowComment: false, allowDuet: false, allowStitch: false, disclose: false, yourBrand: false, brandedContent: false });
  const set = (p) => setO((x) => ({ ...x, ...p }));
  useEffect(() => { api('/social/tiktok/creator-info').then(setInfo).catch((e) => setError(e.message)); }, []);

  const tooLong = info?.maxDuration && durationSec > info.maxDuration;
  const discloseIncomplete = o.disclose && !o.yourBrand && !o.brandedContent;
  const canPost = info && o.privacy && !tooLong && !discloseIncomplete;
  // Markeninhalt (bezahlte Partnerschaft) darf nicht privat sein
  const privacyOptions = (info?.privacyOptions || []).filter((p) => !(o.brandedContent && p === 'SELF_ONLY'));
  const consent = o.brandedContent
    ? tr('Mit dem Posten stimmst du der Branded Content Policy und der Music Usage Confirmation von TikTok zu.')
    : tr('Mit dem Posten stimmst du der Music Usage Confirmation von TikTok zu.');

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-labelledby="tt-title">
      <div className="card relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-b-none p-6 sm:rounded-2xl">
        <button type="button" className="btn-icon absolute right-3 top-3" onClick={onCancel} aria-label={tr('Schliessen')}><X className="h-5 w-5" /></button>
        <h2 id="tt-title" className="text-xl font-extrabold">{tr('Auf TikTok posten')}</h2>
        {error && <Notice tone="error" className="mt-4">{error}</Notice>}
        {!info && !error && <Spinner className="mt-6 h-6 w-6 text-accent-500" />}
        {info && (
          <div className="mt-4 space-y-5">
            <div className="flex items-center gap-3 rounded-xl bg-navy-50 p-3 dark:bg-navy-800">
              {info.avatar && <img src={info.avatar} alt="" className="h-10 w-10 rounded-full" />}
              <div className="text-sm"><p className="muted">{tr('Wird gepostet auf')}</p><p className="font-bold">{info.nickname}{info.username ? ` (@${info.username})` : ''}</p></div>
            </div>
            {tooLong && <Notice tone="error">{tr('Das Video ist zu lang für dieses TikTok-Konto (max. {s} Sekunden).', { s: info.maxDuration })}</Notice>}
            <div>
              <label className="label" htmlFor="tt-caption">{tr('Beschreibung')}</label>
              <textarea id="tt-caption" className="input min-h-[90px]" maxLength={2200} value={o.title} onChange={(e) => set({ title: e.target.value })} />
            </div>
            <div>
              <label className="label" htmlFor="tt-privacy">{tr('Wer darf das Video sehen?')} *</label>
              <select id="tt-privacy" className="input" value={o.privacy} onChange={(e) => set({ privacy: e.target.value })}>
                <option value="" disabled>{tr('Bitte wählen')}</option>
                {privacyOptions.map((p) => <option key={p} value={p}>{tr(PRIVACY_LABEL[p] || p)}</option>)}
              </select>
              {o.brandedContent && <p className="mt-1 text-xs muted">{tr('Markeninhalte können nicht privat gepostet werden.')}</p>}
            </div>
            <fieldset>
              <legend className="label">{tr('Zuschauer dürfen')}</legend>
              {[['allowComment', 'Kommentieren', info.commentDisabled], ['allowDuet', 'Duett', info.duetDisabled], ['allowStitch', 'Stitch', info.stitchDisabled]].map(([k, label, disabled]) => (
                <label key={k} className={`mt-1 flex items-center gap-2 text-sm ${disabled ? 'opacity-50' : ''}`}>
                  <input type="checkbox" checked={!disabled && o[k]} disabled={disabled} onChange={(e) => set({ [k]: e.target.checked })} />{tr(label)}{disabled ? ` (${tr('in deinem TikTok-Konto deaktiviert')})` : ''}
                </label>
              ))}
            </fieldset>
            <div className="rounded-xl border border-navy-100 p-3 dark:border-navy-800">
              <label className="flex items-center justify-between gap-3 text-sm font-semibold">{tr('Werbung offenlegen')}<input type="checkbox" checked={o.disclose} onChange={(e) => set({ disclose: e.target.checked, yourBrand: false, brandedContent: false })} /></label>
              <p className="mt-1 text-xs muted">{tr('Schalte das ein, wenn das Video für dich, eine Marke, ein Produkt oder eine Dienstleistung wirbt.')}</p>
              {o.disclose && (
                <div className="mt-3 space-y-2 text-sm">
                  <label className="flex items-start gap-2"><input type="checkbox" className="mt-1" checked={o.yourBrand} onChange={(e) => set({ yourBrand: e.target.checked })} /><span><b>{tr('Deine Marke')}</b> – {tr('du bewirbst dich selbst oder dein eigenes Unternehmen. Das Video wird als „Werbeinhalt“ gekennzeichnet.')}</span></label>
                  <label className="flex items-start gap-2"><input type="checkbox" className="mt-1" checked={o.brandedContent} onChange={(e) => set({ brandedContent: e.target.checked, privacy: e.target.checked && o.privacy === 'SELF_ONLY' ? '' : o.privacy })} /><span><b>{tr('Markeninhalt')}</b> – {tr('du bewirbst eine andere Marke oder Dritte. Das Video wird als „Bezahlte Partnerschaft“ gekennzeichnet.')}</span></label>
                  {discloseIncomplete && <p className="text-xs text-red-600 dark:text-red-400">{tr('Bitte wähle mindestens eine Option.')}</p>}
                </div>
              )}
            </div>
            <p className="text-xs muted">{tr('Das Video wird als KI-generierter Inhalt gekennzeichnet.')} {consent}</p>
            <div className="flex flex-col gap-2 sm:flex-row-reverse">
              <button type="button" className="btn-primary" disabled={!canPost} onClick={() => onConfirm({ title: o.title, privacy: o.privacy, allowComment: o.allowComment, allowDuet: o.allowDuet, allowStitch: o.allowStitch, yourBrand: o.disclose && o.yourBrand, brandedContent: o.disclose && o.brandedContent })}>{tr('Auf TikTok posten')}</button>
              <button type="button" className="btn-outline" onClick={onCancel}>{tr('Abbrechen')}</button>
            </div>
            <p className="text-xs muted">{tr('Nach dem Posten kann es einige Minuten dauern, bis das Video auf deinem Profil erscheint.')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
