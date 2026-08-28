/**
 * 通用工具函数
 */

/** 合并 className（无 clsx/tailwind-merge 依赖的轻量实现） */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/** 从环境变量读取网络标签，用于页脚/状态徽标 */
export function networkLabel(): string {
  return process.env.NEXT_PUBLIC_NETWORK_LABEL ?? "Testnet";
}

/** 安全延迟（用于交错入场动画） */
export const stagger = (i: number, base = 0.08, start = 0.05) =>
  start + i * base;
