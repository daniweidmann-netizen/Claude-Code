import { SITE } from '../../config/site.js';
import { useI18n } from '../../i18n/index.jsx';

const C = SITE.company;

function LegalPage({ title, updated, children }) {
  const { lang, setLang } = useI18n();
  const en = lang !== 'de';
  return (
    <div className="section">
      <article className="container-x prose-legal max-w-3xl">
        <h1 className="text-3xl font-bold sm:text-4xl">{title}</h1>
        <p className="mt-2 text-sm muted">{en ? 'Last updated' : 'Stand'}: {updated || (en ? '12 November 2026' : '12. November 2026')}</p>
        <p className="mt-4 text-sm muted">
          {en ? <>This is an English translation for convenience. In case of discrepancies, the <button className="underline" onClick={() => setLang('de')}>German version</button> prevails.</>
              : <>An English version is available: <button className="underline" onClick={() => setLang('en')}>English</button></>}
        </p>
        {children}
      </article>
    </div>
  );
}

function ImpressumDe() {
  return (
    <LegalPage title="Impressum">
      <h2>Angaben zum Anbieter</h2>
      <p>{C.legalName}<br />Inhaber: {C.representative}<br />{C.street}<br />{C.zipCity}<br />{C.country}</p>
      <p>Rechtsform: {C.legalForm}</p>
      <h2>Kontakt</h2>
      <p>E-Mail: <a className="underline" href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>{C.phone && <><br />Telefon: {C.phone}</>}</p>
      <h2>Register & Steuern</h2>
      <p>{C.register}<br />{C.vatId}</p>
      <h2>Verantwortlich für den Inhalt</h2>
      <p>{C.representative}, Anschrift wie oben.</p>
      <h2>Haftung für Inhalte und Links</h2>
      <p>Wir erstellen die Inhalte dieser Website mit Sorgfalt, übernehmen aber keine Gewähr für Richtigkeit, Vollständigkeit und Aktualität. Für Inhalte externer Links sind ausschliesslich deren Betreiber verantwortlich.</p>
    </LegalPage>
  );
}

