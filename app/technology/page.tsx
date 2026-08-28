import type { Metadata } from "next";
import { pageSeo } from "@/lib/seo";
import { PageHeader } from "@/components/visual/PageHeader";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/visual/Reveal";
import { ReadinessBadge, Badge } from "@/components/ui/Badge";
import {
  Fingerprint,
  GitBranch,
  HardDrive,
  Layers,
  Lock,
  Network,
  ShieldCheck,
  Zap,
  type LucideIcon,
} from "lucide-react";

export const metadata: Metadata = pageSeo(
  "/technology",
  "Nova Layer1 technology: consensus, network, storage, compute, execution and security.",
  "Technology",
);

const stack: { label: string; note: string }[] = [
  { label: "Application Layer", note: "Wallets · Explorer · dApps" },
  { label: "API / SDK", note: "RPC · SDKs · Developer tools" },
  { label: "WASM Execution", note: "Sandboxed smart contracts · metered gas" },
  { label: "State Transition", note: "Deterministic · auditable" },
  { label: "Consensus", note: "PoS · DAG · BFT finality" },
  { label: "P2P Network", note: "Gossip · discovery · encrypted transport" },
  { label: "Storage", note: "Verifiable state · content-addressed data" },
];

const pillars: {
  icon: LucideIcon;
  title: string;
  tag: string;
  description: string;
  bullets: string[];
  readiness: string;
}[] = [
  {
    icon: GitBranch,
    title: "Consensus",
    tag: "PoS + DAG + BFT",
    description:
      "A proof-of-stake validator set secures the network, DAG structures organize transaction propagation in parallel, and BFT finality produces a deterministic, final ordering.",
    bullets: [
      "Validator set with weighted voting power",
      "DAG transaction / mempool propagation",
      "BFT finality with explicit finalization",
      "Finality states: Pending → Confirmed → Finalized",
    ],
    readiness: "In Development",
  },
  {
    icon: Network,
    title: "Network",
    tag: "P2P",
    description:
      "A permissionless peer-to-peer layer for node discovery, encrypted transport, gossip, and block/transaction sync — hardened against eclipse, sybil, and spam.",
    bullets: [
      "Peer discovery & identity",
      "Encrypted, authenticated transport",
      "Gossip with rate limiting & size limits",
      "Reputation, backoff & banning",
    ],
    readiness: "In Development",
  },
  {
    icon: HardDrive,
    title: "Storage",
    tag: "Decentralized",
    description:
      "Two storage concerns, cleanly separated: a verifiable on-chain state layer, and an off-chain decentralized storage network for large data.",
    bullets: [
      "Sparse Merkle tree state roots & proofs",
      "Atomic, crash-recoverable state persistence",
      "Content-addressed off-chain storage",
      "Light nodes verify state with proofs",
    ],
    readiness: "In Development",
  },
  {
    icon: Zap,
    title: "Compute",
    tag: "Decentralized",
    description:
      "An open compute network where tasks are registered on-chain, results committed and settled — heavy computation happens off-chain.",
    bullets: [
      "On-chain task registration & escrow",
      "Off-chain execution",
      "Result commitment & settlement",
      "Independent subsystem (not L1 consensus)",
    ],
    readiness: "Planned",
  },
  {
    icon: Fingerprint,
    title: "Execution",
    tag: "WASM",
    description:
      "Deterministic, sandboxed execution through a WASM runtime. Contracts can never run forever — everything is metered and constrained.",
    bullets: [
      "WASM runtime with host interface",
      "Gas / execution / memory limits",
      "No file, network, or system access",
      "Deterministic same-input same-output",
    ],
    readiness: "Planned",
  },
  {
    icon: Lock,
    title: "Security",
    tag: "Security-first",
    description:
      "Security is the first priority — before features, before performance. Domain separation, canonical encoding, and strict bounds everywhere.",
    bullets: [
      "Domain-separated signing contexts",
      "Canonical binary encoding",
      "Checked arithmetic (u128 balances)",
      "Replay protection: chain_id + nonce",
    ],
    readiness: "In Development",
  },
];

