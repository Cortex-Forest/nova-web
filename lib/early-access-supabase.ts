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
 */

/** 最小写库接口（便于注入 supabase client 或测试 mock） */
export interface EarlyAccessDb {
  insert(row: EarlyAccessApplicationRow): Promise<{
    error: { code?: string | null; message?: string | null } | null;
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
 */
export async function submitEarlyAccessSupabase(
  db: EarlyAccessDb,
  payload: EarlyAccessPayload,
): Promise<RegisterOutcome> {
  const row = buildEarlyAccessApplicationRow(payload);
  try {
    const { error } = await db.insert(row);
    if (!error) return { status: "registered" };
    // Postgres unique_violation → duplicate（唯一约束是并发去重权威）
    if (error.code === "23505") return { status: "duplicate" };
    return { status: "error" };
  } catch {
    return { status: "error" };
  }
}
