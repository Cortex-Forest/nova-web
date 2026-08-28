import Link from "next/link";
import {
  ArrowRight,
  Fingerprint,
  GitBranch,
  HardDrive,
  Lock,
  Network,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/visual/Reveal";

const tech: {
  icon: LucideIcon;
  title: string;
  tag: string;
  description: string;
}[] = [
  {
    icon: GitBranch,
    title: "Consensus",
    tag: "PoS + BFT",
    description:
      "Proof-of-Stake validator set with BFT finality. DAG propagation for transactions, BFT for final ordering.",
  },
  {
    icon: Network,
    title: "Network",
    tag: "P2P",
    description:
      "A permissionless P2P network with gossip, discovery, and encrypted transport between nodes.",
  },
  {
    icon: HardDrive,
    title: "Storage",
    tag: "Content-addressed",
    description:
      "Decentralized storage with content-addressed data and verifiable replication.",
  },
  {
    icon: Zap,
    title: "Compute",
    tag: "Off-chain execution",
    description:
      "Decentralized compute coordinated on-chain — tasks, escrow, and result commitments.",
  },
  {
    icon: Fingerprint,
    title: "Execution",
    tag: "WASM",
    description:
      "Deterministic, sandboxed execution of smart contracts through a WASM runtime with metered gas.",
  },
  {
    icon: Lock,
    title: "Security",
    tag: "Security-first",
    description:
      "Formal domain separation, canonical encoding, and auditable state transitions at every layer.",
  },
];

export function TechPreview() {
  return (
    <section className="relative border-t border-white/5 bg-ink-900/40 py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-60" />
      <Container className="relative">
        <SectionHeading
          eyebrow="Technology"
          title={
            <>
              Engineered from the <span className="text-gradient">ground up</span>
            </>
          }
          description="Every subsystem is designed with security before correctness, correctness before speed — and documented before it is built."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tech.map((t, i) => (
            <Reveal key={t.title} delay={i * 0.05}>
              <Link
                href="/technology"
                className="group flex h-full flex-col rounded-2xl border border-white/8 bg-ink-800/40 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/18 hover:bg-ink-800/70"
              >
                <div className="mb-5 flex items-center justify-between">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-nova-cyanSoft transition-colors group-hover:text-nova-cyan">
                    <t.icon className="h-5 w-5" />
                  </span>
                  <span className="text-[11px] font-medium uppercase tracking-widest text-mist-500">
                    {t.tag}
                  </span>
                </div>
                <h3 className="font-display text-lg font-semibold text-mist-100">
                  {t.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-mist-400 text-pretty">
                  {t.description}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-nova-cyanSoft opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  Explore
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link
            href="/technology"
            className="link-underline inline-flex items-center gap-1.5 text-sm font-medium text-mist-300 transition-colors hover:text-white"
          >
            View full technology architecture
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
