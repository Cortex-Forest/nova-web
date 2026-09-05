import { NextResponse } from "next/server";
import {
  MAX_BODY_BYTES,
  submitEarlyAccess,
  validateEarlyAccessInput,
  type RegisterOutcome,
} from "@/lib/early-access";
import { submitEarlyAccessSupabase } from "@/lib/early-access-supabase";
import {
  getEarlyAccessInsertDb,
  isSupabaseConfigured,
} from "@/lib/supabase/server";

/**
 * POST /api/early-access —— Early Access 生态参与预登记（V1.1）
 *
 * 定位：参与意向登记，绝非 Token Sale / ICO / 预售 / 投资产品。
 *
 * ## 安全要求（服务端）
 * 1. 服务端验证（绝不只依赖前端）：email / participationTypes / country 白名单与长度。
 * 2. 体积上限：Content-Length / 请求体 > MAX_BODY_BYTES 直接拒绝。
 * 3. 反爬（basic anti-spam）：隐藏 honeypot 字段被填充时静默放行（不落库、不转发）。
 * 4. 限流（best-effort）：内存滑动窗口按 IP 计数。Vercel serverless 为多实例，
 *    此限制为单实例尽力而为；真实强限流由远端注册服务负责。
 * 5. 最小数据：仅转发 email / participationTypes / 可选 country / created_at。
 *    不采集密码、私钥、助记词、支付信息、证件、签名等。
 *
 * ## 存储（backend precedence，清晰且无双重写入）
 * 1. SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY 均已配置 → Supabase 为主存储（写入 early_access_applications）。
 * 2. 否则若配置了 EARLY_ACCESS_ENDPOINT → legacy/alternative HTTP adapter（保留原行为）。
 * 3. 二者均未配置 → 返回 503 REGISTRATION_NOT_AVAILABLE（诚实降级，绝不假装「已注册」）。
 *
 * ## 响应契约
 * - 200  { success: true }
 * - 400  { success: false, error: "INVALID_INPUT", field: <issue> }
 * - 409  { success: false, error: "ALREADY_REGISTERED" }
 * - 429  { success: false, error: "RATE_LIMITED" }
 * - 503  { success: false, error: "REGISTRATION_NOT_AVAILABLE" }
 * - 500  { success: false, error: "SERVER_ERROR" }（Supabase 写库失败，不泄露内部细节）
 * - 502  { success: false, error: "SERVER_ERROR" }（legacy HTTP adapter 原有语义，保持稳定）
 */

/** Supabase（主）配置由 isSupabaseConfigured() 判断；下方为 legacy HTTP endpoint */
const ENDPOINT = process.env.EARLY_ACCESS_ENDPOINT ?? null;

// ---- 尽力而为的内存限流（单实例滑动窗口） ----
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 5;
const rateHits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (rateHits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (recent.length >= RATE_MAX) {
    rateHits.set(ip, recent);
    return true;
  }
  recent.push(now);
  rateHits.set(ip, recent);
  // 防止 Map 无限增长：定期清理陈旧 key
  if (rateHits.size > 10_000) {
    for (const [k, arr] of rateHits) {
      if (arr.length === 0 || now - arr[arr.length - 1] > RATE_WINDOW_MS) {
        rateHits.delete(k);
      }
    }
  }
  return false;
}

function clientIp(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(request: Request) {
  // 1) 体积上限（前置，避免解析超大 body）
  const declared = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(declared) && declared > MAX_BODY_BYTES) {
    return NextResponse.json(
      { success: false, error: "INVALID_INPUT", field: "EMAIL_INVALID" },
      { status: 400 },
    );
  }

  // 2) 限流（best-effort）
  if (rateLimited(clientIp(request))) {
    return NextResponse.json(
      { success: false, error: "RATE_LIMITED" },
      { status: 429 },
    );
  }

  // 3) 解析 body
  let raw: unknown;
  try {
    const text = await request.text();
    if (text.length > MAX_BODY_BYTES) {
      return NextResponse.json(
        { success: false, error: "INVALID_INPUT", field: "EMAIL_INVALID" },
        { status: 400 },
      );
    }
    raw = text.length > 0 ? JSON.parse(text) : null;
  } catch {
    return NextResponse.json(
      { success: false, error: "INVALID_INPUT", field: "EMAIL_INVALID" },
      { status: 400 },
    );
  }

  // 4) honeypot：被机器人填充时静默放行（不落库、不转发，避免泄露规则）
  const honeypot =
    typeof raw === "object" && raw !== null
      ? (raw as Record<string, unknown>).company_website
      : undefined;
  if (typeof honeypot === "string" && honeypot.trim().length > 0) {
    return NextResponse.json({ success: true });
  }

  // 5) 服务端验证
  const parsed = validateEarlyAccessInput(raw);
  if (!parsed.ok) {
    return NextResponse.json(
      { success: false, error: "INVALID_INPUT", field: parsed.error },
      { status: 400 },
    );
  }

  // 6) 存储：backend precedence（Supabase 主 → legacy HTTP → 503 诚实降级）
  let outcome: RegisterOutcome;
  let backend: "supabase" | "http" | "none";

  if (isSupabaseConfigured()) {
    backend = "supabase";
    try {
      const db = getEarlyAccessInsertDb();
      outcome = await submitEarlyAccessSupabase(db, parsed.payload);
    } catch {
      // client 构造等意外异常 → 统一 error（不泄露内部细节）
      outcome = { status: "error" };
    }
  } else if (ENDPOINT) {
    backend = "http";
    outcome = await submitEarlyAccess(parsed.payload, { endpoint: ENDPOINT });
  } else {
    backend = "none";
    outcome = { status: "unavailable" };
  }

  switch (outcome.status) {
    case "registered":
      return NextResponse.json({ success: true });
    case "duplicate":
      return NextResponse.json(
        { success: false, error: "ALREADY_REGISTERED" },
        { status: 409 },
      );
    case "unavailable":
      return NextResponse.json(
        {
          success: false,
          error: "REGISTRATION_NOT_AVAILABLE",
          message:
            "Early Access registration is not connected yet. Please check back soon.",
        },
        { status: 503 },
      );
    default:
      // Supabase 写库失败 → 500；legacy HTTP adapter 保持原有 502 语义
      return NextResponse.json(
        { success: false, error: "SERVER_ERROR" },
        { status: backend === "supabase" ? 500 : 502 },
      );
  }
}
