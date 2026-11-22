// Partner-Programm: Bewerbung externer Partner, Zuordnung neuer Nutzer zu Partner-Links,
// Auswertung (Umsatz, Gewinn, Provision) und Auszahlungen für den Inhaber.
import express from 'express';
import { admin, authenticate, getProfile } from './supabaseAdmin.js';
import { stripe } from './stripe.js';

const router = express.Router();
const CODE = /^[a-z0-9-]{3,32}$/;
const EMAIL = /^[^\s@]{1,64}@[^\s@]{1,190}\.[a-z]{2,24}$/i;
const METHODS = new Set(['iban', 'twint', 'wise', 'paypal', 'later']);
const clip = (v, n) => String(v ?? '').trim().slice(0, n);
const esc = (s) => String(s || '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const newCode = () => { const a = 'abcdefghjkmnpqrstuvwxyz23456789'; return 'p' + Array.from({ length: 6 }, () => a[Math.floor(Math.random() * a.length)]).join(''); };
const linkFor = (code) => `https://truereel.ch/?ref=${code}`;

async function mail({ to, replyTo, subject, html, tag }) {
  if (!process.env.BREVO_API_KEY) return false;
  const r = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'api-key': process.env.BREVO_API_KEY, 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ sender: { name: 'TrueReel', email: 'noreply@truereel.ch' }, to: [{ email: to }], replyTo: replyTo || { email: 'info@truereel.ch', name: 'TrueReel' }, subject, htmlContent: html, tags: [tag] }),
  }).catch((e) => { console.error('[partner-mail]', e.message); return null; });
  return !!r?.ok;
}

// Neuer Nutzer kam über einen Partner-Link → einmalig zuordnen (nur in den ersten 14 Tagen nach der Registrierung)
router.post('/affiliate/attach', authenticate, express.json({ limit: '1kb' }), async (req, res) => {
  if (!admin) return res.json({ ok: true });
  const code = String(req.body?.code || '').toLowerCase();
  if (!CODE.test(code)) return res.json({ ok: false });
  const p = await getProfile(req.user.id);
  if (!p || p.referred_by || p.is_admin) return res.json({ ok: false });
  if (Date.now() - new Date(p.created_at || 0).getTime() > 14 * 864e5) return res.json({ ok: false });
  const { data: a } = await admin.from('affiliates').select('code,email').eq('code', code).eq('active', true).maybeSingle();
  if (!a) return res.json({ ok: false });
  // Keine Provision auf das eigene Konto
  if (a.email && req.user.email && a.email.toLowerCase() === String(req.user.email).toLowerCase()) return res.json({ ok: false });
  await admin.from('profiles').update({ referred_by: code, referred_at: new Date().toISOString() }).eq('id', req.user.id).is('referred_by', null);
  res.json({ ok: true });
});

