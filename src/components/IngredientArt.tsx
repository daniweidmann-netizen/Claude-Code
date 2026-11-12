/** Abstract, non-literal visuals per ingredient (metaphors, not claims). */
export function IngredientArt({ kind }: { kind: string }) {
  const s = { fill: "none", stroke: "#c8b6ee", strokeWidth: 0.6, vectorEffect: "non-scaling-stroke" as const };
  return (
    <svg viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice" className="h-full w-full" aria-hidden="true">
      <defs>
        <radialGradient id={`bg-${kind}`} cx="50%" cy="45%" r="70%">
          <stop offset="0%" stopColor={kind === "ashwagandha" ? "#3a2a40" : "#1e1161"} />
          <stop offset="100%" stopColor="#05060f" />
        </radialGradient>
        <radialGradient id="sun" cx="50%" cy="50%" r="50%">
          <stop offset="60%" stopColor="#e3a260" stopOpacity="0" />
          <stop offset="72%" stopColor="#f5d7a8" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#e3a260" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="200" height="200" fill={`url(#bg-${kind})`} />
      {kind === "l-theanin" && (
        <g>
          {[18, 32, 48, 66, 86].map((r, i) => (
            <ellipse key={r} cx="100" cy="128" rx={r} ry={r * 0.28} {...s} strokeOpacity={0.9 - i * 0.16}>
              <animate attributeName="rx" values={`${r};${r + 8};${r}`} dur="7s" begin={`${i * -1.2}s`} repeatCount="indefinite" />
            </ellipse>
          ))}
          <path d="M100 74c-10 10-12 24-2 40 12-14 12-28 2-40Z" fill="#c8b6ee" fillOpacity="0.15" stroke="#c8b6ee" strokeWidth="0.6" />
          <path d="M100 76v36" {...s} />
        </g>
      )}
      {kind === "ashwagandha" && (
        <g strokeLinecap="round">
          <path d="M100 30v56" {...s} stroke="#e8c9a0" strokeWidth={1} />
          {[
            "M100 86c-4 22-24 34-30 62", "M100 86c6 24 22 30 26 64", "M100 96c-16 10-34 12-46 30",
            "M100 100c14 8 36 10 44 34", "M76 120c-6 12-4 26 -12 40", "M124 118c4 14 14 22 12 38", "M100 92c0 30-6 52-2 80",
          ].map((d, i) => (
            <path key={i} d={d} {...s} stroke="#e8c9a0" strokeOpacity={0.85 - i * 0.07} />
          ))}
          {[...Array(26)].map((_, i) => (
            <circle key={i} cx={40 + ((i * 53) % 120)} cy={40 + ((i * 37) % 130)} r={0.6 + (i % 3) * 0.3} fill="#e8c9a0" fillOpacity="0.4" />
          ))}
        </g>
      )}
      {kind === "vitamin-d" && (
        <g>
          <circle cx="100" cy="100" r="72" fill="url(#sun)">
            <animate attributeName="r" values="70;76;70" dur="6s" repeatCount="indefinite" />
          </circle>
          <circle cx="100" cy="100" r="46" fill="#05060f" />
          <circle cx="100" cy="100" r="46.5" fill="none" stroke="#f5d7a8" strokeOpacity="0.7" strokeWidth="0.8" />
        </g>
      )}
      {kind === "zink" && (
        <g {...s}>
          <path d="M100 38 150 70 142 136 100 164 58 136 50 70Z" strokeOpacity="0.95" />
          <path d="M100 38 112 98 150 70M112 98 142 136M112 98 100 164M112 98 58 136M112 98 50 70M100 38 88 92 50 70M88 92 58 136M88 92 112 98" strokeOpacity="0.45" />
          <animateTransform attributeName="transform" type="rotate" values="-4 100 100;4 100 100;-4 100 100" dur="12s" repeatCount="indefinite" />
        </g>
      )}
    </svg>
  );
}
