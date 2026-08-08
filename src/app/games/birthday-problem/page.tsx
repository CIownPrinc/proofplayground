import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { BirthdayLab } from "./birthday-lab";

export const metadata: Metadata = {
  title: "The 23rd Guest - Proof Playground",
  description: "Explore why a group of only 23 people is enough to make a shared birthday likely.",
};

export default function BirthdayProblemPage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-6 py-10 sm:py-16">
      <Link
        href="/"
        className="text-muted-foreground hover:text-foreground inline-flex w-fit items-center gap-1.5 text-sm transition-colors"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Back to Proof Playground
      </Link>
      <BirthdayLab />
    </div>
  );
}
