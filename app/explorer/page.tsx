import type { Metadata } from "next";
import { pageSeo } from "@/lib/seo";
import { Database, Filter, Plug, ShieldCheck, Zap } from "lucide-react";
import { PageHeader } from "@/components/visual/PageHeader";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/visual/Reveal";
import { ExplorerPreview } from "@/components/explorer/ExplorerPreview";
import { Card } from "@/components/ui/Card";

export const metadata: Metadata = pageSeo(
  "/explorer",
  "Nova Explorer — blocks, transactions, accounts, and validators, backed by real chain data.",
  "Explorer",
);

const dataSources = [
  {
    icon: Database,
    title: "Blocks",
    text: "Height, hash, transactions, proposer, and finality status.",
  },
  {
    icon: Zap,
    title: "Transactions",
    text: "Tx hashes, types, sender & receiver, amounts, and status.",
  },
  {
    icon: Filter,
    title: "Accounts",
    text: "Addresses, balances, nonces, and account types.",
  },
  {
    icon: ShieldCheck,
    title: "Validators",
    text: "Validator identity, status, voting power, and uptime.",
  },
];

export default function ExplorerPage() {
  return (
    <>
      <PageHeader
        eyebrow="Explorer"
        title={
          <>
            See the chain, <span className="text-gradient">live</span>
          </>
        }
        description="An Explorer built on real Nova data — blocks, transactions, accounts, and validators. When the network is live, this page is powered by the Nova Indexer."
      />

      <section className="relative pb-24 md:pb-28">
        <Container>
          <Reveal>
            <ExplorerPreview />
          </Reveal>
        </Container>
      </section>

      {/* 数据源说明 */}
      <section className="relative border-t border-white/5 bg-ink-900/40 py-24 md:py-28">
        <Container>
          <SectionHeading
            eyebrow="Data layer"
            title={
              <>
                Truth comes from the <span className="text-gradient">node</span>
              </>
            }
            description="The Explorer is a window into the chain — never the source of truth. It reads from the Nova Indexer, which rebuilds from node state and stays consistent through reorgs."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {dataSources.map((s, i) => (
              <Card key={s.title} delay={i * 0.05} className="p-6">
                <span className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-nova-cyanSoft">
                  <s.icon className="h-5 w-5" />
                </span>
                <h3 className="font-display text-base font-semibold text-mist-100">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-mist-400 text-pretty">{s.text}</p>
              </Card>
            ))}
          </div>
          <Reveal delay={0.1}>
            <div className="mt-10 grid gap-4 lg:grid-cols-3">
              {[
                {
                  icon: Database,
                  title: "Rebuildable",
                  text: "The indexer can be fully rebuilt from node state, with resume and idempotent replay.",
                },
                {
                  icon: Plug,
                  title: "API-ready",
                  text: "Exposed through a versioned Indexer API — the same API that powers dashboards and dApps.",
                },
                {
                  icon: ShieldCheck,
                  title: "Finality-aware",
                  text: "Reorgs are handled correctly. Only finalized state is shown as final.",
                },
              ].map((f, i) => (
                <Reveal key={f.title} delay={0.12 + i * 0.05}>
                  <div className="flex items-start gap-3 rounded-xl border border-white/8 bg-ink-800/40 p-5">
                    <f.icon className="mt-0.5 h-5 w-5 shrink-0 text-nova-violetSoft" />
                    <div>
                      <h4 className="text-sm font-semibold text-mist-100">{f.title}</h4>
                      <p className="mt-1 text-sm leading-relaxed text-mist-400">{f.text}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
