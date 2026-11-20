// Anfragen für den Video-Service für Firmen: speichern + Benachrichtigung an info@truereel.ch (Brevo)
import express from 'express';
import crypto from 'node:crypto';
import { admin } from './supabaseAdmin.js';
import { recordEvent } from './analytics.js';

const router = express.Router();
const EMAIL = /^[^\s@]{1,64}@[^\s@]{1,190}\.[a-z]{2,24}$/i;
const clip = (v, n) => (v == null ? null : String(v).trim().slice(0, n) || null);
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const PACKAGES = new Set(['start', 'growth', 'full', 'unsure']);
const recent = new Map();

router.post('/business-inquiry', express.json({ limit: '8kb' }), async (req, res) => {
  const b = req.body || {};
  if (b.website) return res.json({ ok: true }); // Honeypot gegen Bots
  const email = String(b.email || '').trim().toLowerCase();
  if (!EMAIL.test(email)) return res.status(400).json({ error: 'Bitte gib eine gültige E-Mail-Adresse ein.' });
  const ip = crypto.createHash('sha256').update(String(req.headers['x-forwarded-for'] || req.ip || '')).digest('hex').slice(0, 16);
  const n = (recent.get(ip) || 0) + 1; recent.set(ip, n); if (recent.size > 5000) recent.clear();
  if (n > 5) return res.status(429).json({ error: 'Zu viele Versuche. Bitte später erneut.' });

  const lead = {
    name: clip(b.name, 100), company: clip(b.company, 120), email, phone: clip(b.phone, 40),
    industry: clip(b.industry, 80), package: PACKAGES.has(b.package) ? b.package : 'unsure',
    message: clip(b.message, 2000), lang: b.lang === 'en' ? 'en' : 'de',
    campaign: /^ad-[a-z0-9]{4,12}$/.test(String(b.campaign || '')) ? b.campaign : null,
  };
  if (admin) {
    const { error } = await admin.from('business_leads').insert(lead);
    if (error) return res.status(500).json({ error: 'Anfrage konnte nicht gespeichert werden. Bitte schreib uns an info@truereel.ch.' });
    await recordEvent('lead', { req, path: '/firmen' });
  }
  if (process.env.BREVO_API_KEY) {
    const rows = [['Name', lead.name], ['Firma', lead.company], ['E-Mail', lead.email], ['Telefon', lead.phone], ['Branche', lead.industry], ['Paket', lead.package], ['Sprache', lead.lang], ['Nachricht', lead.message]];
    await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: { 'api-key': process.env.BREVO_API_KEY, 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        sender: { name: 'TrueReel', email: 'noreply@truereel.ch' },
        to: [{ email: 'info@truereel.ch', name: 'TrueReel' }],
        replyTo: { email: lead.email, name: lead.name || lead.company || lead.email },
        subject: `Neue Firmen-Anfrage: ${lead.company || lead.name || lead.email}`,
        htmlContent: `<h2>Neue Anfrage für den Video-Service</h2><table cellpadding="6">${rows.map(([k, v]) => `<tr><td><b>${k}</b></td><td>${esc(v || '–').replace(/\n/g, '<br>')}</td></tr>`).join('')}</table><p>Einfach auf diese Mail antworten – die Antwort geht direkt an die Firma.</p>`,
        tags: ['business-lead'],
      }),
    }).catch((e) => console.error('[lead-mail]', e.message));
  }
  res.json({ ok: true });
});

export default router;
