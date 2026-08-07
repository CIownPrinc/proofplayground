import Image from "next/image";

import type { HistoricalFigure } from "../historical-figures";

interface PortraitMedallionProps {
  figure: HistoricalFigure;
  className?: string;
  rotate?: string;
}

// A real photo in a chunky ring frame, matching the site's thick-outline
// pastel-card language instead of a cartoon mascot.
export function PortraitMedallion({
  figure,
  className,
  rotate = "-rotate-3",
}: PortraitMedallionProps) {
  return (
    <div className={className}>
      <div className={`border-foreground/80 overflow-hidden rounded-full border-4 ${rotate}`}>
        <Image
          src={figure.portraitSrc}
          alt={figure.portraitAlt}
          width={88}
          height={88}
          className="aspect-square size-full object-cover"
        />
      </div>
      <p className="font-heading mt-1.5 text-center text-xs font-medium">{figure.name}</p>
    </div>
  );
}
