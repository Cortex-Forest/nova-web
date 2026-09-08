import { ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/visual/Reveal";
import { Badge } from "@/components/ui/Badge";

/** 首页 05 —— Verification（Verify.） */
const checks = [
  {
    title: "Activity is verified by the protocol",
    text: "Network activity is designed to be checked through protocol mechanisms — signatures, proofs and consensus — rather than trusted by reputation alone.",
  },
  {
    title: "Deterministic by design",
    text: "The same inputs produce the same outputs. Verification is mechanical, auditable and free of a central gatekeeper.",
  },
  {
    title: "Honest about what is not live yet",
    text: "Verification, finality and proofs are protocol functions under development. Nothing here claims to be running today.",
  },
];

export function VerifySection() {
  return (
    <section className="relative border-t border-white/5 bg-ink-900/40 py-24 md:py-32">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading
              align="left"
              eyebrow="Verify."
              title={
                <>
                  The network verifies what <span className="text-gradient">happens</span>
                </>
              }
              description="A public network needs more than good intentions. YAZIMAO is designed so that activity is verified and recorded through protocol mechanisms — not through the word of any single party."
            />
            <Reveal delay={0.14}>
              <Link
                href="/technology"
                className="link-underline inline-flex items-center gap-1.5 text-sm font-medium text-nova-cyanSoft hover:text-white"
              >
                How verification is designed
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Reveal>
          </div>
          <div className="grid gap-4">
            {checks.map((c, i) => (
              <Reveal key={c.title} delay={i * 0.07}>
                <div className="flex items-start gap-4 rounded-2xl border border-white/8 bg-ink-800/40 p-5">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-nova-cyanSoft" />
                  <div>
                    <h3 className="font-display text-base font-semibold text-mist-100">
                      {c.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-mist-400 text-pretty">
                      {c.text}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
            <Reveal delay={0.1}>
              <div className="flex items-center gap-3 rounded-2xl border border-amber-400/20 bg-amber-400/5 p-4">
                <Badge tone="amber">In Development</Badge>
                <p className="text-xs leading-relaxed text-mist-400">
                  Protocol verification is designed and being implemented — it is
                  not yet a live network.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
