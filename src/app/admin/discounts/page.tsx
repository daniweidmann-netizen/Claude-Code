import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { toggleDiscount, deleteDiscount } from "./actions";

export const metadata: Metadata = { title: "Rabattcodes" };

export default async function AdminDiscountsPage() {
  const discounts = await prisma.discountCode.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Rabattcodes</h1>
        <Link
          href="/admin/discounts/new"
          className="rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-neutral-700 dark:bg-white dark:text-neutral-900"
        >
          Neuer Rabattcode
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-black/5 dark:border-white/10">
        <table className="w-full text-sm">
          <thead className="border-b border-black/5 text-left text-neutral-500 dark:border-white/10">
            <tr>
              <th className="px-4 py-3 font-medium">Code</th>
              <th className="px-4 py-3 font-medium">Rabatt</th>
              <th className="px-4 py-3 font-medium">Einlösungen</th>
              <th className="px-4 py-3 font-medium">Läuft ab</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {discounts.map((d) => (
              <tr key={d.id} className="border-b border-black/5 last:border-0 dark:border-white/10">
                <td className="px-4 py-3 font-mono font-medium">{d.code}</td>
                <td className="px-4 py-3">
                  {d.type === "PERCENTAGE" ? `${d.value}%` : formatPrice(d.value)}
                </td>
                <td className="px-4 py-3 text-neutral-500">
                  {d.timesRedeemed}
                  {d.maxRedemptions ? ` / ${d.maxRedemptions}` : ""}
                </td>
                <td className="px-4 py-3 text-neutral-500">
                  {d.expiresAt ? new Date(d.expiresAt).toLocaleDateString("de-DE") : "—"}
                </td>
                <td className="px-4 py-3">
                  {d.active ? (
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700 dark:bg-green-900 dark:text-green-300">
                      Aktiv
                    </span>
                  ) : (
                    <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-500 dark:bg-neutral-800">
                      Inaktiv
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-3">
                    <form action={toggleDiscount.bind(null, d.id, !d.active)}>
                      <button className="text-indigo-600 hover:underline">
                        {d.active ? "Deaktivieren" : "Aktivieren"}
                      </button>
                    </form>
                    <form action={deleteDiscount.bind(null, d.id)}>
                      <button className="text-red-600 hover:underline">Löschen</button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {discounts.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-neutral-500">
                  Noch keine Rabattcodes vorhanden.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
