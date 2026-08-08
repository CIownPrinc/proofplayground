"use client";

import { useEffect } from "react";

import { unlockAchievement } from "@/hooks/use-achievements";

const ACHIEVEMENT_IDS = new Set([
  "econopolis-first-term",
  "econopolis-story",
  "econopolis-harsh",
]);

/** Receives milestone events from Econopolis's same-origin iframe. */
export function EconopolisAchievementBridge() {
  useEffect(() => {
    function onMessage(event: MessageEvent<unknown>) {
      if (event.origin !== window.location.origin || typeof event.data !== "object" || event.data === null) {
        return;
      }

      const message = event.data as { source?: unknown; type?: unknown; id?: unknown };
      if (
        message.source === "econopolis" &&
        message.type === "achievement" &&
        typeof message.id === "string" &&
        ACHIEVEMENT_IDS.has(message.id)
      ) {
        unlockAchievement(message.id);
      }
    }

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return null;
}
