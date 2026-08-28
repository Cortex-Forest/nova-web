import { test, expect } from "@playwright/test";

test("unknown route returns branded 404 (HTTP 404, no white screen)", async ({
  page,
}) => {
  const res = await page.goto("/this-route-does-not-exist", {
    waitUntil: "domcontentloaded",
  });
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: /deep space/i })).toBeVisible();
  await expect(page.getByRole("link", { name: "Back to Home" })).toBeVisible();
  // 无白屏：body 有内容
  const text = await page.evaluate(() => document.body.innerText.length);
  expect(text).toBeGreaterThan(50);
});
