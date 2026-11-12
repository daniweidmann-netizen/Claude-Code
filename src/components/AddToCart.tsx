"use client";

import { useState, useTransition } from "react";
import { addToCart } from "@/commerce/cart-actions";
import { useUI } from "@/store/ui";

export function AddToCart({
  variantId,
  available,
  connected,
  label = "In den Warenkorb",
  compact = false,
}: {
  variantId: string | null;
  available: boolean;
  connected: boolean;
  label?: string;
  compact?: boolean;
}) {
  const [qty, setQty] = useState(1);
  const [msg, setMsg] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const { setCart, setCartOpen } = useUI();

  const disabled = !variantId || !available || pending;

  const onAdd = () =>
    start(async () => {
      setMsg(null);
      if (!connected) {
        setMsg("Vorschau: Shopify ist noch nicht verbunden.");
        return;
      }
      const r = await addToCart(variantId!, qty);
      if (r.error) setMsg(r.error);
      if (r.cart) {
        setCart(r.cart);
        setCartOpen(true);
      }
    });

  return (
    <div className="w-full">
      <div className={`flex w-full gap-3 ${compact ? "" : "flex-col sm:flex-row"}`}>
        {!compact && (
          <div className="flex h-14 shrink-0 items-center justify-between rounded-full border border-ivory/15 sm:w-[136px]">
            <button type="button" className="h-14 w-12 text-lg" aria-label="Menge verringern" onClick={() => setQty((q) => Math.max(1, q - 1))}>
              −
            </button>
            <span className="t-num text-[15px]" aria-live="polite">{qty}</span>
            <button type="button" className="h-14 w-12 text-lg" aria-label="Menge erhöhen" onClick={() => setQty((q) => Math.min(10, q + 1))}>
              +
            </button>
          </div>
        )}
        <button type="button" onClick={onAdd} disabled={disabled} className="btn btn-light flex-1">
          {available ? (pending ? "Wird hinzugefügt …" : label) : "Ausverkauft"}
          {available && !pending && <span className="btn-arrow">→</span>}
        </button>
      </div>
      {msg && <p className="t-small mt-3 text-lavender" role="status">{msg}</p>}
    </div>
  );
}
