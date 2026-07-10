import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlowCardProps {
  children: ReactNode;
  className?: string;
}

export default function GlowCard({ children, className }: GlowCardProps) {
  return (
    <div
      className={cn(
        "glass relative overflow-hidden rounded-3xl p-8 transition-all duration-500 hover:border-[var(--color-border-strong)]",
        className
      )}
    >
      {children}
    </div>
  );
}
