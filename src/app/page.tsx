import { CompletionBackgroundGlow } from "@/components/completion-background-glow";
import { GameSlot } from "@/components/game-slot";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const PLACEHOLDER_SLOT_COUNT = 12;

// A slug/title/description literal here is simpler than a registry +
// dispatch system for a handful of games. Revisit if this grows large.
const FEATURED_GAMES: Record<
  number,
  { href: string; title: string; description: string; thumbnailSrc?: string }
> = {
  1: {
    href: "/games/brachistochrone",
    title: "Race to the Bottom",
    description: "Guess the fastest path down — then watch three curves race.",
    thumbnailSrc: "/games/brachistochrone/homepage-banner.png",
  },
  2: {
    href: "/games/econopolis",
    title: "Econopolis",
    description: "Steer a pixel city's economy through nine policy levers.",
    thumbnailSrc: "/games/econopolis/homepage-banner.png",
  },
  3: {
    href: "/games/birthday-problem",
    title: "The 23rd Guest",
    description: "How can 23 people make a shared birthday likely?",
    thumbnailSrc: "/games/birthday-problem/homepage-banner.png",
  },
};

export default function Home() {
  const slots = Array.from({ length: PLACEHOLDER_SLOT_COUNT }, (_, i) => i + 1);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6">
      <CompletionBackgroundGlow />
      <SiteHeader />
      <main className="grid grid-cols-1 items-start gap-4 pb-16 sm:grid-cols-2 lg:grid-cols-3">
        {slots.map((index) => (
          <GameSlot key={index} index={index} {...FEATURED_GAMES[index]} />
        ))}
      </main>
      <SiteFooter />
    </div>
  );
}
