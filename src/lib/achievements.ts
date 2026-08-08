import { CakeSlice, FlaskConical, GraduationCap, Landmark, Laugh, Mail, RollerCoaster, ShieldCheck, UsersRound, type LucideIcon } from "lucide-react";

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
  {
    id: "econopolis-first-term",
    title: "First Term",
    description: "Saw an Econopolis challenge through to its final report.",
    icon: Landmark,
    color: "oklch(0.7 0.16 62)", // sunset orange
  },
  {
    id: "econopolis-story",
    title: "Policy Wonky",
    description: "Completed an Econopolis story chapter.",
    icon: GraduationCap,
    color: "oklch(0.68 0.13 225)", // city blue
  },
  {
    id: "econopolis-harsh",
    title: "Against All Odds",
    description: "Met an Econopolis objective on Harsh difficulty.",
    icon: ShieldCheck,
    color: "oklch(0.63 0.16 28)", // deep red-orange
  },
  {
    id: "birthday-lab-match",
    title: "Same Day!",
    description: "Found a shared birthday at the party.",
    icon: CakeSlice,
    color: "oklch(0.72 0.16 350)",
  },
  {
    id: "birthday-lab-23",
    title: "The 23rd Guest",
    description: "Filled the lawn and reached the birthday surprise.",
    icon: UsersRound,
    color: "oklch(0.72 0.15 75)",
  },
  {
    id: "birthday-lab-real",
    title: "Real Bowl",
    description: "Tried the birthday bowl with uneven real-world patterns.",
    icon: FlaskConical,
    color: "oklch(0.68 0.13 235)",
  },
];

export function getAchievement(id: string): AchievementDef | undefined {
  return ACHIEVEMENTS.find((achievement) => achievement.id === id);
}
