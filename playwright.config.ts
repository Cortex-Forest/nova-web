import { defineConfig } from "@playwright/test";

// Windows 使用系统 Chrome（避免下载 Chromium）；CI(Linux) 使用内置 Chromium
const isWindows = process.platform === "win32";

/**
 * Playwright E2E 配置（P2-3）
 * - Windows：使用系统 Chrome（launchOptions.executablePath）
 * - CI/Linux：使用 `npx playwright install chromium` 内置浏览器
 * - webServer 自动执行生产构建 + 启动（构建时注入测试站点 URL）
 * - 端口 3100，避免与 3000 开发端口冲突
 */
export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30000,
  fullyParallel: false,
  retries: 0,
  workers: 1,
  reporter: [["list"]],
  use: {
    baseURL: "http://localhost:3100",
    ...(isWindows
      ? {
          // 系统 Chrome 的实际安装路径（channel:'chrome' 会错误查找用户目录路径）
          launchOptions: {
            executablePath:
              "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
          },
        }
      : {}),
    headless: true,
    viewport: { width: 1440, height: 900 },
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  webServer: {
    command: "npm run build && npm run start -- -p 3100",
    port: 3100,
    reuseExistingServer: false,
    timeout: 300_000,
    env: {
      NEXT_PUBLIC_SITE_URL: "http://localhost:3100",
    },
  },
});
