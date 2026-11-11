// Preise in USD. Muss mit den Stripe-Preisen übereinstimmen.
export const YEARLY_DISCOUNT = 0.2;
const WEEKS_PER_MONTH = 52 / 12;

export const PLANS = [
  {
    id: 'hobby',
    name: 'Hobby',
    monthly: 24,
    videosPerMonth: Math.round(3 * WEEKS_PER_MONTH), // 13
    limits: { videosPerWeek: 3, series: 1, platforms: 1, customUploads: false },
    featureKeys: ['plan.hobby.f1', 'plan.hobby.f2', 'plan.hobby.f3', 'plan.common.export', 'plan.common.voices'],
  },
  {
    id: 'daily',
    name: 'Daily',
    monthly: 49,
    popular: true,
    videosPerMonth: 30,
    limits: { videosPerDay: 1, series: 3, platforms: 3, customUploads: false },
    featureKeys: ['plan.daily.f1', 'plan.daily.f2', 'plan.daily.f3', 'plan.common.export', 'plan.common.voices'],
  },
  {
    id: 'pro',
    name: 'Pro',
    monthly: 89,
    videosPerMonth: 60,
    limits: { videosPerDay: 2, series: Infinity, platforms: 3, customUploads: true },
    featureKeys: ['plan.pro.f1', 'plan.pro.f2', 'plan.pro.f3', 'plan.pro.f4', 'plan.pro.f5', 'plan.common.export'],
  },
];

export const FREE_PLAN = {
  id: 'free',
  name: 'Test',
  monthly: 0,
  videosPerMonth: 1,
  limits: { freeVideos: 1, series: 1, platforms: 0, customUploads: false },
};

export const getPlan = (id) => PLANS.find((p) => p.id === id) || FREE_PLAN;

export function priceFor(plan, interval) {
  if (interval === 'yearly') {
    const perMonth = +(plan.monthly * (1 - YEARLY_DISCOUNT)).toFixed(2);
    return { perMonth, billed: +(perMonth * 12).toFixed(2) };
  }
  return { perMonth: plan.monthly, billed: plan.monthly };
}

export function costPerVideo(plan, interval) {
  return priceFor(plan, interval).perMonth / plan.videosPerMonth;
}

export const formatUSD = (n, digits = 2) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: digits, maximumFractionDigits: digits }).format(n);
