"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  MIN_DX,
  MIN_DY,
  VIEW_BOX_HEIGHT,
  VIEW_BOX_WIDTH,
  buildCatmullRomCurve,
  buildCircularArcCurve,
  buildCycloidCurve,
  buildLineCurve,
  positionAtTime,
  timeAlongPolyline,
  totalTime,
  type Point,
  type TimedSample,
} from "./physics";

export type CurveId = "line" | "arc" | "cycloid" | "custom";
export type SimPhase = "idle" | "guessing" | "racing" | "finished";

export interface RaceResult {
  curveId: CurveId;
  time: number;
  place: number;
}

const DEFAULT_START: Point = { x: 100, y: VIEW_BOX_HEIGHT - 80 };
const DEFAULT_END: Point = { x: 700, y: VIEW_BOX_HEIGHT - 420 };

// Keep in sync with curve-canvas.tsx's own drag-clamp margin — this is the
// same "stay fully visible inside the track" boundary, just applied to
// points repositioned programmatically (as a side effect of moving start)
// rather than by a live pointer drag.
const HANDLE_MARGIN = 12;

function clampToViewBox(point: Point): Point {
  return {
    x: Math.min(Math.max(point.x, HANDLE_MARGIN), VIEW_BOX_WIDTH - HANDLE_MARGIN),
    y: Math.min(Math.max(point.y, HANDLE_MARGIN), VIEW_BOX_HEIGHT - HANDLE_MARGIN),
  };
}

// Enforces the minimum separation from start AND keeps the result inside
// the visible track — dragging start close to end's edge of the box used to
// push end right out of the viewBox, since only the relative offset was
// clamped before.
function clampEndRelativeToStart(start: Point, proposedEnd: Point): Point {
  const dx = Math.max(MIN_DX, proposedEnd.x - start.x);
  const dy = Math.max(MIN_DY, start.y - proposedEnd.y);
  return clampToViewBox({ x: start.x + dx, y: start.y - dy });
}

// Interior custom points may never sit above the start's height — that
// produces a negative drop, which physics.ts already floors to v=0, but
// clamping here keeps the drag itself from feeling broken.
function clampCustomPoint(start: Point, proposed: Point): Point {
  return clampToViewBox({ x: proposed.x, y: Math.min(proposed.y, start.y) });
}

export function useBrachistochroneSim() {
  const [phase, setPhase] = useState<SimPhase>("idle");
  const [start, setStart] = useState<Point>(DEFAULT_START);
  const [end, setEndRaw] = useState<Point>(DEFAULT_END);
  const [customPoints, setCustomPoints] = useState<Point[]>([]);
  const [guess, setGuess] = useState<CurveId | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [results, setResults] = useState<RaceResult[] | null>(null);

  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  const hasCustomCurve = customPoints.length > 0;

  const curves = useMemo<Record<CurveId, TimedSample[]>>(
    () => ({
      line: timeAlongPolyline(buildLineCurve(start, end), start.y),
      arc: timeAlongPolyline(buildCircularArcCurve(start, end), start.y),
      cycloid: timeAlongPolyline(buildCycloidCurve(start, end), start.y),
      custom: timeAlongPolyline(buildCatmullRomCurve([start, ...customPoints, end]), start.y),
    }),
    [start, end, customPoints],
  );

  const activeCurveIds = useMemo<CurveId[]>(
    () => (hasCustomCurve ? ["line", "arc", "cycloid", "custom"] : ["line", "arc", "cycloid"]),
    [hasCustomCurve],
  );

  const stopRaceLoop = useCallback(() => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
  }, []);

  // Any change to the geometry invalidates whatever guess/race was in
  // progress — re-dragging mid-race would desync the running animation from
  // the curves it was measured against.
  const backToIdle = useCallback(() => {
    stopRaceLoop();
    setPhase("idle");
    setGuess(null);
    setElapsed(0);
    setResults(null);
  }, [stopRaceLoop]);

  const updateStart = useCallback(
    (point: Point) => {
      backToIdle();
      setStart(point);
      setEndRaw((currentEnd) => clampEndRelativeToStart(point, currentEnd));
      setCustomPoints((points) => points.map((p) => clampCustomPoint(point, p)));
    },
    [backToIdle],
  );

  const updateEnd = useCallback(
    (point: Point) => {
      backToIdle();
      setEndRaw(clampEndRelativeToStart(start, point));
    },
    [backToIdle, start],
  );

  const updateCustomPoint = useCallback(
    (index: number, point: Point) => {
      backToIdle();
      setCustomPoints((points) =>
        points.map((p, i) => (i === index ? clampCustomPoint(start, point) : p)),
      );
    },
    [backToIdle, start],
  );

  const addCustomPoint = useCallback(() => {
    backToIdle();
    setCustomPoints((points) => [
      ...points,
      { x: (start.x + end.x) / 2, y: (start.y + end.y) / 2 },
    ]);
  }, [backToIdle, start, end]);

  const removeCustomPoint = useCallback(
    (index: number) => {
      backToIdle();
      setCustomPoints((points) => points.filter((_, i) => i !== index));
    },
    [backToIdle],
  );

  const chooseGuess = useCallback((id: CurveId) => {
    setPhase((current) => (current === "idle" || current === "guessing" ? "guessing" : current));
    setGuess(id);
  }, []);

  // curveIds lets a caller race a subset (e.g. only the curves unlocked so
  // far in a guided walkthrough) instead of every curve the sim knows about.
  const startRace = useCallback(
    (curveIds?: CurveId[]) => {
      if (guess === null) return;
      stopRaceLoop();
      setPhase("racing");
      setElapsed(0);
      setResults(null);

      const startedAt = performance.now();
      const idsAtStart = curveIds ?? activeCurveIds;
      const curvesAtStart = curves;
      const maxTotal = Math.max(...idsAtStart.map((id) => totalTime(curvesAtStart[id])));

      function tick(now: number) {
        const nextElapsed = (now - startedAt) / 1000;

        if (nextElapsed >= maxTotal) {
          setElapsed(maxTotal);
          const finalResults: RaceResult[] = idsAtStart
            .map((id) => ({ curveId: id, time: totalTime(curvesAtStart[id]) }))
            .sort((a, b) => a.time - b.time)
            .map((entry, index) => ({ ...entry, place: index + 1 }));
          setResults(finalResults);
          setPhase("finished");
          frameRef.current = null;
          return;
        }

        setElapsed(nextElapsed);
        frameRef.current = requestAnimationFrame(tick);
      }

      frameRef.current = requestAnimationFrame(tick);
    },
    [guess, stopRaceLoop, activeCurveIds, curves],
  );

  const reset = useCallback(() => {
    backToIdle();
  }, [backToIdle]);

  const ballPositions = useMemo(() => {
    const positions: Partial<Record<CurveId, Point>> = {};
    for (const id of activeCurveIds) {
      positions[id] = positionAtTime(curves[id], elapsed);
    }
    return positions;
  }, [activeCurveIds, curves, elapsed]);

  return {
    phase,
    start,
    end,
    customPoints,
    curves,
    activeCurveIds,
    hasCustomCurve,
    guess,
    elapsed,
    results,
    ballPositions,
    setStart: updateStart,
    setEnd: updateEnd,
    setCustomPoint: updateCustomPoint,
    addCustomPoint,
    removeCustomPoint,
    setGuess: chooseGuess,
    startRace,
    reset,
  };
}

export type BrachistochroneSim = ReturnType<typeof useBrachistochroneSim>;
