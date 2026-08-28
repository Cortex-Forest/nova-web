import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"], // API 预留路由不收录
      },
    ],
    // 域名未设置时省略 sitemap 引用
    ...(siteConfig.url ? { sitemap: `${siteConfig.url}/sitemap.xml` } : {}),
  };
}
