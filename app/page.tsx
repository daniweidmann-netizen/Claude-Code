import { Hero } from "@/components/sections/hero";
import { ProductShowcase } from "@/components/sections/product-showcase";
import { Philosophy } from "@/components/sections/philosophy";
import { Atelier } from "@/components/sections/atelier";

export default function Home() {
  return (
    <>
      <Hero />
      <ProductShowcase />
      <Philosophy />
      <Atelier />
    </>
  );
}
