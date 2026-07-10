import { ReactNode } from "react";
import RevealText from "./RevealText";
import Reveal from "./Reveal";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
  titleClassName?: string;
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  titleClassName,
}: SectionHeadingProps) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && (
        <Reveal>
          <div
            className={cn(
              "mb-5 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.3em] text-[var(--color-accent)]",
              align === "center" && "justify-center"
            )}
          >
            <span className="h-px w-8 bg-[var(--color-accent)]/60" />
            {eyebrow}
          </div>
        </Reveal>
      )}
      <RevealText
        text={title}
        as="h2"
        className={cn(
          "font-display text-balance text-4xl font-medium leading-[1.08] tracking-tight sm:text-5xl md:text-6xl",
          align === "center" && "justify-center",
          titleClassName
        )}
      />
      {description && (
        <Reveal delay={0.15}>
          <p className="mt-6 text-lg leading-relaxed text-[var(--color-fg-muted)]">
            {description}
          </p>
        </Reveal>
      )}
    </div>
  );
}
