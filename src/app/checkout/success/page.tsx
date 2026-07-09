import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import ClearCartOnMount from "@/components/cart/ClearCartOnMount";

export const metadata: Metadata = { title: "Bestellung erfolgreich" };

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order: orderNumber } = await searchParams;
  const order = orderNumber
    ? await prisma.order.findUnique({ where: { orderNumber } })
    : null;

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center sm:px-6">
      <ClearCartOnMount />
      <CheckCircle2 className="h-14 w-14 text-green-600" />
      <h1 className="mt-6 text-2xl font-bold tracking-tight">Vielen Dank für deine Bestellung!</h1>
      <p className="mt-2 text-neutral-500">
        Wir haben deine Bestellung erhalten und senden dir in Kürze eine Bestätigung per E-Mail.
      </p>

      {order && (
        <div className="mt-8 w-full rounded-2xl border border-black/5 p-6 text-left dark:border-white/10">
          <div className="flex justify-between text-sm">
            <span className="text-neutral-500">Bestellnummer</span>
            <span className="font-medium">{order.orderNumber}</span>
          </div>
          <div className="mt-2 flex justify-between text-sm">
            <span className="text-neutral-500">Gesamtbetrag</span>
            <span className="font-medium">{formatPrice(order.total)}</span>
          </div>
        </div>
      )}

      <div className="mt-8 flex gap-4">
        <Link
          href="/products"
          className="rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold text-white hover:bg-neutral-700 dark:bg-white dark:text-neutral-900"
        >
          Weiter einkaufen
        </Link>
        <Link
          href="/account/orders"
          className="rounded-full border border-neutral-300 px-6 py-3 text-sm font-semibold hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-900"
        >
          Meine Bestellungen
        </Link>
      </div>
    </div>
  );
}
