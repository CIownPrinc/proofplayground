import { describe, expect, it } from "vitest";
import {
  DEFAULT_GRAVITY,
  buildCatmullRomCurve,
  buildCircularArcCurve,
  buildCycloidCurve,
  buildLineCurve,
  positionAtTime,
  solveCycloidTheta1,
  timeAlongPolyline,
  totalTime,
  type Point,
} from "./physics";

function expectPointsClose(a: Point, b: Point, tolerance = 1e-4) {
  expect(Math.abs(a.x - b.x)).toBeLessThan(tolerance);
  expect(Math.abs(a.y - b.y)).toBeLessThan(tolerance);
}

describe("solveCycloidTheta1", () => {
  it("round-trips: recovers theta1 from its own ratio", () => {
    for (const theta1 of [0.5, 1.0, Math.PI, 4, 5.5]) {
      const ratio = (theta1 - Math.sin(theta1)) / (1 - Math.cos(theta1));
      const solved = solveCycloidTheta1(ratio, 1);
      expect(solved).toBeCloseTo(theta1, 5);
    }
  });

  it("converges for near-vertical drops (dx -> 0) without NaN/Infinity", () => {
    const theta1 = solveCycloidTheta1(1e-4, 100);
    expect(Number.isFinite(theta1)).toBe(true);
    expect(theta1).toBeGreaterThan(0);
  });

  it("converges for near-horizontal drops (large dx/dy) without NaN/Infinity", () => {
    const theta1 = solveCycloidTheta1(1000, 1);
    expect(Number.isFinite(theta1)).toBe(true);
    expect(theta1).toBeLessThan(2 * Math.PI);
  });
});

describe("buildCycloidCurve", () => {
  const cases: Array<{ start: Point; end: Point }> = [
    { start: { x: 0, y: 100 }, end: { x: 100, y: 0 } }, // symmetric
    { start: { x: 0, y: 100 }, end: { x: 500, y: 10 } }, // dx >> dy
    { start: { x: 0, y: 100 }, end: { x: 20, y: 0 } }, // dx << dy
  ];

  it.each(cases)("starts and ends at the given endpoints ($start -> $end)", ({ start, end }) => {
    const curve = buildCycloidCurve(start, end, 200);
    expectPointsClose(curve[0]!, start);
    expectPointsClose(curve[curve.length - 1]!, end, 1e-3);
  });
});

describe("buildCircularArcCurve", () => {
  it("starts and ends at the given endpoints and stays equidistant from its center", () => {
    const start: Point = { x: 0, y: 100 };
    const end: Point = { x: 200, y: 20 };
    const curve = buildCircularArcCurve(start, end, 200);

    expectPointsClose(curve[0]!, start);
    expectPointsClose(curve[curve.length - 1]!, end, 1e-3);

    const dx = end.x - start.x;
    const dy = start.y - end.y;
    const radius = (dx * dx + dy * dy) / (2 * dx);
    const centerX = start.x + radius;
    const centerY = start.y;

    for (const point of curve) {
      const distance = Math.hypot(point.x - centerX, point.y - centerY);
      expect(Math.abs(distance - Math.abs(radius))).toBeLessThan(1e-6);
    }
  });
});

describe("buildLineCurve", () => {
  it("produces points colinear with start and end", () => {
    const start: Point = { x: 0, y: 100 };
    const end: Point = { x: 200, y: 20 };
    const curve = buildLineCurve(start, end, 50);

    const dx = end.x - start.x;
    const dy = end.y - start.y;
    for (const point of curve) {
      // Cross product of (point - start) and (end - start) should be ~0.
      const cross = (point.x - start.x) * dy - (point.y - start.y) * dx;
      expect(Math.abs(cross)).toBeLessThan(1e-6);
    }
  });
});

