/** Line icons matching the three pack badges. */
export function BadgeIcon({ kind, className = "" }: { kind: string; className?: string }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.1, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <circle cx="20" cy="20" r="18.5" {...common} opacity="0.35" />
      {kind === "Melatoninfrei" && (
        <g {...common}>
          <path d="M23.5 12.5a8 8 0 1 0 4.5 13.4 7 7 0 0 1-4.5-13.4Z" />
          <path d="M26 12.5v2.4M24.8 13.7h2.4M29.2 17.2v1.6M28.4 18h1.6" />
        </g>
      )}
      {kind === "Vegan" && (
        <g {...common}>
          <path d="M20 28c0-5 0-9 0-12" />
          <path d="M20 22c-5.5 0-8-3.2-8-7.5 4.5 0 8 2.5 8 7.5Z" />
          <path d="M20 19.5c0-4.6 2.6-7.5 8-7.5 0 4.6-3 7.5-8 7.5Z" />
        </g>
      )}
      {kind === "Ohne Zuckerzusatz" && (
        <g {...common}>
          <path d="M20 12.5l6.5 3.7v7.6L20 27.5l-6.5-3.7v-7.6Z" />
          <path d="M13.5 16.2 20 20l6.5-3.8M20 20v7.5" />
          <path d="M12 28 28 12" />
        </g>
      )}
    </svg>
  );
}
