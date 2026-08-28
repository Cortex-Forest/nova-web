import type { Metadata } from "next";
import { pageSeo } from "@/lib/seo";
import {
  BookOpen,
  Boxes,
  Code2,
  Copy,
  ExternalLink,
  FileJson,
  FlaskConical,
  Github,
  Rocket,
  TerminalSquare,
  type LucideIcon,
} from "lucide-react";
import { PageHeader } from "@/components/visual/PageHeader";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/visual/Reveal";
import { Button } from "@/components/ui/Button";
import { ReadinessBadge, Badge } from "@/components/ui/Badge";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = pageSeo(
  "/developers",
  "Build on Nova — documentation, SDKs, APIs, GitHub, and the Nova developer platform.",
  "Developers",
);

const tools: {
  icon: LucideIcon;
  title: string;
  description: string;
  state: string;
  href: string;
}[] = [
  {
    icon: BookOpen,
    title: "Developer Docs",
    description: "Protocol guides, architecture decisions, and API references — kept in sync with the code.",
    state: "In Development",
    href: "#docs",
  },
  {
    icon: Boxes,
    title: "SDKs",
    description: "Client libraries for building on Nova — TypeScript, Rust, and more.",
    state: "Planned",
    href: "#sdk",
  },
  {
    icon: FileJson,
    title: "API",
    description: "Public RPC and indexer APIs for reading and writing the chain.",
    state: "Planned",
    href: "#api",
  },
  {
    icon: Github,
    title: "GitHub",
    description: "Open-source protocol, node, and tools — repository link coming soon.",
    state: "Planned",
    href: "#github",
  },
];

