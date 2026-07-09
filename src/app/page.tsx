import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Truck, ShieldCheck, RotateCcw } from "lucide-react";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/product/ProductCard";

export default async function HomePage() {
  const [featured, categories] = await Promise.all([
    prisma.product.findMany({
      where: { published: true, featured: true },
      take: 8,
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({ take: 4, orderBy: { name: "asc" } }),
  ]);

  const products =
    featured.length > 0
      ? featured
      : await prisma.product.findMany({
          where: { published: true },
          take: 8,
          orderBy: { createdAt: "desc" },
        });

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-neutral-950 text-white">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-indigo-900 via-neutral-950 to-neutral-950" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 md:grid-cols-2 md:py-32 lg:px-8">
          <div>
            <span className="inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-medium tracking-wide text-indigo-200 uppercase">
              Neue Kollektion 2026
            </span>
            <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Design, das
              <br />
              <span className="text-indigo-400">bewegt.</span>
            </h1>
            <p className="mt-6 max-w-md text-lg text-neutral-300">
              Entdecke sorgfältig ausgewählte Produkte für deinen Alltag –
              modern, hochwertig und schnell geliefert.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-200"
              >
                Jetzt einkaufen
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Bestseller ansehen
              </Link>
            </div>
          </div>
          <div className="relative hidden aspect-square rounded-3xl bg-white/5 md:block">
            <Image
              src="https://picsum.photos/seed/nova-hero/800/800"
              alt="Produkt-Highlight"
              fill
              priority
              sizes="(min-width: 768px) 40vw, 0vw"
              className="rounded-3xl object-cover"
            />
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="border-b border-black/5 bg-neutral-50 dark:border-white/10 dark:bg-neutral-950">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-8 sm:grid-cols-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Truck className="h-6 w-6 text-indigo-600" />
            <div>
              <p className="text-sm font-semibold">Schneller Versand</p>
              <p className="text-xs text-neutral-500">Lieferung in 2–4 Werktagen</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-6 w-6 text-indigo-600" />
            <div>
              <p className="text-sm font-semibold">Sichere Zahlung</p>
              <p className="text-xs text-neutral-500">Verschlüsselt über Stripe</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <RotateCcw className="h-6 w-6 text-indigo-600" />
            <div>
              <p className="text-sm font-semibold">30 Tage Rückgabe</p>
              <p className="text-xs text-neutral-500">Unkompliziert & kostenlos</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight">Kategorien entdecken</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${category.slug}`}
                className="group relative aspect-4/3 overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-800"
              >
                {category.image && (
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    sizes="(min-width: 768px) 25vw, 50vw"
                    className="object-cover transition duration-300 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <span className="absolute bottom-3 left-3 text-sm font-semibold text-white">
                  {category.name}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured products */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Beliebte Produkte</h2>
          <Link
            href="/products"
            className="text-sm font-medium text-indigo-600 hover:underline"
          >
            Alle anzeigen
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        {products.length === 0 && (
          <p className="mt-6 text-sm text-neutral-500">
            Noch keine Produkte vorhanden. Führe das Seed-Skript aus, um Beispieldaten zu
            laden.
          </p>
        )}
      </section>
    </div>
  );
}
