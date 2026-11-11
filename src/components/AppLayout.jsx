import { NavLink, Navigate, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Layers, CalendarDays, CreditCard, LogOut, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { Logo, ThemeToggle, Spinner } from './ui.jsx';
import { getPlan } from '../config/plans.js';
import { SITE } from '../config/site.js';

const NAV = [
  { to: '/app', label: 'Dashboard', icon: LayoutDashboard, end: true },
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

export default function AppLayout() {
  const { profile, signOut, demo, user } = useAuth();
  const plan = getPlan(profile?.plan);
  return (
    <div className="min-h-screen bg-navy-50/50 dark:bg-navy-950">
      {demo && (
        <div className="bg-amber-100 px-4 py-1.5 text-center text-xs text-amber-900 dark:bg-amber-900/50 dark:text-amber-100">
          Demo-Modus – Daten liegen nur in diesem Browser. Für echten Betrieb Supabase & Stripe in <code>.env</code> konfigurieren.
        </div>
      )}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-navy-100 bg-white p-4 dark:border-navy-800 dark:bg-navy-900 lg:flex" style={demo ? { top: 28 } : undefined}>
        <Logo to="/app" className="px-2 py-1" />
        <NavLink to="/app/serien/neu" className="btn-primary mt-6"><Plus className="h-4 w-4" />Neue Serie</NavLink>
        <nav className="mt-6 flex-1 space-y-1" aria-label="App-Navigation">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${isActive ? 'bg-navy-900 text-white dark:bg-navy-800' : 'text-navy-600 hover:bg-navy-50 dark:text-navy-300 dark:hover:bg-navy-800'}`}>
              <Icon className="h-4 w-4" />{label}
            </NavLink>
          ))}
        </nav>
        <div className="rounded-xl border border-navy-100 p-3 text-xs dark:border-navy-800">
          <p className="truncate font-medium">{profile?.full_name || user?.email}</p>
          <p className="muted">Plan: <span className="font-semibold">{plan.name}</span></p>
          <a href={`mailto:${SITE.supportEmail}`} className="mt-1 block text-accent-700 dark:text-accent-400">{SITE.supportEmail}</a>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <ThemeToggle />
          <button onClick={signOut} className="btn-ghost px-2 py-1.5 text-xs"><LogOut className="h-4 w-4" />Abmelden</button>
        </div>
      </aside>

      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-navy-100 bg-white/90 px-4 backdrop-blur dark:border-navy-800 dark:bg-navy-900/90 lg:hidden">
        <Logo to="/app" />
        <div className="flex items-center gap-1">
          <NavLink to="/app/serien/neu" className="btn-icon" aria-label="Neue Serie"><Plus className="h-5 w-5" /></NavLink>
          <ThemeToggle />
          <button onClick={signOut} className="btn-icon" aria-label="Abmelden"><LogOut className="h-4 w-4" /></button>
        </div>
      </header>

      <main className="pb-24 lg:pb-10 lg:pl-64">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:py-10"><Outlet /></div>
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-navy-100 bg-white pb-[env(safe-area-inset-bottom)] dark:border-navy-800 dark:bg-navy-900 lg:hidden" aria-label="App-Navigation mobil">
        {NAV.map(({ to, label, short, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} className={({ isActive }) => `flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium ${isActive ? 'text-accent-700 dark:text-accent-400' : 'text-navy-500 dark:text-navy-300'}`}>
            <Icon className="h-5 w-5" />{short || label}
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
        <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
        {sub && <p className="mt-1 text-sm muted">{sub}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}
