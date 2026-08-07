"use client";

import Image from "next/image";
import { PreviewCard } from "@base-ui/react/preview-card";

import { cn } from "@/lib/utils";
import type { HistoricalFigure } from "../historical-figures";

interface PersonPreviewCardProps {
  figure: HistoricalFigure;
  className?: string;
}

export function PersonPreviewCard({ figure, className }: PersonPreviewCardProps) {
  return (
    <PreviewCard.Root>
      <PreviewCard.Trigger
        href={figure.wikipediaUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "decoration-muted-foreground/50 hover:decoration-foreground underline decoration-dotted underline-offset-4",
          className,
        )}
      >
        {figure.name}
      </PreviewCard.Trigger>
      <PreviewCard.Portal>
        <PreviewCard.Positioner sideOffset={8} className="z-50">
          <PreviewCard.Popup className="bg-popover text-popover-foreground ring-foreground/10 w-72 rounded-xl p-4 text-sm ring-1 [box-shadow:var(--shadow-lg,0_10px_30px_-10px_rgb(0_0_0/0.3))]">
            <div className="flex items-center gap-3">
              <Image
                src={figure.portraitSrc}
                alt={figure.portraitAlt}
                width={56}
                height={56}
                className="ring-foreground/10 h-14 w-14 rounded-full object-cover ring-1"
              />
              <div>
                <p className="font-heading text-base leading-snug font-medium">{figure.name}</p>
                <p className="text-muted-foreground text-xs">{figure.years}</p>
              </div>
            </div>
            <p className="text-muted-foreground mt-3">{figure.blurb}</p>
            <ul className="mt-3 space-y-1">
              {figure.accomplishments.map((accomplishment) => (
                <li key={accomplishment} className="flex gap-2">
                  <span aria-hidden className="text-muted-foreground">
                    ·
                  </span>
                  <span>{accomplishment}</span>
                </li>
              ))}
            </ul>
          </PreviewCard.Popup>
        </PreviewCard.Positioner>
      </PreviewCard.Portal>
    </PreviewCard.Root>
  );
}
