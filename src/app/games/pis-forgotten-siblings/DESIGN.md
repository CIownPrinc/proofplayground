# π’s Forgotten Siblings — design brief

## Point

Pi is not the lone famous endless decimal. Other constants describe continuous
growth, geometry, self-similarity, and entirely different mathematical worlds.
Their usefulness comes from the relationships they represent, not from having
many memorized digits.

## Opening and lesson arc

Open on a giant glowing pi as a celebrity: camera flashes, confetti, posters,
T-shirts, Pi Day, pie jokes, and `3.1415926535…`. The camera slowly slides
sideways to a dark backstage doorway. `e`, `sqrt(2)`, `phi`, `sqrt(3)`, and
stranger symbols stand awkwardly there. Caption: “You know pi.” Scroll:
“But pi isn’t the only number that never ends.” Then: **MEET THE FAMILY.**

Clarify early that some decimals repeat forever, such as 1/3, while irrational
numbers have decimal expansions that continue without repeating. Do not imply
that nonrepeating digits are automatically random.

The experience is a scroll journey, not a lecture or a trivia gallery. Each
sibling follows the site lesson arc: a concrete situation first, visible
pattern, name and number only after discovery, one useful application, then a
new question. The interactions are small experiments: change a compounding
frequency, fold paper, grow a recurrence, place points on a number line, or
switch a visualization. Decorative scrolling alone is not enough. The sections
connect constants to growth, geometry, probability, computing, physics, and
the kinds of structure that recur across those fields.

## e — the number of change

Start with one dollar growing by 100% over one year. Compound once, twice,
four times, monthly, daily, and then at increasingly fine intervals. Show the
amount approaching 2.71828… through `(1 + 1/n)^n`; state precisely that this
limit is `e`, and that continuous compounding produces `e` when the rate and
time equal one.

Transform the same visual relationship through a bacteria population, decay,
cooling, and a probability curve. Recurring caption: “When change depends on
how much is already there, e tends to appear.” This is a useful pattern, not a
claim that every growth process exactly follows an exponential model.

Personality: **the number of change**. Let the player alter the number of
compounding periods and watch both the amount and the distance from `e` update.

## sqrt(2) — the troublemaker

On ancient parchment, build a unit square. Its diagonal obeys `d^2 = 1^2 +
1^2`, so `d = sqrt(2)`. The decimal begins 1.414213… and the player tests
fractions such as 7/5 and 99/70: close, but never exact.

The historical beat: Greek expectations that all lengths could be expressed as
ratios of whole numbers meet a diagonal that refuses that form. The square
cracks open to reveal **IRRATIONAL**. Phrase this carefully: the discovery was
profoundly disruptive to a number system built around ratios; do not overstate
uncertain historical anecdotes as settled drama.

Then make it ordinary. An A-series paper rectangle has long-side-to-short-side
ratio `sqrt(2):1`. Fold it in half and the new sheet has the same shape. Let
the player repeatedly fold the rectangle and see the ratio remain fixed.
Personality: **the
troublemaker who became office stationery**.

## phi — the celebrity with an overenthusiastic fanbase

Show a rectangle whose remainder after removing a square has the same shape.
The ratio is `phi ≈ 1.61803…`. Let Fibonacci numbers advance and their adjacent
ratios approach phi, while visibly showing that early ratios oscillate around
the value rather than equal it.

Show legitimate links between Fibonacci-related counting/packing patterns and
some plant-growth structures. Interrupt exaggerated claims with a comic overlay
trying to fit golden rectangles to a toaster, shoe, and pigeon: **PLEASE STOP.**
State clearly that phi is not a universal beauty code or proof that every spiral
is “golden.” Personality: **the celebrity with an overenthusiastic fanbase**.

## Irrationals are not rare

After the individual stories, light `sqrt(2)`, `sqrt(3)`, `sqrt(5)`, and more
points on a number line. Add rational points in a second layer. Teach the exact
fact: rational and irrational numbers are both dense—between any two different
real numbers, there are infinitely many of each. Therefore, a glow-density
animation is a metaphor, not evidence that one is “more packed.”

Then give the deeper result: rationals are countable, while irrationals are
uncountable, so there are strictly more irrationals than rationals. Pi is not
the exceptional weird number; fractions are the smaller family.

## The number zoo

Build a vertical gallery of named constants with a compact classification:

| Number | Classification |
| --- | --- |
| sqrt(2), phi, sqrt(3) | Irrational, algebraic |
| pi, e | Irrational, transcendental |

Define algebraic as a solution of some nonzero polynomial with integer
coefficients: `x^2 - 2 = 0` gives `sqrt(2)`. Define transcendental as not a
solution of any such polynomial. The “algebraic city” and immense outside
universe make the classification spatial. State accurately that almost every
real number is transcendental, but familiar named examples are unusual.

## Digits are not the point

Create an optional digit sonification exhibit. Map digits to notes, show the
mapping, and let pi, e, sqrt(2), and phi generate different melodies. Caption:
“We created this melody from the digits; it is not hidden inside the number.”

Follow with a comic trillion-digit counter, then ask “Cool, but why?” Let the
player set a circle’s scale from Earth to astronomical distances and compare
the few digits of pi needed for a stated precision. The takeaway: constants are
useful because of the structures they describe, not because their expansions
are long.

## Cinematic connection and ending

After e and pi have earned separate identities, introduce Euler’s identity
without immediately explaining it. In darkness, `e`, pi, `i`, 1, and 0 drift
together into `e^(i*pi) + 1 = 0`. Give the player a quiet “Wait.” beat, then a
brief explanation that it joins those five numbers in one relation. Do not
pretend this is a proof; link it to a future complex-numbers experience.

Near the end, introduce `i` with a rotating complex plane and the teaser:
“Wait… why is there a number whose square is -1?” Freeze on `i^2 = -1` and
offer the future imaginary-numbers experience as the next story.

Return to the opening pi stage. Pull back to reveal pi surrounded by `e`,
`sqrt(2)`, `phi`, `i`, `sqrt(3)`, `ln(2)`, `gamma`, and an expanding family of
symbols. Give each a visual personality: pi with cycles and waves, e with
curves of growth, sqrt(2) with a square diagonal, phi with recursive
rectangles, and i with the complex plane. Pull still farther back until
hundreds and thousands of constants become stars in a galaxy.

Final text: **pi was never alone.** Then: “The numbers we name are tiny islands
in an enormous number system.” Close with `3.14159…`, `2.71828…`, `1.41421…`,
and `1.61803…` scrolling downward together.

The working title is **pi’s Forgotten Siblings**: playful enough for the opening
joke and still broad enough for the museum-like journey. **The Infinite Family**
is the reserved alternate title if later art direction becomes more solemn.

## Visual, access, and trust

Use theatrical dark space, warm focused light, high-contrast symbols, and
framed interactive exhibits within Proof Playground’s shared borders, heading
type, pastel tokens, and restrained brand accent. Symbols must always have text
alternatives and accessible labels. Support keyboard/touch controls, reduced
motion, non-audio access to sonification, and no reliance on color alone.

No false claims about nature, random digits, aesthetics, or historical certainty
for spectacle. No ads, surprise navigation, login, or unrelated third-party code.

## Definition of done

A newcomer can distinguish repeating decimals from irrational decimals; explain
what e, sqrt(2), and phi each represent in one concrete setting; identify that
irrationals are abundant; distinguish algebraic from transcendental at a basic
level; and leave understanding that digits are a representation, not the reason
the constants matter.

## Sources

- User-provided *π’s Forgotten Siblings* game concept, 2026-08-08.
- `GAME_DESIGN.md`.