// Öffentliche Bewerbung fürs Partner-Programm (ohne Konto). Schutz: Honeypot + max. 3 Bewerbungen pro Stunde und IP.
const hits = new Map();
router.post('/affiliate/apply', express.json({ limit: '8kb' }), async (req, res) => {
  const b = req.body || {};
  if (b.website) return res.json({ ok: true }); // Honeypot
  const ip = String(req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',').map((s) => s.trim()).filter(Boolean).at(-1) || 'x';
  const now = Date.now(); const list = (hits.get(ip) || []).filter((t) => now - t < 3600e3);
  if (list.length >= 3) return res.status(429).json({ error: 'too_many' });
  const d = {
    name: clip(b.name, 60), email: clip(b.email, 190).toLowerCase(), country: clip(b.country, 60), channel: clip(b.channel, 400),
    payout_method: METHODS.has(b.payoutMethod) ? b.payoutMethod : 'later', payout_details: clip(b.payoutDetails, 200), lang: b.lang === 'en' ? 'en' : 'de',
  };
  if (d.name.length < 2 || !EMAIL.test(d.email) || d.channel.length < 5 || b.terms !== true) return res.status(400).json({ error: 'invalid' });
  if (d.payout_method !== 'later' && d.payout_details.length < 4) return res.status(400).json({ error: 'invalid' });
  if (!admin) return res.status(503).json({ error: 'not_configured' });
  hits.set(ip, [...list, now]); if (hits.size > 5000) hits.clear();
  const { data: dup } = await admin.from('affiliates').select('code,status').ilike('email', d.email).limit(1);
  if (dup?.length) return res.status(409).json({ error: 'exists' });
  const code = newCode();
  const { error } = await admin.from('affiliates').insert({ code, ...d, kind: 'external', status: 'pending', active: false, applied_at: new Date().toISOString() });
  if (error) { console.error('[partner-apply]', error.message); return res.status(500).json({ error: 'save_failed' }); }
  const rows = [['Name', d.name], ['E-Mail', d.email], ['Land', d.country || '–'], ['Wo wird geworben', d.channel], ['Auszahlung', d.payout_method], ['Sprache', d.lang]];
  await mail({
    to: 'info@truereel.ch', replyTo: { email: d.email, name: d.name }, tag: 'partner-application',
    subject: `Neue Partner-Bewerbung: ${d.name}`,
    html: `<h2>Neue Bewerbung fürs Partner-Programm</h2><table cellpadding="6">${rows.map(([k, v]) => `<tr><td><b>${k}</b></td><td>${esc(v).replace(/\n/g, '<br>')}</td></tr>`).join('')}</table><p>Freischalten oder ablehnen: <a href="https://truereel.ch/app/partner">truereel.ch/app/partner</a>. Die Zahlungsangaben stehen dort (nicht in dieser Mail).</p>`,
  });
  res.json({ ok: true });
});

async function requireAdmin(req, res, next) {
  if (!admin) return res.json({ demo: true });
  const p = await getProfile(req.user.id);
  if (!p?.is_admin) return res.status(403).json({ error: 'Kein Zugriff' });
  next();
}

async function settings() {
  const [{ data: a }, { data: f }] = await Promise.all([
    admin.from('app_settings').select('value').eq('key', 'affiliate').maybeSingle(),
    admin.from('app_settings').select('value').eq('key', 'finance').maybeSingle(),
  ]);
  const legacy = Number(a?.value?.commissionPercent ?? 20);
  return {
    friendPercent: Number(a?.value?.friendPercent ?? 30), externalPercent: Number(a?.value?.externalPercent ?? legacy),
    stripePercent: Number(f?.value?.stripePercent ?? 7), stripeFixed: Number(f?.value?.stripeFixed ?? 0.3),
    aiCostPerVideo: Number(f?.value?.aiCostPerVideo ?? 0.15), premiumExtraPerVideo: Number(f?.value?.premiumExtraPerVideo ?? 0.1),
  };
}

