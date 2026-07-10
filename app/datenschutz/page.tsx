import type { Metadata } from "next";
import Link from "next/link";
import LegalLayout from "@/components/legal/LegalLayout";
import { siteConfig } from "@/lib/data/site";

export const metadata: Metadata = {
  title: "Datenschutzerklärung",
  description: "Datenschutzerklärung von ShopWerk gemäss revidiertem Schweizer Datenschutzgesetz (DSG).",
  alternates: { canonical: "/datenschutz" },
  robots: { index: true, follow: true },
};

export default function DatenschutzPage() {
  return (
    <LegalLayout eyebrow="Rechtliches" title="Datenschutzerklärung" updated="10. Juli 2026">
      <section>
        <h2>1. Verantwortliche Stelle</h2>
        <p>
          Verantwortlich für die Datenbearbeitung im Sinne des Schweizer
          Bundesgesetzes über den Datenschutz (DSG) sowie, soweit anwendbar, der
          Datenschutz-Grundverordnung (DSGVO) ist:
        </p>
        <p className="mt-4 text-[var(--color-fg)]">
          {siteConfig.legalName}
          <br />
          {siteConfig.address.street}, {siteConfig.address.zip} {siteConfig.address.city}
          <br />
          {siteConfig.address.country}
          <br />
          <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
        </p>
      </section>

      <section>
        <h2>2. Grundsätze</h2>
        <p>
          Wir bearbeiten Personendaten im Einklang mit dem Schweizer Datenschutzgesetz
          (DSG) und, soweit Besucherinnen und Besucher aus der EU/dem EWR betroffen
          sind, im Einklang mit der DSGVO. Diese Datenschutzerklärung informiert Sie
          darüber, welche Daten wir erheben, wie wir sie nutzen und welche Rechte
          Ihnen zustehen.
        </p>
      </section>

      <section>
        <h2>3. Bearbeitete Daten</h2>
        <h3>Server-Log-Dateien</h3>
        <p>
          Beim Besuch unserer Webseite erhebt unser Hosting-Provider automatisch
          technische Daten (Browsertyp, Betriebssystem, Referrer-URL, IP-Adresse in
          gekürzter Form, Datum und Uhrzeit des Zugriffs). Diese Daten dienen der
          Sicherstellung eines störungsfreien Betriebs und werden nicht mit anderen
          Datenquellen zusammengeführt.
        </p>
        <h3 className="mt-5">Kontaktformular</h3>
        <p>
          Wenn Sie unser Kontaktformular nutzen, verarbeiten wir die von Ihnen
          angegebenen Informationen (Name, Firma, Telefon, E-Mail-Adresse, Budget,
          Projektbeschreibung) ausschliesslich zur Bearbeitung Ihrer Anfrage und zur
          Kontaktaufnahme. Rechtsgrundlage ist Ihre Einwilligung durch Absenden des
          Formulars bzw. das vorvertragliche Interesse an der Projektabwicklung.
        </p>
        <h3 className="mt-5">Cookies</h3>
        <p>
          Wir verwenden technisch notwendige Cookies für den Betrieb der Webseite
          sowie – nach Ihrer Einwilligung – optionale Cookies zu Statistikzwecken.
          Details finden Sie in unserem{" "}
          <Link href="/cookies">Cookie-Hinweis</Link>.
        </p>
      </section>

      <section>
        <h2>4. Zweck der Bearbeitung</h2>
        <ul>
          <li>Bereitstellung und Sicherstellung des Betriebs dieser Webseite</li>
          <li>Beantwortung von Kontaktanfragen und Angebotserstellung</li>
          <li>Verbesserung unseres Angebots auf Basis anonymisierter Nutzungsdaten</li>
          <li>Erfüllung gesetzlicher Aufbewahrungspflichten</li>
        </ul>
      </section>

      <section>
        <h2>5. Datenweitergabe</h2>
        <p>
          Eine Weitergabe Ihrer Daten an Dritte erfolgt nur, soweit dies zur
          Vertragserfüllung notwendig ist (z. B. an Hosting- oder
          E-Mail-Dienstleister), gesetzlich vorgeschrieben ist, oder Sie ausdrücklich
          eingewilligt haben. Alle eingesetzten Dienstleister sind vertraglich zur
          Einhaltung des Datenschutzes verpflichtet.
        </p>
      </section>

      <section>
        <h2>6. Aufbewahrungsdauer</h2>
        <p>
          Wir bearbeiten und speichern Ihre Personendaten nur so lange, wie es für
          die Erfüllung der jeweiligen Zwecke oder gesetzlicher Aufbewahrungspflichten
          erforderlich ist. Danach werden die Daten gelöscht oder anonymisiert.
        </p>
      </section>

      <section>
        <h2>7. Ihre Rechte</h2>
        <p>Sie haben im Rahmen des geltenden Rechts folgende Rechte:</p>
        <ul>
          <li>Recht auf Auskunft über die bearbeiteten Personendaten</li>
          <li>Recht auf Berichtigung unrichtiger Daten</li>
          <li>Recht auf Löschung Ihrer Daten, soweit keine Aufbewahrungspflicht besteht</li>
          <li>Recht auf Einschränkung der Bearbeitung</li>
          <li>Recht auf Datenherausgabe bzw. -übertragung</li>
          <li>Recht auf Widerspruch gegen die Bearbeitung</li>
        </ul>
        <p className="mt-4">
          Zur Ausübung dieser Rechte kontaktieren Sie uns unter{" "}
          <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
        </p>
      </section>

      <section>
        <h2>8. Datensicherheit</h2>
        <p>
          Wir treffen angemessene technische und organisatorische Massnahmen, um
          Ihre Daten vor Verlust, Missbrauch und unbefugtem Zugriff zu schützen,
          unter anderem durch verschlüsselte Übertragung (TLS/SSL).
        </p>
      </section>

      <section>
        <h2>9. Änderungen dieser Erklärung</h2>
        <p>
          Wir behalten uns vor, diese Datenschutzerklärung anzupassen, um sie an
          geänderte Rechtslagen oder Änderungen unseres Angebots anzupassen. Die
          jeweils aktuelle Fassung finden Sie stets auf dieser Seite.
        </p>
      </section>
    </LegalLayout>
  );
}
