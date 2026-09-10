import type { Metadata } from "next";
import {
  Activity,
  ChevronDown,
  Coins,
  Feather,
  Server,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { pageSeo } from "@/lib/seo";
import { PageHeader } from "@/components/visual/PageHeader";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/visual/Reveal";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = pageSeo(
  "/faq",
  "Frequently asked questions about YAZIMAO — what it is, current network status, node participation, and the token information policy.",
  "FAQ",
);

type FaqItem = { q: string; a: string };
type FaqGroup = { title: string; icon: LucideIcon; items: FaqItem[] };

const groups: FaqGroup[] = [
  {
    title: "What is YAZIMAO?",
    icon: Feather,
    items: [
      {
        q: "What is YAZIMAO?",
        a: "YAZIMAO is a public network for human creation. Writing, music, art, video, ideas and digital works are recorded, connected, verified and preserved together, so that many small individual creations can add up to something much bigger.",
      },
      {
        q: "What does “Every Creation Matters.” mean?",
        a: "It is the design principle of the network. A single creation may be small — a note, a sketch, a line of code — but if it is recorded and verifiable, it can be connected to the work of others and become part of something larger.",
      },
      {
        q: "Is YAZIMAO open source?",
        a: "Yes. The protocol, node software and tooling are developed in the open. You can read the code, audit the design decisions, open issues and contribute through GitHub.",
      },
      {
        q: "Why does the repository use a different codename?",
        a: "YAZIMAO is the public brand. The open-source repository keeps the project's internal development codename (Nova) for historical and technical continuity — internal identifiers, genesis parameters and the repository name are intentionally not renamed.",
      },
      {
        q: "Who is YAZIMAO for?",
        a: "Creators working in writing, music, art, video and ideas; operators who want to run nodes; and developers who want to build applications on the network.",
      },
    ],
  },
  {
    title: "Network status",
    icon: Activity,
    items: [
      {
        q: "Is YAZIMAO live?",
        a: `Not yet. ${siteConfig.name} is in protocol development: there is no live mainnet and no public testnet. The site status label always reflects this honestly — currently “${siteConfig.networkLabel}”.`,
      },
      {
        q: "When will the mainnet launch?",
        a: "No launch date has been announced. Milestones are published on the roadmap when they are reached. We do not publish dates that cannot be stood behind.",
      },
      {
        q: "What can I do today?",
        a: "Join the Genesis Program, follow the official channels, read the technology and developer documentation, and follow the open-source repository.",
      },
    ],
  },
  {
    title: "Node participation",
    icon: Server,
    items: [
      {
        q: "Can I run a node now?",
        a: "Not publicly yet. Node participation is planned for testnet and beyond. Today there is no public testnet to join, so nothing can be earned by running a node.",
      },
      {
        q: "What kinds of nodes are planned?",
        a: "Mobile and PC participation is the intended model described on the Node page. Implementation details may change as the protocol is built; the documentation is updated as it does.",
      },
      {
        q: "Do node operators earn rewards?",
        a: "No reward program is live or promised today. Any future incentive design would be published openly with its own terms, eligibility and participation rules — nothing on this site guarantees rewards.",
      },
    ],
  },
  {
    title: "Token information policy",
    icon: Coins,
    items: [
      {
        q: "Is there a token?",
        a: "Token design work (economy, distribution, incentives) is published as protocol research under Token. There is no token sale, no public offering, and no financial product. Design work is not a promise of value, allocation, or future market activity.",
      },
      {
        q: "Are Genesis Points a token?",
        a: "No. Genesis Points are participation points only. They do not represent, guarantee, or promise any future token allocation, and they are not a tradable asset.",
      },
      {
        q: "Will I receive an airdrop?",
        a: "No airdrop or allocation is promised. The Genesis Program tracks early participation with points; whether and how participation may matter later is undecided, and any decision would be announced through official channels only.",
      },
      {
        q: "Is anything on this site financial advice?",
        a: "No. Nothing on this site is financial, legal, or investment advice, and nothing here is an offer or solicitation of any kind.",
      },
    ],
  },
  {
    title: "Community and safety",
    icon: ShieldCheck,
    items: [
      {
        q: "Where are the official channels?",
        a: "X, Telegram and GitHub are the official channels, listed together on the Community page. Anything else should be treated as unofficial until it is listed there.",
      },
      {
        q: "How do I report a problem or ask a question?",
        a: "Open an issue on GitHub, or raise it in the official Telegram group. We never ask for seed phrases, private keys, or payments of any kind — anyone who does is not us.",
      },
    ],
  },
];

/** FAQPage 结构化数据（仅使用站内已发布的诚实口径） */
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: groups
    .flatMap((g) => g.items)
    .map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
};

export default function FaqPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <PageHeader
        eyebrow="FAQ"
        title={
          <>
            Frequently asked <span className="text-gradient">questions</span>
          </>
        }
        description="Honest answers about what YAZIMAO is, what is live today, how node participation works, and the token information policy."
      >
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button href="/community" size="lg">
            Official channels
          </Button>
          <Button href="/roadmap" variant="secondary" size="lg">
            View the roadmap
          </Button>
        </div>
      </PageHeader>

      <section className="relative pb-24 md:pb-32">
        <Container size="narrow">
          <div className="space-y-12">
            {groups.map((group, gi) => (
              <Reveal key={group.title} delay={gi * 0.04}>
                <div>
                  <div className="mb-5 flex items-center gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-nova-cyanSoft">
                      <group.icon className="h-4.5 w-4.5" aria-hidden="true" />
                    </span>
                    <h2 className="font-display text-xl font-semibold tracking-tight text-mist-100 sm:text-2xl">
                      {group.title}
                    </h2>
                  </div>
                  <div className="space-y-3">
                    {group.items.map((item) => (
                      <details
                        key={item.q}
                        className="group rounded-xl border border-white/8 bg-ink-800/40 px-5 py-4 transition-colors hover:border-white/15 open:border-white/15"
                      >
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium text-mist-100 [&::-webkit-details-marker]:hidden">
                          {item.q}
                          <ChevronDown
                            className="h-4 w-4 shrink-0 text-mist-500 transition-transform duration-200 group-open:rotate-180"
                            aria-hidden="true"
                          />
                        </summary>
                        <p className="mt-3 text-sm leading-relaxed text-mist-400 text-pretty">
                          {item.a}
                        </p>
                      </details>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* 诚实声明 */}
          <Reveal delay={0.1}>
            <Card
              hover={false}
              className="mt-12 border-white/10 bg-ink-800/60 p-6 md:p-8"
            >
              <h2 className="font-display text-lg font-semibold text-mist-100">
                Still unresolved? Ask us.
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-mist-400 text-pretty">
                {siteConfig.name} is in protocol development — not a live mainnet
                or public testnet. If something on this site is unclear or out of
                date, raise it in an official channel or open an issue on GitHub;
                corrections are welcome.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button href="/community" variant="secondary" size="sm">
                  Community
                </Button>
                {siteConfig.links.github && (
                  <Button href={siteConfig.links.github} variant="ghost" size="sm">
                    GitHub
                  </Button>
                )}
              </div>
            </Card>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
