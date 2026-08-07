"use client";

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "proofplayground:achievements";
const CHANGE_EVENT = "proofplayground:achievements-changed";

// id -> ISO timestamp of when it was unlocked
export type AchievementMap = Record<string, string>;

const EMPTY_MAP: AchievementMap = {};

function readMap(): AchievementMap {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return EMPTY_MAP;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed === "object" && parsed !== null) return parsed as AchievementMap;
  } catch {
    // corrupt value — treat as "nothing unlocked yet"
  }
  return EMPTY_MAP;
}

// useSyncExternalStore requires getSnapshot to return a referentially stable
// value when the underlying data hasn't changed, so this caches the last
// parsed object per raw string and only re-parses when the raw value differs.
let cache: { raw: string | null; value: AchievementMap } = { raw: null, value: EMPTY_MAP };
function getSnapshot(): AchievementMap {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw === cache.raw) return cache.value;
  const value = readMap();
  cache = { raw, value };
  return value;
}

function getServerSnapshot(): AchievementMap {
  return EMPTY_MAP;
}

function subscribe(callback: () => void) {
  // Same-tab writes don't fire the native "storage" event, so unlockAchievement
  // dispatches this custom event too — that's what makes the notebook and the
  // homepage easter egg update immediately when something unlocks elsewhere
  // on the page, not just after a reload.
  window.addEventListener(CHANGE_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

export function useAchievements(): AchievementMap {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function unlockAchievement(id: string): void {
  if (typeof window === "undefined") return;
  const current = readMap();
  if (current[id]) return; // already unlocked — keep the original timestamp
  const next = { ...current, [id]: new Date().toISOString() };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}
