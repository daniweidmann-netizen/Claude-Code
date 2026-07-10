import type { Metadata } from "next";
import LegalLayout from "@/components/legal/LegalLayout";
import { siteConfig } from "@/lib/data/site";

export const metadata: Metadata = {
  title: "Cookie-Hinweis",
  description: "Informationen zum Einsatz von Cookies auf der Webseite von ShopWerk.",
  alternates: { canonical: "/cookies" },
  robots: { index: true, follow: true },
};

export default function CookiesPage() {
  return (
    <LegalLayout eyebrow="Rechtliches" title="Cookie-Hinweis" updated="10. Juli 2026">
      <section>
        <h2>Was sind Cookies?</h2>
        <p>
          Cookies sind kleine Textdateien, die auf Ihrem Endgerät gespeichert werden,
          wenn Sie unsere Webseite besuchen. Sie ermöglichen es uns, Ihr Gerät bei
          einem erneuten Besuch wiederzuerkennen und unsere Webseite technisch
          zuverlässig sowie nutzerfreundlich zu betreiben.
        </p>
      </section>

      <section>
        <h2>Welche Cookies verwenden wir?</h2>
        <h3>Technisch notwendige Cookies</h3>
        <p>
          Diese Cookies sind für den Betrieb der Webseite zwingend erforderlich,
          zum Beispiel um Ihre Cookie-Präferenz zu speichern. Sie können nicht
          deaktiviert werden.
        </p>
        <h3 className="mt-5">Statistik-Cookies (optional)</h3>
        <p>
          Mit Ihrer Einwilligung setzen wir gegebenenfalls anonymisierte
          Statistik-Tools ein, um zu verstehen, wie Besucherinnen und Besucher
          unsere Webseite nutzen. Diese Daten werden ausschliesslich aggregiert
          ausgewertet.
        </p>
      </section>

      <section>
        <h2>Verwaltung Ihrer Cookie-Einstellungen</h2>
        <p>
          Beim ersten Besuch unserer Webseite werden Sie über den Einsatz von
          Cookies informiert und können Ihre Präferenz festlegen. Sie können Ihre
          Einwilligung jederzeit über die Einstellungen Ihres Browsers widerrufen,
          indem Sie gespeicherte Cookies löschen oder deren Speicherung blockieren.
        </p>
      </section>

      <section>
        <h2>Kontakt</h2>
        <p>
          Bei Fragen zu unserem Einsatz von Cookies erreichen Sie uns unter{" "}
          <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
        </p>
      </section>
    </LegalLayout>
  );
}
