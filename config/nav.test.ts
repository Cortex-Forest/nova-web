import { describe, expect, it } from "vitest";
import { footerNav, mainNav, navGroups } from "./nav";

describe("mainNav", () => {
  it("contains all required internal routes", () => {
    const routes = mainNav.map((n) => n.href);
    expect(routes).toEqual(
      expect.arrayContaining([
        "/technology",
        "/node",
        "/developers",
        "/token",
        "/explorer",
        "/roadmap",
      ]),
    );
  });

  it("has no external URLs and no empty href", () => {
    for (const item of mainNav) {
      expect(item.href).toMatch(/^\//);
      expect(item.href).not.toMatch(/^https?:\/\//);
      expect(item.href.trim().length).toBeGreaterThan(0);
    }
  });
});

describe("navGroups", () => {
  it("all dropdown items are internal routes", () => {
    for (const group of navGroups) {
      for (const item of group.items) {
        expect(item.href).toMatch(/^\//);
        expect(item.href).not.toMatch(/^https?:\/\//);
      }
    }
  });
});

describe("footerNav", () => {
  it("all footer links are internal", () => {
    for (const group of Object.values(footerNav)) {
      for (const item of group) {
        expect(item.href).toMatch(/^\//);
        expect(item.href).not.toMatch(/^https?:\/\//);
      }
    }
  });
});
