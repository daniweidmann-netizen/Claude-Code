import Link from "next/link";
import SignOutButton from "@/components/account/SignOutButton";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:px-8">
      <aside className="w-56 shrink-0">
        <p className="text-lg font-bold tracking-tight">Admin</p>
        <nav className="mt-6 flex flex-col gap-3 text-sm font-medium text-neutral-600 dark:text-neutral-400">
          <Link href="/admin" className="hover:text-indigo-600">
            Dashboard
          </Link>
          <Link href="/admin/products" className="hover:text-indigo-600">
            Produkte
          </Link>
          <Link href="/admin/categories" className="hover:text-indigo-600">
            Kategorien
          </Link>
          <Link href="/admin/discounts" className="hover:text-indigo-600">
            Rabattcodes
          </Link>
          <Link href="/admin/orders" className="hover:text-indigo-600">
            Bestellungen
          </Link>
          <Link href="/" className="hover:text-indigo-600">
            Zum Shop
          </Link>
          <SignOutButton />
        </nav>
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
