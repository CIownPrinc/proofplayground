"use client";

import { Dialog } from "@base-ui/react/dialog";
import { Lock, NotebookText, X } from "lucide-react";

import { CompletionSticker } from "@/components/completion-sticker";
import { useAchievements } from "@/hooks/use-achievements";
import { ACHIEVEMENTS } from "@/lib/achievements";
import { cn } from "@/lib/utils";

const ROTATIONS = ["-rotate-6", "rotate-3", "-rotate-3", "rotate-6", "-rotate-2", "rotate-2"];
const LABEL_ROTATIONS = ["-rotate-1", "rotate-1", "-rotate-2"];

const COVER_COLOR = "#241a12";
const TAPE_COLOR = "#cbb994";

// Ruled lines, a soft center-spine shadow (the book's gutter), and two very
// faint stains — all as stacked background-image layers on one element
// rather than extra DOM nodes.
const PAGE_STYLE = {
  backgroundImage: [
    "radial-gradient(120px 90px at 18% 85%, rgba(120,90,50,0.05), transparent 70%)",
    "radial-gradient(90px 70px at 85% 15%, rgba(120,90,50,0.045), transparent 70%)",
    "linear-gradient(90deg, transparent 48.5%, rgba(0,0,0,0.14) 50%, transparent 51.5%)",
    "repeating-linear-gradient(var(--background) 0 27px, color-mix(in oklch, var(--foreground) 12%, transparent) 27px 28px)",
  ].join(", "),
  backgroundPosition: "0 0, 0 0, 0 0, 0 -4px",
};

/**
 * The achievement collection, styled as an actual worn journal rather than a
 * generic dialog: a dark cover frame, a center spine shadow, ruled paper
 * with a couple of faint age stains, washi tape pinning the top corners,
 * and a bookmark ribbon — it folds open toward the viewer on a hinge at the
 * spine. Opening it re-plays a small staggered reveal over whatever's
 * already unlocked, so it never feels like a static settings page.
 */
export function AchievementNotebook() {
  const unlocked = useAchievements();
  const unlockedCount = ACHIEVEMENTS.filter((achievement) => unlocked[achievement.id]).length;

  return (
    <Dialog.Root>
      <Dialog.Trigger className="border-border bg-card text-muted-foreground hover:text-foreground hover:border-foreground/40 inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors">
        <NotebookText className="size-4" aria-hidden />
        Stickers
        <span className="text-foreground/60 font-mono text-xs">
          {unlockedCount}/{ACHIEVEMENTS.length}
        </span>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/40 opacity-0 transition-opacity duration-200 data-[ending-style]:opacity-0 data-[open]:opacity-100 data-[starting-style]:opacity-0" />
        <Dialog.Viewport className="fixed inset-0 z-50 flex items-center justify-center p-4 [perspective:1800px]">
          <Dialog.Popup
            className={cn(
              "w-full max-w-2xl origin-left [transform:rotateY(0deg)] transition-all duration-300 ease-out [transform-style:preserve-3d]",
              "data-[starting-style]:[transform:rotateY(-100deg)] data-[starting-style]:opacity-0",
              "data-[ending-style]:[transform:rotateY(-100deg)] data-[ending-style]:opacity-0",
            )}
          >
            {/* leather cover frame */}
            <div
              className="relative rounded-2xl p-3 pb-6 shadow-2xl sm:p-4 sm:pb-7"
              style={{ backgroundColor: COVER_COLOR }}
            >
              {/* washi tape pinning the page to the cover */}
              <span
                aria-hidden
                className="absolute top-0 left-10 h-5 w-14 -translate-y-1/2 -rotate-6 opacity-80 shadow-sm"
                style={{ backgroundColor: TAPE_COLOR }}
              />
              <span
                aria-hidden
                className="absolute top-0 right-14 h-5 w-16 -translate-y-1/2 rotate-3 opacity-80 shadow-sm"
                style={{ backgroundColor: TAPE_COLOR }}
              />

              {/* bookmark ribbon */}
              <div
                aria-hidden
                className="bg-brand absolute bottom-0 left-12 h-8 w-6 translate-y-[calc(100%-2px)]"
                style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 70%, 0 100%)" }}
              />

              <div className="relative overflow-hidden rounded-lg">
                {/* page corner curl, bottom-right */}
                <div
                  aria-hidden
                  className="absolute right-0 bottom-0 z-10 size-6"
                  style={{
                    background:
                      "linear-gradient(135deg, transparent 50%, color-mix(in oklch, var(--foreground) 10%, var(--background)) 50%)",
                  }}
                />

                <div
                  className="max-h-[80vh] overflow-y-auto px-6 py-6 sm:px-8 sm:py-8"
                  style={PAGE_STYLE}
                >
                  <div className="mb-1 flex items-start justify-between gap-4">
                    <div>
                      <Dialog.Title className="font-handwriting -rotate-1 text-4xl leading-none font-semibold">
                        Sticker book
                      </Dialog.Title>
                      <Dialog.Description className="font-handwriting text-muted-foreground mt-2 text-xl leading-snug">
                        Little rewards for poking around the site. Nothing to grind — just things
                        you might stumble into.
                      </Dialog.Description>
                    </div>
                    <Dialog.Close
                      aria-label="Close"
                      className="border-foreground/80 bg-background hover:bg-muted inline-flex size-8 shrink-0 items-center justify-center rounded-full border-2 transition-colors"
                    >
                      <X className="size-4" aria-hidden />
                    </Dialog.Close>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
                    {ACHIEVEMENTS.map((achievement, index) => {
                      const earnedAt = unlocked[achievement.id];
                      const rotation = ROTATIONS[index % ROTATIONS.length];
                      const labelRotation = LABEL_ROTATIONS[index % LABEL_ROTATIONS.length];

                      if (!earnedAt) {
                        return (
                          <div
                            key={achievement.id}
                            className="border-foreground/20 flex flex-col items-center gap-2 rounded-xl border-2 border-dashed p-3 text-center"
                          >
                            <div className="bg-muted flex size-14 items-center justify-center rounded-full">
                              <Lock className="text-muted-foreground/60 size-5" aria-hidden />
                            </div>
                            <p className="font-handwriting text-muted-foreground/70 text-xl">
                              locked
                            </p>
                          </div>
                        );
                      }

                      return (
                        <div
                          key={achievement.id}
                          className="animate-in zoom-in-50 fade-in flex flex-col items-center gap-1.5 p-3 text-center duration-500"
                          style={{
                            animationDelay: `${index * 90}ms`,
                            animationFillMode: "backwards",
                          }}
                        >
                          <CompletionSticker
                            icon={achievement.icon}
                            color={achievement.color}
                            className={cn("size-14", rotation)}
                          />
                          <p
                            className={cn(
                              "font-handwriting text-xl leading-tight font-semibold",
                              labelRotation,
                            )}
                          >
                            {achievement.title}
                          </p>
                          <p className="font-handwriting text-muted-foreground text-lg leading-tight">
                            {achievement.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
