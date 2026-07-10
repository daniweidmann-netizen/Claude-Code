"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Magnetic } from "@/components/motion/magnetic";
import { cn } from "@/lib/utils";

const LINKS = [
  { label: "Collection", href: "#collection" },
  { label: "Philosophy", href: "#philosophy" },
  { label: "Atelier", href: "#atelier" },
];

export function Navbar() {
  const { scrollY } = useScroll();
  const [condensed, setCondensed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setCondensed(latest > 48);
  });

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 sm:px-6 sm:pt-5"
    >
      <div
        className={cn(
          "glass-panel flex w-full max-w-6xl items-center justify-between rounded-full px-5 py-3 transition-[padding,max-width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:px-7",
          condensed && "max-w-3xl py-2.5 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.6)]"
        )}
      >
        <a href="#top" className="flex items-center gap-2.5">
          <span className="relative flex h-7 w-7 items-center justify-center rounded-full border border-gold-400/40">
            <span className="h-1.5 w-1.5 rounded-full bg-gold-300 shadow-[0_0_12px_2px_var(--color-gold-300)]" />
          </span>
          <span className="font-display text-sm font-medium tracking-[0.28em] text-mist-100">
            AURUM
          </span>
        </a>

        <nav className="hidden items-center gap-9 md:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="group relative text-[13px] font-medium tracking-wide text-mist-300 transition-colors duration-300 hover:text-mist-50"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-gold-300 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:w-full" />
            </a>
          ))}
        </nav>

        <div className="hidden md:block">
          <Magnetic>
            <a
              href="#collection"
              className="relative overflow-hidden rounded-full border border-gold-400/50 px-5 py-2 text-[13px] font-medium tracking-wide text-mist-50 transition-colors duration-300 hover:border-gold-300"
            >
              <span className="relative z-10">Enter the Collection</span>
              <span className="absolute inset-0 -z-0 bg-gradient-to-r from-gold-400/0 via-gold-300/25 to-gold-400/0 opacity-0 transition-opacity duration-300 hover:opacity-100" />
            </a>
          </Magnetic>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          className="flex h-8 w-8 items-center justify-center text-mist-100 md:hidden"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="glass-panel absolute inset-x-4 top-[calc(100%+8px)] flex flex-col gap-1 rounded-3xl p-3 sm:inset-x-6 md:hidden"
        >
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="rounded-2xl px-4 py-3 text-sm text-mist-200 transition-colors hover:bg-white/5 hover:text-mist-50"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#collection"
            onClick={() => setMenuOpen(false)}
            className="mt-1 rounded-2xl border border-gold-400/40 px-4 py-3 text-center text-sm font-medium text-mist-50"
          >
            Enter the Collection
          </a>
        </motion.div>
      )}
    </motion.header>
  );
}
