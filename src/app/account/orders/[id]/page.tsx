import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = { title: "Bestelldetails" };

const statusLabels: Record<string, string> = {
  PENDING: "Ausstehend",
  PAID: "Bezahlt",
  FULFILLED: "Versendet",
  CANCELLED: "Storniert",
  REFUNDED: "Erstattet",
};

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });

  if (!order || order.userId !== session?.user.id) {
    notFound();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Bestellung {order.orderNumber}</h2>
        <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium dark:bg-neutral-800">
          {statusLabels[order.status] ?? order.status}
        </span>
      </div>
      <p className="mt-1 text-sm text-neutral-500">
        Aufgegeben am {new Date(order.createdAt).toLocaleDateString("de-DE")}
      </p>

      <div className="mt-6 divide-y divide-black/5 rounded-2xl border border-black/5 dark:divide-white/10 dark:border-white/10">
        {order.items.map((item) => (
          <div key={item.id} className="flex items-center gap-4 p-4">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-800">
              {item.image && (
                <Image src={item.image} alt={item.name} fill sizes="64px" className="object-cover" />
              )}
            </div>
            <div className="flex-1 text-sm">
              <p className="font-medium">{item.name}</p>
              <p className="text-neutral-500">Menge: {item.quantity}</p>
            </div>
            <span className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</span>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-black/5 p-4 text-sm dark:border-white/10">
          <h3 className="font-semibold">Lieferadresse</h3>
          <p className="mt-2 text-neutral-500">
            {order.shippingName}
            <br />
            {order.shippingLine1}
            {order.shippingLine2 && (
              <>
                <br />
                {order.shippingLine2}
              </>
            )}
            <br />
            {order.shippingPostal} {order.shippingCity}
            <br />
            {order.shippingCountry}
          </p>
        </div>

        <div className="rounded-2xl border border-black/5 p-4 text-sm dark:border-white/10">
          <h3 className="font-semibold">Zahlungsübersicht</h3>
          <div className="mt-2 space-y-1 text-neutral-500">
            <div className="flex justify-between">
              <span>Zwischensumme</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between">
                <span>Rabatt</span>
                <span>-{formatPrice(order.discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Versand</span>
              <span>{order.shippingAmount === 0 ? "Kostenlos" : formatPrice(order.shippingAmount)}</span>
            </div>
            <div className="flex justify-between border-t border-black/5 pt-1 font-semibold text-neutral-900 dark:border-white/10 dark:text-neutral-100">
              <span>Gesamt</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
