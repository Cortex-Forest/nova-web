import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "./Button";

describe("Button", () => {
  it("renders a link when href is provided", () => {
    render(<Button href="/developers">Build On Nova</Button>);
    expect(screen.getByRole("link", { name: "Build On Nova" })).toHaveAttribute(
      "href",
      "/developers",
    );
  });

  it("renders a button when no href", () => {
    render(<Button>Click</Button>);
    expect(screen.getByRole("button", { name: "Click" })).toBeInTheDocument();
  });

  it("respects disabled state", () => {
    render(<Button disabled>GitHub — Coming Soon</Button>);
    expect(screen.getByRole("button", { name: "GitHub — Coming Soon" })).toBeDisabled();
  });

  it("external links open in new tab with safe rel", () => {
    render(<Button href="https://github.com/Cortex-Forest/nova">GitHub</Button>);
    const link = screen.getByRole("link", { name: "GitHub" });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });
});
