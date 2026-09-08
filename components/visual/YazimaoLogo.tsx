import { cn } from "@/lib/utils";
import { YazimaoSymbol } from "./YazimaoSymbol";

/**
 * YAZIMAO Logo 组合（Primary Logo：Symbol + 字标）
 *
 * - 默认字标：YAZIMAO
 * - 中文字标：鸭子毛（用于中文页面 / 品牌资料：text="鸭子毛"）
 * - 使用方负责外层 <Link> / aria-label 与 hover 动效；此处只输出图形+文字。
 */
export function YazimaoLogo({
  symbolClassName = "h-8 w-8",
  textClassName = "text-lg",
  text = "YAZIMAO",
  className,
}: {
  symbolClassName?: string;
  textClassName?: string;
  /** 字标内容：默认 "YAZIMAO"；中文品牌传 "鸭子毛" */
  text?: string;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <YazimaoSymbol className={symbolClassName} />
      <span
        className={cn(
          "font-display font-semibold tracking-tight text-white",
          textClassName,
        )}
      >
        {text}
      </span>
    </span>
  );
}
