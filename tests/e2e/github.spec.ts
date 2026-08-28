import { test, expect } from "@playwright/test";
import { gotoWithoutOverflow } from "./helpers";

/**
 * GitHub 链接完整性（P2-4 / §3）
 * - Nova 主项目入口 → https://github.com/Cortex-Forest/nova
 * - 官网源码入口（Website source）→ https://github.com/Cortex-Forest/nova-web
 * - 语义不混淆：主仓库 ≠ 官网仓库
 */
const MAIN_REPO = "https://github.com/Cortex-Forest/nova";
const WEBSITE_REPO = "https://github.com/Cortex-Forest/nova-web";

test.describe("GitHub link integrity", () => {
  test("homepage CTA 'View GitHub' → Nova main repository", async ({ page }) => {
    await gotoWithoutOverflow(page, "/");
    const href = await page
      .getByRole("link", { name: /View GitHub/i })
      .getAttribute("href");
    expect(href).toBe(MAIN_REPO);
  });

  test("footer GitHub icon → Nova main repository", async ({ page }) => {
    await gotoWithoutOverflow(page, "/");
    const href = await page
      .locator('footer a[aria-label="GitHub"]')
      .getAttribute("href");
    expect(href).toBe(MAIN_REPO);
  });

  test("footer 'Website source' → website repository", async ({ page }) => {
    await gotoWithoutOverflow(page, "/");
    const href = await page
      .getByRole("link", { name: "Website source" })
      .getAttribute("href");
    expect(href).toBe(WEBSITE_REPO);
  });

  test("main repo and website repo are semantically distinct", async ({
    page,
  }) => {
    await gotoWithoutOverflow(page, "/");
    const gh = await page
      .locator('footer a[aria-label="GitHub"]')
      .getAttribute("href");
    const ws = await page
      .getByRole("link", { name: "Website source" })
      .getAttribute("href");
    expect(gh).not.toBe(ws);
  });

  test("developers page GitHub CTAs → Nova main repository", async ({ page }) => {
    await gotoWithoutOverflow(page, "/developers");
    const count = await page
      .locator(`a[href="${MAIN_REPO}"]`)
      .count();
    expect(count).toBeGreaterThanOrEqual(2);
  });

  test("no fabricated GitHub home page links (github.com/ root)", async ({
    page,
  }) => {
    await gotoWithoutOverflow(page, "/");
    const rootLinks = await page.locator('a[href="https://github.com/"]').count();
    expect(rootLinks).toBe(0);
  });
});
