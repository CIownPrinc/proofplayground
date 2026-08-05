export function SiteHeader() {
  return (
    <header className="flex flex-col items-center gap-3 pt-16 pb-10 text-center sm:pt-24 sm:pb-14">
      <div
        aria-hidden
        className="border-foreground flex size-10 items-center justify-center rounded-full border-2 text-sm font-bold"
      >
        P
      </div>
      <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
        PROOF <span className="text-brand">&middot;</span> PLAYGROUND
      </h1>
      <p className="text-muted-foreground max-w-md text-balance">
        Small builds, proofs of concept, and experiments &mdash; logged here as they ship.
      </p>
    </header>
  );
}
