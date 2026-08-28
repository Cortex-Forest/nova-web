import { cn } from "@/lib/utils";

/**
 * 科技网格背景（纯 CSS，性能友好）。
 */
export function GridBackground({
  className,
  fade = true,
}: {
  className?: string;
  fade?: boolean;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 grid-bg",
        fade && "grid-bg-fade",
        className,
      )}
    />
  );
}
