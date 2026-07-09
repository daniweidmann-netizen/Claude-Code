"use client";

import { useState } from "react";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";

type Item = {
  id: string;
  name: string;
  image?: string;
  price: number;
  quantity: number;
};

const SHIPPING_AMOUNT = 499;
const FREE_SHIPPING_THRESHOLD = 5000;

export default function CheckoutForm({
  items,
  subtotal,
  defaultEmail,
}: {
  items: Item[];
  subtotal: number;
  defaultEmail: string;
}) {
  const [email, setEmail] = useState(defaultEmail);
  const [fullName, setFullName] = useState("");
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("Deutschland");
  const [phone, setPhone] = useState("");

  const [discountInput, setDiscountInput] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<{
    code: string;
    discountAmount: number;
  } | null>(null);
  const [discountError, setDiscountError] = useState("");
  const [discountLoading, setDiscountLoading] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const discountAmount = appliedDiscount?.discountAmount ?? 0;
  const shippingAmount = subtotal - discountAmount >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_AMOUNT;
  const total = Math.max(0, subtotal - discountAmount) + shippingAmount;

  async function applyDiscount() {
    if (!discountInput.trim()) return;
    setDiscountLoading(true);
    setDiscountError("");
    try {
      const res = await fetch("/api/discount/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: discountInput }),
      });
      const data = await res.json();
      if (!res.ok) {
        setDiscountError(data.error ?? "Rabattcode ungültig");
        setAppliedDiscount(null);
        return;
      }
      setAppliedDiscount({ code: data.code, discountAmount: data.discountAmount });
    } finally {
      setDiscountLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          address: {
            fullName,
            line1,
            line2: line2 || undefined,
            city,
            postalCode,
            country,
            phone: phone || undefined,
          },
          discountCode: appliedDiscount?.code,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Es ist ein Fehler aufgetreten.");
        return;
      }

      window.location.href = data.url;
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 grid gap-10 lg:grid-cols-3">
      <div className="flex flex-col gap-6 lg:col-span-2">
        <section>
          <h2 className="text-lg font-semibold">Kontakt</h2>
          <input
            type="email"
            required
            placeholder="E-Mail-Adresse"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-3 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-neutral-700 dark:bg-neutral-900"
          />
        </section>

        <section>
          <h2 className="text-lg font-semibold">Lieferadresse</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <input
              required
              placeholder="Vollständiger Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 sm:col-span-2 dark:border-neutral-700 dark:bg-neutral-900"
            />
            <input
              required
              placeholder="Straße und Hausnummer"
              value={line1}
              onChange={(e) => setLine1(e.target.value)}
              className="rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 sm:col-span-2 dark:border-neutral-700 dark:bg-neutral-900"
            />
            <input
              placeholder="Adresszusatz (optional)"
              value={line2}
              onChange={(e) => setLine2(e.target.value)}
              className="rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 sm:col-span-2 dark:border-neutral-700 dark:bg-neutral-900"
            />
            <input
              required
              placeholder="Stadt"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-neutral-700 dark:bg-neutral-900"
            />
            <input
              required
              placeholder="Postleitzahl"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              className="rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-neutral-700 dark:bg-neutral-900"
            />
            <input
              required
              placeholder="Land"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-neutral-700 dark:bg-neutral-900"
            />
            <input
              placeholder="Telefon (optional)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-neutral-700 dark:bg-neutral-900"
            />
          </div>
        </section>
      </div>

      <div className="h-fit rounded-2xl border border-black/5 p-6 dark:border-white/10">
        <h2 className="text-lg font-semibold">Bestellübersicht</h2>

        <div className="mt-4 flex flex-col gap-3">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-800">
                {item.image && (
                  <Image src={item.image} alt={item.name} fill sizes="48px" className="object-cover" />
                )}
              </div>
              <div className="flex-1 text-sm">
                <p className="line-clamp-1 font-medium">{item.name}</p>
                <p className="text-neutral-500">Menge: {item.quantity}</p>
              </div>
              <span className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 flex gap-2">
          <input
            placeholder="Rabattcode"
            value={discountInput}
            onChange={(e) => setDiscountInput(e.target.value)}
            className="flex-1 rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-neutral-700 dark:bg-neutral-900"
          />
          <button
            type="button"
            onClick={applyDiscount}
            disabled={discountLoading}
            className="rounded-lg border border-neutral-900 px-4 py-2 text-sm font-medium hover:bg-neutral-900 hover:text-white disabled:opacity-60 dark:border-white dark:hover:bg-white dark:hover:text-neutral-900"
          >
            Anwenden
          </button>
        </div>
        {discountError && <p className="mt-2 text-xs text-red-600">{discountError}</p>}
        {appliedDiscount && (
          <p className="mt-2 text-xs text-green-600">
            Code &quot;{appliedDiscount.code}&quot; angewendet.
          </p>
        )}

        <div className="mt-4 space-y-2 border-t border-black/5 pt-4 text-sm dark:border-white/10">
          <div className="flex justify-between">
            <span className="text-neutral-500">Zwischensumme</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Rabatt</span>
              <span>-{formatPrice(discountAmount)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-neutral-500">Versand</span>
            <span>{shippingAmount === 0 ? "Kostenlos" : formatPrice(shippingAmount)}</span>
          </div>
          <div className="flex justify-between border-t border-black/5 pt-2 text-base font-semibold dark:border-white/10">
            <span>Gesamt</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-neutral-700 disabled:opacity-60 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
        >
          {loading ? "Wird verarbeitet…" : "Kostenpflichtig bestellen"}
        </button>
      </div>
    </form>
  );
}
