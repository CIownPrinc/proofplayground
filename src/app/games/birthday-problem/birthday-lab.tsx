"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Cake, ChevronRight, PartyPopper, RotateCcw, Sparkles, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { unlockAchievement } from "@/hooks/use-achievements";
import { cn } from "@/lib/utils";

import {
  distributionFor,
  drawBirthday,
  exactCollisionProbability,
  exactUniformCollisionProbability,
  labelForDay,
  simulateBirthdayRooms,
  type BirthdayDistribution,
} from "./birthday-math";

const GUESS_ANCHORS = [10, 23, 50, 100, 182, 365] as const;

const NAMES = [
  "Maya", "Theo", "Jules", "Noor", "Sam", "Inez", "Parker", "Kai", "Bri", "Omar", "Wren", "Zoe",
  "Rory", "June", "Milo", "Ari", "Cleo", "Ben", "Tess", "Leo", "Nia", "Max", "Elle", "Sol",
];
const CARD_TILES = ["bg-tile-1", "bg-tile-3", "bg-tile-4", "bg-tile-5", "bg-tile-6", "bg-tile-2"];
const GUEST_SPRITE_POSITIONS = ["0% 0%", "50% 0%", "100% 0%", "0% 100%", "50% 100%", "100% 100%"];
const PARTY_MOMENTS = [
  "The cake is on the table. The doorbell is waiting.",
  "brought a balloon and is looking for the cake.",
  "came in with a party hat that keeps falling over.",
  "put a gift by the tree and asked where the music is.",
  "has already found the snack table.",
  "is teaching everyone a strange hand-clap game.",
  "says they know a shortcut to the best slice of cake.",
  "brought streamers. The lawn is getting festive.",
] as const;
const PARTY_SPOTS = [
  { left: "10%", top: "12%" }, { left: "29%", top: "9%" }, { left: "48%", top: "15%" },
  { left: "67%", top: "10%" }, { left: "13%", top: "38%" }, { left: "32%", top: "34%" },
  { left: "51%", top: "39%" }, { left: "70%", top: "34%" }, { left: "6%", top: "62%" },
  { left: "24%", top: "59%" }, { left: "43%", top: "64%" }, { left: "61%", top: "60%" },
  { left: "78%", top: "58%" }, { left: "16%", top: "84%" }, { left: "35%", top: "81%" },
  { left: "54%", top: "86%" }, { left: "72%", top: "81%" }, { left: "86%", top: "37%" },
  { left: "83%", top: "16%" }, { left: "2%", top: "30%" }, { left: "41%", top: "22%" },
  { left: "60%", top: "24%" }, { left: "78%", top: "72%" },
] as const;

interface Guest {
  name: string;
  birthday: number;
}

function pct(value: number) {
  return new Intl.NumberFormat("en-US", { style: "percent", maximumFractionDigits: 1 }).format(value);
}

function matchingDays(guests: Guest[]) {
  const counts = new Map<number, number>();
  for (const guest of guests) counts.set(guest.birthday, (counts.get(guest.birthday) ?? 0) + 1);
  return new Set([...counts].filter(([, count]) => count > 1).map(([day]) => day));
}

// The first two guests whose birthdays collide — used to pick out one line
// in the web of connections below instead of leaving the payoff as text.
function findMatchedPair(guests: Guest[]): [number, number] | null {
  const seen = new Map<number, number>();
  for (let i = 0; i < guests.length; i += 1) {
    const day = guests[i]!.birthday;
    const firstIndex = seen.get(day);
    if (firstIndex !== undefined) return [firstIndex, i];
    seen.set(day, i);
  }
  return null;
}

// The actual "why" — every guest checks against every earlier guest, so the
// number of live comparisons grows as a web, not a list. Drawn live as
// guests arrive, this is the pairs-not-people effect made visible instead of
// asserted in a sentence about "253 possible pairs."
function ConnectionsWeb({ guests, matchedPair }: { guests: Guest[]; matchedPair: [number, number] | null }) {
  const matchKey = matchedPair ? `${matchedPair[0]}-${matchedPair[1]}` : null;
  return (
    <svg
      className="pointer-events-none absolute inset-0 size-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden
    >
      {guests.map((_, i) =>
        guests.slice(i + 1).map((_, offset) => {
          const j = i + 1 + offset;
          const key = `${i}-${j}`;
          const a = PARTY_SPOTS[i]!;
          const b = PARTY_SPOTS[j]!;
          const isMatchLine = key === matchKey;
          return (
            <line
              key={key}
              x1={parseFloat(a.left)}
              y1={parseFloat(a.top)}
              x2={parseFloat(b.left)}
              y2={parseFloat(b.top)}
              stroke={isMatchLine ? "var(--brand)" : "var(--foreground)"}
              strokeWidth={isMatchLine ? 2.5 : 1}
              opacity={isMatchLine ? 0.9 : 0.12}
              vectorEffect="non-scaling-stroke"
            />
          );
        }),
      )}
    </svg>
  );
}