// Übersicht pro Partner für einen Monat
router.get('/affiliates', authenticate, requireAdmin, async (req, res) => {
  try {
    const now = new Date();
    const [y, m] = String(req.query.month || `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`).split('-').map(Number);
    const month = `${y}-${String(m).padStart(2, '0')}`;
    const from = new Date(Date.UTC(y, m - 1, 1)); const to = new Date(Date.UTC(y, m, 1));
    const s = await settings();
    const { data: affs } = await admin.from('affiliates').select('code,name,note,active,created_at,kind,status,email,country,channel,payout_method,payout_details,lang,applied_at').order('applied_at', { ascending: false, nullsFirst: false }).order('code');
    const { data: users } = await admin.from('profiles').select('id,referred_by,plan,subscription_status,stripe_customer_id,created_at').not('referred_by', 'is', null);
    const { data: payouts } = await admin.from('affiliate_payouts').select('code,amount,paid_at').eq('month', month);
    const paidBy = Object.fromEntries((payouts || []).map((p) => [p.code, p]));
    const codes = (affs || []).map((a) => a.code);

    // Besucher über den Link (Statistik: Seitenaufrufe mit ?ref=code im Monat)
    const visits = {};
    if (codes.length) {
      const { data: ev } = await admin.from('analytics_events').select('utm_source,visitor').eq('type', 'pageview').in('utm_source', codes).gte('created_at', from.toISOString()).lt('created_at', to.toISOString());
      for (const e of ev || []) (visits[e.utm_source] ||= new Set()).add(e.visitor);
    }

    const rows = [];
    for (const a of affs || []) {
      const mine = (users || []).filter((u) => u.referred_by === a.code);
      let revenue = 0; let fees = 0; let ai = 0; let paying = 0;
      for (const u of mine) {
        let paid = 0;
        if (stripe && u.stripe_customer_id) {
          for await (const inv of stripe.invoices.list({ customer: u.stripe_customer_id, status: 'paid', created: { gte: Math.floor(from / 1000), lt: Math.floor(to / 1000) }, limit: 100 })) {
            const amt = (inv.amount_paid || 0) / 100;
            if (amt > 0) { paid += amt; fees += amt * s.stripePercent / 100 + s.stripeFixed; }
          }
        }
        if (paid > 0) paying++;
        revenue += paid;
        const { data: vids } = await admin.from('videos').select('voice:project->>voiceId').eq('user_id', u.id).gte('created_at', from.toISOString()).lt('created_at', to.toISOString());
        ai += (vids || []).reduce((sum, v) => sum + s.aiCostPerVideo + (String(v.voice || '').startsWith('el-') ? s.premiumExtraPerVideo : 0), 0);
      }
      const profit = revenue - fees - ai;
      const percent = a.kind === 'external' ? s.externalPercent : s.friendPercent;
      rows.push({
        ...a, percent, visitors: visits[a.code]?.size || 0,
        signups: mine.filter((u) => new Date(u.created_at) >= from && new Date(u.created_at) < to).length,
        signupsTotal: mine.length,
        activeSubs: mine.filter((u) => u.plan !== 'free' && ['active', 'trialing', 'past_due'].includes(u.subscription_status)).length,
        paying, revenue: +revenue.toFixed(2), fees: +fees.toFixed(2), ai: +ai.toFixed(2), profit: +profit.toFixed(2),
        commission: +Math.max(0, profit * percent / 100).toFixed(2),
        paid: paidBy[a.code] ? { amount: Number(paidBy[a.code].amount), at: paidBy[a.code].paid_at } : null,
      });
    }
    res.json({ month, friendPercent: s.friendPercent, externalPercent: s.externalPercent, rows });
  } catch (e) { console.error('[affiliates]', e); res.status(500).json({ error: e.message }); }
});

