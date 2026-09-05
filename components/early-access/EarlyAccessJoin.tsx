"use client";

import { useState } from "react";
import {
  ArrowRight,
  Check,
  Code2,
  Mail,
  MapPin,
  Palette,
  Server,
  Sparkles,
  Users,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";
import {
  EARLY_ACCESS_MESSAGES,
  PARTICIPATION_TYPES,
  isValidEmail,
  type EarlyAccessIssue,
  type ParticipationTypeId,
} from "@/lib/early-access";

/** 参与类型 → 描述（展示文案，非投资承诺） */
const TYPE_DETAILS: Record<ParticipationTypeId, string> = {
  creator:
    "Help shape Nova’s creator ecosystem — tools, content, and creator economics.",
  node: "Follow future node operation and ways to participate in the network.",
  developer: "Follow Nova protocol, developer tools, and ecosystem development.",
  community:
    "Follow project progress, the testnet, and community events as they arrive.",
};

const TYPE_ICONS: Record<ParticipationTypeId, typeof Users> = {
  creator: Palette,
  node: Server,
  developer: Code2,
  community: Users,
};

type ViewState = "idle" | "submitting" | "success" | "duplicate" | "error";

/**
 * Early Access 注册交互（S3 参与类型 + S4 Genesis + S5 表单 + 状态）。
 *
 * 说明（V1.1）：
 * - 本组件不接入任何支付 / 钱包 / Token 销售；仅登记参与意向。
 * - 仅采集 email / participationTypes / 可选 country；无敏感字段。
 * - 提交 → POST /api/early-access（服务端验证 + 存储 adapter）。
 * - 未配置注册后端时 API 返回 503 → 显示通用错误态（诚实，不假装成功）。
 */
export function EarlyAccessJoin() {
  const [selected, setSelected] = useState<ParticipationTypeId[]>([]);
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [view, setView] = useState<ViewState>("idle");
  const [issue, setIssue] = useState<EarlyAccessIssue | null>(null);
  const [termsMissing, setTermsMissing] = useState(false);

  const toggleType = (id: ParticipationTypeId) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id],
    );
  };

  const validate = (): EarlyAccessIssue | null => {
    if (!email.trim()) return "EMAIL_REQUIRED";
    if (!isValidEmail(email)) return "EMAIL_INVALID";
    if (selected.length === 0) return "TYPES_REQUIRED";
    return null;
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      setIssue(err);
      return;
    }
    if (!agreed) {
      setTermsMissing(true);
      return;
    }
    setIssue(null);
    setTermsMissing(false);
    setView("submitting");
    try {
      const res = await fetch("/api/early-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          participationTypes: selected,
          ...(country.trim() ? { country: country.trim() } : {}),
          // honeypot（反爬；用户不可见，留空）
          company_website: "",
        }),
      });
      if (res.ok) {
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

  return (
    <>
      {/* Section 3 —— Participation Types */}
      <section id="participation" className="relative py-24 md:py-28">
        <Container>
          <SectionHeading
            eyebrow="How to participate"
            title={
              <>
                Choose how you want to{" "}
                <span className="text-gradient">join the community</span>
              </>
            }
            description="Select one or more areas that interest you. Your choices are only used to tailor updates about Nova — no token purchase, no payment, no wallet."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PARTICIPATION_TYPES.map((t) => {
              const Icon = TYPE_ICONS[t.id];
              const active = selected.includes(t.id);
              return (
                <button
                  key={t.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => toggleType(t.id)}
                  className={cn(
                    "group relative h-full overflow-hidden rounded-2xl border p-6 text-left transition-all duration-300",
                    active
                      ? "border-nova-cyan/50 bg-nova-cyan/10 shadow-card"
                      : "border-white/8 bg-ink-800/50 hover:border-white/18 hover:bg-ink-800/80",
                  )}
                >
                  <div
                    className={cn(
                      "pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent to-transparent transition-opacity",
                      active
                        ? "via-nova-cyan/60 opacity-100"
                        : "via-nova-cyan/40 opacity-60 group-hover:opacity-100",
                    )}
                  />
                  <div className="flex items-start justify-between gap-3">
                    <span
                      className={cn(
                        "inline-flex h-11 w-11 items-center justify-center rounded-xl border",
                        active
                          ? "border-nova-cyan/40 bg-nova-cyan/15 text-nova-cyanSoft"
                          : "border-white/10 bg-white/5 text-mist-400",
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <span
                      className={cn(
                        "inline-flex h-6 w-6 items-center justify-center rounded-full border transition-colors",
                        active
                          ? "border-nova-cyan bg-nova-cyan text-ink-950"
                          : "border-white/20 text-transparent",
                      )}
                      aria-hidden="true"
                    >
                      <Check className="h-3.5 w-3.5" />
                    </span>
                  </div>
                  <h3 className="mt-5 font-display text-base font-semibold text-mist-100">
                    {t.label}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-mist-400 text-pretty">
                    {TYPE_DETAILS[t.id]}
                  </p>
                </button>
              );
            })}
          </div>
          <p className="mt-6 text-center text-xs text-mist-500" aria-live="polite">
            {selected.length === 0
              ? "No areas selected yet."
              : selected.length === 1
                ? "1 area selected."
                : `${selected.length} areas selected.`}
          </p>
        </Container>
      </section>

      {/* Section 4 —— Genesis Community Program */}
      <section
        id="genesis"
        className="relative border-t border-white/5 bg-ink-900/40 py-24 md:py-28"
      >
        <Container>
          <div className="mx-auto max-w-3xl">
            <SectionHeading
              eyebrow="Community program"
              title={
                <>
                  Genesis{" "}
                  <span className="text-gradient">Community Program</span>
                </>
              }
              description="An early-community program is being prepared for people who want to follow Nova from the start."
            />
            <div className="flex flex-col gap-5 rounded-2xl border border-white/8 bg-ink-800/50 p-7">
              <div className="flex items-start gap-3">
                <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-nova-cyanSoft" />
                <p className="text-sm leading-relaxed text-mist-300 text-pretty">
                  Nova is preparing a community-oriented Genesis program for early
                  ecosystem participants. The program will be defined as the
                  protocol and network architecture mature.
                </p>
              </div>
              <p className="rounded-xl border border-amber-400/20 bg-amber-400/5 px-4 py-3 text-sm leading-relaxed text-amber-200/90">
                Participation registration does not guarantee tokens, rewards,
                allocations, airdrops, or financial returns.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Section 5 —— Registration Form */}
      <section
        id="register"
        className="relative border-t border-white/5 py-24 md:py-28"
      >
        <Container size="narrow">
          {view === "success" ? (
            <div className="rounded-2xl border border-nova-cyan/25 bg-ink-800/50 p-10 text-center md:p-14">
              <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-nova-cyan/30 bg-nova-cyan/10 text-nova-cyanSoft">
                <Check className="h-7 w-7" />
              </span>
              <h2 className="mt-6 font-display text-3xl font-semibold tracking-tight text-mist-100 sm:text-4xl">
                You’re on the list.
              </h2>
              <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-mist-400">
                Thank you for joining Nova Early Access. Follow the development of
                Nova as we move toward testnet.
              </p>
              <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
                <Button href="/" variant="secondary">
                  Back to Nova
                </Button>
                <Button href="/technology">
                  Explore Technology
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-white/8 bg-ink-800/50 p-6 md:p-10">
              <h2 className="font-display text-2xl font-semibold tracking-tight text-mist-100 sm:text-3xl">
                Register your interest
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-mist-400">
                Early Access is an ecosystem participation registration — it is not
                a token sale, investment product, or financial offering.
              </p>

              <form onSubmit={onSubmit} noValidate className="mt-8 space-y-6">
                {/* honeypot（隐藏，防爬虫） */}
                <div className="hidden" aria-hidden="true">
                  <label htmlFor="company_website">Website</label>
                  <input
                    id="company_website"
                    name="company_website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    defaultValue=""
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="ea-email"
                    className="mb-2 flex items-center gap-1.5 text-sm font-medium text-mist-200"
                  >
                    <Mail className="h-4 w-4 text-mist-500" />
                    Email
                  </label>
                  <input
                    id="ea-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (issue) setIssue(null);
                      if (termsMissing) setTermsMissing(false);
                    }}
                    placeholder="you@example.com"
                    className="h-11 w-full rounded-xl border border-white/15 bg-ink-950/60 px-4 text-sm text-mist-100 outline-none transition-colors placeholder:text-mist-600 focus:border-nova-cyan/60 focus:ring-2 focus:ring-nova-cyan/20"
                  />
                </div>

                {/* Participation types（与上方卡片共享状态） */}
                <fieldset>
                  <legend className="text-sm font-medium text-mist-200">
                    Participation type
                  </legend>
                  <p className="mt-1 text-xs text-mist-500">
                    You can select more than one.
                  </p>
                  <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
                    {PARTICIPATION_TYPES.map((t) => {
                      const checked = selected.includes(t.id);
                      return (
                        <label
                          key={t.id}
                          className={cn(
                            "flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-colors",
                            checked
                              ? "border-nova-cyan/40 bg-nova-cyan/10 text-mist-100"
                              : "border-white/10 bg-ink-900/40 text-mist-300 hover:border-white/20",
                          )}
                        >
                          <input
                            type="checkbox"
                            name="participationTypes"
                            value={t.id}
                            checked={checked}
                            onChange={() => toggleType(t.id)}
                            className="h-4 w-4 rounded border-white/20 accent-nova-cyan"
                          />
                          {t.label}
                        </label>
                      );
                    })}
                  </div>
                </fieldset>

                {/* Country / Region（可选） */}
                <div>
                  <label
                    htmlFor="ea-country"
                    className="mb-2 flex items-center gap-1.5 text-sm font-medium text-mist-200"
                  >
                    <MapPin className="h-4 w-4 text-mist-500" />
                    Country / Region{" "}
                    <span className="font-normal text-mist-500">(optional)</span>
                  </label>
                  <input
                    id="ea-country"
                    name="country"
                    type="text"
                    autoComplete="country-name"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="e.g. Singapore"
                    maxLength={90}
                    className="h-11 w-full rounded-xl border border-white/15 bg-ink-950/60 px-4 text-sm text-mist-100 outline-none transition-colors placeholder:text-mist-600 focus:border-nova-cyan/60 focus:ring-2 focus:ring-nova-cyan/20"
                  />
                </div>

                {/* Terms */}
                <label className="flex items-start gap-3 text-sm text-mist-300">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => {
                      setAgreed(e.target.checked);
                      if (termsMissing) setTermsMissing(false);
                      if (issue) setIssue(null);
                    }}
                    className="mt-0.5 h-4 w-4 rounded border-white/20 accent-nova-cyan"
                    aria-label="I agree to receive Nova project updates."
                  />
                  <span>I agree to receive Nova project updates.</span>
                </label>

                {/* 校验错误 / 重复 / 网络错误提示 */}
                <div aria-live="polite">
                  {termsMissing && view !== "submitting" && (
                    <p className="rounded-xl border border-amber-400/20 bg-amber-400/5 px-4 py-3 text-sm text-amber-200/90">
                      Please confirm you’re happy to receive Nova project updates.
                    </p>
                  )}
                  {issue && view !== "submitting" && (
                    <p className="rounded-xl border border-amber-400/20 bg-amber-400/5 px-4 py-3 text-sm text-amber-200/90">
                      {EARLY_ACCESS_MESSAGES[issue]}
                    </p>
                  )}
                  {view === "duplicate" && (
                    <p className="rounded-xl border border-nova-cyan/25 bg-nova-cyan/5 px-4 py-3 text-sm text-nova-cyanSoft">
                      You’re already registered. No need to register again.
                    </p>
                  )}
                  {view === "error" && (
                    <p className="rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-3 text-sm text-red-300/90">
                      Something went wrong. Please try again later.
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full sm:w-auto"
                  disabled={view === "submitting"}
                >
                  {view === "submitting" ? "Joining…" : "Join Early Access"}
                </Button>
              </form>
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
