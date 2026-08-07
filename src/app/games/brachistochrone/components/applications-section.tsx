import { Route } from "lucide-react";

import { AnnotatedPhoto } from "./annotated-photo";

export function ApplicationsSection() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <p className="font-heading text-sm font-medium">Slides and chutes</p>
          <AnnotatedPhoto
            src="/games/brachistochrone/applications/slide.jpg"
            alt="A playground slide with a curved chute"
            credit="Photo: ElsaEsthers, CC BY-SA 3.0, via Wikimedia Commons"
            rotation="-rotate-1"
            markers={[{ x: 34, y: 62, label: "steep, then flattens", side: "right" }]}
          />
          <p className="text-foreground/80 text-sm leading-relaxed">
            A slide that drops steep at the top and flattens near the bottom moves a kid faster than
            one that holds a steady angle the whole way down — the same tradeoff that wins the race
            in this game.
          </p>
        </div>

        <div className="space-y-2">
          <p className="font-heading text-sm font-medium">Roller coaster first drops</p>
          <AnnotatedPhoto
            src="/games/brachistochrone/applications/coaster-drop.jpg"
            alt="A roller coaster train descending its first steep drop"
            credit="Photo: Jason Zhang, CC BY-SA 3.0, via Wikimedia Commons"
            rotation="rotate-1"
            markers={[{ x: 55, y: 45, label: "shape sets the g-force", side: "left" }]}
          />
          <p className="text-foreground/80 text-sm leading-relaxed">
            A coaster&rsquo;s first hill isn&rsquo;t just steep for the thrill — its exact curve
            controls how fast the train picks up speed and how hard the drop pulls on the riders.
          </p>
        </div>

        <div className="space-y-2">
          <p className="font-heading text-sm font-medium">Bernoulli&rsquo;s trick, reused</p>
          <AnnotatedPhoto
            src="/games/brachistochrone/applications/refraction.jpg"
            alt="A pencil appearing bent where it enters a glass of water"
            credit="Photo: ShineÆXLVII, CC BY-SA 4.0, via Wikimedia Commons"
            rotation="-rotate-1"
            markers={[{ x: 57, y: 50, label: "the bend, right at the surface", side: "left" }]}
          />
          <p className="text-foreground/80 text-sm leading-relaxed">
            Light does the same trick as the fastest slide: it bends where it crosses from air into
            water, because the bent path gets there faster than a straight one would. That&rsquo;s
            the exact idea Bernoulli borrowed to solve the puzzle.
          </p>
        </div>

        <div className="space-y-2">
          <p className="font-heading text-sm font-medium">Optimal control</p>
          <AnnotatedPhoto
            src="/games/brachistochrone/applications/rocket-launch.jpg"
            alt="A rocket lifting off from its launch pad"
            credit="Photo: Bill Ingalls / NASA, public domain"
            rotation="rotate-1"
            markers={[{ x: 53, y: 20, label: "same math, different direction", side: "right" }]}
          />
          <p className="text-foreground/80 text-sm leading-relaxed">
            The same kind of math that finds the fastest slide shape also finds the best ascent path
            for a rocket, or a smooth route for a self-driving car — a field called optimal control
            that traces straight back to Bernoulli&rsquo;s bead.
          </p>
        </div>
      </div>

      <div className="bg-tile-5/40 border-foreground/80 rounded-xl border-2 p-4 shadow-sm sm:p-5">
        <div className="border-foreground/80 bg-background mb-2 inline-flex size-9 items-center justify-center rounded-full border-2">
          <Route className="text-foreground size-4.5" aria-hidden />
        </div>
        <p className="font-heading text-sm font-medium">The Principle of Least Action</p>
        <p className="text-foreground/80 mt-1 text-sm leading-relaxed">
          Every example above is one small case of a much bigger idea: nature tends to take the path
          that costs the least of something, called action. Mathematicians who came after Bernoulli,
          Leonhard Euler and Joseph-Louis Lagrange among them, spent the next hundred years turning
          that idea into the backbone of physics.
        </p>
      </div>
    </div>
  );
}
