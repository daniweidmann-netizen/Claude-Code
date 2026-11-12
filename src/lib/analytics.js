// Cookie-freie Statistik: meldet Seitenaufrufe und wenige Ereignisse an /api/track.
// Kein Cookie, kein localStorage. Herkunft (Referrer, UTM) wird nur beim ersten Aufruf mitgeschickt.
import { getLang } from '../i18n/index.jsx';

let first = true;

export function track(type = 'pageview', path = window.location.pathname) {
  try {
    if (navigator.doNotTrack === '1' || /localhost|127\.0\.0\.1/.test(window.location.hostname)) return;
    const body = { type, path, lang: getLang() };
    if (first && type === 'pageview') {
      const q = new URLSearchParams(window.location.search);
      Object.assign(body, {
        referrer: document.referrer || null,
        utm_source: q.get('utm_source') || q.get('ref'),
        utm_medium: q.get('utm_medium'),
        utm_campaign: q.get('utm_campaign'),
      });
      first = false;
    }
    fetch('/api/track', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), keepalive: true }).catch(() => {});
  } catch { /* Statistik darf nie die App stören */ }
}
