/**
 * Vireli wordmark. TEMPORARY: rendered from a mask traced from the store
 * screenshot until the vector logo is supplied (references/logo/).
 * Uses CSS mask so it inherits `color` (currentColor).
 */
export function Logo({ className = "", title = "Vireli" }: { className?: string; title?: string }) {
  return (
    <span
      role="img"
      aria-label={title}
      className={`inline-block aspect-[625/315] bg-current ${className}`}
      style={{
        WebkitMaskImage: "url(/assets/images/brand/vireli-logo-mask.png)",
        maskImage: "url(/assets/images/brand/vireli-logo-mask.png)",
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
      }}
    />
  );
}
