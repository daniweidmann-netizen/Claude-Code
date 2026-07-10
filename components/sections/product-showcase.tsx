import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { TiltCard } from "@/components/motion/tilt-card";

const PRODUCTS = [
  {
    name: "Solace",
    category: "Chronograph",
    price: "€4,200",
    gradient: "from-[#3a2f5c] via-[#6d5bd0] to-[#0a0a0c]",
  },
  {
    name: "Meridian",
    category: "Writing Instrument",
    price: "€890",
    gradient: "from-[#5c3a2f] via-[#d0a15b] to-[#0a0a0c]",
  },
  {
    name: "Vantage",
    category: "Travel Case",
    price: "€2,650",
    gradient: "from-[#2f4a5c] via-[#4fb8c9] to-[#0a0a0c]",
  },
  {
    name: "Lumen",
    category: "Desk Object",
    price: "€1,180",
    gradient: "from-[#5c2f45] via-[#d0699a] to-[#0a0a0c]",
  },
] as const;

export function ProductShowcase() {
  return (
    <section id="collection" className="relative px-6 py-32 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <Reveal>
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.3em] text-gold-300">
              The Collection
            </p>
            <h2 className="max-w-lg font-display text-4xl font-light leading-[1.05] text-mist-50 sm:text-5xl">
              Four objects. No compromises.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="max-w-xs text-sm leading-relaxed text-mist-400">
              Every piece is developed over months, produced in limited runs,
              and finished entirely by hand.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {PRODUCTS.map((product, i) => (
            <Reveal key={product.name} delay={i * 0.08}>
              <TiltCard className="glass-panel h-full rounded-[28px] p-3">
                <div
                  className={`relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-[20px] bg-gradient-to-br ${product.gradient}`}
                >
                  <div className="bg-noise absolute inset-0 opacity-[0.08] mix-blend-overlay" />
                  <div className="h-24 w-24 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm sm:h-32 sm:w-32" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                </div>

                <div className="flex items-start justify-between px-3 pb-2 pt-5">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-mist-400">
                      {product.category}
                    </p>
                    <h3 className="mt-1.5 font-display text-2xl font-light text-mist-50">
                      {product.name}
                    </h3>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <span className="text-sm text-mist-200">{product.price}</span>
                    <button
                      type="button"
                      aria-label={`View ${product.name}`}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-mist-200 transition-all duration-300 group-hover:border-gold-300/50 group-hover:text-gold-300"
                    >
                      <ArrowUpRight size={16} />
                    </button>
                  </div>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
