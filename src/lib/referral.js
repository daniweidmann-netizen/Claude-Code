// Partner-Links: ?ref=code merken (60 Tage, nur in diesem Browser) und nach dem Login einmalig dem Konto zuordnen.
import { api } from './api.js';

const KEY = 'tr-ref';
const DAYS = 60;

export function captureRef() {
  try {
    const code = new URLSearchParams(window.location.search).get('ref');
    if (code && /^[a-z0-9-]{3,32}$/i.test(code)) localStorage.setItem(KEY, JSON.stringify({ code: code.toLowerCase(), at: Date.now() }));
  } catch { /* egal */ }
}

export async function attachRef() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return;
    const { code, at } = JSON.parse(raw);
    if (!code || Date.now() - at > DAYS * 864e5) { localStorage.removeItem(KEY); return; }
    await api('/affiliate/attach', { method: 'POST', body: { code } });
    localStorage.removeItem(KEY);
  } catch { /* egal */ }
}
