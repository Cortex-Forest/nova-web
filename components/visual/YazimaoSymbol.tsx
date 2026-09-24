import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * 品牌图形图片的原生尺寸（public/logo-yazimao.png = 512×512，已按内容裁切、透明）
 * 源文件与生成脚本见 brand/（参考图抠像 → brand/tools/build-assets.py）。
 */
const LOGO_WIDTH = 512;
const LOGO_HEIGHT = 512;

/**
 * YAZIMAO Logo —— 统一品牌图形
 *
 * 品牌图形统一使用图片资产 `public/logo-yazimao.png`
 * （倾斜轨道环：银白双弧 + 右上青色尖端；透明背景；按尺寸等比缩放）。
 *
 * - 尺寸由 `className` 控制（例如 `h-8 w-8`）；默认 `object-contain` 保持比例。
 * - `loading="eager"`：导航栏 logo 在首屏，避免懒加载晚出现。
 * - 透明背景，适配深色站点；请勿在浅色背景上直接使用。
 * - 禁止卡通鸭/鸭头/鸭嘴/Meme 元素；品牌图形是「开放的环」，不是吉祥物。
 */
export function YazimaoSymbol({
  className = "h-8 w-8",
}: {
  className?: string;
}) {
  return (
    <Image
      src="/logo-yazimao.png"
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
