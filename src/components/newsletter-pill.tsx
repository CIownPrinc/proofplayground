"use client";

import { Check, Mail } from "lucide-react";

import { unlockAchievement, useAchievements } from "@/hooks/use-achievements";

/**
 * Styled like the other footer pills, but this one is real — there's no
 * backend behind it (nothing here has one), but clicking it genuinely marks
 * you as subscribed for this browser and earns the newsletter sticker.
 * Subscribed state is derived from the achievements store itself (not local
 * state) so a returning visitor who already earned it sees "Subscribed!"
 * immediately instead of a pill that's forgotten what they did last time.
 */
export function NewsletterPill() {
  const unlocked = useAchievements();
  const subscribed = Boolean(unlocked.newsletter);

  return (
    <button
      type="button"
      disabled={subscribed}
      onClick={() => unlockAchievement("newsletter")}
      className="border-border bg-card text-muted-foreground hover:text-foreground hover:border-foreground/40 inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors disabled:cursor-default disabled:opacity-70"
    >
      {subscribed ? (
        <Check className="size-4" aria-hidden />
      ) : (
        <Mail className="size-4" aria-hidden />
      )}
      {subscribed ? "Subscribed!" : "Newsletter"}
    </button>
  );
}