describe("cycloid is the fastest descent", () => {
  it("beats both the straight line and the circular arc for a representative drop", () => {
    const start: Point = { x: 0, y: 100 };
    const end: Point = { x: 200, y: 20 };

    const cycloidTime = totalTime(
      timeAlongPolyline(buildCycloidCurve(start, end, 500), start.y, DEFAULT_GRAVITY),
    );
    const lineTime = totalTime(
      timeAlongPolyline(buildLineCurve(start, end, 500), start.y, DEFAULT_GRAVITY),
    );
    const arcTime = totalTime(
      timeAlongPolyline(buildCircularArcCurve(start, end, 500), start.y, DEFAULT_GRAVITY),
    );

    expect(cycloidTime).toBeLessThan(lineTime);
    expect(cycloidTime).toBeLessThan(arcTime);
  });
});

describe("timeAlongPolyline", () => {
  it("produces non-decreasing cumulative distance and time", () => {
    const curve = buildCycloidCurve({ x: 0, y: 100 }, { x: 200, y: 20 }, 200);
    const samples = timeAlongPolyline(curve, 100, DEFAULT_GRAVITY);

    for (let i = 1; i < samples.length; i += 1) {
      expect(samples[i]!.distance).toBeGreaterThanOrEqual(samples[i - 1]!.distance);
      expect(samples[i]!.time).toBeGreaterThanOrEqual(samples[i - 1]!.time);
    }
  });
});

describe("positionAtTime", () => {
  it("clamps to start at t=0 and end at t>=totalTime, and interpolates continuously in between", () => {
    const start: Point = { x: 0, y: 100 };
    const end: Point = { x: 200, y: 20 };
    const curve = buildLineCurve(start, end, 100);
    const samples = timeAlongPolyline(curve, start.y, DEFAULT_GRAVITY);
    const finalTime = totalTime(samples);

    expectPointsClose(positionAtTime(samples, 0), start, 1e-3);
    expectPointsClose(positionAtTime(samples, finalTime), end, 1e-3);
    expectPointsClose(positionAtTime(samples, finalTime + 10), end, 1e-3);

    let previous = positionAtTime(samples, 0);
    for (let i = 1; i <= 50; i += 1) {
      const t = (finalTime * i) / 50;
      const current = positionAtTime(samples, t);
      const step = Math.hypot(current.x - previous.x, current.y - previous.y);
      expect(step).toBeLessThan(50);
      previous = current;
    }
  });
});

describe("buildCatmullRomCurve", () => {
  it("passes exactly through every control point", () => {
    const controlPoints: Point[] = [
      { x: 0, y: 100 },
      { x: 50, y: 60 },
      { x: 120, y: 40 },
      { x: 200, y: 20 },
    ];
    const curve = buildCatmullRomCurve(controlPoints, 300);

    for (const controlPoint of controlPoints) {
      const closest = curve.reduce((best, point) => {
        const d = Math.hypot(point.x - controlPoint.x, point.y - controlPoint.y);
        const bestD = Math.hypot(best.x - controlPoint.x, best.y - controlPoint.y);
        return d < bestD ? point : best;
      });
      expectPointsClose(closest, controlPoint, 1e-3);
    }
  });

  it("produces a finite total time even when an interior point sits at/above start height", () => {
    const controlPoints: Point[] = [
      { x: 0, y: 100 },
      { x: 60, y: 100 }, // at start height -> near-zero velocity plateau
      { x: 200, y: 20 },
    ];
    const curve = buildCatmullRomCurve(controlPoints, 200);
    const samples = timeAlongPolyline(curve, 100, DEFAULT_GRAVITY);
    const time = totalTime(samples);

    expect(Number.isFinite(time)).toBe(true);
    expect(time).toBeGreaterThan(0);
  });

  it("handles just two control points (no interior points) without throwing", () => {
    const curve = buildCatmullRomCurve(
      [
        { x: 0, y: 100 },
        { x: 200, y: 20 },
      ],
      100,
    );
    expect(curve.length).toBeGreaterThan(0);
    expect(Number.isFinite(curve[0]!.x)).toBe(true);
  });
});

describe("degenerate geometry", () => {
  it("does not throw for a near-zero-length curve", () => {
    expect(() => {
      const curve = buildCycloidCurve({ x: 0, y: 100 }, { x: 0.01, y: 99.99 }, 50);
      timeAlongPolyline(curve, 100, DEFAULT_GRAVITY);
    }).not.toThrow();
  });
});