export default function TechnologyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Technology"
        title={
          <>
            An architecture built on <span className="text-gradient">first principles</span>
          </>
        }
        description="Nova’s stack is designed top-to-bottom: applications on open APIs, execution in a sandboxed runtime, and a consensus layer that separates transaction propagation from finality."
      />

      {/* 分层架构图 */}
      <section className="relative pb-24 md:pb-28">
        <Container size="narrow">
          <div className="flex flex-col gap-1.5">
            {stack.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.05}>
                <div className="group flex items-center justify-between gap-4 rounded-xl border border-white/8 bg-ink-800/50 px-5 py-4 transition-colors hover:border-nova-cyan/25 hover:bg-ink-800/80">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-mist-500">
                      {String(stack.length - i).padStart(2, "0")}
                    </span>
                    <span className="font-display text-sm font-semibold text-mist-100 sm:text-base">
                      {s.label}
                    </span>
                  </div>
                  <span className="hidden text-xs text-mist-500 sm:block">{s.note}</span>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.1}>
            <p className="mt-6 text-center text-xs leading-relaxed text-mist-500">
              Conceptual stack — layer boundaries follow Nova’s protocol design
              (see the{" "}
              <span className="text-mist-300">architectural decision records</span>).
            </p>
          </Reveal>
        </Container>
      </section>

      {/* 技术支柱 */}
      <section className="relative border-t border-white/5 bg-ink-900/40 py-24 md:py-28">
        <Container>
          <SectionHeading
            eyebrow="Core systems"
            title={
              <>
                Six systems, one <span className="text-gradient">coherent network</span>
              </>
            }
            description="Each system has a clear protocol boundary. Status labels reflect the current development stage — nothing is overstated."
          />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {pillars.map((p, i) => (
              <Card key={p.title} delay={i * 0.05} className="p-7">
                <div className="mb-6 flex items-start justify-between">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-nova-cyanSoft">
                    <p.icon className="h-6 w-6" />
                  </span>
                  <ReadinessBadge label={p.readiness} tone={p.readiness === "Planned" ? "neutral" : "cyan"} />
                </div>
                <div className="mb-1.5 flex items-center gap-2.5">
                  <h3 className="font-display text-lg font-semibold text-mist-100">{p.title}</h3>
                </div>
                <p className="mb-4 text-xs font-medium uppercase tracking-widest text-nova-violetSoft">
                  {p.tag}
                </p>
                <p className="text-sm leading-relaxed text-mist-400 text-pretty">{p.description}</p>
                <ul className="mt-5 space-y-2 border-t border-white/8 pt-5">
                  {p.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-[13px] leading-relaxed text-mist-300">
                      <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-nova-cyan/70" />
                      {b}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* 安全原则 */}
      <section className="relative py-24 md:py-28">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
            <SectionHeading
              align="left"
              eyebrow="Security model"
              title={
                <>
                  Security before <span className="text-gradient">everything</span>
                </>
              }
              description="A pragmatic priority that shapes every decision in the protocol: security, then correctness, then recoverability — performance and features come after."
            />
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  title: "No invented crypto",
                  text: "Only long-reviewed, battle-tested cryptographic libraries. No self-made hashes, signatures, or curves.",
                },
                {
                  title: "Domain separation",
                  text: "Every signing context is separated — transactions, votes, and witnesses can never be replayed across domains.",
                },
                {
                  title: "Canonical encoding",
                  text: "One canonical binary encoding for the whole protocol. No mixed formats between modules.",
                },
                {
                  title: "Checked by default",
                  text: "Integer overflow, fee math, balance sufficiency — all checked. The protocol never silently wraps.",
                },
              ].map((f, i) => (
                <Reveal key={f.title} delay={i * 0.06}>
                  <div className="h-full rounded-2xl border border-white/8 bg-ink-800/40 p-6">
                    <div className="mb-3 flex items-center gap-2.5">
                      <Layers className="h-4 w-4 text-nova-cyanSoft" />
                      <h3 className="font-display text-base font-semibold text-mist-100">{f.title}</h3>
                    </div>
                    <p className="text-sm leading-relaxed text-mist-400 text-pretty">{f.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
          <Reveal delay={0.1}>
            <div className="mt-12 flex flex-wrap items-center gap-2 rounded-2xl border border-white/8 bg-ink-800/40 p-5">
              <Badge tone="amber">Transparency</Badge>
              <p className="text-sm text-mist-400">
                Every protocol design decision is recorded in an architectural
                decision record (ADR) before implementation. Nothing is improvised.
              </p>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
