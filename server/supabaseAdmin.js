import { createClient } from '@supabase/supabase-js';
import { config, supabaseEnabled } from './config.js';

export const admin = supabaseEnabled()
  ? createClient(config.supabaseUrl, config.supabaseServiceKey, { auth: { persistSession: false } })
  : null;

// Express-Middleware: liest das Supabase-JWT und setzt req.user.
// Im Demo-Modus (ohne Supabase) wird ein Demo-Nutzer gesetzt.
export async function authenticate(req, res, next) {
  if (!admin) { req.user = { id: 'demo', email: 'demo@local' }; req.demo = true; return next(); }
  const token = (req.headers.authorization || '').replace(/^Bearer /, '');
  if (!token) return res.status(401).json({ error: 'Nicht angemeldet' });
  const { data, error } = await admin.auth.getUser(token);
  if (error || !data.user) return res.status(401).json({ error: 'Sitzung ungültig' });
  req.user = data.user;
  next();
}

export async function getProfile(userId) {
  if (!admin) return null;
  const { data } = await admin.from('profiles').select('*').eq('id', userId).maybeSingle();
  return data;
}
