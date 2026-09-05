import Link from "next/link";
import { ArrowRight, Github, MessageCircle, Twitter, type LucideIcon } from "lucide-react";
import { footerNav } from "@/config/nav";
import { siteConfig } from "@/config/site";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { NovaMark } from "@/components/visual/NovaMark";

type Social = { label: string; href: string; icon: LucideIcon };

// 仅保留已提供真实地址的社区链接；项目方未提供前一律为空 → 渲染 Coming Soon
const socials: Social[] = (
  [
    { label: "GitHub", href: siteConfig.links.github, icon: Github },
    { label: "X / Twitter", href: siteConfig.links.x, icon: Twitter },
    { label: "Discord", href: siteConfig.links.discord, icon: MessageCircle },
  ] as { label: string; href: string | null; icon: LucideIcon }[]
).filter((s): s is Social => s.href !== null);

export function Footer() {
  return (
    <footer className="relative border-t border-white/8 bg-ink-900">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-nova-cyan/30 to-transparent" />
      <Container className="py-14 md:py-20">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <NovaMark className="h-9 w-9" />
              <span className="font-display text-xl font-semibold text-white">
                Nova
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-mist-500">
              An independent Layer1 blockchain — high-performance infrastructure,
              decentralized storage &amp; compute, gaming ecosystem, and a global
              node network.
            </p>
            {/* V1.1：Early Access 生态参与预登记入口 */}
            <div className="mt-6">
              <Button href="/early-access" variant="secondary" size="sm">
                Join Early Access
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            {socials.length > 0 ? (
              <div className="mt-6 flex items-center gap-2">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-mist-400 transition-colors hover:border-nova-cyan/40 hover:text-nova-cyanSoft"
                  >
                    <s.icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            ) : (
              <div className="mt-6">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-xs text-mist-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400/80" />
                  Community — Coming Soon
                </span>
              </div>
            )}
          </div>

          {/* Link columns */}
          {(
            [
              { title: "Network", items: footerNav.network },
              { title: "Developers", items: footerNav.developers },
              { title: "Token", items: footerNav.token },
            ] as const
          ).map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-mist-500">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {col.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="link-underline text-sm text-mist-400 transition-colors hover:text-white"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/8 pt-6 text-xs text-mist-500 sm:flex-row">
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-6">
            <p>
              © {new Date().getFullYear()} {siteConfig.name} Layer1. All rights
              reserved.
            </p>
            {siteConfig.links.websiteRepo && (
              <a
                href={siteConfig.links.websiteRepo}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline transition-colors hover:text-white"
              >
                Website source
              </a>
            )}
          </div>
          <p className="tabular">
            Status: <span className="text-mist-300">{siteConfig.networkLabel}</span>
          </p>
        </div>
      </Container>
    </footer>
  );
}
