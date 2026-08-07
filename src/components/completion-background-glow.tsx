"use client";

import { useAchievements } from "@/hooks/use-achievements";

/**
 * A soft, low-opacity glow behind the homepage that shows up once anything
 * has been unlocked — kept deliberately subtle rather than a full theme
 * swap. Fixed positioning + a very low z-index so it sits behind the grid
 * regardless of where in the tree it's mounted, and never intercepts clicks.
 */
export function CompletionBackgroundGlow() {
  const unlocked = useAchievements();
  const show = Object.keys(unlocked).length > 0;

  if (!show) return null;

  return (
    <div
      aria-hidden
      className="animate-in fade-in pointer-events-none fixed inset-0 -z-10 duration-1000"
      style={{
        background: "radial-gradient(60% 45% at 50% 0%, oklch(0.8 0.16 85 / 14%), transparent 70%)",
      }}
    />
  );
}
