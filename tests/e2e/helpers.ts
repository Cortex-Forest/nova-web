import { type Page } from "@playwright/test";

/** 收集页面控制台错误与未捕获异常（P2 §15 Console Error Gate） */
export function collectErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(`console: ${msg.text()}`);
  });
  page.on("pageerror", (err) => errors.push(`pageerror: ${err.message}`));
  return errors;
}

/** 等待页面加载并断言无横向溢出 */
export async function gotoWithoutOverflow(
  page: Page,
  route: string,
  viewport: { width: number; height: number } = { width: 1440, height: 900 },
) {
  await page.setViewportSize(viewport);
  const res = await page.goto(route, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(500);
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  );
  return { res, overflow };
}
