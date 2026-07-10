"use client";

import { ReactNode, useRef, MouseEvent } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  strength?: number;
  as?: "button";
  onClick?: () => void;
  type?: "button" | "submit";
  href?: string;
}

export default function MagneticButton({
  children,
  className,
  strength = 0.35,
  onClick,
  type = "button",
  href,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - rect.left - rect.width / 2;
    const relY = e.clientY - rect.top - rect.height / 2;
    x.set(relX * strength);
    y.set(relY * strength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const Content = (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      data-cursor="hover"
      className="inline-block"
    >
      {href ? (
        <a
          href={href}
          className={cn(
            "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-8 py-4 text-sm font-medium tracking-wide transition-colors",
            className
          )}
        >
          {children}
        </a>
      ) : (
        <button
          type={type}
          onClick={onClick}
          className={cn(
            "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-8 py-4 text-sm font-medium tracking-wide transition-colors",
            className
          )}
        >
          {children}
        </button>
      )}
    </motion.div>
  );

  return Content;
}
