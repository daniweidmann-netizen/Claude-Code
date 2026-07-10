"use client";

import { useRef, useState, PointerEvent } from "react";
import { motion } from "framer-motion";
import { MoveHorizontal } from "lucide-react";
import MeshGradientThumb from "@/components/ui/MeshGradientThumb";
import type { Project } from "@/lib/data/projects";

export default function BeforeAfterSlider({ project }: { project: Project }) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(50);
  const dragging = useRef(false);

  const update = (clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(96, Math.max(4, pct)));
  };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    dragging.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    update(e.clientX);
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    update(e.clientX);
  };
  const onPointerUp = () => {
    dragging.current = false;
  };

  return (
    <div
      ref={ref}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      className="relative aspect-video w-full cursor-ew-resize touch-none select-none overflow-hidden rounded-3xl border border-[var(--color-border)]"
      data-cursor="hover"
    >
      <div className="absolute inset-0">
        <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-[#e9e7e1] text-[#0b0c0f]">
          <span className="rounded-full border border-black/10 px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-black/40">
            Vorher
          </span>
          <div className="h-3 w-40 rounded-full bg-black/10" />
          <div className="h-3 w-56 rounded-full bg-black/10" />
          <div className="mt-2 h-8 w-32 rounded-full bg-black/10" />
        </div>
      </div>

      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 0 0 ${pos}%)` }}
      >
        <MeshGradientThumb colors={project.gradient} className="h-full w-full" animate={false} />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
          <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-white/70 backdrop-blur">
            Nachher
          </span>
          <div className="font-display text-xl text-white">{project.title}</div>
        </div>
      </div>

      <motion.div
        className="absolute inset-y-0 z-10 flex w-0.5 -translate-x-1/2 items-center justify-center bg-white/70"
        style={{ left: `${pos}%` }}
      >
        <div className="flex size-10 items-center justify-center rounded-full border border-white/30 bg-white text-black shadow-lg">
          <MoveHorizontal className="size-4" />
        </div>
      </motion.div>
    </div>
  );
}
