/**
 * YAZIMAO（中文品牌：亚兹毛）—— 站点级配置（P1 集中配置源）
 *
 * 品牌层事实来源：
 * - 英文品牌：YAZIMAO；中文品牌：亚兹毛
 * - Slogan：Every Creation Matters.
 * - 一句话定位：A public network for human creation.
 * - 网络定位：A Community-Owned Layer 1 Network.
 * - 叙事主脊：① 名称来源——一根羽毛很轻，一个人的创造也很小，轻的东西容易被忽略，
 *   但足够多的创造汇聚起来就有分量；② 标识含义——开放的环，没有中心也没有封口，
 *   永远给后来者留一个缺口；③ 在建的东西——社区所有的 Layer 1，
 *   创造被记录、连接、验证，并由参与者共同持有。
 *
 * 品牌/代号边界：
 * - Nova 仍为「内部开发代号」：所有协议级/代码级标识（GitHub 仓库 nova /
 *   nova-web、NOVA_ID / NV-GEN-######、chain_id、Genesis 参数等）保持不变，
 *   本文件只承载品牌层信息，禁止机械全局替换 Nova → YAZIMAO。
 *
 * 域名边界：
 * 1. 本文件是域名/OG/社区链接的【唯一】事实来源，禁止在其他文件硬编码。
 * 2. 生产环境使用：https://yazimao.xyz（由环境变量 NEXT_PUBLIC_SITE_URL 注入；
 *    代码默认不硬编码域名，未设置时为空字符串）。
 *    旧域名 nova-super.xyz 不立即废弃：将在 Vercel 层通过 301 Redirect 迁移到
 *    https://yazimao.xyz（本仓库不做 DNS 操作）。
 * 3. GitHub 架构（P2）：
 *    - `github`（协议主项目入口）= https://github.com/Cortex-Forest/nova
 *    - `websiteRepo`（官网源码入口）= https://github.com/Cortex-Forest/nova-web
 *    用户面向的 GitHub/Open Source CTA 必须指向 `github`（主项目），
 *    只有“Website Source / 官网源码”语义才使用 `websiteRepo`。
 * 4. 未提供的社区地址为 null → UI 渲染 "Coming Soon"，禁止链接到无关网站首页。
 * 5. 本文件不包含任何未经确认的链上数据 / Tokenomics / 主网状态。
 */

export interface SiteLinks {
  /** Nova 主项目 GitHub 入口 */
  github: string | null;
  /** 官网自身源码仓库（Website Source 语义） */
  websiteRepo: string | null;
  /**
   * 协议文档（L1 仓库 docs/ 目录；官网仅做只读引用，不复制内容）
   * 已核实：Cortex-Forest/nova 默认分支为 main，且存在 docs/ 目录
   */
  protocolDocs: string | null;
  x: string | null;
  discord: string | null;
  telegram: string | null;
}

/** 品牌层（YAZIMAO / 亚兹毛）—— 全站唯一文案来源之一 */
export const brand = {
  /** 英文品牌 */
  name: "YAZIMAO",
  /** 中文品牌 */
  nameZh: "亚兹毛",
  /** Slogan */
  slogan: "Every Creation Matters.",
  /** 一句话定位 */
  positioning: "A public network for human creation.",
  /**
   * 网络定位（V2 P0）：明确「Layer 1」与「社区所有」。
   * 用于 Hero 第一屏，避免泛化的 "public network" 表述弱化协议定位。
   */
  networkPositioning: "A Community-Owned Layer 1 Network.",
  /**
   * 品牌叙事主脊（V2 叙事重构）：名称来源。
   * 单一事实源：BrandStory 引用此处，禁止在组件里另写一份。
   */
  story:
    "The name comes from a simple image: a single feather is light — and so is a single creation. Light things are easy to overlook. Gather enough of them and they hold weight.",
  /** 标识含义（开放环）：无中心、无封口，永远给后来者留一个缺口。 */
  markMeaning:
    "The mark is an open ring, tilted like an orbit. It has no centre and no sealed edge — an opening always remains for whoever joins next. That is the network we are building: a community-owned Layer 1 that its participants hold in common.",
  /** 内部开发代号说明（品牌/协议边界） */
  internalCodenameNote:
    "Nova is the internal development codename for the protocol.",
} as const;

export const siteConfig: {
  name: string;
  nameZh: string;
  tagline: string;
  positioning: string;
  /** 网络定位：Community-Owned Layer 1 Network（V2 P0） */
  networkPositioning: string;
  /** 品牌叙事主脊（名称来源） */
  story: string;
  /** 标识含义（开放环：无中心、无封口） */
  markMeaning: string;
  description: string;
  /** 真实站点域名（部署后通过 NEXT_PUBLIC_SITE_URL 注入）；未设置时为空 */
  url: string;
  ogImage: string;
  /** 网络/进度标签：默认诚实反映当前状态（协议开发中，未上线主网/公共测试网） */
  networkLabel: string;
  links: SiteLinks;
} = {
  name: brand.name,
  nameZh: brand.nameZh,
  tagline: brand.slogan,
  positioning: brand.positioning,
  networkPositioning: brand.networkPositioning,
  story: brand.story,
  markMeaning: brand.markMeaning,
  description:
    "YAZIMAO is building a community-owned Layer 1 network for human creation. Writing, music, art, video, ideas and digital works are recorded, connected, verified and preserved together, so that many small creations can add up to something their participants hold in common. The protocol is in development — there is no public mainnet or testnet yet.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "",
  ogImage: "/og.png", // 1200×630 PNG（品牌资产：图形 logo + 文案）
  // 诚实状态：Nova/YAZIMAO 处于协议开发阶段（Protocol Development），
  // 尚未运行公共主网或公开测试网。禁止展示 "Mainnet"。
  networkLabel: process.env.NEXT_PUBLIC_NETWORK_LABEL ?? "Protocol Development",
  // 官方社区渠道（项目方提供，P3 上线）
  // - X / Twitter：https://x.com/yazimao_network（handle @yazimao_network）
  // - Telegram   ：https://t.me/yazimo
  // - Discord    ：尚未提供 → 保持 null，UI 渲染 Coming Soon（禁止编造地址）
  links: {
    github: "https://github.com/Cortex-Forest/nova",
    websiteRepo: "https://github.com/Cortex-Forest/nova-web",
    protocolDocs: "https://github.com/Cortex-Forest/nova/tree/main/docs",
    x: "https://x.com/yazimao_network",
    discord: null,
    telegram: "https://t.me/yazimo",
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
