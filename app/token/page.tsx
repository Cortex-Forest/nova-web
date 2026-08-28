import type { Metadata } from "next";
import { pageSeo } from "@/lib/seo";
import {
  Boxes,
  Coins,
  Database,
  HandCoins,
  PieChart,
  Scale,
  Timer,
  TrendingUp,
} from "lucide-react";
import { PageHeader } from "@/components/visual/PageHeader";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/visual/Reveal";
import { Badge, ReadinessBadge } from "@/components/ui/Badge";

export const metadata: Metadata = pageSeo(
  "/token",
  "Nova token economy, supply model, distribution, and incentive system.",
  "Token",
);

/**
 * 重要原则：本页不包含任何未经确认的数据。
 * 供应量、分配比例、排放曲线均为 TBD，待 Economics Specification 定稿后接入。
 */

export default function TokenPage() {
  return (
    <>
      <PageHeader
        eyebrow="Token"
        title={
          <>
            An economy designed <span className="text-gradient">for the network</span>
          </>
        }
        description="NOVA is the native token of the Nova network — used for fees, staking, and participation incentives. Final parameters are published with the Economics Specification; nothing on this page is speculative."
      />

      {/* Token Economy */}
      <section id="economy" className="relative pb-24 md:pb-28">
        <Container>
          <SectionHeading
            eyebrow="Token Economy"
            title={
              <>
                What the token <span className="text-gradient">does</span>
              </>
            }
            description="The token has concrete roles across the network. Parameters — amounts, rates, and curves — are finalized in the Economics Specification."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: HandCoins,
                title: "Transaction Fees",
                text: "Gas for executing transactions and smart contracts. Fees are metered and deterministic.",
              },
              {
                icon: Scale,
                title: "Staking",
                text: "Validators stake NOVA to secure the network. Weighted voting power, slashing protection.",
              },
              {
                icon: Boxes,
                title: "Storage",
                text: "Payments for storage orders and commitments in the decentralized storage network.",
              },
              {
                icon: TrendingUp,
                title: "Compute",
                text: "Escrow and settlement for compute tasks — coordinated on-chain, executed off-chain.",
              },
            ].map((c, i) => (
              <Card key={c.title} delay={i * 0.05} className="p-6">
                <span className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-nova-cyanSoft">
                  <c.icon className="h-5 w-5" />
                </span>
                <h3 className="font-display text-base font-semibold text-mist-100">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-mist-400 text-pretty">{c.text}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Supply Model */}
      <section id="supply" className="relative border-t border-white/5 bg-ink-900/40 py-24 md:py-28">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <SectionHeading
                align="left"
                eyebrow="Supply Model"
                title={
                  <>
                    A supply model, <span className="text-gradient">defined in code</span>
                  </>
                }
                description="The supply model must be simulable — not a slide. Genesis allocation, emission, vesting, and burning are specified precisely and verifiably."
              />
              <div className="space-y-3">
                {[
                  {
                    icon: Database,
                    title: "Genesis allocation",
                    text: "Defined at genesis with verified accounting invariants.",
                  },
                  {
                    icon: Coins,
                    title: "Emission & burning",
                    text: "Validator emission and fee burning are modeled as economic parameters.",
                  },
                  {
                    icon: Timer,
                    title: "Vesting & unlock",
                    text: "Schedules are explicit and code-simulable.",
                  },
                ].map((s, i) => (
                  <Reveal key={s.title} delay={i * 0.06}>
                    <div className="flex items-start gap-4 rounded-xl border border-white/8 bg-ink-800/40 p-5">
                      <s.icon className="mt-0.5 h-5 w-5 shrink-0 text-nova-violetSoft" />
                      <div>
                        <h4 className="text-sm font-semibold text-mist-100">{s.title}</h4>
                        <p className="mt-1 text-sm text-mist-400">{s.text}</p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>

            {/* 供应参数占位 */}
            <Reveal delay={0.08}>
              <div className="relative overflow-hidden rounded-2xl border border-white/8 bg-ink-800/50 p-8">
                <div className="pointer-events-none absolute inset-0 grid-bg opacity-60" />
                <div className="relative">
                  <div className="mb-6 flex items-center justify-between">
                    <p className="text-xs font-medium uppercase tracking-widest text-mist-500">
                      Supply parameters
                    </p>
                    <ReadinessBadge label="TBD" tone="amber" />
                  </div>
                  <div className="space-y-3">
                    {[
                      { label: "Total supply", unit: "NOVA" },
                      { label: "Genesis allocation", unit: "%" },
                      { label: "Validator emission", unit: "per era" },
                      { label: "Burn rate", unit: "% of fees" },
                      { label: "Unbonding period", unit: "eras" },
                    ].map((p) => (
                      <div
                        key={p.label}
                        className="flex items-center justify-between rounded-xl border border-white/8 bg-ink-900/60 px-4 py-3"
                      >
                        <span className="text-sm text-mist-400">{p.label}</span>
                        <span className="font-mono text-sm text-mist-500">
                          — <span className="text-xs text-mist-500">{p.unit}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="mt-5 text-xs leading-relaxed text-mist-500">
                    Final values are published in the Economics Specification before
                    launch. Until then, all figures are deliberately blank.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Distribution */}
      <section id="distribution" className="relative py-24 md:py-28">
        <Container>
          <SectionHeading
            eyebrow="Distribution"
            title={
              <>
                Allocation, <span className="text-gradient">once defined</span>
              </>
            }
            description="The allocation model balances the ecosystem, validators, treasury, and community. The exact breakdown will be released with the Economics Specification."
          />
          <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-center">
            {/* 环形图占位 */}
            <Reveal delay={0.05}>
              <div className="relative mx-auto flex h-64 w-64 items-center justify-center sm:h-72 sm:w-72">
                <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
                  <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
                  <circle
                    cx="60"
                    cy="60"
                    r="52"
                    fill="none"
                    stroke="rgba(255,255,255,0.06)"
                    strokeWidth="10"
                    strokeDasharray="327 327"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <p className="text-xs uppercase tracking-widest text-mist-500">Allocation</p>
                  <p className="mt-1 font-mono text-sm text-mist-500">TBD</p>
                </div>
              </div>
            </Reveal>

            <div className="space-y-3">
              {[
                { label: "Ecosystem", note: "Storage, compute, gaming, grants" },
                { label: "Validators & staking", note: "Network security incentives" },
                { label: "Community", note: "Nodes, participation, adoption" },
                { label: "Treasury", note: "Long-term network development" },
                { label: "Team & contributors", note: "Builders of the protocol" },
              ].map((d, i) => (
                <Reveal key={d.label} delay={i * 0.05}>
                  <div className="flex items-center justify-between rounded-xl border border-white/8 bg-ink-800/40 px-5 py-4">
                    <div>
                      <p className="text-sm font-semibold text-mist-100">{d.label}</p>
                      <p className="text-xs text-mist-500">{d.note}</p>
                    </div>
                    <span className="font-mono text-sm text-mist-500">—</span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Incentive System */}
      <section id="incentives" className="relative border-t border-white/5 bg-ink-900/40 py-24 md:py-28">
        <Container>
          <SectionHeading
            eyebrow="Incentive System"
            title={
              <>
                Incentives that <span className="text-gradient">align</span>
              </>
            }
            description="Incentives exist to keep the network secure, available, and useful — not to reward noise. Every incentive is designed against gaming and sybil abuse."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Scale,
                title: "Security",
                text: "Staking and slashing align validators with network safety.",
              },
              {
                icon: Boxes,
                title: "Storage",
                text: "Rewards tied to real, verifiable storage contributions.",
              },
              {
                icon: TrendingUp,
                title: "Compute",
                text: "Settlement tied to verifiable results, not raw volume.",
              },
              {
                icon: Coins,
                title: "Anti-abuse",
                text: "Contribution proofs, reward caps, and sybil resistance.",
              },
            ].map((c, i) => (
              <Card key={c.title} delay={i * 0.05} className="p-6">
                <span className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-nova-cyanSoft">
                  <c.icon className="h-5 w-5" />
                </span>
                <h3 className="font-display text-base font-semibold text-mist-100">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-mist-400 text-pretty">{c.text}</p>
              </Card>
            ))}
          </div>
          <Reveal delay={0.1}>
            <div className="mt-8 flex flex-col items-start gap-3 rounded-2xl border border-white/8 bg-ink-800/40 p-6 sm:flex-row sm:items-center">
              <PieChart className="h-5 w-5 shrink-0 text-amber-400" />
              <p className="text-sm leading-relaxed text-mist-400">
                <span className="font-semibold text-mist-200">No numbers, yet.</span>{" "}
                Supply, allocation, emission, and reward formulas are finalized in the
                Economics Specification. When they are, this page is updated from a
                single source of truth — never hardcoded marketing figures.
              </p>
              <Badge tone="amber" className="shrink-0">
                Coming Soon
              </Badge>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
