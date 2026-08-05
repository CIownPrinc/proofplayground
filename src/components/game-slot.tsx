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
}

export function GameSlot({ index }: GameSlotProps) {
  const label = String(index).padStart(2, "0");
  const background = TILE_BACKGROUNDS[(index - 1) % TILE_BACKGROUNDS.length];
  const Icon = TILE_ICONS[(index - 1) % TILE_ICONS.length]!;

  return (
    <Card
      className={`${background} border-foreground/80 flex aspect-[5/2] flex-col items-center justify-center gap-2 border-2 py-0 shadow-none transition-transform hover:-translate-y-0.5`}
    >
      <Icon className="text-foreground/40 size-6" aria-hidden />
      <Badge
        variant="outline"
        className="border-foreground/20 bg-background/70 text-foreground/70 font-mono text-[0.7rem] font-normal"
      >
        Slot {label} &middot; Coming soon
      </Badge>
    </Card>
  );
}
