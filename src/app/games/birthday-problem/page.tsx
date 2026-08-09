import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { BirthdayLab } from "./birthday-lab";

export const metadata: Metadata = {
  title: "The 23rd Guest — Proof Playground",
  description: "Explore why a group of only 23 people is enough to make a shared birthday likely.",
};

export default function BirthdayProblemPage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-6 py-10 sm:py-16">
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
            The 23rd Guest
          </h1>
          <span className="border-foreground/80 bg-tile-4 font-heading rounded-full border-2 px-2.5 py-0.5 text-xs font-medium">
            Birthday Paradox
          </span>
        </div>
        <p className="text-muted-foreground mt-2 max-w-xl">
          Can you get two guests to share a birthday before the guest list hits 23?
        </p>
      </div>

      <BirthdayLab />
    </div>
  );
}
