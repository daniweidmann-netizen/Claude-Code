"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Cookie } from "lucide-react";

const STORAGE_KEY = "shopwerk-cookie-consent";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = window.localStorage.getItem(STORAGE_KEY);
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const respond = (value: "accepted" | "declined") => {
    window.localStorage.setItem(STORAGE_KEY, value);
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-x-4 bottom-4 z-[70] mx-auto max-w-xl sm:inset-x-auto sm:right-6 sm:bottom-6"
          role="dialog"
          aria-label="Cookie-Hinweis"
        >
          <div className="glass-strong flex flex-col gap-4 rounded-3xl p-6 sm:flex-row sm:items-center">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
              <Cookie className="size-5" />
            </div>
            <p className="text-sm leading-relaxed text-[var(--color-fg-muted)]">
              Wir verwenden Cookies, um unsere Webseite zuverlässig zu betreiben und
              zu verbessern. Mehr dazu in unserem{" "}
              <Link href="/cookies" className="text-[var(--color-fg)] underline underline-offset-4">
                Cookie-Hinweis
              </Link>
              .
            </p>
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={() => respond("declined")}
                className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-medium transition-colors hover:border-[var(--color-fg)]"
              >
                Ablehnen
              </button>
              <button
                type="button"
                onClick={() => respond("accepted")}
                className="rounded-full bg-[var(--color-fg)] px-4 py-2 text-xs font-medium text-[var(--color-bg)] transition-colors hover:bg-[var(--color-accent-soft)]"
              >
                Akzeptieren
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
