import { api } from './api.js';

export async function startCheckout(plan, interval) {
  const r = await api('/stripe/checkout', { method: 'POST', body: { plan, interval } });
  window.location.href = r.url;
}

// flow: 'cancel' öffnet direkt den Kündigungsdialog im Stripe-Kundenportal
export async function openPortal(flow) {
  const r = await api('/stripe/portal', { method: 'POST', body: { flow } });
  if (r.url) window.location.href = r.url;
  return r;
}
