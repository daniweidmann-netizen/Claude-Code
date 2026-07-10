import { Mail, MapPin, Phone } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import AuroraBackground from "@/components/ui/AuroraBackground";
import ContactForm from "@/components/contact/ContactForm";
import { siteConfig } from "@/lib/data/site";

export default function Contact() {
  return (
    <section id="kontakt" className="relative overflow-hidden border-t border-[var(--color-border)] py-32">
      <div className="absolute inset-0 opacity-40">
        <AuroraBackground />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 sm:px-8">
        <SectionHeading
          eyebrow="Kontakt"
          title="Lassen Sie uns etwas Aussergewöhnliches bauen."
          description="Erzählen Sie uns von Ihrem Projekt – wir melden uns innerhalb eines Werktages mit den nächsten Schritten."
        />

        <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-[1.2fr_1fr]">
          <Reveal>
            <div className="glass rounded-3xl p-8 sm:p-12">
              <ContactForm />
            </div>
          </Reveal>

          <Reveal delay={0.15} className="flex flex-col gap-6">
            <div className="glass overflow-hidden rounded-3xl">
              <iframe
                title="ShopWerk auf Google Maps"
                src={siteConfig.mapsEmbedSrc}
                className="h-64 w-full grayscale contrast-125 invert-[0.92] sm:h-72"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <div className="glass flex-1 rounded-3xl p-8">
              <h3 className="font-display text-xl font-medium">ShopWerk</h3>
              <ul className="mt-6 space-y-5 text-sm">
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-[var(--color-accent)]" />
                  <a
                    href={siteConfig.mapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-fg)]"
                  >
                    {siteConfig.address.street}
                    <br />
                    {siteConfig.address.zip} {siteConfig.address.city}
                    <br />
                    {siteConfig.address.country}
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="size-4 shrink-0 text-[var(--color-accent)]" />
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-fg)]"
                  >
                    {siteConfig.email}
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="size-4 shrink-0 text-[var(--color-accent)]" />
                  <a
                    href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
                    className="text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-fg)]"
                  >
                    {siteConfig.phone}
                  </a>
                </li>
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
