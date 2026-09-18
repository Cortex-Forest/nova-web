import type { Metadata } from "next";
import { pageSeo } from "@/lib/seo";
import { CheckCircle2, Circle, Clock3, type LucideIcon } from "lucide-react";
import { PageHeader } from "@/components/visual/PageHeader";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/visual/Reveal";
import { ReadinessBadge } from "@/components/ui/Badge";

export const metadata: Metadata = pageSeo(
  "/roadmap",
  "YAZIMAO roadmap — protocol development, testnet, mainnet, and ecosystem milestones.",
  "Roadmap",
);

type ItemStatus = "done" | "active" | "planned";

type Phase = {
  phase: string;
  title: string;
  summary: string;
  status:
    | "Completed"
    | "Development"
    | "Upcoming";
  tone: "cyan" | "neutral";
  items: { label: string; status: ItemStatus }[];
};

const phases: Phase[] = [
  {
    phase: "Completed",
    title: "Layer 1 foundations",
    summary:
      "Consensus, node runtime, P2P and storage foundations are implemented and verified in the repository — including a single-node production loop and two-node TCP height synchronization validation. Design was frozen first and nothing is marked complete until it is tested.",
    status: "Completed",
    tone: "cyan",
    items: [
      { label: "Consensus foundation", status: "done" },
      { label: "Node runtime foundation", status: "done" },
      { label: "P2P network foundation", status: "done" },
      { label: "Storage foundation", status: "done" },
      { label: "Single-node production loop", status: "done" },
      { label: "Two-node TCP height synchronization validation", status: "done" },
    ],
  },
  {
    phase: "Development",
    title: "Public testnet preparation",
    summary:
      "Work in progress toward a public testnet. There is no public testnet yet and no mainnet — nothing in this stage is launched, and no dates are promised.",
    status: "Development",
    tone: "cyan",
    items: [
      { label: "Public testnet preparation", status: "active" },
      { label: "Developer tools", status: "active" },
      { label: "Explorer — indexer & UI", status: "active" },
      { label: "WASM execution runtime", status: "planned" },
    ],
  },
  {
    phase: "Upcoming",
    title: "Ecosystem & community",
    summary:
      "Planned after the testnet: ecosystem expansion and community growth. Mainnet, token and economics stay unlaunched until they are specified and verified.",
    status: "Upcoming",
    tone: "neutral",
    items: [
      { label: "Ecosystem expansion", status: "planned" },
      { label: "Community growth", status: "planned" },
      { label: "Mainnet & token distribution", status: "planned" },
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
        description="Three stages from foundations to ecosystem. Milestones are marked with honest status — what is built, what is being built, and what comes next."
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
