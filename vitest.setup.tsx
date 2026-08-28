import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";
import React from "react";

// ---- next/link → 纯 <a>（避免依赖 Next Router 上下文） ----
vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string | { pathname: string };
    children: React.ReactNode;
  }) => {
    const url = typeof href === "string" ? href : href.pathname;
    return React.createElement("a", { href: url, ...props }, children);
  },
}));

// ---- next/navigation → 固定 pathname ----
vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

// ---- framer-motion → 同步渲染（避免 jsdom 动画计时导致测试不稳定） ----
vi.mock("framer-motion", () => {
  // 剥离动画相关 props，避免 React 对未知 DOM 属性的警告
  const ANIMATION_PROPS = new Set([
    "initial",
    "animate",
    "exit",
    "whileInView",
    "whileHover",
    "whileTap",
    "viewport",
    "transition",
    "variants",
    "layout",
    "layoutId",
  ]);
  const create = (tag: string) => {
    function MotionMock({ children, ...props }: { children?: React.ReactNode }) {
      const clean: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(props)) {
        if (!ANIMATION_PROPS.has(k)) clean[k] = v;
      }
      return React.createElement(tag, clean, children);
    }
    MotionMock.displayName = `Motion(${tag})`;
    return MotionMock;
  };
  const motion: Record<string, (p: object) => React.ReactElement> = new Proxy(
    {},
    {
      get: (_t, tag: string) => create(String(tag)),
    },
  ) as never;
  function MockAnimatePresence({ children }: { children?: React.ReactNode }) {
    return <>{children}</>;
  }
  MockAnimatePresence.displayName = "AnimatePresence";
  return {
    motion,
    AnimatePresence: MockAnimatePresence,
    useReducedMotion: () => false,
  };
});

// ---- jsdom 缺少的 DOM API 最小补丁 ----
if (typeof window !== "undefined" && !window.matchMedia) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }),
  });
}

if (typeof window !== "undefined" && !window.scrollTo) {
  Object.defineProperty(window, "scrollTo", {
    writable: true,
    value: vi.fn(),
  });
}
