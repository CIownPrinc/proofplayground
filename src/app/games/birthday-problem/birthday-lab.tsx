"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronRight, PartyPopper, RotateCcw, Sparkles } from "lucide-react";

import { unlockAchievement } from "@/hooks/use-achievements";

import {
  distributionFor,
  drawBirthday,
  labelForDay,
  simulateBirthdayRooms,
  type BirthdayDistribution,
} from "./birthday-math";

const NAMES = [
  "Maya", "Theo", "Jules", "Noor", "Sam", "Inez", "Parker", "Kai", "Bri", "Omar", "Wren", "Zoe",
  "Rory", "June", "Milo", "Ari", "Cleo", "Ben", "Tess", "Leo", "Nia", "Max", "Elle", "Sol",
];
const CARD_COLORS = ["#ffe07b", "#b7e5ff", "#f9b7d0", "#c6f0cb", "#d8c5ff", "#ffc898"];
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
  { left: "10%", top: "12%" }, { left: "28%", top: "9%" }, { left: "46%", top: "14%" },
  { left: "64%", top: "10%" }, { left: "12%", top: "36%" }, { left: "30%", top: "32%" },
  { left: "48%", top: "37%" }, { left: "66%", top: "32%" }, { left: "5%", top: "59%" },
  { left: "22%", top: "56%" }, { left: "40%", top: "61%" }, { left: "58%", top: "57%" },
  { left: "74%", top: "56%" }, { left: "14%", top: "79%" }, { left: "32%", top: "76%" },
  { left: "50%", top: "81%" }, { left: "68%", top: "76%" }, { left: "83%", top: "35%" },
  { left: "80%", top: "15%" }, { left: "2%", top: "29%" }, { left: "38%", top: "21%" },
  { left: "56%", top: "23%" }, { left: "74%", top: "70%" },
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

