import { NextResponse } from "next/server";
import { validateRegisterInput, REGISTER_POINTS } from "@/lib/genesis";
import {
  isSupabaseConfigured,
  registerGenesisProfile,
} from "@/lib/supabase/server";
import { createRateLimiter } from "@/lib/rate-limit";

/**
 * POST /api/genesis/register —— Genesis Program 邮箱登记（V1.3）
 *
 * 定位：Early Community Contribution Program。非 Token Sale / ICO / 投资产品。
 * Genesis Points 仅参与积分，不代表/不保证/不承诺任何未来 Token 分配。
 *
 * 数据流（单事务，全在服务端）：
 *   Browser → 本路由 → genesis_register(email) RPC
 *            → INSERT genesis_profiles + INSERT REGISTER(+20) event + UPDATE points_balance
 *
 * 安全：
 *  - 浏览器不直连数据库；无 anon policy；service role 仅服务端。
 *  - email 规范化 + email_normalized UNIQUE（去重权威）；每 profile 唯一 REGISTER。
 *  - 基础内存限流 + honeypot；输入校验；统一错误响应（不泄露内部/SQL/email）。
 *
 * 响应契约：
 *  - 200 { success:true, novaId, pointsBalance }
 *  - 400 { success:false, error:"INVALID_INPUT", field }
 *  - 409 { success:false, error:"ALREADY_REGISTERED" }
 *  - 429 { success:false, error:"RATE_LIMITED" }
 *  - 503 { success:false, error:"REGISTRATION_NOT_AVAILABLE" }
 *  - 500 { success:false, error:"SERVER_ERROR" }
 */

const MAX_BODY_BYTES = 16_384;
const REGISTER_LIMITER = createRateLimiter(5, 60_000);

function clientIp(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(request: Request) {
  // 1) 体积上限
  const declared = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(declared) && declared > MAX_BODY_BYTES) {
    return NextResponse.json(
      { success: false, error: "INVALID_INPUT", field: "EMAIL_INVALID" },
      { status: 400 },
    );
  }

  // 2) 基础限流（尽力而为，单实例）
  if (REGISTER_LIMITER.hit(clientIp(request))) {
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

  // 4) honeypot（被填则静默放行，不落库）
  const honeypot =
    typeof raw === "object" && raw !== null
      ? (raw as Record<string, unknown>).company_website
      : undefined;
  if (typeof honeypot === "string" && honeypot.trim().length > 0) {
    return NextResponse.json({ success: true, novaId: null, pointsBalance: 0 });
  }

  // 5) 服务端校验（email 规范化 + 格式）
  const parsed = validateRegisterInput(raw);
  if (!parsed.ok) {
    return NextResponse.json(
      { success: false, error: "INVALID_INPUT", field: parsed.error },
      { status: 400 },
    );
  }

  // 6) 后端可用性（未配置 → 503 诚实降级）
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      {
        success: false,
        error: "REGISTRATION_NOT_AVAILABLE",
        message:
          "Genesis registration is not connected yet. Please check back soon.",
      },
      { status: 503 },
    );
  }

  // 7) 原子注册（RPC：profile + REGISTER +20 + balance，单事务）
  const outcome = await registerGenesisProfile(parsed.payload.email);

  switch (outcome.status) {
    case "registered":
      return NextResponse.json({
        success: true,
        novaId: outcome.novaId,
        pointsBalance: outcome.pointsBalance,
        registrationPoints: REGISTER_POINTS,
      });
    case "duplicate":
      return NextResponse.json(
        { success: false, error: "ALREADY_REGISTERED" },
        { status: 409 },
      );
    case "unavailable":
      return NextResponse.json(
        { success: false, error: "REGISTRATION_NOT_AVAILABLE" },
        { status: 503 },
      );
    default:
      return NextResponse.json(
        { success: false, error: "SERVER_ERROR" },
        { status: 500 },
      );
  }
}
