"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { CompletionSticker } from "@/components/completion-sticker";
import { Button } from "@/components/ui/button";
import { unlockAchievement } from "@/hooks/use-achievements";
import { getAchievement } from "@/lib/achievements";
import { cn } from "@/lib/utils";

const BRACHISTOCHRONE_ACHIEVEMENT = getAchievement("brachistochrone");
import { STEPS } from "../steps";
import { useBrachistochroneSim } from "../use-brachistochrone-sim";
import { Controls } from "./controls";
import { CurveCanvas } from "./curve-canvas";
import { GuessPanel } from "./guess-panel";
import { StepProgress } from "./step-progress";

export function BrachistochroneExperience() {
  const sim = useBrachistochroneSim();
  const [stepIndex, setStepIndex] = useState(0);
  const step = STEPS[stepIndex]!;

  const isFirstStep = stepIndex === 0;
  const isLastStep = stepIndex === STEPS.length - 1;

  const visibleCurveIds = useMemo(
    () => step.unlockedCurves.filter((id) => sim.activeCurveIds.includes(id)),
    [step.unlockedCurves, sim.activeCurveIds],
  );

  // Next only ever unlocks once there's nothing left to skip past on this
  // step — drag-only and read-only steps have no "miss the payoff" risk,
  // guess-and-race steps require an actual finished race first.
  const canAdvance =
    step.interaction === "drag-only" || step.interaction === "none" || sim.phase === "finished";

  function goToStep(index: number) {
    sim.reset();
    setStepIndex(index);
    // The achievement is earned by finishing the whole walkthrough, not just
    // any single race — reaching the last step already implies every
    // guess-and-race step in between was actually raced, since Next stays
    // disabled until each one finishes.
    if (index === STEPS.length - 1) {
      unlockAchievement("brachistochrone");
    }
  }

  return (
    <div className="space-y-6">
      <StepProgress steps={STEPS} currentIndex={stepIndex} onSelect={goToStep} />

      <section
        className={cn(
          "border-foreground/80 space-y-4 rounded-2xl border-2 p-5 sm:p-8",
          step.accent,
        )}
      >
        <h2 className="font-heading text-2xl font-semibold sm:text-3xl">{step.title}</h2>

        {isLastStep && (
          <div className="border-foreground/80 bg-background animate-in zoom-in-75 fade-in slide-in-from-left-2 flex w-fit items-center gap-3 rounded-full border-2 py-1.5 pr-4 pl-1.5 shadow-sm duration-500">
            <CompletionSticker
              icon={BRACHISTOCHRONE_ACHIEVEMENT?.icon}
              color={BRACHISTOCHRONE_ACHIEVEMENT?.color}
              className="size-8 -rotate-6"
            />
            <span className="text-sm font-medium">
              That&rsquo;s yours now — check the sticker book up top. And take a look at the
              homepage.
            </span>
          </div>
        )}

        <div
          className={cn(
            "grid gap-6",
            step.visual ? "lg:grid-cols-[1.2fr_0.8fr] lg:items-center" : "",
          )}
        >
          <div
            className={cn(
              "space-y-3 leading-relaxed",
              !step.visual && !step.fullWidthContent && "max-w-2xl",
            )}
          >
            {step.content}
          </div>
          {step.visual && <div className="flex justify-center">{step.visual}</div>}
        </div>
      </section>

      {step.afterContent && <section>{step.afterContent}</section>}

      {step.interaction !== "none" && (
        <section className="border-foreground/80 bg-background space-y-4 rounded-2xl border-2 p-4 sm:p-6">
          <CurveCanvas
            start={sim.start}
            end={sim.end}
            customPoints={sim.customPoints}
            curves={sim.curves}
            activeCurveIds={visibleCurveIds}
            ballPositions={sim.ballPositions}
            phase={sim.phase}
            guess={sim.guess}
            onStartChange={sim.setStart}
            onEndChange={sim.setEnd}
            onCustomPointChange={sim.setCustomPoint}
          />

          {step.interaction !== "drag-only" && (
            <>
              <Controls
                phase={sim.phase}
                guess={sim.guess}
                customPointCount={sim.customPoints.length}
                allowCustom={step.interaction === "draw-and-race"}
                onAddCustomPoint={sim.addCustomPoint}
                onRemoveCustomPoint={() => sim.removeCustomPoint(sim.customPoints.length - 1)}
                onStartRace={() => sim.startRace(visibleCurveIds)}
                onReset={sim.reset}
              />
              <GuessPanel
                activeCurveIds={visibleCurveIds}
                guess={sim.guess}
                phase={sim.phase}
                results={sim.results}
                onGuess={sim.setGuess}
              />
            </>
          )}
        </section>
      )}

      <div className="flex items-center justify-between pt-1">
        <Button
          type="button"
          variant="outline"
          onClick={() => goToStep(stepIndex - 1)}
          disabled={isFirstStep}
        >
          <ArrowLeft className="size-4" aria-hidden />
          Back
        </Button>
        {!isLastStep && (
          <div className="flex flex-col items-end gap-1">
            <Button
              type="button"
              variant="secondary"
              onClick={() => goToStep(stepIndex + 1)}
              disabled={!canAdvance}
            >
              Next
              <ArrowRight className="size-4" aria-hidden />
            </Button>
            {!canAdvance && (
              <span className="text-foreground/50 text-xs">Race first to continue</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
