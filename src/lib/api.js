import { supabase } from './supabase.js';

// Fetch-Wrapper für den eigenen Server (/api). Hängt das Supabase-JWT an.
export async function api(path, { method = 'GET', body, headers = {}, raw = false } = {}) {
  const h = { ...headers };
  if (supabase) {
    const { data } = await supabase.auth.getSession();
    if (data.session) h.Authorization = `Bearer ${data.session.access_token}`;
  }
  let payload = body;
  if (body && !(body instanceof FormData) && typeof body !== 'string') {
    h['Content-Type'] = 'application/json';
    payload = JSON.stringify(body);
  }
  const res = await fetch(`/api${path}`, { method, headers: h, body: payload });
  if (raw) return res;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Fehler ${res.status}`);
  return data;
}

export async function apiAvailable() {
  try {
    const r = await fetch('/api/health');
    return r.ok ? r.json() : null;
  } catch {
    return null;
  }
}
