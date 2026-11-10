import { SITE } from '../../config/site.js';
import { Notice } from '../../components/ui.jsx';

const C = SITE.company;
const P = ({ children }) => <span className="placeholder">{children}</span>;

function LegalPage({ title, updated = '[Datum]', children }) {
  return (
    <div className="section">
      <article className="container-x prose-legal max-w-3xl">
        <h1 className="text-3xl font-bold sm:text-4xl">{title}</h1>
        <p className="mt-2 text-sm muted">Stand: <P>{updated}</P></p>
        <Notice tone="warn" className="mt-6">Vorlage: Gelb markierte Platzhalter ersetzen und den Text vor dem Livegang von einer Fachperson (Anwalt/Anwältin) prüfen lassen.</Notice>
        {children}
      </article>
    </div>
  );
}

export function Impressum() {
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

export function Datenschutz() {
  return (
    <LegalPage title="Datenschutzerklärung">
      <p className="mt-6">Diese Erklärung informiert dich darüber, wie {SITE.name} personenbezogene Daten bearbeitet – gemäss der EU-Datenschutz-Grundverordnung (DSGVO) und dem Schweizer Datenschutzgesetz (DSG).</p>
      <h2>1. Verantwortliche Stelle</h2>
      <p>{C.legalName}, Inhaber: {C.representative}, {C.street}, {C.zipCity}, {C.country} · <a className="underline" href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a></p>
      <p>EU-Vertretung nach Art. 27 DSGVO (falls Sitz ausserhalb der EU): <P>[Name, Anschrift oder „nicht erforderlich“]</P></p>
      <h2>2. Welche Daten wir bearbeiten</h2>
      <ul>
        <li><strong>Konto:</strong> E-Mail, Name (optional), Passwort-Hash, Login über Google (nur E-Mail und Name).</li>
        <li><strong>Inhalte:</strong> Serien, Skripte, Einstellungen, erzeugte Bilder, Audios und Videos.</li>
        <li><strong>Zahlungen:</strong> über Stripe. Wir erhalten keine vollständigen Kartendaten, nur Status, Plan und Rechnungsdaten.</li>
        <li><strong>Social-Verbindungen:</strong> Zugriffstokens für TikTok, Instagram/Meta und YouTube/Google – ausschliesslich zum Posten in deinem Auftrag.</li>
        <li><strong>Technische Daten:</strong> IP-Adresse, Zeitpunkte, Browsertyp (Server-Logs, max. <P>[14]</P> Tage).</li>
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
        <li><strong>Supabase</strong> (Datenbank, Authentifizierung) – Region: EU (Frankfurt, Deutschland)</li>
        <li><strong>Stripe</strong> (Zahlungsabwicklung)</li>
        <li><strong>KI-Anbieter</strong> für Skript, Bild und Stimme: <P>[z. B. Anthropic, OpenAI, ElevenLabs]</P> – es werden nur die für die Generierung nötigen Texte übermittelt.</li>
        <li><strong>Hosting</strong>: <P>[Anbieter, Region]</P></li>
        <li><strong>Social-Plattformen</strong> (TikTok, Meta, Google) – nur wenn du sie verbindest.</li>
      </ul>
      <h2>5. Übermittlung ins Ausland</h2>
      <p>Einige Anbieter sitzen in den USA. Die Übermittlung erfolgt auf Basis von Angemessenheitsbeschlüssen (z. B. EU-US / Swiss-US Data Privacy Framework) oder Standardvertragsklauseln. <P>[pro Anbieter prüfen]</P></p>
      <h2>6. Speicherdauer</h2>
      <p>Kontodaten speichern wir, bis du dein Konto löschst. Rechnungsdaten bewahren wir gemäss gesetzlichen Fristen auf (CH: 10 Jahre, DE: bis zu 10 Jahre).</p>
      <h2>7. Deine Rechte</h2>
      <p>Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit und Widerspruch. Export und Löschung kannst du direkt im Dashboard unter „Konto & Abrechnung“ auslösen. Du hast zudem das Recht auf Beschwerde bei einer Aufsichtsbehörde (Schweiz: EDÖB; EU: Behörde deines Wohnsitzlandes).</p>
      <h2>8. Kontakt</h2>
      <p>Fragen zum Datenschutz: <a className="underline" href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a></p>
    </LegalPage>
  );
}

export function AGB() {
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
      <p>Du darfst die mit {SITE.name} erstellten Videos – auch kommerziell – nutzen. Wir nutzen deine Inhalte nur zur Erbringung des Dienstes. <P>[Regelung zu Modelltraining festlegen: z. B. „Wir verwenden deine Inhalte nicht zum Training von KI-Modellen.“]</P></p>
      <h2>8. Verfügbarkeit und Haftung</h2>
      <p>Wir bemühen uns um eine hohe Verfügbarkeit, garantieren aber keinen unterbrechungsfreien Betrieb. Die Haftung ist im gesetzlich zulässigen Rahmen auf Vorsatz und grobe Fahrlässigkeit beschränkt. <P>[rechtlich prüfen]</P></p>
      <h2>9. Änderungen</h2>
      <p>Wir informieren rechtzeitig per E-Mail über Änderungen dieser AGB. Du kannst in diesem Fall jederzeit kündigen.</p>
      <h2>10. Anwendbares Recht und Gerichtsstand</h2>
      <p><P>[z. B. Schweizer Recht, Gerichtsstand Zürich – zwingende Verbraucherschutzvorschriften des Wohnsitzstaates bleiben vorbehalten]</P></p>
    </LegalPage>
  );
}

export function Rueckerstattung() {
  return (
    <LegalPage title="Rückerstattungsrichtlinie">
      <h2>Kurz und ehrlich</h2>
      <ul>
        <li>Teste zuerst gratis: 1 Video ohne Kreditkarte.</li>
        <li>Kündigung jederzeit mit einem Klick; keine weitere Abbuchung danach.</li>
        <li>Bereits begonnene Abrechnungsperioden werden grundsätzlich nicht anteilig erstattet.</li>
      </ul>
      <h2>Zufriedenheitsregel</h2>
      <p><P>[Option festlegen, z. B.: „Wenn du innerhalb von 7 Tagen nach deiner ersten Zahlung nicht zufrieden bist und höchstens 2 Videos exportiert hast, erstatten wir dir den vollen Betrag. Schreib einfach an support@…“]</P></p>
      <h2>Widerrufsrecht für Verbraucher in der EU</h2>
      <p>Verbraucher in der EU haben grundsätzlich ein 14-tägiges Widerrufsrecht. Bei digitalen Dienstleistungen erlischt es, wenn wir mit deiner ausdrücklichen Zustimmung vor Ablauf der Frist mit der Leistung begonnen haben und du deine Kenntnis davon bestätigt hast. <P>[Widerrufsbelehrung + Muster-Widerrufsformular ergänzen, Zustimmung im Checkout einholen]</P></p>
      <h2>Doppelte Abbuchung oder Fehler</h2>
      <p>Bei technischen Fehlern oder doppelten Zahlungen erstatten wir selbstverständlich vollständig.</p>
      <h2>Kontakt</h2>
      <p><a className="underline" href={`mailto:${SITE.supportEmail}`}>{SITE.supportEmail}</a> – wir antworten in der Regel innerhalb von <P>[2 Werktagen]</P>.</p>
    </LegalPage>
  );
}
