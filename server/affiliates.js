// Partner-Programm: Zuordnung neuer Nutzer zu Partner-Links + Auswertung (Umsatz, Gewinn, Provision) für den Inhaber.
import express from 'express';
import { admin, authenticate, getProfile } from './supabaseAdmin.js';
import { stripe } from './stripe.js';

const router = express.Router();
const CODE = /^[a-z0-9-]{3,32}$/;

// Neuer Nutzer kam über einen Partner-Link → einmalig zuordnen (nur in den ersten 14 Tagen nach der Registrierung)
router.post('/affiliate/attach', authenticate, express.json({ limit: '1kb' }), async (req, res) => {
  if (!admin) return res.json({ ok: true });
  const code = String(req.body?.code || '').toLowerCase();
  if (!CODE.test(code)) return res.json({ ok: false });
  const p = await getProfile(req.user.id);
  if (!p || p.referred_by || p.is_admin) return res.json({ ok: false });
  if (Date.now() - new Date(p.created_at || 0).getTime() > 14 * 864e5) return res.json({ ok: false });
  const { data: a } = await admin.from('affiliates').select('code').eq('code', code).eq('active', true).maybeSingle();
  if (!a) return res.json({ ok: false });
  await admin.from('profiles').update({ referred_by: code, referred_at: new Date().toISOString() }).eq('id', req.user.id).is('referred_by', null);
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
  return {
    commissionPercent: Number(a?.value?.commissionPercent ?? 20),
    stripePercent: Number(f?.value?.stripePercent ?? 7), stripeFixed: Number(f?.value?.stripeFixed ?? 0.3),
    aiCostPerVideo: Number(f?.value?.aiCostPerVideo ?? 0.15), premiumExtraPerVideo: Number(f?.value?.premiumExtraPerVideo ?? 0.1),
  };
}

// Übersicht pro Partner für einen Monat
router.get('/affiliates', authenticate, requireAdmin, async (req, res) => {
  try {
    const now = new Date();
    const [y, m] = String(req.query.month || `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`).split('-').map(Number);
    const from = new Date(Date.UTC(y, m - 1, 1)); const to = new Date(Date.UTC(y, m, 1));
    const s = await settings();
    const { data: affs } = await admin.from('affiliates').select('code,name,note,active,created_at').order('code');
    const { data: users } = await admin.from('profiles').select('id,referred_by,plan,subscription_status,stripe_customer_id,created_at').not('referred_by', 'is', null);
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
      rows.push({
        ...a, visitors: visits[a.code]?.size || 0,
        signups: mine.filter((u) => new Date(u.created_at) >= from && new Date(u.created_at) < to).length,
        signupsTotal: mine.length,
        activeSubs: mine.filter((u) => u.plan !== 'free' && ['active', 'trialing', 'past_due'].includes(u.subscription_status)).length,
        paying, revenue: +revenue.toFixed(2), fees: +fees.toFixed(2), ai: +ai.toFixed(2), profit: +profit.toFixed(2),
        commission: +Math.max(0, profit * s.commissionPercent / 100).toFixed(2),
      });
    }
    res.json({ month: `${y}-${String(m).padStart(2, '0')}`, commissionPercent: s.commissionPercent, rows });
  } catch (e) { console.error('[affiliates]', e); res.status(500).json({ error: e.message }); }
});

// Partner umbenennen / Notiz / aktiv
router.put('/affiliates/:code', authenticate, requireAdmin, express.json(), async (req, res) => {
  const b = req.body || {};
  const upd = {};
  if (b.name != null) upd.name = String(b.name).slice(0, 60) || 'Partner';
  if (b.note != null) upd.note = String(b.note).slice(0, 200);
  if (b.active != null) upd.active = !!b.active;
  const { error } = await admin.from('affiliates').update(upd).eq('code', req.params.code);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

// Neuen Partner-Link anlegen
router.post('/affiliates', authenticate, requireAdmin, express.json(), async (req, res) => {
  const alpha = 'abcdefghjkmnpqrstuvwxyz23456789';
  const code = 'p' + Array.from({ length: 6 }, () => alpha[Math.floor(Math.random() * alpha.length)]).join('');
  const { error } = await admin.from('affiliates').insert({ code, name: String(req.body?.name || 'Neuer Partner').slice(0, 60) });
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true, code });
});

// Provisionssatz ändern
router.put('/affiliate-settings', authenticate, requireAdmin, express.json(), async (req, res) => {
  const pct = Math.min(100, Math.max(0, Number(req.body?.commissionPercent) || 0));
  const { error } = await admin.from('app_settings').upsert({ key: 'affiliate', value: { commissionPercent: pct }, updated_at: new Date().toISOString() });
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

export default router;
