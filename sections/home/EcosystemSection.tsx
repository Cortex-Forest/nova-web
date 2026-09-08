import {
  Blocks,
  Bot,
  Gamepad2,
  HardDrive,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { ReadinessBadge } from "@/components/ui/Badge";

/** 首页 10 —— Ecosystem（未来应用方向；未实现功能必须标记 Planned / In Development） */
const directions: {
  icon: LucideIcon;
  title: string;
  text: string;
  state: string;
}[] = [
  {
    icon: Sparkles,
    title: "Creator Tools",
    text: "Tools for publishing, proving ownership and connecting work to the network.",
    state: "Planned",
  },
  {
    icon: Gamepad2,
    title: "Open Games & Economies",
    text: "Infrastructure for games where players own state and assets.",
    state: "Planned",
  },
  {
    icon: HardDrive,
    title: "Storage Applications",
    text: "Apps on a decentralized storage network for content that lives off-chain.",
    state: "In Development",
  },
  {
    icon: Blocks,
    title: "Compute Markets",
    text: "Open markets where heavy computation is coordinated on-chain and run off-chain.",
    state: "Planned",
  },
  {
    icon: Bot,
    title: "AI Creator Interfaces",
    text: "Interfaces that help AI-assisted creation reach the network (an early direction).",
    state: "In Development",
  },
];

export function EcosystemSection() {
  return (
    <section className="relative overflow-hidden border-t border-white/5 py-24 md:py-32">
      <div className="pointer-events-none absolute left-[-160px] top-1/3 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle_at_center,rgba(232,121,249,0.08),transparent_70%)] blur-2xl" />
      <Container className="relative">
        <SectionHeading
          eyebrow="Ecosystem"
          title={
            <>
              Where creation can go <span className="text-gradient">next</span>
            </>
          }
          description="These directions are planned or in development — not live. YAZIMAO publishes what it is actually building, and marks the rest honestly."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {directions.map((d, i) => (
            <Card key={d.title} delay={i * 0.05}>
              <div className="flex h-full flex-col">
                <div className="mb-4 flex items-center justify-between">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-nova-cyanSoft">
                    <d.icon className="h-5 w-5" />
                  </span>
                  <ReadinessBadge
                    label={d.state}
                    tone={d.state === "In Development" ? "cyan" : "neutral"}
                  />
                </div>
                <h3 className="font-display text-lg font-semibold text-mist-100">
                  {d.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-mist-400 text-pretty">
                  {d.text}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
