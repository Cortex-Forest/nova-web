/**
 * SUPABASE_URL 运行时结构诊断 —— 纯函数（无 server-only / 无 secret）
 *
 * 用途：Production 500 (PGRST125) 时，只输出 SUPABASE_URL 的「安全结构」，
 * 用于判断运行时的 URL 是否带有多余 path（/rest/v1、/dashboard 等）。
 *
 * 安全约定：
 * - 本模块只接收 URL，绝不接收 secret / key。
 * - 输出绝不包含完整 URL；host 做脱敏（project-ref 替换为 <project>）。
 * - 不输出 query 值 / hash 内容 / 端口中的敏感部分。
 */

export interface SupabaseUrlStructure {
  /** 是否已配置（非空字符串） */
  configured: boolean;
  scheme: string;
  /** 脱敏 host：<project>.supabase.co 或 <custom-host> */
  host_redacted: string;
  /** 原 pathname（如 "/" / "/rest/v1" / "/dashboard/project/x"） */
  url_path: string;
  has_query: boolean;
  has_hash: boolean;
  has_rest_v1: boolean;
  has_auth_v1: boolean;
  has_storage_v1: boolean;
  has_dashboard: boolean;
  trailing_slash: boolean;
  repeated_slashes: boolean;
  /** 与 supabase-js 相同的 rest 端点推导（脱敏 host 版，仅 path） */
  generated_path: string;
  /** 预期完整表路径（generated_path + 表名；仅 path，不含 host） */
  generated_table_path: string;
}

/** 镜像 supabase-js ensureTrailingSlash */
export function ensureTrailingSlash(url: string): string {
  return url.endsWith("/") ? url : `${url}/`;
}

/** 脱敏 host：`<ref>.supabase.co` → `<project>.supabase.co`；其它 → `<custom-host>` */
export function redactHost(host: string): string {
  if (/^[^.]+\.supabase\.co$/i.test(host)) return "<project>.supabase.co";
  return "<custom-host>";
}

/**
 * 解析并返回安全结构。URL 非法/为空 → configured=false（其余字段安全缺省）。
 * 绝不输出完整 URL。
 */
export function describeSupabaseUrlStructure(
  supabaseUrl: string | undefined,
): SupabaseUrlStructure {
  const empty = {
    configured: false,
    scheme: "",
    host_redacted: "",
    url_path: "",
    has_query: false,
    has_hash: false,
    has_rest_v1: false,
    has_auth_v1: false,
    has_storage_v1: false,
    has_dashboard: false,
    trailing_slash: false,
    repeated_slashes: false,
    generated_path: "",
    generated_table_path: "",
  };

  const raw = typeof supabaseUrl === "string" ? supabaseUrl.trim() : "";
  if (!raw) return empty;

  let parsed: URL;
  try {
    // 镜像 supabase-js: validateSupabaseUrl → new URL(ensureTrailingSlash(trim))
    parsed = new URL(ensureTrailingSlash(raw));
  } catch {
    return empty;
  }

  const restBase = new URL("rest/v1", parsed);
  const pathname = parsed.pathname;
  const generatedPath = restBase.pathname;
  const hasRepeated = /\/{2,}/.test(pathname);

  return {
    configured: true,
    scheme: parsed.protocol.replace(":", ""), // https / http
    host_redacted: redactHost(parsed.host),
    url_path: pathname,
    has_query: parsed.search !== "",
    has_hash: parsed.hash !== "",
    has_rest_v1: pathname.includes("/rest/v1"),
    has_auth_v1: pathname.includes("/auth/v1"),
    has_storage_v1: pathname.includes("/storage/v1"),
    has_dashboard: pathname.includes("/dashboard"),
    trailing_slash: raw.endsWith("/"),
    repeated_slashes: hasRepeated,
    generated_path: generatedPath,
    generated_table_path: `${generatedPath.replace(/\/$/, "")}/early_access_applications`,
  };
}
