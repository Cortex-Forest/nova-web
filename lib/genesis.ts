import { isValidEmail } from "@/lib/early-access";

/**
 * Genesis Program (V1.3) —— 纯逻辑（无 Next/React/Supabase 依赖，便于单测）
 *
 * 定位：Early Community Contribution Program。
 * Genesis Points = participation points only；不代表、不保证、不承诺任何未来 Token 分配。
 * 本阶段仅启用 REGISTER +20；checkin/referral/wallet/creator 一律不产生积分。
 *
 * 记账原则（与 migration 0002 一致）：
 * - genesis_points_events = 积分事实/审计来源
 * - points_balance = 性能缓存
 * - 每次积分变化必须 ①写 event ②同事务原子更新 balance ③失败整体 rollback
 * - 防重复注册奖励：email_normalized UNIQUE + 每 profile 唯一 REGISTER
 */

export const REGISTER_POINTS = 20;
export const GENESIS_EVENT_REGISTER = "REGISTER";

/** Nova ID 格式：NV-GEN-###### */
export const NOVA_ID_RE = /^NV-GEN-[0-9]{6}$/;

/** 注册输入错误码 */
export type GenesisIssue = "EMAIL_REQUIRED" | "EMAIL_INVALID";

export interface GenesisPayload {
  email: string;
}

/** 注册结果（路由按此渲染成功/重复/失败；对应 HTTP 200/409/5xx/503） */
export type GenesisRegisterOutcome =
  | { status: "registered"; novaId: string; pointsBalance: number }
  | { status: "duplicate" }
  | { status: "unavailable" }
  | { status: "error" };

/** normalize：trim(email).toLowerCase()（与 DB email_normalized 一致） */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/** 校验注册请求体（服务端/客户端共用） */
export function validateRegisterInput(
  raw: unknown,
): { ok: true; payload: GenesisPayload } | { ok: false; error: GenesisIssue } {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
    return { ok: false, error: "EMAIL_REQUIRED" };
  }
  const emailRaw = (raw as Record<string, unknown>).email;
  if (typeof emailRaw !== "string") return { ok: false, error: "EMAIL_REQUIRED" };
  const email = emailRaw.trim();
  if (email.length === 0) return { ok: false, error: "EMAIL_REQUIRED" };
  if (!isValidEmail(email)) return { ok: false, error: "EMAIL_INVALID" };
  return { ok: true, payload: { email: normalizeEmail(email) } };
}

/** genesis_register RPC 返回行 → 内部结果（仅字段映射，不打印任何内容） */
export function mapGenesisRpcRow(
  row: unknown,
): GenesisRegisterOutcome {
  if (typeof row !== "object" || row === null) return { status: "error" };
  const r = row as Record<string, unknown>;
  const status = typeof r.status === "string" ? r.status : "";
  if (status === "duplicate") return { status: "duplicate" };
  if (status === "registered") {
    const novaId = typeof r.nova_id === "string" ? r.nova_id : "";
    const points =
      typeof r.points_balance === "number" ? r.points_balance : REGISTER_POINTS;
    if (!NOVA_ID_RE.test(novaId)) return { status: "error" };
    return { status: "registered", novaId, pointsBalance: points };
  }
  return { status: "error" };
}

/** 错误码 → 展示文案 */
export const GENESIS_MESSAGES: Record<GenesisIssue, string> = {
  EMAIL_REQUIRED: "Please enter your email.",
  EMAIL_INVALID: "Please enter a valid email address.",
};
