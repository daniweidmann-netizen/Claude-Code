import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CreditCard, XCircle, Link2, Unlink, Download, Trash2, Save, Mail, KeyRound } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { PageHeader } from '../../components/AppLayout.jsx';
import { Notice, Spinner, StripeBadge } from '../../components/ui.jsx';
import { PricingSection } from '../../components/Pricing.jsx';
import { getPlan, priceFor, formatUSD } from '../../config/plans.js';
import { PLATFORMS } from '../../config/catalog.js';
import { SITE } from '../../config/site.js';
import { startCheckout, openPortal } from '../../lib/billing.js';
import { api } from '../../lib/api.js';
import { supabase, DEMO_MODE } from '../../lib/supabase.js';
import { listSeries, listVideos, clearDemoData } from '../../lib/store.js';
import { translate as tr, getLocale } from '../../i18n/index.jsx';

const DEMO_CONN = 'tr-demo-connections';

function useConnections(user) {
  const [conns, setConns] = useState([]);
  const load = async () => {
    if (DEMO_MODE) { try { setConns(JSON.parse(localStorage.getItem(DEMO_CONN)) || []); } catch { setConns([]); } return; }
    const { data } = await supabase.from('social_connections').select('id, platform, account_name, expires_at').eq('user_id', user.id);
    setConns(data || []);
  };
  useEffect(() => { if (user) load(); }, [user]); // eslint-disable-line react-hooks/exhaustive-deps
  return { conns, reload: load };
}

