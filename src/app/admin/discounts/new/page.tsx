import type { Metadata } from "next";
import { createDiscount } from "../actions";

export const metadata: Metadata = { title: "Neuer Rabattcode" };

export default function NewDiscountPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Neuer Rabattcode</h1>
      <form action={createDiscount} className="mt-6 grid max-w-xl gap-4">
        <div>
          <label className="text-sm font-medium">Code</label>
          <input
            name="code"
            required
            placeholder="SOMMER20"
            className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-neutral-700 dark:bg-neutral-900"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Typ</label>
            <select
              name="type"
              defaultValue="PERCENTAGE"
              className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-neutral-700 dark:bg-neutral-900"
            >
              <option value="PERCENTAGE">Prozentual (%)</option>
              <option value="FIXED">Fester Betrag (€)</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Wert</label>
            <input
              name="value"
              type="number"
              step="0.01"
              min="0"
              required
              placeholder="z.B. 10 oder 5.00"
              className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-neutral-700 dark:bg-neutral-900"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Max. Einlösungen (optional)</label>
            <input
              name="maxRedemptions"
              type="number"
              min="1"
              className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-neutral-700 dark:bg-neutral-900"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Mindestbestellwert € (optional)</label>
            <input
              name="minSubtotal"
              type="number"
              step="0.01"
              min="0"
              className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-neutral-700 dark:bg-neutral-900"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Ablaufdatum (optional)</label>
          <input
            name="expiresAt"
            type="date"
            className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-neutral-700 dark:bg-neutral-900"
          />
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="active" defaultChecked />
          Aktiv
        </label>

        <button
          type="submit"
          className="mt-2 w-fit rounded-full bg-neutral-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-neutral-700 dark:bg-white dark:text-neutral-900"
        >
          Rabattcode erstellen
        </button>
      </form>
    </div>
  );
}
