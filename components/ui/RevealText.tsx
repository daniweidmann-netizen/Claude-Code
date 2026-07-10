"use client";

import { motion } from "framer-motion";
import { ElementType } from "react";
import { cn } from "@/lib/utils";

interface RevealTextProps {
  text: string;
  as?: ElementType;
  className?: string;
  stagger?: number;
  delay?: number;
  splitBy?: "word" | "char";
  once?: boolean;
}

export default function RevealText({
  text,
  as: Tag = "div",
  className,
  stagger = 0.045,
  delay = 0,
  splitBy = "word",
  once = true,
}: RevealTextProps) {
  const parts = splitBy === "word" ? text.split(" ") : text.split("");

  return (
    <Tag className={cn("flex flex-wrap", className)}>
      {parts.map((part, i) => (
        <span key={i} className="overflow-hidden pb-[0.15em] pr-[0.28em] inline-block">
          <motion.span
            className="inline-block will-change-transform"
            initial={{ y: "115%", rotate: 4 }}
            whileInView={{ y: "0%", rotate: 0 }}
            viewport={{ once, margin: "-10% 0px -10% 0px" }}
            transition={{
              duration: 0.9,
              delay: delay + i * stagger,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {part === "" ? " " : part}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
