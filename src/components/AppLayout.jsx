import { useEffect, useRef, useState } from 'react';
import { NavLink, Navigate, Outlet, useLocation, Link } from 'react-router-dom';
import { Home, Layers, CalendarDays, CreditCard, LogOut, HelpCircle, Bell, ChevronDown, Moon, Sun } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { Logo, Spinner, LangSwitch } from './ui.jsx';
import { SITE } from '../config/site.js';
import { listVideos } from '../lib/store.js';
import { computeUsage } from '../lib/usage.js';
import { translate as tr } from '../i18n/index.jsx';

const NAV = [
  { to: '/app', label: 'Übersicht', icon: Home, end: true },
  { to: '/app/serien', label: 'Serien', icon: Layers },
  { to: '/app/kalender', label: 'Kalender', icon: CalendarDays },
  { to: '/app/account', label: 'Konto & Abrechnung', short: 'Konto', icon: CreditCard },
];

export function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  const loc = useLocation();
  if (loading) return <div className="flex min-h-screen items-center justify-center"><Spinner className="h-6 w-6 text-accent-500" /></div>;
  if (!user) return <Navigate to="/login" state={{ from: loc }} replace />;
  return children;
}

function useUsage() {
  const { user, profile } = useAuth();
  const loc = useLocation();
  const [usage, setUsage] = useState(null);
  useEffect(() => {
    if (!user) return;
    listVideos(user.id).then((v) => setUsage(computeUsage(profile, v))).catch(() => {});
  }, [user, profile, loc.pathname]);
  return usage;
}

function ProfileMenu() {
  const { profile, user, signOut } = useAuth();
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const close = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, []);
  const name = profile?.full_name || user?.email || '?';
  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(!open)} className="flex items-center gap-1.5" aria-expanded={open} aria-label={tr("Profilmenü")}>
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-500 text-sm font-bold uppercase text-navy-950">{name[0]}</span>
        <ChevronDown className="h-4 w-4 muted" />
      </button>
      {open && (
        <div className="absolute right-0 top-12 z-40 w-60 rounded-xl border border-navy-100 bg-white p-2 shadow-xl dark:border-navy-700 dark:bg-navy-900">
          <p className="truncate px-3 py-2 text-sm font-semibold">{name}</p>
          <Link to="/app/account" className="block rounded-lg px-3 py-2 text-sm hover:bg-navy-50 dark:hover:bg-navy-800" onClick={() => setOpen(false)}>{tr("Konto & Abrechnung")}</Link>
          {profile?.is_admin && <Link to="/app/statistik" className="block rounded-lg px-3 py-2 text-sm hover:bg-navy-50 dark:hover:bg-navy-800" onClick={() => setOpen(false)}>{tr("Statistik")}</Link>}
          <div className="flex items-center justify-between px-3 py-2 text-sm"><span>{tr("Sprache")}</span><LangSwitch /></div>
          <button onClick={toggle} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm hover:bg-navy-50 dark:hover:bg-navy-800">
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}{theme === 'dark' ? tr('Hellmodus') : tr('Dunkelmodus')}
          </button>
          <button onClick={signOut} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-navy-50 dark:text-red-400 dark:hover:bg-navy-800"><LogOut className="h-4 w-4" />{tr("Abmelden")}</button>
        </div>
      )}
    </div>
  );
}

export default function AppLayout() {
  const { demo } = useAuth();
  const usage = useUsage();
  return (
    <div className="min-h-screen bg-navy-50/60 dark:bg-navy-950">
      {demo && (
        <div className="bg-amber-100 px-4 py-1.5 text-center text-xs text-amber-900 dark:bg-amber-900/50 dark:text-amber-100">
          {tr("Demo-Modus – Daten liegen nur in diesem Browser.")}
        </div>
      )}
      <aside className="fixed bottom-0 left-0 z-30 hidden w-[17rem] flex-col border-r border-navy-100 bg-white px-5 py-5 dark:border-navy-800 dark:bg-navy-950 lg:flex" style={{ top: demo ? 28 : 0 }}>
        <Logo to="/app" className="px-1 py-1" />
        <nav className="mt-8 space-y-1.5" aria-label={tr("App-Navigation")}>
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={({ isActive }) => `flex items-center gap-3 rounded-xl px-4 py-3 text-[15px] font-medium transition ${isActive ? 'bg-accent-500 font-semibold text-navy-950' : 'text-navy-600 hover:bg-navy-50 dark:text-white/90 dark:hover:bg-navy-900'}`}>
              <Icon className="h-5 w-5" strokeWidth={1.8} />{tr(label)}
            </NavLink>
          ))}
        </nav>
        {usage && (
          <div className="mt-6 border-t border-navy-100 pt-6 dark:border-navy-800">
            {usage.owner ? <p className="text-[15px] font-medium">{tr('Inhaber-Konto: unbegrenzt')}</p> : <>
            <p className="text-[15px] font-medium">{tr('{used} von {limit} Videos genutzt', { used: usage.used, limit: usage.limit })}</p>
            <div className="mt-3 h-3 overflow-hidden rounded-full bg-navy-100 dark:bg-navy-800" role="progressbar" aria-valuenow={usage.used} aria-valuemax={usage.limit}>
              <div className="h-full rounded-full bg-accent-500" style={{ width: `${Math.min(100, (usage.used / usage.limit) * 100)}%` }} />
            </div></>}
            {usage.plan.id === 'free' && <Link to="/preise" className="mt-3 inline-block text-sm font-semibold text-accent-700 dark:text-accent-500">{tr("Plan wählen →")}</Link>}
          </div>
        )}
        <a href={`mailto:${SITE.supportEmail}`} className="mt-auto text-xs muted hover:underline">{SITE.supportEmail}</a>
      </aside>

      <div className="lg:pl-[17rem]">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-navy-100 bg-white/90 px-4 backdrop-blur dark:border-navy-800 dark:bg-navy-950/90 sm:px-6 lg:justify-end">
          <div className="lg:hidden"><Logo to="/app" /></div>
          <div className="flex items-center gap-2 sm:gap-4">
            <a href={`mailto:${SITE.supportEmail}?subject=Hilfe%20TrueReel`} className="btn-icon h-10 w-10" aria-label={tr("Hilfe")} title={tr("Hilfe & Support")}><HelpCircle className="h-6 w-6" strokeWidth={1.6} /></a>
            <Link to="/app/kalender" className="btn-icon h-10 w-10" aria-label={tr("Geplante Posts")} title={tr("Geplante Posts")}><Bell className="h-6 w-6" strokeWidth={1.6} /></Link>
            <ProfileMenu />
          </div>
        </header>
        <main className="pb-24 lg:pb-10">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8"><Outlet /></div>
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-navy-100 bg-white pb-[env(safe-area-inset-bottom)] dark:border-navy-800 dark:bg-navy-950 lg:hidden" aria-label={tr("App-Navigation mobil")}>
        {NAV.map(({ to, label, short, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} className={({ isActive }) => `flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium ${isActive ? 'text-accent-700 dark:text-accent-500' : 'text-navy-500 dark:text-navy-300'}`}>
            <Icon className="h-5 w-5" />{tr(short || label)}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

export function PageHeader({ title, sub, actions }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h1>
        {sub && <p className="mt-1.5 text-base muted sm:text-lg">{sub}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}
