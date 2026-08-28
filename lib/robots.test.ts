import { describe, expect, it } from "vitest";
import type { MetadataRoute } from "next";
import { resolveRobotsPolicy } from "./robots";

/** rules 类型为 Rules | Rules[] → 归一化为单个 rule 便于断言 */
function firstRule(p: MetadataRoute.Robots) {
  const r = p.rules;
  return Array.isArray(r) ? r[0] : r;
}

/**
 * P2.5 MF-1 —— robots 环境判定单测
 * 唯一允许索引：VERCEL_ENV === "production"；其余一律 Disallow。
 */
describe("resolveRobotsPolicy (MF-1)", () => {
  it("production → Allow / + Sitemap（引用正式域名）", () => {
    const p = resolveRobotsPolicy("production", "https://nova-super.xyz");
    expect(firstRule(p)?.allow).toContain("/");
    expect(firstRule(p)?.disallow).toEqual(["/api/"]);
    expect(p.sitemap).toBe("https://nova-super.xyz/sitemap.xml");
  });

  it("preview → Disallow /（无 sitemap）", () => {
    const p = resolveRobotsPolicy("preview", "https://x.vercel.app");
    expect(firstRule(p)?.disallow).toContain("/");
    expect(firstRule(p)?.allow).toBeUndefined();
    expect(p.sitemap).toBeUndefined();
  });

  it("development → Disallow /", () => {
    const p = resolveRobotsPolicy("development", "http://localhost:3000");
    expect(firstRule(p)?.disallow).toContain("/");
    expect(p.sitemap).toBeUndefined();
  });

  it("undefined（本地/CI，未设置）→ Disallow /", () => {
    const p = resolveRobotsPolicy(undefined, "");
    expect(firstRule(p)?.disallow).toContain("/");
    expect(p.sitemap).toBeUndefined();
  });

  it("unknown（未来其他平台）→ Disallow /", () => {
    const p = resolveRobotsPolicy("unknown", "https://anything.example");
    expect(firstRule(p)?.disallow).toContain("/");
  });

  it("production 但 siteUrl 为空 → Allow / 且省略 sitemap", () => {
    const p = resolveRobotsPolicy("production", "");
    expect(firstRule(p)?.allow).toContain("/");
    expect(p.sitemap).toBeUndefined();
  });
});
