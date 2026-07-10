import type { Metadata } from "next";
import LegalLayout from "@/components/legal/LegalLayout";
import { siteConfig } from "@/lib/data/site";

export const metadata: Metadata = {
  title: "Impressum",
  description: "Impressum von ShopWerk gemäss Schweizer Recht.",
  alternates: { canonical: "/impressum" },
  robots: { index: true, follow: true },
};

export default function ImpressumPage() {
  return (
    <LegalLayout eyebrow="Rechtliches" title="Impressum" updated="10. Juli 2026">
      <section>
        <h2>Anbieterkennzeichnung</h2>
        <p>
          Verantwortlich für den Inhalt dieser Webseite gemäss Art. 3 UWG sowie den
          Vorgaben des Bundesgesetzes über den Datenschutz (DSG) ist:
        </p>
        <p className="mt-4 text-[var(--color-fg)]">
          {siteConfig.legalName}
          <br />
          {siteConfig.address.street}
          <br />
          {siteConfig.address.zip} {siteConfig.address.city}
          <br />
          {siteConfig.address.country}
        </p>
      </section>

      <section>
        <h2>Kontakt</h2>
        <ul>
          <li>
            E-Mail:{" "}
            <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
          </li>
          <li>
            Telefon:{" "}
            <a href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}>{siteConfig.phone}</a>
          </li>
        </ul>
      </section>

      <section>
        <h2>Handelsregister &amp; Mehrwertsteuer</h2>
        <p>
          Handelsregistereintrag: [Handelsregisternummer einfügen]
          <br />
          UID / MWST-Nummer: [CHE-XXX.XXX.XXX MWST]
        </p>
        <p className="mt-3 text-sm text-[var(--color-fg-subtle)]">
          Hinweis: Diese Angaben sind vor Veröffentlichung mit den tatsächlichen
          Registrierungsdaten der {siteConfig.legalName} zu ergänzen.
        </p>
      </section>

      <section>
        <h2>Haftungsausschluss</h2>
        <h3>Haftung für Inhalte</h3>
        <p>
          Die Inhalte dieser Webseite wurden mit grösster Sorgfalt erstellt. Für die
          Richtigkeit, Vollständigkeit und Aktualität der Inhalte übernehmen wir
          jedoch keine Gewähr. Als Diensteanbieterin sind wir gemäss den allgemeinen
          Gesetzen für eigene Inhalte auf diesen Seiten verantwortlich, jedoch nicht
          verpflichtet, übermittelte oder gespeicherte fremde Informationen zu
          überwachen.
        </p>
        <h3 className="mt-5">Haftung für Links</h3>
        <p>
          Unsere Webseite enthält Links zu externen Webseiten Dritter, auf deren
          Inhalte wir keinen Einfluss haben. Für die Inhalte der verlinkten Seiten
          ist stets der jeweilige Anbieter verantwortlich. Verlinkte Seiten wurden
          zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstösse überprüft.
        </p>
      </section>

      <section>
        <h2>Urheberrecht</h2>
        <p>
          Die durch die Betreiberin erstellten Inhalte und Werke auf dieser Webseite
          unterliegen dem Schweizer Urheberrecht. Beiträge Dritter sind als solche
          gekennzeichnet. Die Vervielfältigung, Bearbeitung, Verbreitung und jede
          Art der Verwertung ausserhalb der Grenzen des Urheberrechts bedürfen der
          schriftlichen Zustimmung der {siteConfig.legalName}.
        </p>
      </section>

      <section>
        <h2>Streitbeilegung</h2>
        <p>
          Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor
          einer Verbraucherschlichtungsstelle teilzunehmen.
        </p>
      </section>
    </LegalLayout>
  );
}
