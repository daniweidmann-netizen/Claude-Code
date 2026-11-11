import { useEffect } from 'react';
import { useI18n } from './i18n/index.jsx';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import SiteLayout from './components/SiteLayout.jsx';
import AppLayout, { RequireAuth } from './components/AppLayout.jsx';
import Landing from './pages/Landing.jsx';
import PricingPage from './pages/PricingPage.jsx';
import { Login, Register } from './pages/Auth.jsx';
import Dashboard from './pages/app/Dashboard.jsx';
import SeriesWizard from './pages/app/SeriesWizard.jsx';
import { SeriesList, SeriesDetail } from './pages/app/Series.jsx';
import Editor from './pages/app/Editor.jsx';
import Calendar from './pages/app/Calendar.jsx';
import Account from './pages/app/Account.jsx';
import { Impressum, Datenschutz, AGB, Rueckerstattung } from './pages/legal/Legal.jsx';
import { translate as tr } from './i18n/index.jsx';

function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) { setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 50); return; }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

function NotFound() {
  return (
    <div className="section text-center">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="mt-2 muted">{tr("Diese Seite gibt es nicht.")}</p>
      <Link to="/" className="btn-primary mt-6">{tr("Zur Startseite")}</Link>
    </div>
  );
}

export default function App() {
  const { lang } = useI18n(); // Sprachwechsel → Seiten neu aufbauen
  return (
    <>
      <ScrollManager />
      <Routes key={lang}>
        <Route element={<SiteLayout />}>
          <Route index element={<Landing />} />
          <Route path="preise" element={<PricingPage />} />
          <Route path="impressum" element={<Impressum />} />
          <Route path="datenschutz" element={<Datenschutz />} />
          <Route path="agb" element={<AGB />} />
          <Route path="rueckerstattung" element={<Rueckerstattung />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="login" element={<Login />} />
        <Route path="registrieren" element={<Register />} />
        <Route path="app" element={<RequireAuth><AppLayout /></RequireAuth>}>
          <Route index element={<Dashboard />} />
          <Route path="onboarding" element={<SeriesWizard />} />
          <Route path="serien" element={<SeriesList />} />
          <Route path="serien/neu" element={<SeriesWizard />} />
          <Route path="serien/:id" element={<SeriesDetail />} />
          <Route path="video/:id" element={<Editor />} />
          <Route path="kalender" element={<Calendar />} />
          <Route path="account" element={<Account />} />
        </Route>
      </Routes>
    </>
  );
}
