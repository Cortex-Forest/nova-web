import type { Metadata } from "next";
import { pageSeo } from "@/lib/seo";
import { CheckCircle2, Circle, Clock3, type LucideIcon } from "lucide-react";
import { PageHeader } from "@/components/visual/PageHeader";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/visual/Reveal";
import { ReadinessBadge } from "@/components/ui/Badge";

export const metadata: Metadata = pageSeo(
  "/roadmap",
  "Nova roadmap — protocol development, testnet, mainnet, and ecosystem milestones.",
  "Roadmap",
);

type ItemStatus = "done" | "active" | "planned";

type Phase = {
  phase: string;
  title: string;
  summary: string;
  status: "In Progress" | "Planned";
  tone: "cyan" | "neutral";
  items: { label: string; status: ItemStatus }[];
};

const phases: Phase[] = [
  {
    phase: "Phase 1",
    title: "Protocol Development",
    summary:
      "The foundation: cryptography, canonical encoding, state transitions, storage, and consensus — documented and tested before anything ships.",
    status: "In Progress",
    tone: "cyan",
    items: [
      { label: "Cryptography & address system", status: "done" },
      { label: "Transaction & state transition model", status: "done" },
      { label: "State storage & proofs", status: "done" },
      { label: "Consensus: PoS, DAG, BFT finality", status: "active" },
      { label: "P2P network layer", status: "active" },
      { label: "WASM execution runtime", status: "planned" },
      { label: "Node coordination layer", status: "planned" },
    ],
  },
  {
    phase: "Phase 2",
    title: "Testnet",
    summary:
      "A public testnet with nodes, wallets, an explorer, and a full developer toolkit. The network is real — the tokens are test tokens.",
    status: "Planned",
    tone: "neutral",
    items: [
      { label: "Public RPC & faucet", status: "planned" },
      { label: "Explorer & wallet support", status: "planned" },
      { label: "Validator onboarding", status: "planned" },
      { label: "Node downloads & dashboard", status: "planned" },
      { label: "Developer docs & SDKs", status: "planned" },
    ],
  },
  {
    phase: "Phase 3",
    title: "Mainnet",
    summary:
      "Production launch. Staking goes live, node rewards begin, and the token economy starts operating under its published specification.",
    status: "Planned",
    tone: "neutral",
    items: [
      { label: "Genesis & token distribution", status: "planned" },
      { label: "Staking & slashing live", status: "planned" },
      { label: "Node rewards program", status: "planned" },
      { label: "Validator & node tooling", status: "planned" },
      { label: "Security audits & hardening", status: "planned" },
    ],
  },
  {
    phase: "Phase 4",
    title: "Ecosystem",
    summary:
      "The open ecosystem: decentralized storage and compute networks, gaming infrastructure, and tools for builders and creators.",
    status: "Planned",
    tone: "neutral",
    items: [
      { label: "Decentralized storage network", status: "planned" },
      { label: "Decentralized compute network", status: "planned" },
      { label: "Gaming ecosystem infrastructure", status: "planned" },
      { label: "Creator & AI tooling", status: "planned" },
      { label: "Developer grants & programs", status: "planned" },
    ],
  },
];

const statusMeta: Record<ItemStatus, { icon: LucideIcon; cls: string }> = {
  done: { icon: CheckCircle2, cls: "text-nova-cyan" },
  active: { icon: Clock3, cls: "text-amber-400" },
  planned: { icon: Circle, cls: "text-mist-500" },
};

export default function RoadmapPage() {
  return (
    <>
      <PageHeader
        eyebrow="Roadmap"
        title={
          <>
            A roadmap without <span className="text-gradient">fiction</span>
          </>
        }
        description="Four phases from protocol to ecosystem. Milestones are marked with honest status — what is built, what is being built, and what comes next."
      />

      <section className="relative pb-24 md:pb-32">
        <Container>
          <div className="relative mx-auto max-w-3xl">
            {/* 中轴线（桌面） */}
            <div
              aria-hidden="true"
              className="absolute left-4 top-0 h-full w-px bg-gradient-to-b from-nova-cyan/40 via-white/10 to-transparent md:left-1/2"
            />

            <div className="space-y-14 md:space-y-20">
              {phases.map((p, i) => (
                <Reveal key={p.phase} delay={0.05}>
                  <div
                    className={`relative flex flex-col gap-6 pl-12 md:w-1/2 md:pl-0 ${
                      i % 2 === 0
                        ? "md:mr-auto md:pr-14 md:text-right"
                        : "md:ml-auto md:pl-14"
                    }`}
                  >
                    {/* 时间轴节点 */}
                    <div
                      aria-hidden="true"
                      className={`absolute top-1 flex h-8 w-8 items-center justify-center rounded-full border border-nova-cyan/40 bg-ink-850 ${
                        i % 2 === 0 ? "left-0 md:-right-4" : "left-0 md:-left-4"
                      }`}
                    >
                      <span className="font-mono text-xs font-semibold text-nova-cyanSoft">
                        {i + 1}
                      </span>
                    </div>

                    <div className="rounded-2xl border border-white/8 bg-ink-800/50 p-6 md:p-7">
                      <div
                        className={`mb-3 flex items-center gap-3 ${
                          i % 2 === 0 ? "md:justify-end" : ""
                        }`}
                      >
                        <span className="text-xs font-medium uppercase tracking-widest text-mist-500">
                          {p.phase}
                        </span>
                        <ReadinessBadge label={p.status} tone={p.tone} dot={false} />
                      </div>
                      <h2 className="font-display text-xl font-semibold text-mist-100 md:text-2xl">
                        {p.title}
                      </h2>
                      <p className="mt-2 text-sm leading-relaxed text-mist-400 text-pretty">
                        {p.summary}
                      </p>
                      <ul className={`mt-5 space-y-2 ${i % 2 === 0 ? "md:flex-row-reverse" : ""}`}>
                        {p.items.map((item) => {
                          const meta = statusMeta[item.status];
                          return (
                            <li
                              key={item.label}
                              className="flex items-center gap-2.5 text-sm text-mist-300"
                            >
                              <meta.icon className={`h-4 w-4 shrink-0 ${meta.cls}`} />
                              {item.label}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal delay={0.1}>
            <p className="mx-auto mt-16 max-w-xl text-center text-xs leading-relaxed text-mist-500">
              Roadmap milestones are indicative and subject to change. This page is
              updated from the same source of truth as the protocol — nothing is
              pre-announced beyond what is being worked on.
            </p>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
