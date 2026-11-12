import Image from "next/image";
import type { ProductResult } from "@/commerce/types";
import { formatMoney } from "@/commerce/format";
import { product as copy, announcement } from "@/content/copy";
import { AddToCart } from "@/components/AddToCart";
import { BadgeIcon } from "@/components/BadgeIcon";
import { PreviewBadge } from "@/components/PreviewBadge";
import { Moon } from "@/components/Moon";

export function ProductReveal({ result }: { result: ProductResult }) {
  const p = result.product;
  const v = p?.variant ?? null;
  const connected = result.source === "shopify";
  const img = p?.image;

  return (
    <section id="produkt" aria-labelledby="product-title" className="relative isolate overflow-hidden bg-night transition-colors duration-1000 webgl:bg-transparent py-[clamp(6rem,11vw,10rem)]">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(70%_60%_at_25%_45%,#3c296599,transparent_70%)] webgl:hidden" />
      <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-6">
        {/* Stage */}
        <div className="relative lg:col-span-6 lg:col-start-1">
          <Moon className="absolute -left-[12%] -top-[10%] w-[48%] opacity-70 webgl:hidden" />
          <div className="relative mx-auto aspect-[4/5] w-full max-w-[640px] touch-pan-y select-none webgl:cursor-grab webgl:active:cursor-grabbing" data-stage="product" data-stage-fit="0.84" data-drag="pouch">
          <div className="arch absolute inset-0 webgl:hidden">
            <Image
              src={img?.url ?? "/assets/images/posters/packshot-temp-b.jpg"}
              alt={img?.altText ?? "Vireli Night Gummies Mixed Berry – Beutel"}
              fill
              sizes="(min-width: 1024px) 46vw, 92vw"
              className="object-cover object-[50%_45%]"
            />
          </div>
          <p className="t-caps pointer-events-none absolute inset-x-0 bottom-2 hidden text-center text-[10px] text-ivory/50 webgl:block">← Ziehen zum Drehen →</p>
          </div>
          {!img && (
            <PreviewBadge className="absolute bottom-4 left-4">
              <span className="webgl:hidden">Temporärer Packshot</span>
              <span className="hidden webgl:inline">Provisorisches 3D-Modell · Textur aus Shop-Foto</span>
            </PreviewBadge>
          )}
        </div>

        {/* Purchase panel */}
        <div className="lg:col-span-5 lg:col-start-8 lg:self-center">
          <p className="t-caps chapter-index text-lavender" data-n="04">
            <span className="rule" />
            {copy.index}
          </p>
          <p className="t-caps mt-10 text-ivory/50">{copy.eyebrow}</p>
          <h2 id="product-title" className="t-title mt-4" data-reveal="lines">
            {p?.title ?? "Vireli Night Gummies"}
          </h2>

          <div className="mt-8 flex flex-wrap items-baseline gap-x-4 gap-y-2">
            {v ? (
              <>
                <p className="t-subtitle t-num">{formatMoney(v.price)}</p>
                {v.compareAtPrice && <p className="t-num text-ivory/45 line-through">{formatMoney(v.compareAtPrice)}</p>}
                <p className="t-small text-ivory/55">{copy.taxNote}</p>
              </>
            ) : (
              <p className="t-small text-ivory/60">{result.source === "unavailable" ? result.reason : ""}</p>
            )}
            {result.source === "preview" && <PreviewBadge>Vorschau-Daten · Shopify nicht verbunden</PreviewBadge>}
          </div>

          <dl className="mt-10 grid grid-cols-3 border-y border-ivory/10">
            {copy.facts.map((f) => (
              <div key={f.k} className="border-r border-ivory/10 py-5 pr-3 last:border-r-0 [&:not(:first-child)]:pl-4">
                <dt className="t-caps text-[10px] text-ivory/45">{f.k}</dt>
                <dd className="mt-2 text-[15px] leading-snug">{f.v}</dd>
              </div>
            ))}
          </dl>

          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
            {copy.badges.map((b) => (
              <li key={b} className="t-caps flex items-center gap-2.5 text-[10px] text-ivory/75">
                <BadgeIcon kind={b} className="h-8 w-8 text-lavender" />
                {b}
              </li>
            ))}
          </ul>

          <div className="mt-10" id="buy-primary">
            <AddToCart variantId={v?.id ?? null} available={Boolean(v?.availableForSale)} connected={connected} />
          </div>
          <p className="t-small mt-4 text-ivory/50">{announcement}</p>

          <div className="mt-10">
            {(p?.info ?? []).filter((f) => f.key !== "claims_footnote").map((f) => (
              <details key={f.key} className="group border-t border-ivory/10 last:border-b">
                <summary className="flex min-h-14 items-center justify-between py-4">
                  <span className="t-caps">{f.label}</span>
                  <span className="acc-icon text-xl font-light leading-none text-lavender transition-transform duration-500">+</span>
                </summary>
                <div className="pb-6 text-[15px] leading-relaxed text-ivory/70">
                  {f.value ? <p className="whitespace-pre-line">{f.value}</p> : <PreviewBadge>Etikett-Text ausstehend · Shopify-Metafeld vireli.{f.key}</PreviewBadge>}
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
