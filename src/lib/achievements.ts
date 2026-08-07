import { Laugh, Mail, RollerCoaster, type LucideIcon } from "lucide-react";

export interface AchievementDef {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  // Fixed (non-theme) sticker color. Deliberately its own small palette —
  // not borrowed from any one game's art direction, since achievements are
  // site-wide and future games each get their own distinct look.
  color: string;
}

// The single source of truth for what's collectible on the site. Add a new
// entry here and call unlockAchievement(id) from wherever it's earned — the
// notebook picks it up automatically.
export const ACHIEVEMENTS: AchievementDef[] = [
  {
    id: "brachistochrone",
    title: "Race to the Bottom",
    description: "Played all the way through the brachistochrone game.",
    icon: RollerCoaster,
    color: "oklch(0.56 0.22 293)", // brand purple — the site's own accent, not the game's
  },
  {
    id: "newsletter",
    title: "On the List",
    description: "Signed up for the newsletter.",
    icon: Mail,
    color: "oklch(0.7 0.13 200)", // teal
  },
  {
    id: "face-drop",
    title: "Face Plant",
    description: "Dropped the face on the homepage and let it hit the floor.",
    icon: Laugh,
    color: "oklch(0.72 0.17 350)", // rose pink
  },
];

export function getAchievement(id: string): AchievementDef | undefined {
  return ACHIEVEMENTS.find((achievement) => achievement.id === id);
}
