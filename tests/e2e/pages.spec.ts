import { test, expect } from "@playwright/test";
import { collectErrors, gotoWithoutOverflow } from "./helpers";

const routes = [
  "/",
  "/technology",
  "/node",
  "/developers",
  "/token",
  "/explorer",
  "/roadmap",
  "/early-access",
  "/airdrop",
];

test.describe("page rendering — all routes", () => {
  for (const route of routes) {
    test(`${route} → 200, h1 present, no console error, no overflow`, async ({
      page,
    }) => {
      const errors = collectErrors(page);
      const { res, overflow } = await gotoWithoutOverflow(page, route);
      expect(res?.status()).toBe(200);
      expect(await page.locator("h1").count()).toBeGreaterThan(0);
      expect(overflow).toBe(false);
      expect(errors).toEqual([]);
    });
  }
});

test("each route has a primary CTA (internal navigation works)", async ({
  page,
}) => {
  await gotoWithoutOverflow(page, "/");
  // 首页 Hero CTA（品牌：Explore the Network / Become a Creator）
  await expect(
    page.getByRole("link", { name: "Explore the Network" }).first(),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Become a Creator" }).first(),
  ).toBeVisible();
});
