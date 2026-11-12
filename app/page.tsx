import { getProduct } from "@/commerce/product";
import { formatMoney } from "@/commerce/format";
import { Hero } from "@/chapters/Hero";
import { Berries } from "@/chapters/Berries";
import { Formula } from "@/chapters/Formula";
import { ProductReveal } from "@/chapters/ProductReveal";
import { Ritual } from "@/chapters/Ritual";
import { Finale } from "@/chapters/Finale";
import { StickyBuy } from "@/components/StickyBuy";

export default async function Home() {
  const result = await getProduct();
  const footnote = result.product?.info.find((f) => f.key === "claims_footnote")?.value ?? null;
  const v = result.product?.variant;

  return (
    <>
      <Hero />
      <Berries />
      <Formula footnote={footnote} />
      <ProductReveal result={result} />
      <Ritual />
      <Finale result={result} />
      <StickyBuy title={result.product?.title ?? "Vireli Night Gummies"} price={v ? formatMoney(v.price) : null} />
    </>
  );
}
