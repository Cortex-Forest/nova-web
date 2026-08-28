"use client";

import { useEffect, useRef } from "react";

type Node = { x: number; y: number; r: number; vx: number; vy: number };
type Edge = { a: number; b: number };

/**
 * 区块链节点网络可视化（Canvas）。
 * 概念：Validator 节点 + 点对点连接（Gossip/DAG 传播）的抽象表达。
 * - 惰性渲染 + reduced-motion 降级
 * - 节点间连线脉冲表示数据传播
 */
export function NodeNetwork({
  className,
  nodeCount = 26,
  linkDistance = 150,
}: {
  className?: string;
  nodeCount?: number;
  linkDistance?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    let running = false;
    let nodes: Node[] = [];
    let edges: Edge[] = [];

    const build = (w: number, h: number) => {
      const isMobile = w < 768;
      const count = isMobile ? Math.floor(nodeCount * 0.55) : nodeCount;
      // 确定性种子（同一次挂载内稳定）
      let seed = 42;
      const rnd = () => {
        seed = (seed * 9301 + 49297) % 233280;
        return seed / 233280;
      };
      nodes = Array.from({ length: count }, () => ({
        x: rnd() * w,
        y: h * 0.2 + rnd() * h * 0.6,
        r: rnd() * 2.4 + 1.6,
        vx: (rnd() - 0.5) * 0.18,
        vy: (rnd() - 0.5) * 0.18,
      }));
      // 近邻连边（模拟 P2P 局部连接）
      edges = [];
      const maxDist = isMobile ? linkDistance * 0.8 : linkDistance;
      for (let i = 0; i < nodes.length; i++) {
        let links = 0;
        for (let j = i + 1; j < nodes.length && links < 3; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          if (Math.hypot(dx, dy) < maxDist) {
            edges.push({ a: i, b: j });
            links++;
          }
        }
      }
    };

    // 脉冲沿边传播
    let pulse = 0;

    const draw = (t: number) => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);

      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < -20) n.x = w + 20;
        if (n.x > w + 20) n.x = -20;
        if (n.y < h * 0.1) n.y = h * 0.1 + 2;
        if (n.y > h * 0.9) n.y = h * 0.9 - 2;
      }

      // 边
      for (const e of edges) {
        const a = nodes[e.a];
        const b = nodes[e.b];
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = "rgba(148, 163, 184, 0.14)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // 脉冲（数据传播）
      pulse = (pulse + 0.012) % 1;
      const pulseEdge = edges[Math.floor(pulse * edges.length)];
      if (pulseEdge) {
        const a = nodes[pulseEdge.a];
        const b = nodes[pulseEdge.b];
        const k = (t / 500) % 1;
        const x = a.x + (b.x - a.x) * k;
        const y = a.y + (b.y - a.y) * k;
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(34, 211, 238, 0.8)";
        ctx.fill();
      }

      // 节点
      for (const n of nodes) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(160, 190, 255, 0.55)";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * 2.6, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(34, 211, 238, 0.18)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      raf = requestAnimationFrame(draw);
    };

    const drawStatic = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);
      for (const e of edges) {
        const a = nodes[e.a];
        const b = nodes[e.b];
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = "rgba(148, 163, 184, 0.12)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      for (const n of nodes) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(160, 190, 255, 0.45)";
        ctx.fill();
      }
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build(w, h);
      if (reduce) drawStatic();
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !running) {
            running = true;
            if (reduce) drawStatic();
            else raf = requestAnimationFrame(draw);
          } else if (!e.isIntersecting && running) {
            running = false;
            cancelAnimationFrame(raf);
          }
        }
      },
      { threshold: 0.05 },
    );

    resize();
    io.observe(canvas);
    const ro = new ResizeObserver(() => {
      resize();
      if (reduce) drawStatic();
    });
    ro.observe(canvas);

    return () => {
      io.disconnect();
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [nodeCount, linkDistance]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      style={{ width: "100%", height: "100%" }}
    />
  );
}
