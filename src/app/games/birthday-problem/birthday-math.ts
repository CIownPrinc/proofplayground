export const DAYS_IN_YEAR = 365;

export type BirthdayDistribution = "uniform" | "us-pattern";

export interface SimulationResult {
  collisionRate: number;
  matchingPeople: number;
  lastRoom: number[];
}

const MONTH_LENGTHS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31] as const;

// A compact, classroom-friendly approximation of the broad U.S. daily birth
// pattern seen in public vital-statistics data: births crest in late summer / early
// autumn, dip around major holidays, and are slightly lower on weekends. It is
// intentionally shown as a pattern, not passed off as a universal distribution.
const MONTH_BASELINES = [0.94, 0.93, 0.96, 0.98, 0.99, 1, 0.99, 1.04, 1.09, 1.07, 1.01, 0.94] as const;
const HOLIDAY_DIPS: Record<number, number> = {
  0: 0.58, // Jan 1
  184: 0.67, // Jul 4
  327: 0.63, // Thanksgiving-ish window
  357: 0.5, // Dec 24
  358: 0.42, // Dec 25
  364: 0.56, // Dec 31
};

export function monthForDay(day: number): number {
  let remaining = day;
  for (let month = 0; month < MONTH_LENGTHS.length; month += 1) {
    const length = MONTH_LENGTHS[month]!;
    if (remaining < length) return month;
    remaining -= length;
  }
  return 11;
}

export function labelForDay(day: number): string {
  const date = new Date(Date.UTC(2025, 0, 1 + day));
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" }).format(date);
}

export function uniformWeights(): number[] {
  return Array.from({ length: DAYS_IN_YEAR }, () => 1 / DAYS_IN_YEAR);
}

export function usPatternWeights(): number[] {
  const raw = Array.from({ length: DAYS_IN_YEAR }, (_, day) => {
    const month = monthForDay(day);
    const weekday = new Date(Date.UTC(2025, 0, 1 + day)).getUTCDay();
    const weekendFactor = weekday === 0 || weekday === 6 ? 0.88 : 1;
    // Small day-to-day variation prevents the distribution from just being twelve bars.
    const seasonalRipple = 1 + 0.025 * Math.sin((day * Math.PI * 2) / 29);
    return MONTH_BASELINES[month]! * weekendFactor * seasonalRipple * (HOLIDAY_DIPS[day] ?? 1);
  });
  const total = raw.reduce((sum, weight) => sum + weight, 0);
  return raw.map((weight) => weight / total);
}

export function exactUniformCollisionProbability(groupSize: number): number {
  if (groupSize <= 1) return 0;
  if (groupSize > DAYS_IN_YEAR) return 1;

  let noMatch = 1;
  for (let person = 0; person < groupSize; person += 1) {
    noMatch *= (DAYS_IN_YEAR - person) / DAYS_IN_YEAR;
  }
  return 1 - noMatch;
}

// For an uneven birthday bowl, sum every way `groupSize` distinct days can
// be drawn. This keeps the comparison exact instead of using a noisy sample.
export function exactCollisionProbability(groupSize: number, weights: number[]): number {
  if (groupSize <= 1) return 0;
  if (groupSize > weights.length) return 1;

  const distinctDayWeightSums = Array.from({ length: groupSize + 1 }, () => 0);
  distinctDayWeightSums[0] = 1;
  for (const weight of weights) {
    for (let size = groupSize; size >= 1; size -= 1) {
      distinctDayWeightSums[size] =
        distinctDayWeightSums[size]! + distinctDayWeightSums[size - 1]! * weight;
    }
  }

  let arrangements = 1;
  for (let size = 2; size <= groupSize; size += 1) arrangements *= size;
  return 1 - arrangements * distinctDayWeightSums[groupSize]!;
}

function cumulativeWeights(weights: number[]): number[] {
  const cumulative: number[] = [];
  let total = 0;
  for (const weight of weights) {
    total += weight;
    cumulative.push(total);
  }
  cumulative[cumulative.length - 1] = 1;
  return cumulative;
}

export function drawBirthday(weights: number[], random = Math.random): number {
  const cumulative = cumulativeWeights(weights);
  const target = random();
  let low = 0;
  let high = cumulative.length - 1;
  while (low < high) {
    const middle = Math.floor((low + high) / 2);
    if (target <= cumulative[middle]!) high = middle;
    else low = middle + 1;
  }
  return low;
}

export function simulateBirthdayRooms(
  groupSize: number,
  weights: number[],
  rooms = 10_000,
  random = Math.random,
): SimulationResult {
  const cumulative = cumulativeWeights(weights);
  let collisions = 0;
  let matchingPeople = 0;
  let lastRoom: number[] = [];

  for (let room = 0; room < rooms; room += 1) {
    const seen = new Map<number, number>();
    const birthdays: number[] = [];
    let hasCollision = false;
    for (let person = 0; person < groupSize; person += 1) {
      const target = random();
      let low = 0;
      let high = cumulative.length - 1;
      while (low < high) {
        const middle = Math.floor((low + high) / 2);
        if (target <= cumulative[middle]!) high = middle;
        else low = middle + 1;
      }
      const birthday = low;
      birthdays.push(birthday);
      seen.set(birthday, (seen.get(birthday) ?? 0) + 1);
    }
    for (const count of seen.values()) {
      if (count > 1) {
        hasCollision = true;
        matchingPeople += count;
      }
    }
    if (hasCollision) collisions += 1;
    if (room === rooms - 1) lastRoom = birthdays;
  }

  return { collisionRate: collisions / rooms, matchingPeople, lastRoom };
}

export function distributionFor(kind: BirthdayDistribution): number[] {
  return kind === "uniform" ? uniformWeights() : usPatternWeights();
}
