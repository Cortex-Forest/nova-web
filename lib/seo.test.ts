import { describe, expect, it, vi } from "vitest";

describe("pageSeo — canonical / OG derivation", () => {
  it("adds canonical + og when url is configured", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://nova.test");
    vi.resetModules();
    const { pageSeo } = await import("./seo");

    const meta = pageSeo("/technology", "Tech description", "Technology");
    expect(meta.alternates?.canonical).toBe("https://nova.test/technology");
    expect(meta.openGraph?.url).toBe("https://nova.test/technology");
    expect(meta.openGraph?.description).toBe("Tech description");
    expect(meta.title).toBe("Technology");
    // openGraph.images 类型为 OGImage | OGImage[]（可为 string/URL/对象）→ 归一化后按特性收窄
    const images = meta.openGraph?.images;
    const first = Array.isArray(images) ? images[0] : images;
    if (first && typeof first !== "string" && "width" in first) {
      expect(first.width).toBe(1200);
      expect(first.height).toBe(630);
    } else {
      expect(first).toBeTruthy();
    }

    vi.unstubAllEnvs();
  });

  it("omits canonical/og when url NOT configured (no fabricated domain)", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    vi.resetModules();
    const { pageSeo } = await import("./seo");

    const meta = pageSeo("/", "desc");
    expect(meta.alternates).toBeUndefined();
    expect(meta.openGraph).toBeUndefined();

    vi.unstubAllEnvs();
  });

  it("homepage keeps layout default title (title optional)", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://nova.test");
    vi.resetModules();
    const { pageSeo } = await import("./seo");

    const meta = pageSeo("/", "desc");
    expect(meta.title).toBeUndefined();
    expect(meta.alternates?.canonical).toBe("https://nova.test/");

    vi.unstubAllEnvs();
  });
});
