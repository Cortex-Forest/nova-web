import { cn } from "@/lib/utils";

/**
 * 柔和光晕（装饰用，非发光文字）。
 * 通过大半径模糊渐变营造"深空"氛围。
 */
export function GlowOrb({
  className,
  color = "cyan",
}: {
  className?: string;
  color?: "cyan" | "violet" | "magenta";
}) {
  const palette = {
    cyan: "bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.16),transparent_70%)]",
    violet: "bg-[radial-gradient(circle_at_center,rgba(167,139,250,0.16),transparent_70%)]",
    magenta: "bg-[radial-gradient(circle_at_center,rgba(232,121,249,0.12),transparent_70%)]",
  };
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute rounded-full blur-2xl", palette[color], className)}
    />
  );
}
