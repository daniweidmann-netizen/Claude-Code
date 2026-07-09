import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = { title: "Kontoübersicht" };

export default async function AccountOverviewPage() {
  const session = await auth();
  const recentOrders = await prisma.order.findMany({
    where: { userId: session!.user.id },
    orderBy: { createdAt: "desc" },
    take: 3,
  });

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-black/5 p-6 dark:border-white/10">
        <h2 className="text-lg font-semibold">Hallo, {session?.user?.name ?? session?.user?.email}!</h2>
        <p className="mt-1 text-sm text-neutral-500">{session?.user?.email}</p>
      </section>

      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Letzte Bestellungen</h2>
          <Link href="/account/orders" className="text-sm text-indigo-600 hover:underline">
            Alle anzeigen
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p className="mt-3 text-sm text-neutral-500">Du hast noch keine Bestellungen aufgegeben.</p>
        ) : (
          <div className="mt-3 divide-y divide-black/5 rounded-2xl border border-black/5 dark:divide-white/10 dark:border-white/10">
            {recentOrders.map((order) => (
              <Link
                key={order.id}
                href={`/account/orders/${order.id}`}
                className="flex items-center justify-between px-4 py-3 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-900"
              >
                <div>
                  <p className="font-medium">{order.orderNumber}</p>
                  <p className="text-neutral-500">
                    {new Date(order.createdAt).toLocaleDateString("de-DE")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatPrice(order.total)}</p>
                  <p className="text-neutral-500">{order.status}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
