// Preise in USD, für die Schweiz zusätzlich in CHF (Stripe-Preise mit currency_options). Muss mit Stripe übereinstimmen.
export const YEARLY_DISCOUNT = 0.2;
const WEEKS_PER_MONTH = 52 / 12;

export const PLANS = [
  {
    id: 'hobby',
    name: 'Hobby',
    monthly: 24,
    monthlyChf: 22,
    videosPerMonth: Math.round(3 * WEEKS_PER_MONTH), // 13
    limits: { videosPerWeek: 3, series: 1, platforms: 1, customUploads: false },
    featureKeys: ['plan.hobby.f1', 'plan.hobby.f2', 'plan.hobby.f3', 'plan.common.export', 'plan.common.voices'],
  },
  {
    id: 'daily',
    name: 'Daily',
    monthly: 49,
    monthlyChf: 44,
    popular: true,
    videosPerMonth: 30,
    limits: { videosPerDay: 1, series: 3, platforms: 3, customUploads: false },
    featureKeys: ['plan.daily.f1', 'plan.daily.f2', 'plan.daily.f3', 'plan.common.export', 'plan.common.voices'],
  },
  {
    id: 'pro',
    name: 'Pro',
    monthly: 89,
    monthlyChf: 79,
    videosPerMonth: 60,
    limits: { videosPerDay: 2, series: Infinity, platforms: 3, customUploads: true },
    featureKeys: ['plan.pro.f1', 'plan.pro.f2', 'plan.pro.f3', 'plan.pro.f4', 'plan.pro.f5', 'plan.common.export'],
  },
];

// Wer sich vor der Umstellung registriert hat, behält den Gratis-Test mit 3 Videos.
export const LEGACY_FREE_BEFORE = '2026-11-20T00:00:00Z';
export const freeVideoLimit = (profile) => (profile?.created_at && new Date(profile.created_at) < new Date(LEGACY_FREE_BEFORE) ? 3 : 1);

export const FREE_PLAN = {
  id: 'free',
  name: 'Test',
  monthly: 0,
  videosPerMonth: 1,
  limits: { freeVideos: 1, series: 1, platforms: 0, customUploads: false },
};

export const getPlan = (id) => PLANS.find((p) => p.id === id) || FREE_PLAN;

// Anzeige-Währung: CHF für Besucher in der Schweiz/Liechtenstein (Zeitzone oder Sprache), sonst USD.
// Stripe wählt an der Kasse die Währung selbst nach Standort – die Anzeige ist eine gute Vorhersage.
export function displayCurrency() {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    const langs = typeof navigator !== 'undefined' ? navigator.languages || [navigator.language] : [];
    if (/^Europe\/(Zurich|Vaduz|Busingen)$/.test(tz) || langs.some((l) => /-(CH|LI)$/i.test(l))) return 'CHF';
  } catch { /* egal */ }
  return 'USD';
}

export function priceFor(plan, interval, currency = displayCurrency()) {
  const base = currency === 'CHF' && plan.monthlyChf ? plan.monthlyChf : plan.monthly;
  if (interval === 'yearly') {
    const perMonth = +(base * (1 - YEARLY_DISCOUNT)).toFixed(2);
    return { perMonth, billed: +(perMonth * 12).toFixed(2), currency };
  }
  return { perMonth: base, billed: base, currency };
}

export function costPerVideo(plan, interval) {
  return priceFor(plan, interval).perMonth / plan.videosPerMonth;
}

// Formatiert in der Anzeige-Währung (Name historisch: früher nur USD)
export const formatUSD = (n, digits = 2, currency = displayCurrency()) =>
  currency === 'CHF'
    ? `CHF ${new Intl.NumberFormat('de-CH', { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(n)}`
    : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: digits, maximumFractionDigits: digits }).format(n);
