import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone = "cyan" | "violet" | "neutral" | "amber";

const tones: Record<Tone, string> = {
  cyan: "border-nova-cyan/30 bg-nova-cyan/10 text-nova-cyanSoft",
  violet: "border-nova-violet/30 bg-nova-violet/10 text-nova-violetSoft",
  neutral: "border-white/15 bg-white/5 text-mist-300",
  amber: "border-amber-400/30 bg-amber-400/10 text-amber-300",
};

/** 就绪度徽标（全站统一口径） */
export function ReadinessBadge({
  label,
  tone = "neutral",
  dot = true,
  className,
}: {
  label: string;
  tone?: Tone;
  dot?: boolean;
  className?: string;
}) {
  const dotColor =
    tone === "cyan"
      ? "bg-nova-cyan"
      : tone === "violet"
        ? "bg-nova-violet"
        : tone === "amber"
          ? "bg-amber-400"
          : "bg-mist-400";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium tracking-wide",
        tones[tone],
        className,
      )}
    >
      {dot && <span className={cn("h-1.5 w-1.5 rounded-full", dotColor)} />}
      {label}
    </span>
  );
}

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium tracking-wide",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
