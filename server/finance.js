// Finanz-Übersicht für den Inhaber: echte Stripe-Zahlen + geschätzte KI-Kosten + Fixkosten.
import express from 'express';
import { admin, authenticate, getProfile } from './supabaseAdmin.js';
import { stripe } from './stripe.js';
import { PLANS, priceFor } from '../src/config/plans.js';

const router = express.Router();
const DEFAULTS = { aiCostPerVideo: 0.15, premiumExtraPerVideo: 0.1, stripePercent: 7, stripeFixed: 0.3, fixedCosts: [] };
const PRICES = Object.fromEntries(PLANS.map((p) => [p.id, { monthly: priceFor(p, 'monthly').billed, yearly: priceFor(p, 'yearly').billed }]));

async function requireAdmin(req, res, next) {
  if (!admin) return res.json({ demo: true });
  const p = await getProfile(req.user.id);
  if (!p?.is_admin) return res.status(403).json({ error: 'Kein Zugriff' });
  next();
}

async function loadSettings() {
  const { data } = await admin.from('app_settings').select('value').eq('key', 'finance').maybeSingle();
  return { ...DEFAULTS, ...(data?.value || {}) };
}

router.get('/finance', authenticate, requireAdmin, async (req, res) => {
  try {
    const now = new Date();
    const [y, m] = String(req.query.month || `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`).split('-').map(Number);
    const from = new Date(Date.UTC(y, m - 1, 1));
    const to = new Date(Date.UTC(y, m, 1));
    const settings = await loadSettings();

    // 1) Echte Zahlungen laut Stripe (Bruttobetrag, Gebühren, Netto) – in der Kontowährung
    const stripeData = { gross: 0, fees: 0, refunds: 0, net: 0, payments: 0, currency: null, available: !!stripe };
    if (stripe) {
      const params = { created: { gte: Math.floor(from / 1000), lt: Math.floor(to / 1000) }, limit: 100 };
      for await (const t of stripe.balanceTransactions.list(params)) {
        stripeData.currency = stripeData.currency || t.currency;
        if (['charge', 'payment'].includes(t.type)) { stripeData.gross += t.amount; stripeData.fees += t.fee; stripeData.payments++; }
        else if (['refund', 'payment_refund'].includes(t.type)) stripeData.refunds += -t.amount;
        else if (t.type !== 'payout') stripeData.fees += t.fee - Math.min(0, t.amount); // sonstige Gebühren (z. B. Stripe-Tax, Managed Payments)
        if (t.type !== 'payout') stripeData.net += t.net;
      }
      for (const k of ['gross', 'fees', 'refunds', 'net']) stripeData[k] = Math.round(stripeData[k]) / 100;
    }

    // 2) Aktive Abos (ohne Inhaber-Konto) und wiederkehrender Monatsumsatz (MRR)
    const { data: profiles } = await admin.from('profiles').select('plan,billing_interval,subscription_status,cancel_at_period_end,is_admin');
    const subs = { hobby: { monthly: 0, yearly: 0 }, daily: { monthly: 0, yearly: 0 }, pro: { monthly: 0, yearly: 0 } };
    let freeUsers = 0;
    for (const p of profiles || []) {
      if (p.is_admin) continue;
      if (subs[p.plan] && ['active', 'trialing', 'past_due'].includes(p.subscription_status)) subs[p.plan][p.billing_interval === 'yearly' ? 'yearly' : 'monthly']++;
      else freeUsers++;
    }
    const mrr = Object.entries(subs).reduce((s, [plan, c]) => s + c.monthly * PRICES[plan].monthly + c.yearly * (PRICES[plan].yearly / 12), 0);

    // 3) KI-Kosten: erstellte Videos im Monat × Kosten pro Video
    // Videos des Monats; Premium = mindestens eine Szene mit ElevenLabs-Stimme (Stimmen-ID "el-…")
    const { data: monthVideos } = await admin.from('videos').select('voice:project->>voiceId, scenes:project->scenes').gte('created_at', from.toISOString()).lt('created_at', to.toISOString());
    const videos = monthVideos?.length || 0;
    const premiumVideos = (monthVideos || []).filter((v) => String(v.voice || '').startsWith('el-') || (v.scenes || []).some((s) => String(s?.voiceId || '').startsWith('el-'))).length;
    const aiCosts = videos * Number(settings.aiCostPerVideo || 0) + premiumVideos * Number(settings.premiumExtraPerVideo || 0);
    const fixed = (settings.fixedCosts || []).reduce((s, f) => s + Number(f.amount || 0), 0);

    res.json({
      month: `${y}-${String(m).padStart(2, '0')}`,
      settings,
      stripe: stripeData,
      subscriptions: subs,
      freeUsers,
      mrr: Math.round(mrr * 100) / 100,
      videos,
      premiumVideos,
      aiCosts: Math.round(aiCosts * 100) / 100,
      fixedCosts: Math.round(fixed * 100) / 100,
      profit: Math.round((stripeData.net - aiCosts - fixed) * 100) / 100,
    });
  } catch (e) {
    console.error('[finance]', e);
    res.status(500).json({ error: e.message });
  }
});

router.put('/finance/settings', authenticate, requireAdmin, express.json(), async (req, res) => {
  const b = req.body || {};
  const value = {
    aiCostPerVideo: Math.max(0, Number(b.aiCostPerVideo) || 0),
    premiumExtraPerVideo: Math.max(0, Number(b.premiumExtraPerVideo) || 0),
    stripePercent: Math.max(0, Number(b.stripePercent) || 0),
    stripeFixed: Math.max(0, Number(b.stripeFixed) || 0),
    fixedCosts: (Array.isArray(b.fixedCosts) ? b.fixedCosts : []).slice(0, 30)
      .map((f) => ({ name: String(f.name || '').slice(0, 60), amount: Math.max(0, Number(f.amount) || 0) }))
      .filter((f) => f.name || f.amount),
  };
  const { error } = await admin.from('app_settings').upsert({ key: 'finance', value, updated_at: new Date().toISOString() });
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true, settings: value });
});

export default router;
