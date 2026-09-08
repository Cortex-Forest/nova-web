import { Globe2, Hand, Handshake, Scale } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/visual/Reveal";

/** 首页 07 —— Shared Network（Belong.） */
const shared = [
  {
    icon: Globe2,
    title: "Open to all",
    text: "The network is designed for anyone to participate — as a creator, a node, or a community member.",
  },
  {
    icon: Scale,
    title: "Not owned by one team",
    text: "The direction of the network is meant to belong to its participants, not to any single company or group.",
  },
  {
    icon: Handshake,
    title: "Permissionless by design",
    text: "Participation is intended to need no one's approval — contribution is what matters.",
  },
  {
    icon: Hand,
    title: "Built with care",
    text: "A public good deserves careful engineering: security first, honest progress, and no overstated claims.",
  },
];

export function BelongSection() {
  return (
    <section className="relative border-t border-white/5 bg-ink-900/40 py-24 md:py-32">
      <Container>
        <SectionHeading
          eyebrow="Belong."
          title={
            <>
              A network that <span className="text-gradient">belongs</span> to its
              people
            </>
          }
          description="YAZIMAO is built to be a shared network — for the people who create on it, run it, build on it and care for it. Not for a single center."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {shared.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.06}>
              <div className="h-full rounded-2xl border border-white/8 bg-ink-800/40 p-6">
                <s.icon className="mb-4 h-6 w-6 text-nova-violetSoft" />
                <h3 className="font-display text-base font-semibold text-mist-100">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-mist-400 text-pretty">
                  {s.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
