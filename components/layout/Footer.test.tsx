import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
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

  it("renders community links that are provided and hides unprovided ones", () => {
    const { container } = render(<Footer />);
    expect(container.querySelector('a[aria-label="GitHub"]')).not.toBeNull();

    // X / Telegram 已由项目方提供 → 必须渲染且指向官方地址
    const xLinks = screen.getAllByRole("link", { name: "X / Twitter" });
    expect(xLinks.length).toBeGreaterThan(0);
    for (const el of xLinks) {
      expect(el).toHaveAttribute("href", "https://x.com/yazimao_network");
    }
    const tgLinks = screen.getAllByRole("link", { name: "Telegram" });
    expect(tgLinks.length).toBeGreaterThan(0);
    for (const el of tgLinks) {
      expect(el).toHaveAttribute("href", "https://t.me/yazimo");
    }

    // Discord 未提供 → 禁止渲染
    expect(screen.queryByRole("link", { name: "Discord" })).not.toBeInTheDocument();
  });

  it("renders Official Channels column", () => {
    render(<Footer />);
    const nav = screen.getByRole("navigation", { name: "Official Channels" });
    for (const label of ["X", "Telegram", "GitHub", "Docs"]) {
      expect(within(nav).getByRole("link", { name: label })).toBeInTheDocument();
    }
  });

  it("renders footer navigation columns", () => {
    render(<Footer />);
    for (const name of ["Network", "Community", "Developers", "Token"]) {
      expect(screen.getByRole("navigation", { name })).toBeInTheDocument();
    }
  });
});
