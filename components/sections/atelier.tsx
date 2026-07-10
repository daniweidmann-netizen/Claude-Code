import { Reveal } from "@/components/motion/reveal";

const STATS = [
  { value: "240+", label: "Hours per piece" },
  { value: "12", label: "Master artisans" },
  { value: "6", label: "Countries sourced" },
  { value: "0", label: "Compromises made" },
];

export function Atelier() {
  return (
    <section id="atelier" className="relative overflow-hidden px-6 py-32 sm:px-10">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute left-1/2 top-1/2 h-[60vh] w-[60vh] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-[130px]"
          style={{
            background: "radial-gradient(circle, var(--color-aurora-violet), transparent 70%)",
          }}
        />
      </div>

      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-12">
          <Reveal>
            <p className="mb-6 text-xs font-medium uppercase tracking-[0.3em] text-gold-300">
              The Atelier
            </p>
            <h2 className="max-w-md font-display text-4xl font-light leading-[1.05] text-mist-50 sm:text-5xl">
              Built by hand, in small rooms, by people who care too much.
            </h2>
            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-mist-400">
              Our atelier operates less like a factory and more like a studio.
              Every object passes through the same hands from raw material to
              final polish — accountability that mass production can&apos;t
              replicate.
            </p>
          </Reveal>

          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/5">
            {STATS.map((stat, i) => (
              <Reveal
                key={stat.label}
                delay={i * 0.08}
                className="glass-panel flex flex-col justify-center gap-2 border-0 p-8 sm:p-10"
              >
                <span className="text-gradient-gold font-display text-4xl font-light sm:text-5xl">
                  {stat.value}
                </span>
                <span className="text-xs uppercase tracking-[0.2em] text-mist-400">
                  {stat.label}
                </span>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
