import Link from "next/link";
import { ShoppingBag, User } from "lucide-react";
import { auth } from "@/lib/auth";
import { getCart, cartTotals } from "@/lib/cart";
import { getNavCategories } from "@/lib/nav";
import SearchBar from "@/components/layout/SearchBar";
import MobileNav from "@/components/layout/MobileNav";

export default async function Header() {
  const [session, cart, categories] = await Promise.all([
    auth(),
    getCart(),
    getNavCategories(),
  ]);

  const { itemCount } = cartTotals(cart.items);

  return (
    <header className="sticky top-0 z-40 border-b border-black/10 bg-white/80 backdrop-blur-md dark:border-white/10 dark:bg-neutral-950/80">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <MobileNav categories={categories} />

        <Link href="/" className="shrink-0 text-xl font-bold tracking-tight">
          NOVA<span className="text-indigo-600">.</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-neutral-700 md:flex dark:text-neutral-300">
          <Link href="/products" className="hover:text-indigo-600">
            Alle Produkte
          </Link>
          {categories.slice(0, 5).map((c) => (
            <Link
              key={c.id}
              href={`/products?category=${c.slug}`}
              className="hover:text-indigo-600"
            >
              {c.name}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex flex-1 items-center justify-end gap-3">
          <div className="hidden max-w-xs flex-1 sm:block">
            <SearchBar />
          </div>

          <Link
            href={session ? "/account" : "/login"}
            className="flex items-center gap-1.5 rounded-full p-2 text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
            aria-label="Konto"
          >
            <User className="h-5 w-5" />
          </Link>

          <Link
            href="/cart"
            className="relative flex items-center gap-1.5 rounded-full p-2 text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
            aria-label="Warenkorb"
          >
            <ShoppingBag className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4.5 w-4.5 min-w-4.5 items-center justify-center rounded-full bg-indigo-600 px-1 text-[10px] font-semibold text-white">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>
      <div className="border-t border-black/5 px-4 py-2 sm:hidden dark:border-white/10">
        <SearchBar />
      </div>
    </header>
  );
}
