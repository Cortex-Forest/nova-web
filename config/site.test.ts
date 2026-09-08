import { describe, expect, it } from "vitest";
import { brand, siteConfig } from "./site";

describe("siteConfig — Single Source of Truth", () => {
  it("has correct brand identity (YAZIMAO / 鸭子毛)", () => {
    expect(siteConfig.name).toBe("YAZIMAO");
    expect(siteConfig.nameZh).toBe("鸭子毛");
    expect(siteConfig.tagline).toContain("Every Creation Matters");
    expect(siteConfig.positioning).toBe("A public network for human creation.");
    expect(brand.story.length).toBeGreaterThan(20);
    expect(siteConfig.description.length).toBeGreaterThan(20);
  });

  it("brand must not pretend to be a live mainnet", () => {
    expect(siteConfig.networkLabel).not.toMatch(/mainnet/i);
  });

  it("github points to the protocol MAIN repository", () => {
    expect(siteConfig.links.github).toBe("https://github.com/Cortex-Forest/nova");
  });

  it("websiteRepo points to official WEBSITE repository", () => {
    expect(siteConfig.links.websiteRepo).toBe(
      "https://github.com/Cortex-Forest/nova-web",
    );
  });

  it("main repo and website repo are semantically distinct (no confusion)", () => {
    expect(siteConfig.links.github).not.toBeNull();
    expect(siteConfig.links.websiteRepo).not.toBeNull();
    expect(siteConfig.links.github).not.toBe(siteConfig.links.websiteRepo);
  });

  it("unprovided community links remain null (no fabricated addresses)", () => {
    expect(siteConfig.links.x).toBeNull();
    expect(siteConfig.links.discord).toBeNull();
    expect(siteConfig.links.telegram).toBeNull();
  });

  it("contains no fabricated chain metrics", () => {
    const raw = JSON.stringify(siteConfig);
    expect(raw).not.toMatch(/\bTPS\b/i);
    expect(raw).not.toMatch(/TVL/i);
    expect(raw).not.toMatch(/mainnet.*(live|launched)/i);
  });

  it("networkLabel has an honest default", () => {
    expect(siteConfig.networkLabel.length).toBeGreaterThan(0);
  });
});
