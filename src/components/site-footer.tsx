import { Camera, Coffee, Send } from "lucide-react";
import Link from "next/link";
import { NewsletterPill } from "@/components/newsletter-pill";
import { PillPlaceholder } from "@/components/pill-placeholder";

export function SiteFooter() {
  return (
    <footer className="border-border text-muted-foreground mt-auto flex flex-col items-center gap-4 border-t py-10 text-center text-sm">
      <p>This is where I&apos;ll build stuff on the web. Obligatory links:</p>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <NewsletterPill />
        <PillPlaceholder icon={Send} label="Updates" />
        <PillPlaceholder icon={Coffee} label="Support" />
        <a
          href="https://www.instagram.com/aarit.pers/"
          target="_blank"
          rel="noopener noreferrer"
          className="border-border bg-card text-muted-foreground hover:text-foreground hover:border-foreground/40 inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors"
        >
          <Camera className="size-4" aria-hidden />
          Instagram
        </a>
      </div>
      <div className="flex flex-col gap-1 pt-2">
        <p>Contact &mdash; placeholder@proofplayground</p>
        <Link
          href="/privacy"
          className="text-muted-foreground/70 hover:text-foreground text-xs underline-offset-2 transition-colors hover:underline"
        >
          Privacy policy
        </Link>
      </div>
    </footer>
  );
}
