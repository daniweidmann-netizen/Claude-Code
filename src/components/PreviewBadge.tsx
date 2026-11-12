/** Visible marker for anything that is not final/live. Hidden when NEXT_PUBLIC_SHOW_PLACEHOLDER_LABELS=false. */
export function PreviewBadge({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  if (process.env.NEXT_PUBLIC_SHOW_PLACEHOLDER_LABELS === "false") return null;
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border border-dashed border-lavender/40 bg-midnight/70 px-3 py-1 font-sans text-[10px] font-medium uppercase tracking-[0.16em] text-lavender backdrop-blur-sm ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-ember" />
      {children}
    </span>
  );
}
