import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/visual/Reveal";

/**
 * 玻璃卡片：hover 提升 + 顶部渐变描边。
 */
export function Card({
  className,
  children,
  delay = 0,
  hover = true,
}: {
  className?: string;
  children: ReactNode;
  delay?: number;
  hover?: boolean;
}) {
  return (
    <Reveal delay={delay} className="h-full">
      <div
        className={cn(
          "group relative h-full overflow-hidden rounded-2xl border border-white/8 bg-ink-800/50 p-6",
          "transition-all duration-300",
          hover && "hover:-translate-y-1 hover:border-white/18 hover:bg-ink-800/80 hover:shadow-card",
          className,
        )}
      >
        {/* 顶部渐变细线 */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-nova-cyan/40 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-100" />
        {children}
      </div>
    </Reveal>
  );
}
