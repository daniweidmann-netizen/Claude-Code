"use client";

import { useEffect, useState } from "react";

/** Mobile-only bottom bar: appears after the hero, hides while the main buy box is visible. */
export function StickyBuy({ title, price }: { title: string; price: string | null }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("nacht");
    const buy = document.getElementById("buy-primary");
    const footer = document.querySelector("footer");
    let pastHero = false;
    let buyVisible = false;
    let footerVisible = false;
    const update = () => setShow(pastHero && !buyVisible && !footerVisible);
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.target === hero) pastHero = !e.isIntersecting;
        if (e.target === buy) buyVisible = e.isIntersecting;
        if (e.target === footer) footerVisible = e.isIntersecting;
      }
      update();
    });
    [hero, buy, footer].forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div
      className={`fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-30 transition-[transform,opacity] duration-700 ease-[var(--ease-vireli-out)] lg:hidden ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-[140%] opacity-0"
      }`}
      aria-hidden={!show}
      inert={!show}
    >
      <div className="flex items-center gap-3 rounded-full border border-lavender/15 bg-night/95 p-2 pl-5 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.6)]">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] leading-tight">{title}</p>
          {price && <p className="t-num text-[13px] text-lavender">{price}</p>}
        </div>
        <a href="#produkt" className="btn btn-light min-h-12 px-5 text-sm">Kaufen</a>
      </div>
    </div>
  );
}
