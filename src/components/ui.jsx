import { useId } from 'react';
import { Link } from 'react-router-dom';
import { Moon, Sun, Lock, ShieldCheck, RefreshCcw, Gift, Eye } from 'lucide-react';
import { useTheme } from '../context/ThemeContext.jsx';
import { useI18n, UI_LANGUAGES } from '../i18n/index.jsx';

// Logo-Zeichen „Feed-Stapel“: gestapelte Hochformat-Videos, vorne das Play
export function LogoMark({ className = 'h-8 w-8', simple = false }) {
  const id = useId().replace(/:/g, '');
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`trg${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#dcf86f" /><stop offset="1" stopColor="#b5dc22" /></linearGradient>
      </defs>
      {!simple && <rect x="38" y="10" width="40" height="66" rx="12" fill="#8b919c" opacity=".45" transform="rotate(10 58 43)" />}
      {!simple && <rect x="30" y="16" width="40" height="68" rx="12" fill="#4f5560" opacity=".75" transform="rotate(4 50 50)" />}
      <g transform="rotate(-6 50 52)">
        <rect x="22" y="18" width="56" height="68" rx="13" fill={`url(#trg${id})`} />
        <path d="M43 40.6v18.8c0 2.3 2.5 3.7 4.5 2.5l15-9.4c1.8-1.1 1.8-3.8 0-4.9l-15-9.4c-2-1.2-4.5.2-4.5 2.4z" fill="#1b1e23" />
      </g>
    </svg>
  );
}

export function Logo({ to = '/', className = '' }) {
  return (
    <Link to={to} className={`flex items-center gap-2 ${className}`} aria-label="TrueReel Startseite">
      <LogoMark className="h-9 w-9" />
      <span className="text-xl font-black tracking-[-0.04em]" aria-hidden="true">true<span className="text-accent-700 dark:text-accent-500">reel</span></span>
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
        <li key={label} className="flex items-center gap-1.5"><Icon className="h-4 w-4 text-accent-700 dark:text-accent-400" />{label}</li>
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
