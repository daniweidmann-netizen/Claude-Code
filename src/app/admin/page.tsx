import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = { title: "Admin Dashboard" };

export default async function AdminDashboardPage() {
  const [productCount, categoryCount, orderCount, customerCount, revenue, recentOrders] =
    await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
      prisma.order.count({ where: { status: { in: ["PAID", "FULFILLED"] } } }),
      prisma.user.count({ where: { role: "USER" } }),
      prisma.order.aggregate({
        where: { status: { in: ["PAID", "FULFILLED"] } },
        _sum: { total: true },
      }),
      prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    ]);

  const stats = [
    { label: "Umsatz", value: formatPrice(revenue._sum.total ?? 0) },
    { label: "Bestellungen", value: orderCount },
    { label: "Produkte", value: productCount },
    { label: "Kategorien", value: categoryCount },
    { label: "Kunden", value: customerCount },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-black/5 p-4 dark:border-white/10"
          >
            <p className="text-xs text-neutral-500">{stat.label}</p>
            <p className="mt-1 text-xl font-semibold">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <h2 className="text-lg font-semibold">Neueste Bestellungen</h2>
        <div className="mt-3 overflow-x-auto rounded-2xl border border-black/5 dark:border-white/10">
          <table className="w-full text-sm">
            <thead className="border-b border-black/5 text-left text-neutral-500 dark:border-white/10">
              <tr>
                <th className="px-4 py-3 font-medium">Bestellnummer</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Datum</th>
                <th className="px-4 py-3 text-right font-medium">Gesamt</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-black/5 last:border-0 dark:border-white/10">
                  <td className="px-4 py-3 font-medium">{order.orderNumber}</td>
                  <td className="px-4 py-3">{order.status}</td>
                  <td className="px-4 py-3 text-neutral-500">
                    {new Date(order.createdAt).toLocaleDateString("de-DE")}
                  </td>
                  <td className="px-4 py-3 text-right">{formatPrice(order.total)}</td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-neutral-500">
                    Noch keine Bestellungen vorhanden.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
