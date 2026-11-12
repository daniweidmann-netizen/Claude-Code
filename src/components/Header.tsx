"use client";

import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { useUI } from "@/store/ui";
import { announcement } from "@/content/copy";

export function Header() {
  const { setMenuOpen, setCartOpen, menuOpen, cart } = useUI();
  const [scrolled, setScrolled] = useState(false);
  const [light, setLight] = useState(false);

  useEffect(() => {
    const lights = Array.from(document.querySelectorAll<HTMLElement>('[data-header="light"]'));
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      // Switch header to the light variant while a light section sits under it
      const probe = 36;
      setLight(lights.some((el) => { const r = el.getBoundingClientRect(); return r.top <= probe && r.bottom >= probe; }));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const count = cart?.totalQuantity ?? 0;

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${light && !menuOpen ? "text-ink" : "text-ivory"}`}>
      <div
        className={`overflow-hidden bg-deep-navy text-ivory/85 transition-[height] duration-500 ease-[var(--ease-vireli-out)] ${
          scrolled ? "h-0" : "h-[var(--bar-h)]"
        }`}
      >
        <p className="t-caps flex h-[var(--bar-h)] items-center justify-center text-[10px]">{announcement}</p>
      </div>
      <div
        className={`transition-[background-color,backdrop-filter,border-color] duration-500 ${
          !scrolled || menuOpen
            ? "border-b border-transparent"
            : light
              ? "border-b border-ink/[0.08] bg-ivory/85 backdrop-blur-md"
              : "border-b border-ivory/[0.06] bg-midnight/75 backdrop-blur-md"
        }`}
      >
        <nav className="wrap grid h-[var(--header-h)] grid-cols-[1fr_auto_1fr] items-center" aria-label="Hauptnavigation">
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-expanded={menuOpen}
              aria-controls="site-menu"
              aria-label={menuOpen ? "Menü schliessen" : "Menü öffnen"}
              className="group -ml-2 flex h-11 items-center gap-3 px-2"
            >
              <span className="relative block h-[9px] w-6" aria-hidden="true">
                <span className={`absolute left-0 top-0 h-px w-full bg-current transition-transform duration-500 ${menuOpen ? "translate-y-[4px] rotate-45" : ""}`} />
                <span className={`absolute bottom-0 left-0 h-px bg-current transition-all duration-500 ${menuOpen ? "w-full -translate-y-[4px] -rotate-45" : "w-4 group-hover:w-full"}`} />
              </span>
              <span className="t-caps hidden sm:inline">{menuOpen ? "Schliessen" : "Menü"}</span>
            </button>
          </div>

          <a href="#top" aria-label="Vireli – zum Anfang" >
            <Logo className="w-[84px] sm:w-[96px]" />
          </a>

          <div className="flex items-center justify-end gap-1 sm:gap-5">
            <a href="#produkt" className="t-caps link-line hidden md:inline">
              Shop
            </a>
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="-mr-2 flex h-11 items-center gap-2.5 px-2"
              aria-label={`Warenkorb öffnen, ${count} Artikel`}
            >
              <svg viewBox="0 0 24 24" className="h-[21px] w-[21px]" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
                <path d="M5.5 8.5h13l-1 11.5h-11z" strokeLinejoin="round" />
                <path d="M9 8.5V7a3 3 0 0 1 6 0v1.5" />
              </svg>
              <span className="t-caps t-num min-w-[1ch]">{count}</span>
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
