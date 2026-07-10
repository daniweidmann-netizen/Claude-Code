import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import ProjectCard from "@/components/portfolio/ProjectCard";
import { projects } from "@/lib/data/projects";

export default function Portfolio() {
  const featured = projects.slice(0, 4);

  return (
    <section id="arbeiten" className="relative border-t border-[var(--color-border)] py-32">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Unsere Projekte"
            title="Case Studies statt Portfoliobilder."
            description="Jedes Projekt ist eine eigene Geschichte – von der ersten Skizze bis zum messbaren Ergebnis."
            className="max-w-2xl"
          />
          <Reveal delay={0.2}>
            <Link
              href="/arbeiten"
              data-cursor="hover"
              className="group inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-[var(--color-border-strong)] px-6 py-3 text-sm font-medium transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
            >
              Alle Projekte ansehen
              <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>
          </Reveal>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {featured.map((project, i) => (
            <ProjectCard key={project.slug} project={project} index={i} featured={i === 0} />
          ))}
        </div>
      </div>
    </section>
  );
}
