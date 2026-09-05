import { describe, expect, it } from "vitest";
import {
  existsSync,
  readFileSync,
  readdirSync,
  statSync,
} from "node:fs";
import { join, extname } from "node:path";

/**
 * Early Access / Supabase —— 安全静态断言（V1.1 Backend Integration）
 *
 * 验证（不依赖真实 Supabase）：
 * 1. lib/supabase/server.ts 含 `import "server-only"`（客户端引入即构建失败）。
 * 2. 全仓库源码不存在 NEXT_PUBLIC_SUPABASE_*（service role 禁止进客户端）。
 * 3. React client 组件（EarlyAccessJoin.tsx）不 import server client / supabase-js。
 * 4. server 模块只读取 process.env.SUPABASE_*（无 NEXT_PUBLIC_SUPABASE）。
 * 5. 不存在被跟踪的 .env / .env.local（仅 .env.example）。
 */

const ROOT = process.cwd();

const SOURCE_DIRS = [
  "app",
  "components",
  "config",
  "lib",
  "sections",
  "tests",
  "supabase",
];
const WATCH_EXTS = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".mjs",
  ".sql",
  ".md",
  ".example",
]);
const SKIP_PATHS = ["node_modules", ".next", "test-results", ".git"];

function collectSourceFiles(): string[] {
  const files: string[] = [];
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      const stat = statSync(full);
      if (stat.isDirectory()) {
        if (SKIP_PATHS.includes(entry)) continue;
        walk(full);
      } else if (WATCH_EXTS.has(extname(full))) {
        // 排除测试断言文件本身：测试可合法提及禁止词（用于断言其不存在）
        if (/[.]test[.](ts|tsx|js|jsx)$/.test(entry)) continue;
        files.push(full);
      }
    }
  };
  for (const d of SOURCE_DIRS) {
    if (existsSync(join(ROOT, d))) walk(join(ROOT, d));
  }
  return files;
}

function relative(p: string): string {
  return p.replace(ROOT + "\\", "").replace(ROOT + "/", "");
}

describe("Supabase integration — security boundaries (static)", () => {
  it("lib/supabase/server.ts guards with import 'server-only'", () => {
    const src = readFileSync(join(ROOT, "lib", "supabase", "server.ts"), "utf8");
    expect(src).toContain('import "server-only";');
  });

  it("lib/supabase/server.ts reads only server env names (no NEXT_PUBLIC_)", () => {
    const src = readFileSync(join(ROOT, "lib", "supabase", "server.ts"), "utf8");
    expect(src).toContain("process.env.SUPABASE_URL");
    expect(src).toContain("process.env.SUPABASE_SERVICE_ROLE_KEY");
    expect(src).not.toMatch(/NEXT_PUBLIC_SUPABASE/);
  });

  it("no NEXT_PUBLIC_SUPABASE_* anywhere in tracked source", () => {
    const offenders: string[] = [];
    for (const f of collectSourceFiles()) {
      const text = readFileSync(f, "utf8");
      if (/NEXT_PUBLIC_SUPABASE/i.test(text)) offenders.push(relative(f));
    }
    expect(offenders).toEqual([]);
  });

  it("client component EarlyAccessJoin.tsx never imports Supabase", () => {
    const src = readFileSync(
      join(ROOT, "components", "early-access", "EarlyAccessJoin.tsx"),
      "utf8",
    );
    expect(src).not.toMatch(/@supabase\/supabase-js/);
    expect(src).not.toMatch(/@\/lib\/supabase/);
    expect(src).not.toMatch(/@\/lib\/early-access-supabase/);
  });

  it("only .env.example exists among env files (no .env / .env.local)", () => {
    const names = readdirSync(ROOT).filter(
      (n) => n.startsWith(".env") && !n.endsWith(".example"),
    );
    expect(names).toEqual([]);
  });
});
