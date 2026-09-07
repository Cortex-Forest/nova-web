import { NextResponse } from "next/server";
import { parseGenesisSiweMessage, verifyGenesisSiwe } from "@/lib/genesis-siwe";
import { deriveSigningContext } from "@/lib/genesis-wallet";
import { isSupabaseConfigured, supabaseAdmin } from "@/lib/supabase/server";
import { createRateLimiter } from "@/lib/rate-limit";

/**
 * POST /api/genesis/wallet/verify — verify SIWE signature + atomic wallet
 * Genesis registration/login (Phase 2-B2).
 *
 * Flow (server-side only, no client-supplied identity is trusted):
 *   parse SIWE → validate version/domain/uri/chainId/nonce/issuedAt/expiration
 *   → recover signer from signature → recovered == message.address (canonical)
 *   → genesis_wallet_verify RPC: atomic nonce consume + find-or-create profile
 *     + REGISTER(+20) on first creation only (existing wallet = +0).
 *
 * No persistent session / cookie / Supabase Auth. Response returns safe profile
 * fields only (never uuid / nonce / ledger / service-role data).
 *
 * Responses:
 *   200 { success, novaId, walletAddress, pointsBalance, walletChainId,
 *        walletVerifiedAt, isNew }
 *   400 INVALID_REQUEST (structurally invalid input / untrusted host)
 *   401 AUTH_FAILED (uniform authentication failure — anti-enumeration)
 *   429 RATE_LIMITED
 *   503 REGISTRATION_NOT_AVAILABLE
 *   500 SERVER_ERROR
 */

const MAX_BODY_BYTES = 32_768;
const IP_LIMITER = createRateLimiter(20, 60_000);
const WALLET_LIMITER = createRateLimiter(10, 60_000);
const SIG_HEX_RE = /^0x[0-9a-fA-F]{130}$/;

function clientIp(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(request: Request) {
  // 1) Size guard
  const declared = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(declared) && declared > MAX_BODY_BYTES) {
    return NextResponse.json(
      { success: false, error: "INVALID_REQUEST" },
      { status: 400 },
    );
  }

  // 2) Parse body
  let raw: unknown;
  try {
    const text = await request.text();
    if (text.length > MAX_BODY_BYTES) {
      return NextResponse.json(
        { success: false, error: "INVALID_REQUEST" },
        { status: 400 },
      );
    }
    raw = text.length > 0 ? JSON.parse(text) : null;
  } catch {
    return NextResponse.json(
      { success: false, error: "INVALID_REQUEST" },
      { status: 400 },
    );
  }

  // 3) Rate limit (IP)
  if (IP_LIMITER.hit(clientIp(request))) {
    return NextResponse.json(
      { success: false, error: "RATE_LIMITED" },
      { status: 429 },
    );
  }

  // 4) Input shape
  const body = raw as Record<string, unknown> | null;
  const message = body?.message;
  const signature = body?.signature;
  if (
    typeof message !== "string" ||
    message.length === 0 ||
    typeof signature !== "string" ||
    !SIG_HEX_RE.test(signature)
  ) {
    return NextResponse.json(
      { success: false, error: "INVALID_REQUEST" },
      { status: 400 },
    );
  }

  // 5) Trusted domain/URI derived from the request (server-controlled)
  const context = deriveSigningContext(request.headers);
  if (!context) {
    return NextResponse.json(
      { success: false, error: "INVALID_REQUEST" },
      { status: 400 },
    );
  }

  // 6) Backend availability
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { success: false, error: "REGISTRATION_NOT_AVAILABLE" },
      { status: 503 },
    );
  }

  // 7) Full SIWE validation + signer recovery (never trusts client address)
  const verification = await verifyGenesisSiwe(message, signature, context);
  if (!verification.ok) {
    // Uniform auth failure — do not reveal which check failed to the client.
    return NextResponse.json(
      { success: false, error: "AUTH_FAILED" },
      { status: 401 },
    );
  }
  const signer = verification.signer;

  // 8) Per-wallet rate limit (post-verification, canonical address)
  if (WALLET_LIMITER.hit(`addr:${signer}`)) {
    return NextResponse.json(
      { success: false, error: "RATE_LIMITED" },
      { status: 429 },
    );
  }

  // 9) Atomic consume + find-or-create + REGISTER(+20) via SECURITY DEFINER RPC
  try {
    const db = supabaseAdmin();
    const parsed = parseForRpc(message);
    if (!parsed) {
      return NextResponse.json(
        { success: false, error: "INVALID_REQUEST" },
        { status: 400 },
      );
    }
    const { data, error } = await db.rpc("genesis_wallet_verify", {
      p_nonce: parsed.nonce,
      p_chain_id: parsed.chainId,
      p_domain: parsed.domain,
      p_wallet: signer,
    });
    if (error) {
      // Consumed / expired / mismatched nonce or concurrent loss → uniform 401.
      return NextResponse.json(
        { success: false, error: "AUTH_FAILED" },
        { status: 401 },
      );
    }
    const row = Array.isArray(data) ? data[0] : data;
    if (
      typeof row !== "object" ||
      row === null ||
      (row.status !== "created" && row.status !== "existing") ||
      typeof row.nova_id !== "string" ||
      typeof row.points_balance !== "number"
    ) {
      return NextResponse.json(
        { success: false, error: "SERVER_ERROR" },
        { status: 500 },
      );
    }
    return NextResponse.json({
      success: true,
      isNew: row.status === "created",
      novaId: row.nova_id,
      walletAddress: row.wallet_address ?? signer,
      pointsBalance: row.points_balance,
      walletChainId:
        typeof row.wallet_chain_id === "number" ? row.wallet_chain_id : parsed.chainId,
      walletVerifiedAt:
        typeof row.wallet_verified_at === "string" ? row.wallet_verified_at : null,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "SERVER_ERROR" },
      { status: 500 },
    );
  }
}

/** Minimal re-parse of the already-validated SIWE message for RPC args. */
function parseForRpc(message: string): {
  nonce: string;
  chainId: number;
  domain: string;
} | null {
  // verifyGenesisSiwe already validated the message; we just re-extract the
  // exact fields needed for the atomic RPC.
  const parsed = parseGenesisSiweMessage(message);
  if (!parsed) return null;
  const nonce = parsed.nonce;
  const chainId = parsed.chainId;
  const domain = parsed.domain;
  if (
    typeof nonce !== "string" ||
    typeof chainId !== "number" ||
    typeof domain !== "string"
  ) {
    return null;
  }
  return { nonce, chainId, domain };
}
