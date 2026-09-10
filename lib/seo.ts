import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

/**
 * 页面级 SEO 元数据助手（P1-4 集中配置）
 *
 * - canonical / og:url 全部由 siteConfig.url（单一来源）派生，禁止散落硬编码域名
 * - 域名未设置时自动省略 canonical / og:url / og:title 覆盖，不产生无效相对 URL
 * - og:title / og:description 覆盖为页面专属文案，提升社交分享相关性
 */
export function pageSeo(
  path: string,
  description: string,
  title?: string,
): Metadata {
  const absolute = siteConfig.url ? `${siteConfig.url}${path}` : undefined;

  return {
    ...(title ? { title } : {}),
    description,
    ...(absolute
      ? {
          alternates: { canonical: absolute },
          openGraph: {
            // 页面级 openGraph 会整体替换 layout 的 openGraph，
            // 因此必须在此补齐 type / locale / siteName / images，否则 og:site_name 会丢失
            type: "website",
            locale: "en_US",
            siteName: siteConfig.name,
            url: absolute,
            description,
            ...(title ? { title } : {}),
            images: [
              { url: siteConfig.ogImage, width: 1200, height: 630, alt: siteConfig.name },
            ],
          },
        }
      : {}),
  };
}
