import { berries } from "@/content/copy";
import { NightSky } from "@/components/NightSky";
import { PlaceholderMedia } from "@/components/PlaceholderMedia";
import { Hills } from "@/components/Hills";

const NODES = [
  { x: 14, y: 30, c: "#e0405a", name: "Erdbeere" },
  { x: 41, y: 70, c: "#d6517a", name: "Himbeere" },
  { x: 66, y: 22, c: "#4b2a5c", name: "Brombeere" },
  { x: 88, y: 62, c: "#4d5bd1", name: "Heidelbeere" },
];

export function Berries() {
  return (
    <section id="beeren" aria-labelledby="berries-title" className="relative isolate overflow-hidden bg-midnight py-[clamp(6rem,14vw,13rem)]">
      <NightSky className="absolute inset-0 -z-10 h-full w-full opacity-60" count={60} seed={23} />
      <div className="wrap">
        <p className="t-caps chapter-index text-lavender" data-n="02">
          <span className="rule" />
          {berries.index}
        </p>

        <h2 id="berries-title" className="sr-only">{berries.title}</h2>
        <div aria-hidden="true" className="relative mt-10 select-none">
          <p className="t-display text-[clamp(4.5rem,24vw,19rem)] leading-[0.82]" data-reveal="lines">Mixed</p>
          <p className="t-display text-right text-[clamp(4.5rem,24vw,19rem)] italic leading-[0.82] text-lavender" data-reveal="lines" data-reveal-delay="0.12">
            Berry
          </p>

          {/* Constellation of the four berries on the pack */}
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
            <polyline
              points={NODES.map((n) => `${n.x},${n.y}`).join(" ")}
              fill="none"
              stroke="#c8b6ee"
              strokeOpacity="0.35"
              strokeWidth="1"
              strokeDasharray="2 4"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          {NODES.map((n) => (
            <span key={n.name} className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2" style={{ left: `${n.x}%`, top: `${n.y}%` }}>
              <span className="relative block h-3 w-3 rounded-full" style={{ background: n.c, boxShadow: `0 0 0 6px ${n.c}22, 0 0 24px 4px ${n.c}88` }} />
              <span className="t-caps hidden whitespace-nowrap text-[10px] text-ivory/70 sm:block">{n.name}</span>
            </span>
          ))}
        </div>

        <div className="mt-[clamp(4rem,9vw,8rem)] grid gap-10 lg:grid-cols-12 lg:gap-6">
          <PlaceholderMedia id="HF-02" label="Berry World" className="aspect-[4/5] rounded-sm sm:aspect-[16/9] lg:col-span-8 lg:aspect-[21/10]">
            <div className="absolute inset-x-0 bottom-0 h-1/2 opacity-80"><Hills className="h-full w-full" /></div>
            <div className="absolute inset-0 grid place-items-center">
              <div className="flex gap-[6%] opacity-90">
                {NODES.map((n, i) => (
                  <span
                    key={n.name}
                    className="block rounded-full blur-[1px]"
                    style={{
                      width: `clamp(2.5rem, ${6 + (i % 2) * 3}vw, 7rem)`,
                      aspectRatio: "1",
                      background: `radial-gradient(circle at 35% 30%, #ffffff55, ${n.c} 40%, #05060f 100%)`,
                      transform: `translateY(${i % 2 ? 18 : -12}%)`,
                    }}
                  />
                ))}
              </div>
            </div>
          </PlaceholderMedia>
          <div className="flex flex-col justify-end lg:col-span-3 lg:col-start-10">
            <ul className="t-caps flex flex-col text-ivory/80">
              {berries.names.map((b, i) => (
                <li key={b} className="flex items-baseline justify-between border-t border-ivory/10 py-4 last:border-b">
                  <span>{b}</span>
                  <span className="t-num text-lavender/60">0{i + 1}</span>
                </li>
              ))}
            </ul>
            <p className="t-small mt-6 text-ivory/55">{berries.caption}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
