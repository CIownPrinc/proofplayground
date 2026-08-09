# Just One More Lane — design brief

## Point

Road capacity changes travel choices. When driving gets temporarily easier,
additional people may drive, travel farther, change routes or times, and make
trips they once skipped. New road space can fill up again.

The player must fall into the tempting logic before the explanation. Widening
a clogged road feels obvious and its immediate improvement is real. The reveal
is that the intervention changed the decisions that create traffic, not only
the speed of cars already on the road.

This is an illustrative toy-city model, not a universal forecast or a claim
that every road project fails. State after discovery that response varies by
place, land use, price, and available alternatives.

## Hook

The player is the new planner for Gridlock City. Mayor Motor says: **FIX
TRAFFIC.** The opening shows only Average Trip Time and a red congestion meter.
Cars crawl toward Downtown. The one large control is **+ ADD A LANE**.

Do not initially show Cars on Road, People Moved per Minute, mode share,
induced demand, or a big planning toolbar. The first screen has one legible
verb: **widen**. The player must choose the intervention.

## First-session arc

### 1. Immediate success

Level 1 begins with two lanes and a 41-minute trip. The player adds a lane.
Construction gets a toy-model `WHOOSH`; cars spread out and time falls 41 →
28 → 19 minutes. Mayor Motor celebrates. Then offer **See what happens next
week** so the player controls the next beat.

### 2. The city reacts

The time-lapse intercuts the road with concrete decisions: a bus rider drives,
a person who avoided Downtown starts the trip, a driver shifts to rush hour,
and a household chooses a farther home. Each card adds visible car trips. The
road refills. Mayor Motor offers **+ JUST ONE MORE LANE**.

### 3. Repeat the trap

The player can widen two or three more times. Each cycle gives immediate relief
then delayed demand. Visual land cost escalates from trees to a park edge to a
cute bakery or small block. Never use an irreversible fail state. Include
**Undo last widening** for testing, without removing the story beat.

### 4. Show travelers

Unlock **SHOW TRAVELERS**. Cars become translucent; colored traveler dots move
between homes, school, shops, and work. Selecting a person shows:

| Option | Before | Right after widening | Later |
| --- | ---: | ---: | ---: |
| Drive | 22 min | 15 min | 21 min |
| Bus | 29 min | 29 min | 29 min |
| Bike | 31 min | 31 min | 31 min |

Show several decisions, including someone who keeps using transit. The player
must see choices change before the road fills. Then reveal:

> “You weren’t just changing the road. You were changing people’s choices.”
>
> **DISCOVERY: INDUCED DEMAND**

Define it briefly: added road capacity can encourage extra driving and
car-dependent development, which can use up the added capacity.

### 5. Check and flip the goal

Offer synchronized mini-cities: **Widen twice** and **Improve alternatives**.
Start both from the same city. The first shows fast car-delay relief, added
demand, and more road space. The second improves access and people moved.
Clearly label these as scenario assumptions, not universal predictions.

Then cross out the old objective:

> ~~MAKE CARS MOVE FASTER~~
>
> **MOVE PEOPLE EFFICIENTLY**

Reveal Average Trip Time, Cars on Road, People Moved per Minute, Space Used,
and Access to Downtown. People moved per minute is primary, but the others stay
visible to show trade-offs.

### 6. Build a better mix

Unlock: Widen Road, New Road, Bus Line, Bus Priority, Bike Route, Safer
Crossing, Housing near transit, and Shops. Keep the first challenge to one
corridor and a limited budget. Every tool needs a visible mechanism: bus
priority improves reliability; bike routes improve short-trip access; nearby
housing shortens trips; widening adds temporary capacity but consumes land.
Widening remains available—the player learns a trade-off rather than being
forbidden from making a choice.

## Visual model

The isometric city must show both key relationships after discovery:

1. **Road space versus people moved.** In People View, a bus carries many
   colored passenger dots while cars carry one or a few. Compare one full bus
   with the road space used by many cars.
2. **Travel conditions versus decisions.** A traveler choice card updates after
   a time, reliability, safety, or access change and before new trips arrive.

The dashboard supports the city; it is never the only evidence.

## Simulation, art, access, and trust

Use a small, transparent agent model: travelers have origins, destinations,
purposes, departure windows, available modes, and preferences for time,
reliability, price, and comfort. Corridors have capacity, free-flow time, and
delay rising with car volume. Script and cap first-session demand response so
every player sees the teaching beat. Sandbox variation must not hide the lesson.

Use a bright tabletop city within the shared grammar: chunky
`border-foreground/80` edges, restrained shadows, site heading type, pastel
`--tile-*` surfaces, and sparing `--brand` accent. Mayor Motor is a framed
comic character. Motion explains state, sound is optional, and reduced-motion
preferences switch directly to the result.

All tools need labels and keyboard alternatives; the campaign needs no
pixel-precise placement. Use text, shape, position, and color together for
metrics. On mobile, retain the city, objective, and active tool. No ads, dark
patterns, surprise navigation, login, or unrelated third-party scripts.

## Definition of done

A newcomer can naturally widen a congested road, believe its immediate success,
see choices change before congestion returns, explain induced demand without
overgeneralizing it, compare cars and transit by people moved and road space,
and build a plan aimed at people and access rather than only car speed.

## Sources

- User-provided *Just One More Lane* game concept, 2026-08-08.
- `GAME_DESIGN.md`: lesson arc, visual explanation, physical models, scope,
  accessibility, and trust guidance.
