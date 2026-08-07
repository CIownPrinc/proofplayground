import { PenLine } from "lucide-react";

export function BuilderNote() {
  return (
    <section className="border-foreground/80 bg-tile-6/40 flex h-full flex-col justify-center rounded-2xl border-2 p-5">
      <div className="border-foreground/80 bg-background mb-2 inline-flex size-9 items-center justify-center self-start rounded-full border-2">
        <PenLine className="text-foreground size-4.5" aria-hidden />
      </div>
      <p className="text-sm leading-relaxed">
        <span className="font-heading font-medium">Why this exists:</span>{" "}
        <span className="text-foreground/80">
          I saw the Veritasium video and got curious whether I could actually simulate it myself. I
          started building this, wasn&rsquo;t a good enough programmer yet to finish it, and left it
          alone for about a year. Vibecoding got a lot easier since then, and so did I — so I came
          back, finished it properly, and figured other people might enjoy playing with it too.
        </span>
      </p>
    </section>
  );
}
