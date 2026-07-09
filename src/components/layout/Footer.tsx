import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-black/10 bg-neutral-50 dark:border-white/10 dark:bg-neutral-950">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8">
        <div className="col-span-2 md:col-span-1">
          <p className="text-xl font-bold tracking-tight">
            NOVA<span className="text-indigo-600">.</span>
          </p>
          <p className="mt-3 text-sm text-neutral-500">
            Modernes Shopping. Schnell, sicher und stilvoll.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Shop</h3>
          <ul className="mt-3 space-y-2 text-sm text-neutral-500">
            <li>
              <Link href="/products" className="hover:text-indigo-600">
                Alle Produkte
              </Link>
            </li>
            <li>
              <Link href="/cart" className="hover:text-indigo-600">
                Warenkorb
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Konto</h3>
          <ul className="mt-3 space-y-2 text-sm text-neutral-500">
            <li>
              <Link href="/login" className="hover:text-indigo-600">
                Anmelden
              </Link>
            </li>
            <li>
              <Link href="/register" className="hover:text-indigo-600">
                Registrieren
              </Link>
            </li>
            <li>
              <Link href="/account/orders" className="hover:text-indigo-600">
                Meine Bestellungen
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Unternehmen</h3>
          <ul className="mt-3 space-y-2 text-sm text-neutral-500">
            <li>Impressum</li>
            <li>Datenschutz</li>
            <li>AGB</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-black/5 px-4 py-6 text-center text-xs text-neutral-400 dark:border-white/10">
        © {new Date().getFullYear()} NOVA Shop. Alle Rechte vorbehalten.
      </div>
    </footer>
  );
}
