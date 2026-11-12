import Image from "next/image";
import { hero } from "@/content/copy";
import { NightSky } from "@/components/NightSky";
import { Moon } from "@/components/Moon";
import { Hills } from "@/components/Hills";
import { BadgeIcon } from "@/components/BadgeIcon";
import { PreviewBadge } from "@/components/PreviewBadge";

export function Hero() {
  return (
    <section id="nacht" aria-labelledby="hero-title" className="relative isolate min-h-[100svh] overflow-hidden bg-midnight webgl:bg-transparent">
      {/* Sky */}
      <div className="absolute inset-0 -z-10 transition-opacity duration-[1500ms] webgl:opacity-0 bg-[radial-gradient(120%_90%_at_75%_10%,#1e1161_0%,#0d1030_38%,#05060f_72%)]" />
      <NightSky className="absolute inset-0 -z-10 h-full w-full transition-opacity duration-1000 webgl:opacity-0" count={110} />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-[38vh] min-h-[220px]" data-parallax="0.12">
        <Hills className="h-full w-full" />
      </div>

      <div className="wrap relative grid min-h-[100svh] grid-cols-1 content-end gap-y-6 pb-10 pt-[calc(var(--header-h)+var(--bar-h)+1.5rem)] lg:grid-cols-12 lg:content-center lg:gap-x-6 lg:pb-24">
        {/* Visual: arch portal + eclipse moon */}
        <div className="relative col-span-1 mr-0 ml-auto w-[min(54vw,380px)] sm:mx-auto lg:order-2 lg:col-span-5 lg:col-start-8 lg:mx-0 lg:w-full lg:max-w-[520px] lg:justify-self-end">
          <Moon className="absolute transition-opacity duration-700 webgl:opacity-0 -left-[46%] -top-[6%] w-[72%] opacity-90 sm:-left-auto sm:-right-[22%] sm:-top-[18%] sm:w-[78%] lg:-right-[28%] lg:-top-[20%]" />
          <div className="relative aspect-[3/4] w-full" data-stage="hero" data-stage-fit="0.9">
          <div className="absolute inset-0" data-reveal="fade" data-reveal-delay="0.3">
          <div className="arch absolute inset-0 shadow-[0_40px_120px_-20px_rgba(87,68,211,0.45)] transition-opacity duration-[1200ms] webgl:opacity-0">
            <Image
              src="/assets/images/posters/packshot-temp-b.jpg"
              alt="Vireli Night Gummies Mixed Berry – Beutel mit Beeren und Gummies bei Nacht"
              fill
              preload
              loading="eager"
              fetchPriority="high"
              sizes="(min-width: 1024px) 36vw, 58vw"
              className="object-cover object-[50%_40%]"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgba(5,6,15,0.55))]" />
          </div>
          </div>
          </div>
          <div className="absolute -bottom-3 left-1/2 hidden -translate-x-1/2 lg:block">
            <PreviewBadge className="whitespace-nowrap">
              <span className="webgl:hidden">Temporärer Packshot</span>
              <span className="hidden webgl:inline">Provisorisches 3D-Modell</span>
            </PreviewBadge>
          </div>
        </div>

        {/* Copy */}
        <div className="relative z-10 col-span-1 -mt-[20vw] sm:mt-0 lg:order-1 lg:col-span-7 lg:row-start-1">
          <p className="t-caps chapter-index mb-6 text-lavender lg:mb-10" data-n="01">
            <span className="rule" />
            {hero.index}
          </p>
          <h1 id="hero-title" className="t-hero">
            {hero.lines.map((l, i) => (
              <span key={l} className={`block ${i === 2 ? "italic text-lavender" : ""}`} data-reveal="lines" data-reveal-delay={0.15 + i * 0.12}>
                {l}
              </span>
            ))}
          </h1>
          <div className="mt-8 grid gap-8 lg:mt-12 lg:grid-cols-[minmax(0,30rem)_auto] lg:items-end">
            <p className="t-lead max-w-[30rem] text-ivory/75" data-reveal="fade" data-reveal-delay="0.6">
              {hero.sub}
            </p>
          </div>
          <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-center lg:mt-10" data-reveal="fade" data-reveal-delay="0.75">
            <a href="#produkt" className="btn btn-primary self-start">
              {hero.cta} <span className="btn-arrow">→</span>
            </a>
            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-ivory/70">
              {hero.badges.map((b) => (
                <li key={b} className="t-caps flex items-center gap-2 text-[10px]">
                  <BadgeIcon kind={b} className="h-6 w-6 text-lavender" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <a href="#beeren" className="absolute bottom-8 right-[var(--gutter)] hidden items-center gap-4 text-ivory/60 lg:flex" aria-label="Weiter scrollen">
        <span className="t-caps [writing-mode:vertical-rl]">Scroll</span>
        <span className="scroll-cue block h-16 w-px bg-ivory/15" />
      </a>
    </section>
  );
}
