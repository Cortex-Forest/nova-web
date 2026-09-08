import {
  AppWindow,
  Blocks,
  Smartphone,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/visual/Reveal";

/** 首页 04 —— Network（Connect.） */
const nodes: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: Users,
    title: "Creators",
    text: "People who write, draw, record and build — the source of the network.",
  },
  {
    icon: Blocks,
    title: "Nodes",
    text: "From phones to full nodes, the devices that carry and verify the network.",
  },
  {
    icon: Wallet,
    title: "Wallets",
    text: "The identity and custody layer people use to participate.",
  },
  {
    icon: AppWindow,
    title: "Applications",
    text: "Tools, explorers, marketplaces and experiences built on top.",
  },
  {
    icon: Smartphone,
    title: "Community",
    text: "The people who steward, discuss and grow the network together.",
  },
];

export function NetworkSection() {
  return (
    <section className="relative py-24 md:py-32">
      <Container>
        <SectionHeading
          eyebrow="Connect."
          title={
            <>
              Every contribution <span className="text-gradient">connects</span>{" "}
              into a network
            </>
          }
          description="Creators, nodes, wallets, applications and community are all part of one connected system. Nothing has to stand alone."
        />
        <div className="mx-auto max-w-3xl space-y-3">
          {nodes.map((n, i) => (
            <Reveal key={n.title} delay={i * 0.05}>
              <div className="flex items-start gap-4 rounded-2xl border border-white/8 bg-ink-800/40 px-5 py-4 transition-colors hover:border-white/15 hover:bg-ink-800/70">
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-nova-violetSoft">
                  <n.icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-display text-base font-semibold text-mist-100">
                    {n.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-mist-400 text-pretty">
                    {n.text}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
