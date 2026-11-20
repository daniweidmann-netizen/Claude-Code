// Partner-Links: ?ref=code merken (60 Tage, nur in diesem Browser) und nach dem Login einmalig dem Konto zuordnen.
import { api } from './api.js';

const KEY = 'tr-ref';
const DAYS = 60;

export function captureRef() {
  captureAd();
  try {
    const code = new URLSearchParams(window.location.search).get('ref');
    if (code && /^[a-z0-9-]{3,32}$/i.test(code)) localStorage.setItem(KEY, JSON.stringify({ code: code.toLowerCase(), at: Date.now() }));
  } catch { /* egal */ }
}

// Werbe-Links: ?utm_campaign=ad-xxxx merken (30 Tage, letzter Werbe-Klick zählt)
const AD_KEY = 'tr-ad';
export function adCampaign() {
  try {
    const a = JSON.parse(localStorage.getItem(AD_KEY) || 'null');
    return a?.code && Date.now() - a.at < 30 * 864e5 ? a.code : null;
  } catch { return null; }
}
function captureAd() {
  try {
    const c = new URLSearchParams(window.location.search).get('utm_campaign');
    if (c && /^ad-[a-z0-9]{4,12}$/i.test(c)) localStorage.setItem(AD_KEY, JSON.stringify({ code: c.toLowerCase(), at: Date.now() }));
  } catch { /* egal */ }
}

export async function attachRef() {
  const ad = adCampaign();
  if (ad) api('/campaign/attach', { method: 'POST', body: { code: ad } }).then(() => { try { localStorage.removeItem(AD_KEY); } catch { /* egal */ } }).catch(() => {});
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return;
    const { code, at } = JSON.parse(raw);
    if (!code || Date.now() - at > DAYS * 864e5) { localStorage.removeItem(KEY); return; }
    await api('/affiliate/attach', { method: 'POST', body: { code } });
    localStorage.removeItem(KEY);
  } catch { /* egal */ }
}
