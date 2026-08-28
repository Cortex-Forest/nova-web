import { ArrowRight, Monitor, ShieldCheck, Smartphone } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/visual/Reveal";
import { Card } from "@/components/ui/Card";

const tiers = [
  {
    icon: Smartphone,
    title: "Mobile Node",
    text: "Lightweight participation from phones — light verification, signing, and proof checking without storing the full ledger.",
  },
  {
    icon: Monitor,
    title: "PC Node",
    text: "Full nodes on desktop and servers — relay, store, and serve the network. From hobbyists to operators.",
  },
  {
    icon: ShieldCheck,
    title: "Validator",
    text: "Secured validators that produce and finalize blocks, earning rewards while securing the network.",
  },
];

export function NodeSection() {
  return (
    <section className="relative py-24 md:py-32" id="nodes">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading
              align="left"
              eyebrow="Node Network"
              title={
                <>
                  From your pocket to <span className="text-gradient">the network</span>
                </>
              }
              description="Nova is designed for a world of participants — not a world of data centers. Run a light node on your phone, a full node on your PC, or secure the network as a validator."
            />
            <Reveal delay={0.15}>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button href="/node" size="md">
                  Run a Node
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button href="/node#rewards" variant="secondary" size="md">
                  Node Rewards
                </Button>
              </div>
            </Reveal>
          </div>

          <div className="grid gap-4">
            {tiers.map((t, i) => (
              <Card key={t.title} delay={i * 0.08}>
                <div className="flex items-start gap-4">
                  <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-nova-cyanSoft">
                    <t.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-display text-base font-semibold text-mist-100">
                      {t.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-mist-400 text-pretty">
                      {t.text}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
