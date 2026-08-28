import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { CTA } from "./CTA";

describe("Home CTA", () => {
  it("GitHub button links to Nova MAIN repository (single source)", () => {
    render(<CTA />);
    expect(screen.getByRole("link", { name: /View GitHub/i })).toHaveAttribute(
      "href",
      "https://github.com/Cortex-Forest/nova",
    );
  });

  it("Launch Testnet links to testnet section", () => {
    render(<CTA />);
    expect(screen.getByRole("link", { name: /Launch Testnet/i })).toHaveAttribute(
      "href",
      "/developers#testnet",
    );
  });

  it("Run a Node links to node page", () => {
    render(<CTA />);
    expect(screen.getByRole("link", { name: /Run a Node/i })).toHaveAttribute(
      "href",
      "/node",
    );
  });
});
