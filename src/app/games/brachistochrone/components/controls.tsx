"use client";

import { Play } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { CurveId, SimPhase } from "../use-brachistochrone-sim";

interface ControlsProps {
  phase: SimPhase;
  guess: CurveId | null;
  customPointCount: number;
  allowCustom: boolean;
  onAddCustomPoint: () => void;
  onRemoveCustomPoint: () => void;
  onStartRace: () => void;
  onReset: () => void;
}

const MAX_CUSTOM_POINTS = 4;

export function Controls({
  phase,
  guess,
  customPointCount,
  allowCustom,
  onAddCustomPoint,
  onRemoveCustomPoint,
  onStartRace,
  onReset,
}: ControlsProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-2">
        {allowCustom && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onAddCustomPoint}
            disabled={phase === "racing" || customPointCount >= MAX_CUSTOM_POINTS}
          >
            {customPointCount === 0 ? "Draw your own path" : "Add a point"}
          </Button>
        )}
        {allowCustom && customPointCount > 0 && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onRemoveCustomPoint}
            disabled={phase === "racing"}
          >
            Remove last point
          </Button>
        )}
        <Button type="button" variant="ghost" size="sm" onClick={onReset}>
          Reset
        </Button>
      </div>

      {/* The one button that matters most on this step — kept visually
          distinct (bigger, brand-colored, with an icon) from the neutral
          "Next" step-nav button so racing and advancing never get mixed up. */}
      <Button
        type="button"
        className="bg-brand text-brand-foreground hover:bg-brand/90"
        onClick={onStartRace}
        disabled={guess === null || phase === "racing"}
      >
        <Play className="size-4" aria-hidden />
        Race
      </Button>
    </div>
  );
}