function DatenschutzDe() {
  return (
    <LegalPage title="Datenschutzerklärung">
      <p className="mt-6">Diese Erklärung informiert dich darüber, wie {SITE.name} personenbezogene Daten bearbeitet – gemäss der EU-Datenschutz-Grundverordnung (DSGVO) und dem Schweizer Datenschutzgesetz (DSG).</p>
      <h2>1. Verantwortliche Stelle</h2>
      <p>{C.legalName}, Inhaber: {C.representative}, {C.street}, {C.zipCity}, {C.country} · <a className="underline" href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a></p>
      <p>EU-Vertretung nach Art. 27 DSGVO: Derzeit ist keine Vertretung bestellt, da wir personenbezogene Daten nur gelegentlich und ohne umfangreiche Verarbeitung besonderer Datenkategorien bearbeiten (Art. 27 Abs. 2 lit. a DSGVO). Anfragen aus der EU beantworten wir direkt unter der oben genannten E-Mail-Adresse.</p>
      <h2>2. Welche Daten wir bearbeiten</h2>
      <ul>
        <li><strong>Konto:</strong> E-Mail, Name (optional), Passwort-Hash, Login über Google (nur E-Mail und Name).</li>
        <li><strong>Inhalte:</strong> Serien, Skripte, Einstellungen, erzeugte Bilder, Audios und Videos.</li>
        <li><strong>Zahlungen:</strong> über Stripe. Wir erhalten keine vollständigen Kartendaten, nur Status, Plan und Rechnungsdaten.</li>
        <li><strong>Social-Verbindungen:</strong> Zugriffstokens für TikTok, Instagram/Meta und YouTube/Google – ausschliesslich zum Posten in deinem Auftrag.</li>
        <li><strong>Technische Daten:</strong> IP-Adresse, Zeitpunkte, Browsertyp (Server-Logs, max. 30 Tage).</li>
      </ul>
      <h2>3. Zwecke und Rechtsgrundlagen</h2>
      <ul>
        <li>Bereitstellung des Dienstes und Vertragserfüllung (Art. 6 Abs. 1 lit. b DSGVO).</li>
        <li>Abrechnung und gesetzliche Aufbewahrungspflichten (Art. 6 Abs. 1 lit. c DSGVO).</li>
        <li>Sicherheit und Missbrauchsverhinderung (berechtigtes Interesse, Art. 6 Abs. 1 lit. f DSGVO).</li>
      </ul>
      <p>Wir verwenden keine Tracking- oder Werbe-Cookies. Lokaler Browser-Speicher wird nur für Anmeldung, Sprache und Darstellung (hell/dunkel) genutzt. Die Schrift „Inter“ wird von unserem eigenen Server geladen, nicht von Google.</p>
      <h2>4. Auftragsverarbeiter und Empfänger</h2>
      <ul>
        <li><strong>Supabase</strong> (Datenbank, Authentifizierung) – Region: EU (Stockholm, Schweden)</li>
        <li><strong>Stripe</strong> (Stripe Payments Europe Ltd., Irland, und Stripe, Inc., USA) – Zahlungsabwicklung. Über „Managed Payments“ tritt Stripe als Verkäufer gegenüber dir auf (Merchant of Record) und bearbeitet dafür Zahlungs-, Rechnungs- und Steuerdaten in eigener Verantwortung.</li>
        <li><strong>Anthropic</strong> (USA) – Erstellung der Video-Skripte. Übermittelt werden Thema, Stichpunkte und Skripttext.</li>
        <li><strong>OpenAI</strong> (USA) – Sprecherstimme und KI-Bilder. Übermittelt werden Skripttext und Bildbeschreibungen.</li>
        <li><strong>Pixabay</strong> (Deutschland) und <strong>Wikimedia Commons</strong> (USA) – Bildsuche. Übermittelt werden nur Suchbegriffe.</li>
        <li><strong>Brevo</strong> (Frankreich) – Versand von System-E-Mails (Bestätigung, Passwort).</li>
        <li><strong>Hosting</strong>: Render Services, Inc. (USA), Server-Region Frankfurt (Deutschland)</li>
        <li><strong>Social-Plattformen</strong> (Google/YouTube, TikTok, Meta) – nur wenn du sie verbindest und ein Video postest.</li>
      </ul>
      <h2>5. Übermittlung ins Ausland</h2>
      <p>Einige Anbieter (Stripe, Anthropic, OpenAI, Render, Wikimedia, Google) sitzen in den USA. Die Übermittlung erfolgt, soweit der Anbieter zertifiziert ist, auf Basis des EU-US bzw. Swiss-US Data Privacy Framework, ansonsten auf Basis der Standardvertragsklauseln der EU-Kommission (vom EDÖB anerkannt). Wir übermitteln jeweils nur die Daten, die für den konkreten Zweck nötig sind.</p>
      <h2>6. Speicherdauer</h2>
      <p>Kontodaten speichern wir, bis du dein Konto löschst. Rechnungsdaten bewahren wir gemäss gesetzlichen Fristen auf (CH: 10 Jahre, DE: bis zu 10 Jahre).</p>
      <h2>YouTube-Verbindung (YouTube API Services)</h2>
      <p>Wenn du deinen YouTube-Kanal verbindest, nutzt TrueReel die YouTube API Services von Google. Wir erhalten damit nur die Berechtigungen, die du im Google-Dialog bestätigst: Videos auf deinen Kanal hochladen und den Kanalnamen anzeigen. Wir lesen keine anderen Inhalte deines Kanals aus und geben keine Daten an Dritte weiter. Die gespeicherten Zugriffstokens löschen wir, sobald du die Verbindung in TrueReel trennst oder dein Konto löschst.</p>
      <p>Mit der Verbindung gelten zusätzlich die <a className="underline" href="https://www.youtube.com/t/terms" target="_blank" rel="noreferrer">Nutzungsbedingungen von YouTube</a> und die <a className="underline" href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">Datenschutzerklärung von Google</a>. Du kannst den Zugriff von TrueReel jederzeit auch direkt bei Google widerrufen: <a className="underline" href="https://myaccount.google.com/permissions" target="_blank" rel="noreferrer">myaccount.google.com/permissions</a>.</p>
      <p>Die Verwendung von Informationen, die TrueReel von Google-APIs erhält, entspricht der <a className="underline" href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noreferrer">Google API Services User Data Policy</a>, einschliesslich der Anforderungen zur eingeschränkten Nutzung (Limited Use).</p>
      <h2>7. Deine Rechte</h2>
      <p>Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit und Widerspruch. Export und Löschung kannst du direkt im Dashboard unter „Konto & Abrechnung“ auslösen. Du hast zudem das Recht auf Beschwerde bei einer Aufsichtsbehörde (Schweiz: EDÖB; EU: Behörde deines Wohnsitzlandes).</p>
      <h2>8. Kontakt</h2>
      <p>Fragen zum Datenschutz: <a className="underline" href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a></p>
    </LegalPage>
  );
}

