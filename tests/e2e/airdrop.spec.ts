import { test, expect, type Page } from "@playwright/test";
import { collectErrors, gotoWithoutOverflow } from "./helpers";

/** 拦截 /api/genesis/register 返回指定状态 */
async function stubRegister(
  page: Page,
  status: number,
  body: Record<string, unknown>,
) {
  await page.route("**/api/genesis/register", (route) =>
    route.fulfill({ status, contentType: "application/json", body: JSON.stringify(body) }),
  );
}

test.describe("genesis — /airdrop page", () => {
  test("/airdrop → 200, h1, no console error, no overflow", async ({ page }) => {
    const errors = collectErrors(page);
    const { res, overflow } = await gotoWithoutOverflow(page, "/airdrop");
    expect(res?.status()).toBe(200);
    await expect(
      page.getByRole("heading", { level: 1, name: "Nova Genesis Program" }),
    ).toBeVisible();
    expect(overflow).toBe(false);
    expect(errors).toEqual([]);
  });

  test("honest wording — no token/allocation/quantum claims", async ({ page }) => {
    await gotoWithoutOverflow(page, "/airdrop");
    const body = await page.locator("body").innerText();
    for (const forbidden of [
      "Nova Mainnet",
      "quantum-resistant",
      "quantum safe",
      "guaranteed airdrop",
      "guaranteed token",
      "Estimated NOVA",
      "1:1",
      "Claimable NOVA",
      "Token Allocation",
    ]) {
      expect(body).not.toContain(forbidden);
    }
    // Required honest statements
    expect(body).toContain("participation points only");
    expect(body).toContain("not a token sale");
    expect(body).toContain("Connect Wallet");
    expect(body).toContain("Coming Soon");
  });

  test("register success → shows Nova ID and +20 points", async ({ page }) => {
    await stubRegister(page, 200, {
      success: true,
      novaId: "NV-GEN-928374",
      pointsBalance: 20,
      registrationPoints: 20,
    });
    await gotoWithoutOverflow(page, "/airdrop");
    await page.getByLabel("Email").fill("alice@example.com");
    await page
      .getByRole("button", { name: "Join Genesis Program" })
      .click();
    await expect(page.getByText("NV-GEN-928374")).toBeVisible();
    const successCard = page.locator('[data-testid="genesis-success"]');
    await expect(successCard).toBeVisible();
    await expect(successCard.getByText("+20", { exact: true })).toBeVisible();
    await expect(successCard.getByText("Genesis Points:", { exact: false })).toBeVisible();
    await expect(successCard.getByText(/Welcome to the Genesis Program/)).toBeVisible();
  });

  test("duplicate → one Nova ID per email message", async ({ page }) => {
    await stubRegister(page, 409, { success: false, error: "ALREADY_REGISTERED" });
    await gotoWithoutOverflow(page, "/airdrop");
    await page.getByLabel("Email").fill("alice@example.com");
    await page
      .getByRole("button", { name: "Join Genesis Program" })
      .click();
    await expect(page.getByText(/already registered/i)).toBeVisible();
  });

  test("client validation — invalid email blocked before request", async ({ page }) => {
    await page.route("**/api/genesis/register", () => {
      throw new Error("should not hit API");
    });
    await gotoWithoutOverflow(page, "/airdrop");
    await page.getByLabel("Email").fill("not-an-email");
    await page
      .getByRole("button", { name: "Join Genesis Program" })
      .click();
    await expect(
      page.getByText("Please enter a valid email address."),
    ).toBeVisible();
  });
});

test.describe("genesis — responsive + navigation", () => {
  test("mobile 390: no overflow, form usable", async ({ page }) => {
    const errors = collectErrors(page);
    await page.setViewportSize({ width: 390, height: 844 });
    const res = await page.goto("/airdrop", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(400);
    expect(res?.status()).toBe(200);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    );
    expect(overflow).toBe(false);
    await expect(page.getByLabel("Email")).toBeVisible();
    expect(errors).toEqual([]);
  });

  test("desktop header exposes Airdrop link", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const link = page
      .locator("header")
      .getByRole("link", { name: "Airdrop", exact: true });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("href", "/airdrop");
  });
});
