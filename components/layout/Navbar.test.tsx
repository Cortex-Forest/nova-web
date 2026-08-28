import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { Navbar } from "./Navbar";

describe("Navbar", () => {
  it("renders brand with accessible label", () => {
    render(<Navbar />);
    expect(screen.getByRole("link", { name: "Nova home" })).toBeInTheDocument();
  });

  it("renders top-level navigation links", () => {
    render(<Navbar />);
    for (const name of ["Home", "Developers", "Token", "Roadmap"]) {
      expect(screen.getByRole("link", { name })).toBeInTheDocument();
    }
  });

  it("network dropdown exposes Technology / Node / Explorer on hover", () => {
    render(<Navbar />);
    const networkBtn = screen.getByRole("button", { name: /Network/i });
    fireEvent.mouseEnter(networkBtn);
    // 下拉链接的可访问名称含描述文本 → 用正则匹配
    for (const name of [/Technology/, /Node Network/, /Explorer/]) {
      expect(screen.getByRole("link", { name })).toBeInTheDocument();
    }
  });

  it("hamburger has accessible label and opens the mobile menu", () => {
    render(<Navbar />);
    const toggle = screen.getByRole("button", { name: "Open menu" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(toggle);
    // 打开后同一按钮的 aria-label 切换为 "Close menu"，aria-expanded=true
    const closeBtn = screen.getByRole("button", { name: "Close menu" });
    expect(closeBtn).toBeInTheDocument();
    expect(closeBtn).toHaveAttribute("aria-expanded", "true");
  });

  it("closes the mobile menu on Escape", () => {
    render(<Navbar />);
    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
    expect(screen.getByRole("button", { name: "Close menu" })).toBeInTheDocument();

    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByRole("button", { name: "Close menu" })).not.toBeInTheDocument();
  });

  it("toggle toggles open → close", () => {
    render(<Navbar />);
    const toggle = screen.getByRole("button", { name: "Open menu" });
    fireEvent.click(toggle);
    expect(screen.getByRole("button", { name: "Close menu" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Close menu" }));
    expect(screen.queryByRole("button", { name: "Close menu" })).not.toBeInTheDocument();
  });
});
