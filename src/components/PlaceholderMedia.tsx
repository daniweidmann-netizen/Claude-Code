import { PreviewBadge } from "./PreviewBadge";

/** Designed stand-in for a Higgsfield asset that has not been delivered yet (ASSET_GUIDE.md §6). */
export function PlaceholderMedia({
  id,
  label,
  className = "",
  badge = "bottom",
  children,
}: {
  badge?: "top" | "bottom";
  id: string;
  label: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={`placeholder-plate relative overflow-hidden ${className}`} role="img" aria-label={`${label} – Platzhalter`}>
      {children}
      <PreviewBadge className={`absolute left-4 ${badge === "top" ? "top-4" : "bottom-4"}`}>
        {id} · {label} · Asset ausstehend
      </PreviewBadge>
    </div>
  );
}
