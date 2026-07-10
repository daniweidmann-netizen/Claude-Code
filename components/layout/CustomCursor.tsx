"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [hovering, setHovering] = useState(false);
  const [pressed, setPressed] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { damping: 30, stiffness: 400, mass: 0.4 });
  const springY = useSpring(y, { damping: 30, stiffness: 400, mass: 0.4 });
  const ringX = useSpring(x, { damping: 22, stiffness: 180, mass: 0.6 });
  const ringY = useSpring(y, { damping: 22, stiffness: 180, mass: 0.6 });

  useEffect(() => {
    const isFine = window.matchMedia("(pointer: fine)").matches;
    if (!isFine) return;
    document.documentElement.classList.add("has-cursor");

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const target = e.target as HTMLElement;
      setHovering(!!target.closest("[data-cursor='hover']"));
    };
    const down = () => setPressed(true);
    const up = () => setPressed(false);

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
    };
  }, [x, y]);

  return (
    <>
      <motion.div
        aria-hidden
        className="cursor-dot pointer-events-none fixed left-0 top-0 z-[100] size-2 rounded-full bg-[var(--color-accent)]"
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />
      <motion.div
        aria-hidden
        className="cursor-ring pointer-events-none fixed left-0 top-0 z-[100] rounded-full border border-[var(--color-accent-soft)]/60 mix-blend-difference"
        animate={{
          width: hovering ? 64 : 34,
          height: hovering ? 64 : 34,
          opacity: pressed ? 0.5 : 1,
        }}
        transition={{ type: "spring", damping: 24, stiffness: 260 }}
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />
    </>
  );
}