function AGBDe() {
  return (
    <LegalPage title="Allgemeine Geschäftsbedingungen (AGB)">
      <h2>1. Geltungsbereich</h2>
      <p>Diese AGB gelten für die Nutzung von {SITE.name}, angeboten von {C.legalName} (Inhaber: {C.representative}), {C.street}, {C.zipCity}, {C.country} („wir“).</p>
      <h2>2. Leistungen</h2>
      <p>{SITE.name} erstellt mithilfe von KI kurze Videos (Skript, Bilder, Stimme, Untertitel, Musik) und kann diese auf verbundene Plattformen posten. Der Umfang richtet sich nach dem gewählten Plan. Wir schulden keine bestimmte Reichweite, Aufrufzahl oder Einnahmen.</p>
      <h2>3. Gratis-Test</h2>
      <p>Neue Nutzer können 1 Video kostenlos und ohne Zahlungsmittel erstellen. Gratis-Exporte enthalten ein Wasserzeichen.</p>
      <h2>4. Preise, Zahlung, Laufzeit</h2>
      <p>Es gelten die auf der Preisseite angezeigten Preise. Abos verlängern sich automatisch um die gewählte Laufzeit (monatlich oder jährlich), bis sie gekündigt werden. Die Zahlung erfolgt über Stripe im Voraus.</p>
      <h2>5. Kündigung</h2>
      <p>Du kannst jederzeit mit einem Klick im Dashboard kündigen. Die Kündigung wird zum Ende der laufenden Periode wirksam; bis dahin bleibt der Plan nutzbar.</p>
      <h2>6. Pflichten der Nutzer</h2>
      <ul>
        <li>Keine rechtswidrigen, irreführenden, beleidigenden oder Rechte Dritter verletzenden Inhalte.</li>
        <li>Prüfe KI-generierte Inhalte vor der Veröffentlichung auf Richtigkeit – insbesondere Fakten.</li>
        <li>Beachte die Richtlinien der Plattformen (inkl. Kennzeichnung KI-generierter Inhalte, wo vorgeschrieben).</li>
        <li>Eigene Uploads (Musik, Stimme) nur, wenn du die nötigen Rechte besitzt.</li>
      </ul>
      <h2>7. Rechte an Inhalten</h2>
      <p>Du darfst die mit {SITE.name} erstellten Videos – auch kommerziell – nutzen. Wir nutzen deine Inhalte nur zur Erbringung des Dienstes. Wir verwenden deine Inhalte nicht zum Training von KI-Modellen.</p>
      <h2>8. Verfügbarkeit und Haftung</h2>
      <p>Wir bemühen uns um eine hohe Verfügbarkeit, garantieren aber keinen unterbrechungsfreien Betrieb. Die Haftung ist im gesetzlich zulässigen Rahmen auf Vorsatz und grobe Fahrlässigkeit beschränkt.</p>
      <h2>9. Änderungen</h2>
      <p>Wir informieren rechtzeitig per E-Mail über Änderungen dieser AGB. Du kannst in diesem Fall jederzeit kündigen.</p>
      <h2>10. Anwendbares Recht und Gerichtsstand</h2>
      <p>Es gilt Schweizer Recht unter Ausschluss des UN-Kaufrechts. Gerichtsstand ist der Sitz des Anbieters (Grafstal, Kanton Zürich). Zwingende Verbraucherschutzvorschriften deines Wohnsitzstaates sowie ein dort zwingender Gerichtsstand für Verbraucher bleiben vorbehalten.</p>
    </LegalPage>
  );
}

