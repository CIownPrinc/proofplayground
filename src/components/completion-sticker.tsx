import { RollerCoaster, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface CompletionStickerProps {
  className?: string;
  icon?: LucideIcon;
  color?: string;
}

const DEFAULT_COLOR = "oklch(0.56 0.22 293)";

/**
 * The shared sticker graphic — a die-cut circle with its own fixed color
 * (not a theme token, same reasoning as the game's curve colors: it should
 * look like actual printed sticker stock, not something that repaints
 * itself in dark mode), plus a handful of "this has been on a laptop lid"
 * details: two small edge chips, a couple of faint scuff scratches, and a
 * sun-faded patch, on top of the gloss highlight and peeled corner.
 */
export function CompletionSticker({
  className,
  icon: Icon = RollerCoaster,
  color = DEFAULT_COLOR,
}: CompletionStickerProps) {
  return (
    <span
      className={cn("relative inline-flex aspect-square items-center justify-center", className)}
    >
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 size-full drop-shadow-[0_3px_5px_rgba(0,0,0,0.4)]"
      >
        <circle cx="50" cy="50" r="46" fill={color} stroke="var(--foreground)" strokeWidth="3.5" />
        <circle
          cx="50"
          cy="50"
          r="38"
          fill="none"
          stroke="white"
          strokeWidth="1.5"
          strokeDasharray="2.5 5"
          opacity="0.5"
        />

        {/* sun-faded patch */}
        <circle cx="34" cy="66" r="17" fill="white" opacity="0.09" />

        {/* scuff scratches */}
        <path
          d="M18,60 L29,68"
          stroke="white"
          strokeWidth="1.8"
          strokeLinecap="round"
          opacity="0.4"
        />
        <path
          d="M64,17 L73,26"
          stroke="white"
          strokeWidth="1.8"
          strokeLinecap="round"
          opacity="0.35"
        />
        <path
          d="M22,38 L27,42"
          stroke="black"
          strokeWidth="1.4"
          strokeLinecap="round"
          opacity="0.12"
        />

        {/* two small chips taken out of the die-cut edge */}
        <circle cx="79.6" cy="85.2" r="4.4" fill="var(--background)" />
        <circle cx="8.3" cy="30.5" r="3.6" fill="var(--background)" />

        <ellipse
          cx="34"
          cy="30"
          rx="15"
          ry="8"
          fill="white"
          opacity="0.3"
          transform="rotate(-25 34 30)"
        />
        <path d="M78 78 L97 78 A19 19 0 0 1 78 97 Z" fill="var(--background)" />
        <path
          d="M78 78 L97 78 L78 97 Z"
          fill="none"
          stroke="var(--foreground)"
          strokeWidth="1.5"
          opacity="0.3"
        />
      </svg>
      <Icon
        className="relative size-[45%] text-white drop-shadow-[0_1px_1.5px_rgba(0,0,0,0.45)]"
        aria-hidden
      />
    </span>
  );
}