export default function Account() {
  const { user, profile, updateProfile, signOut, refreshProfile, recovery, updatePassword, demo } = useAuth();
  const [pw, setPw] = useState({ a: '', b: '' });
  const pwRef = useRef(null);
  useEffect(() => { if (recovery) pwRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [recovery]);
  const savePassword = async (e) => {
    e.preventDefault();
    if (pw.a.length < 8) return setMsg({ tone: 'error', text: tr("Das Passwort muss mindestens 8 Zeichen lang sein.") });
    if (pw.a !== pw.b) return setMsg({ tone: 'error', text: tr("Die beiden Passwörter stimmen nicht überein.") });
    setBusy('pw');
    try { await updatePassword(pw.a); setPw({ a: '', b: '' }); setMsg({ tone: 'success', text: tr("Neues Passwort gespeichert.") }); } catch (err) { setMsg({ tone: 'error', text: err.message }); }
    setBusy(null);
  };
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const plan = getPlan(profile?.plan);
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(null);
  const [name, setName] = useState(profile?.full_name || '');
  const { conns, reload: reloadConns } = useConnections(user);
  const handled = useRef(false);

  // Rückkehr aus Checkout / OAuth / Kündigung
  useEffect(() => {
    if (handled.current) return;
    handled.current = true;
    const checkout = params.get('checkout');
    const autoPlan = params.get('checkout_plan');
    if (checkout === 'demo') {
      const p = params.get('plan'); const interval = params.get('interval');
      const end = new Date(); end.setMonth(end.getMonth() + (interval === 'yearly' ? 12 : 1));
      updateProfile({ plan: p, billing_interval: interval, subscription_status: 'active', cancel_at_period_end: false, current_period_end: end.toISOString() });
      setMsg({ tone: 'success', text: tr('Demo-Checkout: Plan {p} aktiviert. (Ohne Stripe-Keys wird keine echte Zahlung ausgelöst.)', { p: getPlan(p).name }) });
    } else if (checkout === 'success') {
      setMsg({ tone: 'success', text: tr("Danke! Dein Abo ist aktiv. Es kann einige Sekunden dauern, bis der Plan hier angezeigt wird.") });
      setTimeout(refreshProfile, 2500);
    } else if (checkout === 'cancelled') setMsg({ tone: 'info', text: tr("Checkout abgebrochen – es wurde nichts berechnet.") });
    if (params.get('cancelled')) { setMsg({ tone: 'success', text: tr("Dein Abo wurde gekündigt. Es läuft bis zum Ende der bezahlten Periode weiter.") }); setTimeout(refreshProfile, 2500); }
    const PL = { youtube: 'YouTube', tiktok: 'TikTok', instagram: 'Instagram' };
    if (params.get('connected')) setMsg({ tone: 'success', text: tr('{p} ist verbunden.', { p: PL[params.get('connected')] || params.get('connected') }) });
    if (params.get('social_error')) setMsg({ tone: 'error', text: tr('Verbindung mit {p} fehlgeschlagen.', { p: PL[params.get('social_error')] || params.get('social_error') }) });
    if (autoPlan) startCheckout(autoPlan, params.get('interval') || 'monthly').catch((e) => setMsg({ tone: 'error', text: e.message }));
    if ([...params.keys()].length) setParams({}, { replace: true });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const saveProfile = async () => {
    setBusy('profile');
    try { await updateProfile({ full_name: name }); setMsg({ tone: 'success', text: tr("Profil gespeichert.") }); } catch (e) { setMsg({ tone: 'error', text: e.message }); }
    setBusy(null);
  };

  const portal = async () => {
    setBusy('portal');
    try { const r = await openPortal(); if (r.demo) setMsg({ tone: 'info', text: tr("Demo-Modus: Das Stripe-Kundenportal ist erst mit Stripe-Keys verfügbar.") }); } catch (e) { setMsg({ tone: 'error', text: e.message }); }
    setBusy(null);
  };

  // Kündigung mit einem Klick: öffnet direkt den Kündigungsschritt im Stripe-Portal
  const cancel = async () => {
    setBusy('cancel');
    try {
      const r = await openPortal('cancel');
      if (r.demo) {
        await updateProfile({ cancel_at_period_end: true });
        setMsg({ tone: 'success', text: tr("Demo: Abo gekündigt. Es läuft bis zum Periodenende weiter.") });
      }
    } catch (e) { setMsg({ tone: 'error', text: e.message }); }
    setBusy(null);
  };

  const connect = async (platform) => {
    setBusy(`c-${platform}`);
    try {
      const r = await api(`/social/${platform}/connect`, { method: 'POST' });
      if (r.url) { window.location.href = r.url; return; }
      if (r.demo) {
        const next = [...conns.filter((c) => c.platform !== platform), { id: platform, platform, account_name: 'Demo-Konto' }];
        if (DEMO_MODE) { localStorage.setItem(DEMO_CONN, JSON.stringify(next)); reloadConns(); }
        setMsg({ tone: 'info', text: tr("Demo-Verbindung erstellt. Für echtes Posten die App-Zugangsdaten der Plattform in der .env hinterlegen.") });
      }
    } catch (e) {
      // Server offline → im Demo-Modus lokal simulieren
      if (DEMO_MODE) {
        localStorage.setItem(DEMO_CONN, JSON.stringify([...conns.filter((c) => c.platform !== platform), { id: platform, platform, account_name: 'Demo-Konto' }]));
        reloadConns();
      } else setMsg({ tone: 'error', text: e.message });
    }
    setBusy(null);
  };

  const disconnect = async (platform) => {
    if (DEMO_MODE) localStorage.setItem(DEMO_CONN, JSON.stringify(conns.filter((c) => c.platform !== platform)));
    else await api(`/social/${platform}`, { method: 'DELETE' }).catch(() => {});
    reloadConns();
  };

  const exportData = async () => {
    const data = { exported_at: new Date().toISOString(), profile, series: await listSeries(user.id), videos: await listVideos(user.id, null, { full: true }), social_connections: conns };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'truereel-daten.json'; a.click();
  };

  const deleteAccount = async () => {
    const c = prompt(tr("Konto und alle Daten endgültig löschen? Tippe LÖSCHEN zur Bestätigung.")) ?.trim().toUpperCase(); if (!['LÖSCHEN', 'DELETE'].includes(c)) return;
    if (profile?.subscription_status === 'active' && !profile?.cancel_at_period_end) return setMsg({ tone: 'warn', text: tr("Bitte kündige zuerst dein Abo.") });
    try {
      if (DEMO_MODE) clearDemoData(); else await api('/account', { method: 'DELETE' });
      await signOut();
      navigate('/');
    } catch (e) { setMsg({ tone: 'error', text: e.message }); }
  };

  const hasSub = plan.id !== 'free';
  const price = hasSub ? priceFor(plan, profile?.billing_interval || 'monthly') : null;

  return (
    <>
      <PageHeader title={tr("Konto & Abrechnung")} />
      {msg && <Notice tone={msg.tone} className="mb-6">{msg.text}</Notice>}

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="card p-5 lg:col-span-2">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm muted">{tr("Aktueller Plan")}</p>
              <p className="mt-1 text-2xl font-bold">{plan.name}</p>
              {hasSub ? (
                <p className="mt-1 text-sm muted">
                  {formatUSD(price.perMonth)} {tr('/ Monat')}{profile.billing_interval === 'yearly' ? ` · ${tr('jährlich')} ${formatUSD(price.billed)}` : ''}
                  {profile.current_period_end && <> · {profile.cancel_at_period_end ? tr("endet am") : tr("verlängert sich am")} {new Date(profile.current_period_end).toLocaleDateString(getLocale())}</>}
                </p>
              ) : <p className="mt-1 text-sm muted">{tr("Gratis-Test: 1 Video inklusive, ohne Kreditkarte.")}</p>}
              {profile?.cancel_at_period_end && <p className="mt-2 inline-flex rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-900">{tr("Gekündigt – keine weitere Abbuchung")}</p>}
            </div>
            <StripeBadge />
          </div>
          {hasSub && (
            <div className="mt-6 flex flex-wrap gap-2">
              <button className="btn-outline" onClick={portal} disabled={!!busy}>{busy === 'portal' ? <Spinner /> : <CreditCard className="h-4 w-4" />}{tr("Zahlungsdaten & Rechnungen")}</button>
              {!profile?.cancel_at_period_end && (
                <button className="btn-danger" onClick={cancel} disabled={!!busy}>{busy === 'cancel' ? <Spinner /> : <XCircle className="h-4 w-4" />}{tr("Abo kündigen")}</button>
              )}
            </div>
          )}
          {hasSub && <p className="mt-3 text-xs muted">{tr("Kündigung mit einem Klick – ohne Begründung, ohne E-Mail. Du kannst bis zum Ende der bezahlten Periode weiter nutzen.")}</p>}
        </section>

        <section className="card space-y-4 p-5">
          <h2 className="font-semibold">{tr("Profil")}</h2>
          <div><label className="label" htmlFor="a-name">{tr("Name")}</label><input id="a-name" className="input" value={name} onChange={(e) => setName(e.target.value)} /></div>
          <div><label className="label" htmlFor="a-mail">{tr("E-Mail")}</label><input id="a-mail" className="input" value={user?.email || ''} disabled /></div>
          <button className="btn-dark w-full" onClick={saveProfile} disabled={!!busy}>{busy === 'profile' ? <Spinner /> : <Save className="h-4 w-4" />}{tr("Speichern")}</button>
        </section>
      </div>

      <section className="mt-8">
        <h2 className="mb-1 text-lg font-semibold">{hasSub ? tr("Plan wechseln") : tr("Plan wählen")}</h2>
        <p className="mb-6 text-sm muted">{hasSub ? tr("Upgrades und Downgrades laufen über das Stripe-Kundenportal, anteilig verrechnet.") : tr("Transparente Preise, monatlich kündbar.")}</p>
        {hasSub ? <button className="btn-outline" onClick={portal}>{tr("Plan im Kundenportal ändern")}</button> : <PricingSection showCalculator={false} currentPlan={plan.id} />}
      </section>

      {!demo && (
        <section ref={pwRef} className={`mt-10 card p-5 ${recovery ? 'ring-2 ring-accent-500' : ''}`}>
          <h2 className="flex items-center gap-2 font-semibold"><KeyRound className="h-4 w-4" />{recovery ? tr("Neues Passwort festlegen") : tr("Passwort ändern")}</h2>
          {recovery && <p className="mt-1 text-sm muted">{tr("Du bist über den Link aus der E-Mail angemeldet. Lege jetzt dein neues Passwort fest.")}</p>}
          <form onSubmit={savePassword} className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
            <div><label className="label" htmlFor="pw-a">{tr("Neues Passwort")}</label><input id="pw-a" type="password" autoComplete="new-password" minLength={8} className="input" value={pw.a} onChange={(e) => setPw({ ...pw, a: e.target.value })} /></div>
            <div><label className="label" htmlFor="pw-b">{tr("Wiederholen")}</label><input id="pw-b" type="password" autoComplete="new-password" minLength={8} className="input" value={pw.b} onChange={(e) => setPw({ ...pw, b: e.target.value })} /></div>
            <button className="btn-primary" disabled={busy === 'pw'}>{busy === 'pw' ? <Spinner /> : <Save className="h-4 w-4" />}{tr("Speichern")}</button>
          </form>
        </section>
      )}

      <section className="mt-6 card p-5">
        <h2 className="font-semibold">{tr("Verbundene Plattformen")}</h2>
        <p className="mb-4 text-sm muted">{tr("TrueReel postet nur auf Plattformen, die du hier verbindest – und nur Videos, die du freigegeben hast (sofern Freigabe aktiv).")}</p>
        <p className="mb-4 text-xs muted">{tr("Mit der YouTube-Verbindung akzeptierst du die")} <a className="underline" href="https://www.youtube.com/t/terms" target="_blank" rel="noreferrer">{tr("Nutzungsbedingungen von YouTube")}</a>. {tr("Zugriff jederzeit widerrufbar unter")} <a className="underline" href="https://myaccount.google.com/permissions" target="_blank" rel="noreferrer">myaccount.google.com/permissions</a>.</p>
        <ul className="divide-y divide-navy-100 dark:divide-navy-800">
          {PLATFORMS.map((p) => {
            const c = conns.find((x) => x.platform === p.id);
            return (
              <li key={p.id} className="flex items-center justify-between gap-3 py-3">
                <div><p className="font-medium">{tr(p.label)}</p><p className="text-xs muted">{c ? `${tr("Verbunden")}${c.account_name ? ` · ${c.account_name}` : ''}` : p.soon ? tr('Bis dahin: Video exportieren und in der App selbst hochladen.') : tr("Nicht verbunden")}</p></div>
                {p.soon && !c ? <span className="rounded-full bg-navy-100 px-3 py-1 text-xs font-semibold text-navy-600 dark:bg-navy-800 dark:text-navy-200">{tr('Bald verfügbar')}</span>
                  : c ? <button className="btn-outline text-xs" onClick={() => disconnect(p.id)}><Unlink className="h-4 w-4" />{tr("Trennen")}</button>
                  : <button className="btn-dark text-xs" onClick={() => connect(p.id)} disabled={!!busy}>{busy === `c-${p.id}` ? <Spinner /> : <Link2 className="h-4 w-4" />}{tr("Verbinden")}</button>}
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mt-6 card p-5">
        <h2 className="font-semibold">{tr("Daten & Datenschutz")}</h2>
        <p className="mb-4 text-sm muted">{tr("Du kannst deine Daten jederzeit exportieren oder dein Konto vollständig löschen (DSGVO / DSG).")}</p>
        <div className="flex flex-wrap gap-2">
          <button className="btn-outline" onClick={exportData}><Download className="h-4 w-4" />{tr("Daten exportieren (JSON)")}</button>
          <button className="btn-danger" onClick={deleteAccount}><Trash2 className="h-4 w-4" />{tr("Konto löschen")}</button>
          <a className="btn-ghost" href={`mailto:${SITE.supportEmail}`}><Mail className="h-4 w-4" />{tr("Support kontaktieren")}</a>
        </div>
      </section>
    </>
  );
}
