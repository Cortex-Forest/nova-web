import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Footer } from "./Footer";

describe("Footer", () => {
  it("GitHub icon links to Nova MAIN repository (from single source)", () => {
    const { container } = render(<Footer />);
    const gh = container.querySelector('a[aria-label="GitHub"]');
    expect(gh).not.toBeNull();
    expect(gh?.getAttribute("href")).toBe("https://github.com/Cortex-Forest/nova");
    expect(gh?.getAttribute("target")).toBe("_blank");
    expect(gh?.getAttribute("rel")).toBe("noopener noreferrer");
  });

  it("Website source links to official WEBSITE repository", () => {
    render(<Footer />);
    const ws = screen.getByRole("link", { name: "Website source" });
    expect(ws).toHaveAttribute("href", "https://github.com/Cortex-Forest/nova-web");
  });

  it("keeps main repo and website repo semantically distinct", () => {
    const { container } = render(<Footer />);
    const gh = container.querySelector('a[aria-label="GitHub"]')?.getAttribute("href");
    const ws = screen.getByRole("link", { name: "Website source" }).getAttribute("href");
    expect(gh).not.toBe(ws);
  });

  it("renders only provided community links (github live; x/discord absent)", () => {
    const { container } = render(<Footer />);
    expect(container.querySelector('a[aria-label="GitHub"]')).not.toBeNull();
    expect(screen.queryByRole("link", { name: "X / Twitter" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Discord" })).not.toBeInTheDocument();
  });

  it("renders footer navigation columns", () => {
    render(<Footer />);
    for (const name of ["Network", "Developers", "Token"]) {
      expect(screen.getByRole("navigation", { name })).toBeInTheDocument();
    }
  });
});
