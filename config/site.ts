/**
 * Nova Layer1 —— 站点级配置（P1 集中配置源）
 *
 * 注意：
 * 1. 本文件是域名/OG/社区链接的【唯一】事实来源，禁止在其他文件硬编码。
 * 2. 真实域名尚未确定 → 从环境变量 NEXT_PUBLIC_SITE_URL 读取，未设置时为空字符串。
 *    禁止编造占位域名（如 *.example.com）。
 * 3. 社区/仓库地址项目方尚未提供 → 全部为 null，UI 统一渲染 "Coming Soon"。
 *    禁止链接到无关网站首页（github.com/、x.com/ 等）。
 * 4. 本文件不包含任何未经确认的链上数据。
 */

export interface SiteLinks {
  github: string | null;
  x: string | null;
  discord: string | null;
  telegram: string | null;
}

export const siteConfig: {
  name: string;
  tagline: string;
  description: string;
  /** 真实站点域名（部署后通过 NEXT_PUBLIC_SITE_URL 注入）；未设置时为空 */
  url: string;
  ogImage: string;
  networkLabel: string;
  links: SiteLinks;
} = {
  name: "Nova",
  tagline: "Next Generation Decentralized Infrastructure",
  description:
    "Nova is an independent Layer1 blockchain delivering high-performance infrastructure, decentralized storage, decentralized compute, gaming ecosystem, and a global node network.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "",
  ogImage: "/og.png", // 1200×630 PNG（P1-3 生成，标记为可替换品牌资产）
  networkLabel: process.env.NEXT_PUBLIC_NETWORK_LABEL ?? "Testnet",
  // 项目方尚未提供真实地址 → null；UI 渲染 Coming Soon，绝不指向无关网站
  links: {
    github: null,
    x: null,
    discord: null,
    telegram: null,
  },
};

/** 技术就绪度标记 —— 全站统一口径，禁止虚构 */
export type Readiness =
  | "Planned"
  | "In Development"
  | "Testnet Only"
  | "Coming Soon"
  | "Live";

export const readinessLabel: Record<Readiness, string> = {
  Planned: "Planned",
  "In Development": "In Development",
  "Testnet Only": "Testnet Only",
  "Coming Soon": "Coming Soon",
  Live: "Live",
};
