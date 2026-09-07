/**
 * Genesis Wallet — Phase 2-B1 pure logic (no Next/Supabase/React dependency).
 *
 * Only "nonce infrastructure" — no SIWE, no signature verification, no wallet
 * registration, no profile creation, no points.
 *
 * Identity model (frozen):
 *   wallet_address = primary identity (canonical lowercase 0x… EVM address)
 *   signature      = proof of wallet control (Phase 2-B2)
 *   chain_id       = authentication signing context (metadata, NOT identity)
 *   email          = optional recovery mechanism (future)
 *
 * Note: `chain_id` is NEVER a Nova chain id here. Nova has no live network and
 * no final chain id; this phase only records the signing context reported by
 * the client wallet. The chain allowlist / authentication policy is deferred
 * to Phase 2-B2.
 */

/** Nonce TTL — single source of truth (server constant; default 300s). */
export const GENESIS_WALLET_NONCE_TTL_SECONDS = 300;

/** Nonce entropy: 32 CSPRNG bytes → 64 lowercase hex chars. */
export const GENESIS_WALLET_NONCE_HEX_LENGTH = 64;

/** Canonical lowercase EVM address shape. */
export const EVM_ADDRESS_RE = /^0x[0-9a-f]{40}$/;

/** Nonce shape (hex, >= 128-bit; we use 256-bit). */
export const NONCE_HEX_RE = /^[0-9a-f]{64}$/;

/** Trusted origins for the Genesis signing context (host, no scheme/port). */
export const TRUSTED_GENESIS_HOSTS = new Set<string>([
  "nova-super.xyz", // production
  "localhost", // local development
  "127.0.0.1", // local development
]);

/** Vercel preview / deployment hosts are trusted for staging verification. */
function isTrustedHost(host: string): boolean {
  if (TRUSTED_GENESIS_HOSTS.has(host)) return true;
  return (
    host.endsWith(".vercel.app") ||
    host.endsWith(".vercel.dev") ||
    host.endsWith(".localhost")
  );
}

/**
 * Canonicalize an EVM address to lowercase canonical form.
 * Returns null when the input is not a structurally valid EVM address.
 * NOTE: an address is only a candidate identity — ownership is proven later by
 * signature verification (Phase 2-B2). Never trust client-submitted strings as
 * an identity by themselves.
 */
export function canonicalWalletAddress(input: unknown): string | null {
  if (typeof input !== "string") return null;
  const s = input.trim().toLowerCase();
  return EVM_ADDRESS_RE.test(s) ? s : null;
}

/**
 * Validate a chain id used as the authentication signing context.
 * Accepts a number or numeric string; must be a positive safe integer.
 * Returns the canonical number, or null when invalid.
 */
export function validateChainId(input: unknown): number | null {
  const n =
    typeof input === "number"
      ? input
      : typeof input === "string" && input.trim() !== ""
        ? Number(input.trim())
        : Number.NaN;
  if (!Number.isSafeInteger(n) || n <= 0) return null;
  return n;
}

/** Structural check for a server-issued nonce (hex, 256-bit). */
export function isValidNonce(nonce: unknown): nonce is string {
  return typeof nonce === "string" && NONCE_HEX_RE.test(nonce);
}

/**
 * Derive the trusted signing context (domain + uri) for this request.
 * The host must be in the trusted set — a client can NEVER choose an arbitrary
 * domain (e.g. attacker.com) and receive a legitimate Nova Genesis nonce.
 * Returns null when the host is untrusted or absent.
 */
export function deriveSigningContext(headers: {
  get(name: string): string | null;
}): { domain: string; uri: string } | null {
  const hostRaw = headers.get("x-forwarded-host") ?? headers.get("host");
  if (!hostRaw) return null;
  const rawLower = hostRaw.toLowerCase();
  // SIWE `domain` has no port; `uri` keeps the full origin (incl. dev port).
  const domain = rawLower.replace(/:\d+$/, "");
  if (!isTrustedHost(domain)) return null;
  const protoRaw = headers.get("x-forwarded-proto");
  const scheme = protoRaw
    ? protoRaw.split(",")[0].trim().toLowerCase() || "http"
    : "http";
  return { domain, uri: `${scheme}://${rawLower}` };
}
