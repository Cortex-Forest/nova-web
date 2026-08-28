import type { Metadata } from "next";
import { pageSeo } from "@/lib/seo";
import { siteConfig } from "@/config/site";
import { Hero } from "@/sections/home/Hero";
import { Pillars } from "@/sections/home/Pillars";
import { TechPreview } from "@/sections/home/TechPreview";
import { NodeSection } from "@/sections/home/NodeSection";
import { GamingSection } from "@/sections/home/GamingSection";
import { RoadmapPreview } from "@/sections/home/RoadmapPreview";
import { CTA } from "@/sections/home/CTA";

// 首页使用布局层默认 title；此处补充 canonical（域名未设置时自动省略）
export const metadata: Metadata = pageSeo("/", siteConfig.description);

export default function HomePage() {
  return (
    <>
      <Hero />
      <Pillars />
      <TechPreview />
      <NodeSection />
      <GamingSection />
      <RoadmapPreview />
      <CTA />
    </>
  );
}
