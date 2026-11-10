import { createClient } from '@supabase/supabase-js';

// In Produktion setzt der Server die öffentliche Konfiguration zur Laufzeit in index.html
// (window.__TRUEREEL_CONFIG__) – so braucht das Hosting keine Build-Variablen.
// Lokal (Vite) kommen die Werte aus .env (VITE_*).
const runtime = (typeof window !== 'undefined' && window.__TRUEREEL_CONFIG__) || {};
const url = runtime.supabaseUrl || import.meta.env.VITE_SUPABASE_URL;
const anon = runtime.supabaseAnonKey || import.meta.env.VITE_SUPABASE_ANON_KEY;

// Ohne Keys läuft die App im Demo-Modus (lokale Daten im Browser).
export const supabase = url && anon ? createClient(url, anon) : null;
export const DEMO_MODE = !supabase;
