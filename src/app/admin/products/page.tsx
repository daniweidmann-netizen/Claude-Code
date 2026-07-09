import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { deleteProduct } from "./actions";

export const metadata: Metadata = { title: "Produktverwaltung" };

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Produkte</h1>
        <Link
          href="/admin/products/new"
          className="rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-neutral-700 dark:bg-white dark:text-neutral-900"
        >
          Neues Produkt
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-black/5 dark:border-white/10">
        <table className="w-full text-sm">
          <thead className="border-b border-black/5 text-left text-neutral-500 dark:border-white/10">
            <tr>
              <th className="px-4 py-3 font-medium">Produkt</th>
              <th className="px-4 py-3 font-medium">Kategorie</th>
              <th className="px-4 py-3 font-medium">Preis</th>
              <th className="px-4 py-3 font-medium">Lager</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-black/5 last:border-0 dark:border-white/10">
                <td className="flex items-center gap-3 px-4 py-3">
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-800">
                    {product.images[0] && (
                      <Image src={product.images[0]} alt={product.name} fill sizes="40px" className="object-cover" />
                    )}
                  </div>
                  <span className="font-medium">{product.name}</span>
                </td>
                <td className="px-4 py-3 text-neutral-500">{product.category.name}</td>
                <td className="px-4 py-3">{formatPrice(product.price)}</td>
                <td className="px-4 py-3">{product.stock}</td>
                <td className="px-4 py-3">
                  {product.published ? (
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700 dark:bg-green-900 dark:text-green-300">
                      Veröffentlicht
                    </span>
                  ) : (
                    <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-500 dark:bg-neutral-800">
                      Entwurf
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-3">
                    <Link href={`/admin/products/${product.id}`} className="text-indigo-600 hover:underline">
                      Bearbeiten
                    </Link>
                    <form action={deleteProduct.bind(null, product.id)}>
                      <button className="text-red-600 hover:underline">Löschen</button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-neutral-500">
                  Noch keine Produkte vorhanden.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
