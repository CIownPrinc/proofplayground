/**
 * Pure brachistochrone physics: curve generation and energy-conservation time
 * integration. Coordinate convention is math-space (+y = up, gravity pulls
 * toward -y). No DOM/SVG imports — rendering flips to SVG space at the
 * component boundary.
 */

export interface Point {
  x: number;
  y: number;
}

export interface TimedSample {
  point: Point;
  distance: number;
  time: number;
}

export const DEFAULT_GRAVITY = 600;

/** Shared SVG viewBox dimensions — one source of truth for the sim hook (default point placement) and the canvas (rendering + drag clamping). */
export const VIEW_BOX_WIDTH = 800;
export const VIEW_BOX_HEIGHT = 500;

/** Minimum horizontal/vertical separation enforced between start and end while dragging, in viewBox units. */
export const MIN_DX = 80;
export const MIN_DY = 60;

const MIN_VELOCITY = 1e-3;

/**
 * Solves theta1 in (θ - sinθ) / (1 - cosθ) = dx / dy via bisection. This
 * ratio is monotonically increasing from 0 to +Infinity on (0, 2π), so a
 * unique root always exists for any dx, dy > 0.
 */
export function solveCycloidTheta1(
  dx: number,
  dy: number,
  tolerance = 1e-9,
  maxIterations = 100,
): number {
  const target = dx / dy;
  const ratioAt = (theta: number): number => (theta - Math.sin(theta)) / (1 - Math.cos(theta));

  let lo = 1e-6;
  let hi = 2 * Math.PI - 1e-6;
  let iterations = 0;

  while (hi - lo > tolerance && iterations < maxIterations) {
    const mid = (lo + hi) / 2;
    if (ratioAt(mid) < target) {
      lo = mid;
    } else {
      hi = mid;
    }
    iterations += 1;
  }

  return (lo + hi) / 2;
}

/** True brachistochrone solution: the unique cycloid connecting start to end. */
export function buildCycloidCurve(start: Point, end: Point, samples = 200): Point[] {
  const dx = end.x - start.x;
  const dy = start.y - end.y;
  const theta1 = solveCycloidTheta1(dx, dy);
  const radius = dy / (1 - Math.cos(theta1));

  const points: Point[] = [];
  for (let i = 0; i <= samples; i += 1) {
    const t = i / samples;
    // Squaring clusters samples near theta=0, the cusp where velocity -> 0
    // and the time integral needs the most resolution.
    const theta = theta1 * t * t;
    points.push({
      x: start.x + radius * (theta - Math.sin(theta)),
      y: start.y - radius * (1 - Math.cos(theta)),
    });
  }
  return points;
}

/**
 * Circle tangent to vertical at the start point (same initial straight-down
 * direction as the cycloid's cusp), passing through the end point. Closed
 * form, no root-finding needed.
 */
export function buildCircularArcCurve(start: Point, end: Point, samples = 200): Point[] {
  const dx = end.x - start.x;
  const dy = start.y - end.y;
  const radius = (dx * dx + dy * dy) / (2 * dx);
  const centerX = start.x + radius;
  const centerY = start.y;

  let phiEnd = Math.atan2(-dy, dx - radius);
  if (phiEnd < 0) phiEnd += 2 * Math.PI;

  const points: Point[] = [];
  for (let i = 0; i <= samples; i += 1) {
    const t = i / samples;
    const phi = Math.PI + t * (phiEnd - Math.PI);
    points.push({
      x: centerX + radius * Math.cos(phi),
      y: centerY + radius * Math.sin(phi),
    });
  }
  return points;
}

export function buildLineCurve(start: Point, end: Point, samples = 50): Point[] {
  const points: Point[] = [];
  for (let i = 0; i <= samples; i += 1) {
    const t = i / samples;
    points.push({
      x: start.x + (end.x - start.x) * t,
      y: start.y + (end.y - start.y) * t,
    });
  }
  return points;
}

/**
 * Catmull-Rom spline through [start, ...interior, end]. Passes exactly
 * through every control point. Endpoints use a clamped phantom point (the
 * neighbor duplicated) so the curve doesn't overshoot past start/end.
 */
