import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/visual/Reveal";
import { YazimaoSymbol } from "@/components/visual/YazimaoSymbol";
import { siteConfig } from "@/config/site";

/**
 * 首页 02 —— Brand Story（品牌叙事）
 *
 * 叙事主脊（V2 重构，单一事实源：config/site.ts）：
 *   1) 名称来源：一根羽毛很轻，一个人的创造也很小；轻的东西容易被忽略，
 *      但当足够多的创造汇聚起来，它们就有了分量。
 *   2) 标识含义：开放的环，没有中心也没有封口 —— 永远给后来者留一个缺口。
 *   3) 我们在建什么：社区所有的 Layer 1，让创造被记录、连接、验证并被共同持有。
 */
const flow = [
  "A creation",
  "Recorded",
  "Verified",
  "Connected",
  "Held in common",
];

export function BrandStory() {
  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[480px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(167,139,250,0.08),transparent_70%)] blur-2xl" />
      <Container className="relative">
        <SectionHeading
          eyebrow="Why the name · Why the ring"
          title={
            <>
              One small creation. One {" "}
              <span className="text-gradient">open ring</span>.
            </>
          }
          description={
            <>
              <span className="font-display text-mist-200">
                {siteConfig.story}
              </span>{" "}
              {siteConfig.markMeaning}
            </>
          }
        />

        <div className="mx-auto max-w-3xl">
          <Reveal delay={0.1}>
            <div className="flex flex-wrap items-center justify-center gap-2 rounded-2xl border border-white/8 bg-ink-800/40 p-4 sm:gap-3 sm:p-5">
              <YazimaoSymbol className="h-4 w-4 shrink-0" />
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
