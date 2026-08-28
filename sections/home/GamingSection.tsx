import { Gamepad2 } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/visual/Reveal";
import { Badge } from "@/components/ui/Badge";

const points = [
  "Ownership that players actually control — assets, identity, and progress on-chain.",
  "Open game economies without a central gatekeeper.",
  "A shared base layer for games, marketplaces, and creator tools.",
  "Interoperable game state across the Nova ecosystem.",
];

export function GamingSection() {
  return (
    <section className="relative overflow-hidden border-t border-white/5 py-24 md:py-32">
      <div className="pointer-events-none absolute right-[-120px] top-1/2 h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(232,121,249,0.1),transparent_70%)] blur-2xl" />
      <Container className="relative">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="order-2 lg:order-1">
            <div className="grid gap-3">
              {points.map((p, i) => (
                <Reveal key={p} delay={i * 0.06}>
                  <div className="flex items-start gap-3 rounded-xl border border-white/8 bg-ink-800/40 px-4 py-3.5">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-nova-magenta" />
                    <p className="text-sm leading-relaxed text-mist-300 text-pretty">{p}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <SectionHeading
              align="left"
              eyebrow="Gaming Ecosystem"
              title={
                <>
                  Games where players <span className="text-gradient">own the state</span>
                </>
              }
              description="Nova builds the infrastructure for open gaming — a permissionless layer where game assets, identity, and economies live."
            />
            <Reveal delay={0.2}>
              <div className="flex items-center gap-3">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-nova-magenta/25 bg-nova-magenta/10">
                  <Gamepad2 className="h-6 w-6 text-nova-magenta" />
                </span>
                <div>
                  <Badge tone="neutral" className="mb-1">
                    Ecosystem
                  </Badge>
                  <p className="text-xs text-mist-500">
                    Gaming infrastructure — planned as part of the Nova ecosystem roadmap.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
