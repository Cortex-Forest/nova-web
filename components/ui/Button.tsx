import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-nova-gradient text-ink-950 font-semibold shadow-glow hover:shadow-glow hover:brightness-110 active:brightness-95",
  secondary:
    "bg-white/5 text-mist-100 border border-white/15 backdrop-blur-sm hover:bg-white/10 hover:border-white/25",
  ghost: "text-mist-300 hover:text-white",
};

const sizeStyles: Record<Size, string> = {
  sm: "h-9 px-4 text-sm gap-1.5",
  md: "h-11 px-6 text-sm gap-2",
  lg: "h-[52px] px-8 text-base gap-2.5",
};

type BaseProps = {
  variant?: Variant;
  size?: Size;
  href?: string;
  className?: string;
  children: ReactNode;
};

type ButtonAsButton = BaseProps &
  Omit<ComponentPropsWithoutRef<"button">, keyof BaseProps> & { href?: undefined };

type ButtonAsLink = BaseProps &
  Omit<ComponentPropsWithoutRef<"a">, keyof BaseProps> & { href: string };

type ButtonProps = ButtonAsButton | ButtonAsLink;

/**
 * 统一按钮。href 存在时渲染为 Link，否则为 button。
 */
export function Button({
  variant = "primary",
  size = "md",
  href,
  className,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center rounded-xl transition-all duration-300",
    "select-none whitespace-nowrap focus-visible:outline-2",
    variantStyles[variant],
    sizeStyles[size],
    className,
  );

  if (href) {
    const isExternal = href.startsWith("http");
    const anchorProps = props as ComponentPropsWithoutRef<"a">;
    if (isExternal) {
      return (
        <a
          href={href}
          className={classes}
          target="_blank"
          rel="noopener noreferrer"
          {...anchorProps}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} {...anchorProps}>
        {children}
      </Link>
    );
  }

  const buttonProps = props as ComponentPropsWithoutRef<"button">;
  return (
    <button className={classes} {...buttonProps}>
      {children}
    </button>
  );
}