function RueckerstattungDe() {
  return (
    <LegalPage title="Rückerstattungsrichtlinie">
      <h2>Kurz und ehrlich</h2>
      <ul>
        <li>Teste zuerst gratis: 1 Video ohne Kreditkarte.</li>
        <li>Kündigung jederzeit mit einem Klick; keine weitere Abbuchung danach.</li>
        <li>Bereits begonnene Abrechnungsperioden werden grundsätzlich nicht anteilig erstattet.</li>
      </ul>
      <h2>Zufriedenheitsregel</h2>
      <p>Wenn du innerhalb von 7 Tagen nach deiner ersten Zahlung nicht zufrieden bist und höchstens 2 Videos exportiert hast, erstatten wir dir den vollen Betrag. Schreib einfach an <a className="underline" href={`mailto:${SITE.supportEmail}`}>{SITE.supportEmail}</a>.</p>
      <h2>Widerrufsrecht für Verbraucher in der EU</h2>
      <p>Verbraucher in der EU haben grundsätzlich ein 14-tägiges Widerrufsrecht. Bei digitalen Dienstleistungen erlischt es, wenn wir mit deiner ausdrücklichen Zustimmung vor Ablauf der Frist mit der Leistung begonnen haben und du deine Kenntnis davon bestätigt hast.</p>
      <p>Mit dem Abschluss eines Abos verlangst du ausdrücklich, dass wir sofort mit der Leistung beginnen, und nimmst zur Kenntnis, dass dein Widerrufsrecht damit erlischt. Möchtest du vorher widerrufen, genügt eine eindeutige Erklärung per E-Mail an <a className="underline" href={`mailto:${SITE.supportEmail}`}>{SITE.supportEmail}</a>, zum Beispiel: „Hiermit widerrufe ich meinen Vertrag über das TrueReel-Abo, abgeschlossen am [Datum], Name, E-Mail-Adresse des Kontos.“</p>
      <h2>Doppelte Abbuchung oder Fehler</h2>
      <p>Bei technischen Fehlern oder doppelten Zahlungen erstatten wir selbstverständlich vollständig.</p>
      <h2>Kontakt</h2>
      <p><a className="underline" href={`mailto:${SITE.supportEmail}`}>{SITE.supportEmail}</a> – wir antworten in der Regel innerhalb von 2 Werktagen.</p>
    </LegalPage>
  );
}

// ---------------------------------------------------------------- English
function ImpressumEn() {
  return (
    <LegalPage title="Legal notice (Impressum)">
      <h2>Provider</h2>
      <p>{C.legalName}<br />Owner: {C.representative}<br />{C.street}<br />{C.zipCity}<br />Switzerland</p>
      <p>Legal form: sole proprietorship (not entered in the commercial register)</p>
      <h2>Contact</h2>
      <p>Email: <a className="underline" href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>{C.phone && <><br />Phone: {C.phone}</>}</p>
      <h2>Register & tax</h2>
      <p>{C.register}<br />{C.vatId}</p>
      <h2>Responsible for content</h2>
      <p>{C.representative}, address as above.</p>
      <h2>Liability for content and links</h2>
      <p>We create the content of this website with care but cannot guarantee that it is correct, complete or up to date. The operators of external websites are solely responsible for their content.</p>
    </LegalPage>
  );
}

