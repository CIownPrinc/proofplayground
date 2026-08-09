# Pigeon Panic! — design brief

## 1. The point

**If there are more things than places to put them, a collision is not bad
planning—it is inevitable.**

The game teaches the pigeonhole principle by giving the player a delightfully
concrete impossible job: operate a prestigious pigeon hotel while more guests
arrive than there are private rooms. The player must first try to solve the
problem by dragging individual pigeons, discover that rearrangement cannot
help, and only then name the theorem.

The intended *wait, what?* is not “six is larger than five.” It is: “I have
made every sensible arrangement, and the remaining pigeon still has nowhere to
go. The failure comes from the counts, not from my choices.”

## 2. Audience and hook

This should work for a player with no mathematics background, including on a
phone. The opening needs no vocabulary beyond private room, guest, and hotel.

The hook is the manager’s overconfident claim:

> “Six guests, five rooms. Everyone gets their own room. Easy!”

Professor Peck is visibly wrong, but the player is invited to prove or rescue
the claim themselves. Do not show “pigeonhole principle,” a formula, `n + 1`,
or formal set notation before the first collision. During discovery, the game
speaks in guests, rooms, drawers, months, lockers, and parking pads.

## 3. The core play loop

The primary verb is **house**: drag an incoming guest into a room.

Every playable board always exposes three facts without turning them into a
worksheet:

- The incoming objects, visibly waiting in a queue or on a wire.
- The containers, visibly open or occupied on the board.
- A compact count readout, e.g. `6 PIGEONS · 5 ROOMS`.

Dragging is direct and forgiving:

- A pigeon can be dragged to any room.
- A pigeon in a room can be dragged back out or moved to another room.
- Occupied rooms accept another pigeon; the game must never block the move.
- If a player tries to place a pigeon in a full private room, the room accepts
  it as a shared room rather than presenting a failure modal.
- The current distribution remains visible while the player rearranges.

This makes the impossibility experiential. The player is not told there is no
solution; they can test every arrangement, and the invariant remains: one room
must hold two pigeons.

## 4. First-session story arc

Follow the shared game arc in `GAME_DESIGN.md`: commitment, tension, personal
payoff, verification, exploration, shown explanation, and one open thread.

### Beat 1 — Warm-up: plenty of rooms

**Level 1: 3 pigeons, 5 rooms.** Professor Peck welcomes the new manager and
asks them to give each guest a private room. The player drags three pigeons
into three rooms and gets a small success beat.

Purpose: establish the physical language—drag, room occupancy, count badges—
without teaching or explaining anything yet.

### Beat 2 — Commitment: the perfect fit

**Level 2: 5 pigeons, 5 rooms.** Before dragging, ask: “Private room for every
guest?” with **Definitely** and **I’m not sure**. The choice is retained and
referenced after the board is completed. The player can make the perfect
one-pigeon-per-room arrangement.

Purpose: reinforce the plausible mental model that careful one-to-one matching
solves the hotel problem.

### Beat 3 — Tension: the impossible guest

**Level 3: 6 pigeons, 5 rooms.** Professor Peck repeats the confidence line.
The player houses five pigeons. The sixth remains on the wire while every room
shows an occupancy badge of `1`.

The prompt changes to: **“Can you rearrange them so nobody shares?”** Keep all
dragging enabled. After the player makes a few moves, or immediately if they
put two pigeons together, reveal a calm escape hatch: **“I think it’s
impossible.”** It must always be available; do not require arbitrary failed
attempts from players who already see the result.

### Beat 4 — Personal payoff: name the discovery

When the player chooses the escape hatch—or creates a shared room—the board
pauses for a short visual proof:

1. Six pigeon cards illuminate one by one.
2. Five hotel rooms illuminate one by one.
3. The count settles into `6 guests → 5 rooms`.
4. The shared room pulses, with its `2` badge connected to the mismatch.

Professor Peck: “You were right. Moving them around changes *which* room is
shared, never whether a room is shared.”

Then unlock:

> **DISCOVERY: THE PIGEONHOLE PRINCIPLE**
>
> When there are more objects than containers, at least one container holds
> two or more objects.

If the player selected **Definitely** in Level 2, acknowledge the valid rule
they discovered there: “Your 5-for-5 plan worked. One extra guest changed the
kind of problem.” Avoid framing an honest earlier prediction as a mistake.

### Beat 5 — Not-a-fluke check: rearrangement proof

Before moving on, offer **“Shuffle everyone”**. It performs several fast,
different arrangements of six pigeons among five rooms, pausing on a different
shared room each time. The visual result must always be a `2` or greater badge
somewhere.

This is not a random simulation offered as proof. It is a supporting visual
check after the player has tried the board: different arrangements change the
location of the collision, not its inevitability.

### Beat 6 — Exploration: change the counts

Present a small two-control hotel desk after the discovery:

- **Guests:** 1–20
- **Rooms:** 1–20

The board should respond live with simplified pigeon dots and room icons. A
clearly labeled **Private rooms possible?** indicator changes as counts cross.
When guests exceed rooms, one room visibly gains a `2+` badge; when they do
not, every occupied room can remain private. The explanation appears after the
player has moved at least one control.

The panel must show the relevant comparison, not merely a green/red answer:
`14 guests · 11 rooms · at least one shared room`. It should also show the
smallest unavoidable occupancy for advanced players once they encounter it.

