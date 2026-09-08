import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { CTA } from "./CTA";

describe("Home CTA", () => {
  it("GitHub button links to protocol MAIN repository (single source)", () => {
    render(<CTA />);
    expect(screen.getByRole("link", { name: /View GitHub/i })).toHaveAttribute(
      "href",
      "https://github.com/Cortex-Forest/nova",
    );
  });

  it("Join Testnet Waitlist links to testnet section", () => {
    render(<CTA />);
    expect(
      screen.getByRole("link", { name: /Join Testnet Waitlist/i }),
    ).toHaveAttribute("href", "/developers#testnet");
  });

  it("Run a Node links to node page", () => {
    render(<CTA />);
    expect(screen.getByRole("link", { name: /Run a Node/i })).toHaveAttribute(
      "href",
      "/node",
    );
  });
});
