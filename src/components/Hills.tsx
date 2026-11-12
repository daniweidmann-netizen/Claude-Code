/** Layered violet hills — echoing the landscape on the pouch artwork. */
export function Hills({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 1440 420" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="h1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6b55c9" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#1e1161" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="h2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3c2965" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#0d1030" />
        </linearGradient>
        <linearGradient id="h3" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e1161" />
          <stop offset="100%" stopColor="#05060f" />
        </linearGradient>
      </defs>
      <path d="M0 210 C 220 120, 420 150, 640 190 S 1060 120, 1440 170 L1440 420 L0 420 Z" fill="url(#h1)" />
      <path d="M0 270 C 260 200, 520 250, 760 260 S 1180 200, 1440 250 L1440 420 L0 420 Z" fill="url(#h2)" />
      <path d="M0 330 C 300 290, 600 330, 900 320 S 1260 300, 1440 320 L1440 420 L0 420 Z" fill="url(#h3)" />
    </svg>
  );
}
