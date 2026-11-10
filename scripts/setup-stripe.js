// Legt in Stripe alle Produkte, Preise, das Kundenportal und (optional) den Webhook an
// und schreibt die IDs in .env. Mehrfach ausführbar – vorhandene Preise werden wiederverwendet.
//
//   STRIPE_SECRET_KEY=sk_test_... npm run setup:stripe
//   (mit öffentlicher APP_URL https://… wird zusätzlich der Webhook angelegt)
import 'dotenv/config';
import Stripe from 'stripe';
import { setEnv } from './env-file.js';

const key = process.env.STRIPE_SECRET_KEY;
if (!key || /x{3}$/.test(key)) {
  console.error('Bitte STRIPE_SECRET_KEY setzen (Stripe Dashboard → Entwickler → API-Schlüssel).');
  process.exit(1);
}
const stripe = new Stripe(key);
const appUrl = process.env.APP_URL || 'http://localhost:5173';

const PLANS = [
  { id: 'hobby', name: 'TrueReel Hobby', desc: '3 Videos pro Woche, 1 Serie, Auto-Posting auf 1 Plattform', monthly: 1700 },
  { id: 'daily', name: 'TrueReel Daily', desc: '1 Video pro Tag, 3 Serien, alle Plattformen', monthly: 3500 },
  { id: 'pro', name: 'TrueReel Pro', desc: '2 Videos pro Tag, unbegrenzte Serien, Priority Support, eigene Musik/Voice', monthly: 6200 },
];
const yearly = (cents) => Math.round(cents * 12 * 0.8); // 20 % Rabatt

async function ensurePrice(product, lookupKey, amount, interval) {
  const existing = await stripe.prices.list({ lookup_keys: [lookupKey], active: true, limit: 1 });
  if (existing.data[0]) return existing.data[0];
  return stripe.prices.create({
    product: product.id, currency: 'usd', unit_amount: amount, lookup_key: lookupKey,
    recurring: { interval }, tax_behavior: 'exclusive',
  });
}

async function ensureProduct(plan) {
  const all = await stripe.products.list({ active: true, limit: 100 });
  const found = all.data.find((p) => p.metadata?.truereel_plan === plan.id);
  if (found) return found;
  return stripe.products.create({ name: plan.name, description: plan.desc, metadata: { truereel_plan: plan.id } });
}

const env = {};
const portalProducts = [];
for (const plan of PLANS) {
  const product = await ensureProduct(plan);
  const m = await ensurePrice(product, `truereel_${plan.id}_monthly`, plan.monthly, 'month');
  const y = await ensurePrice(product, `truereel_${plan.id}_yearly`, yearly(plan.monthly), 'year');
  env[`STRIPE_PRICE_${plan.id.toUpperCase()}_MONTHLY`] = m.id;
  env[`STRIPE_PRICE_${plan.id.toUpperCase()}_YEARLY`] = y.id;
  portalProducts.push({ product: product.id, prices: [m.id, y.id] });
  console.log(`✓ ${plan.name}: ${m.id} (monatlich), ${y.id} (jährlich, $${(yearly(plan.monthly) / 100).toFixed(2)})`);
}

// Kundenportal: Kündigung zum Periodenende, Planwechsel, Zahlungsmethode, Rechnungen
const portal = await stripe.billingPortal.configurations.create({
  business_profile: { headline: 'TrueReel – Abo verwalten' },
  default_return_url: `${appUrl}/app/account`,
  features: {
    customer_update: { enabled: true, allowed_updates: ['email', 'address', 'tax_id'] },
    invoice_history: { enabled: true },
    payment_method_update: { enabled: true },
    subscription_cancel: { enabled: true, mode: 'at_period_end' },
    subscription_update: { enabled: true, default_allowed_updates: ['price'], products: portalProducts, proration_behavior: 'create_prorations' },
  },
});
console.log(`✓ Kundenportal konfiguriert (${portal.id})`);

if (appUrl.startsWith('https://')) {
  const url = `${appUrl}/api/stripe/webhook`;
  const list = await stripe.webhookEndpoints.list({ limit: 100 });
  if (!list.data.some((w) => w.url === url)) {
    const wh = await stripe.webhookEndpoints.create({
      url,
      enabled_events: ['checkout.session.completed', 'customer.subscription.created', 'customer.subscription.updated', 'customer.subscription.deleted'],
    });
    env.STRIPE_WEBHOOK_SECRET = wh.secret;
    console.log(`✓ Webhook angelegt: ${url}`);
  } else console.log(`• Webhook existiert bereits: ${url} (Secret im Dashboard ablesen)`);
} else {
  console.log('• Webhook übersprungen (APP_URL ist nicht öffentlich). Lokal: stripe listen --forward-to localhost:8787/api/stripe/webhook');
}

setEnv({ STRIPE_SECRET_KEY: key, ...env });
console.log('\n✓ IDs in .env geschrieben. Fertig.');
