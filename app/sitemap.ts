import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

/**
 * 站点地图 —— 与路由同步维护。
 * 域名未设置（NEXT_PUBLIC_SITE_URL 为空）时返回空 sitemap，
 * 部署并注入环境变量后自动生成完整条目。不编造占位域名。
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  if (!base) return [];

  const now = new Date();

  return [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/technology`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/node`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/developers`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/token`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/explorer`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/roadmap`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/early-access`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
  ];
}
