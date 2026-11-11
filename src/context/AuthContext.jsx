import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { supabase, DEMO_MODE } from '../lib/supabase.js';
import { useI18n } from '../i18n/index.jsx';

const AuthContext = createContext(null);
const DEMO_USER_KEY = 'tr-demo-user';
const DEMO_PROFILE_KEY = 'tr-demo-profile';

const defaultProfile = (user) => ({
  id: user.id,
  email: user.email,
  full_name: user.user_metadata?.full_name || '',
  plan: 'free',
  billing_interval: null,
  subscription_status: null,
  cancel_at_period_end: false,
  current_period_end: null,
  free_videos_used: 0,
  onboarding_done: false,
  locale: 'de',
});

const readJSON = (k) => { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } };
const writeJSON = (k, v) => localStorage.setItem(k, JSON.stringify(v));

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recovery, setRecovery] = useState(false); // Nutzer kam über „Passwort vergessen“-Link
  const { lang } = useI18n();

  const loadProfile = useCallback(async (u) => {
    if (!u) { setProfile(null); return null; }
    if (DEMO_MODE) {
      const p = readJSON(DEMO_PROFILE_KEY) || defaultProfile(u);
      writeJSON(DEMO_PROFILE_KEY, p);
      setProfile(p);
      return p;
    }
    const { data, error } = await supabase.from('profiles').select('*').eq('id', u.id).maybeSingle();
    if (error) console.error(error);
    const p = data || defaultProfile(u);
    setProfile(p);
    return p;
  }, []);

  useEffect(() => {
    if (DEMO_MODE) {
      const u = readJSON(DEMO_USER_KEY);
      setUser(u);
      loadProfile(u).finally(() => setLoading(false));
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      const u = data.session?.user ?? null;
      setUser(u);
      loadProfile(u).finally(() => setLoading(false));
    });
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') setRecovery(true);
      const u = session?.user ?? null;
      setUser(u);
      loadProfile(u);
    });
    return () => sub.subscription.unsubscribe();
  }, [loadProfile]);

  // Sprache im Konto merken – die Supabase-E-Mails (Bestätigung, Passwort) nutzen sie
  useEffect(() => {
    if (DEMO_MODE || !user || user.user_metadata?.lang === lang) return;
    supabase.auth.updateUser({ data: { lang } }).catch(() => {});
  }, [user, lang]);

  const demoLogin = (email, fullName = '') => {
    const u = { id: 'demo-' + btoa(email).replace(/=/g, ''), email, user_metadata: { full_name: fullName } };
    writeJSON(DEMO_USER_KEY, u);
    setUser(u);
    return loadProfile(u);
  };

  const signUp = async ({ email, password, fullName }) => {
    if (DEMO_MODE) { await demoLogin(email, fullName); return { needsConfirmation: false }; }
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: fullName, lang }, emailRedirectTo: `${window.location.origin}/app` },
    });
    if (error) throw error;
    return { needsConfirmation: !data.session };
  };

  const signIn = async ({ email, password }) => {
    if (DEMO_MODE) return demoLogin(email);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signInWithGoogle = async () => {
    if (DEMO_MODE) return demoLogin('demo.google@truereel.app', 'Demo Google');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/app` },
    });
    if (error) throw error;
  };

  const resetPassword = async (email) => {
    if (DEMO_MODE) return;
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/app/account` });
    if (error) throw error;
  };

  const updatePassword = async (password) => {
    if (DEMO_MODE) return;
    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw error;
    setRecovery(false);
  };

  const signOut = async () => {
    if (DEMO_MODE) localStorage.removeItem(DEMO_USER_KEY);
    else await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  const updateProfile = async (patch) => {
    const next = { ...profile, ...patch };
    if (DEMO_MODE) writeJSON(DEMO_PROFILE_KEY, next);
    else {
      // Plan-/Abo-Felder werden nur serverseitig (Stripe-Webhook) gesetzt.
      const { plan, billing_interval, subscription_status, cancel_at_period_end, current_period_end, stripe_customer_id, ...safe } = patch;
      const { error } = await supabase.from('profiles').update(safe).eq('id', user.id);
      if (error) throw error;
    }
    setProfile(next);
    return next;
  };

  return (
    <AuthContext.Provider value={{
      user, profile, loading, demo: DEMO_MODE, recovery,
      signUp, signIn, signInWithGoogle, signOut, resetPassword, updateProfile, updatePassword,
      refreshProfile: () => loadProfile(user),
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
