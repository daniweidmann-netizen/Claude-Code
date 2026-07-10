"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { navLinks, siteConfig } from "@/lib/data/site";
import MagneticButton from "@/components/ui/MagneticButton";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    setScrolled(latest > 24);
    if (open) {
      setHidden(false);
      return;
    }
    setHidden(latest > previous && latest > 200);
  });

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <>
      <motion.header
        animate={{ y: hidden ? -110 : 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-x-0 top-0 z-50"
      >
        <div
          className={cn(
            "mx-auto mt-3 flex max-w-7xl items-center justify-between rounded-full px-5 py-3 transition-all duration-500 sm:mt-5 sm:px-8",
            scrolled ? "glass-strong mx-4" : "bg-transparent"
          )}
        >
          <Link
            href="/"
            data-cursor="hover"
            className="font-display text-xl font-medium tracking-tight text-[var(--color-fg)]"
          >
            Shop<span className="text-gradient-gold">Werk</span>
          </Link>

          <nav className="hidden items-center gap-9 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                data-cursor="hover"
                className="text-sm text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-fg)]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:block">
            <MagneticButton
              href="/#kontakt"
              className="border border-[var(--color-border-strong)] bg-[var(--color-fg)] text-[var(--color-bg)] hover:bg-[var(--color-accent-soft)]"
            >
              Projekt starten
            </MagneticButton>
          </div>

          <button
            type="button"
            aria-label="Menü öffnen"
            data-cursor="hover"
            className="flex size-10 items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-fg)] md:hidden"
            onClick={() => setOpen(true)}
          >
            <Menu className="size-5" />
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex flex-col bg-[var(--color-bg)]/98 px-6 pt-6 backdrop-blur-2xl md:hidden"
          >
            <div className="flex items-center justify-between">
              <span className="font-display text-xl font-medium">
                Shop<span className="text-gradient-gold">Werk</span>
              </span>
              <button
                type="button"
                aria-label="Menü schliessen"
                className="flex size-10 items-center justify-center rounded-full border border-[var(--color-border)]"
                onClick={() => setOpen(false)}
              >
                <X className="size-5" />
              </button>
            </div>

            <nav className="mt-16 flex flex-1 flex-col gap-2">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 * i, duration: 0.5 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between border-b border-[var(--color-border)] py-5 font-display text-3xl"
                  >
                    {link.label}
                    <ArrowUpRight className="size-6 text-[var(--color-accent)]" />
                  </Link>
                </motion.div>
              ))}
            </nav>

            <div className="mb-10 flex flex-col gap-1 text-sm text-[var(--color-fg-muted)]">
              <span>{siteConfig.address.street}</span>
              <span>
                {siteConfig.address.zip} {siteConfig.address.city}, {siteConfig.address.country}
              </span>
              <a href={`mailto:${siteConfig.email}`} className="mt-2 text-[var(--color-fg)]">
                {siteConfig.email}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
