import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Ohne Keys läuft die App im Demo-Modus (lokale Daten im Browser).
export const supabase = url && anon ? createClient(url, anon) : null;
export const DEMO_MODE = !supabase;