// The character sheet is a 3x2 grid of square cells, so the crop box must
// stay square too — a non-square box here is what made guests look smeared
// rather than just small.
function Face({ index, className }: { index: number; className?: string }) {
  return (
    <span
      className={cn("block shrink-0 bg-[length:300%_200%] bg-no-repeat", className)}
      style={{
        backgroundImage: "url('/games/birthday-problem/party-guests.png')",
        backgroundPosition: GUEST_SPRITE_POSITIONS[index % GUEST_SPRITE_POSITIONS.length],
      }}
      aria-hidden
    />
  );
}

export function BirthdayLab() {
  const [distribution, setDistribution] = useState<BirthdayDistribution>("uniform");
  const [guests, setGuests] = useState<Guest[]>([]);
  const [started, setStarted] = useState(false);
  const [guessCount, setGuessCount] = useState<number | null>(null);
  const [matchedAt, setMatchedAt] = useState<number | null>(null);
  const [sample, setSample] = useState<{ rate: number; rooms: number } | null>(null);
  const [exploreSize, setExploreSize] = useState(23);

  const weights = useMemo(() => distributionFor(distribution), [distribution]);
  const matches = useMemo(() => matchingDays(guests), [guests]);
  const matchedPair = useMemo(() => findMatchedPair(guests), [guests]);
  const hasMatch = matches.size > 0;
  const pairCount = (guests.length * (guests.length - 1)) / 2;
  const lessonSize = matchedAt ?? guests.length;
  const canContinueLesson = hasMatch || guests.length >= 23;
  const nextSpot = PARTY_SPOTS[Math.min(guests.length, PARTY_SPOTS.length - 1)]!;
  const newestGuest = guests.at(-1);
  const explorePct = useMemo(() => exactUniformCollisionProbability(exploreSize), [exploreSize]);
  const explorePairCount = (exploreSize * (exploreSize - 1)) / 2;
  const realWorld23Pct = useMemo(
    () => exactCollisionProbability(23, distributionFor("us-pattern")),
    [],
  );

  useEffect(() => {
    if (hasMatch) unlockAchievement("birthday-lab-match");
  }, [hasMatch]);

  useEffect(() => {
    if (guests.length >= 23) unlockAchievement("birthday-lab-23");
  }, [guests.length]);

  function startParty() {
    if (guessCount === null) return;
    setStarted(true);
    setMatchedAt(null);
    setGuests([{ name: "You", birthday: drawBirthday(weights) }]);
    setSample(null);
  }

  function inviteGuests(amount: number) {
    const openSeats = Math.max(0, 75 - guests.length);
    const next = [...guests];
    for (let i = 0; i < Math.min(amount, openSeats); i += 1) {
      const index = next.length;
      next.push({ name: NAMES[(index - 1) % NAMES.length]!, birthday: drawBirthday(weights) });
    }
    setGuests(next);
    if (matchedAt === null && matchingDays(next).size > 0) {
      setMatchedAt(next.length);
    }
  }

  function resetParty() {
    setStarted(false);
    setGuessCount(null);
    setMatchedAt(null);
    setGuests([]);
    setSample(null);
  }

  function switchDistribution(next: BirthdayDistribution) {
    setDistribution(next);
    if (next === "us-pattern") unlockAchievement("birthday-lab-real");
    if (started) {
      setGuests([{ name: "You", birthday: drawBirthday(distributionFor(next)) }]);
      setSample(null);
    }
  }

  function surveyParties() {
    const result = simulateBirthdayRooms(Math.max(guests.length, 2), weights, 1_000);
    setSample({ rate: result.collisionRate, rooms: 1_000 });
  }

  const status = !started
    ? "Before anyone arrives, this sounds impossible."
    : hasMatch
      ? "Hold the balloons — we found a matching pair!"
      : guests.length === 1
        ? "The first guest is here. Ring again."
        : guests.length < 6
          ? "A few guests in. A match still feels impossible."
          : guests.length < 12
            ? "The lawn is filling up. Every new guest checks every old card."
            : guests.length < 23
              ? "This is getting suspicious. Keep ringing."
              : "Still no match in this one party. That is completely normal — try the whole neighborhood.";

  if (!started) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 sm:items-center">
        <div className="bg-background border-foreground/80 -rotate-1 rounded-2xl border-2 p-2.5 shadow-sm sm:p-3">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
            <Image
              src="/games/birthday-problem/garden-party-paper.png"
              alt="A backyard birthday party, decorated and waiting for guests"
              fill
              sizes="(max-width: 640px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </div>
        </div>

        <div className="border-foreground/80 bg-tile-1/40 flex flex-col items-start gap-4 rounded-2xl border-2 p-6">
          <div className="flex -space-x-3">
            {[1, 3, 0].map((spriteIndex) => (
              <Face
                key={spriteIndex}
                index={spriteIndex}
                className="border-background size-16 rounded-full border-2 shadow-sm"
              />
            ))}
          </div>
          <div>
            <h2 className="font-heading text-2xl font-semibold">You&apos;re hosting.</h2>
            <p className="text-foreground/80 mt-2 leading-relaxed">
              Before you ring the bell — how many guests do you think it takes before two of them
              share a birthday?
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {GUESS_ANCHORS.map((n) => (
              <Button
                key={n}
                type="button"
                variant={guessCount === n ? "default" : "outline"}
                size="sm"
                className={guessCount === n ? "bg-brand text-brand-foreground hover:bg-brand/90" : undefined}
                onClick={() => setGuessCount(n)}
              >
                {n}
              </Button>
            ))}
          </div>
          <Button
            type="button"
            onClick={startParty}
            disabled={guessCount === null}
            className="bg-brand text-brand-foreground hover:bg-brand/90"
          >
            {guessCount === null ? "Pick a guess first" : `Open the door — I say ${guessCount}`}
            <ChevronRight className="size-4" aria-hidden />
          </Button>
          <p className="text-foreground/60 text-sm">No formulas yet — just a guess, then a party.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
      <div className="space-y-4">
        <div className="border-foreground/80 bg-background flex flex-wrap items-start justify-between gap-4 rounded-2xl border-2 p-4 shadow-sm">
          <div>
            <p className="font-heading text-xl font-semibold">{status}</p>
            <p className="text-foreground/70 mt-1 text-sm">
              {guests.length === 1
                ? "You have the first birthday card. One card cannot match itself."
                : `${newestGuest?.name} ${PARTY_MOMENTS[(guests.length - 1) % (PARTY_MOMENTS.length - 1) + 1]}`}
            </p>
            <p className="text-foreground/50 mt-1.5 font-mono text-xs">
              {guests.length} guests · {pairCount.toLocaleString()} possible pairs
            </p>
          </div>
          <div className="flex shrink-0 gap-2">
            {guests.length < 23 && (
              <Button type="button" variant="outline" size="sm" onClick={() => inviteGuests(5)}>
                <UserPlus className="size-3.5" aria-hidden />
                Invite 5 at once
              </Button>
            )}
            <Button type="button" variant="outline" size="sm" onClick={resetParty}>
              <RotateCcw className="size-3.5" aria-hidden />
              New party
            </Button>
          </div>
        </div>

        {hasMatch && matchedAt !== null && (
          <div className="animate-in zoom-in-95 fade-in border-foreground/80 bg-tile-4/50 relative rounded-2xl border-2 p-5">
            <PartyPopper className="text-foreground/70 absolute top-4 right-4 size-6" aria-hidden />
            <p className="font-heading text-xl font-semibold">A match! The party did the thing.</p>
            <p className="mt-1 font-mono text-sm font-bold">
              You guessed {guessCount}. It actually took{" "}
              <span className="text-brand">{matchedAt}</span>
              {guessCount !== null && matchedAt < guessCount
                ? " — way sooner."
                : guessCount !== null && matchedAt > guessCount
                  ? " — later than you expected."
                  : ". Right on the nose."}
            </p>
            <p className="text-foreground/80 mt-2 max-w-xl text-sm leading-relaxed">
              You didn&rsquo;t need to match <em>your</em> birthday — that&rsquo;s the highlighted
              line on the lawn below. Any two of those {pairCount.toLocaleString()} connections
              could have lit up, and one did.
            </p>
          </div>
        )}

        <div className="border-foreground/80 bg-tile-2/30 relative mt-2 h-[440px] overflow-hidden rounded-2xl border-2">
          <ConnectionsWeb guests={guests} matchedPair={matchedPair} />
          {guests.map((guest, index) => {
            const isMatch = matches.has(guest.birthday);
            const spot = PARTY_SPOTS[index]!;
            return (
              <article
                key={`${guest.name}-${index}`}
                className={cn(
                  "animate-in fade-in zoom-in-95 border-foreground/80 absolute w-24 -translate-x-1/2 -translate-y-1/2 rounded-xl border-2 p-1.5 shadow-sm",
                  CARD_TILES[index % CARD_TILES.length],
                  isMatch && "ring-brand ring-2 ring-offset-2",
                )}
                style={{ left: spot.left, top: spot.top }}
              >
                {isMatch && (
                  <span className="bg-brand text-brand-foreground border-foreground/80 absolute -top-2.5 -right-2 rotate-6 rounded-full border px-1.5 py-0.5 font-mono text-[9px] font-bold">
                    MATCH
                  </span>
                )}
                <div className="flex items-center justify-between">
                  <Face index={index} className="border-foreground/60 size-9 rounded-full border" />
                  <span className="text-foreground/50 font-mono text-[10px]">#{index + 1}</span>
                </div>
                <p className="font-heading mt-1.5 truncate text-sm leading-none font-semibold">
                  {guest.name}
                </p>
                <p className="text-foreground/70 mt-0.5 font-mono text-[10px]">
                  {labelForDay(guest.birthday)}
                </p>
              </article>
            );
          })}
          {guests.length < 23 && (
            <button
              type="button"
              onClick={() => inviteGuests(1)}
              className="border-foreground/50 bg-background/90 hover:bg-background absolute flex size-24 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border-2 border-dashed p-2 text-center text-sm font-medium shadow-sm transition-transform hover:scale-105"
              style={nextSpot}
            >
              <span className="text-xl leading-none" aria-hidden>
                +
              </span>
              put a friend here
            </button>
          )}
        </div>

        {guests.length < 23 && (
          <p className="text-foreground/60 text-center text-sm">Pick the next open spot on the lawn.</p>
        )}

        {canContinueLesson && (
          <div className="animate-in fade-in border-foreground/80 bg-tile-1/40 rounded-2xl border-2 p-5">
            <p className="font-heading text-lg font-semibold">Was that luck?</p>
            <p className="text-foreground/80 mt-1 max-w-2xl text-sm leading-relaxed">
              One party can go either way. Ask the whole neighborhood what happens when every party
              has {lessonSize} guests.
            </p>
            <Button type="button" onClick={surveyParties} className="mt-3">
              <Sparkles className="size-4" aria-hidden />
              Fast-forward 1,000 parties
            </Button>
            {sample && (
              <p className="animate-in fade-in border-foreground/80 bg-background mt-4 rounded-xl border-2 px-4 py-3 text-sm">
                {Math.round(sample.rate * sample.rooms).toLocaleString()} of{" "}
                {sample.rooms.toLocaleString()} parties had a match. That&rsquo;s{" "}
                <span className="text-brand font-semibold">{pct(sample.rate)}</span>.
              </p>
            )}
          </div>
        )}

        {sample && (
          <div className="animate-in slide-in-from-bottom-3 fade-in border-foreground/80 bg-tile-6/40 rounded-2xl border-2 p-5">
            <p className="font-heading text-lg font-semibold">Now try other guest lists.</p>
            <p className="text-foreground/70 mt-1 text-sm">
              Before reading on — drag this and see where the odds actually move.
            </p>
            <div className="border-foreground/80 bg-background mt-3 rounded-xl border-2 p-4">
              <div className="flex items-baseline justify-between gap-2">
                <label htmlFor="explore-size" className="font-heading text-sm font-semibold">
                  Guest list size
                </label>
                <span className="font-mono text-lg font-bold">
                  {exploreSize} guests · <span className="text-brand">{pct(explorePct)}</span>
                </span>
              </div>
              <input
                id="explore-size"
                type="range"
                min={1}
                max={100}
                value={exploreSize}
                onChange={(event) => setExploreSize(Number(event.target.value))}
                className="mt-3 w-full"
                style={{ accentColor: "var(--brand)" }}
              />
              <div className="border-foreground/40 bg-tile-2/20 mt-2 h-3 overflow-hidden rounded-full border">
                <div
                  className="bg-brand h-full transition-[width]"
                  style={{ width: `${explorePct * 100}%` }}
                />
              </div>
              <div className="mt-4">
                <div className="flex items-baseline justify-between gap-3 text-xs">
                  <span className="font-heading font-semibold">The web of possible matches</span>
                  <span className="font-mono">{explorePairCount.toLocaleString()} pairs</span>
                </div>
                <div className="border-foreground/40 bg-background mt-1.5 h-2 overflow-hidden rounded-full border">
                  <div
                    className="bg-foreground/70 h-full transition-[width]"
                    style={{ width: `${(explorePairCount / 4950) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {sample && (
          <div className="animate-in slide-in-from-bottom-3 fade-in border-foreground/80 bg-tile-3/40 rounded-2xl border-2 p-5">
            <p className="font-heading text-lg font-semibold">It&rsquo;s the pairs, not the people.</p>
            <p className="text-foreground/80 mt-2 text-sm leading-relaxed">
              That climb wasn&rsquo;t smooth — it&rsquo;s steepest right around 15&ndash;30 guests. Look
              back at the lawn: every new guest draws a line to every guest already there, not just
              one. At 23 people that&rsquo;s 253 lines, each one its own tiny chance of a match. Ask
              &ldquo;will any of these 253 land&rdquo; instead of &ldquo;will someone match me,&rdquo;
              and 50/50 by 23 stops being strange.
            </p>
            <div className="border-foreground/20 mt-4 border-t pt-4">
              <p className="font-heading font-semibold">One more thing to try: uneven birthdays.</p>
              <p className="text-foreground/70 mt-1 text-sm leading-relaxed">
                Real birthdays aren&rsquo;t spread evenly across the year. Toggle the bowl, compare the
                23-guest odds, and decide why the change is so small.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant={distribution === "uniform" ? "default" : "outline"}
                  className={distribution === "uniform" ? "bg-brand text-brand-foreground hover:bg-brand/90" : undefined}
                  onClick={() => switchDistribution("uniform")}
                >
                  Keep every day equal
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={distribution === "us-pattern" ? "default" : "outline"}
                  className={distribution === "us-pattern" ? "bg-brand text-brand-foreground hover:bg-brand/90" : undefined}
                  onClick={() => switchDistribution("us-pattern")}
                >
                  Try a real-world-ish bowl
                </Button>
              </div>
              <p className="text-foreground/70 mt-3 font-mono text-xs">
                At 23 guests: {pct(exactUniformCollisionProbability(23))} with equal birthdays
                {distribution === "us-pattern" && ` → ${pct(realWorld23Pct)} with this uneven bowl`}
              </p>
            </div>
          </div>
        )}
      </div>

      <aside className="border-foreground/80 bg-tile-5/30 h-fit rounded-2xl border-2 p-5">
        <div className="border-foreground/80 bg-background mb-2 inline-flex size-9 items-center justify-center rounded-full border-2">
          <Cake className="text-foreground size-4.5" aria-hidden />
        </div>
        <h2 className="font-heading text-lg font-semibold">Which birthday bowl?</h2>
        <p className="text-foreground/70 mt-1 text-sm leading-relaxed">
          Try the classic puzzle first, then nudge reality into the room.
        </p>
        <div className="mt-4 space-y-2">
          <button
            type="button"
            onClick={() => switchDistribution("uniform")}
            className={cn(
              "border-foreground/80 w-full rounded-xl border-2 p-3 text-left transition-colors",
              distribution === "uniform" ? "bg-tile-1" : "bg-background hover:bg-muted",
            )}
          >
            <strong className="font-heading block text-sm">Every day equal</strong>
            <span className="text-foreground/70 mt-0.5 block text-xs">The classic, clean version.</span>
          </button>
          <button
            type="button"
            onClick={() => switchDistribution("us-pattern")}
            className={cn(
              "border-foreground/80 w-full rounded-xl border-2 p-3 text-left transition-colors",
              distribution === "us-pattern" ? "bg-tile-4" : "bg-background hover:bg-muted",
            )}
          >
            <strong className="font-heading block text-sm">Real-world-ish birthdays</strong>
            <span className="text-foreground/70 mt-0.5 block text-xs">
              Late summer is busier; weekends and holidays are quieter.
            </span>
          </button>
        </div>
        {distribution === "us-pattern" && (
          <p className="border-foreground/20 text-foreground/70 mt-4 rounded-xl border p-3 text-xs leading-relaxed">
            The milestone barely budged. What would have to change about the birthday bowl for it to
            move a lot?
          </p>
        )}
        <div className="border-foreground/20 text-foreground/70 mt-5 border-t pt-4 text-xs leading-relaxed">
          <p className="font-heading text-foreground text-sm">A small clarification</p>
          <p className="mt-1">
            Matching a specific birthday — say, yours — is a different game. It takes about 253
            other people to make that more likely than not.
          </p>
        </div>
      </aside>
    </div>
  );
}
