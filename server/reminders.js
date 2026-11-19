// Einmalige Erinnerungs-Mail: Wer ein Video erstellt, es aber nach 24 Stunden noch nicht exportiert hat,
// bekommt genau eine freundliche Mail (DE/EN) mit Abmelde-Link. Versand über Brevo (BREVO_API_KEY).
import crypto from 'node:crypto';
import express from 'express';
import { admin } from './supabaseAdmin.js';
import { config } from './config.js';

const APP = () => config.appUrl || 'https://truereel.ch';
const secret = () => crypto.createHash('sha256').update(`truereel-unsubscribe:${process.env.SUPABASE_SERVICE_ROLE_KEY || ''}`).digest();
const unsubToken = (uid) => crypto.createHmac('sha256', secret()).update(uid).digest('base64url').slice(0, 32);
export const unsubUrl = (uid) => `${APP()}/api/email/unsubscribe?u=${uid}&t=${unsubToken(uid)}`;
export const esc = (s) => String(s || '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const TEXT = {
  de: {
    subject: 'Dein TrueReel-Video wartet auf dich 🎬',
    hello: (n) => (n ? `Hallo ${n},` : 'Hallo,'),
    body: (t) => `dein Video „${t}“ ist erstellt – es fehlt nur noch der letzte Schritt: Öffne es, tippe auf „Exportieren 1080p“ und lade es herunter. Danach kannst du es direkt auf TikTok, Instagram oder YouTube posten.`,
    free: 'Tipp: Mit einem Plan erstellst du regelmässig neue Videos – ohne Wasserzeichen und auf Wunsch automatisch gepostet.',
    button: 'Video öffnen',
    footer: 'Du bekommst diese Erinnerung nur einmal. Keine weiteren Mails dieser Art:',
    unsub: 'abmelden',
  },
  en: {
    subject: 'Your TrueReel video is waiting for you 🎬',
    hello: (n) => (n ? `Hi ${n},` : 'Hi,'),
    body: (t) => `your video “${t}” has been created – only the last step is missing: open it, tap “Export 1080p” and download it. Then you can post it straight to TikTok, Instagram or YouTube.`,
    free: 'Tip: with a plan you get new videos regularly – without watermark and, if you like, posted automatically.',
    button: 'Open video',
    footer: 'You only get this reminder once. No more emails like this:',
    unsub: 'unsubscribe',
  },
};

function render(lang, { name, title, videoId, isFree, uid }) {
  const t = TEXT[lang] || TEXT.de;
  const link = `${APP()}/app/video/${videoId}`;
  const html = `<!doctype html><html><body style="margin:0;background:#f4f5f7;font-family:Inter,Arial,sans-serif;color:#14171f">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 16px">
<table role="presentation" width="100%" style="max-width:520px;background:#fff;border-radius:16px" cellpadding="0" cellspacing="0">
<tr><td style="padding:28px 28px 8px"><img src="${APP()}/logo-email.png" alt="TrueReel" height="32" style="height:32px"></td></tr>
<tr><td style="padding:8px 28px;font-size:16px;line-height:1.6">
<p>${esc(t.hello(name))}</p><p>${esc(t.body(title))}</p>${isFree ? `<p>${esc(t.free)}</p>` : ''}
<p style="padding:8px 0 4px"><a href="${link}" style="display:inline-block;background:#cbef3f;color:#14171f;text-decoration:none;font-weight:700;padding:14px 26px;border-radius:999px">${esc(t.button)}</a></p>
</td></tr>
<tr><td style="padding:16px 28px 28px;font-size:12px;line-height:1.6;color:#6b717d">${esc(t.footer)} <a href="${unsubUrl(uid)}" style="color:#6b717d">${esc(t.unsub)}</a><br>Truereel · Chriesiweg 4 · 8310 Grafstal · Schweiz</td></tr>
</table></td></tr></table></body></html>`;
  const text = `${t.hello(name)}\n\n${t.body(title)}\n${isFree ? `\n${t.free}\n` : ''}\n${t.button}: ${link}\n\n${t.footer} ${unsubUrl(uid)}\nTruereel · Chriesiweg 4 · 8310 Grafstal · Schweiz`;
  return { subject: t.subject, html, text };
}

