// Muss mit src/config/plans.js übereinstimmen (Videos pro Monat; free = Gratis-Test insgesamt).
export const PLAN_QUOTAS = { free: 1, hobby: 13, daily: 30, pro: 60 };
// Konten vor der Umstellung behalten 3 Gratis-Videos
export const LEGACY_FREE_BEFORE = '2026-11-20T00:00:00Z';
export const quotaFor = (profile) => {
  const plan = profile?.plan || 'free';
  if (plan === 'free') return profile?.created_at && new Date(profile.created_at) < new Date(LEGACY_FREE_BEFORE) ? 3 : 1;
  return PLAN_QUOTAS[plan] ?? 1;
};
