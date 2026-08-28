import type { MetadataRoute } from "next";

/**
 * robots 环境判定（P2.5 MF-1）
 *
 * 唯一允许搜索引擎索引的环境：VERCEL_ENV === "production"。
 * 其他任何情况（preview / development / undefined / unknown / 未来其他平台）
 * 一律 Disallow: /。
 *
 * 禁止用 NEXT_PUBLIC_SITE_URL 是否为空来判断 Production ——
 * URL 配置与运行环境是两个独立维度，必须显式判定环境。
 */
export function resolveRobotsPolicy(
  vercelEnv: string | undefined,
  siteUrl: string,
): MetadataRoute.Robots {
  if (vercelEnv === "production") {
    return {
      rules: [
        {
          userAgent: "*",
          allow: "/",
          disallow: ["/api/"], // API 预留路由不收录
        },
      ],
      // 域名已配置时才引用 sitemap
      ...(siteUrl ? { sitemap: `${siteUrl}/sitemap.xml` } : {}),
    };
  }

  // Non-production：一律禁止索引
  return {
    rules: [{ userAgent: "*", disallow: "/" }],
  };
}
