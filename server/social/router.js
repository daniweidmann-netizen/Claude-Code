import express from 'express';
import crypto from 'node:crypto';
import { config } from '../config.js';
import { admin, authenticate } from '../supabaseAdmin.js';
import { PLATFORMS } from './platforms.js';
import { encryptToken, encryptExistingTokens } from './tokenCrypto.js';

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

router.delete('/:platform', authenticate, async (req, res) => {
  if (admin) await admin.from('social_connections').delete().eq('user_id', req.user.id).eq('platform', req.params.platform);
  res.json({ ok: true });
});

export default router;
