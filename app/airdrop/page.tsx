import type { Metadata } from "next";
import { CalendarClock, Gift, Sparkles, UserPlus, Wallet } from "lucide-react";
import { pageSeo } from "@/lib/seo";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/visual/Reveal";
import { GlowOrb } from "@/components/visual/GlowOrb";
import { GridBackground } from "@/components/visual/GridBackground";
import { Badge } from "@/components/ui/Badge";
import { GenesisJoin } from "@/components/genesis/GenesisJoin";
import { GenesisWallet } from "@/components/genesis/GenesisWallet";

export const metadata: Metadata = pageSeo(
  "/airdrop",
  "Join the YAZIMAO early community program. Earn Genesis Points through participation and contribution.",
  "YAZIMAO Genesis Program",
);

/** 活动规则：Registration 已启用；其余为 Coming Soon / Planned（不产生积分） */
const ACTIVITIES = [
  {
    icon: Gift,
    label: "Registration",
    detail: "+20 Genesis Points",
    state: "Available",
    note: "Granted once per email at registration.",
  },
  {
    icon: CalendarClock,
    label: "Daily Check-in",
    detail: "+1 Point",
    state: "Coming Soon",
    note: "One check-in per 24 hours.",
  },
  {
    icon: UserPlus,
    label: "Invite Friends",
    detail: "+5 Points",
    state: "Coming Soon",
    note: "Reward activates after the invited email registers.",
  },
  {
    icon: Wallet,
    label: "Wallet Sign-in",
    detail: "Verified identity",
    state: "Available",
    note: "Connect a wallet and sign to verify ownership in the Join section below.",
  },
];

export default function AirdropPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden pt-36 pb-16 md:pt-44 md:pb-20">
        <GridBackground fade />
        <GlowOrb className="left-1/2 top-[-140px] h-[420px] w-[720px] -translate-x-1/2" />
        <Container className="relative">
          <div className="mx-auto max-w-3xl text-center">
            <Reveal>
              <div className="mb-5 flex items-center justify-center gap-2">
                <Badge tone="cyan">Early Community Program</Badge>
                <Badge tone="neutral">Genesis Points</Badge>
              </div>
            </Reveal>
            <Reveal delay={0.06}>
              <h1 className="font-display text-4xl font-semibold tracking-tight text-mist-100 text-balance sm:text-5xl lg:text-6xl">
                YAZIMAO Genesis Program
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-5 font-display text-xl text-mist-200 sm:text-2xl">
                Join the first generation of YAZIMAO ecosystem contributors.
              </p>
            </Reveal>
            <Reveal delay={0.14}>
              <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-mist-400 text-pretty sm:text-lg">
                Earn Genesis Points through participation, creation and
                contribution. Genesis Points are participation points only — they
                do not represent, guarantee, or promise any future token
                allocation.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
                <Button href="#join" size="lg">
                  Join Genesis Program
                </Button>
                <Button href="#about" variant="secondary" size="lg">
                  How it works
                </Button>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* About / Points rules */}
      <section
        id="about"
        className="relative border-t border-white/5 bg-ink-900/40 py-24 md:py-28"
      >
        <Container size="narrow">
          <Reveal>
            <Badge tone="cyan" className="mb-4">
              Program overview
            </Badge>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="font-display text-3xl font-semibold tracking-tight text-mist-100 text-balance sm:text-4xl">
              Participation points for the early community
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-4 text-base leading-relaxed text-mist-400 text-pretty">
              The Genesis Program is an early community contribution program for
              YAZIMAO. Today it tracks participation with Genesis Points — it does
              not sell tokens, is not an investment product, and makes no
              guarantee about future tokens, rewards, allocations, or airdrops.
            </p>
          </Reveal>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {ACTIVITIES.map((a, i) => (
              <Reveal key={a.label} delay={i * 0.05}>
                <div className="flex h-full flex-col rounded-2xl border border-white/8 bg-ink-800/40 p-6">
                  <div className="flex items-start justify-between gap-3">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-nova-cyanSoft">
                      <a.icon className="h-5 w-5" />
                    </span>
                    <span
                      className={
                        a.state === "Available"
                          ? "rounded-full border border-nova-cyan/30 bg-nova-cyan/10 px-2.5 py-0.5 text-[11px] font-medium text-nova-cyanSoft"
                          : "rounded-full border border-white/10 px-2.5 py-0.5 text-[11px] font-medium text-mist-500"
                      }
                    >
                      {a.state}
                    </span>
                  </div>
                  <h3 className="mt-5 font-display text-base font-semibold text-mist-100">
                    {a.label}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-mist-300">
                    {a.detail}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-mist-500">
                    {a.note}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Join */}
      <section
        id="join"
        className="relative border-t border-white/5 py-24 md:py-28"
      >
        <Container size="narrow">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-display text-3xl font-semibold tracking-tight text-mist-100 text-balance sm:text-4xl">
                Join the Genesis Program
              </h2>
              <p className="mt-4 text-base leading-relaxed text-mist-400">
                A wallet is the primary way to take part: connect, sign to verify
                you own it, create a profile, then participate.
              </p>
              <div className="mx-auto mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-mist-400">
                {["Connect Wallet", "Sign / Verify", "Create Profile", "Participate"].map(
                  (step, i, arr) => (
                    <span key={step} className="flex items-center gap-2">
                      <span className="rounded-full border border-nova-cyan/30 bg-nova-cyan/10 px-3 py-1 font-medium text-nova-cyanSoft">
                        {step}
                      </span>
                      {i < arr.length - 1 && <span aria-hidden="true">→</span>}
                    </span>
                  ),
                )}
              </div>
            </div>
          </Reveal>

          {/* 主身份路径：Wallet（Connected ≠ Authenticated；签名后才验证） */}
          <Reveal delay={0.06}>
            <div className="mx-auto mt-10 max-w-lg">
              <div className="mb-4 text-center">
                <p className="text-xs font-semibold uppercase tracking-widest text-nova-cyanSoft">
                  Primary — connect your wallet
                </p>
                <p className="mt-2 text-sm text-mist-400">
                  Connect your wallet and sign a short message to verify you own
                  it and join with a wallet-based identity. Connecting alone does
                  not verify or register you — the signature step completes
                  verification.
                </p>
              </div>
              <GenesisWallet />
            </div>
          </Reveal>

          {/* 可选辅助：Email（recovery 未完成，如实标记） */}
          <Reveal delay={0.08}>
            <div className="mx-auto mt-8 max-w-lg">
              <div className="mb-4 text-center">
                <p className="text-xs font-semibold uppercase tracking-widest text-mist-500">
                  Optional — email sign-up
                </p>
                <p className="mt-2 text-xs text-mist-500">
                  Email is an optional alternative today. Email as a recovery
                  method for your profile is not built yet — Coming soon.
                </p>
              </div>
              <GenesisJoin />
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Footer disclaimer */}
      <section className="relative border-t border-white/5 bg-ink-900/40 py-16">
        <Container size="narrow">
          <p className="mx-auto flex max-w-3xl items-start justify-center gap-2 text-center text-xs leading-relaxed text-mist-500">
            <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-nova-cyanSoft" />
            <span>
              YAZIMAO Genesis Program is a project participation program. It is
              not a token sale, an investment product, or an offer of financial
              returns. Future network participation, token distribution, rewards,
              or ecosystem programs may be subject to separate protocol, legal,
              and eligibility requirements. YAZIMAO is in development — it is not
              running on a live mainnet or public testnet yet.
            </span>
          </p>
        </Container>
      </section>
    </>
  );
}
