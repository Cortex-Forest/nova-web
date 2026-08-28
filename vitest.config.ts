import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
  test: {
    environment: "jsdom",
    globals: true, // 使 Testing Library 自动 cleanup 生效（否则多次 render 的 DOM 会堆积）
    setupFiles: ["./vitest.setup.tsx"],
    include: ["**/*.test.{ts,tsx}"],
    exclude: ["node_modules", ".next", "e2e", "playwright", "out"],
    css: false,
    reporters: ["default"],
  },
});
