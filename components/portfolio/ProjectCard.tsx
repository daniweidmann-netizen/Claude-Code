"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import TiltCard from "@/components/ui/TiltCard";
import MeshGradientThumb from "@/components/ui/MeshGradientThumb";
import type { Project } from "@/lib/data/projects";
import { formatIndex } from "@/lib/utils";

interface ProjectCardProps {
  project: Project;
  index: number;
  featured?: boolean;
}

export default function ProjectCard({ project, index, featured = false }: ProjectCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={featured ? "sm:col-span-2" : ""}
    >
      <TiltCard maxTilt={4} className="group h-full">
        <Link
          href={`/arbeiten/${project.slug}`}
          data-cursor="hover"
          className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-card)]"
        >
          <div className={`relative w-full overflow-hidden ${featured ? "aspect-[16/9]" : "aspect-[4/3]"}`}>
            <div className="absolute inset-0 scale-105 transition-transform duration-700 ease-out group-hover:scale-[1.15]">
              <MeshGradientThumb colors={project.gradient} className="h-full w-full" />
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-90" />

            <span className="absolute left-5 top-5 rounded-full border border-white/20 bg-black/30 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-white/80 backdrop-blur">
              {project.categoryLabel}
            </span>
            <span className="font-display absolute right-5 top-5 text-sm text-white/50">
              {formatIndex(index + 1)}
            </span>

            <div className="absolute inset-x-5 bottom-5 flex items-end justify-between">
              <div>
                <h3 className="font-display text-2xl font-medium text-white sm:text-3xl">
                  {project.title}
                </h3>
                <p className="mt-1 text-sm text-white/60">{project.industry}</p>
              </div>
              <div className="flex size-11 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur transition-all duration-500 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:bg-[var(--color-accent)] group-hover:text-black">
                <ArrowUpRight className="size-5" />
              </div>
            </div>

            {/* Hover detail overlay */}
            <div className="absolute inset-0 flex translate-y-3 flex-col justify-end bg-black/60 p-5 opacity-0 backdrop-blur-md transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
              <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs text-white/90">
                <div>
                  <dt className="text-white/40 uppercase tracking-wider">Branche</dt>
                  <dd className="mt-1">{project.industry}</dd>
                </div>
                <div>
                  <dt className="text-white/40 uppercase tracking-wider">Ziel</dt>
                  <dd className="mt-1">{project.goal}</dd>
                </div>
                <div>
                  <dt className="text-white/40 uppercase tracking-wider">Technologien</dt>
                  <dd className="mt-1">{project.tags.slice(0, 2).join(", ")}</dd>
                </div>
                <div>
                  <dt className="text-white/40 uppercase tracking-wider">Ergebnis</dt>
                  <dd className="mt-1 text-[var(--color-accent-soft)]">{project.result}</dd>
                </div>
              </dl>
            </div>
          </div>
        </Link>
      </TiltCard>
    </motion.div>
  );
}
