import {
  Clapperboard,
  Layers,
  Lightbulb,
  Music,
  Palette,
  PenLine,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/visual/Reveal";

/** 首页 03 —— Creator（Create.） */
const media: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: PenLine,
    title: "Writing",
    text: "Essays, stories, poems — words that carry a point of view.",
  },
  {
    icon: Music,
    title: "Music",
    text: "Songs, scores and sound that move people.",
  },
  {
    icon: Palette,
    title: "Art",
    text: "Illustration, photography and visual expression.",
  },
  {
    icon: Clapperboard,
    title: "Video",
    text: "Films, motion and stories told in time.",
  },
  {
    icon: Lightbulb,
    title: "Ideas",
    text: "Concepts and experiments that others can build on.",
  },
  {
    icon: Layers,
    title: "Digital Works",
    text: "Apps, worlds and every digital thing in between.",
  },
];

export function CreatorSection() {
  return (
    <section className="relative border-t border-white/5 bg-ink-900/40 py-24 md:py-32">
      <Container>
        <SectionHeading
          eyebrow="Create."
          title={
            <>
              Creation is where a network <span className="text-gradient">begins</span>
            </>
          }
          description="Every network starts with people making things — writing, music, art, video, ideas and digital works. A single one may be small; together they become the network."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {media.map((m, i) => (
            <Card key={m.title} delay={i * 0.05}>
              <div className="flex h-full flex-col">
                <span className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-nova-cyanSoft">
                  <m.icon className="h-6 w-6" />
                </span>
                <h3 className="font-display text-lg font-semibold text-mist-100">
                  {m.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-mist-400 text-pretty">
                  {m.text}
                </p>
              </div>
            </Card>
          ))}
        </div>
        <RevealFiller />
      </Container>
    </section>
  );
}

function RevealFiller() {
  return (
    <Reveal delay={0.1}>
      <p className="mx-auto mt-8 max-w-2xl text-center text-xs leading-relaxed text-mist-500">
        Creating is a contribution — YAZIMAO makes no promise that any creator
        will earn income. Value is decided by the network over time, not
        guaranteed in advance.
      </p>
    </Reveal>
  );
}
