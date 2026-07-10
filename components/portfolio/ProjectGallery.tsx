"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ProjectFilter from "./ProjectFilter";
import ProjectCard from "./ProjectCard";
import { projects, type ProjectCategory } from "@/lib/data/projects";

type FilterKey = "alle" | ProjectCategory;

export default function ProjectGallery() {
  const [active, setActive] = useState<FilterKey>("alle");

  const filtered = useMemo(
    () => (active === "alle" ? projects : projects.filter((p) => p.category === active)),
    [active]
  );

  return (
    <div>
      <div className="glass inline-flex rounded-full p-1.5">
        <ProjectFilter active={active} onChange={setActive} />
      </div>

      <motion.div
        layout
        className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((project, i) => (
            <ProjectCard key={project.slug} project={project} index={i} />
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <p className="mt-16 text-center text-[var(--color-fg-muted)]">
          Keine Projekte in dieser Kategorie gefunden.
        </p>
      )}
    </div>
  );
}
