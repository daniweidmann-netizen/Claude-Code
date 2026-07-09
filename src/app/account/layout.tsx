import Link from "next/link";
import SignOutButton from "@/components/account/SignOutButton";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold tracking-tight">Mein Konto</h1>
      <div className="mt-8 flex flex-col gap-10 md:flex-row">
        <aside className="md:w-48 md:shrink-0">
          <nav className="flex flex-row gap-4 text-sm font-medium text-neutral-600 md:flex-col dark:text-neutral-400">
            <Link href="/account" className="hover:text-indigo-600">
              Übersicht
            </Link>
            <Link href="/account/orders" className="hover:text-indigo-600">
              Bestellungen
            </Link>
            <Link href="/account/addresses" className="hover:text-indigo-600">
              Adressen
            </Link>
            <SignOutButton />
          </nav>
        </aside>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
