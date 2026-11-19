// Willkommensangebot: Nach dem ersten Gratis-Export einmalig 48 Stunden lang X % auf den ersten Monat.
// Die Frist ist echt: sie startet genau einmal pro Konto und wird nie verlängert.
import express from 'express';
import { admin, authenticate, getProfile } from './supabaseAdmin.js';

const router = express.Router();

export async function offerSettings() {
  if (!admin) return null;
  const { data } = await admin.from('app_settings').select('value').eq('key', 'offer').maybeSingle();
  const v = data?.value;
  return v?.couponId ? { couponId: String(v.couponId), percent: Number(v.percent) || 30, hours: Number(v.hours) || 48 } : null;
}

// Gilt das Angebot für dieses Profil gerade?
export const offerActive = (profile) => (profile?.plan || 'free') === 'free' && profile?.offer_until && new Date(profile.offer_until) > new Date();

router.post('/offer/start', authenticate, async (req, res) => {
  if (!admin) return res.json({ ok: false });
  const s = await offerSettings();
  const p = await getProfile(req.user.id);
  if (!s || !p || p.is_admin || (p.plan || 'free') !== 'free' || p.offer_until) return res.json({ ok: false, offerUntil: p?.offer_until || null });
  const { count } = await admin.from('videos').select('id', { count: 'exact', head: true }).eq('user_id', req.user.id);
  if (!count) return res.json({ ok: false });
  const until = new Date(Date.now() + s.hours * 3600e3).toISOString();
  const { data } = await admin.from('profiles').update({ offer_until: until }).eq('id', req.user.id).is('offer_until', null).select('offer_until');
  res.json({ ok: !!data?.length, offerUntil: data?.[0]?.offer_until || null, percent: s.percent });
});

router.get('/offer', async (_req, res) => {
  const s = await offerSettings().catch(() => null);
  res.json({ percent: s?.percent || 30, hours: s?.hours || 48 });
});

export default router;
