import express from 'express';
import crypto from 'node:crypto';
import { config } from '../config.js';
import { admin, authenticate } from '../supabaseAdmin.js';
import { PLATFORMS } from './platforms.js';
import { encryptToken, encryptExistingTokens, decryptConnection, encryptFields } from './tokenCrypto.js';

encryptExistingTokens(admin);

const router = express.Router();
const SECRET = process.env.STATE_SECRET || crypto.randomBytes(32).toString('hex');
const redirectUri = (p) => `${process.env.API_PUBLIC_URL || config.appUrl}/api/social/${p}/callback`;

const sign = (payload) => {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return `${body}.${crypto.createHmac('sha256', SECRET).update(body).digest('base64url')}`;
};
const verify = (state) => {
  const [body, sig] = String(state || '').split('.');
  const expected = crypto.createHmac('sha256', SECRET).update(body || '').digest('base64url');
  if (!sig || sig.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  const data = JSON.parse(Buffer.from(body, 'base64url').toString());
  return Date.now() - data.ts < 10 * 60 * 1000 ? data : null;
};

router.get('/status', (_req, res) => {
  res.json(Object.fromEntries(Object.entries(PLATFORMS).map(([id, p]) => [id, { label: p.label, configured: p.configured() }])));
});

router.post('/:platform/connect', authenticate, (req, res) => {
  const p = PLATFORMS[req.params.platform];
  if (!p) return res.status(404).json({ error: 'Unbekannte Plattform' });
  if (!p.configured() || req.demo) return res.json({ demo: true });
  res.json({ url: p.authUrl(sign({ uid: req.user.id, ts: Date.now() }), redirectUri(req.params.platform)) });
});

router.get('/:platform/callback', async (req, res) => {
  const { platform } = req.params;
  const p = PLATFORMS[platform];
  const state = verify(req.query.state);
  if (!p || !state || !req.query.code) return res.redirect(`${config.appUrl}/app/account?social_error=${platform}`);
  try {
    const tok = await p.exchangeCode(req.query.code, redirectUri(platform));
    if (admin) {
      await admin.from('social_connections').upsert({
        user_id: state.uid,
        platform,
        account_name: tok.account_id || null,
        access_token: encryptToken(tok.access_token),
        refresh_token: encryptToken(tok.refresh_token || null),
        expires_at: tok.expires_in ? new Date(Date.now() + tok.expires_in * 1000).toISOString() : null,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id,platform' });
    }
    res.redirect(`${config.appUrl}/app/account?connected=${platform}`);
  } catch (e) {
    console.error(e);
    res.redirect(`${config.appUrl}/app/account?social_error=${platform}`);
  }
});

// TikTok: Konto-Infos und erlaubte Einstellungen für das Posten-Fenster (Vorgabe der Content Posting API)
router.get('/tiktok/creator-info', authenticate, async (req, res) => {
  try {
    if (!admin) return res.json({ demo: true });
    const { data: stored } = await admin.from('social_connections').select('*').eq('user_id', req.user.id).eq('platform', 'tiktok').maybeSingle();
    const conn = decryptConnection(stored);
    if (!conn) return res.status(400).json({ error: 'TikTok ist nicht verbunden.' });
    const upd = await PLATFORMS.tiktok.refresh(conn);
    if (upd) { Object.assign(conn, upd); await admin.from('social_connections').update({ ...encryptFields(upd), updated_at: new Date().toISOString() }).eq('id', conn.id); }
    const r = await (await fetch('https://open.tiktokapis.com/v2/post/publish/creator_info/query/', { method: 'POST', headers: { Authorization: `Bearer ${conn.access_token}`, 'Content-Type': 'application/json; charset=UTF-8' } })).json();
    if (r.error?.code && r.error.code !== 'ok') return res.status(400).json({ error: r.error.code === 'spam_risk_too_many_posts' ? 'TikTok erlaubt heute keine weiteren Posts über Apps. Bitte morgen erneut versuchen.' : `TikTok: ${r.error.message || r.error.code}` });
    const d = r.data || {};
    res.json({
      nickname: d.creator_nickname || d.creator_username || conn.account_name || 'TikTok',
      username: d.creator_username || null, avatar: d.creator_avatar_url || null,
      privacyOptions: d.privacy_level_options || [],
      commentDisabled: !!d.comment_disabled, duetDisabled: !!d.duet_disabled, stitchDisabled: !!d.stitch_disabled,
      maxDuration: d.max_video_post_duration_sec || null,
    });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/:platform', authenticate, async (req, res) => {
  if (admin) await admin.from('social_connections').delete().eq('user_id', req.user.id).eq('platform', req.params.platform);
  res.json({ ok: true });
});

export default router;
