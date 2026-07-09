import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = { title: "Meine Bestellungen" };

const statusLabels: Record<string, string> = {
  PENDING: "Ausstehend",
  PAID: "Bezahlt",
  FULFILLED: "Versendet",
  CANCELLED: "Storniert",
  REFUNDED: "Erstattet",
};

export default async function OrdersPage() {
  const session = await auth();
  const orders = await prisma.order.findMany({
    where: { userId: session!.user.id },
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  if (orders.length === 0) {
    return <p className="text-sm text-neutral-500">Du hast noch keine Bestellungen aufgegeben.</p>;
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Link
          key={order.id}
          href={`/account/orders/${order.id}`}
          className="block rounded-2xl border border-black/5 p-4 hover:bg-neutral-50 dark:border-white/10 dark:hover:bg-neutral-900"
        >
          <div className="flex items-center justify-between text-sm">
            <div>
              <p className="font-semibold">{order.orderNumber}</p>
              <p className="text-neutral-500">
                {new Date(order.createdAt).toLocaleDateString("de-DE")} · {order.items.length} Artikel
              </p>
            </div>
            <div className="text-right">
              <p className="font-semibold">{formatPrice(order.total)}</p>
              <p className="text-neutral-500">{statusLabels[order.status] ?? order.status}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