function DatenschutzEn() {
  return (
    <LegalPage title="Privacy policy">
      <p className="mt-6">This policy explains how {SITE.name} processes personal data – in line with the EU General Data Protection Regulation (GDPR) and the Swiss Federal Act on Data Protection (FADP).</p>
      <h2>1. Controller</h2>
      <p>{C.legalName}, owner: {C.representative}, {C.street}, {C.zipCity}, Switzerland · <a className="underline" href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a></p>
      <p>EU representative under Art. 27 GDPR: no representative is currently appointed, as we process personal data only occasionally and without large-scale processing of special categories of data (Art. 27(2)(a) GDPR). We answer requests from the EU directly at the email address above.</p>
      <h2>2. What data we process</h2>
      <ul>
        <li><strong>Account:</strong> email, name (optional), password hash, Google sign-in (email and name only).</li>
        <li><strong>Content:</strong> series, scripts, settings, generated images, audio and videos.</li>
        <li><strong>Payments:</strong> via Stripe. We never receive full card details – only status, plan and billing data.</li>
        <li><strong>Social connections:</strong> access tokens for TikTok, Instagram/Meta and YouTube/Google – used only to post on your behalf.</li>
        <li><strong>Technical data:</strong> IP address, timestamps, browser type (server logs, max. 30 days).</li>
      </ul>
      <h2>3. Purposes and legal bases</h2>
      <ul>
        <li>Providing the service and performing the contract (Art. 6(1)(b) GDPR).</li>
        <li>Billing and statutory retention obligations (Art. 6(1)(c) GDPR).</li>
        <li>Security and abuse prevention (legitimate interest, Art. 6(1)(f) GDPR).</li>
      </ul>
      <p>We don't use tracking or advertising cookies. Local browser storage is used only for sign-in, language and appearance (light/dark). The “Inter” font is served from our own server, not from Google.</p>
      <h2>4. Processors and recipients</h2>
      <ul>
        <li><strong>Supabase</strong> (database, authentication) – region: EU (Stockholm, Sweden)</li>
        <li><strong>Stripe</strong> (Stripe Payments Europe Ltd., Ireland, and Stripe, Inc., USA) – payment processing. Through “Managed Payments”, Stripe acts as the seller to you (merchant of record) and processes payment, invoice and tax data under its own responsibility.</li>
        <li><strong>Anthropic</strong> (USA) – writing video scripts. We transmit the topic, notes and script text.</li>
        <li><strong>OpenAI</strong> (USA) – voiceover and AI images. We transmit script text and image descriptions.</li>
        <li><strong>Pixabay</strong> (Germany) and <strong>Wikimedia Commons</strong> (USA) – image search. Only search terms are transmitted.</li>
        <li><strong>Brevo</strong> (France) – sending system emails (confirmation, password).</li>
        <li><strong>Hosting</strong>: Render Services, Inc. (USA), server region Frankfurt (Germany)</li>
        <li><strong>Social platforms</strong> (Google/YouTube, TikTok, Meta) – only if you connect them and post a video.</li>
      </ul>
      <h2>5. Transfers abroad</h2>
      <p>Some providers (Stripe, Anthropic, OpenAI, Render, Wikimedia, Google) are based in the USA. Where the provider is certified, transfers are based on the EU-US or Swiss-US Data Privacy Framework; otherwise on the European Commission's standard contractual clauses (recognised by the FDPIC). We only transmit the data needed for the specific purpose.</p>
      <h2>6. Retention</h2>
      <p>We store account data until you delete your account. Billing records are kept for the statutory periods (CH: 10 years, DE: up to 10 years).</p>
      <h2>YouTube connection (YouTube API Services)</h2>
      <p>When you connect your YouTube channel, TrueReel uses Google's YouTube API Services. We only receive the permissions you confirm in Google's dialog: uploading videos to your channel and showing the channel name. We don't read any other content of your channel and don't share data with third parties. We delete the stored access tokens as soon as you disconnect in TrueReel or delete your account.</p>
      <p>By connecting, the <a className="underline" href="https://www.youtube.com/t/terms" target="_blank" rel="noreferrer">YouTube Terms of Service</a> and the <a className="underline" href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">Google Privacy Policy</a> also apply. You can also revoke TrueReel's access at any time directly at Google: <a className="underline" href="https://myaccount.google.com/permissions" target="_blank" rel="noreferrer">myaccount.google.com/permissions</a>.</p>
      <p>TrueReel's use of information received from Google APIs adheres to the <a className="underline" href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noreferrer">Google API Services User Data Policy</a>, including the Limited Use requirements.</p>
      <h2>7. Your rights</h2>
      <p>Access, rectification, erasure, restriction, data portability and objection. You can trigger export and deletion directly in the dashboard under “Account & billing”. You also have the right to lodge a complaint with a supervisory authority (Switzerland: FDPIC; EU: the authority in your country of residence).</p>
      <h2>8. Contact</h2>
      <p>Privacy questions: <a className="underline" href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a></p>
    </LegalPage>
  );
}

