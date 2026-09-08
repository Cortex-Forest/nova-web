import type { Metadata } from "next";
import { pageSeo } from "@/lib/seo";
import { siteConfig } from "@/config/site";
import { Hero } from "@/sections/home/Hero";
import { BrandStory } from "@/sections/home/BrandStory";
import { CreatorSection } from "@/sections/home/CreatorSection";
import { NetworkSection } from "@/sections/home/NetworkSection";
import { VerifySection } from "@/sections/home/VerifySection";
import { RecordSection } from "@/sections/home/RecordSection";
import { BelongSection } from "@/sections/home/BelongSection";
import { TechPreview } from "@/sections/home/TechPreview";
import { NodeSection } from "@/sections/home/NodeSection";
import { EcosystemSection } from "@/sections/home/EcosystemSection";
import { RoadmapPreview } from "@/sections/home/RoadmapPreview";
import { CTA } from "@/sections/home/CTA";

// 首页使用布局层默认 title；此处补充 canonical（域名未设置时自动省略）
export const metadata: Metadata = pageSeo("/", siteConfig.description);

export default function HomePage() {
  return (
    <>
      <Hero />
      <BrandStory />
      <CreatorSection />
      <NetworkSection />
      <VerifySection />
      <RecordSection />
      <BelongSection />
      <TechPreview />
      <NodeSection />
      <EcosystemSection />
      <RoadmapPreview />
      <CTA />
    </>
  );
}
