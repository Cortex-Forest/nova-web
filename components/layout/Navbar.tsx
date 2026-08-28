"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, ChevronDown, Menu, X } from "lucide-react";
import { mainNav, navGroups } from "@/config/nav";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { NovaMark } from "@/components/visual/NovaMark";
import { Button } from "@/components/ui/Button";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 路由变化时关闭移动菜单
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // 锁定 body 滚动（移动菜单打开时）+ Escape 关闭
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    if (mobileOpen) window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [mobileOpen]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-white/8 bg-ink-950/85 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <nav
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8 lg:h-[72px] lg:px-12"
        aria-label="Main"
      >
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2.5" aria-label="Nova home">
          <NovaMark className="h-8 w-8 transition-transform duration-500 group-hover:rotate-[25deg]" />
          <span className="font-display text-lg font-semibold tracking-tight text-white">
            Nova
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 lg:flex">
          <NavItem href="/" active={pathname === "/"}>
            Home
          </NavItem>
          <GroupNav active={pathname === "/technology"} />
          {mainNav
            .filter((n) => !["/technology", "/node", "/explorer"].includes(n.href))
            .map((item) => (
              <NavItem
                key={item.href}
                href={item.href}
                active={
                  pathname === item.href || pathname.startsWith(item.href + "/")
                }
              >
                {item.label}
              </NavItem>
            ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <Button href="/node" variant="ghost" size="sm">
            Run Node
          </Button>
          <Button href="/developers" size="sm">
            Build On Nova
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-mist-200 hover:bg-white/5 lg:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="border-b border-white/8 bg-ink-950/98 backdrop-blur-xl lg:hidden"
          >
            <div className="max-h-[calc(100dvh-4rem)] overflow-y-auto px-5 py-6">
              <ul className="space-y-1">
                <MobileLink href="/">Home</MobileLink>
                {mainNav.map((item) => (
                  <MobileLink key={item.href} href={item.href}>
                    {item.label}
                  </MobileLink>
                ))}
              </ul>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <Button href="/node" variant="secondary" size="md">
                  Run Node
                </Button>
                <Button href="/developers" size="md">
                  Build On Nova
                </Button>
              </div>
              <p className="mt-6 text-center text-xs text-mist-500">
                {siteConfig.name} Layer1 · {siteConfig.networkLabel}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function NavItem({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        active ? "text-white" : "text-mist-400 hover:text-white",
      )}
    >
      {children}
    </Link>
  );
}

/** 带下拉分组的导航项（Technology 入口） */
function GroupNav({ active }: { active: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className={cn(
          "flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
          active || open ? "text-white" : "text-mist-400 hover:text-white",
        )}
        aria-expanded={open}
      >
        Network
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.16 }}
            className="absolute left-0 top-full pt-2"
          >
            <div className="w-72 rounded-2xl border border-white/10 bg-ink-850/95 p-2 shadow-card backdrop-blur-xl">
              {navGroups.flatMap((g) =>
                g.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-white/5"
                  >
                    {item.icon && (
                      <span className="mt-0.5 text-nova-cyanSoft">
                        <item.icon className="h-5 w-5" />
                      </span>
                    )}
                    <span>
                      <span className="block text-sm font-medium text-mist-100 group-hover:text-white">
                        {item.label}
                      </span>
                      <span className="mt-0.5 block text-xs text-mist-500">
                        {item.description}
                      </span>
                    </span>
                  </Link>
                )),
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MobileLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(href + "/");
  return (
    <li>
      <Link
        href={href}
        className={cn(
          "flex items-center justify-between rounded-lg px-3 py-3 text-base font-medium transition-colors",
          active ? "bg-white/5 text-white" : "text-mist-300 hover:bg-white/5 hover:text-white",
        )}
      >
        {children}
        <ArrowUpRight className="h-4 w-4 text-mist-500" />
      </Link>
    </li>
  );
}
