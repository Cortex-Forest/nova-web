"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowRight, Feather, PenLine } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { GridBackground } from "@/components/visual/GridBackground";
import { GlowOrb } from "@/components/visual/GlowOrb";
import { NodeNetwork } from "@/components/visual/NodeNetwork";
import { siteConfig } from "@/config/site";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

/**
 * 首页 01 —— Hero（品牌第一屏）
 * 克制、人文、不堆砌技术术语；技术内容放到 Technology 页面。
 */
export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden pt-24 pb-20">
      {/* 背景层（网络感视觉，无文字） */}
      <GridBackground fade />
      <GlowOrb color="cyan" className="left-[8%] top-[12%] h-[420px] w-[420px]" />
      <GlowOrb color="violet" className="right-[6%] top-[30%] h-[380px] w-[380px]" />
      <div className="absolute inset-0 opacity-50 md:opacity-70">
        <NodeNetwork className="h-full w-full" nodeCount={26} linkDistance={180} />
      </div>

      <motion.div
        variants={reduce ? undefined : container}
        initial={reduce ? false : "hidden"}
        animate={reduce ? undefined : "show"}
        className="relative z-10 mx-auto w-full max-w-6xl px-5 sm:px-8 lg:px-12"
      >
        <motion.div variants={reduce ? undefined : item} className="mb-6">
          <Badge tone="cyan" className="shadow-glow">
            <Feather className="mr-1.5 h-3.5 w-3.5 text-nova-cyanSoft" aria-hidden="true" />
            {siteConfig.nameZh} · {siteConfig.name}
          </Badge>
        </motion.div>

        <motion.h1
          variants={reduce ? undefined : item}
          className="font-display text-[2.9rem] font-semibold leading-[1.05] tracking-tight text-mist-100 text-balance sm:text-6xl lg:text-[5.5rem]"
        >
          Every Creation
          <br />
          <span className="text-gradient">Matters.</span>
        </motion.h1>

        <motion.p
          variants={reduce ? undefined : item}
          className="mt-6 max-w-xl text-base leading-relaxed text-mist-400 text-pretty sm:text-lg"
        >
          {siteConfig.positioning} A single creation may be small — together,
          creations can build something much bigger.
        </motion.p>

        <motion.div
          variants={reduce ? undefined : item}
          className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
        >
          <Button href="/technology" size="lg">
            Explore the Network
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button href="/early-access#register" variant="secondary" size="lg">
            <PenLine className="h-4 w-4" />
            Become a Creator
          </Button>
        </motion.div>

        {/* 克制的人文关键词（不用技术术语） */}
        <motion.div
          variants={reduce ? undefined : item}
          className="mt-14 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs font-medium tracking-wide text-mist-500 sm:text-sm"
        >
          {["Writing", "Music", "Art", "Video", "Ideas", "Digital Works"].map(
            (k) => (
              <span key={k} className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-nova-cyan/70" />
                {k}
              </span>
            ),
          )}
        </motion.div>
      </motion.div>

      {/* 底部渐变分隔 */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-ink-950" />
    </section>
  );
}