### Beat 7 — Transfer: it was never about pigeons

Use short, mechanically distinct scenario cards after the base game:

| Scenario | Objects | Containers | Player takeaway |
| --- | ---: | ---: | --- |
| Sock Disaster | 13 socks | 12 drawers | A drawer must get two socks. |
| Birthday Party | 13 people | 12 months | Two people share a birth month. |
| School Lockers | 31 backpacks | 30 lockers | A locker must hold two backpacks. |
| Alien Parking | 101 UFOs | 100 pads | A pad must receive two UFOs. |

The Birthday Party card is the conceptual payoff: it connects an absurd hotel
rule to an everyday fact without confusing it with the separate birthday
paradox game. Say “same birth month,” not “same birthday.”

Each card asks for a prediction (**Guaranteed** / **Not guaranteed**) before
revealing a small visual arrangement. Do not require dragging 101 individual
UFOs; use grouped, animated arrivals to teach that reasoning can replace
manual placement at scale.

## 5. Challenge the Theorem mode

After the player completes the transfer cards, unlock **Challenge Professor
Peck**. This is the higher-ceiling mode, not the first lesson.

Professor Peck states claims such as:

> “I have 27 pigeons and 9 rooms. I guarantee one room has at least 3 pigeons.”

The player chooses **Guaranteed** or **Not guaranteed**, then sees a compact
distribution diagram. Use three claim types in a deliberate order:

1. **Exact division:** 27 pigeons / 9 rooms guarantees 3 in one room.
2. **Just over a multiple:** 28 pigeons / 9 rooms guarantees 4 in one room.
3. **Plausible but false:** 27 pigeons / 9 rooms does *not* guarantee 4 in one
   room; three per room avoids it.

Only after a correct/incorrect response should the game reveal the general
rule:

> With `P` pigeons and `R` rooms, some room contains at least `ceil(P / R)`
> pigeons.

Pair the formula with its picture: distribute pigeons as evenly as possible,
then point to the first room that must receive the next pigeon. The formula is
a compact name for the reasoning the player has already used, never the gate
to playing.

For very large values, use ten-room summaries, stacked occupancy bars, and
ellipsis labels rather than hundreds of draggable sprites. Preserve the visual
meaning of “objects distributed among containers” at every scale.

## 6. Collision visual language

A shared room is the game’s most important visual event. It should be funny,
clear, and consistent:

- The room flexes horizontally and gives a quick soft pop.
- Its pigeons compress together briefly; a few feathers puff out.
- An occupancy badge updates from `1` to `2`, then to `3+` if needed.
- The badge is readable in color, text, and shape; color alone never conveys
  occupancy.
- On the discovery level, an annotation says **HAS TO HAPPEN** only after the
  player has reached the conclusion or elected the escape hatch.

The game should celebrate the collision as a discovery, not signal that the
player has failed. “Shared room unlocked” is better feedback than an error
sound or a red X.

## 7. Art, motion, and sound

Use playful storybook hotel design within Proof Playground’s shared visual
grammar: chunky `border-foreground/80` edges, restrained shadows, site heading
type, pastel `--tile-*` surfaces, and a sparingly used `--brand` accent.

Per-game identity:

- The Grand Pigeon Hotel is a slightly crooked, elegant city building with
  phone wires and brass room numbers.
- Pigeons are simple, expressive silhouettes with a few readable accessories:
  tiny glasses, a hat, oversized body, sleepy eyelids, or an overstuffed bag.
- Professor Peck is a framed, large-scale character moment: a small pigeon in
  an oversized bow tie, never a tiny repeated decoration.
- At small sizes, prefer distinct colors and one accessory over detailed
  character art.

Motion should clarify state: incoming pigeons perch, rooms respond to a drop,
and the discovery zoom links counts to the shared room. Respect reduced-motion
preferences by replacing elastic movement with immediate state changes.

Sound is optional and off by default until the player enables it. If enabled,
use a quiet coo for arrival and a gentle pop for sharing; never make sound the
only feedback.

## 8. Accessibility and trust

- Provide keyboard alternatives to dragging: select a pigeon, then select a
  room; announce the resulting occupancy.
- Use clear accessible names such as “Room 3, one pigeon” and “Mabel, waiting
  on the wire.”
- Support touch targets large enough for small screens and keep core counts
  visible without horizontal scrolling.
- Do not require color perception, fast reaction time, audio, login, or a
  crowded shared session.
- Keep gameplay self-contained: no advertising, deceptive controls, surprise
  navigation, or permission prompts.

## 9. Definition of done

The game is ready when a newcomer can:

1. House pigeons on a phone without being taught mathematical vocabulary.
2. Make and test a plausible private-room arrangement.
3. Experience that six pigeons in five rooms cannot avoid sharing, even after
   rearranging.
4. State the basic rule in their own words.
5. Recognize the same rule in a non-pigeon scenario.
6. Determine whether a stronger occupancy claim is guaranteed before seeing
   the generalized formula.
7. Leave wondering what other everyday “collisions” are forced by counts.

## Sources and design influences

- User-provided *Pigeon Panic!* game concept, 2026-08-08.
- `GAME_DESIGN.md`, especially the lesson arc, Veritasium-inspired storytelling
  tools, Neal.fun-inspired interaction and scope tools, accessibility, and
  safety guidance.
