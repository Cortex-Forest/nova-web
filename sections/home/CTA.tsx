import { ArrowRight, Github, Server } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/visual/Reveal";
import { GlowOrb } from "@/components/visual/GlowOrb";
import { GridBackground } from "@/components/visual/GridBackground";
import { siteConfig } from "@/config/site";

export function CTA() {
  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      <GridBackground fade />
      <GlowOrb color="cyan" className="left-1/2 top-1/2 h-[440px] w-[720px] -translate-x-1/2 -translate-y-1/2" />
      <Container className="relative">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-semibold tracking-tight text-mist-100 text-balance sm:text-5xl">
              Be part of the <span className="text-gradient">next generation</span>
            </h2>
            <p className="mt-5 text-base leading-relaxed text-mist-400 text-pretty sm:text-lg">
              Whether you build, run a node, or simply explore — Nova is open to
              everyone. The testnet is the first step.
            </p>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Button href="/developers#testnet" size="lg">
                Launch Testnet
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button href="/node" variant="secondary" size="lg">
                <Server className="h-4 w-4" />
                Run a Node
              </Button>
              {siteConfig.links.github ? (
                <Button href={siteConfig.links.github} variant="ghost" size="lg">
                  <Github className="h-4 w-4" />
                  View GitHub
                </Button>
              ) : (
                <Button variant="ghost" size="lg" disabled>
                  <Github className="h-4 w-4" />
                  GitHub — Coming Soon
                </Button>
              )}
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
