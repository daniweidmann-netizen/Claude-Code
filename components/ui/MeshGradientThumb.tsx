"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MeshGradientThumbProps {
  colors: [string, string, string];
  className?: string;
  animate?: boolean;
}

export default function MeshGradientThumb({
  colors,
  className,
  animate = true,
}: MeshGradientThumbProps) {
  const [a, b, c] = colors;
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <div
        className="absolute inset-0"
        style={{ background: c }}
      />
      <motion.div
        className="absolute -inset-1/4 rounded-full opacity-80 blur-2xl"
        style={{ background: a }}
        animate={
          animate
            ? { x: ["0%", "18%", "-8%", "0%"], y: ["0%", "-12%", "10%", "0%"] }
            : undefined
        }
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -inset-1/4 left-1/3 top-1/4 rounded-full opacity-70 blur-2xl"
        style={{ background: b }}
        animate={
          animate
            ? { x: ["0%", "-15%", "10%", "0%"], y: ["0%", "10%", "-14%", "0%"] }
            : undefined
        }
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <div
        className="absolute inset-0 opacity-40 mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: "220px 220px",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />
    </div>
  );
}
