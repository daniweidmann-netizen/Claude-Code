"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

type Category = { id: string; name: string; slug: string };

export default function MobileNav({ categories }: { categories: Category[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(true)}
        aria-label="Menü öffnen"
        className="rounded-full p-2 text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
      >
        <Menu className="h-5 w-5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/40" onClick={() => setOpen(false)}>
          <div
            className="h-full w-72 bg-white p-6 dark:bg-neutral-950"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <span className="text-lg font-bold">Menü</span>
              <button onClick={() => setOpen(false)} aria-label="Schließen">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-col gap-4 text-sm font-medium">
              <Link href="/products" onClick={() => setOpen(false)}>
                Alle Produkte
              </Link>
              {categories.map((c) => (
                <Link
                  key={c.id}
                  href={`/products?category=${c.slug}`}
                  onClick={() => setOpen(false)}
                >
                  {c.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
