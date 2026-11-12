import { formula } from "@/content/copy";
import { IngredientArt } from "@/components/IngredientArt";
import { PreviewBadge } from "@/components/PreviewBadge";

export function Formula({ footnote }: { footnote: string | null }) {
  return (
    <section id="formel" data-header="light" aria-labelledby="formula-title" className="relative bg-ivory py-[clamp(6rem,12vw,11rem)] text-ink [color-scheme:light]">
      <div className="wrap">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-7">
            <p className="t-caps chapter-index text-aubergine" data-n="03">
              <span className="rule" />
              {formula.index}
            </p>
            <h2 id="formula-title" className="t-display mt-8" data-reveal="lines">
              {formula.title}
            </h2>
          </div>
          <p className="t-lead max-w-[28rem] self-end text-ink/70 lg:col-span-4 lg:col-start-9" data-reveal="fade">
            {formula.intro}
          </p>
        </div>

        <ol className="mt-[clamp(4rem,8vw,7rem)]">
          {formula.items.map((it, i) => (
            <li key={it.key} className="group grid grid-cols-[auto_1fr] gap-x-5 gap-y-5 border-t border-ink/15 py-8 last:border-b sm:gap-x-8 lg:grid-cols-12 lg:items-center lg:gap-6 lg:py-10">
              <span className="t-caps t-num pt-2 text-aubergine lg:col-span-1 lg:self-start">0{i + 1}</span>
              <h3 className="t-title lg:col-span-5" data-reveal="lines">
                {it.name}
              </h3>
              <p className="t-lead col-span-2 max-w-[24rem] text-ink/75 lg:col-span-3 lg:col-start-7" data-reveal="fade">
                {it.text}
                {it.star && <sup className="ml-0.5 text-aubergine">*</sup>}
              </p>
              <div className="col-span-2 aspect-[16/10] overflow-hidden rounded-sm transition-[border-radius] duration-700 ease-[var(--ease-vireli-out)] group-hover:rounded-[2rem] sm:aspect-[21/9] lg:col-span-3 lg:col-start-10 lg:aspect-square">
                <IngredientArt kind={it.key} />
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-8 flex flex-wrap items-center gap-3 text-ink/60">
          <p className="t-small">* {footnote ?? "Fussnote gemäss Etikett"}</p>
          {!footnote && <PreviewBadge>Fussnotentext ausstehend</PreviewBadge>}
        </div>
      </div>
    </section>
  );
}
