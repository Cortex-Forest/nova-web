import { test, expect } from "@playwright/test";
import { gotoWithoutOverflow } from "./helpers";

const navTargets = [
  { label: "Technology", path: "/technology" },
  { label: "Developers", path: "/developers" },
  { label: "Token", path: "/token" },
  { label: "Roadmap", path: "/roadmap" },
  { label: "Early Access", path: "/early-access" },
  { label: "Community", path: "/community" },
  { label: "FAQ", path: "/faq" },
];

test.describe("internal navigation", () => {
  for (const target of navTargets) {
    test(`navigate to ${target.path} via navbar`, async ({ page }) => {
      await gotoWithoutOverflow(page, "/");
      await page.getByRole("link", { name: target.label }).first().click();
      await page.waitForURL("**" + target.path);
      await expect(page.locator("h1")).toBeVisible();
    });
  }

  test("homepage hero CTAs navigate correctly", async ({ page }) => {
    await gotoWithoutOverflow(page, "/");
    await page
      .getByRole("link", { name: "Join Genesis Program" })
      .first()
      .click();
    await expect(page).toHaveURL(/\/airdrop#join/);
    await gotoWithoutOverflow(page, "/");
    await page.getByRole("link", { name: "Explore Technology" }).first().click();
    await expect(page).toHaveURL(/\/technology/);
  });
});
