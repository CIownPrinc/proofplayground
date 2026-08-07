import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { BrachistochroneExperience } from "./components/brachistochrone-experience";

export const metadata: Metadata = {
  title: "Race to the Bottom — Proof Playground",
  description:
    "Guess which path down wins — a straight line, a circular arc, a cycloid, or one you draw yourself — then watch them race.",
};

export default function BrachistochronePage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-6 py-16">
      <div>
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground mb-4 inline-flex w-fit items-center gap-1.5 text-sm transition-colors"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Back to Proof Playground
        </Link>
        <div className="flex items-center gap-3">
          <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
            Race to the Bottom
          </h1>
          <span className="border-foreground/80 bg-tile-3 font-heading rounded-full border-2 px-2.5 py-0.5 text-xs font-medium">
            Brachistochrone
          </span>
        </div>
        <p className="text-muted-foreground mt-2 max-w-xl">
          The 1696 puzzle that turned a bead on a wire into the birth of a new kind of math.
        </p>
      </div>

      <BrachistochroneExperience />
    </div>
  );
}
