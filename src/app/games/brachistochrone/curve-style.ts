import type { CurveId } from "./use-brachistochrone-sim";

export interface CurveStyle {
  label: string;
  stroke: string;
  dash?: string;
}

// Flat, distinguishable colors in the site's own palette family — the
// "loser" paths stay muted/gray, the cycloid gets the warm gold that reads
// as the winner, matching how it's talked about in the story.
export const CURVE_STYLE: Record<CurveId, CurveStyle> = {
  line: { label: "Straight line", stroke: "oklch(0.65 0.01 260)", dash: "6 5" },
  arc: { label: "Circular arc", stroke: "oklch(0.68 0.16 20)" },
  cycloid: { label: "Cycloid", stroke: "oklch(0.72 0.15 75)" },
  custom: { label: "Your path", stroke: "var(--brand)", dash: "1 5" },
};
