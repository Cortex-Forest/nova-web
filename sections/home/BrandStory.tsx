import { Feather } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/visual/Reveal";

/**
 * 首页 02 —— Brand Story（品牌故事）
 *
 * 核心理念：一根鸭毛很轻；一个人的创造也很小；但无数人的创造被记录、连接、
 * 验证并汇聚起来，微小的贡献可以形成一个属于所有人的公共网络。
 * 英文保持克制，不直译得生硬。
 */
const flow = [
  "Small creation",
  "Connection",
  "Verification",
  "Permanent record",
  "Shared value",
];

export function BrandStory() {
  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[480px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(167,139,250,0.08),transparent_70%)] blur-2xl" />
      <Container className="relative">
        <SectionHeading
          eyebrow="Why the name"
          title={
            <>
              A single creation may be{" "}
              <span className="text-gradient">small</span>. Together, creations
              can build something much bigger.
            </>
          }
          description={
            <>
              <span className="font-display text-mist-200">
                A feather is light — and so is a single creation.
              </span>{" "}
              A piece of writing, a song, a drawing, a video, an idea: each one
              may seem small. But when many people’s creations are recorded,
              connected, verified and preserved, small contributions can form a
              public network that belongs to everyone.
            </>
          }
        />

        <div className="mx-auto max-w-3xl">
          <Reveal delay={0.1}>
            <div className="flex flex-wrap items-center justify-center gap-2 rounded-2xl border border-white/8 bg-ink-800/40 p-4 sm:gap-3 sm:p-5">
              <Feather className="h-4 w-4 shrink-0 text-nova-cyanSoft" aria-hidden="true" />
              {flow.map((step, i) => (
                <span key={step} className="flex items-center gap-2 sm:gap-3">
                  <span className="text-sm font-medium text-mist-200">{step}</span>
                  {i < flow.length - 1 && (
                    <span aria-hidden="true" className="text-mist-600">
                      →
                    </span>
                  )}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
