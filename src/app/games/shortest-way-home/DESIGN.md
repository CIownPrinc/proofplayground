# Shortest Way Home — design brief

## Point

Dijkstra's algorithm should feel like exploring an unknown city intelligently.
The player repeatedly settles the cheapest known place, then improves routes to
its neighbors. All travel costs in the game must be nonnegative.

## Hook and primary action

The player wakes in a dreamy city at night with no map or GPS, only a warm
apartment light and the goal **GET HOME**. The first signs read Library — 4
min, Station — 2 min, and Market — 7 min. A notebook records those best-known
times. The main button is **EXPLORE NEAREST**.

Before each use, the player predicts which known place is cheapest from the
notebook. The game then highlights and explores that place. A wrong prediction
is scored but never blocks progress. Do not permit arbitrary walking in the
first lesson: the meaningful interaction is predicting the next settled place.

## Discovery campaign

1. **Station — 2:** settle the first cheapest place. It becomes solidly lit
   and is marked “locked in,” with the formal reason deferred.
2. **Mental map:** first-person motion pauses at intersections. Streetlights
   dim and a memory overlay shows unknown places as dark, discovered places as
   faint, the cheapest frontier as pulsing, and settled places as solid.
3. **The surprise:** Station reveals Cafe — 5 and Park — 8, but Library — 4
   is chosen next. The camera moves through fog to Library. The player learns:
   “we are checking the cheapest place known anywhere,” not following a path.
4. **A route improves:** Market begins at 10 minutes. Cafe — 5 has a two-minute
   alley. The notebook scratches out `Market — 10`, writes `Market — 7`, and
   redraws the glowing route. Say “Found a shorter route,” not “relax an edge.”
5. **Home is deceptively close:** a direct road makes Home 18 minutes. Market
   — 7 reveals a subway that makes Home 10. Screen distance is not travel cost.
6. **Name the method:** replay the notebook—pick closest unknown, check its
   neighbors, improve routes, lock the place, repeat—then reveal Dijkstra’s
   algorithm and map place/node, road/edge, cost/weight, best known route/
   tentative distance, and locked place/settled node.

Only after this replay explain why locking is safe: with nonnegative costs, a
later route cannot reach the current cheapest unknown place more cheaply.

## Think mode and transfer

Unlock **THINK** halfway through (Space plus a touch-visible toggle). It turns
buildings into glowing dots and streets into weighted lines, then returns to
the city. The abstraction is optional and has a reduced-motion alternative.

Later modes ask the player to predict the next frontier entry or which route
will improve; they never require dragging graph nodes or repetitive bookkeeping.
Transfer the same logic to internet routers and delay, metro stations and time,
fantasy delivery routes, and a warehouse robot. Every world includes one visual
shortcut that is not cheap and one satisfying route improvement.

## Visual, accessibility, and trust

Use a dreamy low-poly nighttime city: navy streets, warm windows, and fog. Use
the shared Proof Playground grammar: chunky `border-foreground/80` edges,
restrained shadows, heading type, pastel `--tile-*`, and sparing `--brand`.
State must differ by label and shape as well as color. Motion only explains
travel, route redraws, and view changes; sound is optional.

Notebook entries and controls are keyboard-operable and screen-reader labeled
with place, cost, and settled/current state. Announce improvements in text. No
time pressure, login, ads, surprise navigation, or unrelated third-party code.

## Definition of done

A newcomer can predict the next cheapest place, explain why the game changes
locations, recognize route improvement, reject a direct-looking expensive path,
map city language to graph language after the reveal, name two other domains,
and state that Dijkstra needs nonnegative costs.

## Sources

- User-provided *Shortest Way Home* game concept, 2026-08-08.
- `GAME_DESIGN.md`.
