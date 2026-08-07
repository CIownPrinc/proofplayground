import { Mail } from "lucide-react";
import { AchievementNotebook } from "@/components/achievement-notebook";
import { FaceAvatar } from "@/components/face-avatar";
import { PillPlaceholder } from "@/components/pill-placeholder";

export function SiteHeader() {
  return (
    <header className="relative flex flex-col items-center gap-3 pt-16 pb-10 text-center sm:pt-20 sm:pb-14">
      <div className="absolute top-6 left-0">
        <AchievementNotebook />
      </div>
      <div className="absolute top-6 right-0">
        <PillPlaceholder icon={Mail} label="Get updates" />
      </div>

      <FaceAvatar />
      <p className="font-heading text-muted-foreground text-sm font-medium tracking-[0.2em]">
        aarits
      </p>
      <h1 className="font-heading -mt-1 text-4xl font-semibold tracking-tight sm:text-5xl">
        Proof <span className="text-brand">&middot;</span> Playground
      </h1>
      <p className="text-muted-foreground max-w-md text-balance">
        small builds, proofs of concept, and experiments
      </p>
    </header>
  );
}
