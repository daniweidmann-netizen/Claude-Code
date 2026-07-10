import { cn } from "@/lib/utils";

interface AuroraBackgroundProps {
  className?: string;
  variant?: "hero" | "subtle";
}

export default function AuroraBackground({ className, variant = "subtle" }: AuroraBackgroundProps) {
  const intensity = variant === "hero" ? 0.55 : 0.32;
  return (
    <div className={cn("aurora-field", className)} aria-hidden>
      <div
        className="aurora-blob animate-aurora-a"
        style={{
          top: "-10%",
          left: "-10%",
          width: "50%",
          height: "50%",
          background: `radial-gradient(circle, rgba(216,180,120,${intensity}) 0%, transparent 70%)`,
        }}
      />
      <div
        className="aurora-blob animate-aurora-b"
        style={{
          top: "10%",
          right: "-15%",
          width: "55%",
          height: "55%",
          background: `radial-gradient(circle, rgba(124,108,240,${intensity}) 0%, transparent 70%)`,
        }}
      />
      <div
        className="aurora-blob animate-aurora-c"
        style={{
          bottom: "-20%",
          left: "20%",
          width: "45%",
          height: "45%",
          background: `radial-gradient(circle, rgba(91,140,255,${intensity}) 0%, transparent 70%)`,
        }}
      />
    </div>
  );
}
