import type { Metadata } from "next";
import { ArrowRight, Compass, ListChecks, Sparkles } from "lucide-react";
import { pageSeo } from "@/lib/seo";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/visual/Reveal";
import { GlowOrb } from "@/components/visual/GlowOrb";
import { GridBackground } from "@/components/visual/GridBackground";
import { Badge } from "@/components/ui/Badge";
import { EarlyAccessJoin } from "@/components/early-access/EarlyAccessJoin";

export const metadata: Metadata = pageSeo(
  "/early-access",
  "Join Nova Early Access and follow the development of a decentralized creator-focused blockchain as it moves toward testnet.",
  "Nova Early Access",
);

/** Section 2 —— 参与方向清单 */
const INTEREST_AREAS = [
  { label: "Creator", note: "Creator ecosystem and creator economics" },
  { label: "Node Operator", note: "Future node operation and network participation" },
  { label: "Developer", note: "Protocol, tools, and ecosystem development" },
  { label: "Community", note: "Progress, testnet, and community events" },
];

export default function EarlyAccessPage() {
  return (
    <>
      {/* Section 1 —— Hero */}
      <section className="relative overflow-hidden pt-36 pb-20 md:pt-44 md:pb-24">
        <GridBackground fade />
        <GlowOrb className="left-1/2 top-[-140px] h-[420px] w-[720px] -translate-x-1/2" />
        <Container className="relative">
          <div className="mx-auto max-w-3xl text-center">
            <Reveal>
              <div className="mb-5 flex items-center justify-center gap-2">
                <Badge tone="cyan">Early Access</Badge>
                <Badge tone="amber">Testnet Preparation</Badge>
              </div>
            </Reveal>
            <Reveal delay={0.06}>
              <h1 className="font-display text-4xl font-semibold tracking-tight text-mist-100 text-balance sm:text-5xl lg:text-6xl">
                Nova Early Access
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-5 font-display text-xl text-mist-200 sm:text-2xl">
                Join the early Nova community.
              </p>
            </Reveal>
            <Reveal delay={0.14}>
              <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-mist-400 text-pretty sm:text-lg">
                Nova is building a decentralized creator-focused blockchain
                designed around community participation, creator economics, and
                mobile-friendly network participation. Nova is currently in
                protocol development and testnet preparation.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
                <Button href="/early-access#register" size="lg">
                  Join Early Access
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button href="/" variant="secondary" size="lg">
                  <Compass className="h-4 w-4" />
                  Explore Nova
                </Button>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Section 2 —— What Early Access Means */}
      <section className="relative border-t border-white/5 bg-ink-900/40 py-24 md:py-28">
        <Container size="narrow">
          <div className="mx-auto max-w-2xl">
            <Reveal>
              <Badge tone="cyan" className="mb-4">
                About this program
              </Badge>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="font-display text-3xl font-semibold tracking-tight text-mist-100 text-balance sm:text-4xl">
                What is Early Access?
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-4 text-base leading-relaxed text-mist-400 text-pretty sm:text-lg">
                Early Access allows people interested in Nova to register their
                interest and follow the project’s development.
              </p>
            </Reveal>
            <Reveal delay={0.14}>
              <p className="mt-4 text-base leading-relaxed text-mist-400 text-pretty">
                Participants may choose areas they are interested in, including:
              </p>
              <ul className="mt-4 space-y-2.5">
                {INTEREST_AREAS.map((a) => (
                  <li
                    key={a.label}
                    className="flex items-start gap-3 rounded-xl border border-white/8 bg-ink-800/40 px-4 py-3"
                  >
                    <ListChecks className="mt-0.5 h-4 w-4 shrink-0 text-nova-cyanSoft" />
                    <span className="text-sm text-mist-200">
                      <span className="font-semibold text-mist-100">{a.label}</span>
                      <span className="text-mist-500"> — {a.note}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.18}>
              <div className="mt-6 flex items-start gap-3 rounded-xl border border-white/8 bg-ink-800/50 px-5 py-4">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                <p className="text-sm leading-relaxed text-mist-300">
                  Early Access is not a token sale, investment product, or
                  financial offering.
                </p>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Sections 3–5（参与类型选择 / Genesis Program / 注册表单，交互部分） */}
      <EarlyAccessJoin />

      {/* Section 18 —— Legal / Disclaimer */}
      <section className="relative border-t border-white/5 bg-ink-900/40 py-16">
        <Container size="narrow">
          <div className="mx-auto max-w-3xl">
            <p className="text-center text-xs leading-relaxed text-mist-500 text-pretty">
              Nova Early Access is a project participation registration program. It
              is not a token sale, investment product, or offer of financial
              returns. Future network participation, token distribution, rewards,
              or ecosystem programs may be subject to separate protocol, legal, and
              eligibility requirements.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
