"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowRight, Play, Server } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { GridBackground } from "@/components/visual/GridBackground";
import { GlowOrb } from "@/components/visual/GlowOrb";
import { NodeNetwork } from "@/components/visual/NodeNetwork";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden pt-24 pb-20">
      {/* 背景层 */}
      <GridBackground fade />
      <GlowOrb color="cyan" className="left-[8%] top-[12%] h-[420px] w-[420px]" />
      <GlowOrb color="violet" className="right-[6%] top-[30%] h-[380px] w-[380px]" />
      <GlowOrb color="magenta" className="bottom-[10%] left-[40%] h-[300px] w-[520px]" />

      {/* 节点网络视觉 */}
      <div className="absolute inset-0 opacity-70 md:opacity-90">
        <NodeNetwork className="h-full w-full" nodeCount={30} linkDistance={170} />
      </div>

      <motion.div
        variants={reduce ? undefined : container}
        initial={reduce ? false : "hidden"}
        animate={reduce ? undefined : "show"}
        className="relative z-10 mx-auto w-full max-w-6xl px-5 sm:px-8 lg:px-12"
      >
        <motion.div variants={reduce ? undefined : item} className="mb-6">
          <Badge tone="cyan" className="shadow-glow">
            <span className="mr-1 inline-block h-1.5 w-1.5 animate-pulse-slow rounded-full bg-nova-cyan" />
            Nova Layer1 · {process.env.NEXT_PUBLIC_NETWORK_LABEL ?? "Testnet"}
          </Badge>
        </motion.div>

        <motion.h1
          variants={reduce ? undefined : item}
          className="font-display text-[2.6rem] font-semibold leading-[1.08] tracking-tight text-mist-100 text-balance sm:text-6xl lg:text-7xl"
        >
          Next Generation
          <br />
          <span className="text-gradient">Decentralized</span>
          <br />
          Infrastructure
        </motion.h1>

        <motion.p
          variants={reduce ? undefined : item}
          className="mt-6 max-w-xl text-base leading-relaxed text-mist-400 text-pretty sm:text-lg"
        >
          Nova is an independent Layer1 blockchain built for the open web — with
          high-performance execution, decentralized storage, decentralized
          compute, a gaming ecosystem, and a node network anyone can join.
        </motion.p>

        <motion.div
          variants={reduce ? undefined : item}
          className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
        >
          <Button href="/developers#testnet" size="lg">
            <Play className="h-4 w-4" />
            Launch Testnet
          </Button>
          <Button href="/node" variant="secondary" size="lg">
            <Server className="h-4 w-4" />
            Run Node
          </Button>
          <Button href="/developers" variant="ghost" size="lg">
            Build On Nova
            <ArrowRight className="h-4 w-4" />
          </Button>
        </motion.div>

        {/* 能力关键词 */}
        <motion.div
          variants={reduce ? undefined : item}
          className="mt-14 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs font-medium tracking-wide text-mist-500 sm:text-sm"
        >
          {["Layer1 Blockchain", "Storage", "Compute", "Gaming", "Node Network"].map(
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
