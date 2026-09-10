import type { Metadata } from "next";
import { pageSeo } from "@/lib/seo";
import {
  Apple,
  AppWindow,
  Check,
  Download,
  Gauge,
  LayoutDashboard,
  Monitor,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { PageHeader } from "@/components/visual/PageHeader";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/visual/Reveal";
import { Button } from "@/components/ui/Button";
import { ReadinessBadge, Badge } from "@/components/ui/Badge";

export const metadata: Metadata = pageSeo(
  "/node",
  "Run a node — mobile node, PC node, or validator. Understand participation and download options on the YAZIMAO network.",
  "Node",
);

const tiers = [
  {
    icon: Smartphone,
    title: "Mobile Node",
    subtitle: "Light participation",
    tag: "Light Node",
    description:
      "A mobile node keeps the network accessible from anywhere. It performs light verification, signs transactions, and checks proofs — without storing the full ledger.",
    features: [
      "Light verification & proof checking",
      "Transaction signing on device",
      "Low bandwidth & battery footprint",
      "Privacy-first — keys stay on device",
    ],
    readiness: "Planned",
    cta: "Mobile Node (Planned)",
  },
  {
    icon: Monitor,
    title: "PC Node",
    subtitle: "Full participation",
    tag: "Full Node",
    description:
      "A PC node relays, stores, and serves the network. From a laptop to a dedicated server — the backbone of the network's availability.",
    features: [
      "Full block & state storage",
      "Transaction relay & gossip",
      "Serves light clients",
      "Runs on Linux, macOS & Windows",
    ],
    readiness: "In Development",
    cta: "PC Node (Soon)",
  },
  {
    icon: ShieldCheck,
    title: "Validator",
    subtitle: "Secure the network",
    tag: "Validator",
    description:
      "Validators stake to secure the network and produce finality. They require the strongest security posture and commitment to uptime.",
    features: [
      "Produce & finalize blocks",
      "Earn staking rewards",
      "Slashing-protected operation",
      "Community & ecosystem incentives",
    ],
    readiness: "Planned",
    cta: "Validator (Planned)",
  },
];

/**
 * Node Guide 步骤（诚实口径：客户端未发布，今日无可安装内容）
 * 不声明任何收益数字 / 资格 / 时间表。
 */
const guideSteps: { title: string; text: string; state: string }[] = [
  {
    title: "Understand the participation models",
    text: "Mobile, PC and validator participation differ in resources and responsibility. Read the three tiers above before choosing.",
    state: "Available",
  },
  {
    title: "Prepare hardware and an operating system",
    text: "PC nodes will target Linux, macOS and Windows; mobile participation targets iOS and Android. Nothing needs to be purchased today.",
    state: "Planned",
  },
  {
    title: "Wait for a signed client release",
    text: "Clients will be published here and in the repository, signed and checksummed. Until then there is no node software to run.",
    state: "Coming Soon",
  },
  {
    title: "Run, monitor and stay current",
    text: "Once released, operators will follow the onboarding guide and use the node dashboard to monitor sync and health.",
    state: "Planned",
  },
  {
    title: "Validators: keys, uptime and slashing",
    text: "Validator operation adds key management, uptime requirements and slashing rules. The specification will be published before validators can join.",
    state: "Planned",
  },
];

export default function NodePage() {
  return (
    <>
      <PageHeader
        eyebrow="Node Network"
        title={
          <>
            Run a node. <span className="text-gradient">Join the network.</span>
          </>
        }
        description="YAZIMAO is designed for a world of participants. Choose the level of participation that fits — every node makes the network stronger."
      />

      {/* Node 类型 */}
      <section className="relative pb-24 md:pb-28">
        <Container>
          <div className="grid gap-5 md:grid-cols-3">
            {tiers.map((t, i) => (
              <Card key={t.title} delay={i * 0.06} className="flex flex-col p-7">
                <div className="mb-6 flex items-center justify-between">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-nova-cyanSoft">
                    <t.icon className="h-6 w-6" />
                  </span>
                  <ReadinessBadge label={t.readiness} tone={t.readiness === "In Development" ? "cyan" : "neutral"} />
                </div>
                <h3 className="font-display text-xl font-semibold text-mist-100">{t.title}</h3>
                <p className="mb-1 text-xs font-medium uppercase tracking-widest text-nova-violetSoft">
                  {t.subtitle}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-mist-400 text-pretty">{t.description}</p>
                <ul className="mt-6 flex-1 space-y-2.5 border-t border-white/8 pt-6">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-mist-300">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-nova-cyan" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button href="/developers" variant="secondary" size="md" className="mt-7 w-full">
                  {t.cta}
                </Button>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Node Rewards */}
      <section
        id="rewards"
        className="relative border-t border-white/5 bg-ink-900/40 py-24 md:py-28"
      >
        <Container>
          <SectionHeading
            eyebrow="Node Rewards"
            title={
              <>
                Rewards for <span className="text-gradient">participation</span>
              </>
            }
            description="Participants are rewarded for securing and serving the network. Specific reward parameters will be published with the incentive specification — no figures are claimed before they are finalized."
          />
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                title: "Validators",
                text: "Staking rewards for producing and finalizing blocks, with penalty mechanisms to keep behavior honest.",
              },
              {
                title: "Full nodes",
                text: "Incentives for storage, bandwidth, and availability contributions to the network.",
              },
              {
                title: "Mobile nodes",
                text: "Light participation incentives designed for low-power devices and broad accessibility.",
              },
            ].map((r, i) => (
              <Reveal key={r.title} delay={i * 0.06}>
                <div className="h-full rounded-2xl border border-white/8 bg-ink-800/40 p-6">
                  <Gauge className="mb-4 h-5 w-5 text-nova-violetSoft" />
                  <h3 className="font-display text-base font-semibold text-mist-100">{r.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-mist-400 text-pretty">{r.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.1}>
            <div className="mt-8 flex items-center gap-3 rounded-2xl border border-white/8 bg-ink-800/40 p-5">
              <Badge tone="amber">Coming Soon</Badge>
              <p className="text-sm text-mist-400">
                The full Node Rewards specification — emission curves, eligibility,
                and slashing — will be published before rewards go live.
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Node Download */}
      <section id="download" className="relative py-24 md:py-28">
        <Container>
          <SectionHeading
            eyebrow="Node Download"
            title={
              <>
                Download the <span className="text-gradient">YAZIMAO node</span>
              </>
            }
            description="Node clients are not released yet. When available, downloads will be published here and on GitHub — always signed and checksummed."
          />
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { icon: AppWindow, label: "Windows", note: "PC Node client", state: "Planned" },
              { icon: Apple, label: "macOS", note: "PC Node client", state: "Planned" },
              { icon: Smartphone, label: "Mobile", note: "iOS & Android", state: "Planned" },
            ].map((p, i) => (
              <Reveal key={p.label} delay={i * 0.06}>
                <div className="flex items-center justify-between rounded-2xl border border-dashed border-white/15 bg-ink-800/30 p-6">
                  <div className="flex items-center gap-4">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-mist-300">
                      <p.icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-display text-sm font-semibold text-mist-100">{p.label}</p>
                      <p className="text-xs text-mist-500">{p.note}</p>
                    </div>
                  </div>
                  <Download className="h-4 w-4 text-mist-500" />
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.1}>
            <p className="mt-6 text-center text-xs text-mist-500">
              Status: <span className="text-mist-300">Not yet available</span> —
              subscribe via the developer channels for release announcements.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Node Guide */}
      <section
        id="guide"
        className="relative border-t border-white/5 bg-ink-900/40 py-24 md:py-28"
      >
        <Container>
          <SectionHeading
            eyebrow="Node Guide"
            title={
              <>
                Getting ready to <span className="text-gradient">run a node</span>
              </>
            }
            description="Node clients are not released yet, so there is nothing to install today. This guide describes what participation will involve so you can prepare — it is not a download page."
          />
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <ol className="space-y-5">
              {guideSteps.map((s, i) => (
                <li key={s.title} className="flex gap-4">
                  <span className="mt-0.5 font-mono text-xs text-mist-500">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-display text-sm font-semibold text-mist-100">
                        {s.title}
                      </h3>
                      <ReadinessBadge
                        label={s.state}
                        tone={s.state === "Available" ? "cyan" : "neutral"}
                      />
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-mist-400 text-pretty">
                      {s.text}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
            <Reveal delay={0.08}>
              <div className="rounded-2xl border border-white/8 bg-ink-800/50 p-6 md:p-7">
                <Badge tone="amber" className="mb-4">
                  Before you start
                </Badge>
                <ul className="space-y-3 text-sm leading-relaxed text-mist-400">
                  <li>
                    No node client is released yet — do not install anything
                    claiming to be a YAZIMAO node.
                  </li>
                  <li>
                    Reward figures, eligibility and slashing parameters are not
                    claimed before the incentive specification is published.
                  </li>
                  <li>
                    Any client release will be published here and in the
                    repository, signed and checksummed.
                  </li>
                </ul>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Button href="/developers#docs" variant="secondary" size="sm">
                    Node documentation
                  </Button>
                  <Button href="/developers#architecture" variant="ghost" size="sm">
                    Architecture
                  </Button>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Node Dashboard 预留 */}
      <section className="relative border-t border-white/5 py-24 md:py-28">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <SectionHeading
                align="left"
                eyebrow="Node Dashboard"
                title={
                  <>
                    Watch your node <span className="text-gradient">at a glance</span>
                  </>
                }
                description="A dedicated dashboard for operators is planned — uptime, rewards, peers, and health, in one place. This page will connect to the node dashboard when it ships."
              />
              <Reveal delay={0.12}>
                <div className="flex flex-wrap items-center gap-3">
                  <ReadinessBadge label="Coming Soon" tone="neutral" />
                  <Badge tone="cyan">Reserved for Node Dashboard</Badge>
                </div>
              </Reveal>
            </div>
            <Reveal delay={0.1}>
              <div className="relative overflow-hidden rounded-2xl border border-white/8 bg-ink-800/50 p-8">
                <div className="pointer-events-none absolute inset-0 grid-bg opacity-60" />
                <div className="relative">
                  <div className="mb-6 flex items-center gap-2 text-xs text-mist-500">
                    <LayoutDashboard className="h-4 w-4" />
                    Node Dashboard Preview
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {["Uptime", "Peers", "Rewards"].map((k) => (
                      <div key={k} className="rounded-xl border border-white/8 bg-ink-900/60 p-4">
                        <p className="text-[11px] uppercase tracking-widest text-mist-500">{k}</p>
                        <p className="mt-2 font-mono text-lg text-mist-500">—</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 rounded-xl border border-white/8 bg-ink-900/60 p-4">
                    <p className="text-[11px] uppercase tracking-widest text-mist-500">Health</p>
                    <div className="mt-3 flex items-center gap-2">
                      <span className="h-2 flex-1 rounded-full bg-white/8">
                        <span className="block h-2 w-1/3 rounded-full bg-white/10" />
                      </span>
                      <span className="font-mono text-xs text-mist-500">—</span>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  );
}
