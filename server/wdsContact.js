// Kontaktformular der Corporate-Website „Weidmann Digital Solutions“ → E-Mail an den Inhaber (Brevo).
// Eigener CORS-Bereich, weil die Website auf einer anderen Domain läuft. Schutz: Honeypot + max. 5 Anfragen/Stunde pro IP.
import express from 'express';
import cors from 'cors';
import { SITE } from '../src/config/site.js';

const router = express.Router();
const origins = () => (process.env.WDS_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean);
const corsMw = cors({ origin: (o, cb) => cb(null, !o || !origins().length || origins().includes(o)), methods: ['POST'] });
const EMAIL = /^[^\s@]{1,64}@[^\s@]{1,190}\.[a-z]{2,24}$/i;
const clip = (v, n) => String(v ?? '').trim().slice(0, n);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const hits = new Map();
const ipOf = (req) => (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',').map((s) => s.trim()).filter(Boolean).at(-1) || 'x';

router.options('/wds/contact', corsMw);
router.post('/wds/contact', corsMw, express.json({ limit: '16kb' }), async (req, res) => {
  const b = req.body || {};
  if (b.website) return res.json({ ok: true }); // Honeypot
  const now = Date.now(); const ip = ipOf(req);
  const list = (hits.get(ip) || []).filter((t) => now - t < 3600e3);
  if (list.length >= 5) return res.status(429).json({ error: 'too_many' });
  hits.set(ip, [...list, now]); if (hits.size > 5000) hits.clear();
  const d = { name: clip(b.name, 100), email: clip(b.email, 190).toLowerCase(), company: clip(b.company, 120), subject: clip(b.subject, 140), message: clip(b.message, 4000), lang: b.lang === 'en' ? 'en' : 'de' };
  if (!d.name || !EMAIL.test(d.email) || !d.subject || !d.message) return res.status(400).json({ error: 'invalid' });
  if (!process.env.BREVO_API_KEY) return res.status(503).json({ error: 'mail_not_configured' });
  const to = process.env.WDS_CONTACT_TO || SITE.contactEmail;
  const rows = [['Name', d.name], ['E-Mail', d.email], ['Unternehmen', d.company || '–'], ['Betreff', d.subject], ['Sprache', d.lang]];
  const r = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'api-key': process.env.BREVO_API_KEY, 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      sender: { name: 'Weidmann Digital Solutions', email: 'noreply@truereel.ch' },
      to: [{ email: to }], replyTo: { email: d.email, name: d.name },
      subject: `Neue Anfrage (Website): ${d.subject}`,
      htmlContent: `<p><b>Neue Anfrage über die Website von Weidmann Digital Solutions</b></p><table>${rows.map(([k, v]) => `<tr><td style="padding:2px 12px 2px 0;color:#666">${k}</td><td>${esc(v)}</td></tr>`).join('')}</table><p style="white-space:pre-wrap;margin-top:16px">${esc(d.message)}</p>`,
      textContent: `${rows.map(([k, v]) => `${k}: ${v}`).join('\n')}\n\n${d.message}`,
      tags: ['wds-contact'],
    }),
  }).catch(() => null);
  if (!r?.ok) return res.status(502).json({ error: 'send_failed' });
  res.json({ ok: true });
});

export default router;