export function buildCatmullRomCurve(controlPoints: Point[], samples = 200): Point[] {
  if (controlPoints.length < 2) {
    return [...controlPoints];
  }

  const getPoint = (index: number): Point => {
    const clampedIndex = Math.min(Math.max(index, 0), controlPoints.length - 1);
    return controlPoints[clampedIndex]!;
  };

  const segmentCount = controlPoints.length - 1;
  const samplesPerSegment = Math.max(1, Math.round(samples / segmentCount));
  const points: Point[] = [];

  for (let seg = 0; seg < segmentCount; seg += 1) {
    const p0 = getPoint(seg - 1);
    const p1 = getPoint(seg);
    const p2 = getPoint(seg + 1);
    const p3 = getPoint(seg + 2);

    // Skip t=0 on every segment after the first — it's the same point as
    // the previous segment's t=1, and we don't want it duplicated.
    const startStep = seg === 0 ? 0 : 1;
    for (let i = startStep; i <= samplesPerSegment; i += 1) {
      const t = i / samplesPerSegment;
      const t2 = t * t;
      const t3 = t2 * t;
      points.push({
        x:
          0.5 *
          (2 * p1.x +
            (-p0.x + p2.x) * t +
            (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
            (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
        y:
          0.5 *
          (2 * p1.y +
            (-p0.y + p2.y) * t +
            (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
            (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3),
      });
    }
  }

  return points;
}

/**
 * Energy-conservation time-of-descent along an arbitrary polyline:
 * v = sqrt(2 * g * max(0, startY - y)) at each sample, trapezoidal
 * integration of dt = ds / avg(v_i, v_i+1). Average velocity is floored
 * (not branched) so a curve with a plateau at ~startY produces a very slow
 * but finite time rather than dividing by zero.
 */
export function timeAlongPolyline(
  points: Point[],
  startY: number,
  gravity: number = DEFAULT_GRAVITY,
): TimedSample[] {
  if (points.length === 0) {
    return [];
  }

  const velocityAt = (y: number): number => Math.sqrt(2 * gravity * Math.max(0, startY - y));

  const firstPoint = points[0]!;
  const samples: TimedSample[] = [{ point: firstPoint, distance: 0, time: 0 }];

  let cumulativeDistance = 0;
  let cumulativeTime = 0;
  let previousVelocity = velocityAt(firstPoint.y);

  for (let i = 1; i < points.length; i += 1) {
    const previous = points[i - 1]!;
    const current = points[i]!;
    const segmentLength = Math.hypot(current.x - previous.x, current.y - previous.y);
    const currentVelocity = velocityAt(current.y);
    const averageVelocity = Math.max(MIN_VELOCITY, (previousVelocity + currentVelocity) / 2);

    cumulativeDistance += segmentLength;
    cumulativeTime += segmentLength / averageVelocity;
    samples.push({ point: current, distance: cumulativeDistance, time: cumulativeTime });

    previousVelocity = currentVelocity;
  }

  return samples;
}

/** Binary-searches t into the cumulative-time array and interpolates position. Clamps t to [0, totalTime]. */
export function positionAtTime(samples: TimedSample[], t: number): Point {
  if (samples.length === 0) {
    return { x: 0, y: 0 };
  }

  const first = samples[0]!;
  const last = samples[samples.length - 1]!;
  if (t <= first.time) return first.point;
  if (t >= last.time) return last.point;

  let lo = 0;
  let hi = samples.length - 1;
  while (hi - lo > 1) {
    const mid = Math.floor((lo + hi) / 2);
    if (samples[mid]!.time <= t) {
      lo = mid;
    } else {
      hi = mid;
    }
  }

  const a = samples[lo]!;
  const b = samples[hi]!;
  const span = b.time - a.time;
  const ratio = span > 0 ? (t - a.time) / span : 0;

  return {
    x: a.point.x + (b.point.x - a.point.x) * ratio,
    y: a.point.y + (b.point.y - a.point.y) * ratio,
  };
}

export function totalTime(samples: TimedSample[]): number {
  if (samples.length === 0) {
    return 0;
  }
  return samples[samples.length - 1]!.time;
}
