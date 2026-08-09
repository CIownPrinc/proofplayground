# Pathfinder Lab — design brief

## Point

One map can support many search strategies. The important question is not
“Which algorithm wins?” but **“What does this algorithm know, and what does it
guarantee?”**

Pathfinder Lab is the sandbox companion to *Shortest Way Home*. The story game
helps a newcomer feel Dijkstra’s process. This lab puts algorithms on the same
map and makes their different search behavior, assumptions, costs, and trade-
offs visible.

## First screen

The interface is a futuristic map table: a beautiful top-down diorama with a
Start, Goal, terrain brush, algorithm picker, speed control, and one prominent
button: **RUN**. The player taps Start, taps Goal, then draws walls or terrain.
The first useful experiment should take seconds.

Keep the top question permanently visible: **WHAT DOES YOUR ALGORITHM KNOW?**
The initial toolbar is deliberately small: DFS, BFS, Dijkstra, A*, Greedy,
Run, Step, Reset, and Show Values. Add advanced algorithms only after the core
five are understood.

## Teaching sequence

1. **BFS — The Wave.** On a unit-cost maze, BFS expands in an even wave from
   Start. Caption: “Search everything nearby first.” It guarantees fewest
   steps only when every edge has equal cost.
2. **Dijkstra — The Flood.** Add roads, grass, mud, and water with different
   positive costs. Its frontier flows quickly through cheap terrain and slowly
   through expensive terrain. Caption: “Explore whichever known route is
   cheapest so far.” It guarantees a lowest-cost path for nonnegative weights.
3. **A* — The Hunter.** Goal glow and a useful admissible heuristic focus the
   search. Show `g + h = priority`: traveled cost plus estimated remaining
   cost. It finds a lowest-cost path when its heuristic is admissible (use a
   consistent heuristic in the standard visualizer).
4. **Greedy — The Impatient One.** It chases what looks closest to Goal. A
   U-shaped wall makes it look brilliant, then foolish. It can be fast but
   does not generally guarantee the cheapest path.
5. **DFS — The Chaos Goblin.** It follows one branch until it cannot continue.
   It can find a path with low memory, but shortest-path finding is not its
   strength.

Each new algorithm begins with a map chosen to show its personality. Do not
release all five as an unexplained row of buttons on the first visit.

## Core visual language

Visited cells leave translucent footprints. The frontier pulses. The current
cell has an expanding ring. When a path is found, it reconstructs from Goal
back to Start with a deliberate tick-by-tick trace, then the diorama returns to
full brightness.

The terrain remains attractive but fades while search runs; the algorithm’s
thought process is the subject. Every visual state has a text and shape cue as
well as color. Search animation must be deterministic for a given map and
algorithm, including a stated tie-break rule, so comparisons are meaningful.

## Compare and Step modes

**COMPARE** splits the same map into synchronized panels. Run All makes the
differences immediately visible, then reports Visited, Path Steps, Path Cost,
Peak Frontier, and Runtime (where runtime is clearly device-dependent).

Never declare a global winner. Ask the player to choose a criterion: fewest
nodes searched, lowest path cost, fewest steps, least memory, or support for
weighted/negative edges. Explain which measurements are meaningful for the
current map.

**STEP** exposes one action at a time: current place, known cost, neighbor,
existing route, candidate route, and update. **SHOW VALUES** reveals per-cell
values. For A*, show `g`, `h`, and `f`; for Dijkstra, show current best cost.
Values are hidden by default so curiosity, not notation, controls complexity.

## Maps and terrain

Terrain uses explicit costs: wall, road 1, grass 2, sand 4, mud 7, water 12.
The lab repeatedly asks “What does shortest mean here?” The algorithm minimizes
whatever weights represent: time, fuel, price, delay, or risk.

Map types transfer the same logic without changing the visualizer’s core:
Maze (unit steps), City (travel time), Terrain (movement cost), Transit
(stations), Network (latency), and Flights (ticket price). Every type has one
example where a visually direct route is not least-cost.

## Advanced unlocks

After the core lab, add:

- **Bidirectional search:** waves from Start and Goal meet.
- **Bellman–Ford:** introduce negative weights and state that Dijkstra is not
  safe for this map.
- **Floyd–Warshall:** shift from one Start/Goal route to all-pairs paths.
- **A* heuristic experiments:** Manhattan, Euclidean, and None. Setting `h`
  to zero visibly turns A* into Dijkstra.

Use warnings for invalid assumptions rather than silently producing a result.
For example, a negative edge displays: “Dijkstra cannot safely handle this map.”

## Art, access, and trust

Use digital cartography plus miniature diorama: trees sway, water moves, and
city roads carry tiny cars, but decorative motion never obscures state. Preserve
Proof Playground’s shared borders, typography, pastel tokens, and restrained
brand accent.

All map tools need touch, keyboard, and accessible alternatives; a form-based
terrain editor can supplement drawing. Provide text summaries for each step and
comparison result. Respect reduced-motion preferences. No ads, dark patterns,
login, surprise navigation, or unrelated third-party scripts.

## Definition of done

A newcomer can build a map, observe distinct search behaviors, identify why a
given algorithm explored or avoided an area, select a criterion before claiming
a winner, distinguish fewest steps from lowest cost, and explain the important
conditions for BFS, Dijkstra, and A*.

## Sources

- User-provided *Pathfinder Lab* game concept, 2026-08-08.
- `GAME_DESIGN.md` and `src/app/games/shortest-way-home/DESIGN.md`.
