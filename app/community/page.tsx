import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  Code2,
  Github,
  Layers,
  MessagesSquare,
  ScrollText,
  Send,
  Server,
  Sparkles,
  TerminalSquare,
  Twitter,
  type LucideIcon,
} from "lucide-react";
import { pageSeo } from "@/lib/seo";
import { PageHeader } from "@/components/visual/PageHeader";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge, ReadinessBadge } from "@/components/ui/Badge";
import { Reveal } from "@/components/visual/Reveal";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = pageSeo(
  "/community",
  "Official YAZIMAO community channels — X, Telegram, GitHub, and the developer community. Contribute early to a public network for human creation.",
  "Community",
);

type Channel = {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
  cta: string;
  external: boolean;
  note?: string;
};

const channels: Channel[] = [
  {
    icon: Twitter,
    title: "X / Twitter",
    description:
      "Protocol updates, released artifacts, and announcements — the fastest official channel.",
    href: siteConfig.links.x ?? "",
    cta: "Follow on X",
    external: true,
  },
  {
    icon: Send,
    title: "Telegram",
    description:
      "Live discussion with the team and other early contributors. Questions are welcome.",
    href: siteConfig.links.telegram ?? "",
    cta: "Join Telegram",
    external: true,
  },
  {
    icon: Github,
    title: "GitHub",
    description:
      "Open-source protocol, node, and tooling. Read the code, open issues, send pull requests.",
    href: siteConfig.links.github ?? "",
    cta: "Open GitHub",
    external: true,
  },
  {
    icon: MessagesSquare,
    title: "Developer community",
    description:
      "Docs, architecture, SDK and API surface — everything needed to build on YAZIMAO.",
    href: "/developers",
    cta: "Developer resources",
    external: false,
  },
];

const contributions: {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
  cta: string;
  state: string;
}[] = [
  {
    icon: Sparkles,
    title: "Join early",
    description:
      "Register for the Genesis Program, get your Genesis ID, and take part in the first generation of the network community.",
    href: "/airdrop",
    cta: "Genesis Program",
    state: "Available",
  },
  {
    icon: Server,
    title: "Run a node",
    description:
      "Mobile and PC node participation is planned. Testnet participation is not open yet — progress is published as it ships.",
    href: "/node",
    cta: "Node overview",
    state: "Coming Soon",
  },
  {
    icon: Github,
    title: "Build and audit",
    description:
      "Contribute code, review architecture decisions, or prototype against the developer surface as it lands.",
    href: "/developers",
    cta: "Start building",
    state: "In Development",
  },
  {
    icon: MessagesSquare,
    title: "Give feedback",
    description:
      "Ask hard questions, report problems, and pressure-test the documentation. Early scrutiny makes the protocol better.",
    href: siteConfig.links.telegram ?? "/community",
    cta: "Share feedback",
    state: "Available",
  },
];

/** 开发者资源（Developer Resources）—— 入口均指向站内已有锚点或已核实的外部地址 */
const developerResources: {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
  cta: string;
  state: string;
  external: boolean;
}[] = [
  {
    icon: BookOpen,
    title: "Documentation",
    description:
      "Protocol guides, architecture decisions and API references — written alongside the code.",
    href: "/developers#docs",
    cta: "Read the docs",
    state: "In Development",
    external: false,
  },
  {
    icon: ScrollText,
    title: "Protocol docs (GitHub)",
    description:
      "Architecture decisions and protocol documents as they are published in the open repository.",
    href: siteConfig.links.protocolDocs ?? "",
    cta: "Open docs on GitHub",
    state: "Live",
    external: true,
  },
  {
    icon: Layers,
    title: "Architecture",
    description:
      "How the layers fit together — consensus, P2P, execution and storage, top to bottom.",
    href: "/developers#architecture",
    cta: "Architecture overview",
    state: "In Development",
    external: false,
  },
  {
    icon: Code2,
    title: "SDK & API",
    description:
      "Typed client libraries plus versioned RPC and indexer APIs for reading and writing the chain.",
    href: "/developers#sdk",
    cta: "SDK & API",
    state: "Planned",
    external: false,
  },
  {
    icon: TerminalSquare,
    title: "Node Guide",
    description:
      "What running a node involves — hardware, onboarding steps and validator requirements.",
    href: "/node#guide",
    cta: "Node guide",
    state: "Coming Soon",
    external: false,
  },
  {
    icon: Github,
    title: "GitHub",
    description:
      "The official source for protocol, node and tooling code. Read it, audit it, contribute.",
    href: siteConfig.links.github ?? "",
    cta: "Open GitHub",
    state: "Live",
    external: true,
  },
];

