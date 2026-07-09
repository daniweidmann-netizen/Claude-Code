"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function ProductGallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const [active, setActive] = useState(0);
  const displayImages = images.length > 0 ? images : [];

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-800">
        {displayImages[active] ? (
          <Image
            src={displayImages[active]}
            alt={name}
            fill
            priority
            sizes="(min-width: 1024px) 40vw, 90vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-neutral-400">
            Kein Bild verfügbar
          </div>
        )}
      </div>
      {displayImages.length > 1 && (
        <div className="mt-4 grid grid-cols-5 gap-3">
          {displayImages.map((img, i) => (
            <button
              key={img + i}
              onClick={() => setActive(i)}
              className={cn(
                "relative aspect-square overflow-hidden rounded-lg border-2",
                i === active ? "border-indigo-600" : "border-transparent"
              )}
            >
              <Image src={img} alt={`${name} ${i + 1}`} fill sizes="20vw" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
