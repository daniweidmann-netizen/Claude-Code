import type { Metadata } from "next";
import Link from "next/link";
import { XCircle } from "lucide-react";

export const metadata: Metadata = { title: "Bestellung abgebrochen" };

export default function CheckoutCancelPage() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center sm:px-6">
      <XCircle className="h-14 w-14 text-red-500" />
      <h1 className="mt-6 text-2xl font-bold tracking-tight">Bestellung abgebrochen</h1>
      <p className="mt-2 text-neutral-500">
        Deine Zahlung wurde nicht abgeschlossen. Dein Warenkorb ist weiterhin verfügbar.
      </p>
      <Link
        href="/cart"
        className="mt-8 rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold text-white hover:bg-neutral-700 dark:bg-white dark:text-neutral-900"
      >
        Zurück zum Warenkorb
      </Link>
    </div>
  );
}
