import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { GridBackground } from "@/components/visual/GridBackground";
import { GlowOrb } from "@/components/visual/GlowOrb";
import { Reveal } from "@/components/visual/Reveal";
import { Badge } from "@/components/ui/Badge";

/**
 * 子页面页头（统一 Hero）。
 */
export function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden pt-36 pb-16 md:pt-44 md:pb-24">
      <GridBackground fade />
      <GlowOrb className="left-1/2 top-[-140px] h-[420px] w-[720px] -translate-x-1/2" />
      <Container className="relative">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <Badge tone="cyan" className="mb-5">
              {eyebrow}
            </Badge>
          </Reveal>
          <Reveal delay={0.06}>
            <h1 className="font-display text-4xl font-semibold tracking-tight text-mist-100 text-balance sm:text-5xl lg:text-6xl">
              {title}
            </h1>
          </Reveal>
          {description && (
            <Reveal delay={0.12}>
              <p className="mt-6 text-base leading-relaxed text-mist-400 text-pretty sm:text-lg">
                {description}
              </p>
            </Reveal>
          )}
          {children && <Reveal delay={0.18}>{children}</Reveal>}
        </div>
      </Container>
    </section>
  );
}
