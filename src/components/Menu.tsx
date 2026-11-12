"use client";

import { useEffect } from "react";
import { useUI } from "@/store/ui";
import { nav } from "@/content/copy";
import { Moon } from "./Moon";

export function Menu() {
  const { menuOpen, setMenuOpen } = useUI();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    if (menuOpen) window.__lenis?.stop();
    else window.__lenis?.start();
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen, setMenuOpen]);

  return (
    <div
      id="site-menu"
      className={`fixed inset-0 z-40 bg-midnight transition-[clip-path] duration-[900ms] ease-[var(--ease-vireli-in-out)] ${
        menuOpen ? "[clip-path:inset(0_0_0_0)]" : "pointer-events-none [clip-path:inset(0_0_100%_0)]"
      }`}
      aria-hidden={!menuOpen}
      inert={!menuOpen}
    >
      <Moon className="pointer-events-none absolute -right-[10vw] -top-[8vw] w-[60vw] max-w-[720px] opacity-60" />
      <div className="wrap flex h-full flex-col justify-end pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-36">
        <ol className="flex flex-col">
          {nav.map((item, i) => (
            <li key={item.href} className="border-t border-ivory/10 last:border-b">
              <a
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="group flex items-baseline gap-5 py-4 sm:gap-10 sm:py-5"
                style={{ transitionDelay: menuOpen ? `${120 + i * 60}ms` : "0ms" }}
              >
                <span className="t-caps t-num w-8 text-lavender/70">{item.n}</span>
                <span className="t-title transition-[transform,color] duration-700 ease-[var(--ease-vireli-out)] group-hover:translate-x-3 group-hover:text-lavender">
                  {item.label}
                </span>
              </a>
            </li>
          ))}
        </ol>
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 text-ivory/60">
          <p className="t-caps">Night Gummies · Mixed Berry</p>
          <p className="t-caps">Schweiz</p>
        </div>
      </div>
    </div>
  );
}
