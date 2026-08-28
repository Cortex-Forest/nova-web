import { test, expect } from "@playwright/test";

/**
 * P2.5 生产环境相关 E2E
 * 说明：E2E webServer 为「非生产环境」（VERCEL_ENV 未设置为 production），
 * 因此 robots 应输出 Disallow；这恰好验证 MF-1 的 non-production 分支。
 */
test.describe("production policy (non-production E2E env)", () => {
  test("robots.txt disallows indexing in non-production (MF-1)", async ({
    page,
  }) => {
    const res = await page.request.get("/robots.txt");
    expect(res.status()).toBe(200);
    const text = await res.text();
    expect(text).toContain("Disallow: /");
    // 非生产环境不应输出 Sitemap 引用（禁止索引）
    expect(text).not.toContain("Sitemap:");
  });

  test("/api/explorer returns 503 with Cache-Control: no-store (scoped)", async ({
    page,
  }) => {
    const res = await page.request.get("/api/explorer");
    expect(res.status()).toBe(503);
    expect(res.headers()["cache-control"]).toBe("no-store");
  });

  test("/sitemap.xml serves entries when URL configured", async ({ page }) => {
    const res = await page.request.get("/sitemap.xml");
    expect(res.status()).toBe(200);
    const text = await res.text();
    expect(text).toContain("<loc>");
  });

  test("security header HSTS does NOT include preload (MF-C7)", async ({
    page,
  }) => {
    const res = await page.request.get("/");
    const hsts = res.headers()["strict-transport-security"] ?? "";
    expect(hsts).toContain("max-age=63072000");
    expect(hsts).not.toContain("preload");
  });
});
