// Kundenbewertungen: Nutzer bewerten in der App; öffentlich nur mit Erlaubnis UND Freigabe durch den Inhaber.
import express from 'express';
import { admin, authenticate, getProfile } from './supabaseAdmin.js';

const router = express.Router();
const clip = (v, n) => (v == null ? null : String(v).trim().slice(0, n) || null);

// Eigene Bewertung lesen
router.get('/reviews/mine', authenticate, async (req, res) => {
  if (!admin) return res.json({ review: null });
  const { data } = await admin.from('reviews').select('rating,text,display_name,publish_ok,approved').eq('user_id', req.user.id).maybeSingle();
  res.json({ review: data || null });
});

// Bewertung abgeben oder ändern (Änderung setzt die Freigabe zurück)
router.post('/reviews', authenticate, express.json({ limit: '4kb' }), async (req, res) => {
  if (!admin) return res.json({ ok: true, demo: true });
  const b = req.body || {};
  const rating = Math.round(Number(b.rating));
  if (!(rating >= 1 && rating <= 5)) return res.status(400).json({ error: 'Bitte wähle 1 bis 5 Sterne.' });
  const row = {
    user_id: req.user.id, rating, text: clip(b.text, 600), display_name: clip(b.displayName, 40),
    publish_ok: !!b.publishOk, approved: false, lang: b.lang === 'en' ? 'en' : 'de', updated_at: new Date().toISOString(),
  };
  const { error } = await admin.from('reviews').upsert(row, { onConflict: 'user_id' });
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

// Öffentlich: freigegebene Bewertungen für die Startseite
router.get('/reviews/public', async (_req, res) => {
  if (!admin) return res.json({ reviews: [] });
  const { data } = await admin.from('reviews').select('rating,text,display_name,lang,created_at')
    .eq('approved', true).eq('publish_ok', true).not('text', 'is', null).order('created_at', { ascending: false }).limit(9);
  res.set('Cache-Control', 'public, max-age=300');
  res.json({ reviews: data || [] });
});

// Inhaber: alle Bewertungen + Freigabe
async function requireAdmin(req, res, next) {
  if (!admin) return res.json({ reviews: [] });
  const p = await getProfile(req.user.id);
  if (!p?.is_admin) return res.status(403).json({ error: 'Kein Zugriff' });
  next();
}
router.get('/reviews/all', authenticate, requireAdmin, async (_req, res) => {
  const { data } = await admin.from('reviews').select('id,rating,text,display_name,publish_ok,approved,created_at').order('created_at', { ascending: false }).limit(200);
  res.json({ reviews: data || [] });
});
router.put('/reviews/:id', authenticate, requireAdmin, express.json(), async (req, res) => {
  const { error } = await admin.from('reviews').update({ approved: !!req.body?.approved }).eq('id', req.params.id).eq('publish_ok', true);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

export default router;
