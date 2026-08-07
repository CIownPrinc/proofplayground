"use client";

import { cn } from "@/lib/utils";

interface StepProgressItem {
  id: string;
  label: string;
  accent: string;
}

interface StepProgressProps {
  steps: StepProgressItem[];
  currentIndex: number;
  onSelect: (index: number) => void;
}

export function StepProgress({ steps, currentIndex, onSelect }: StepProgressProps) {
  return (
    <ol className="flex flex-wrap items-center gap-2">
      {steps.map((step, index) => {
        const isCurrent = index === currentIndex;
        const isDone = index < currentIndex;
        const isLocked = index > currentIndex;

        return (
          <li key={step.id}>
            <button
              type="button"
              onClick={() => onSelect(index)}
              disabled={isLocked}
              className={cn(
                "border-foreground/80 flex h-8 items-center gap-1.5 rounded-full border-2 px-3 text-xs font-medium transition-transform active:scale-95",
                isCurrent && `${step.accent} scale-105`,
                isDone && "bg-background text-foreground/70 hover:scale-105",
                isLocked && "border-foreground/15 text-foreground/30 cursor-not-allowed",
              )}
            >
              <span className="font-heading">{index + 1}</span>
              <span className="hidden sm:inline">{step.label}</span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