function Face({ index }: { index: number }) {
  return (
    <span
      className="block h-16 w-14 bg-[length:300%_200%] bg-no-repeat"
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
  const [sample, setSample] = useState<{ rate: number; rooms: number } | null>(null);

  const weights = useMemo(() => distributionFor(distribution), [distribution]);
  const matches = useMemo(() => matchingDays(guests), [guests]);
  const hasMatch = matches.size > 0;
  const pairCount = (guests.length * (guests.length - 1)) / 2;
  const nextSpot = PARTY_SPOTS[Math.min(guests.length, PARTY_SPOTS.length - 1)]!;
  const newestGuest = guests.at(-1);

  useEffect(() => {
    if (hasMatch) unlockAchievement("birthday-lab-match");
  }, [hasMatch]);

  useEffect(() => {
    if (guests.length >= 23) unlockAchievement("birthday-lab-23");
  }, [guests.length]);

  function startParty() {
    setStarted(true);
    setGuests([{ name: "You", birthday: drawBirthday(weights) }]);
    setSample(null);
  }

  function inviteGuests(amount: number) {
    setGuests((current) => {
      const openSeats = Math.max(0, 75 - current.length);
      const next = [...current];
      for (let i = 0; i < Math.min(amount, openSeats); i += 1) {
        const index = next.length;
        next.push({ name: NAMES[(index - 1) % NAMES.length]!, birthday: drawBirthday(weights) });
      }
      return next;
    });
  }

  function resetParty() {
    setStarted(false);
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

  return (
    <section className="relative overflow-hidden rounded-[28px] border-[3px] border-slate-950 bg-[#fff4d9] text-slate-950 shadow-[8px_9px_0_#16243d]">
      <div className="relative">
        <header className="relative overflow-hidden border-b-[3px] border-slate-950 bg-[#ffe7a8] px-6 pt-8 pb-12 sm:px-10 sm:pt-12">
          <div className="absolute -top-20 -left-16 size-48 rounded-full border-[3px] border-slate-950 bg-[#f9d552]" />
          <div className="absolute top-5 right-[15%] size-24 rotate-12 rounded-full border-[3px] border-slate-950 bg-[#f5a5ca]" />
          <div className="absolute top-16 right-7 size-16 -rotate-12 rounded-full border-[3px] border-slate-950 bg-[#b9e6a5]" />
          <div className="relative max-w-2xl">
            <p className="inline-flex items-center gap-2 rounded-full border-2 border-slate-950 bg-[#fff4d9] px-3 py-1 font-mono text-xs font-bold tracking-wider uppercase"><PartyPopper className="size-3.5" aria-hidden /> A tiny party game</p>
            <h1 className="mt-4 font-heading text-5xl leading-[0.86] font-bold tracking-tight sm:text-7xl">The 23rd<br /><span className="text-[#d54187]">Guest</span></h1>
            <p className="mt-5 max-w-lg text-lg leading-snug font-medium">Can you get two guests to share a birthday before the guest list hits 23?</p>
          </div>
          <div className="absolute right-6 bottom-0 flex gap-5 text-4xl sm:right-10" aria-hidden><span>🎈</span><span className="translate-y-4">🎈</span><span>🎈</span></div>
        </header>

        <div className="relative">
          <main
            className="relative min-h-[650px] bg-cover bg-center p-5 sm:p-8"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgba(255,244,217,0.12), rgba(255,244,217,0.03)), url('/games/birthday-problem/garden-party-paper.png')",
            }}
          >
            {!started ? (
              <div className="mx-auto flex min-h-[520px] max-w-xl flex-col items-center justify-center rounded-[2rem] border-[3px] border-slate-950 bg-[#fff4d9]/90 p-7 text-center shadow-[6px_7px_0_#16243d] backdrop-blur-[2px]">
                <div className="relative mb-7 flex h-40 w-56 items-end justify-center gap-2 rounded-[45%_45%_12%_12%] border-[3px] border-slate-950 bg-[#f5a5ca] pt-10 shadow-[5px_6px_0_#16243d]">
                  <span className="absolute -top-10 text-7xl">🎂</span>
                  <Face index={1} /><Face index={3} /><Face index={0} />
                </div>
                <h2 className="font-heading text-3xl font-bold">You&apos;re hosting.</h2>
                <p className="mt-3 max-w-md text-base leading-relaxed">Your job is simple: invite people, watch their birthday cards land, and see how long it takes until two dates match.</p>
                <button type="button" onClick={startParty} className="mt-7 inline-flex items-center gap-2 rounded-xl border-[3px] border-slate-950 bg-[#f9d552] px-6 py-3 font-heading text-lg font-bold shadow-[4px_4px_0_#16243d] transition-transform hover:-translate-y-1 active:translate-x-1 active:translate-y-1 active:shadow-none">Open the door <ChevronRight className="size-5" aria-hidden /></button>
                <p className="mt-5 text-sm text-slate-600">No formulas yet. Just throw a party.</p>
              </div>
            ) : (
              <>
                <div className="flex flex-wrap items-start justify-between gap-4 rounded-2xl border-2 border-slate-950 bg-[#fff4d9]/95 p-4 shadow-[3px_3px_0_#16243d]">
                  <div><p className="font-heading text-2xl font-bold">{status}</p><p className="mt-1 text-sm">{guests.length === 1 ? "You have the first birthday card. One card cannot match itself." : `${newestGuest?.name} ${PARTY_MOMENTS[(guests.length - 1) % (PARTY_MOMENTS.length - 1) + 1]}`}</p><p className="mt-1 font-mono text-xs font-bold">{guests.length} guests · {pairCount.toLocaleString()} possible pairs</p></div>
                  <button type="button" onClick={resetParty} className="inline-flex items-center gap-1.5 rounded-full border-2 border-slate-950 bg-white px-3 py-1.5 text-sm font-bold hover:bg-slate-100"><RotateCcw className="size-3.5" aria-hidden /> New party</button>
                </div>

                {hasMatch && (
                  <div className="animate-in zoom-in-95 fade-in relative mt-5 overflow-hidden rounded-2xl border-[3px] border-slate-950 bg-[#f9d552] p-5 shadow-[4px_4px_0_#16243d]">
                    <span className="absolute -top-3 right-4 text-5xl" aria-hidden>🎉</span>
                    <p className="font-heading text-2xl font-bold">A match! The party did the thing.</p>
                    <p className="mt-1 max-w-xl">You did not need to match <em>your</em> birthday. Any two guests could collide—and the room is secretly full of pairings.</p>
                  </div>
                )}

                <div className="relative mt-6 h-[520px] overflow-hidden rounded-2xl border-[3px] border-slate-950/70 bg-[#b6df54]/35 shadow-[4px_4px_0_rgba(22,36,61,0.75)]">
                  {guests.map((guest, index) => {
                    const isMatch = matches.has(guest.birthday);
                    const spot = PARTY_SPOTS[index]!;
                    return (
                      <article key={`${guest.name}-${index}`} className={`animate-in fade-in zoom-in-95 absolute w-24 -translate-x-1/2 -translate-y-1/2 rounded-xl border-[3px] border-slate-950 p-2 shadow-[3px_3px_0_#16243d] ${isMatch ? "ring-4 ring-[#d54187] ring-offset-2" : ""}`} style={{ backgroundColor: CARD_COLORS[index % CARD_COLORS.length], left: spot.left, top: spot.top }}>
                        {isMatch && <span className="absolute -top-3 -right-2 rotate-12 rounded-full border-2 border-slate-950 bg-[#d54187] px-2 py-0.5 font-mono text-[10px] font-bold text-white">MATCH!</span>}
                        <div className="flex items-center justify-between"><Face index={index} /><span className="font-mono text-xs font-bold opacity-60">#{index + 1}</span></div>
                        <p className="mt-2 font-heading text-base leading-none font-bold">{guest.name}</p>
                        <p className="mt-1 font-mono text-xs font-bold">{labelForDay(guest.birthday)}</p>
                      </article>
                    );
                  })}
                  {guests.length < 23 && (
                    <button type="button" onClick={() => inviteGuests(1)} className="group absolute flex size-24 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border-[3px] border-dashed border-slate-950 bg-[#fff4d9]/90 p-2 text-center font-heading text-sm font-bold shadow-[3px_3px_0_#16243d] transition-transform hover:scale-110" style={nextSpot}>
                      <span className="text-2xl" aria-hidden>+</span><span>put a friend here</span>
                    </button>
                  )}
                </div>

                {guests.length < 23 && (
                  <p className="mt-4 text-center font-heading text-lg font-bold">Pick the next open spot on the lawn.</p>
                )}

                {guests.length >= 23 && (
                  <div className="animate-in fade-in mt-8 rounded-2xl border-2 border-slate-950 bg-white p-5">
                    <p className="font-heading text-xl font-bold">This one party can go either way.</p>
                    <p className="mt-1 max-w-2xl">But at 23 guests, a shared birthday is already more likely than not. Want to stop trusting one party and ask the whole neighborhood?</p>
                    <button type="button" onClick={surveyParties} className="mt-4 inline-flex items-center gap-2 rounded-lg border-2 border-slate-950 bg-[#f9d552] px-4 py-2 font-heading font-bold"><Sparkles className="size-4" aria-hidden /> Fast-forward 1,000 parties</button>
                    {sample && <p className="animate-in fade-in mt-4 rounded-xl bg-[#16243d] px-4 py-3 font-heading text-lg text-white">{Math.round(sample.rate * sample.rooms).toLocaleString()} of {sample.rooms.toLocaleString()} parties had a match. That&apos;s <span className="text-[#f9d552]">{pct(sample.rate)}</span>.</p>}
                  </div>
                )}

                {guests.length >= 23 && (
                  <div className="animate-in slide-in-from-bottom-3 fade-in mt-6 rounded-2xl border-2 border-slate-950 bg-[#b7e5ff] p-5">
                    <p className="font-heading text-xl font-bold">The reveal: it&apos;s the pairs.</p>
                    <p className="mt-2">At 23 guests, there are 253 possible pairs. Instead of asking “will someone match me?”, the party is asking whether <em>any</em> of those 253 tiny chances lands. The clean math calculates the opposite—every birthday stays different—and gets 49.27%. So a match wins: 50.73%.</p>
                    <p className="mt-3 text-sm">Keep going: 75 guests gives about a 99.97% chance. At 366 guests, a match is guaranteed.</p>
                    {sample && (
                      <div className="mt-5 border-t-2 border-slate-950/20 pt-4">
                        <p className="font-heading text-lg font-bold">One last twist: real birthdays are not evenly spread out.</p>
                        <p className="mt-1 text-sm">Late summer is a little busier; weekends and holidays are quieter. Unevenness makes matching slightly easier—but not enough to move the 23-person milestone.</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <button type="button" onClick={() => switchDistribution("uniform")} className={`rounded-lg border-2 border-slate-950 px-3 py-2 text-sm font-bold ${distribution === "uniform" ? "bg-[#f9d552]" : "bg-white"}`}>Keep every day equal</button>
                          <button type="button" onClick={() => switchDistribution("us-pattern")} className={`rounded-lg border-2 border-slate-950 px-3 py-2 text-sm font-bold ${distribution === "us-pattern" ? "bg-[#f5a5ca]" : "bg-white"}`}>Try a real-world-ish bowl</button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </main>

          <aside className="hidden border-t-[3px] border-slate-950 bg-[#16243d] p-6 text-white lg:border-t-0 lg:border-l-[3px]">
            <p className="font-mono text-xs font-bold tracking-[0.16em] text-[#f9d552] uppercase">Party rules</p>
            <h2 className="mt-2 font-heading text-2xl font-bold">Which birthday bowl?</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">Try the classic puzzle first, then nudge reality into the room.</p>
            <div className="mt-5 space-y-3">
              <button type="button" onClick={() => switchDistribution("uniform")} className={`w-full rounded-xl border-2 p-3 text-left ${distribution === "uniform" ? "border-[#f9d552] bg-[#f9d552] text-slate-950" : "border-white/50 text-white"}`}><strong className="font-heading">Every day equal</strong><span className="mt-1 block text-xs opacity-80">The classic, clean version.</span></button>
              <button type="button" onClick={() => switchDistribution("us-pattern")} className={`w-full rounded-xl border-2 p-3 text-left ${distribution === "us-pattern" ? "border-[#f5a5ca] bg-[#f5a5ca] text-slate-950" : "border-white/50 text-white"}`}><strong className="font-heading">Real-world-ish birthdays</strong><span className="mt-1 block text-xs opacity-80">Late summer is busier; weekends and holidays are quieter.</span></button>
            </div>
            {distribution === "us-pattern" && <p className="mt-6 rounded-xl border border-[#f5a5ca]/60 bg-[#f5a5ca]/10 p-3 text-sm leading-relaxed text-slate-200">Uneven birthdays make a match <em>more</em> likely, but normal real-world variation is not strong enough to move the 23-person milestone.</p>}
            <div className="mt-8 border-t border-white/20 pt-5 text-sm leading-relaxed text-slate-300"><p className="font-heading text-lg text-white">A small clarification</p><p className="mt-1">Matching a specific birthday—say, yours—is a different game. It takes about 253 other people to make that more likely than not.</p></div>
          </aside>
        </div>
      </div>
    </section>
  );
}
