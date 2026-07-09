import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCart, cartTotals } from "@/lib/cart";
import { auth } from "@/lib/auth";
import CheckoutForm from "@/components/cart/CheckoutForm";

export const metadata: Metadata = { title: "Kasse" };

export default async function CheckoutPage() {
  const [cart, session] = await Promise.all([getCart(), auth()]);

  if (cart.items.length === 0) {
    redirect("/cart");
  }

  const { subtotal } = cartTotals(cart.items);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold tracking-tight">Kasse</h1>

      <CheckoutForm
        items={cart.items.map((i) => ({
          id: i.id,
          name: i.product.name,
          image: i.product.images[0],
          price: i.product.price,
          quantity: i.quantity,
        }))}
        subtotal={subtotal}
        defaultEmail={session?.user?.email ?? ""}
      />
    </div>
  );
}