function AGBEn() {
  return (
    <LegalPage title="Terms of service">
      <h2>1. Scope</h2>
      <p>These terms apply to the use of {SITE.name}, offered by {C.legalName} (owner: {C.representative}), {C.street}, {C.zipCity}, Switzerland (“we”).</p>
      <h2>2. Services</h2>
      <p>{SITE.name} uses AI to create short videos (script, images, voice, captions, music) and can post them to connected platforms. The scope depends on the chosen plan. We do not promise any particular reach, view count or income.</p>
      <h2>3. Free trial</h2>
      <p>New users can create 1 video for free without a payment method. Free exports include a watermark.</p>
      <h2>4. Prices, payment, term</h2>
      <p>The prices shown on the pricing page apply. Subscriptions renew automatically for the chosen term (monthly or yearly) until cancelled. Payment is made in advance via Stripe.</p>
      <h2>5. Cancellation</h2>
      <p>You can cancel at any time with one click in the dashboard. Cancellation takes effect at the end of the current period; until then the plan remains usable.</p>
      <h2>6. User obligations</h2>
      <ul>
        <li>No unlawful, misleading, offensive content or content that infringes third-party rights.</li>
        <li>Check AI-generated content for accuracy before publishing – especially facts.</li>
        <li>Follow the platforms' rules (including labelling AI-generated content where required).</li>
        <li>Upload your own material (music, voice) only if you hold the necessary rights.</li>
      </ul>
      <h2>7. Rights to content</h2>
      <p>You may use the videos created with {SITE.name} – including commercially. We use your content only to provide the service. We do not use your content to train AI models.</p>
      <h2>8. Availability and liability</h2>
      <p>We strive for high availability but do not guarantee uninterrupted operation. To the extent permitted by law, liability is limited to intent and gross negligence.</p>
      <h2>9. Changes</h2>
      <p>We will inform you of changes to these terms by email in good time. In that case you may cancel at any time.</p>
      <h2>10. Governing law and jurisdiction</h2>
      <p>Swiss law applies, excluding the UN Convention on Contracts for the International Sale of Goods. The place of jurisdiction is the provider's seat (Grafstal, Canton of Zurich). Mandatory consumer protection rules of your country of residence, and any mandatory consumer place of jurisdiction there, remain unaffected.</p>
    </LegalPage>
  );
}

function RueckerstattungEn() {
  return (
    <LegalPage title="Refund policy">
      <h2>Short and honest</h2>
      <ul>
        <li>Try it free first: 1 video, no credit card.</li>
        <li>Cancel any time with one click; no further charges afterwards.</li>
        <li>Billing periods that have already started are generally not refunded pro rata.</li>
      </ul>
      <h2>Satisfaction rule</h2>
      <p>If you're not satisfied within 7 days of your first payment and have exported no more than 2 videos, we'll refund the full amount. Just write to <a className="underline" href={`mailto:${SITE.supportEmail}`}>{SITE.supportEmail}</a>.</p>
      <h2>Right of withdrawal for EU consumers</h2>
      <p>Consumers in the EU generally have a 14-day right of withdrawal. For digital services it expires once we have started the service with your express consent before the end of the period and you have acknowledged this.</p>
      <p>By starting a subscription you expressly request that we begin the service immediately and acknowledge that your right of withdrawal thereby expires. If you want to withdraw before that, a clear statement by email to <a className="underline" href={`mailto:${SITE.supportEmail}`}>{SITE.supportEmail}</a> is enough, for example: “I hereby withdraw from my contract for the TrueReel subscription concluded on [date], name, email address of the account.”</p>
      <h2>Double charges or errors</h2>
      <p>For technical errors or duplicate payments we will of course refund in full.</p>
      <h2>Contact</h2>
      <p><a className="underline" href={`mailto:${SITE.supportEmail}`}>{SITE.supportEmail}</a> – we usually reply within 2 business days.</p>
    </LegalPage>
  );
}

const pick = (De, En) => function LegalSwitch() {
  const { lang } = useI18n();
  return lang === 'de' ? <De /> : <En />;
};
export const Impressum = pick(ImpressumDe, ImpressumEn);
export const Datenschutz = pick(DatenschutzDe, DatenschutzEn);
export const AGB = pick(AGBDe, AGBEn);
export const Rueckerstattung = pick(RueckerstattungDe, RueckerstattungEn);
