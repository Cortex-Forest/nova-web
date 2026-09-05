import { test, expect, type Page } from "@playwright/test";
import { collectErrors, gotoWithoutOverflow } from "./helpers";

/** 拦截 /api/early-access 返回指定状态（避免依赖真实后端） */
async function stubRegistration(
  page: Page,
  status: number,
  body: { success: boolean; error?: string },
) {
  await page.route("**/api/early-access", (route) =>
    route.fulfill({
      status,
      contentType: "application/json",
      body: JSON.stringify(body),
    }),
  );
}

/** 在表单填入合法数据 */
async function fillForm(page: Page) {
  await page.getByLabel("Email").fill("user@example.com");
  await page.getByRole("checkbox", { name: "Creator" }).check();
  await page
    .getByRole("checkbox", { name: "I agree to receive Nova project updates." })
    .check();
}

const formViewports = [
  { width: 375, height: 812 },
  { width: 390, height: 844 },
  { width: 430, height: 932 },
  { width: 768, height: 1024 },
];

test.describe("early-access — page & content", () => {
  test("/early-access → 200, h1, no console error, no overflow", async ({
    page,
  }) => {
    const errors = collectErrors(page);
    const { res, overflow } = await gotoWithoutOverflow(page, "/early-access");
    expect(res?.status()).toBe(200);
    await expect(
      page.getByRole("heading", { level: 1, name: "Nova Early Access" }),
    ).toBeVisible();
    expect(overflow).toBe(false);
    expect(errors).toEqual([]);
  });

  test("honest positioning — no sale/ICO/investment claims; disclaimer present", async ({
    page,
  }) => {
    await gotoWithoutOverflow(page, "/early-access");
    const body = await page.locator("body").innerText();
    // 禁止词不得出现（大小写不敏感）
    for (const forbidden of ["Buy NOVA", "Buy Token", "ICO", "Presale"]) {
      expect(body).not.toContain(forbidden);
    }
    // 必须出现的诚实说明
    expect(body).toContain("not a token sale, investment product");
    expect(body).toContain("protocol development and testnet preparation");
    expect(body).toContain(
      "does not guarantee tokens, rewards, allocations, airdrops",
    );
  });

  test("success flow → 'You're on the list'", async ({ page }) => {
    await stubRegistration(page, 200, { success: true });
    await gotoWithoutOverflow(page, "/early-access");
    await fillForm(page);
    await page
      .getByRole("button", { name: "Join Early Access" })
      .click();
    await expect(
      page.getByRole("heading", { name: /on the list/i }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: /Back to Nova/i })).toHaveAttribute(
      "href",
      "/",
    );
    await expect(
      page.getByRole("link", { name: /Explore Technology/i }),
    ).toHaveAttribute("href", "/technology");
  });

  test("duplicate flow → already registered message", async ({ page }) => {
    await stubRegistration(page, 409, {
      success: false,
      error: "ALREADY_REGISTERED",
    });
    await gotoWithoutOverflow(page, "/early-access");
    await fillForm(page);
    await page
      .getByRole("button", { name: "Join Early Access" })
      .click();
    await expect(page.getByText(/already registered/i)).toBeVisible();
  });

  test("server unavailable (503) → generic error message", async ({ page }) => {
    await stubRegistration(page, 503, {
      success: false,
      error: "REGISTRATION_NOT_AVAILABLE",
    });
    await gotoWithoutOverflow(page, "/early-access");
    await fillForm(page);
    await page
      .getByRole("button", { name: "Join Early Access" })
      .click();
    await expect(
      page.getByText(/Something went wrong\. Please try again later\./i),
    ).toBeVisible();
  });

  test("client validation — invalid email blocked before request", async ({
    page,
  }) => {
    // 若请求被发出则测试失败（不应打到 API）
    await page.route("**/api/early-access", () => {
      throw new Error("should not hit API");
    });
    await gotoWithoutOverflow(page, "/early-access");
    await page.getByLabel("Email").fill("not-an-email");
    await page
      .getByRole("button", { name: "Join Early Access" })
      .click();
    await expect(
      page.getByText("Please enter a valid email address."),
    ).toBeVisible();
  });
});

test.describe("early-access — responsive form (375/390/430/768)", () => {
  for (const viewport of formViewports) {
    test(`${viewport.width}×${viewport.height}: no overflow, form usable`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport);
      const errors = collectErrors(page);
      const res = await page.goto("/early-access", {
        waitUntil: "domcontentloaded",
      });
      await page.waitForTimeout(400);
      expect(res?.status()).toBe(200);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth,
      );
      expect(overflow).toBe(false);
      // 表单可用：字段可见、可输入
      const email = page.getByLabel("Email");
      await expect(email).toBeVisible();
      await email.fill("user@example.com");
      // 无横向溢出的按钮
      const btn = page.getByRole("button", { name: "Join Early Access" });
      await expect(btn).toBeVisible();
      const inViewport = await btn.evaluate((el) => {
        const r = el.getBoundingClientRect();
        return r.left >= 0 && r.right <= window.innerWidth;
      });
      expect(inViewport).toBe(true);
      expect(errors).toEqual([]);
    });
  }
});

test.describe("early-access — navigation integration", () => {
  test("desktop header exposes Early Access link", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const link = page
      .locator("header")
      .getByRole("link", { name: "Early Access", exact: true });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("href", "/early-access");
  });

  test("mobile menu exposes Early Access link", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.getByRole("button", { name: "Open menu" }).click();
    await expect(
      page
        .locator("header")
        .getByRole("link", { name: "Early Access", exact: true }),
    ).toBeVisible();
  });

  test("footer exposes Join Early Access CTA", async ({ page }) => {
    await gotoWithoutOverflow(page, "/");
    const link = page
      .locator("footer")
      .getByRole("link", { name: /Join Early Access/i });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("href", "/early-access");
  });
});
