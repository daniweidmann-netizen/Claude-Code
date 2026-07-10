import { cn } from "@/lib/utils";

/**
 * Slow-drifting mesh-gradient blobs behind a grain layer. Pure CSS
 * transforms/opacity — no canvas, no JS — so it costs nothing on the main
 * thread and stays GPU-composited at 144Hz.
 */
export function AuroraBackground({ className }: { className?: string }) {
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden>
      <div className="absolute inset-0 bg-void-950" />

      <div
        className="animate-aurora-drift absolute -left-1/4 -top-1/3 h-[70vh] w-[70vh] rounded-full opacity-40 blur-[110px]"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, var(--color-aurora-violet), transparent 70%)",
        }}
      />
      <div
        className="animate-aurora-drift absolute -right-1/4 top-0 h-[60vh] w-[60vh] rounded-full opacity-30 blur-[110px]"
        style={{
          background: "radial-gradient(circle at 70% 40%, var(--color-aurora-rose), transparent 70%)",
          animationDelay: "-9s",
        }}
      />
      <div
        className="animate-aurora-drift absolute bottom-0 left-1/4 h-[55vh] w-[55vh] rounded-full opacity-25 blur-[120px]"
        style={{
          background: "radial-gradient(circle at 50% 50%, var(--color-aurora-cyan), transparent 70%)",
          animationDelay: "-18s",
        }}
      />
      <div
        className="animate-aurora-drift absolute bottom-1/4 right-0 h-[45vh] w-[45vh] rounded-full opacity-30 blur-[100px]"
        style={{
          background: "radial-gradient(circle at 50% 50%, var(--color-aurora-amber), transparent 70%)",
          animationDelay: "-24s",
        }}
      />

      <div className="bg-noise absolute inset-0 opacity-[0.045] mix-blend-overlay" />

      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 0%, transparent 40%, var(--color-void-950) 100%)",
        }}
      />
    </div>
  );
}
