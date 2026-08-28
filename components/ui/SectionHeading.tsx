import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/visual/Reveal";
import { Badge } from "@/components/ui/Badge";

/**
 * 区块标题：徽标 + 大标题 + 描述。
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mb-12 md:mb-16",
        align === "center" && "mx-auto max-w-2xl text-center",
        align === "left" && "max-w-2xl text-left",
        className,
      )}
    >
      {eyebrow && (
        <Reveal>
          <Badge tone="cyan" className="mb-4">
            {eyebrow}
          </Badge>
        </Reveal>
      )}
      <Reveal delay={0.05}>
        <h2 className="font-display text-3xl font-semibold tracking-tight text-mist-100 text-balance sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
          {title}
        </h2>
      </Reveal>
      {description && (
        <Reveal delay={0.12}>
          <p className="mt-4 text-base leading-relaxed text-mist-400 text-pretty sm:text-lg">
            {description}
          </p>
        </Reveal>
      )}
    </div>
  );
}
