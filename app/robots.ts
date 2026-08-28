import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { resolveRobotsPolicy } from "@/lib/robots";

/**
 * robots.txt（P2.5 MF-1）
 * 唯一允许索引的环境：VERCEL_ENV === "production"（由部署平台注入）。
 * 其余（preview/development/undefined/unknown）一律 Disallow: /。
 * 不通过 NEXT_PUBLIC_SITE_URL 是否为空判断 Production。
 */
export default function robots(): MetadataRoute.Robots {
  return resolveRobotsPolicy(process.env.VERCEL_ENV, siteConfig.url);
}
