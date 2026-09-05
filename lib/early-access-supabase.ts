import type {
  EarlyAccessPayload,
  ParticipationTypeId,
  RegisterOutcome,
} from "@/lib/early-access";

/**
 * Supabase-backed storage adapter —— 纯核心（V1.1 Backend Integration）
 *
 * 设计（保留现有 storage abstraction）：
 * - lib/early-access.ts（validation / RegisterOutcome / legacy HTTP adapter）保持不变。
 * - 本模块提供「Supabase 写入」的纯核心：依赖注入 db（{ insert }），可完整单测；
 *   真实 db 由 lib/supabase/server.ts（server-only）构造，route 注入。
 * - 绝不从 React 组件调用；浏览器绝不直连 Supabase。
 *
 * Duplicate（去重权威）：
 * - 不做 SELECT→INSERT；直接 INSERT，依赖数据库 UNIQUE(email_normalized)。
 * - Postgres 唯一约束冲突错误码 23505 → { status: "duplicate" } → HTTP 409。
 *
 * 错误语义：
 * - 写库成功 → registered（HTTP 200）
 * - 23505 → duplicate（HTTP 409）
 * - 其它/异常 → error（路由按后端映射为 500 SERVER_ERROR；不泄露 DB/原始错误）
 *
 * 诊断日志（最小、安全）：
 * - 仅对「非重复」的意外错误/异常输出固定事件 EARLY_ACCESS_SUPABASE_ERROR，
 *   便于定位 Production 500 的真实 Supabase 错误（code/message/details/hint，脱敏 + 截断）。
 * - 严禁记录：email / 完整请求体 / country / service role key / Authorization / cookie。
 */

/** 固定诊断事件名（Vercel 函数日志检索用） */
export const EARLY_ACCESS_SUPABASE_ERROR_EVENT = "EARLY_ACCESS_SUPABASE_ERROR";

/** 邮箱形子串（绝不入日志） */
const EMAIL_RE = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;
/** 疑似 token/secret/uuid 的长串（≥32 位，脱敏） */
const TOKEN_RE = /\b[A-Za-z0-9_\-]{32,}\b/g;

/** 脱敏：去除日志文本中的邮箱与长 token 形子串 */
export function redactSensitive(text: string): string {
  return text
    .replace(EMAIL_RE, "[email-redacted]")
    .replace(TOKEN_RE, "[token-redacted]");
}

/**
 * 安全诊断日志：只记录错误类别与（脱敏+截断的）Postgres 错误字段。
 * 不接收 email/row/请求体，因此不会产生 PII 泄露。
 */
export function logEarlyAccessSupabaseError(
  kind: string,
  err: unknown,
): void {
  const raw = (err ?? {}) as {
    code?: string | null;
    message?: string | null;
    details?: string | null;
    hint?: string | null;
  };
  const str = (v: string | null | undefined) =>
    typeof v === "string" ? redactSensitive(v).slice(0, 300) : "";
  console.error(
    EARLY_ACCESS_SUPABASE_ERROR_EVENT,
    JSON.stringify({
      kind,
      code: str(raw.code).slice(0, 40),
      message: str(raw.message),
      details: str(raw.details),
      hint: str(raw.hint),
    }),
  );
}

/** 写库错误（对齐 PostgrestError 子集；仅含可安全脱敏记录的字段） */
export interface EarlyAccessDbError {
  code?: string | null;
  message?: string | null;
  details?: string | null;
  hint?: string | null;
}

/** 最小写库接口（便于注入 supabase client 或测试 mock） */
export interface EarlyAccessDb {
  insert(row: EarlyAccessApplicationRow): Promise<{
    error: EarlyAccessDbError | null;
  }>;
}

/** 落库行（字段与 migration 0001 一一对应；不含任何敏感字段） */
export interface EarlyAccessApplicationRow {
  email: string;
  email_normalized: string;
  country: string | null;
  participation_types: ParticipationTypeId[];
  status: "pending";
  source: "website";
}

/**
 * normalize：trim(email).toLowerCase() —— 与唯一约束匹配。
 * validateEarlyAccessInput 已返回小写+trim 的 email；此处防御性再归一化。
 */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/** payload → 落库行（source/status 固定；country 空则 null） */
export function buildEarlyAccessApplicationRow(
  payload: EarlyAccessPayload,
): EarlyAccessApplicationRow {
  const email = normalizeEmail(payload.email);
  return {
    email,
    email_normalized: email,
    country: payload.country && payload.country.length > 0 ? payload.country : null,
    participation_types: [...payload.participationTypes],
    status: "pending",
    source: "website",
  };
}

/**
 * 写入（依赖注入 db）。调用方（route）负责：
 *  - 先 isSupabaseConfigured() 判断；未配置时返回 unavailable（503）
 *  - try/catch 包裹 db 构造；此处亦捕获 insert 抛出的任何异常 → error
 *
 * 诊断：仅对非 23505 的意外错误 / 抛出的异常输出脱敏日志（固定事件名），
 * 不影响 API 语义（仍返回 error → 500 SERVER_ERROR）。
 */
export async function submitEarlyAccessSupabase(
  db: EarlyAccessDb,
  payload: EarlyAccessPayload,
): Promise<RegisterOutcome> {
  const row = buildEarlyAccessApplicationRow(payload);
  try {
    const { error } = await db.insert(row);
    if (!error) return { status: "registered" };
    // Postgres unique_violation → duplicate（唯一约束是并发去重权威；预期内，不记日志）
    if (error.code === "23505") return { status: "duplicate" };
    logEarlyAccessSupabaseError("insert-error", error);
    return { status: "error" };
  } catch (err) {
    logEarlyAccessSupabaseError("insert-exception", err);
    return { status: "error" };
  }
}
