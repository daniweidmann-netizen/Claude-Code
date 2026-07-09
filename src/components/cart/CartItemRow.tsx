"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";

type Props = {
  id: string;
  name: string;
  slug: string;
  image?: string;
  price: number;
  quantity: number;
};

export default function CartItemRow({ id, name, slug, image, price, quantity }: Props) {
  const router = useRouter();
  const [qty, setQty] = useState(quantity);
  const [isPending, startTransition] = useTransition();

  function updateQuantity(next: number) {
    if (next < 1) return;
    setQty(next);
    startTransition(async () => {
      await fetch(`/api/cart/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: next }),
      });
      router.refresh();
    });
  }

  function remove() {
    startTransition(async () => {
      await fetch(`/api/cart/${id}`, { method: "DELETE" });
      router.refresh();
    });
  }

  return (
    <div className="flex items-center gap-4 border-b border-black/5 py-4 dark:border-white/10">
      <Link href={`/products/${slug}`} className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-800">
        {image && <Image src={image} alt={name} fill sizes="80px" className="object-cover" />}
      </Link>

      <div className="flex-1">
        <Link href={`/products/${slug}`} className="text-sm font-medium hover:text-indigo-600">
          {name}
        </Link>
        <p className="mt-1 text-sm text-neutral-500">{formatPrice(price)}</p>

        <div className="mt-2 flex items-center gap-3">
          <div className="flex items-center rounded-full border border-neutral-200 dark:border-neutral-700">
            <button
              onClick={() => updateQuantity(qty - 1)}
              className="px-2.5 py-1 text-neutral-600 hover:text-indigo-600 dark:text-neutral-300"
              aria-label="Menge verringern"
            >
              −
            </button>
            <span className="w-6 text-center text-sm">{qty}</span>
            <button
              onClick={() => updateQuantity(qty + 1)}
              className="px-2.5 py-1 text-neutral-600 hover:text-indigo-600 dark:text-neutral-300"
              aria-label="Menge erhöhen"
            >
              +
            </button>
          </div>

          <button
            onClick={remove}
            disabled={isPending}
            className="flex items-center gap-1 text-xs text-neutral-400 hover:text-red-600"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Entfernen
          </button>
        </div>
      </div>

      <div className="text-sm font-semibold">{formatPrice(price * qty)}</div>
    </div>
  );
}
