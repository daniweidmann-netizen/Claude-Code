import { useState } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { useI18n } from '../i18n/index.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { Logo, Notice, Spinner, ThemeToggle, LangSwitch } from '../components/ui.jsx';

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.44.34-2.1V7.07H2.18A11 11 0 0 0 1 12c0 1.78.43 3.45 1.18 4.93l3.66-2.83z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
    </svg>
  );
}

function AuthShell({ title, sub, children }) {
  const { demo } = useAuth();
  return (
    <div className="flex min-h-screen flex-col bg-navy-50/50 dark:bg-navy-950">
      <header className="container-x flex h-16 items-center justify-between">
        <Logo />
        <div className="flex items-center gap-2"><LangSwitch /><ThemeToggle /></div>
      </header>
      <main className="flex flex-1 items-start justify-center px-4 pb-16 pt-6 sm:items-center">
        <div className="card w-full max-w-md p-6 sm:p-8">
          <h1 className="text-2xl font-bold">{title}</h1>
          {sub && <p className="mt-1 text-sm muted">{sub}</p>}
          {demo && <Notice tone="warn" className="mt-4">Demo-Modus: Supabase ist nicht konfiguriert. Daten werden nur lokal in diesem Browser gespeichert; das Passwort wird nicht geprüft.</Notice>}
          <div className="mt-6">{children}</div>
        </div>
      </main>
    </div>
  );
}

function useAfterAuth() {
  const [params] = useSearchParams();
  const plan = params.get('plan');
  const interval = params.get('interval') || 'monthly';
  return plan ? `/app/account?checkout_plan=${plan}&interval=${interval}` : '/app';
}

export function Login() {
  const { t } = useI18n();
  const { user, signIn, signInWithGoogle, resetPassword } = useAuth();
  const navigate = useNavigate();
  const next = useAfterAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);
  if (user) return <Navigate to={next} replace />;

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true); setMsg(null);
    try { await signIn(form); navigate(next); } catch (err) { setMsg({ tone: 'error', text: err.message === 'Invalid login credentials' ? 'E-Mail oder Passwort ist falsch.' : err.message }); }
    setBusy(false);
  };
  const forgot = async () => {
    if (!form.email) return setMsg({ tone: 'warn', text: 'Bitte gib zuerst deine E-Mail-Adresse ein.' });
    try { await resetPassword(form.email); setMsg({ tone: 'success', text: t('auth.resetSent') }); } catch (err) { setMsg({ tone: 'error', text: err.message }); }
  };

  return (
    <AuthShell title={t('auth.loginTitle')}>
      <button className="btn-outline w-full" onClick={() => signInWithGoogle().catch((e) => setMsg({ tone: 'error', text: e.message }))}><GoogleIcon />{t('auth.google')}</button>
      <div className="my-5 flex items-center gap-3 text-xs muted"><span className="h-px flex-1 bg-navy-100 dark:bg-navy-800" />{t('auth.or')}<span className="h-px flex-1 bg-navy-100 dark:bg-navy-800" /></div>
      <form onSubmit={submit} className="space-y-4">
        <div><label className="label" htmlFor="email">{t('auth.email')}</label><input id="email" type="email" required autoComplete="email" className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
        <div>
          <div className="flex items-center justify-between"><label className="label" htmlFor="pw">{t('auth.password')}</label><button type="button" onClick={forgot} className="mb-1.5 text-xs font-medium text-accent-700 dark:text-accent-400">{t('auth.forgot')}</button></div>
          <input id="pw" type="password" required autoComplete="current-password" className="input" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>
        {msg && <Notice tone={msg.tone}>{msg.text}</Notice>}
        <button className="btn-primary w-full" disabled={busy}>{busy && <Spinner />}{t('auth.login')}</button>
      </form>
      <p className="mt-6 text-center text-sm muted">{t('auth.noAccount')} <Link to="/registrieren" className="font-semibold text-accent-700 dark:text-accent-400">{t('auth.register')}</Link></p>
    </AuthShell>
  );
}

export function Register() {
  const { t } = useI18n();
  const { user, signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const next = useAfterAuth();
  const [form, setForm] = useState({ email: '', password: '', fullName: '' });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);
  if (user) return <Navigate to={next} replace />;

  const submit = async (e) => {
    e.preventDefault();
    if (form.password.length < 8) return setMsg({ tone: 'error', text: 'Das Passwort muss mindestens 8 Zeichen lang sein.' });
    setBusy(true); setMsg(null);
    try {
      const r = await signUp(form);
      if (r.needsConfirmation) setMsg({ tone: 'success', text: t('auth.checkMail') });
      else navigate(next);
    } catch (err) { setMsg({ tone: 'error', text: err.message }); }
    setBusy(false);
  };

  return (
    <AuthShell title={t('auth.registerTitle')} sub={t('auth.registerSub')}>
      <button className="btn-outline w-full" onClick={() => signInWithGoogle().catch((e) => setMsg({ tone: 'error', text: e.message }))}><GoogleIcon />{t('auth.google')}</button>
      <div className="my-5 flex items-center gap-3 text-xs muted"><span className="h-px flex-1 bg-navy-100 dark:bg-navy-800" />{t('auth.or')}<span className="h-px flex-1 bg-navy-100 dark:bg-navy-800" /></div>
      <form onSubmit={submit} className="space-y-4">
        <div><label className="label" htmlFor="name">{t('auth.name')}</label><input id="name" className="input" autoComplete="name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} /></div>
        <div><label className="label" htmlFor="email">{t('auth.email')}</label><input id="email" type="email" required autoComplete="email" className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
        <div><label className="label" htmlFor="pw">{t('auth.password')}</label><input id="pw" type="password" required minLength={8} autoComplete="new-password" className="input" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /><p className="mt-1 text-xs muted">Mindestens 8 Zeichen</p></div>
        {msg && <Notice tone={msg.tone}>{msg.text}</Notice>}
        <button className="btn-primary w-full" disabled={busy}>{busy && <Spinner />}{t('auth.register')}</button>
        <p className="text-center text-xs muted">
          {t('auth.consent').split(/(AGB|Datenschutzerklärung|terms|privacy policy)/).map((part, i) =>
            /AGB|terms/.test(part) ? <Link key={i} to="/agb" className="underline">{part}</Link>
              : /Datenschutz|privacy/.test(part) ? <Link key={i} to="/datenschutz" className="underline">{part}</Link> : part)}
        </p>
      </form>
      <p className="mt-6 text-center text-sm muted">{t('auth.hasAccount')} <Link to="/login" className="font-semibold text-accent-700 dark:text-accent-400">{t('auth.login')}</Link></p>
    </AuthShell>
  );
}
