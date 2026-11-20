// Werbe-Kampagnen (nur Inhaber): eigener Link pro Anzeige, Ausgaben eintragen, Auswertung bis zum zahlenden Kunden.
import express from 'express';
import { admin, authenticate, getProfile } from './supabaseAdmin.js';
import { stripe } from './stripe.js';

const router = express.Router();
const CODE = /^ad-[a-z0-9]{4,12}$/;
const PLATFORMS = new Set(['tiktok', 'instagram', 'facebook', 'google', 'youtube', 'other']);
const TARGETS = new Set(['start', 'firmen']);

// Besucher kam über einen Werbe-Link → Konto einmalig zuordnen (letzter Werbe-Klick, max. 30 Tage alt)
router.post('/campaign/attach', authenticate, express.json({ limit: '1kb' }), async (req, res) => {
  if (!admin) return res.json({ ok: true });
  const code = String(req.body?.code || '').toLowerCase();
  if (!CODE.test(code)) return res.json({ ok: false });
  const p = await getProfile(req.user.id);
  if (!p || p.campaign || p.is_admin) return res.json({ ok: false });
  if (Date.now() - new Date(p.created_at || 0).getTime() > 14 * 864e5) return res.json({ ok: false }); // nur neue Konten
  const { data: c } = await admin.from('ad_campaigns').select('code').eq('code', code).maybeSingle();
  if (!c) return res.json({ ok: false });
  await admin.from('profiles').update({ campaign: code, campaign_at: new Date().toISOString() }).eq('id', req.user.id).is('campaign', null);
  res.json({ ok: true });
});

async function requireAdmin(req, res, next) {
  if (!admin) return res.json({ demo: true, rows: [] });
  const p = await getProfile(req.user.id);
  if (!p?.is_admin) return res.status(403).json({ error: 'Kein Zugriff' });
  next();
}

async function finance() {
  const { data: f } = await admin.from('app_settings').select('value').eq('key', 'finance').maybeSingle();
  const v = f?.value || {};
  return { pct: Number(v.stripePercent ?? 7), fix: Number(v.stripeFixed ?? 0.3), ai: Number(v.aiCostPerVideo ?? 0.15), prem: Number(v.premiumExtraPerVideo ?? 0.1) };
}

// Auswertung aller Kampagnen (gesamte Laufzeit)
router.get('/campaigns', authenticate, requireAdmin, async (_req, res) => {
  try {
    const s = await finance();
    const { data: camps } = await admin.from('ad_campaigns').select('*').order('created_at', { ascending: false });
    const codes = (camps || []).map((c) => c.code);
    const visits = {}; const leads = {};
    if (codes.length) {
      const { data: ev } = await admin.from('analytics_events').select('utm_campaign,visitor').eq('type', 'pageview').in('utm_campaign', codes);
      for (const e of ev || []) (visits[e.utm_campaign] ||= new Set()).add(e.visitor);
      const { data: ls } = await admin.from('business_leads').select('campaign').in('campaign', codes);
      for (const l of ls || []) leads[l.campaign] = (leads[l.campaign] || 0) + 1;
    }
    const { data: users } = await admin.from('profiles').select('id,campaign,plan,subscription_status,stripe_customer_id').not('campaign', 'is', null);
    const rows = [];
    for (const c of camps || []) {
      const mine = (users || []).filter((u) => u.campaign === c.code);
      let revenue = 0; let fees = 0; let ai = 0; let paying = 0;
      for (const u of mine) {
        let paid = 0;
        if (stripe && u.stripe_customer_id) {
          for await (const inv of stripe.invoices.list({ customer: u.stripe_customer_id, status: 'paid', limit: 100 })) {
            const amt = (inv.amount_paid || 0) / 100; // CHF und USD werden zusammengezählt (Näherung)
            if (amt > 0) { paid += amt; fees += amt * s.pct / 100 + s.fix; }
          }
        }
        if (paid > 0) paying++;
        revenue += paid;
        const { data: vids } = await admin.from('videos').select('voice:project->>voiceId').eq('user_id', u.id);
        ai += (vids || []).reduce((sum, v) => sum + s.ai + (String(v.voice || '').startsWith('el-') ? s.prem : 0), 0);
      }
      const spend = Number(c.spend) || 0;
      const profit = revenue - fees - ai;
      const visitors = visits[c.code]?.size || 0;
      rows.push({
        ...c, spend, visitors, signups: mine.length, paying,
        activeSubs: mine.filter((u) => u.plan !== 'free' && ['active', 'trialing', 'past_due'].includes(u.subscription_status)).length,
        leads: leads[c.code] || 0,
        revenue: +revenue.toFixed(2), profit: +profit.toFixed(2), result: +(profit - spend).toFixed(2),
        costPerVisitor: visitors ? +(spend / visitors).toFixed(2) : null,
        costPerSignup: mine.length ? +(spend / mine.length).toFixed(2) : null,
        costPerCustomer: paying ? +(spend / paying).toFixed(2) : null,
        signupRate: visitors ? +(mine.length / visitors * 100).toFixed(1) : null,
        payRate: mine.length ? +(paying / mine.length * 100).toFixed(1) : null,
      });
    }
    res.json({ rows });
  } catch (e) { console.error('[campaigns]', e); res.status(500).json({ error: e.message }); }
});

router.post('/campaigns', authenticate, requireAdmin, express.json(), async (req, res) => {
  const b = req.body || {};
  const alpha = 'abcdefghjkmnpqrstuvwxyz23456789';
  const code = 'ad-' + Array.from({ length: 6 }, () => alpha[Math.floor(Math.random() * alpha.length)]).join('');
  const row = { code, name: String(b.name || 'Neue Kampagne').slice(0, 80), platform: PLATFORMS.has(b.platform) ? b.platform : 'other', target: TARGETS.has(b.target) ? b.target : 'start' };
  const { error } = await admin.from('ad_campaigns').insert(row);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true, code });
});

router.put('/campaigns/:code', authenticate, requireAdmin, express.json(), async (req, res) => {
  const b = req.body || {}; const upd = {};
  if (b.name != null) upd.name = String(b.name).slice(0, 80) || 'Kampagne';
  if (b.spend != null) upd.spend = Math.max(0, Math.min(1e6, Number(b.spend) || 0));
  if (b.active != null) upd.active = !!b.active;
  const { error } = await admin.from('ad_campaigns').update(upd).eq('code', req.params.code);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

export default router;
