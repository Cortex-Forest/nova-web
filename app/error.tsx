"use client";

import { useEffect } from "react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

/**
 * 全局错误边界 —— 渲染期/路由错误时降级展示，不出现白屏。
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 上报到监控（预留接口）
    console.error("[Nova Web] unhandled error", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-ink-950 text-mist-200">
        <Container className="flex min-h-screen flex-col items-center justify-center py-24 text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-nova-cyanSoft">
            Unexpected error
          </p>
          <h1 className="mt-4 font-display text-4xl font-semibold text-mist-100">
            Something went wrong
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-mist-400">
            An unexpected error occurred while rendering this page. Please try
            again.
          </p>
          <div className="mt-8">
            <Button onClick={reset}>Try again</Button>
          </div>
        </Container>
      </body>
    </html>
  );
}
