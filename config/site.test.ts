import { describe, expect, it } from "vitest";
import { siteConfig } from "./site";

describe("siteConfig — Single Source of Truth", () => {
  it("has correct brand identity", () => {
    expect(siteConfig.name).toBe("Nova");
    expect(siteConfig.tagline).toContain("Decentralized Infrastructure");
    expect(siteConfig.description.length).toBeGreaterThan(20);
  });

  it("github points to Nova MAIN repository", () => {
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
