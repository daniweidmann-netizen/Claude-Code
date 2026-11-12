import { useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { Menu, X, Mail, ShieldCheck } from 'lucide-react';
import { Logo, ThemeToggle, LangSwitch, StripeBadge } from './ui.jsx';
import { useI18n } from '../i18n/index.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { SITE } from '../config/site.js';
import { useEffect } from 'react';
import { translate as tr } from '../i18n/index.jsx';

const TikTokIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}><path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" /></svg>
);
const InstagramIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" {...props}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>
);


function Navbar() {
  const { t } = useI18n();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const loc = useLocation();
  useEffect(() => setOpen(false), [loc]);
  const links = [
    ['/#features', t('nav.features')],
    ['/preise', t('nav.pricing')],
    ['/#faq', t('nav.faq')],
  ];
  return (
    <header className="sticky top-0 z-40 border-b border-navy-100/70 bg-white/85 backdrop-blur dark:border-navy-800 dark:bg-navy-950/85">
      <nav className="container-x flex h-16 items-center justify-between" aria-label={tr("Hauptnavigation")}>
        <Logo />
        <div className="hidden items-center gap-1 md:flex">
          {links.map(([href, label]) => (
            <a key={href} href={href} className="rounded-lg px-4 py-2 text-[15px] font-medium text-navy-600 hover:text-navy-950 dark:text-white/90 dark:hover:text-white">{label}</a>
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
          <button className="btn-icon md:hidden" onClick={() => setOpen(!open)} aria-expanded={open} aria-label={tr("Menü")}>
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

function TrustBar() {
  return (
    <div className="border-t border-navy-100 bg-navy-50 dark:border-navy-800 dark:bg-navy-900">
      <div className="container-x grid gap-4 py-6 text-sm text-navy-600 dark:text-navy-200 sm:grid-cols-3 sm:divide-x sm:divide-navy-200 dark:sm:divide-navy-700">
        <div className="flex items-center justify-center gap-3"><span className="text-xl font-black tracking-tight text-navy-950 dark:text-white">{tr("stripe")}</span>{tr("Zahlung via Stripe")}</div>
        <div className="flex items-center justify-center gap-3"><ShieldCheck className="h-6 w-6" strokeWidth={1.6} />{tr("DSGVO/DSG-konform")}</div>
        <a href={`mailto:${SITE.contactEmail}`} className="flex items-center justify-center gap-3 hover:text-navy-950 dark:hover:text-white"><Mail className="h-6 w-6" strokeWidth={1.6} />{SITE.contactEmail}</a>
      </div>
    </div>
  );
}

export function Footer() {
  const { t, lang } = useI18n();
  return (
    <>
    <TrustBar />
    <footer className="border-t border-navy-100 bg-white dark:border-navy-800 dark:bg-navy-950">
      <div className="container-x grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-3">
          <Logo />
          <p className="text-sm muted">{t('hero.title1')} {t('hero.title2')}</p>
          <StripeBadge />
        </div>
        <div>
          <h3 className="mb-3 text-sm font-semibold">{t('footer.product')}</h3>
          <ul className="space-y-2 text-sm muted">
            <li><a href="/#features">{t('nav.features')}</a></li>
            <li><Link to="/preise">{t('nav.pricing')}</Link></li>
            <li><a href="/#faq">{t('nav.faq')}</a></li>
            <li><Link to={lang === 'de' ? '/ratgeber' : '/guides'}>{lang === 'de' ? 'Ratgeber' : 'Guides'}</Link></li>
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
          <div className="mt-4 flex gap-3">
            <a href={SITE.social.tiktok} target="_blank" rel="noopener" aria-label="TrueReel on TikTok" className="btn-icon h-10 w-10"><TikTokIcon className="h-5 w-5" /></a>
            <a href={SITE.social.instagram} target="_blank" rel="noopener" aria-label="TrueReel on Instagram" className="btn-icon h-10 w-10"><InstagramIcon className="h-5 w-5" /></a>
          </div>
          <p className="mt-3 text-xs muted">{SITE.company.legalName}<br />{SITE.company.zipCity}</p>
        </div>
      </div>
      <div className="border-t border-navy-100 py-5 text-center text-xs muted dark:border-navy-800">
        © {new Date().getFullYear()} {SITE.name}. {t('footer.rights')}
      </div>
    </footer>
    </>
  );
}

export default function SiteLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2">{tr("Zum Inhalt")}</a>
      <Navbar />
      <main id="main" className="flex-1"><Outlet /></main>
      <Footer />
    </div>
  );
}
