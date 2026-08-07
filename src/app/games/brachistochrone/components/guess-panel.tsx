"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CURVE_STYLE } from "../curve-style";
import type { CurveId, RaceResult, SimPhase } from "../use-brachistochrone-sim";

interface GuessPanelProps {
  activeCurveIds: CurveId[];
  guess: CurveId | null;
  phase: SimPhase;
  results: RaceResult[] | null;
  onGuess: (id: CurveId) => void;
}

const PLACE_LABEL: Record<number, string> = { 1: "1st", 2: "2nd", 3: "3rd", 4: "4th" };

export function GuessPanel({ activeCurveIds, guess, phase, results, onGuess }: GuessPanelProps) {
  if (phase === "finished" && results) {
    const winner = results.find((result) => result.place === 1);
    const guessedRight = guess !== null && winner?.curveId === guess;
    const guessResult = results.find((result) => result.curveId === guess);
    const customResult = results.find((result) => result.curveId === "custom");
    const customLost = customResult !== undefined && customResult.place !== 1;

    return (
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant={guessedRight ? "default" : "outline"}
            className={guessedRight ? "bg-brand text-brand-foreground" : undefined}
          >
            {guessedRight ? "You called it" : "Not this time"}
          </Badge>
          {!guessedRight && guessResult && (
            <span className="text-muted-foreground text-sm">
              You picked {CURVE_STYLE[guessResult.curveId].label} — it came in{" "}
              {PLACE_LABEL[guessResult.place]}.
            </span>
          )}
        </div>
        <ol className="space-y-1.5">
          {results.map((result) => (
            <li key={result.curveId} className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground w-8 tabular-nums">
                {PLACE_LABEL[result.place]}
              </span>
              <span
                aria-hidden
                className="inline-block size-2.5 rounded-full"
                style={{ backgroundColor: CURVE_STYLE[result.curveId].stroke }}
              />
              <span className="flex-1">{CURVE_STYLE[result.curveId].label}</span>
              <span className="text-muted-foreground tabular-nums">{result.time.toFixed(2)}s</span>
            </li>
          ))}
        </ol>
        {customLost && (
          <p className="text-muted-foreground text-sm italic">
            Curious why your path didn&rsquo;t win? Try reshaping it and racing again.
          </p>
        )}
        {customResult === undefined && (
          <p className="text-muted-foreground border-border border-t pt-3 text-sm leading-relaxed">
            The straight line always loses here — it&rsquo;s the shortest path, but it never speeds
            up early. A curve that drops steeper right at the start trades extra distance for extra
            speed while gravity still has the most pull left to give, and that early boost wins the
            race.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">Which path do you think wins?</p>
      <div className="flex flex-wrap gap-2">
        {activeCurveIds.map((id) => (
          <Button
            key={id}
            type="button"
            variant={guess === id ? "default" : "outline"}
            size="sm"
            className={
              guess === id ? "bg-brand text-brand-foreground hover:bg-brand/90" : undefined
            }
            disabled={phase === "racing"}
            onClick={() => onGuess(id)}
          >
            <span
              aria-hidden
              className="mr-1 inline-block size-2.5 rounded-full"
              style={{ backgroundColor: CURVE_STYLE[id].stroke }}
            />
            {CURVE_STYLE[id].label}
          </Button>
        ))}
      </div>
    </div>
  );
}