// Partner bearbeiten: Name, Notiz, Art (Kollege / extern), aktiv, Zahlungsangaben
router.put('/affiliates/:code', authenticate, requireAdmin, express.json(), async (req, res) => {
  const b = req.body || {};
  const upd = {};
  if (b.name != null) upd.name = String(b.name).slice(0, 60) || 'Partner';
  if (b.note != null) upd.note = String(b.note).slice(0, 200);
  if (b.active != null) upd.active = !!b.active;
  if (b.kind != null && ['friend', 'external'].includes(b.kind)) upd.kind = b.kind;
  if (b.email != null) upd.email = clip(b.email, 190).toLowerCase() || null;
  if (b.payoutMethod != null && METHODS.has(b.payoutMethod)) upd.payout_method = b.payoutMethod;
  if (b.payoutDetails != null) upd.payout_details = clip(b.payoutDetails, 200);
  const { error } = await admin.from('affiliates').update(upd).eq('code', req.params.code);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

// Bewerbung freischalten (Partner erhält seinen Link per E-Mail) oder ablehnen
router.post('/affiliates/:code/decide', authenticate, requireAdmin, express.json(), async (req, res) => {
  const approve = req.body?.approve === true;
  const { data: a } = await admin.from('affiliates').select('code,name,email,lang,kind').eq('code', req.params.code).maybeSingle();
  if (!a) return res.status(404).json({ error: 'Partner nicht gefunden' });
  const { error } = await admin.from('affiliates').update(approve ? { status: 'active', active: true, approved_at: new Date().toISOString() } : { status: 'rejected', active: false }).eq('code', a.code);
  if (error) return res.status(500).json({ error: error.message });
  let mailed = false;
  if (approve && a.email) {
    const s = await settings(); const pct = a.kind === 'external' ? s.externalPercent : s.friendPercent; const en = a.lang === 'en';
    mailed = await mail({
      to: a.email, tag: 'partner-approved',
      subject: en ? 'You are now a TrueReel partner – here is your link' : 'Du bist jetzt TrueReel-Partner – hier ist dein Link',
      html: en
        ? `<p>Hi ${esc(a.name)},</p><p>your application for the TrueReel partner programme has been approved. This is your personal link:</p><p><b><a href="${linkFor(a.code)}">${linkFor(a.code)}</a></b></p><p>Everyone who signs up through this link is assigned to you. You receive <b>${pct}% of the profit</b> from their payments, settled monthly. The full conditions: <a href="https://truereel.ch/partner">truereel.ch/partner</a>.</p><p>Questions? Just reply to this email.</p><p>Daniel Weidmann, TrueReel</p>`
        : `<p>Hallo ${esc(a.name)},</p><p>deine Bewerbung fürs TrueReel-Partnerprogramm ist freigeschaltet. Das ist dein persönlicher Link:</p><p><b><a href="${linkFor(a.code)}">${linkFor(a.code)}</a></b></p><p>Alle, die sich über diesen Link registrieren, werden dir zugeordnet. Du erhältst <b>${pct} % vom Gewinn</b> aus ihren Zahlungen, monatlich abgerechnet. Die vollständigen Bedingungen: <a href="https://truereel.ch/partner">truereel.ch/partner</a>.</p><p>Fragen? Antworte einfach auf diese Mail.</p><p>Daniel Weidmann, TrueReel</p>`,
    });
  }
  res.json({ ok: true, mailed });
});

// Provision eines Monats als bezahlt markieren / Markierung zurücknehmen
router.post('/affiliates/:code/payout', authenticate, requireAdmin, express.json(), async (req, res) => {
  const month = String(req.body?.month || '');
  if (!/^\d{4}-\d{2}$/.test(month)) return res.status(400).json({ error: 'Monat fehlt' });
  if (req.body?.paid === false) {
    const { error } = await admin.from('affiliate_payouts').delete().eq('code', req.params.code).eq('month', month);
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ ok: true });
  }
  const amount = Math.max(0, Number(req.body?.amount) || 0);
  const { error } = await admin.from('affiliate_payouts').upsert({ code: req.params.code, month, amount, paid_at: new Date().toISOString() }, { onConflict: 'code,month' });
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

// Neuen Partner-Link von Hand anlegen (Kollege)
router.post('/affiliates', authenticate, requireAdmin, express.json(), async (req, res) => {
  const code = newCode();
  const { error } = await admin.from('affiliates').insert({ code, name: String(req.body?.name || 'Neuer Partner').slice(0, 60), kind: req.body?.kind === 'external' ? 'external' : 'friend' });
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true, code });
});

// Provisionssätze ändern
router.put('/affiliate-settings', authenticate, requireAdmin, express.json(), async (req, res) => {
  const pct = (v, d) => Math.min(100, Math.max(0, Number.isFinite(Number(v)) ? Number(v) : d));
  const value = { friendPercent: pct(req.body?.friendPercent, 30), externalPercent: pct(req.body?.externalPercent, 20) };
  const { error } = await admin.from('app_settings').upsert({ key: 'affiliate', value, updated_at: new Date().toISOString() });
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

export default router;
