"use client";

import { motion } from "framer-motion";
import { categoryLabels, type ProjectCategory } from "@/lib/data/projects";

type FilterKey = "alle" | ProjectCategory;

interface ProjectFilterProps {
  active: FilterKey;
  onChange: (key: FilterKey) => void;
}

const keys: FilterKey[] = ["alle", "unternehmen", "shops", "landingpages"];

export default function ProjectFilter({ active, onChange }: ProjectFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {keys.map((key) => {
        const isActive = active === key;
        return (
          <button
            key={key}
            type="button"
            data-cursor="hover"
            onClick={() => onChange(key)}
            className="relative rounded-full px-5 py-2.5 text-sm font-medium transition-colors duration-300"
          >
            {isActive && (
              <motion.span
                layoutId="filter-pill"
                className="absolute inset-0 rounded-full bg-[var(--color-fg)]"
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
              />
            )}
            <span
              className={
                isActive
                  ? "relative z-10 text-[var(--color-bg)]"
                  : "relative z-10 text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
              }
            >
              {categoryLabels[key]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