export default function CommunityPage() {
  return (
    <>
      <PageHeader
        eyebrow="Community"
        title={
          <>
            Join the <span className="text-gradient">YAZIMAO</span> community
          </>
        }
        description="A public network for human creation is built by the people who use it. Follow the official channels, ask questions, and contribute early."
      >
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button href="/airdrop" size="lg">
            Join Genesis Program
          </Button>
          <Button href="/faq" variant="secondary" size="lg">
            Read the FAQ
          </Button>
        </div>
      </PageHeader>

      {/* 官方渠道 */}
      <section className="relative pb-24 md:pb-28">
        <Container>
          <SectionHeading
            eyebrow="Official channels"
            title="Where the conversation happens"
            description="Only the channels listed below are official. We never ask for seed phrases, private keys, or funds."
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {channels
              .filter((c) => c.href.length > 0)
              .map((c, i) => (
              <Card key={c.title} delay={i * 0.05} className="flex flex-col p-6">
                <span className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-nova-cyanSoft">
                  <c.icon className="h-5 w-5" />
                </span>
                <h3 className="font-display text-base font-semibold text-mist-100">
                  {c.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-mist-400 text-pretty">
                  {c.description}
                </p>
                {c.external ? (
                  <a
                    href={c.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-nova-cyanSoft transition-colors hover:text-white"
                  >
                    {c.cta}
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                ) : (
                  <Link
                    href={c.href}
                    className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-nova-cyanSoft transition-colors hover:text-white"
                  >
                    {c.cta}
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                )}
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Developer resources */}
      <section
        id="developer-resources"
        className="relative border-t border-white/5 bg-ink-900/40 py-24 md:py-28"
      >
        <Container>
          <SectionHeading
            eyebrow="Developer resources"
            title="Build with the protocol, in the open"
            description="The developer surface is being built in public. Start with the documentation and the architecture, then follow the repository as the SDK, API and node tooling land."
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {developerResources
              .filter((d) => d.href.length > 0)
              .map((d, i) => (
                <Card key={d.title} delay={i * 0.04} className="flex flex-col p-6">
                  <div className="mb-5 flex items-center justify-between">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-nova-cyanSoft">
                      <d.icon className="h-5 w-5" />
                    </span>
                    <ReadinessBadge
                      label={d.state}
                      tone={d.state === "Live" ? "cyan" : "neutral"}
                    />
                  </div>
                  <h3 className="font-display text-base font-semibold text-mist-100">
                    {d.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-mist-400 text-pretty">
                    {d.description}
                  </p>
                  {d.external ? (
                    <a
                      href={d.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-nova-cyanSoft transition-colors hover:text-white"
                    >
                      {d.cta}
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  ) : (
                    <Link
                      href={d.href}
                      className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-nova-cyanSoft transition-colors hover:text-white"
                    >
                      {d.cta}
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  )}
                </Card>
              ))}
          </div>

          {/* 官方 GitHub 入口 */}
          <Reveal delay={0.1}>
            <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-2xl border border-white/8 bg-ink-800/50 p-6 sm:flex-row sm:items-center">
              <div>
                <p className="font-display text-base font-semibold text-mist-100">
                  Official GitHub
                </p>
                <p className="mt-1 break-all text-sm text-mist-400">
                  {siteConfig.links.github?.replace(/^https?:\/\//, "")} — the single
                  official source for protocol, node and tooling code.
                </p>
              </div>
              {siteConfig.links.github && (
                <Button href={siteConfig.links.github} variant="secondary" size="md">
                  <Github className="h-4 w-4" />
                  Open GitHub
                </Button>
              )}
            </div>
          </Reveal>
        </Container>
      </section>

      {/* 参与方式 */}
      <section className="relative border-t border-white/5 bg-ink-900/40 py-24 md:py-28">
        <Container>
          <SectionHeading
            eyebrow="Get involved"
            title="Early participation and community contribution"
            description="YAZIMAO is in protocol development. Nothing below is a financial offer — these are ways to take part, learn, and help the network mature."
          />
          <div className="grid gap-5 sm:grid-cols-2">
            {contributions.map((c, i) => (
              <Card key={c.title} delay={i * 0.05} className="flex flex-col p-6 md:p-7">
                <div className="mb-5 flex items-center justify-between">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-nova-cyanSoft">
                    <c.icon className="h-5 w-5" />
                  </span>
                  <ReadinessBadge
                    label={c.state}
                    tone={c.state === "Available" ? "cyan" : "neutral"}
                  />
                </div>
                <h3 className="font-display text-lg font-semibold text-mist-100">
                  {c.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-mist-400 text-pretty">
                  {c.description}
                </p>
                <div className="mt-5">
                  {c.href.startsWith("http") ? (
                    <Button href={c.href} variant="secondary" size="sm">
                      {c.cta}
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button href={c.href} variant="secondary" size="sm">
                      {c.cta}
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* 诚实声明 */}
      <section className="relative border-t border-white/5 py-16">
        <Container size="narrow">
          <Reveal>
            <div className="rounded-2xl border border-white/8 bg-ink-800/50 p-6 md:p-8">
              <Badge tone="amber" className="mb-4">
                Stay safe
              </Badge>
              <ul className="space-y-3 text-sm leading-relaxed text-mist-400">
                <li>
                  Only the channels listed on this page are official. Treat
                  anything else as unofficial until it is linked here.
                </li>
                <li>
                  We never ask for seed phrases or private keys, and we never
                  request funds or payments of any kind.
                </li>
                <li>
                  {siteConfig.name} is in protocol development — there is no live
                  mainnet or public testnet, no token sale, and no promised
                  allocation. Genesis Points are participation points only.
                </li>
              </ul>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* CTA */}
      <section className="relative pb-24 md:pb-32">
        <Container>
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-display text-3xl font-semibold tracking-tight text-mist-100 text-balance sm:text-4xl">
                Every Creation <span className="text-gradient">Matters.</span>
              </h2>
              <p className="mt-4 text-base leading-relaxed text-mist-400 text-pretty">
                Start with the Genesis Program, explore the technology, or open
                the repository and read the code.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Button href="/airdrop" size="lg">
                  Join Genesis Program
                </Button>
                <Button href="/technology" variant="secondary" size="lg">
                  Explore Technology
                </Button>
                <Button href="/developers" variant="ghost" size="lg">
                  Developer docs
                </Button>
              </div>
              <p className="mt-6 text-xs leading-relaxed text-mist-500">
                Status: {siteConfig.networkLabel}
              </p>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
