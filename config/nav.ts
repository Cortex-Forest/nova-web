import {
  Cpu,
  FileCode2,
  Gem,
  Layers,
  Map,
  Network,
  type LucideIcon,
} from "lucide-react";

import { siteConfig } from "./site";

export type NavItem = {
  label: string;
  href: string;
  description?: string;
  icon?: LucideIcon;
};

export const mainNav: NavItem[] = [
  { label: "Technology", href: "/technology" },
  { label: "Node", href: "/node" },
  { label: "Developers", href: "/developers" },
  { label: "Token", href: "/token" },
  { label: "Explorer", href: "/explorer" },
  { label: "Roadmap", href: "/roadmap" },
  // V1.1：生态参与预登记入口（非 Token Sale / ICO）
  { label: "Early Access", href: "/early-access" },
  // V1.3 / P3：Genesis Program 早期社区参与计划（Points only，非 Token；路由保持 /airdrop）
  { label: "Genesis Program", href: "/airdrop" },
  // P3：官方社区与常见问题
  { label: "Community", href: "/community" },
  { label: "FAQ", href: "/faq" },
];

/** 导航下拉（"产品/网络" 分组），桌面端 hover 展示 */
export const navGroups: { title: string; items: NavItem[] }[] = [
  {
    title: "Network",
    items: [
      {
        label: "Technology",
        href: "/technology",
        description: "Consensus, storage, compute & execution",
        icon: Layers,
      },
      {
        label: "Node Network",
        href: "/node",
        description: "Mobile & PC nodes, validator rewards",
        icon: Network,
      },
      {
        label: "Explorer",
        href: "/explorer",
        description: "Blocks, transactions & accounts",
        icon: Map,
      },
    ],
  },
  {
    title: "Build",
    items: [
      {
        label: "Developers",
        href: "/developers",
        description: "Docs, SDK, APIs & GitHub",
        icon: FileCode2,
      },
      {
        label: "Token",
        href: "/token",
        description: "Token economy & incentive system",
        icon: Gem,
      },
      {
        label: "Roadmap",
        href: "/roadmap",
        description: "Protocol to mainnet milestones",
        icon: Cpu,
      },
    ],
  },
];

export const footerNav = {
  network: [
    { label: "Technology", href: "/technology" },
    { label: "Node", href: "/node" },
    { label: "Explorer", href: "/explorer" },
    { label: "Roadmap", href: "/roadmap" },
  ],
  community: [
    { label: "Community", href: "/community" },
    { label: "FAQ", href: "/faq" },
    { label: "Genesis Program", href: "/airdrop" },
    { label: "Early Access", href: "/early-access" },
  ],
  developers: [
    { label: "Developers", href: "/developers" },
    { label: "Documentation", href: "/developers#docs" },
    { label: "Architecture", href: "/developers#architecture" },
    { label: "Node Guide", href: "/node#guide" },
    { label: "Build on YAZIMAO", href: "/developers#build" },
  ],
  token: [
    { label: "Token", href: "/token" },
    { label: "Token Economy", href: "/token#economy" },
    { label: "Distribution", href: "/token#distribution" },
    { label: "Incentives", href: "/token#incentives" },
  ],
};

/**
 * Official Channels（官方渠道）—— 页脚专用。
 * 仅收录已由项目方提供的真实地址；未提供（null）的渠道不渲染。
 * external=true 的条目在新窗口打开，并使用 rel="noopener noreferrer"。
 */
export const footerChannels: {
  label: string;
  href: string | null;
  external: boolean;
}[] = [
  { label: "X", href: siteConfig.links.x, external: true },
  { label: "Telegram", href: siteConfig.links.telegram, external: true },
  { label: "GitHub", href: siteConfig.links.github, external: true },
  { label: "Docs", href: "/developers#docs", external: false },
];
