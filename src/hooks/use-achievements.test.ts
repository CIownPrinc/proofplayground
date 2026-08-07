// @vitest-environment jsdom
import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import { unlockAchievement, useAchievements } from "./use-achievements";

beforeEach(() => {
  window.localStorage.clear();
});

describe("useAchievements", () => {
  it("starts empty", () => {
    const { result } = renderHook(() => useAchievements());
    expect(result.current).toEqual({});
  });

  it("reflects an unlock made outside the hook", () => {
    const { result } = renderHook(() => useAchievements());

    act(() => {
      unlockAchievement("brachistochrone");
    });

    expect(Object.keys(result.current)).toEqual(["brachistochrone"]);
    expect(typeof result.current.brachistochrone).toBe("string");
  });

  it("does not clobber the original timestamp on a repeat unlock", () => {
    unlockAchievement("newsletter");
    const firstTimestamp = JSON.parse(
      window.localStorage.getItem("proofplayground:achievements") ?? "{}",
    ).newsletter as string;

    unlockAchievement("newsletter");
    const secondTimestamp = JSON.parse(
      window.localStorage.getItem("proofplayground:achievements") ?? "{}",
    ).newsletter as string;

    expect(secondTimestamp).toBe(firstTimestamp);
  });

  it("treats corrupt storage as no achievements unlocked", () => {
    window.localStorage.setItem("proofplayground:achievements", "{not json");
    const { result } = renderHook(() => useAchievements());
    expect(result.current).toEqual({});
  });

  it("tracks multiple independent achievements", () => {
    const { result } = renderHook(() => useAchievements());

    act(() => {
      unlockAchievement("face-drop");
      unlockAchievement("newsletter");
    });

    expect(Object.keys(result.current).sort()).toEqual(["face-drop", "newsletter"]);
  });
});
