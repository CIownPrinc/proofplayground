// @vitest-environment jsdom
import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { VIEW_BOX_HEIGHT, VIEW_BOX_WIDTH } from "./physics";
import { useBrachistochroneSim } from "./use-brachistochrone-sim";

const HANDLE_MARGIN = 12; // kept in sync with the margin baked into the hook

// The real race loop drives itself frame-by-frame via requestAnimationFrame,
// which would make these tests slow (and flaky) if we waited on real
// timers. Stubbing rAF to fire once with a timestamp far past any possible
// race duration collapses a race to a single synchronous tick, so
// `startRace` resolves to "finished" before the act() call even returns.
beforeEach(() => {
  vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
    cb(performance.now() + 1_000_000);
    return 0;
  });
  vi.stubGlobal("cancelAnimationFrame", () => {});
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("useBrachistochroneSim — initial state", () => {
  it("starts idle with no guess, no custom curve, and the three canonical curves active", () => {
    const { result } = renderHook(() => useBrachistochroneSim());

    expect(result.current.phase).toBe("idle");
    expect(result.current.guess).toBeNull();
    expect(result.current.hasCustomCurve).toBe(false);
    expect(result.current.activeCurveIds).toEqual(["line", "arc", "cycloid"]);
    expect(result.current.results).toBeNull();
  });
});

describe("useBrachistochroneSim — geometry clamping", () => {
  it("keeps end inside the viewBox even when start is dragged very close to end's edge", () => {
    // Regression test: dragging start down used to push end out of frame,
    // because only the minimum separation from start was enforced, not
    // end's absolute position within the visible track.
    const { result } = renderHook(() => useBrachistochroneSim());

    act(() => {
      result.current.setStart({ x: 50, y: HANDLE_MARGIN + 5 });
    });

    expect(result.current.end.x).toBeGreaterThanOrEqual(HANDLE_MARGIN);
    expect(result.current.end.x).toBeLessThanOrEqual(VIEW_BOX_WIDTH - HANDLE_MARGIN);
    expect(result.current.end.y).toBeGreaterThanOrEqual(HANDLE_MARGIN);
    expect(result.current.end.y).toBeLessThanOrEqual(VIEW_BOX_HEIGHT - HANDLE_MARGIN);
  });

  it("keeps custom points inside the viewBox when start moves near an edge", () => {
    const { result } = renderHook(() => useBrachistochroneSim());

    act(() => {
      result.current.addCustomPoint();
    });
    act(() => {
      result.current.setStart({ x: VIEW_BOX_WIDTH - 5, y: HANDLE_MARGIN + 5 });
    });

    for (const point of result.current.customPoints) {
      expect(point.x).toBeGreaterThanOrEqual(HANDLE_MARGIN);
      expect(point.x).toBeLessThanOrEqual(VIEW_BOX_WIDTH - HANDLE_MARGIN);
      expect(point.y).toBeGreaterThanOrEqual(HANDLE_MARGIN);
      expect(point.y).toBeLessThanOrEqual(VIEW_BOX_HEIGHT - HANDLE_MARGIN);
    }
  });

  it("never lets end sit above start (positive drop is required)", () => {
    const { result } = renderHook(() => useBrachistochroneSim());

    act(() => {
      result.current.setEnd({ x: 600, y: 490 }); // near the very top of the track
    });

    expect(result.current.end.y).toBeLessThan(result.current.start.y);
  });

  it("any geometry change invalidates an in-progress guess", () => {
    const { result } = renderHook(() => useBrachistochroneSim());

    act(() => {
      result.current.setGuess("cycloid");
    });
    expect(result.current.phase).toBe("guessing");

    act(() => {
      result.current.setEnd({ x: 650, y: 90 });
    });

    expect(result.current.phase).toBe("idle");
    expect(result.current.guess).toBeNull();
  });
});

describe("useBrachistochroneSim — custom curve lifecycle", () => {
  it("only marks the custom curve active once a point has been added", () => {
    const { result } = renderHook(() => useBrachistochroneSim());

    expect(result.current.activeCurveIds).not.toContain("custom");

    act(() => {
      result.current.addCustomPoint();
    });
    expect(result.current.hasCustomCurve).toBe(true);
    expect(result.current.activeCurveIds).toContain("custom");

    act(() => {
      result.current.removeCustomPoint(0);
    });
    expect(result.current.hasCustomCurve).toBe(false);
    expect(result.current.activeCurveIds).not.toContain("custom");
  });
});

describe("useBrachistochroneSim — race flow", () => {
  it("does nothing if startRace is called without a guess", () => {
    const { result } = renderHook(() => useBrachistochroneSim());

    act(() => {
      result.current.startRace();
    });

    expect(result.current.phase).toBe("idle");
    expect(result.current.results).toBeNull();
  });

  it("races, finishes, and ranks results fastest-first with the cycloid winning", () => {
    const { result } = renderHook(() => useBrachistochroneSim());

    act(() => {
      result.current.setGuess("cycloid");
    });
    act(() => {
      result.current.startRace();
    });

    expect(result.current.phase).toBe("finished");
    expect(result.current.results).not.toBeNull();

    const results = result.current.results!;
    expect(results).toHaveLength(3);
    expect(results[0]!.place).toBe(1);
    expect(results[0]!.curveId).toBe("cycloid");

    // Places are a strictly increasing sequence sorted by time.
    for (let i = 1; i < results.length; i += 1) {
      expect(results[i]!.place).toBe(i + 1);
      expect(results[i]!.time).toBeGreaterThanOrEqual(results[i - 1]!.time);
    }
  });

  it("races only the curve subset passed to startRace", () => {
    const { result } = renderHook(() => useBrachistochroneSim());

    act(() => {
      result.current.setGuess("line");
    });
    act(() => {
      result.current.startRace(["line", "cycloid"]);
    });

    expect(result.current.results).toHaveLength(2);
    expect(result.current.results!.map((r) => r.curveId).sort()).toEqual(["cycloid", "line"]);
  });

  it("reset clears race state but keeps the current geometry", () => {
    const { result } = renderHook(() => useBrachistochroneSim());

    act(() => {
      result.current.setEnd({ x: 650, y: 90 });
    });
    const movedEnd = result.current.end;

    act(() => {
      result.current.setGuess("cycloid");
    });
    act(() => {
      result.current.startRace();
    });
    expect(result.current.phase).toBe("finished");

    act(() => {
      result.current.reset();
    });

    expect(result.current.phase).toBe("idle");
    expect(result.current.guess).toBeNull();
    expect(result.current.results).toBeNull();
    expect(result.current.end).toEqual(movedEnd);
  });
});
