import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface GameSlotProps {
  index: number;
}

export function GameSlot({ index }: GameSlotProps) {
  const label = String(index).padStart(2, "0");

  return (
    <Card className="border-muted-foreground/30 bg-muted/20 hover:border-brand/60 hover:bg-muted/40 flex aspect-video flex-col items-center justify-center gap-3 border-2 border-dashed py-0 shadow-none transition-colors">
      <Plus className="text-muted-foreground/50 size-6" aria-hidden />
      <Badge
        variant="outline"
        className="text-muted-foreground font-mono text-[0.7rem] font-normal"
      >
        Slot {label} &middot; Coming soon
      </Badge>
    </Card>
  );
}
