import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { navLinks, siteConfig } from "@/lib/data/site";
import { InstagramIcon, LinkedinIcon, DribbbleIcon } from "@/components/icons/SocialIcons";

const legalLinks = [
  { href: "/impressum", label: "Impressum" },
  { href: "/datenschutz", label: "Datenschutz" },
  { href: "/cookies", label: "Cookies" },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-[var(--color-border)] bg-[var(--color-bg-elevated)]">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[60rem] -translate-x-1/2 rounded-full bg-[var(--color-accent)]/10 blur-[120px]" />

      <div className="mx-auto max-w-7xl px-6 pb-10 pt-20 sm:px-8">
        <div className="grid gap-16 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="font-display text-3xl font-medium tracking-tight">
              Shop<span className="text-gradient-gold">Werk</span>
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-[var(--color-fg-muted)]">
              {siteConfig.description}
            </p>
            <Link
              href="/#kontakt"
              className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-[var(--color-fg)]"
            >
              Projekt starten
              <ArrowUpRight className="size-4 text-[var(--color-accent)]" />
            </Link>
          </div>

          <div>
            <h3 className="mb-5 text-xs font-medium uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">
              Navigation
            </h3>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-fg)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-5 text-xs font-medium uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">
              Kontakt
            </h3>
            <ul className="space-y-3 text-sm text-[var(--color-fg-muted)]">
              <li>{siteConfig.address.street}</li>
              <li>
                {siteConfig.address.zip} {siteConfig.address.city}
              </li>
              <li>{siteConfig.address.country}</li>
              <li className="pt-2">
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="transition-colors hover:text-[var(--color-fg)]"
                >
                  {siteConfig.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
                  className="transition-colors hover:text-[var(--color-fg)]"
                >
                  {siteConfig.phone}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-5 text-xs font-medium uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">
              Rechtliches
            </h3>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-fg)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex items-center gap-3">
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex size-9 items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-fg-muted)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
              >
                <InstagramIcon className="size-4" />
              </a>
              <a
                href={siteConfig.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="flex size-9 items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-fg-muted)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
              >
                <LinkedinIcon className="size-4" />
              </a>
              <a
                href={siteConfig.social.dribbble}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Dribbble"
                className="flex size-9 items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-fg-muted)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
              >
                <DribbbleIcon className="size-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-20 flex flex-col items-center justify-between gap-4 border-t border-[var(--color-border)] pt-8 text-xs text-[var(--color-fg-subtle)] sm:flex-row">
          <span>© {new Date().getFullYear()} {siteConfig.legalName}. Alle Rechte vorbehalten.</span>
          <span>Gestaltet &amp; entwickelt in Grafstal, Schweiz.</span>
        </div>
      </div>
    </footer>
  );
}
