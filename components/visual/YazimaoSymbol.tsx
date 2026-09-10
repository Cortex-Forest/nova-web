import Image from "next/image";
import { cn } from "@/lib/utils";

/** 羽毛 logo 图片的原生尺寸（public/logo-feather.png） */
const LOGO_WIDTH = 380;
const LOGO_HEIGHT = 402;

/**
 * YAZIMAO Logo —— 统一羽毛图形
 *
 * 品牌图形统一使用图片资产 `public/logo-feather.png`
 * （白色线条羽毛，透明背景；按尺寸等比缩放）。
 *
 * - 尺寸由 `className` 控制（例如 `h-8 w-8`）；默认 `object-contain` 保持比例。
 * - `loading="eager"`：导航栏 logo 在首屏，避免懒加载晚出现。
 * - 透明背景，适配深色站点；请勿在浅色背景上直接使用。
 * - 禁止卡通鸭/鸭头/鸭嘴/Meme 元素；鸭毛是隐喻，不是吉祥物。
 */
export function YazimaoSymbol({
  className = "h-8 w-8",
}: {
  className?: string;
}) {
  return (
    <Image
      src="/logo-feather.png"
      alt=""
      aria-hidden="true"
      width={LOGO_WIDTH}
      height={LOGO_HEIGHT}
      // 当前调用尺寸：导航 32px / 页脚 36px / 404 56px → 取最大值。
      // 显式 sizes 避免浏览器按 100vw 预加载未使用的大尺寸变体（控制台 preload 警告）。
      sizes="56px"
      loading="eager"
      className={cn("object-contain", className)}
    />
  );
}
