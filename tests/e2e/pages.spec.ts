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
  // 首页 CTA（Hero 与底部 CTA 区块均含 Launch Testnet）
  await expect(
    page.getByRole("link", { name: /Launch Testnet/i }).first(),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Run Node/i }).first(),
  ).toBeVisible();
});
