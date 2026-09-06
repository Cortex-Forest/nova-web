import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/visual/Reveal";

const phases = [
  {
    phase: "Phase 1",
    title: "Protocol & Consensus Design",
    desc: "Architecture, protocol, and consensus design are complete and frozen.",
  },
  {
    phase: "Phase 2",
    title: "Core Implementation",
    desc: "Protocol, storage, and consensus implementation — in progress.",
  },
  {
    phase: "Phase 3",
    title: "Genesis · Devnet · Testnet",
    desc: "Network preparation — not launched; no public devnet or testnet yet.",
  },
  {
    phase: "Phase 4",
    title: "Mainnet & Ecosystem",
    desc: "Future milestones — production launch and the open ecosystem.",
  },
];

export function RoadmapPreview() {
  return (
    <section className="relative border-t border-white/5 bg-ink-900/40 py-24 md:py-32">
      <Container>
        <div className="mb-12 flex flex-col items-start justify-between gap-6 md:mb-16 md:flex-row md:items-end">
          <div className="max-w-xl">
            <Reveal>
              <span className="mb-4 inline-block text-xs font-semibold uppercase tracking-widest text-nova-cyanSoft">
                Roadmap
              </span>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 className="font-display text-3xl font-semibold tracking-tight text-mist-100 sm:text-4xl">
                From protocol to <span className="text-gradient">ecosystem</span>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.12}>
            <Link
              href="/roadmap"
              className="link-underline inline-flex items-center gap-1.5 text-sm font-medium text-mist-300 hover:text-white"
            >
              View full roadmap
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {phases.map((p, i) => (
            <Reveal key={p.phase} delay={i * 0.07}>
              <div className="relative h-full rounded-2xl border border-white/8 bg-ink-800/40 p-6">
                <div className="mb-4 flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-nova-cyan/30 bg-nova-cyan/10 font-mono text-xs font-semibold text-nova-cyanSoft">
                    {i + 1}
                  </span>
                  <span className="text-xs font-medium uppercase tracking-widest text-mist-500">
                    {p.phase}
                  </span>
                </div>
                <h3 className="font-display text-base font-semibold text-mist-100">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-mist-400 text-pretty">
                  {p.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
