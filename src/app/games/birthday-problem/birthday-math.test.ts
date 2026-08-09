import { describe, expect, it } from "vitest";

import {
  DAYS_IN_YEAR,
  exactCollisionProbability,
  exactUniformCollisionProbability,
  simulateBirthdayRooms,
  uniformWeights,
  usPatternWeights,
} from "./birthday-math";

describe("birthday probability", () => {
  it("matches the classic 23-person result", () => {
    expect(exactUniformCollisionProbability(23)).toBeCloseTo(0.5073, 3);
  });

  it("matches the uniform result through the general probability calculation", () => {
    expect(exactCollisionProbability(23, uniformWeights())).toBeCloseTo(
      exactUniformCollisionProbability(23),
      10,
    );
  });

  it("is certain once the group exceeds the available birthdays", () => {
    expect(exactUniformCollisionProbability(DAYS_IN_YEAR + 1)).toBe(1);
  });

  it("normalizes both distributions to one", () => {
    expect(uniformWeights().reduce((sum, weight) => sum + weight, 0)).toBeCloseTo(1);
    expect(usPatternWeights().reduce((sum, weight) => sum + weight, 0)).toBeCloseTo(1);
  });

  it("detects a collision in a deterministic simulated room", () => {
    const alwaysFirstDay = () => 0;
    const result = simulateBirthdayRooms(2, uniformWeights(), 1, alwaysFirstDay);
    expect(result.collisionRate).toBe(1);
    expect(result.lastRoom).toEqual([0, 0]);
  });
});
