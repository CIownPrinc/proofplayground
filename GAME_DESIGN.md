# Proof Playground game design guide

## Source and status

This guide preserves the reusable parts of **“The Birthday Paradox — design
document”** (`src/app/games/birthday-problem/DESIGN.md`, deleted 2026-08-08
after its requirements were implemented). That document is the primary source
for the principles below; its Birthday Paradox examples have been generalized
for every game in Proof Playground.

It also incorporates the user-provided summary of Derek Muller / Veritasium’s
three-part science-storytelling approach (2026-08-08). Treat that material as
an instructional influence, not a requirement to imitate a video format.

It also incorporates the user-provided **“Neal.fun, Catalogued”** field notes
(2026-08-08). Those notes inform the guidance on single-purpose interactions,
scope, and safe play below; Proof Playground should borrow the clarity of the
approach, not Neal.fun’s specific formats or subject matter.

Its central test was: **“your gut is a bad statistician, and 23 is the proof.”**
For this site, that becomes: each game should let a player feel a confident,
plausible intuition fail before it gives them the explanation.

## What a Proof Playground game is for

The site is not a collection of interactive textbook pages. A game should
create one specific *wait, what?* moment, then give the player enough evidence
to understand why their first instinct failed.

Choose the misconception before choosing the interface. A build is not done
because its cards, controls, or illustrations look polished; it is done when a
newcomer can experience the intended reversal and explain the mechanism in
plain language afterward.

Good source material has all three of these properties:

- A newcomer can form an intuitive prediction without prerequisite knowledge.
- The prediction is meaningfully, visibly wrong—not just off by a small amount.
- The result connects to a real phenomenon, application, or durable question.

Do not lead with a formula, definition, or correct answer. Those remove the
reason the player needs the explanation.

## The default lesson arc

Unless the subject gives a strong reason to differ, organize a game around
this sequence:

1. **Commitment.** Ask the player to make a meaningful guess, choice, or
   construction before revealing the answer. Use choices or a bounded control
   when a blank field would let the player hedge. The commitment must be saved
   and referenced later.
2. **Tension.** Let the mechanism play out at a human pace. The player needs
   to be able to watch the relevant evidence accumulate, with some control
   over pacing when it helps (for example, step once versus advance several
   steps).
3. **Personal payoff.** Score the result directly against the player’s own
   choice: “you predicted X; Y happened.” Give this moment visual weight. Do
   not replace it with an impersonal fact card.
4. **Not-a-fluke check.** When one run could plausibly be luck, let the player
   run many trials, compare cases, or otherwise verify the pattern. This must
   come after the surprising result, when the player naturally asks whether it
   was chance.
5. **Exploration.** Provide a live control for the variable that matters.
   Every control should visibly update the result *and* a representation of
   the mechanism—not just a paragraph or a replay button.
6. **Shown explanation.** Give the player a visual model that makes the
   underlying relationship tangible. Explain with prose only after the player
   has seen the model respond.
7. **One open thread.** Deliberately leave one honest, interesting question
   partly unresolved. This respects curiosity and prevents the game from
   turning into a complete lecture.

The Birthday Paradox document called this “misconception → question → scored
answer → is-it-luck check → hands-on exploration → shown-not-told why → one
held-back thread.” [Birthday Paradox design document, deleted 2026-08-08,
sections 4.5 and 7]

## Rules for interaction

Interactivity is instructional only when it changes what the player learns or
observes. A button, slider, or animation is worthwhile when it does at least
one of the following:

- Makes a commitment that matters at the reveal.
- Changes the evidence, outcome, or comparison.
- Lets the player control pace during a tension-building sequence.
- Enables a real A/B test or repeated-trials check.
- Updates a visual representation of the mechanism in real time.

Things that do not count on their own: scroll-triggered card reveals,
decorative motion, a reset button that produces the same lesson with no new
comparison, or emoji used as interface decoration.

