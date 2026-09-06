import {
  Cpu,
  FileCode2,
  Gem,
  Layers,
  Map,
  Network,
  type LucideIcon,
} from "lucide-react";

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
  // V1.3：Genesis Program 早期社区积分入口（Points only，非 Token）
  { label: "Airdrop", href: "/airdrop" },
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
  developers: [
    { label: "Developers", href: "/developers" },
    { label: "Documentation", href: "/developers#docs" },
    { label: "GitHub", href: "/developers#github" },
    { label: "Build On Nova", href: "/developers#build" },
  ],
  token: [
    { label: "Token", href: "/token" },
    { label: "Token Economy", href: "/token#economy" },
    { label: "Distribution", href: "/token#distribution" },
    { label: "Incentives", href: "/token#incentives" },
  ],
};
