import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy — Proof Playground",
  description: "How Proof Playground handles data.",
};

const LAST_UPDATED = "August 5, 2026";

interface PolicySection {
  heading: string;
  body: string[];
}

// Add new sections here as the site grows (accounts, analytics, a mailing
// list, etc.) — each one just needs a heading and one or more paragraphs.
const SECTIONS: PolicySection[] = [
  {
    heading: "Overview",
    body: [
      "Proof Playground is a personal project site. It doesn't have user accounts, and right now none of the buttons on it (newsletter, updates, support, photos) actually send or collect anything — they're placeholders for things that don't exist yet.",
      "This policy describes what's true today and will be updated as real features (and real data collection) get added.",
    ],
  },
  {
    heading: "Information we collect",
    body: [
      "The site itself doesn't run any forms, accounts, or trackers. The only data collected is whatever this site's hosting provider logs automatically for any visitor to any website — typically things like IP address, browser type, and which pages were requested. This is standard server-log data, not anything used to build a profile of you.",
    ],
  },
  {
    heading: "Cookies & analytics",
    body: [
      "No cookies or analytics scripts are set up yet. If that changes — for example, adding basic visit analytics — this section will be updated to say exactly what's collected and why.",
    ],
  },
  {
    heading: "Third-party services",
    body: [
      "The site is hosted by a third-party hosting provider, which may collect standard server logs as described above under its own privacy policy. No other third-party services (ads, embeds, trackers) are in use right now.",
    ],
  },
  {
    heading: "Children's privacy",
    body: [
      "This site isn't directed at children under 13, and doesn't knowingly collect information from them.",
    ],
  },
  {
    heading: "Changes to this policy",
    body: [
      `This policy may be updated as the site grows. The "last updated" date at the top will always reflect the most recent version.`,
    ],
  },
  {
    heading: "Contact",
    body: ["Questions about this policy can go to placeholder@proofplayground."],
  },
];

export default function PrivacyPolicy() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-6 py-16">
      <Link
        href="/"
        className="text-muted-foreground hover:text-foreground mb-10 inline-flex w-fit items-center gap-1.5 text-sm transition-colors"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Back to Proof Playground
      </Link>

      <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
        Privacy Policy
      </h1>
      <p className="text-muted-foreground mt-2 text-sm">Last updated {LAST_UPDATED}</p>

      <div className="mt-10 flex flex-col gap-8">
        {SECTIONS.map((section) => (
          <section key={section.heading}>
            <h2 className="text-lg font-semibold">{section.heading}</h2>
            <div className="text-muted-foreground mt-2 flex flex-col gap-3 text-sm leading-relaxed">
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
