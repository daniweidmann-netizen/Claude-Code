// Verschlüsselt OAuth-Tokens (AES-256-GCM), bevor sie in der Datenbank landen.
// Schlüssel: TOKEN_ENCRYPTION_KEY, sonst abgeleitet vom Supabase-Service-Key (liegt nur auf dem Server).
// Alte, unverschlüsselte Werte werden weiter gelesen und beim nächsten Speichern verschlüsselt.
import crypto from 'node:crypto';

const PREFIX = 'enc:v1:';
const secret = process.env.TOKEN_ENCRYPTION_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const key = secret ? crypto.createHash('sha256').update(`truereel-oauth-tokens:${secret}`).digest() : null;

export function encryptToken(value) {
  if (!value || !key || String(value).startsWith(PREFIX)) return value ?? null;
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const data = Buffer.concat([cipher.update(String(value), 'utf8'), cipher.final()]);
  return PREFIX + Buffer.concat([iv, cipher.getAuthTag(), data]).toString('base64');
}

export function decryptToken(value) {
  if (!value || !String(value).startsWith(PREFIX)) return value ?? null;
  if (!key) throw new Error('Token-Schlüssel fehlt');
  const raw = Buffer.from(String(value).slice(PREFIX.length), 'base64');
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, raw.subarray(0, 12));
  decipher.setAuthTag(raw.subarray(12, 28));
  return Buffer.concat([decipher.update(raw.subarray(28)), decipher.final()]).toString('utf8');
}

// Zeile aus social_connections → Klartext-Tokens für die Plattform-Module
export const decryptConnection = (c) => c && ({ ...c, access_token: decryptToken(c.access_token), refresh_token: decryptToken(c.refresh_token) });

// Felder zum Speichern → verschlüsselt (nur die Token-Felder, die vorhanden sind)
export function encryptFields(f) {
  const out = { ...f };
  if ('access_token' in out) out.access_token = encryptToken(out.access_token);
  if ('refresh_token' in out) out.refresh_token = encryptToken(out.refresh_token);
  return out;
}

// Beim Serverstart: noch unverschlüsselte Tokens einmalig verschlüsseln
export async function encryptExistingTokens(admin) {
  if (!admin || !key) return;
  try {
    const { data } = await admin.from('social_connections').select('id, access_token, refresh_token');
    for (const row of data || []) {
      const plain = [row.access_token, row.refresh_token].some((v) => v && !String(v).startsWith(PREFIX));
      if (plain) await admin.from('social_connections').update(encryptFields({ access_token: row.access_token, refresh_token: row.refresh_token })).eq('id', row.id);
    }
  } catch (e) { console.warn('[tokens] Verschlüsselung bestehender Tokens:', e.message); }
}
