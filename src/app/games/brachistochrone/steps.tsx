import type { ReactNode } from "react";

import { ApplicationsSection } from "./components/applications-section";
import { BuilderNote } from "./components/builder-note";
import { PersonPreviewCard } from "./components/person-preview-card";
import { PortraitMedallion } from "./components/portrait-medallion";
import { VideoEmbed } from "./components/video-embed";
import { WheelDiagram } from "./components/wheel-diagram";
import { historicalFigures } from "./historical-figures";
import type { CurveId } from "./use-brachistochrone-sim";

export type StepInteraction = "drag-only" | "guess-race" | "draw-and-race" | "none";

export interface StepConfig {
  id: string;
  title: string;
  label: string;
  accent: string;
  unlockedCurves: CurveId[];
  interaction: StepInteraction;
  content: ReactNode;
  /** Optional large-scale visual shown beside the prose on wide screens. */
  visual?: ReactNode;
  /** Optional content rendered in its own section below the main colored panel — for steps with more than one "beat" of content, so it isn't all crammed into one box. */
  afterContent?: ReactNode;
  /** Skip the narrow reading-width cap — for steps whose content is a grid/layout rather than prose. */
  fullWidthContent?: boolean;
}

export const STEPS: StepConfig[] = [
  {
    id: "puzzle",
    title: "The puzzle",
    label: "The puzzle",
    accent: "bg-tile-1",
    unlockedCurves: ["line"],
    interaction: "drag-only",
    content: (
      <>
        <p>
          Two kids, two playground slides. Same start. Same end, on the ground. One slide is
          straight. The other curves — steep at first, then flat near the bottom.
        </p>
        <p className="text-foreground/70">
          Which kid lands first? Most people say the straight one. Shortest path, right?
        </p>
        <p>
          Drag the two dots below and set up your own straight slide. Then hit Next to meet the man
          who turned this into one of the most famous puzzles in the history of math.
        </p>
      </>
    ),
  },
  {
    id: "newton",
    title: "Newton's answer",
    label: "Newton's answer",
    accent: "bg-tile-3",
    unlockedCurves: ["line", "cycloid"],
    interaction: "guess-race",
    content: (
      <>
        <p>
          In June 1696, <PersonPreviewCard figure={historicalFigures.bernoulli!} /> published a
          challenge in a journal called <em>Acta Eruditorum</em>: bend a wire into any shape you
          like. Which shape gets a bead to the bottom fastest, pulled by gravity alone, no friction
          anywhere?
        </p>
        <p>
          He gave the field six months. Word reached{" "}
          <PersonPreviewCard figure={historicalFigures.newton!} /> in London, who by then had mostly
          traded mathematics for running the Royal Mint. He read the problem after a full day of
          work — and had a solution before he went to bed that night. He mailed it back without
          signing his name.
        </p>
        <p className="text-foreground/70">
          Bernoulli read the unsigned solution and knew immediately who&rsquo;d sent it. &ldquo;I
          recognize the lion by his claw,&rdquo; he said. The winning shape is a cycloid — the exact
          path traced by a single point on the rim of a wheel as it rolls.
        </p>
        <VideoEmbed videoId="Cld0p3a43fU" title="The Brachistochrone, with Steven Strogatz" />
        <p>Guess whether the straight slide or the cycloid wins, then race them.</p>
      </>
    ),
    visual: (
      <div className="flex flex-col items-center gap-5">
        <WheelDiagram className="text-foreground w-full max-w-sm" />
        <div className="flex gap-6">
          <PortraitMedallion figure={historicalFigures.bernoulli!} rotate="-rotate-3" />
          <PortraitMedallion figure={historicalFigures.newton!} rotate="rotate-3" />
        </div>
      </div>
    ),
  },
  {
    id: "circle",
    title: "Is a circle just as good?",
    label: "The circle",
    accent: "bg-tile-2",
    unlockedCurves: ["line", "arc", "cycloid"],
    interaction: "guess-race",
    content: (
      <>
        <p>
          A straight line was never going to win. But what about the steepest possible drop — a
          slide shaped like the edge of a circle, dropping hard right from the start? That was the
          other obvious guess.
        </p>
        <p>
          Bernoulli solved the real puzzle by borrowing a trick from light. Light bends when it
          passes from air into water, because the bent path gets there faster than a straight line
          would. He treated the falling bead the same way: as a beam of light passing through glass
          that kept getting thinner, speeding up the whole way down. The cycloid is the path that
          beam would trace.
        </p>
        <p className="text-foreground/70">
          The cycloid holds one more surprise. Drop a bead from any point on the curve, not just the
          top, and it reaches the bottom in the same amount of time as a bead dropped from anywhere
          else on that same curve. Two beads, two different heights, one finish line.
        </p>
        <p>Guess which of the three paths wins, then race them.</p>
      </>
    ),
  },
  {
    id: "draw",
    title: "Draw your own",
    label: "Draw your own",
    accent: "bg-tile-4",
    unlockedCurves: ["line", "arc", "cycloid", "custom"],
    interaction: "draw-and-race",
    content: (
      <>
        <p>You&rsquo;ve watched the cycloid win twice. Think you can beat it?</p>
        <p>
          Add a few points to the track below and drag them into whatever shape you like. Race it
          against the other three — no hints on why it wins or loses. Just try, look, and try again.
        </p>
      </>
    ),
  },
  {
    id: "applications",
    title: "Where this shows up",
    label: "Real world",
    accent: "bg-tile-5",
    unlockedCurves: ["line", "arc", "cycloid", "custom"],
    interaction: "none",
    fullWidthContent: true,
    content: <ApplicationsSection />,
    afterContent: (
      <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr] lg:items-start">
        <VideoEmbed
          videoId="Q10_srZ-pbs"
          title="The Closest We've Come to a Theory of Everything"
          eyebrow="One more rabbit hole"
        />
        <BuilderNote />
      </div>
    ),
  },
];
