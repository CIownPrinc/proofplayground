import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { EconopolisAchievementBridge } from "./econopolis-achievement-bridge";

export const metadata: Metadata = {
  title: "Econopolis — Proof Playground",
  description:
    "Steer a pixel city's economy through nine policy levers and watch believable, tradeoff-bearing consequences unfold.",
};

// Econopolis is a complete, self-contained single-file game (its own menus,
// onboarding, save system) — it gets a clean site URL via this route, but
// otherwise just fills the viewport with the untouched file from public/,
// rather than being squeezed inside the rest of the site's chrome.
export default function EconopolisPage() {
  return (
    <div className="fixed inset-0 flex flex-col bg-black">
      <EconopolisAchievementBridge />
      <div className="bg-background flex shrink-0 items-center border-b px-3 py-1.5">
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Proof Playground
        </Link>
      </div>
      <iframe
        src="/games/econopolis/index.html"
        title="Econopolis — An Economic Systems Sim"
        className="w-full grow border-0"
        allow="autoplay"
      />
    </div>
  );
}
