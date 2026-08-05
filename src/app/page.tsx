import { GameSlot } from "@/components/game-slot";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const PLACEHOLDER_SLOT_COUNT = 9;

export default function Home() {
  const slots = Array.from({ length: PLACEHOLDER_SLOT_COUNT }, (_, i) => i + 1);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-6">
      <SiteHeader />
      <main className="grid grid-cols-1 gap-4 pb-16 sm:grid-cols-2 lg:grid-cols-3">
        {slots.map((index) => (
          <GameSlot key={index} index={index} />
        ))}
      </main>
      <SiteFooter />
    </div>
  );
}
