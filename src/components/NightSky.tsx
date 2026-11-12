/** Deterministic star field (server-rendered SVG, CSS twinkle). */
function rand(seed: number) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
}

export function NightSky({ count = 90, seed = 7, className = "" }: { count?: number; seed?: number; className?: string }) {
  const r = rand(seed);
  const stars = Array.from({ length: count }, () => {
    const big = r() > 0.94;
    return {
      x: r() * 100,
      y: r() * 100,
      s: big ? 1.1 + r() * 0.8 : 0.35 + r() * 0.55,
      o: big ? 0.9 : 0.25 + r() * 0.5,
      d: 3 + r() * 6,
      delay: r() * -8,
      big,
    };
  });
  return (
    <svg className={className} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      {stars.map((st, i) => (
        <circle
          key={i}
          className="star"
          cx={st.x}
          cy={st.y}
          r={st.s * 0.1}
          fill={st.big ? "#f2eee9" : "#c8b6ee"}
          style={{ "--o": st.o, "--d": `${st.d}s`, "--delay": `${st.delay}s` } as React.CSSProperties}
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}
