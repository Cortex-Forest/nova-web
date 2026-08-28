import {
  Boxes,
  Cpu,
  Gamepad2,
  Layers,
  Network,
  type LucideIcon,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Container } from "@/components/ui/Container";

const pillars: {
  icon: LucideIcon;
  title: string;
  description: string;
  accent: string;
}[] = [
  {
    icon: Layers,
    title: "Layer1 Blockchain",
    description:
      "An independent Layer1 — no reliance on other chains. Built for reliable execution, stable sync, and auditable finality.",
    accent: "text-nova-cyanSoft",
  },
  {
    icon: Boxes,
    title: "Decentralized Storage",
    description:
      "A storage network where data is content-addressed, replicated, and verifiable — separate from the L1 state layer.",
    accent: "text-nova-violetSoft",
  },
  {
    icon: Cpu,
    title: "Decentralized Compute",
    description:
      "An open compute network for tasks, escrow, and result commitments — coordinated on-chain, executed off-chain.",
    accent: "text-nova-magenta",
  },
  {
    icon: Gamepad2,
    title: "Gaming Ecosystem",
    description:
      "Infrastructure for open game economies — assets, ownership, and game state built on a shared, permissionless base.",
    accent: "text-nova-cyanSoft",
  },
  {
    icon: Network,
    title: "Node Network",
    description:
      "Mobile nodes, PC nodes, and validators. Participation from lightweight devices to full validators — anyone can run a node.",
    accent: "text-nova-violetSoft",
  },
];

export function Pillars() {
  return (
    <section className="relative py-24 md:py-32" id="pillars">
      <Container>
        <SectionHeading
          eyebrow="What is Nova"
          title={
            <>
              Five pillars. <span className="text-gradient">One network.</span>
            </>
          }
          description="Nova is not a single product — it is a family of interoperable subsystems built on a shared Layer1 foundation."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pillars.map((p, i) => (
            <Card key={p.title} delay={i * 0.06} className={i === 0 ? "sm:col-span-2 lg:col-span-1" : ""}>
              <div className="flex h-full flex-col">
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                  <p.icon className={`h-6 w-6 ${p.accent}`} />
                </div>
                <h3 className="font-display text-lg font-semibold text-mist-100">
                  {p.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-mist-400 text-pretty">
                  {p.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
