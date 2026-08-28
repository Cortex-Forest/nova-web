import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * 布局容器。Mobile-first：小屏留 20px 边距，大屏居中限宽。
 */
export function Container({
  className,
  children,
  size = "default",
}: {
  className?: string;
  children: ReactNode;
  size?: "default" | "narrow" | "wide";
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-5 sm:px-8 lg:px-12",
        size === "narrow" && "max-w-3xl",
        size === "default" && "max-w-6xl",
        size === "wide" && "max-w-7xl",
        className,
      )}
    >
      {children}
    </div>
  );
}
