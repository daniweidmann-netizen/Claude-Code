import type { ProductResult } from "@/commerce/types";
import { formatMoney } from "@/commerce/format";
import { finale } from "@/content/copy";
import { Moon } from "@/components/Moon";
import { NightSky } from "@/components/NightSky";
import { AddToCart } from "@/components/AddToCart";

export function Finale({ result }: { result: ProductResult }) {
  const v = result.product?.variant ?? null;
  const price = v ? ` — ${formatMoney(v.price)}` : "";
  return (
    <section aria-labelledby="finale-title" id="finale" className="relative isolate overflow-hidden bg-midnight transition-colors duration-1000 webgl:bg-transparent pb-[clamp(6rem,12vw,10rem)] pt-[clamp(4rem,8vw,6rem)]">
      <NightSky className="absolute inset-0 -z-10 h-full w-full webgl:hidden" count={80} seed={41} />
      <div className="wrap flex flex-col items-center text-center">
        <div className="relative w-[min(70vw,460px)] aspect-square" data-stage="finale" data-stage-fit="0.78">
          <Moon className="absolute inset-0 transition-opacity duration-700 webgl:opacity-0" />
        </div>
        <h2 id="finale-title" className="t-display -mt-[min(14vw,90px)] webgl:mt-2">
          <span className="block" data-reveal="lines">{finale.title[0]}</span>
          <span className="block italic text-lavender" data-reveal="lines" data-reveal-delay="0.1">{finale.title[1]}</span>
        </h2>
        <div className="mt-12 w-full max-w-[420px]" data-reveal="fade">
          <AddToCart
            variantId={v?.id ?? null}
            available={Boolean(v?.availableForSale)}
            connected={result.source === "shopify"}
            label={`${finale.cta}${price}`}
            compact
          />
        </div>
      </div>
    </section>
  );
}
