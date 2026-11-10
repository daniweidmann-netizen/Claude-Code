import express from 'express';
import Stripe from 'stripe';
import { config, stripeEnabled, planFromPrice } from './config.js';
import { admin, authenticate, getProfile } from './supabaseAdmin.js';

export const stripe = stripeEnabled()
  ? new Stripe(config.stripeKey, process.env.NODE_USE_ENV_PROXY ? { httpClient: Stripe.createFetchHttpClient() } : {})
  : null;
const router = express.Router();

async function ensureCustomer(user) {
  const profile = await getProfile(user.id);
  if (profile?.stripe_customer_id) return profile.stripe_customer_id;
  const customer = await stripe.customers.create({ email: user.email, metadata: { user_id: user.id } });
  if (admin) await admin.from('profiles').update({ stripe_customer_id: customer.id }).eq('id', user.id);
  return customer.id;
}

// Checkout-Session für ein Abo erstellen
router.post('/checkout', authenticate, async (req, res) => {
  const { plan, interval = 'monthly' } = req.body || {};
  const price = config.prices[plan]?.[interval];
  if (!stripe || req.demo) return res.json({ demo: true, url: `${config.appUrl}/app/account?checkout=demo&plan=${plan}&interval=${interval}` });
  if (!price) return res.status(400).json({ error: 'Unbekannter Plan' });
  try {
    const customer = await ensureCustomer(req.user);
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer,
      line_items: [{ price, quantity: 1 }],
      allow_promotion_codes: true,
      automatic_tax: { enabled: true },
      customer_update: { address: 'auto' },
      subscription_data: { metadata: { user_id: req.user.id } },
      metadata: { user_id: req.user.id },
      success_url: `${config.appUrl}/app/account?checkout=success`,
      cancel_url: `${config.appUrl}/app/account?checkout=cancelled`,
    });
    res.json({ url: session.url });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Checkout konnte nicht gestartet werden.' });
  }
});

// Kundenportal (Zahlungsmethode, Rechnungen, Planwechsel)
// flow=cancel → direkt in den Kündigungsdialog ("Kündigung mit einem Klick")
router.post('/portal', authenticate, async (req, res) => {
  if (!stripe || req.demo) return res.json({ demo: true });
  try {
    const profile = await getProfile(req.user.id);
    if (!profile?.stripe_customer_id) return res.status(400).json({ error: 'Kein Abo vorhanden' });
    const params = { customer: profile.stripe_customer_id, return_url: `${config.appUrl}/app/account` };
    if (config.stripePortalConfig) params.configuration = config.stripePortalConfig;
    if (req.body?.flow === 'cancel' && profile.stripe_subscription_id) {
      params.flow_data = {
        type: 'subscription_cancel',
        subscription_cancel: { subscription: profile.stripe_subscription_id },
        after_completion: { type: 'redirect', redirect: { return_url: `${config.appUrl}/app/account?cancelled=1` } },
      };
    }
    const session = await stripe.billingPortal.sessions.create(params);
    res.json({ url: session.url });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Kundenportal konnte nicht geöffnet werden.' });
  }
});

// Webhook – muss mit express.raw() eingebunden werden (Signaturprüfung)
export async function webhookHandler(req, res) {
  if (!stripe) return res.status(400).send('Stripe nicht konfiguriert');
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, req.headers['stripe-signature'], config.stripeWebhookSecret);
  } catch (e) {
    console.error('[stripe] Webhook-Signatur ungültig:', e.message.split('\n')[0]);
    return res.status(400).send(`Webhook-Fehler: ${e.message}`);
  }
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const s = event.data.object;
        if (s.subscription) await syncSubscription(await stripe.subscriptions.retrieve(s.subscription));
        break;
      }
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        await syncSubscription(event.data.object);
        break;
      default:
        break;
    }
    res.json({ received: true });
  } catch (e) {
    console.error('[stripe] Webhook-Verarbeitung fehlgeschlagen', e);
    res.status(500).send(`Verarbeitung fehlgeschlagen: ${e.message}`);
  }
}

async function syncSubscription(sub) {
  if (!admin) return;
  const userId = sub.metadata?.user_id
    || (await admin.from('profiles').select('id').eq('stripe_customer_id', sub.customer).maybeSingle()).data?.id;
  if (!userId) return console.warn('Kein Nutzer zu Abo', sub.id);
  const item = sub.items.data[0];
  const mapped = planFromPrice(item?.price?.id) || { plan: 'free', interval: null };
  const active = ['active', 'trialing', 'past_due'].includes(sub.status);
  const periodEnd = item?.current_period_end || sub.current_period_end;
  await admin.from('subscriptions').upsert({
    id: sub.id,
    user_id: userId,
    plan: mapped.plan,
    interval: mapped.interval,
    status: sub.status,
    current_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
    cancel_at_period_end: sub.cancel_at_period_end,
    updated_at: new Date().toISOString(),
  });
  await admin.from('profiles').update({
    stripe_customer_id: sub.customer,
    plan: active ? mapped.plan : 'free',
    billing_interval: active ? mapped.interval : null,
    subscription_status: sub.status,
    stripe_subscription_id: active ? sub.id : null,
    cancel_at_period_end: sub.cancel_at_period_end,
    current_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
  }).eq('id', userId);
}

export default router;
