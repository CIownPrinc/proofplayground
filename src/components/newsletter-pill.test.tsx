// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { NewsletterPill } from "./newsletter-pill";

beforeEach(() => {
  window.localStorage.clear();
});

afterEach(() => {
  cleanup();
});

describe("NewsletterPill", () => {
  it("starts unsubscribed and unlocks the newsletter achievement on click", () => {
    render(<NewsletterPill />);

    const button = screen.getByRole("button", { name: "Newsletter" });
    fireEvent.click(button);

    const subscribedButton = screen.getByRole("button", { name: "Subscribed!" });
    expect(subscribedButton).toHaveProperty("disabled", true);
    const stored = JSON.parse(window.localStorage.getItem("proofplayground:achievements") ?? "{}");
    expect(typeof stored.newsletter).toBe("string");
  });

  it("renders as already subscribed on mount when the achievement was earned in a prior session", () => {
    window.localStorage.setItem(
      "proofplayground:achievements",
      JSON.stringify({ newsletter: new Date().toISOString() }),
    );

    render(<NewsletterPill />);

    const subscribedButton = screen.getByRole("button", { name: "Subscribed!" });
    expect(subscribedButton).toHaveProperty("disabled", true);
  });
});