export default function DevelopersPage() {
  return (
    <>
      <PageHeader
        eyebrow="Developers"
        title={
          <>
            Build on <span className="text-gradient">Nova</span>
          </>
        }
        description="Everything you need to start building — documentation, SDKs, APIs, and an open-source protocol you can audit and contribute to."
      />

      {/* 工具网格 */}
      <section className="relative pb-24 md:pb-28">
        <Container>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {tools.map((t, i) => (
              <Card key={t.title} delay={i * 0.05} className="flex flex-col p-6">
                <div className="mb-5 flex items-center justify-between">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-nova-cyanSoft">
                    <t.icon className="h-5 w-5" />
                  </span>
                  <ReadinessBadge
                    label={t.state}
                    tone={t.state === "Live" ? "cyan" : "neutral"}
                  />
                </div>
                <h3 className="font-display text-base font-semibold text-mist-100">{t.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-mist-400 text-pretty">
                  {t.description}
                </p>
                <a
                  href={t.href}
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-nova-cyanSoft hover:text-nova-cyan"
                >
                  {t.state === "Planned" ? "Coming Soon" : "Explore"}
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Testnet */}
      <section
        id="testnet"
        className="relative border-t border-white/5 bg-ink-900/40 py-24 md:py-28"
      >
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <SectionHeading
                align="left"
                eyebrow="Testnet"
                title={
                  <>
                    Launch <span className="text-gradient">Testnet</span>
                  </>
                }
                description="A public testnet is the milestone between protocol development and mainnet. When it launches, you'll get test tokens, faucets, and a full suite of explorer and wallet tooling."
              />
              <Reveal delay={0.12}>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button href="#testnet" variant="secondary" size="md">
                    <FlaskConical className="h-4 w-4" />
                    Join Testnet Waitlist
                  </Button>
                  <Badge tone="amber" className="self-start sm:mt-3">
                    Testnet not launched yet
                  </Badge>
                </div>
              </Reveal>
            </div>
            <Reveal delay={0.08}>
              <div className="rounded-2xl border border-white/8 bg-ink-800/50 p-6">
                <div className="mb-4 flex items-center gap-2 text-xs text-mist-500">
                  <TerminalSquare className="h-4 w-4" />
                  Testnet checklist
                </div>
                <ul className="space-y-3">
                  {[
                    "Public RPC endpoints",
                    "Faucet for test tokens",
                    "Explorer for blocks & transactions",
                    "Wallet support (mobile & desktop)",
                    "Validator onboarding guide",
                  ].map((item, i) => (
                    <li key={item} className="flex items-center gap-3 text-sm text-mist-300">
                      <span className="font-mono text-xs text-mist-500">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* SDK + 代码示例 */}
      <section id="sdk" className="relative py-24 md:py-28">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <Reveal delay={0.06}>
              <div className="overflow-hidden rounded-2xl border border-white/8 bg-ink-900/80">
                <div className="flex items-center justify-between border-b border-white/8 px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                  </div>
                  <span className="font-mono text-[11px] text-mist-500">app.ts</span>
                  <Copy className="h-3.5 w-3.5 text-mist-500" />
                </div>
                <pre className="overflow-x-auto p-5 text-[13px] leading-relaxed">
                  <code className="font-mono">
                    <span className="text-nova-violetSoft">import</span>{" "}
                    <span className="text-mist-100">{"{ NovaClient }"}</span>{" "}
                    <span className="text-nova-violetSoft">from</span>{" "}
                    <span className="text-nova-cyanSoft">{'"@nova/sdk"'}</span>
                    {"\n\n"}
                    <span className="text-nova-violetSoft">const</span>{" "}
                    <span className="text-mist-100">client</span>{" "}
                    <span className="text-mist-300">=</span>{" "}
                    <span className="text-nova-violetSoft">new</span>{" "}
                    <span className="text-mist-100">NovaClient</span>
                    <span className="text-mist-300">{"{"}</span>
                    {"\n  "}
                    <span className="text-mist-300">rpcUrl: process.env.</span>
                    <span className="text-mist-100">NEXT_PUBLIC_RPC_URL</span>
                    <span className="text-mist-300">,</span>
                    {"\n  "}
                    <span className="text-mist-300">{'network: "testnet",'}</span>
                    {"\n"}
                    <span className="text-mist-300">{"}"});</span>
                    {"\n\n"}
                    <span className="text-mist-300">{'// Amounts are integers — never floats'}</span>
                    {"\n"}
                    <span className="text-nova-violetSoft">const</span>{" "}
                    <span className="text-mist-100">tx</span>{" "}
                    <span className="text-mist-300">=</span>{" "}
                    <span className="text-nova-violetSoft">await</span>{" "}
                    <span className="text-mist-100">client</span>
                    <span className="text-mist-300">.transfer{"{"}</span>
                    {"\n  "}
                    <span className="text-mist-300">{'to: "nova1'}</span>
                    <span className="text-mist-100">{'",'}</span>
                    {"\n  "}
                    <span className="text-mist-300">{'amount: "1000000",'}</span>
                    {"\n"}
                    <span className="text-mist-300">{"}"});</span>
                    {"\n\n"}
                    <span className="text-nova-violetSoft">const</span>{" "}
                    <span className="text-mist-100">status</span>{" "}
                    <span className="text-mist-300">=</span>{" "}
                    <span className="text-nova-violetSoft">await</span>{" "}
                    <span className="text-mist-100">tx</span>
                    <span className="text-mist-300">.wait();</span>
                    {"\n"}
                    <span className="text-mist-300">{'// pending → accepted → confirmed → finalized'}</span>
                  </code>
                </pre>
              </div>
            </Reveal>
            <div>
              <SectionHeading
                align="left"
                eyebrow="SDK"
                title={
                  <>
                    Code that <span className="text-gradient">just works</span>
                  </>
                }
                description="SDKs give you typed, safe interfaces to the protocol. No floats, no magic — amounts are integers, statuses are explicit, and finality is never overstated."
              />
              <Reveal delay={0.12}>
                <ul className="space-y-3">
                  {[
                    "TypeScript & Rust SDKs",
                    "Typed transaction & event models",
                    "Explicit status: pending / accepted / confirmed / finalized",
                    "Proof & state verification built in",
                  ].map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-mist-300">
                      <Code2 className="mt-0.5 h-4 w-4 shrink-0 text-nova-cyan" />
                      {f}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      {/* API */}
      <section id="api" className="relative border-t border-white/5 bg-ink-900/40 py-24 md:py-28">
        <Container>
          <SectionHeading
            eyebrow="API"
            title={
              <>
                Public <span className="text-gradient">RPC &amp; data APIs</span>
              </>
            }
            description="Read the chain, submit transactions, and query indexed data through versioned APIs. Public RPC is separated from validator management endpoints."
          />
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                title: "Public RPC",
                text: "Submit transactions and query chain state. Versioned, rate-limited, size-bounded.",
              },
              {
                title: "Indexer API",
                text: "Blocks, transactions, accounts, and validators — built for explorers and dashboards.",
              },
              {
                title: "Versioning",
                text: "/api/v1 → /api/v2. Breaking changes never silently ship.",
              },
            ].map((a, i) => (
              <Reveal key={a.title} delay={i * 0.06}>
                <div className="h-full rounded-2xl border border-white/8 bg-ink-800/40 p-6">
                  <h3 className="font-display text-base font-semibold text-mist-100">{a.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-mist-400 text-pretty">{a.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Docs + GitHub */}
      <section className="relative py-24 md:py-28">
        <Container>
          <div className="grid gap-5 md:grid-cols-2">
            <div id="docs">
              <Card delay={0.02} className="flex flex-col p-8">
                <div className="mb-5 flex items-center gap-3">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-nova-cyanSoft">
                  <BookOpen className="h-5 w-5" />
                </span>
                <h3 className="font-display text-lg font-semibold text-mist-100">Developer Docs</h3>
              </div>
              <p className="text-sm leading-relaxed text-mist-400 text-pretty">
                Documentation is a first-class deliverable — written alongside the
                protocol, recorded as architectural decisions, and kept in sync with
                the code.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {["Protocol guides", "WASM contract guide", "Validator guide", "Node guide", "API reference"].map((d) => (
                  <Badge key={d} tone="neutral">
                    {d}
                  </Badge>
                ))}
              </div>
              <div className="mt-auto pt-7">
                <Button href="#docs" variant="secondary" size="md" className="w-full">
                  Documentation
                </Button>
              </div>
              </Card>
            </div>

            <div id="github">
              <Card delay={0.08} className="flex flex-col p-8">
                <div className="mb-5 flex items-center gap-3">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-nova-cyanSoft">
                    <Github className="h-5 w-5" />
                  </span>
                  <h3 className="font-display text-lg font-semibold text-mist-100">Open Source</h3>
              </div>
              <p className="text-sm leading-relaxed text-mist-400 text-pretty">
                The Nova protocol is developed in the open. Read the code, audit the
                decisions, and contribute. Transparency is part of the security model.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {["Core protocol", "Node client", "Wallets", "SDKs", "Docs"].map((d) => (
                  <Badge key={d} tone="neutral">
                    {d}
                  </Badge>
                ))}
              </div>
              <div className="mt-auto pt-7">
                {siteConfig.links.github ? (
                  <Button href={siteConfig.links.github} variant="secondary" size="md" className="w-full">
                    <Github className="h-4 w-4" />
                    View GitHub
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button variant="secondary" size="md" className="w-full" disabled>
                    <Github className="h-4 w-4" />
                    GitHub — Coming Soon
                  </Button>
                )}
              </div>
              </Card>
            </div>
          </div>
        </Container>
      </section>

      {/* Build On Nova */}
      <section id="build" className="relative overflow-hidden border-t border-white/5 py-24 md:py-28">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[360px] w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.1),transparent_70%)] blur-2xl" />
        <Container className="relative">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <span className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-nova-cyan/25 bg-nova-cyan/10">
                <Rocket className="h-6 w-6 text-nova-cyanSoft" />
              </span>
              <h2 className="font-display text-3xl font-semibold tracking-tight text-mist-100 text-balance sm:text-4xl">
                Build the next generation of <span className="text-gradient">open apps</span>
              </h2>
              <p className="mt-4 text-base leading-relaxed text-mist-400 text-pretty">
                Wallets, games, storage apps, compute markets, and AI creator tools —
                Nova is infrastructure for builders. Start with the docs, and join
                the developer community.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Button href="#docs" size="lg">
                  Read the Docs
                </Button>
                {siteConfig.links.github ? (
                  <Button href={siteConfig.links.github} variant="secondary" size="lg">
                    <Github className="h-4 w-4" />
                    GitHub
                  </Button>
                ) : (
                  <Button variant="secondary" size="lg" disabled>
                    <Github className="h-4 w-4" />
                    GitHub — Coming Soon
                  </Button>
                )}
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
