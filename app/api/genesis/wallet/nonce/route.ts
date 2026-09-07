import { NextResponse } from "next/server";
import {
  canonicalWalletAddress,
  deriveSigningContext,
  GENESIS_WALLET_NONCE_TTL_SECONDS,
  validateChainId,
} from "@/lib/genesis-wallet";
import { buildGenesisSiweMessage } from "@/lib/genesis-siwe";
import { isSupabaseConfigured, supabaseAdmin } from "@/lib/supabase/server";
import { createRateLimiter } from "@/lib/rate-limit";

/**
 * POST /api/genesis/wallet/nonce — issue a one-time signing nonce (Phase 2-B1).
 *
 * Scope: NONCE INFRASTRUCTURE ONLY.
 *   - Issues and stores a short-TTL, single-use CSPRNG nonce bound to a
 *     canonical wallet address + server-controlled domain + chain context.
 *   - Does NOT verify signatures, does NOT consume nonces, does NOT create a
 *     Genesis profile, does NOT grant points, does NOT create a session.
 *
 * Identity honesty:
 *   - This endpoint is NOT an authentication and is NOT an account-enumeration
 *     oracle: the response is identical for registered and unregistered wallets
 *     and never returns profile/nova_id/points/email.
 *   - `chainId` in the request is only the client-reported EVM signing context
 *     (unauthenticated). Nova has no chain id; nothing here claims one.
 *
 * Responses:
 *   200 { nonce, domain, uri, chainId, issuedAt, expirationTime }
 *   400 INVALID_ADDRESS | INVALID_CHAIN_ID | INVALID_DOMAIN
 *   429 RATE_LIMITED
 *   503 REGISTRATION_NOT_AVAILABLE (Supabase not configured)
 *   500 SERVER_ERROR (internal errors are never surfaced)
 */

const MAX_BODY_BYTES = 16_384;
const IP_LIMITER = createRateLimiter(30, 60_000);
const ADDRESS_LIMITER = createRateLimiter(10, 60_000);

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
      { success: false, error: "INVALID_ADDRESS" },
      { status: 400 },
    );
  }

  // 2) Parse body
  let raw: unknown;
  try {
    const text = await request.text();
    if (text.length > MAX_BODY_BYTES) {
      return NextResponse.json(
        { success: false, error: "INVALID_ADDRESS" },
        { status: 400 },
      );
    }
    raw = text.length > 0 ? JSON.parse(text) : null;
  } catch {
    return NextResponse.json(
      { success: false, error: "INVALID_ADDRESS" },
      { status: 400 },
    );
  }

  // 3) Rate limiting (best-effort, in-memory — same caveat as Early Access)
  const ip = clientIp(request);
  if (IP_LIMITER.hit(ip)) {
    return NextResponse.json(
      { success: false, error: "RATE_LIMITED" },
      { status: 429 },
    );
  }

  // 4) Validate + canonicalize wallet address
  const body = raw as Record<string, unknown> | null;
  const walletAddress = canonicalWalletAddress(body?.address);
  if (!walletAddress) {
    return NextResponse.json(
      { success: false, error: "INVALID_ADDRESS" },
      { status: 400 },
    );
  }

  // 5) Wallet-level rate limiting (per canonical address)
  if (ADDRESS_LIMITER.hit(`addr:${walletAddress}`)) {
    return NextResponse.json(
      { success: false, error: "RATE_LIMITED" },
      { status: 429 },
    );
  }

  // 6) Validate signing context chain id (client-reported, unauthenticated)
  const chainId = validateChainId(body?.chainId);
  if (chainId === null) {
    return NextResponse.json(
      { success: false, error: "INVALID_CHAIN_ID" },
      { status: 400 },
    );
  }

  // 7) Derive trusted domain/uri (server-controlled; never client-chosen)
  const context = deriveSigningContext(request.headers);
  if (!context) {
    return NextResponse.json(
      { success: false, error: "INVALID_DOMAIN" },
      { status: 400 },
    );
  }

  // 8) Backend availability
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { success: false, error: "REGISTRATION_NOT_AVAILABLE" },
      { status: 503 },
    );
  }

  // 9) Issue nonce via SECURITY DEFINER RPC (single insert; no consume)
  try {
    const db = supabaseAdmin();
    const { data, error } = await db.rpc("genesis_wallet_issue_nonce", {
      p_wallet_address: walletAddress,
      p_chain_id: chainId,
      p_domain: context.domain,
      p_ttl_seconds: GENESIS_WALLET_NONCE_TTL_SECONDS,
    });
    if (error) {
      return NextResponse.json(
        { success: false, error: "SERVER_ERROR" },
        { status: 500 },
      );
    }
    const row = Array.isArray(data) ? data[0] : data;
    if (
      typeof row !== "object" ||
      row === null ||
      row.status !== "ok" ||
      typeof row.nonce !== "string" ||
      typeof row.issued_at !== "string" ||
      typeof row.expires_at !== "string"
    ) {
      return NextResponse.json(
        { success: false, error: "SERVER_ERROR" },
        { status: 500 },
      );
    }
    // Server-built standard SIWE message the wallet will sign (EIP-4361).
    // The signer is not yet proven here — ownership is verified later.
    const message = buildGenesisSiweMessage({
      domain: context.domain,
      uri: context.uri,
      address: walletAddress,
      chainId,
      nonce: row.nonce,
      issuedAt: new Date(row.issued_at),
      expirationTime: new Date(row.expires_at),
    });
    return NextResponse.json({
      success: true,
      nonce: row.nonce,
      domain: context.domain,
      uri: context.uri,
      chainId,
      issuedAt: row.issued_at,
      expirationTime: row.expires_at,
      message,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "SERVER_ERROR" },
      { status: 500 },
    );
  }
}
