import type { LucideIcon } from "lucide-react";

interface PillPlaceholderProps {
  icon: LucideIcon;
  label: string;
  className?: string;
}

/**
 * Styled like a real link button but intentionally non-interactive — these
 * stand in for social/newsletter links that don't exist yet.
 */
export function PillPlaceholder({ icon: Icon, label, className = "" }: PillPlaceholderProps) {
  return (
    <span
      className={`border-border bg-card text-muted-foreground inline-flex cursor-default items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm ${className}`}
    >
      <Icon className="size-4" aria-hidden />
      {label}
    </span>
  );
}
