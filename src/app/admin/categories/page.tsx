import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteCategory } from "./actions";

export const metadata: Metadata = { title: "Kategorienverwaltung" };

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Kategorien</h1>
        <Link
          href="/admin/categories/new"
          className="rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-neutral-700 dark:bg-white dark:text-neutral-900"
        >
          Neue Kategorie
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-black/5 dark:border-white/10">
        <table className="w-full text-sm">
          <thead className="border-b border-black/5 text-left text-neutral-500 dark:border-white/10">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Slug</th>
              <th className="px-4 py-3 font-medium">Produkte</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id} className="border-b border-black/5 last:border-0 dark:border-white/10">
                <td className="px-4 py-3 font-medium">{category.name}</td>
                <td className="px-4 py-3 text-neutral-500">{category.slug}</td>
                <td className="px-4 py-3">{category._count.products}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-3">
                    <Link href={`/admin/categories/${category.id}`} className="text-indigo-600 hover:underline">
                      Bearbeiten
                    </Link>
                    <form action={deleteCategory.bind(null, category.id)}>
                      <button className="text-red-600 hover:underline">Löschen</button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-neutral-500">
                  Noch keine Kategorien vorhanden.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
