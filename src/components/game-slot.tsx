import Image from "next/image";
import Link from "next/link";
import { Beaker, Blocks, Gamepad2, Puzzle, Rocket, Sparkles, type LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

// Full class strings are listed explicitly (not built with string interpolation)
// so Tailwind's compiler can statically find and generate them.
const TILE_BACKGROUNDS = [
  "bg-tile-1",
  "bg-tile-2",
  "bg-tile-3",
  "bg-tile-4",
  "bg-tile-5",
  "bg-tile-6",
];
const TILE_ICONS: LucideIcon[] = [Puzzle, Rocket, Blocks, Sparkles, Beaker, Gamepad2];

interface GameSlotProps {
  index: number;
  href?: string;
  title?: string;
  description?: string;
  thumbnailSrc?: string;
}

export function GameSlot({ index, href, title, description, thumbnailSrc }: GameSlotProps) {
  const label = String(index).padStart(2, "0");
  const background = TILE_BACKGROUNDS[(index - 1) % TILE_BACKGROUNDS.length];
  const Icon = TILE_ICONS[(index - 1) % TILE_ICONS.length]!;

  const card = (
    <Card
      className={`${thumbnailSrc ? "" : background} ${thumbnailSrc ? "aspect-[1745/901]" : "aspect-[5/2]"} border-foreground/80 relative flex flex-col items-center justify-center gap-2 border-2 py-0 shadow-none transition-transform hover:-translate-y-0.5`}
    >
      {thumbnailSrc ? (
        <Image
          src={thumbnailSrc}
          alt={title && description ? `${title} — ${description}` : (title ?? "Game thumbnail")}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
          priority={index === 1}
        />
      ) : (
        <>
          <Icon className="text-foreground/40 size-6" aria-hidden />
          {href ? (
            <div className="flex flex-col items-center gap-1 px-4 text-center">
              <span className="font-heading text-foreground text-sm font-medium">{title}</span>
              {description && <span className="text-foreground/70 text-xs">{description}</span>}
            </div>
          ) : (
            <Badge
              variant="outline"
              className="border-foreground/20 bg-background/70 text-foreground/70 font-mono text-[0.7rem] font-normal"
            >
              Slot {label} &middot; Coming soon
            </Badge>
          )}
        </>
      )}
    </Card>
  );

  if (!href) return card;

  return (
    <Link href={href} className="block">
      {card}
    </Link>
  );
}
