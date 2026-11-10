import { Link } from 'react-router-dom';
import { Moon, Sun, Lock, ShieldCheck, RefreshCcw, Gift, Eye } from 'lucide-react';
import { useTheme } from '../context/ThemeContext.jsx';
import { useI18n, UI_LANGUAGES } from '../i18n/index.jsx';

export function Logo({ to = '/', className = '' }) {
  return (
    <Link to={to} className={`flex items-center gap-2 font-bold ${className}`} aria-label="TrueReel Startseite">
      <svg viewBox="0 0 32 32" className="h-8 w-8" aria-hidden="true">
        <rect width="32" height="32" rx="8" className="fill-navy-900 dark:fill-navy-800" />
        <rect x="10" y="6" width="12" height="20" rx="3" fill="none" stroke="#33d4a3" strokeWidth="2" />
        <path d="M14 12.5v7l5.5-3.5z" fill="#33d4a3" />
      </svg>
      <span className="text-lg tracking-tight">True<span className="text-accent-600 dark:text-accent-400">Reel</span></span>
    </Link>
  );
}

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button onClick={toggle} className="btn-icon" aria-label={theme === 'dark' ? 'Hellmodus' : 'Dunkelmodus'} title={theme === 'dark' ? 'Hellmodus' : 'Dunkelmodus'}>
      {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}

export function LangSwitch() {
  const { lang, setLang } = useI18n();
  return (
    <div className="flex rounded-lg border border-navy-100 p-0.5 text-xs font-semibold dark:border-navy-800" role="group" aria-label="Sprache">
      {UI_LANGUAGES.map((l) => (
        <button key={l.id} onClick={() => setLang(l.id)} aria-pressed={lang === l.id}
          className={`rounded-md px-2 py-1 ${lang === l.id ? 'bg-navy-900 text-white dark:bg-white dark:text-navy-900' : 'text-navy-500 dark:text-navy-300'}`}>
          {l.label}
        </button>
      ))}
    </div>
  );
}

export function StripeBadge({ className = '' }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md border border-navy-200 px-2 py-1 text-xs font-medium text-navy-600 dark:border-navy-700 dark:text-navy-300 ${className}`}>
      <Lock className="h-3 w-3" /> Powered by <span className="font-bold text-[#635bff]">stripe</span>
    </span>
  );
}

export function TrustRow({ className = '' }) {
  const { t } = useI18n();
  const items = [
    [Gift, t('trust.free')],
    [RefreshCcw, t('trust.cancel')],
    [Eye, t('trust.approval')],
    [ShieldCheck, t('trust.gdpr')],
  ];
  return (
    <ul className={`flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-navy-600 dark:text-navy-300 ${className}`}>
      {items.map(([Icon, label]) => (
        <li key={label} className="flex items-center gap-1.5"><Icon className="h-4 w-4 text-accent-600 dark:text-accent-400" />{label}</li>
      ))}
      <li><StripeBadge /></li>
    </ul>
  );
}

export function PhoneFrame({ children, className = '' }) {
  return (
    <div className={`relative mx-auto w-full max-w-[280px] rounded-[2.6rem] border-[10px] border-navy-900 bg-navy-900 shadow-2xl dark:border-navy-700 ${className}`}>
      <div className="absolute left-1/2 top-2 z-10 h-5 w-24 -translate-x-1/2 rounded-full bg-navy-900 dark:bg-navy-700" aria-hidden="true" />
      <div className="overflow-hidden rounded-[2rem]">{children}</div>
    </div>
  );
}

export function Spinner({ className = 'h-4 w-4' }) {
  return <span className={`inline-block animate-spin rounded-full border-2 border-current border-t-transparent ${className}`} aria-hidden="true" />;
}

export function Notice({ tone = 'info', children, className = '' }) {
  const tones = {
    info: 'border-navy-200 bg-navy-50 text-navy-700 dark:border-navy-700 dark:bg-navy-900 dark:text-navy-200',
    warn: 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200',
    success: 'border-accent-200 bg-accent-50 text-accent-800 dark:border-accent-800 dark:bg-accent-900/20 dark:text-accent-200',
    error: 'border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200',
  };
  return <div className={`rounded-xl border px-4 py-3 text-sm ${tones[tone]} ${className}`} role={tone === 'error' ? 'alert' : 'status'}>{children}</div>;
}

export function Toggle({ checked, onChange, label, id }) {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-center justify-between gap-4">
      <span className="text-sm">{label}</span>
      <button id={id} type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${checked ? 'bg-accent-500' : 'bg-navy-200 dark:bg-navy-700'}`}>
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${checked ? 'left-[22px]' : 'left-0.5'}`} />
      </button>
    </label>
  );
}
