import { test, expect } from "@playwright/test";
import { collectErrors } from "./helpers";

test.describe("responsive — desktop & mobile", () => {
  test("desktop 1440×900: layout, nav, footer, CTA", async ({ page }) => {
    const errors = collectErrors(page);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(400);

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    );
    expect(overflow).toBe(false);
    await expect(page.locator("header nav").first()).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Home", exact: true }),
    ).toBeVisible();
    await expect(page.locator("footer")).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Connect Wallet/i }).first(),
    ).toBeVisible();
    expect(errors).toEqual([]);
  });

  test("mobile 390×844: no overflow, hamburger open/close/Escape", async ({
    page,
  }) => {
    const errors = collectErrors(page);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(400);

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    );
    expect(overflow).toBe(false);

    const toggle = page.getByRole("button", { name: "Open menu" });
    await expect(toggle).toBeVisible();
    await toggle.click();
    await expect(page.getByRole("button", { name: "Close menu" })).toBeVisible();
    await expect(
      page.locator("header").getByRole("link", { name: "Technology" }),
    ).toBeVisible();

    // Escape 关闭
    await page.keyboard.press("Escape");
    await expect(page.getByRole("button", { name: "Close menu" })).toHaveCount(0);

    await expect(page.locator("footer")).toBeVisible();
    expect(errors).toEqual([]);
  });

  /**
   * 回归：头部 logo 曾被压缩到 82px（内容 114px），字标溢出并压在 "Home" 上 32px。
   * 断点调整（xl 显示桌面导航）后，此用例守住「不被压缩 + 不重叠」。
   */
  test("header: logo never squeezed and never overlaps nav (1024–1920)", async ({
    page,
  }) => {
    const errors = collectErrors(page);
    await page.goto("/", { waitUntil: "domcontentloaded" });

    for (const width of [1024, 1280, 1366, 1440, 1920]) {
      await page.setViewportSize({ width, height: 900 });
      await page.waitForTimeout(250);

      const geom = await page.evaluate(() => {
        const link = document.querySelector(
          'header a[aria-label="YAZIMAO home"]',
        );
        if (!link) return null;
        const word = link.querySelector("span > span:last-child");
        const others = Array.from(
          document.querySelectorAll("header nav a, header nav button"),
        )
          .filter((el) => el !== link)
          .map((el) => el.getBoundingClientRect())
          .filter((r) => r.width > 2 && r.height > 2);
        const wr = word ? word.getBoundingClientRect() : null;
        const overlap = wr
          ? others.filter(
              (r) =>
                !(
                  r.right <= wr.left ||
                  r.left >= wr.right ||
                  r.bottom <= wr.top ||
                  r.top >= wr.bottom
                ),
            ).length
          : 0;
        return {
          clientWidth: link.clientWidth,
          scrollWidth: link.scrollWidth,
          overlap,
          docOverflow: document.documentElement.scrollWidth > window.innerWidth,
          headerOverflow: (() => {
            const items = Array.from(
              document.querySelectorAll("header a, header button"),
            ).map((el) => el.getBoundingClientRect());
            const right = items.length
              ? Math.max(...items.map((r) => r.right))
              : 0;
            return Math.round(right - window.innerWidth);
          })(),
        };
      });

      expect(geom, `header missing at ${width}`).not.toBeNull();
      expect(geom!.docOverflow, `document overflow at ${width}`).toBe(false);
      expect(geom!.scrollWidth, `logo squeezed at ${width}`).toBeLessThanOrEqual(
        geom!.clientWidth + 1,
      );
      expect(geom!.overlap, `logo text overlaps nav at ${width}`).toBe(0);
      expect(
        geom!.headerOverflow,
        `header content overflows viewport at ${width}`,
      ).toBeLessThanOrEqual(1);
    }

    // 1024–1279 现在走汉堡菜单（桌面导航移到 xl）：确认面板本身可用
    await page.setViewportSize({ width: 1100, height: 900 });
    await page.waitForTimeout(200);
    const toggle = page.getByRole("button", { name: "Open menu" });
    await expect(toggle).toBeVisible();
    await toggle.click();
    await expect(
      page.locator("header").getByRole("link", { name: "Technology" }),
    ).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("button", { name: "Close menu" })).toHaveCount(0);

    expect(errors).toEqual([]);
  });
});
