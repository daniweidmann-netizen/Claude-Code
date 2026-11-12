import { footer, hero } from "@/content/copy";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer data-header="light" className="relative z-[1] bg-ivory text-ink [color-scheme:light]">
      <div className="wrap pb-[max(2rem,env(safe-area-inset-bottom))] pt-[clamp(4.5rem,9vw,8rem)]">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-6">
          <p className="t-title lg:col-span-7">
            {hero.lines.map((l, i) => (
              <span key={l} className={`block ${i === 2 ? "italic text-aubergine" : ""}`}>{l}</span>
            ))}
          </p>
          <div className="lg:col-span-4 lg:col-start-9">
            <p className="t-caps text-ink/60">Newsletter</p>
            <p className="mt-4 text-[15px] text-ink/80">{footer.newsletter}</p>
            {/* Wired to Shopify customer marketing consent in a later step */}
            <form className="mt-6 flex h-14 items-center rounded-full border border-ink/20 pl-6 pr-2 focus-within:border-aubergine" action="#">
              <label htmlFor="nl-email" className="sr-only">E-Mail-Adresse</label>
              <input id="nl-email" type="email" required placeholder="E-Mail-Adresse" className="h-full flex-1 bg-transparent text-[15px] outline-none placeholder:text-ink/40" />
              <button type="submit" className="grid h-10 w-10 place-items-center rounded-full bg-aubergine text-ivory transition-colors hover:bg-aubergine-hover" aria-label="Anmelden">→</button>
            </form>
          </div>
        </div>

        <div className="mt-[clamp(4rem,8vw,7rem)] flex flex-col gap-10 border-t border-ink/15 pt-8 md:flex-row md:items-end md:justify-between">
          <Logo className="w-[120px] text-ink" />
          <nav aria-label="Footer" className="flex flex-wrap gap-x-8 gap-y-3">
            {footer.links.map((l) => (
              <a key={l.label} href={l.href} className="t-caps link-line">{l.label}</a>
            ))}
          </nav>
        </div>
        <div className="mt-8 flex flex-col gap-4 text-ink/55 md:flex-row md:items-center md:justify-between">
          <p className="t-small">© {new Date().getFullYear()} Vireli · Schweiz</p>
          <nav aria-label="Rechtliches" className="flex flex-wrap gap-x-6 gap-y-2">
            {footer.legal.map((l) => (
              <a key={l.label} href={l.href} className="t-small link-line">{l.label}</a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
