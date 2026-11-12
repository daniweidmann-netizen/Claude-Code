import { ritual } from "@/content/copy";
import { PlaceholderMedia } from "@/components/PlaceholderMedia";
import { Moon } from "@/components/Moon";

export function Ritual() {
  return (
    <section id="ritual" aria-labelledby="ritual-title" className="relative isolate overflow-hidden bg-midnight transition-colors duration-1000 webgl:bg-transparent py-[clamp(6rem,12vw,11rem)]">
      <div className="wrap">
        <p className="t-caps chapter-index text-lavender" data-n="05">
          <span className="rule" />
          {ritual.index}
        </p>

        <div className="relative mt-10">
          <PlaceholderMedia id="HF-05" label="Lifestyle · Schlafzimmer" badge="top" className="webgl:!bg-[linear-gradient(180deg,rgba(13,16,48,0.35),rgba(5,6,15,0.15))] webgl:ring-1 webgl:ring-lavender/10 aspect-[4/5] rounded-sm sm:aspect-[16/9] lg:aspect-[21/9]">
            {/* window + moonlight */}
            <div className="absolute right-[10%] top-[12%] h-[58%] w-[26%] webgl:hidden rounded-t-full border border-lavender/15 bg-[linear-gradient(180deg,#1e116188,#0d103044)]">
              <Moon className="absolute left-1/2 top-[14%] w-[60%] -translate-x-1/2" />
            </div>
            {/* the single warm light on the site */}
            <div className="absolute bottom-[-20%] left-[8%] h-[80%] w-[50%] rounded-full bg-[radial-gradient(closest-side,#e3a26055,#e3a26014_60%,transparent)]" />
            <div className="absolute left-[30%] top-[46%] h-[56%] w-[34%] -translate-x-1/2 -translate-y-1/2 sm:left-[52%] sm:top-1/2 sm:h-[74%] sm:w-[22%]" data-stage="ritual" data-stage-fit="0.9" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,#05060fdd)]" />
          </PlaceholderMedia>
          <h2 id="ritual-title" className="t-display absolute bottom-[8%] left-[5%] max-w-[12ch]" data-reveal="lines">
            {ritual.title}
          </h2>
        </div>

        <div className="mt-[clamp(4rem,8vw,7rem)] grid gap-14 lg:grid-cols-12 lg:gap-6">
          <blockquote className="t-subtitle max-w-[22ch] lg:col-span-5" data-reveal="lines">
            „{ritual.text}“
          </blockquote>
          <ol className="grid gap-px overflow-hidden rounded-sm bg-ivory/10 sm:grid-cols-3 lg:col-span-7">
            {ritual.steps.map((s, i) => (
              <li key={s.n} className="flex min-h-[220px] flex-col justify-between bg-midnight p-6 sm:p-7" data-reveal="fade" data-reveal-delay={i * 0.12}>
                <span className="t-display text-[3.25rem] italic text-lavender/80">{s.n}</span>
                <div>
                  <p className="t-caps">{s.t}</p>
                  <p className="t-small mt-2 text-ivory/60">{s.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
