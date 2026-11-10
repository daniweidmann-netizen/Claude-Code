import { useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { Menu, X, Mail } from 'lucide-react';
import { Logo, ThemeToggle, LangSwitch, StripeBadge } from './ui.jsx';
import { useI18n } from '../i18n/index.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { SITE } from '../config/site.js';
import { useEffect } from 'react';

function Navbar() {
  const { t } = useI18n();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const loc = useLocation();
  useEffect(() => setOpen(false), [loc]);
  const links = [
    ['/#how', t('nav.how')],
    ['/#features', t('nav.features')],
    ['/#examples', t('nav.examples')],
    ['/preise', t('nav.pricing')],
    ['/#faq', t('nav.faq')],
  ];
  return (
    <header className="sticky top-0 z-40 border-b border-navy-100/70 bg-white/80 backdrop-blur dark:border-navy-800/70 dark:bg-navy-950/80">
      <nav className="container-x flex h-16 items-center justify-between" aria-label="Hauptnavigation">
        <Logo />
        <div className="hidden items-center gap-1 md:flex">
          {links.map(([href, label]) => (
            <a key={href} href={href} className="rounded-lg px-3 py-2 text-sm font-medium text-navy-600 hover:text-navy-900 dark:text-navy-300 dark:hover:text-white">{label}</a>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden sm:block"><LangSwitch /></div>
          <ThemeToggle />
          {user ? (
            <Link to="/app" className="btn-primary hidden sm:inline-flex">{t('nav.dashboard')}</Link>
          ) : (
            <>
              <Link to="/login" className="btn-ghost hidden sm:inline-flex">{t('nav.login')}</Link>
              <Link to="/registrieren" className="btn-primary hidden sm:inline-flex">{t('nav.start')}</Link>
            </>
          )}
          <button className="btn-icon md:hidden" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Menü">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>
      {open && (
        <div className="border-t border-navy-100 bg-white px-4 pb-4 pt-2 dark:border-navy-800 dark:bg-navy-950 md:hidden">
          {links.map(([href, label]) => (
            <a key={href} href={href} onClick={() => setOpen(false)} className="block rounded-lg px-2 py-3 text-base font-medium">{label}</a>
          ))}
          <div className="mt-3 flex items-center justify-between"><LangSwitch /></div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {user ? <Link to="/app" className="btn-primary col-span-2">{t('nav.dashboard')}</Link> : (
              <>
                <Link to="/login" className="btn-outline">{t('nav.login')}</Link>
                <Link to="/registrieren" className="btn-primary">{t('nav.start')}</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="border-t border-navy-100 bg-navy-50/50 dark:border-navy-800 dark:bg-navy-950">
      <div className="container-x grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-3">
          <Logo />
          <p className="text-sm muted">{SITE.claim}</p>
          <StripeBadge />
        </div>
        <div>
          <h3 className="mb-3 text-sm font-semibold">{t('footer.product')}</h3>
          <ul className="space-y-2 text-sm muted">
            <li><a href="/#features">{t('nav.features')}</a></li>
            <li><Link to="/preise">{t('nav.pricing')}</Link></li>
            <li><a href="/#faq">{t('nav.faq')}</a></li>
            <li><Link to="/registrieren">{t('nav.start')}</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-semibold">{t('footer.legal')}</h3>
          <ul className="space-y-2 text-sm muted">
            <li><NavLink to="/impressum">{t('footer.imprint')}</NavLink></li>
            <li><NavLink to="/datenschutz">{t('footer.privacy')}</NavLink></li>
            <li><NavLink to="/agb">{t('footer.terms')}</NavLink></li>
            <li><NavLink to="/rueckerstattung">{t('footer.refund')}</NavLink></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-semibold">{t('footer.contact')}</h3>
          <a href={`mailto:${SITE.contactEmail}`} className="flex items-center gap-2 text-sm font-medium text-accent-700 dark:text-accent-400">
            <Mail className="h-4 w-4" />{SITE.contactEmail}
          </a>
          <p className="mt-3 text-xs muted">{SITE.company.legalName}<br />{SITE.company.zipCity}</p>
        </div>
      </div>
      <div className="border-t border-navy-100 py-5 text-center text-xs muted dark:border-navy-800">
        © {new Date().getFullYear()} {SITE.name}. {t('footer.rights')}
      </div>
    </footer>
  );
}

export default function SiteLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2">Zum Inhalt</a>
      <Navbar />
      <main id="main" className="flex-1"><Outlet /></main>
      <Footer />
    </div>
  );
}
