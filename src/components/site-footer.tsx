import { Camera, Coffee, Mail, Send } from "lucide-react";
import Link from "next/link";
import { PillPlaceholder } from "@/components/pill-placeholder";

export function SiteFooter() {
  return (
    <footer className="border-border text-muted-foreground mt-auto flex flex-col items-center gap-4 border-t py-10 text-center text-sm">
      <p>This is where I&apos;ll build stuff on the web. Obligatory links:</p>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <PillPlaceholder icon={Mail} label="Newsletter" />
        <PillPlaceholder icon={Send} label="Updates" />
        <PillPlaceholder icon={Coffee} label="Support" />
        <PillPlaceholder icon={Camera} label="Photos" />
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
