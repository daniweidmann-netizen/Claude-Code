"use client";

import { useEffect, useTransition } from "react";
import Image from "next/image";
import { useUI } from "@/store/ui";
import { getCart, updateCartLine } from "@/commerce/cart-actions";
import { formatMoney } from "@/commerce/format";

export function CartDrawer({ connected }: { connected: boolean }) {
  const { cartOpen, setCartOpen, cart, setCart } = useUI();
  const [pending, start] = useTransition();

  useEffect(() => {
    if (connected) getCart().then((r) => setCart(r.cart));
  }, [connected, setCart]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setCartOpen(false);
    window.addEventListener("keydown", onKey);
    if (cartOpen) window.__lenis?.stop();
    else window.__lenis?.start();
    return () => window.removeEventListener("keydown", onKey);
  }, [cartOpen, setCartOpen]);

  const change = (lineId: string, q: number) =>
    start(async () => {
      const r = await updateCartLine(lineId, q);
      if (r.cart !== undefined) setCart(r.cart);
    });

  const lines = cart?.lines ?? [];

  return (
    <div className={`fixed inset-0 z-[70] ${cartOpen ? "" : "pointer-events-none"}`} aria-hidden={!cartOpen} inert={!cartOpen}>
      <button
        type="button"
        aria-label="Warenkorb schliessen"
        onClick={() => setCartOpen(false)}
        className={`absolute inset-0 bg-midnight/60 transition-opacity duration-700 ${cartOpen ? "opacity-100" : "opacity-0"}`}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Warenkorb"
        className={`absolute inset-y-0 right-0 flex w-full max-w-[440px] flex-col border-l border-lavender/10 bg-night transition-transform duration-[800ms] ease-[var(--ease-vireli-out)] ${
          cartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-[var(--header-h)] items-center justify-between px-6 sm:px-8">
          <p className="t-caps">Warenkorb <span className="t-num text-lavender">({cart?.totalQuantity ?? 0})</span></p>
          <button type="button" onClick={() => setCartOpen(false)} className="t-caps link-line h-11">
            Schliessen
          </button>
        </div>
        <div className="hairline mx-6 text-ivory sm:mx-8" />

        <div className="flex-1 overflow-y-auto px-6 py-8 sm:px-8" data-lenis-prevent>
          {lines.length === 0 ? (
            <div className="flex h-full flex-col justify-center">
              <p className="t-subtitle">Dein Warenkorb ist noch leer.</p>
              <p className="t-small mt-4 max-w-[30ch] text-ivory/60">
                {connected ? "Dein Abendritual beginnt mit einem Gummie." : "Shopify ist noch nicht verbunden – der Warenkorb ist in dieser Vorschau deaktiviert."}
              </p>
            </div>
          ) : (
            <ul className={`flex flex-col gap-6 ${pending ? "opacity-60" : ""}`}>
              {lines.map((l) => (
                <li key={l.id} className="grid grid-cols-[72px_1fr_auto] gap-4">
                  <div className="relative aspect-square overflow-hidden rounded-md bg-violet/30">
                    {l.image && <Image src={l.image.url} alt={l.image.altText ?? l.title} fill sizes="72px" className="object-cover" />}
                  </div>
                  <div>
                    <p className="text-[15px] leading-snug">{l.title}</p>
                    <div className="mt-3 inline-flex items-center rounded-full border border-ivory/15">
                      <button className="h-9 w-9" aria-label="Menge verringern" onClick={() => change(l.id, l.quantity - 1)}>−</button>
                      <span className="t-num w-6 text-center text-sm">{l.quantity}</span>
                      <button className="h-9 w-9" aria-label="Menge erhöhen" onClick={() => change(l.id, l.quantity + 1)}>+</button>
                    </div>
                  </div>
                  <p className="t-num text-sm">{formatMoney(l.cost)}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t border-ivory/10 px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-6 sm:px-8">
          {cart && lines.length > 0 && (
            <div className="mb-5 flex items-baseline justify-between">
              <p className="t-caps text-ivory/70">Zwischensumme</p>
              <p className="t-num text-lg">{formatMoney(cart.subtotal)}</p>
            </div>
          )}
          {cart && lines.length > 0 ? (
            <a href={cart.checkoutUrl} className="btn btn-light w-full">
              Zur Kasse <span className="btn-arrow">→</span>
            </a>
          ) : (
            <button type="button" className="btn btn-ghost w-full" onClick={() => setCartOpen(false)}>
              Weiter entdecken
            </button>
          )}
          <p className="t-small mt-4 text-center text-ivory/45">Versand und Steuern werden an der Kasse berechnet.</p>
        </div>
      </aside>
    </div>
  );
}