export async function sendMail(to, { subject, html, text }, uid, tag = 'reminder-export') {
  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'api-key': process.env.BREVO_API_KEY, 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      sender: { name: 'TrueReel', email: 'noreply@truereel.ch' },
      replyTo: { email: 'info@truereel.ch', name: 'TrueReel' },
      to: [{ email: to }],
      subject, htmlContent: html, textContent: text,
      headers: { 'List-Unsubscribe': `<${unsubUrl(uid)}>`, 'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click' },
      tags: [tag],
    }),
  });
  if (!res.ok) throw new Error(`Brevo ${res.status}: ${(await res.text()).slice(0, 160)}`);
}

let lastRun = 0;
export async function sendReminders({ force = false } = {}) {
  if (!admin || !process.env.BREVO_API_KEY) return { skipped: 'nicht konfiguriert' };
  if (!force && Date.now() - lastRun < 55 * 60_000) return { skipped: 'zu früh' }; // höchstens einmal pro Stunde
  lastRun = Date.now();
  const now = Date.now();
  const { data: vids, error } = await admin.from('videos')
    .select('id,user_id,title,created_at')
    .is('video_path', null)
    .lt('created_at', new Date(now - 24 * 3600_000).toISOString())
    .gt('created_at', new Date(now - 7 * 24 * 3600_000).toISOString())
    .order('created_at', { ascending: true });
  if (error) throw error;
  const firstByUser = new Map();
  for (const v of vids || []) if (!firstByUser.has(v.user_id)) firstByUser.set(v.user_id, v);
  let sent = 0;
  for (const [uid, v] of firstByUser) {
    const { data: p } = await admin.from('profiles').select('email,full_name,plan,is_admin,reminder_sent_at,email_opt_out').eq('id', uid).maybeSingle();
    if (!p || p.is_admin || p.reminder_sent_at || p.email_opt_out || !p.email || /@truereel\.ch$/i.test(p.email)) continue;
    // Hat die Person inzwischen irgendein Video exportiert? Dann keine Erinnerung.
    const { count: exported } = await admin.from('videos').select('id', { count: 'exact', head: true }).eq('user_id', uid).not('video_path', 'is', null);
    if (exported) continue;
    const { data: au } = await admin.auth.admin.getUserById(uid);
    const lang = au?.user?.user_metadata?.lang === 'en' ? 'en' : 'de';
    const name = (p.full_name || '').split(' ')[0].slice(0, 40);
    // Zuerst markieren, damit bei einem Fehler nie doppelt gesendet wird
    const { data: claimed } = await admin.from('profiles').update({ reminder_sent_at: new Date().toISOString() }).eq('id', uid).is('reminder_sent_at', null).select('id');
    if (!claimed?.length) continue;
    try {
      await sendMail(p.email, render(lang, { name, title: v.title || 'TrueReel', videoId: v.id, isFree: (p.plan || 'free') === 'free', uid }), uid);
      sent++;
    } catch (e) { console.error('[reminder]', e.message); }
  }
  if (sent) console.log(`[reminder] ${sent} Erinnerung(en) gesendet`);
  return { sent };
}

// Abmelde-Link aus der Mail (GET aus dem Mailprogramm, POST für One-Click-Abmeldung)
export const reminderRouter = express.Router();
const unsubscribe = async (req, res) => {
  const uid = String(req.query.u || '');
  const ok = /^[0-9a-f-]{36}$/i.test(uid) && String(req.query.t || '') === unsubToken(uid);
  if (ok && admin) await admin.from('profiles').update({ email_opt_out: true }).eq('id', uid);
  if (req.method === 'POST') return res.status(ok ? 200 : 400).end();
  res.status(ok ? 200 : 400).type('html').send(`<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><body style="font-family:Inter,Arial,sans-serif;background:#1b1e24;color:#fff;display:flex;min-height:100vh;align-items:center;justify-content:center;margin:0;padding:24px;text-align:center"><div><h1 style="font-size:22px">${ok ? 'Abgemeldet ✓ / Unsubscribed ✓' : 'Link ungültig / Invalid link'}</h1><p style="color:#c9ccd3">${ok ? 'Du bekommst keine Erinnerungs- und Tipp-Mails mehr. / You will not receive reminder or tip emails anymore.' : ''}</p><p><a href="${APP()}" style="color:#cbef3f">truereel.ch</a></p></div>`);
};
reminderRouter.get('/email/unsubscribe', unsubscribe);
reminderRouter.post('/email/unsubscribe', unsubscribe);
