import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createAddress, deleteAddress, setDefaultAddress } from "./actions";

export const metadata: Metadata = { title: "Meine Adressen" };

export default async function AddressesPage() {
  const session = await auth();
  const addresses = await prisma.address.findMany({
    where: { userId: session!.user.id },
    orderBy: { isDefault: "desc" },
  });

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-lg font-semibold">Gespeicherte Adressen</h2>
        {addresses.length === 0 ? (
          <p className="mt-3 text-sm text-neutral-500">Du hast noch keine Adresse gespeichert.</p>
        ) : (
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            {addresses.map((address) => (
              <div
                key={address.id}
                className="rounded-2xl border border-black/5 p-4 text-sm dark:border-white/10"
              >
                <div className="flex items-start justify-between">
                  <p className="font-medium">{address.fullName}</p>
                  {address.isDefault && (
                    <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
                      Standard
                    </span>
                  )}
                </div>
                <p className="mt-1 text-neutral-500">
                  {address.line1}
                  {address.line2 && `, ${address.line2}`}
                  <br />
                  {address.postalCode} {address.city}
                  <br />
                  {address.country}
                </p>
                <div className="mt-3 flex gap-3 text-xs">
                  {!address.isDefault && (
                    <form action={setDefaultAddress.bind(null, address.id)}>
                      <button className="text-indigo-600 hover:underline">Als Standard festlegen</button>
                    </form>
                  )}
                  <form action={deleteAddress.bind(null, address.id)}>
                    <button className="text-red-600 hover:underline">Löschen</button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-lg font-semibold">Neue Adresse hinzufügen</h2>
        <form action={createAddress} className="mt-3 grid gap-3 sm:grid-cols-2">
          <input
            name="fullName"
            required
            placeholder="Vollständiger Name"
            className="rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 sm:col-span-2 dark:border-neutral-700 dark:bg-neutral-900"
          />
          <input
            name="line1"
            required
            placeholder="Straße und Hausnummer"
            className="rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 sm:col-span-2 dark:border-neutral-700 dark:bg-neutral-900"
          />
          <input
            name="line2"
            placeholder="Adresszusatz (optional)"
            className="rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 sm:col-span-2 dark:border-neutral-700 dark:bg-neutral-900"
          />
          <input
            name="city"
            required
            placeholder="Stadt"
            className="rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-neutral-700 dark:bg-neutral-900"
          />
          <input
            name="postalCode"
            required
            placeholder="Postleitzahl"
            className="rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-neutral-700 dark:bg-neutral-900"
          />
          <input
            name="country"
            required
            defaultValue="Deutschland"
            placeholder="Land"
            className="rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-neutral-700 dark:bg-neutral-900"
          />
          <input
            name="phone"
            placeholder="Telefon (optional)"
            className="rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-neutral-700 dark:bg-neutral-900"
          />
          <button className="mt-1 w-fit rounded-full bg-neutral-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-neutral-700 sm:col-span-2 dark:bg-white dark:text-neutral-900">
            Adresse speichern
          </button>
        </form>
      </section>
    </div>
  );
}
