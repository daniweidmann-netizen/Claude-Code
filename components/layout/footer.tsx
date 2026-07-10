import { Reveal } from "@/components/motion/reveal";
import { NewsletterForm } from "@/components/layout/newsletter-form";

const COLUMNS = [
  {
    title: "Collection",
    links: ["Timepieces", "Objects", "Editions", "Archive"],
  },
  {
    title: "Atelier",
    links: ["Our Craft", "Materials", "Sustainability", "Journal"],
  },
  {
    title: "Client Services",
    links: ["Concierge", "Shipping", "Care", "Contact"],
  },
];

export function Footer() {
  return (
    <footer className="relative border-t border-white/10 px-6 pb-10 pt-24 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <Reveal className="flex flex-col justify-between gap-10 border-b border-white/10 pb-16 lg:flex-row lg:items-end">
          <div>
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.3em] text-gold-300">
              Stay close to the atelier
            </p>
            <h3 className="max-w-md font-display text-3xl font-light leading-tight text-mist-50 sm:text-4xl">
              Quiet updates on new editions, before anyone else.
            </h3>
          </div>
          <NewsletterForm />
        </Reveal>

        <div className="grid grid-cols-2 gap-10 py-16 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <span className="font-display text-sm font-medium tracking-[0.28em] text-mist-100">
              AURUM
            </span>
            <p className="mt-4 max-w-[22ch] text-sm leading-relaxed text-mist-400">
              A digital atelier for objects built to outlast trends.
            </p>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-mist-400">
                {col.title}
              </p>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-mist-300 transition-colors duration-300 hover:text-gold-300"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-between gap-4 pt-8 text-xs text-mist-400 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} Aurum. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="transition-colors hover:text-mist-100">
              Privacy
            </a>
            <a href="#" className="transition-colors hover:text-mist-100">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
