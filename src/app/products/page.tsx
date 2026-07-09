import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/product/ProductCard";
import { cn } from "@/lib/utils";
import type { Prisma } from "@prisma/client";

const PAGE_SIZE = 12;

type SearchParams = Promise<{
  q?: string;
  category?: string;
  page?: string;
  sort?: string;
}>;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const { q, category } = await searchParams;
  if (q) {
    return { title: `Suche: "${q}"` };
  }
  if (category) {
    return { title: `Kategorie: ${category}` };
  }
  return { title: "Alle Produkte" };
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { q, category, page, sort } = await searchParams;
  const currentPage = Math.max(1, Number(page) || 1);

  const where: Prisma.ProductWhereInput = { published: true };

  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
    ];
  }

  if (category) {
    where.category = { slug: category };
  }

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    sort === "price-asc"
      ? { price: "asc" }
      : sort === "price-desc"
        ? { price: "desc" }
        : { createdAt: "desc" };

  const [products, total, categories, activeCategory] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip: (currentPage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.product.count({ where }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    category ? prisma.category.findUnique({ where: { slug: category } }) : null,
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  function buildHref(overrides: Record<string, string | undefined>) {
    const params = new URLSearchParams();
    const next = { q, category, sort, ...overrides };
    for (const [key, value] of Object.entries(next)) {
      if (value) params.set(key, value);
    }
    const qs = params.toString();
    return qs ? `/products?${qs}` : "/products";
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">
          {q ? `Suchergebnisse für "${q}"` : activeCategory ? activeCategory.name : "Alle Produkte"}
        </h1>
        <p className="mt-1 text-sm text-neutral-500">{total} Produkte gefunden</p>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        <aside className="lg:w-56 lg:shrink-0">
          <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            Kategorien
          </h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link
                href={buildHref({ category: undefined, page: undefined })}
                className={cn(
                  "hover:text-indigo-600",
                  !category ? "font-semibold text-indigo-600" : "text-neutral-600 dark:text-neutral-400"
                )}
              >
                Alle
              </Link>
            </li>
            {categories.map((c) => (
              <li key={c.id}>
                <Link
                  href={buildHref({ category: c.slug, page: undefined })}
                  className={cn(
                    "hover:text-indigo-600",
                    category === c.slug
                      ? "font-semibold text-indigo-600"
                      : "text-neutral-600 dark:text-neutral-400"
                  )}
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>

          <h2 className="mt-8 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            Sortieren
          </h2>
          <ul className="mt-3 space-y-2 text-sm">
            {[
              { key: undefined, label: "Neueste" },
              { key: "price-asc", label: "Preis aufsteigend" },
              { key: "price-desc", label: "Preis absteigend" },
            ].map((opt) => (
              <li key={opt.label}>
                <Link
                  href={buildHref({ sort: opt.key, page: undefined })}
                  className={cn(
                    "hover:text-indigo-600",
                    sort === opt.key
                      ? "font-semibold text-indigo-600"
                      : "text-neutral-600 dark:text-neutral-400"
                  )}
                >
                  {opt.label}
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        <div className="flex-1">
          {products.length === 0 ? (
            <p className="text-sm text-neutral-500">
              Keine Produkte gefunden. Versuche eine andere Suche oder Kategorie.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={buildHref({ page: p === 1 ? undefined : String(p) })}
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full text-sm",
                    p === currentPage
                      ? "bg-indigo-600 text-white"
                      : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
                  )}
                >
                  {p}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
