import { NextResponse } from "next/server";
import { NOVA_ID_RE } from "@/lib/genesis";
import {
  isSupabaseConfigured,
  getGenesisProfile,
} from "@/lib/supabase/server";
import { createRateLimiter } from "@/lib/rate-limit";

/**
 * GET /api/genesis/profile?nova_id=NV-GEN-XXXXXX —— Genesis 公开档案（V1.3）
 *
 * 无邮箱验证/会话前，仅支持按 nova_id 查询公开字段（nova_id / points_balance /
 * created_at）。绝不返回 email（PII）或任何内部错误。
 *
 * 响应：
 *  - 200 { success:true, profile:{ nova_id, points_balance, created_at } }
 *  - 400 { success:false, error:"INVALID_INPUT" }（nova_id 缺失/格式错）
 *  - 404 { success:false, error:"NOT_FOUND" }
 *  - 429 { success:false, error:"RATE_LIMITED" }
 *  - 503 { success:false, error:"REGISTRATION_NOT_AVAILABLE" }
 *  - 500 { success:false, error:"SERVER_ERROR" }
 */

const PROFILE_LIMITER = createRateLimiter(30, 60_000);

export async function GET(request: Request) {
  const url = new URL(request.url);
  const novaId = (url.searchParams.get("nova_id") ?? "").trim();

  if (!NOVA_ID_RE.test(novaId)) {
    return NextResponse.json(
      { success: false, error: "INVALID_INPUT", field: "NOVA_ID" },
      { status: 400 },
    );
  }

  const fwd = (request.headers.get("x-forwarded-for") ?? "")
    .split(",")[0]
    .trim();
  const ip = fwd || request.headers.get("x-real-ip") || "unknown";
  if (PROFILE_LIMITER.hit(ip)) {
    return NextResponse.json(
      { success: false, error: "RATE_LIMITED" },
      { status: 429 },
    );
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { success: false, error: "REGISTRATION_NOT_AVAILABLE" },
      { status: 503 },
    );
  }

  const result = await getGenesisProfile(novaId);
  if (!result.ok) {
    return NextResponse.json(
      { success: false, error: "NOT_FOUND" },
      { status: 404 },
    );
  }

  return NextResponse.json({ success: true, profile: result.profile });
}