## Neal.fun-inspired interaction and scope tools

The Neal.fun catalog shows a complementary way to make an idea approachable:
give each page one legible action, make the response immediate, and let the
player discover depth through use instead of through setup. [User-provided
“Neal.fun, Catalogued” field notes, 2026-08-08]

### One page, one verb

Each game needs a short phrase that describes its central action: *race the
curves*, *invite the guests*, *build the model*, or *compare the outcomes*.
The first screen should make that verb obvious. Supporting controls are fine,
but they should reinforce the central interaction rather than create a toolbox
with no clear first move.

This is a scope tool as much as a usability rule. Start a new game as the
smallest interactive proof of its core idea, then extend it only when a new
feature makes the lesson clearer, more testable, or more replayable. Expect the
shipped idea to evolve during prototyping; protect the lesson goal while being
willing to replace the initial interface.

### Make abstractions physical

When a subject is numerical, invisible, or very large, turn its important
quantity into something the player can see, drag, spend, build, travel
through, or compare. The representation must retain a truthful mapping to the
underlying quantity: scale, progress, count, time, or causal consequence.

Useful patterns include:

- A live counter or changing scale for quantities that accumulate over time.
- A spatial journey for scale, depth, distance, or historical sequence.
- A constrained sandbox for systems best understood through combination or
  construction.
- A score, comparison, or crowd result when the player’s judgment is the
  lesson.

Do not make a quantity “physical” merely by adding arbitrary animation. A
player should be able to say what changed, why it changed, and what the visual
change represents.

### Reveal depth through escalation

Start with a move that is understandable in seconds, then add complexity only
after the player has acted. Rules, options, and consequences can unfold in
stages—but each stage needs to feel like a consequence of the previous one,
not a surprise requirement bolted on to extend playtime.

Escalation works well when it widens the original question, raises a meaningful
constraint, or exposes a richer case. It fails when it becomes busywork,
punishment for a reasonable first choice, or a stream of unrelated novelty.

### Treat shared and live data as a distinct feature

Real-time counters, group votes, and shared spaces can make a small idea feel
alive. Use them only when the presence of other people changes the meaning of
the game—for example, when collective judgment, coordination, or simultaneity
is itself the subject.

Shared data needs clear labeling: say whether a count is personal, simulated,
or shared across visitors; identify the time window when relevant; and make the
game understandable when no one else is active. Do not make a lesson depend on
a busy audience.

### Small delight is optional, not the lesson

An unobtrusive easter egg, ambient response, or playful detail can make the
site feel inhabited. It should be discoverable without blocking progress,
should not masquerade as a control, and must never obscure the educational
interaction. A small delight is successful when it rewards attention without
asking the player to understand new rules.

### Safety and trust are part of the design

Never use deceptive UI patterns: fake download or install prompts,
advertising styled as a site control, surprise navigation, forced permissions,
or manipulative confirmation flows. Keep external links and embeds visibly
distinct from game controls. Ask for a browser permission only when it is
necessary for a player-requested feature, explain why it is needed before the
prompt, and ensure the rest of the game remains useful without it where
practical.

The catalog’s report of hijacked advertising and fake browser banners is a
useful reminder that pages with third-party content need particular care.
Proof Playground should avoid ad-tech and unrelated third-party scripts in
gameplay surfaces. [User-provided “Neal.fun, Catalogued” field notes,
2026-08-08]

## Visual and copy principles

Proof Playground has two complementary visual layers:

- **Shared site grammar:** heading typography, restrained shadows, chunky
  `border-foreground/80` borders, pastel `--tile-*` tokens, and the `--brand`
  accent used sparingly. Reuse this grammar so games feel like one site.
- **Per-game identity:** each game should have a distinct visual metaphor and
  a small, intentional art direction. Use detailed imagery in framed moments
  where it can be read; keep control-heavy surfaces quieter and flatter.

