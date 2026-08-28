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
    await expect(page.getByRole("link", { name: /Build On Nova/i }).first()).toBeVisible();
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
});
