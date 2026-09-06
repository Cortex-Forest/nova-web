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
  status:
    | "Design Frozen"
    | "In Progress"
    | "Pending · Not Launched"
    | "Future · Planned";
  tone: "cyan" | "neutral";
  items: { label: string; status: ItemStatus }[];
};

const phases: Phase[] = [
  {
    phase: "Phase 1",
    title: "Protocol & Consensus Design",
    summary:
      "Architecture and protocol design are complete and frozen. Consensus design — validator set & votes, DAG, Random Witness, Finality & Precommit QC, Checkpoint, and Fork Choice — is final across steps 10-1..10-14. Core implementation proceeds separately and is verified before anything ships.",
    status: "Design Frozen",
    tone: "cyan",
    items: [
      { label: "Architecture & protocol design", status: "done" },
      { label: "Canonical encoding & test vectors", status: "done" },
      { label: "Consensus: ValidatorSet · Vote · DAG", status: "done" },
      { label: "Random Witness · Finality & Precommit QC", status: "done" },
      { label: "Checkpoint · Fork Choice (10-1..10-14)", status: "done" },
    ],
  },
  {
    phase: "Phase 2",
    title: "Core Implementation",
    summary:
      "Core implementation is in progress — piece by piece, with frozen design decisions and tests before anything ships. Nothing is marked complete until it is verified.",
    status: "In Progress",
    tone: "cyan",
    items: [
      { label: "Transaction & state-transition execution", status: "done" },
      { label: "State storage & proofs", status: "done" },
      { label: "Consensus implementation & node coordination", status: "active" },
      { label: "P2P & sync primitives", status: "active" },
      { label: "WASM execution runtime", status: "planned" },
    ],
  },
  {
    phase: "Phase 3",
    title: "Genesis · Devnet · Testnet",
    summary:
      "Genesis and network parameters are not finalized. No devnet is public and no testnet has launched.",
    status: "Pending · Not Launched",
    tone: "neutral",
    items: [
      { label: "Final genesis & network parameters", status: "planned" },
      { label: "Devnet (not public)", status: "planned" },
      { label: "Public testnet — RPC, faucet, explorer, wallets", status: "planned" },
    ],
  },
  {
    phase: "Phase 4",
    title: "Mainnet & Ecosystem",
    summary:
      "Mainnet launch and the open ecosystem are future milestones — storage, compute, gaming, and tools for builders and creators.",
    status: "Future · Planned",
    tone: "neutral",
    items: [
      { label: "Mainnet genesis & token distribution", status: "planned" },
      { label: "Staking, slashing & node rewards", status: "planned" },
      { label: "Storage, compute & gaming networks", status: "planned" },
      { label: "Creator & developer programs", status: "planned" },
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