Avoid placing rich imagery behind dense controls. It competes with the state
the player needs to read. Likewise, do not shrink detailed art until it is
illegible; use a simple crop, silhouette, color, or icon at small sizes.

Copy should alternate dense material with lighter, concrete beats so attention
can reset. State what the player sees now, then offer the next question. Keep
the explanation conversational and precise, but do not front-load it.

## Definition of done

Before declaring a game complete, verify that a stranger with no relevant
background can:

1. Make a real prediction before receiving the answer.
2. Encounter a surprising result quickly enough to stay engaged.
3. See the result scored against their own prediction.
4. Check that the result is not merely a lucky run, when that distinction
   matters.
5. Manipulate the important variable and observe both outcome and mechanism.
6. See why the result works rather than merely read a numerical claim.
7. Leave with one worthwhile question still open.

Also verify that the game works on a narrow touch screen, has accessible labels
and useful image alt text, and does not require a formula to begin.

## Design review checklist

When reviewing or proposing a game, write down these answers before polishing
the UI:

- What is the exact intuitive prediction the player will make?
- What observable event overturns it?
- How is the player’s prediction referenced at the reveal?
- What lets them distinguish a pattern from a one-off result?
- Which control teaches something different when changed?
- What is the visual model of the causal relationship?
- What question intentionally remains open?
- What belongs to the site grammar, and what gives this game its own identity?

If those answers are vague, the next task is design work—not additional visual
polish.

## Veritasium-inspired storytelling tools

The Birthday Paradox design document identified a useful parallel with Derek
Muller’s Veritasium approach: learners can engage more deeply when a familiar
intuition is challenged before the correct explanation arrives. [Birthday
Paradox design document, deleted 2026-08-08, section 4]

Use the following tools when they serve the lesson:

### 1. Start with the misconception

Open on a believable but incomplete mental model. The point is not to trick
the player or withhold essential instructions; it is to make them recognize a
gap between what they expected and what actually happens. A prediction step is
the clearest implementation, but a carefully framed observation or build task
can do the same job.

Confusion is useful only when it is productive: the game must give the player
enough evidence and control to resolve it. Never leave an ambiguous rule,
unclear control, or inaccessible instruction in the name of creating mystery.

### 2. Put the question before the answer

Frame the opening around a specific question, counterintuitive event, or
challenge. The player should understand what they are trying to find out before
they receive the explanation. This reverses the familiar classroom order of
explanation first and test second.

For game titles, homepage tiles, and thumbnails, favor a concrete mystery or
invitation over a dry topic label. They should create curiosity without hiding
what the player will do. For example, “Which path wins?” is stronger than
“An introduction to the brachistochrone,” but a title must still be honest
enough for a player to make an informed choice.

### 3. Alternate the A-plot and B-plot

Treat the technical mechanism as the **A-plot** and the concrete human,
physical, historical, or playful context as the **B-plot**. When the A-plot
gets dense, switch briefly to a B-plot beat: a visible event, a character,
an application, a new example, or a small action the player can take. Then
return to the mechanism.

This is pacing, not filler. Each B-plot beat should reset attention while
advancing the same question. Avoid adding unrelated lore, jokes, or art that
interrupts the player’s ability to follow the causal chain.

## Sources

- **The Birthday Paradox — design document**, deleted from
  `src/app/games/birthday-problem/DESIGN.md` on 2026-08-08; preserved here as
  a historical design source.
- **User-provided Derek Muller / Veritasium storytelling summary**, 2026-08-08:
  misconceptions first, question-first structure, A-plot/B-plot pacing,
  curiosity-led titles and thumbnails, and productive confusion.
- **User-provided “Neal.fun, Catalogued” field notes**, 2026-08-08: a
  hands-on survey of Neal Agarwal’s pages, including interaction patterns,
  scope observations, shared-data examples, and a warning about deceptive
  third-party advertising found during that survey.
