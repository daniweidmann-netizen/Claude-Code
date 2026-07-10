import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { getProjectBySlug, projects } from "@/lib/data/projects";
import RevealText from "@/components/ui/RevealText";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import MeshGradientThumb from "@/components/ui/MeshGradientThumb";
import MagneticButton from "@/components/ui/MagneticButton";
import BeforeAfterSlider from "@/components/portfolio/BeforeAfterSlider";
import ProjectCard from "@/components/portfolio/ProjectCard";
import { formatIndex } from "@/lib/utils";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/arbeiten/${project.slug}` },
    openGraph: {
      title: `${project.title} — ShopWerk Case Study`,
      description: project.summary,
    },
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const related = projects.filter((p) => p.slug !== project.slug).slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden pt-40 pb-20">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <Reveal>
            <Link
              href="/arbeiten"
              data-cursor="hover"
              className="mb-10 inline-flex items-center gap-2 text-sm text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-fg)]"
            >
              <ArrowLeft className="size-4" />
              Alle Projekte
            </Link>
          </Reveal>

          <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
            <div>
              <Reveal>
                <span className="mb-5 inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.3em] text-[var(--color-accent)]">
                  <span className="h-px w-8 bg-[var(--color-accent)]/60" />
                  {project.categoryLabel} · {project.year}
                </span>
              </Reveal>
              <RevealText
                text={project.title}
                as="h1"
                className="font-display max-w-3xl text-balance text-5xl font-medium leading-[1.05] tracking-tight sm:text-6xl md:text-7xl"
              />
              <Reveal delay={0.3}>
                <p className="mt-6 max-w-xl text-lg leading-relaxed text-[var(--color-fg-muted)]">
                  {project.summary}
                </p>
              </Reveal>
            </div>

            <Reveal delay={0.2}>
              <dl className="grid min-w-[16rem] grid-cols-2 gap-x-8 gap-y-6 border-l border-[var(--color-border)] pl-8">
                <div>
                  <dt className="text-xs uppercase tracking-wider text-[var(--color-fg-subtle)]">Kunde</dt>
                  <dd className="mt-1 text-sm">{project.client}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wider text-[var(--color-fg-subtle)]">Branche</dt>
                  <dd className="mt-1 text-sm">{project.industry}</dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-xs uppercase tracking-wider text-[var(--color-fg-subtle)]">Ziel</dt>
                  <dd className="mt-1 text-sm">{project.goal}</dd>
                </div>
              </dl>
            </Reveal>
          </div>
        </div>

        <Reveal delay={0.35} className="mt-16">
          <div className="mx-auto max-w-7xl px-6 sm:px-8">
            <div className="relative aspect-[16/8] w-full overflow-hidden rounded-3xl border border-[var(--color-border)]">
              <MeshGradientThumb colors={project.gradient} className="h-full w-full" />
            </div>
          </div>
        </Reveal>
      </section>

      {/* Problem / Solution */}
      <section className="border-t border-[var(--color-border)] py-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-16 px-6 sm:px-8 lg:grid-cols-2">
          <Reveal>
            <span className="font-display text-sm text-[var(--color-fg-subtle)]">01 — Problem</span>
            <h2 className="font-display mt-4 text-3xl font-medium tracking-tight sm:text-4xl">
              Die Ausgangslage
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-[var(--color-fg-muted)]">
              {project.problem}
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <span className="font-display text-sm text-[var(--color-fg-subtle)]">02 — Lösung</span>
            <h2 className="font-display mt-4 text-3xl font-medium tracking-tight sm:text-4xl">
              Unser Ansatz
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-[var(--color-fg-muted)]">
              {project.solution}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Process */}
      <section className="border-t border-[var(--color-border)] bg-[var(--color-bg-elevated)] py-24">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <SectionHeading eyebrow="Designprozess" title="Wie wir dorthin gekommen sind." />
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5">
            {project.process.map((step, i) => (
              <Reveal key={step.title} delay={i * 0.08}>
                <div className="border-t border-[var(--color-border-strong)] pt-5">
                  <span className="font-display text-sm text-[var(--color-accent)]">
                    {formatIndex(i + 1)}
                  </span>
                  <h3 className="mt-3 font-medium">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--color-fg-muted)]">
                    {step.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Colors & Typography */}
      <section className="border-t border-[var(--color-border)] py-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-16 px-6 sm:px-8 lg:grid-cols-2">
          <Reveal>
            <span className="font-display text-sm text-[var(--color-fg-subtle)]">03 — Farben</span>
            <h2 className="font-display mt-4 text-3xl font-medium tracking-tight sm:text-4xl">
              Die Farbwelt
            </h2>
            <div className="mt-8 grid grid-cols-2 gap-4">
              {project.colors.map((color) => (
                <div key={color.hex} className="overflow-hidden rounded-2xl border border-[var(--color-border)]">
                  <div className="h-24 w-full" style={{ backgroundColor: color.hex }} />
                  <div className="flex items-center justify-between px-4 py-3 text-xs">
                    <span className="text-[var(--color-fg-muted)]">{color.name}</span>
                    <span className="font-mono text-[var(--color-fg-subtle)]">{color.hex}</span>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <span className="font-display text-sm text-[var(--color-fg-subtle)]">04 — Typografie</span>
            <h2 className="font-display mt-4 text-3xl font-medium tracking-tight sm:text-4xl">
              Das Schriftsystem
            </h2>
            <div className="mt-8 space-y-6">
              <div className="rounded-2xl border border-[var(--color-border)] p-6">
                <span className="text-xs uppercase tracking-wider text-[var(--color-fg-subtle)]">
                  Display — {project.typography.display}
                </span>
                <p className="font-display mt-3 text-4xl">Aa Bb Cc</p>
              </div>
              <div className="rounded-2xl border border-[var(--color-border)] p-6">
                <span className="text-xs uppercase tracking-wider text-[var(--color-fg-subtle)]">
                  Text — {project.typography.body}
                </span>
                <p className="mt-3 text-2xl">Aa Bb Cc 0123</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Responsive design */}
      <section className="border-t border-[var(--color-border)] bg-[var(--color-bg-elevated)] py-24">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <SectionHeading eyebrow="Responsive Design" title="Auf jedem Gerät konsequent." />
          <div className="mt-16 flex flex-wrap items-end justify-center gap-10">
            <Reveal>
              <div className="h-[26rem] w-56 overflow-hidden rounded-[2rem] border-4 border-[var(--color-border-strong)] shadow-2xl">
                <MeshGradientThumb colors={project.gradient} className="h-full w-full" animate={false} />
              </div>
              <p className="mt-4 text-center text-xs text-[var(--color-fg-subtle)]">Mobile</p>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="h-80 w-[22rem] overflow-hidden rounded-2xl border-4 border-[var(--color-border-strong)] shadow-2xl">
                <MeshGradientThumb colors={project.gradient} className="h-full w-full" animate={false} />
              </div>
              <p className="mt-4 text-center text-xs text-[var(--color-fg-subtle)]">Tablet</p>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="h-64 w-[34rem] max-w-full overflow-hidden rounded-2xl border-4 border-[var(--color-border-strong)] shadow-2xl">
                <MeshGradientThumb colors={project.gradient} className="h-full w-full" animate={false} />
              </div>
              <p className="mt-4 text-center text-xs text-[var(--color-fg-subtle)]">Desktop</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Before / After */}
      <section className="border-t border-[var(--color-border)] py-24">
        <div className="mx-auto max-w-5xl px-6 sm:px-8">
          <SectionHeading
            eyebrow="Vorher / Nachher"
            title="Ziehen, um den Unterschied zu sehen."
            align="center"
            className="mx-auto"
          />
          <Reveal delay={0.2} className="mt-14">
            <BeforeAfterSlider project={project} />
          </Reveal>
        </div>
      </section>

      {/* Results */}
      <section className="border-t border-[var(--color-border)] bg-[var(--color-bg-elevated)] py-24">
        <div className="mx-auto max-w-7xl px-6 text-center sm:px-8">
          <SectionHeading
            eyebrow="Ergebnisse"
            title="Was zählt: der Effekt."
            align="center"
            className="mx-auto"
          />
          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {project.stats.map((stat, i) => (
              <Reveal key={stat.label} delay={i * 0.1}>
                <div className="glass rounded-3xl p-10">
                  <div className="font-display text-gradient-gold text-5xl font-medium">
                    {stat.value}
                  </div>
                  <div className="mt-3 text-sm text-[var(--color-fg-muted)]">{stat.label}</div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.3} className="mt-16 flex justify-center">
            <MagneticButton
              href="/#kontakt"
              className="bg-[var(--color-fg)] text-[var(--color-bg)] hover:bg-[var(--color-accent-soft)]"
            >
              Ähnliches Projekt starten
              <ArrowUpRight className="size-4" />
            </MagneticButton>
          </Reveal>
        </div>
      </section>

      {/* Related */}
      <section className="border-t border-[var(--color-border)] py-24">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <SectionHeading eyebrow="Weitere Arbeiten" title="Mehr entdecken." />
          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {related.map((p, i) => (
              <ProjectCard key={p.slug} project={p} index={i} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
