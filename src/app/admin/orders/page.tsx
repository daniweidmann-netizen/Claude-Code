import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = { title: "Bestellungen" };

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Bestellungen</h1>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-black/5 dark:border-white/10">
        <table className="w-full text-sm">
          <thead className="border-b border-black/5 text-left text-neutral-500 dark:border-white/10">
            <tr>
              <th className="px-4 py-3 font-medium">Bestellnummer</th>
              <th className="px-4 py-3 font-medium">E-Mail</th>
              <th className="px-4 py-3 font-medium">Artikel</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Datum</th>
              <th className="px-4 py-3 text-right font-medium">Gesamt</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-black/5 last:border-0 dark:border-white/10">
                <td className="px-4 py-3">
                  <Link href={`/admin/orders/${order.id}`} className="font-medium text-indigo-600 hover:underline">
                    {order.orderNumber}
                  </Link>
                </td>
                <td className="px-4 py-3 text-neutral-500">{order.email}</td>
                <td className="px-4 py-3">{order.items.length}</td>
                <td className="px-4 py-3">{order.status}</td>
                <td className="px-4 py-3 text-neutral-500">
                  {new Date(order.createdAt).toLocaleDateString("de-DE")}
                </td>
                <td className="px-4 py-3 text-right">{formatPrice(order.total)}</td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-neutral-500">
                  Noch keine Bestellungen vorhanden.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
