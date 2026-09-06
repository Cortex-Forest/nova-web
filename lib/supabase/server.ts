import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { createRequire } from "node:module";
import type { EarlyAccessDb, EarlyAccessApplicationRow } from "@/lib/early-access-supabase";
import { describeSupabaseUrlStructure } from "@/lib/supabase/url-structure";
import { mapGenesisRpcRow, type GenesisRegisterOutcome } from "@/lib/genesis";

/**
 * Server-only Supabase client（真实注册存储，V1.1 Backend Integration）
 *
 * ## 安全边界（必须遵守）
 * - `import "server-only"` → 该模块被客户端 bundle 引用时 Next.js 构建直接报错。
 * - service role key 只从 process.env.SUPABASE_SERVICE_ROLE_KEY 读取。
 * - 服务端密钥一律不带 NEXT_PUBLIC_ 前缀，绝不以客户端可读环境变量暴露。
 * - 本模块只能被 server route / server-only storage layer import，
 *   绝不能被 React client component（如 EarlyAccessJoin.tsx）import。
 * - 不打印 email / payload / key / SQL。
 */

/** Supabase 是否已配置（二者同时存在才算） */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

let cachedClient: SupabaseClient | null = null;

/** 获取 admin（service role）client；仅服务端可用。 */
export function supabaseAdmin(): SupabaseClient {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Supabase is not configured on the server.");
  }
  if (!cachedClient) {
    cachedClient = createClient(url, key, {
      auth: {
        // 服务端 client：不需要任何浏览器持久会话
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });
  }
  return cachedClient;
}

/** 将 Supabase client 适配为早前注册核心（core）所需的 db 接口。 */
export function getEarlyAccessInsertDb(): EarlyAccessDb {
  const db = supabaseAdmin();
  return {
    insert: async (row: EarlyAccessApplicationRow) => {
      const { error } = await db
        .from("early_access_applications")
        .insert(row);
      // 只向 core 返回 { error }；绝不在日志打印 email / row / error 原文细节。
      return { error };
    },
  };
}

// ---------------------------------------------------------------------------
// Genesis Program（V1.3）—— 服务端接线（RPC 注册 / profile 只读查询）
// ---------------------------------------------------------------------------

/**
 * 调用 genesis_register(email) RPC（单事务：profile + REGISTER event + balance）。
 * 未配置时由路由先行判断；此处仅映射结果，绝不泄露内部错误/SQL。
 */
export async function registerGenesisProfile(
  email: string,
): Promise<GenesisRegisterOutcome> {
  const db = supabaseAdmin();
  try {
    const { data, error } = await db.rpc("genesis_register", { p_email: email });
    if (error) return { status: "error" };
    const row = Array.isArray(data) ? data[0] : data;
    return mapGenesisRpcRow(row);
  } catch {
    return { status: "error" };
  }
}

export interface GenesisProfilePublic {
  nova_id: string;
  points_balance: number;
  created_at: string;
}

/**
 * 按 nova_id 只读查询公开档案（不含 email —— 避免 PII 泄露）。
 * 返回 null 表示不存在；never 返回 Supabase 内部错误。
 */
export async function getGenesisProfile(
  novaId: string,
): Promise<{ ok: true; profile: GenesisProfilePublic } | { ok: false }> {
  const db = supabaseAdmin();
  try {
    const { data, error } = await db
      .from("genesis_profiles")
      .select("nova_id, points_balance, created_at")
      .eq("nova_id", novaId)
      .maybeSingle();
    if (error || !data) return { ok: false };
    return {
      ok: true,
      profile: {
        nova_id: data.nova_id,
        points_balance: data.points_balance,
        created_at: data.created_at,
      },
    };
  } catch {
    return { ok: false };
  }
}

// ---------------------------------------------------------------------------
// PGRST125 运行时 URL 诊断（最小、安全、仅结构信息）
// ---------------------------------------------------------------------------

/** URL 结构诊断固定事件名（Vercel 日志检索用） */
export const EARLY_ACCESS_SUPABASE_URL_DIAGNOSTIC_EVENT =
  "EARLY_ACCESS_SUPABASE_URL_DIAGNOSTIC";

/** 尝试读取已安装的 supabase-js 版本（运行时、尽力而为；失败为 undefined） */
function supabaseJsVersion(): string | undefined {
  try {
    const req = createRequire(import.meta.url);
    const pkg = req("@supabase/supabase-js/package.json") as {
      version?: string;
    };
    return pkg.version;
  } catch {
    return undefined;
  }
}

let urlDiagLogged = false;

/**
 * 输出运行时 SUPABASE_URL 的安全结构（脱敏 host / path / 派生 REST path）。
 * 绝不输出完整 URL / secret / query 值。每个函数实例只记一次。
 */
export function logSupabaseUrlDiagnostic(): void {
  if (urlDiagLogged) return;
  urlDiagLogged = true;
  const structure = describeSupabaseUrlStructure(process.env.SUPABASE_URL);
  console.error(
    EARLY_ACCESS_SUPABASE_URL_DIAGNOSTIC_EVENT,
    JSON.stringify({
      ...structure,
      supabase_js_version: supabaseJsVersion() ?? null,
    }),
  );
}
