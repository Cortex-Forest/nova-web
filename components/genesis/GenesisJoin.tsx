"use client";

import { useState } from "react";
import { ArrowRight, Check, Copy, Mail, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import {
  GENESIS_MESSAGES,
  REGISTER_POINTS,
  validateRegisterInput,
  type GenesisIssue,
} from "@/lib/genesis";

type ViewState = "idle" | "submitting" | "success" | "duplicate" | "error";

/** 本阶段未启用的活动（一律 Planned / Coming Soon，不产生积分） */
const UPCOMING: { label: string; detail: string; state: string }[] = [
  { label: "Daily Check-in", detail: "+1 Point", state: "Coming Soon" },
  { label: "Invite Friends", detail: "+5 Points", state: "Coming Soon" },
  { label: "Connect Wallet", detail: "Wallet binding", state: "Coming Soon" },
  { label: "Creator / Node contributions", detail: "Dynamic", state: "Planned" },
];

/** 成功后展示的任务清单（统一形状，避免联合类型缺字段） */
const SUCCESS_TASKS: {
  label: string;
  detail: string;
  done: boolean;
  state: string;
}[] = [
  {
    label: "Registration",
    detail: `+${REGISTER_POINTS} Points`,
    done: true,
    state: "Completed",
  },
  ...UPCOMING.map((u) => ({ ...u, done: false })),
];

/**
 * Genesis Program 注册（V1.3）
 *
 * 诚实边界：
 * - Genesis Points = participation points only；不代表/不保证/不承诺任何未来 Token 分配。
 * - 本阶段仅启用注册 +20；下方活动均为 Coming Soon/Planned，不会产生积分。
 * - 无邮箱验证码（正式邮件服务接入后会启用，页面如实说明）。
 */
export function GenesisJoin() {
  const [email, setEmail] = useState("");
  const [view, setView] = useState<ViewState>("idle");
  const [issue, setIssue] = useState<GenesisIssue | null>(null);
  const [novaId, setNovaId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const parsed = validateRegisterInput({ email });
    if (!parsed.ok) {
      setIssue(parsed.error);
      return;
    }
    setIssue(null);
    setView("submitting");
    try {
      const res = await fetch("/api/genesis/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          // honeypot（反爬；用户不可见，留空）
          company_website: "",
        }),
      });
      const json = await res.json().catch(() => null);
      if (res.ok) {
        setNovaId(typeof json?.novaId === "string" ? json.novaId : null);
        setView("success");
      } else if (res.status === 409) {
        setView("duplicate");
      } else {
        setView("error");
      }
    } catch {
      setView("error");
    }
  };

  const copyNovaId = async () => {
    if (!novaId) return;
    try {
      await navigator.clipboard.writeText(novaId);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="rounded-2xl border border-white/8 bg-ink-800/50 p-6 md:p-10">
      {view === "success" && novaId ? (
        <div data-testid="genesis-success" className="text-center">
          <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-nova-cyan/30 bg-nova-cyan/10 text-nova-cyanSoft">
            <Check className="h-7 w-7" />
          </span>
          <h2 className="mt-6 font-display text-3xl font-semibold tracking-tight text-mist-100 sm:text-4xl">
            Welcome to the Genesis Program.
          </h2>
          <p className="mt-3 text-sm text-mist-400">
            Your Nova ID has been created and your registration reward is
            applied.
          </p>

          <div className="mx-auto mt-6 max-w-sm rounded-xl border border-nova-cyan/25 bg-ink-950/50 p-5">
            <p className="text-xs uppercase tracking-widest text-mist-500">
              Nova ID
            </p>
            <div className="mt-1 flex items-center justify-center gap-2">
              <span className="font-mono text-2xl font-semibold text-nova-cyanSoft">
                {novaId}
              </span>
              <button
                type="button"
                onClick={copyNovaId}
                aria-label="Copy Nova ID"
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-mist-400 transition-colors hover:text-white"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
            <p className="mt-2 text-sm text-mist-200">
              Genesis Points:{" "}
              <span className="font-mono text-nova-cyanSoft">
                +{REGISTER_POINTS}
              </span>
            </p>
          </div>

          {/* 任务列表：仅 Registration 已完成，其余 Coming Soon（不产生积分） */}
          <div className="mx-auto mt-6 max-w-sm space-y-2 text-left">
            {SUCCESS_TASKS.map((t) => (
              <div
                key={t.label}
                className="flex items-center justify-between rounded-xl border border-white/8 bg-ink-900/40 px-4 py-3"
              >
                <span className="text-sm text-mist-200">
                  {t.done ? (
                    <span className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-nova-cyanSoft" />
                      {t.label}
                    </span>
                  ) : (
                    t.label
                  )}
                </span>
                <span className="flex items-center gap-2 text-xs">
                  {t.done ? (
                    <span className="text-mist-400">{t.detail}</span>
                  ) : (
                    <span
                      className={cn(
                        "rounded-full border px-2 py-0.5",
                        t.state === "Planned"
                          ? "border-white/10 text-mist-500"
                          : "border-amber-400/30 text-amber-300",
                      )}
                    >
                      {t.state}
                    </span>
                  )}
                </span>
              </div>
            ))}
          </div>

          <p className="mx-auto mt-5 max-w-md text-xs leading-relaxed text-mist-500">
            Genesis Points are participation points only and do not represent,
            guarantee, or promise any future token allocation.
          </p>
        </div>
      ) : (
        <>
          <h2 className="font-display text-2xl font-semibold tracking-tight text-mist-100 sm:text-3xl">
            Join the Genesis Program
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-mist-400">
            Register with your email to receive your Nova ID and earn{" "}
            <span className="text-nova-cyanSoft">+{REGISTER_POINTS} Genesis Points</span>{" "}
            for joining the first generation of Nova ecosystem contributors.
          </p>

          <form onSubmit={onSubmit} noValidate className="mt-8 space-y-5">
            {/* honeypot（隐藏） */}
            <div className="hidden" aria-hidden="true">
              <label htmlFor="genesis_company_website">Website</label>
              <input
                id="genesis_company_website"
                name="company_website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                defaultValue=""
              />
            </div>

            <div>
              <label
                htmlFor="genesis-email"
                className="mb-2 flex items-center gap-1.5 text-sm font-medium text-mist-200"
              >
                <Mail className="h-4 w-4 text-mist-500" />
                Email
              </label>
              <input
                id="genesis-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (issue) setIssue(null);
                }}
                placeholder="you@example.com"
                className="h-11 w-full rounded-xl border border-white/15 bg-ink-950/60 px-4 text-sm text-mist-100 outline-none transition-colors placeholder:text-mist-600 focus:border-nova-cyan/60 focus:ring-2 focus:ring-nova-cyan/20"
              />
            </div>

            <div aria-live="polite">
              {issue && view !== "submitting" && (
                <p className="rounded-xl border border-amber-400/20 bg-amber-400/5 px-4 py-3 text-sm text-amber-200/90">
                  {GENESIS_MESSAGES[issue]}
                </p>
              )}
              {view === "duplicate" && (
                <p className="rounded-xl border border-nova-cyan/25 bg-nova-cyan/5 px-4 py-3 text-sm text-nova-cyanSoft">
                  This email is already registered. One Nova ID per email.
                </p>
              )}
              {view === "error" && (
                <p className="rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-3 text-sm text-red-300/90">
                  Something went wrong. Please try again later.
                </p>
              )}
            </div>

            <Button type="submit" size="lg" disabled={view === "submitting"}>
              {view === "submitting" ? "Joining…" : "Join Genesis Program"}
              {view !== "submitting" && <ArrowRight className="h-4 w-4" />}
            </Button>
          </form>

          <div className="mt-6 space-y-2.5 rounded-xl border border-white/8 bg-ink-900/40 p-5">
            {[
              "Genesis Points are participation points only and do not represent, guarantee, or promise any future token allocation.",
              "Email verification will be added when the official email service is available.",
              "This is not a token sale, investment product, or financial offering.",
            ].map((t) => (
              <p key={t} className="flex items-start gap-2 text-xs text-mist-500">
                <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-nova-cyanSoft" />
                <span>{t}</span>
              </p>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
