// Alarm, wenn ein KI-Schlüssel ungültig wird: prüft alle 6 Stunden Anthropic und OpenAI (ElevenLabs-Schlüssel sind oft eingeschränkt – kein sicherer Test ohne Kosten)
// und schickt dem Inhaber eine Mail (höchstens einmal pro Tag und Dienst). Prüfung kostet nichts (nur Modell-Listen).
import { sendMail } from './reminders.js';
import { SITE } from '../src/config/site.js';

const CHECKS = [
  { id: 'anthropic', name: 'Anthropic (Skripte)', env: 'ANTHROPIC_API_KEY', url: 'https://api.anthropic.com/v1/models?limit=1', headers: (k) => ({ 'x-api-key': k, 'anthropic-version': '2023-06-01' }), fix: 'https://console.anthropic.com/settings/keys' },
  { id: 'openai', name: 'OpenAI (Bilder & Standard-Stimmen)', env: 'OPENAI_API_KEY', url: 'https://api.openai.com/v1/models', headers: (k) => ({ Authorization: `Bearer ${k}` }), fix: 'https://platform.openai.com/api-keys' },
];
const lastAlert = {};
export const keyStatus = {};

export async function checkKeys() {
  const broken = [];
  for (const c of CHECKS) {
    const key = process.env[c.env];
    if (!key) continue;
    try {
      const r = await fetch(c.url, { headers: c.headers(key), signal: AbortSignal.timeout(15000) });
      // 401/403 = Schlüssel ungültig oder gesperrt; andere Fehler (z. B. 5xx) sind meist kurzfristige Störungen
      let bad = r.status === 401 || r.status === 403;
      // Eingeschränkte Schlüssel (z. B. ElevenLabs nur für Sprachausgabe) melden fehlende Rechte – der Schlüssel selbst ist gültig
      if (bad) { const body = await r.text().catch(() => ''); if (/missing_permission|permission/i.test(body) && !/invalid/i.test(body)) bad = false; }
      keyStatus[c.id] = bad ? 'ungueltig' : r.ok || r.status === 401 || r.status === 403 ? 'ok' : `http-${r.status}`;
      if (bad) broken.push(c);
    } catch { keyStatus[c.id] = 'nicht-erreichbar'; }
  }
  const due = broken.filter((c) => Date.now() - (lastAlert[c.id] || 0) > 24 * 3600e3);
  if (!due.length || !process.env.BREVO_API_KEY) return { broken: broken.map((c) => c.id) };
  due.forEach((c) => { lastAlert[c.id] = Date.now(); });
  const lines = due.map((c) => `• ${c.name}: Schlüssel ungültig. Neuen Schlüssel erstellen: ${c.fix} – dann bei Render als ${c.env} eintragen: https://dashboard.render.com/web/srv-dbphbo0m7kps73aulfrg/env`);
  const text = `Achtung: Bei TrueReel funktioniert ein Dienst nicht mehr.\n\n${lines.join('\n')}\n\nSolange der Schlüssel ungültig ist, können Kunden keine Videos erstellen.`;
  const html = `<p><b>Achtung: Bei TrueReel funktioniert ein Dienst nicht mehr.</b></p><ul>${due.map((c) => `<li>${c.name}: Schlüssel ungültig. <a href="${c.fix}">Neuen Schlüssel erstellen</a> und bei <a href="https://dashboard.render.com/web/srv-dbphbo0m7kps73aulfrg/env">Render</a> als <code>${c.env}</code> eintragen.</li>`).join('')}</ul><p>Solange der Schlüssel ungültig ist, können Kunden keine Videos erstellen.</p>`;
  try { await sendMail(SITE.contactEmail, { subject: '⚠️ TrueReel: KI-Schlüssel ungültig', html, text }, 'owner', 'key-alert'); } catch (e) { console.error('[key-alert]', e.message); }
  return { broken: broken.map((c) => c.id), alerted: due.map((c) => c.id) };
}
