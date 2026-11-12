/** The crescent from the pouch artwork, drawn as a clean vector. */
import { useId } from "react";

export function Moon({ className = "", glow = true }: { className?: string; glow?: boolean }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      <defs>
        <radialGradient id={`moon-glow-${id}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#c8b6ee" stopOpacity="0.35" />
          <stop offset="60%" stopColor="#5744d3" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#05060f" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`moon-fill-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fbf8f3" />
          <stop offset="100%" stopColor="#d9cdf2" />
        </linearGradient>
        <mask id={`moon-cut-${id}`}>
          <rect width="200" height="200" fill="#fff" />
          <circle cx="122" cy="84" r="46" fill="#000" />
        </mask>
      </defs>
      {glow && <circle cx="100" cy="100" r="100" fill={`url(#moon-glow-${id})`} />}
      <circle cx="100" cy="100" r="50" fill={`url(#moon-fill-${id})`} mask={`url(#moon-cut-${id})`} />
    </svg>
  );
}
