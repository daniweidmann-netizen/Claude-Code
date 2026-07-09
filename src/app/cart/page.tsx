import type { Metadata } from "next";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { getCart, cartTotals } from "@/lib/cart";
import { formatPrice } from "@/lib/utils";
import CartItemRow from "@/components/cart/CartItemRow";

export const metadata: Metadata = { title: "Warenkorb" };

export default async function CartPage() {
  const cart = await getCart();
  const { subtotal, itemCount } = cartTotals(cart.items);

  if (cart.items.length === 0) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-24 text-center sm:px-6 lg:px-8">
        <ShoppingBag className="h-12 w-12 text-neutral-300" />
        <h1 className="mt-4 text-2xl font-bold">Dein Warenkorb ist leer</h1>
        <p className="mt-2 text-sm text-neutral-500">
          Entdecke unsere Produkte und finde etwas Passendes für dich.
        </p>
        <Link
          href="/products"
          className="mt-6 rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold text-white hover:bg-neutral-700 dark:bg-white dark:text-neutral-900"
        >
          Jetzt einkaufen
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold tracking-tight">Warenkorb ({itemCount})</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {cart.items.map((item) => (
            <CartItemRow
              key={item.id}
              id={item.id}
              name={item.product.name}
              slug={item.product.slug}
              image={item.product.images[0]}
              price={item.product.price}
              quantity={item.quantity}
            />
          ))}
        </div>

        <div className="h-fit rounded-2xl border border-black/5 p-6 dark:border-white/10">
          <h2 className="text-lg font-semibold">Zusammenfassung</h2>
          <div className="mt-4 flex justify-between text-sm">
            <span className="text-neutral-500">Zwischensumme</span>
            <span className="font-medium">{formatPrice(subtotal)}</span>
          </div>
          <p className="mt-1 text-xs text-neutral-400">
            Versand und Rabatte werden im nächsten Schritt berechnet.
          </p>
          <Link
            href="/checkout"
            className="mt-6 block w-full rounded-full bg-neutral-900 px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            Zur Kasse
          </Link>
        </div>
      </div>
    </div>
  );
}
