import { createSiweMessage, parseSiweMessage } from "viem/siwe";
import { getAddress, recoverMessageAddress, type Address, type Hex } from "viem";
import { canonicalWalletAddress, isValidNonce } from "@/lib/genesis-wallet";

/**
 * Genesis Wallet — Phase 2-B2 SIWE (EIP-4361) helpers.
 *
 * Server-side only. Uses viem's standard SIWE serializer/parser (no custom
 * "looks-like-SIWE" format). Signature verification always recovers the signer
 * from the signature — a client-supplied address is NEVER trusted.
 *
 * Identity model (frozen):
 *   wallet_address = primary identity (canonical lowercase)
 *   signature      = proof of wallet control (verified here)
 *   chain_id       = authentication signing context (NOT Nova network id)
 */

export const GENESIS_SIWE_STATEMENT = "Nova Genesis Program authentication.";
export const GENESIS_SIWE_VERSION = "1";
/** Allow issuedAt clock skew (server vs wallet device) up to 5 minutes. */
export const GENESIS_SIWE_MAX_CLOCK_SKEW_MS = 5 * 60_000;

export interface SiweFields {
  domain: string;
  uri: string;
  address: string; // canonical lowercase or checksummed — stored lowercased
  chainId: number;
  nonce: string;
  issuedAt: Date;
  expirationTime: Date;
}

export type SiweParsed = {
  domain?: string;
  address?: string;
  uri?: string;
  version?: string;
  chainId?: number;
  nonce?: string;
  issuedAt?: Date;
  expirationTime?: Date;
  statement?: string;
};

export type SiweVerifyResult =
  | {
      ok: true;
      /** canonical lowercase signer recovered from the signature. */
      signer: string;
    }
  | { ok: false; reason: SiweFailure };

export type SiweFailure =
  | "malformed"
  | "version"
  | "domain"
  | "uri"
  | "chain"
  | "nonce"
  | "issuedAt"
  | "expired"
  | "signature"
  | "signer";

/**
 * Build a standard EIP-4361 message for Nova Genesis.
 * Throws when the fields are invalid (viem serializer validates).
 */
export function buildGenesisSiweMessage(fields: {
  domain: string;
  uri: string;
  address: string;
  chainId: number;
  nonce: string;
  issuedAt: Date;
  expirationTime: Date;
}): string {
  // Message address uses EIP-55 checksum form (human readable + standard);
  // ownership is still proven by signature and stored lowercased.
  const address = getAddress(fields.address);
  return createSiweMessage({
    domain: fields.domain,
    address,
    statement: GENESIS_SIWE_STATEMENT,
    uri: fields.uri,
    version: GENESIS_SIWE_VERSION,
    chainId: fields.chainId,
    nonce: fields.nonce,
    issuedAt: fields.issuedAt,
    expirationTime: fields.expirationTime,
  });
}

/**
 * Parse a SIWE message into fields, or null when malformed.
 */
export function parseGenesisSiweMessage(message: string): SiweParsed | null {
  try {
    const parsed = parseSiweMessage(message);
    if (!parsed) return null;
    return parsed as SiweParsed;
  } catch {
    return null;
  }
}

/**
 * Fully validate a SIWE message + signature against the trusted request
 * context. Steps:
 *   1. parse (malformed)
 *   2. version === '1'
 *   3. domain === trustedDomain
 *   4. uri === trustedUri
 *   5. chainId positive integer
 *   6. nonce well-formed
 *   7. issuedAt valid and not in the future beyond clock skew
 *   8. expirationTime present and in the future
 *   9. recover signer from signature; must equal message.address (canonical)
 *
 * NEVER trusts a client-submitted address — the signer is recovered.
 */
export async function verifyGenesisSiwe(
  message: string,
  signature: string,
  trusted: { domain: string; uri: string },
  now: Date = new Date(),
): Promise<SiweVerifyResult> {
  const parsed = parseGenesisSiweMessage(message);
  if (!parsed) return { ok: false, reason: "malformed" };
  // A SIWE message missing any required field is malformed — not a field error.
  if (
    typeof parsed.domain !== "string" ||
    typeof parsed.address !== "string" ||
    typeof parsed.uri !== "string" ||
    typeof parsed.version !== "string" ||
    typeof parsed.chainId !== "number" ||
    typeof parsed.nonce !== "string" ||
    !(parsed.issuedAt instanceof Date) ||
    !(parsed.expirationTime instanceof Date)
  ) {
    return { ok: false, reason: "malformed" };
  }
  if (parsed.version !== GENESIS_SIWE_VERSION) return { ok: false, reason: "version" };
  if (parsed.domain !== trusted.domain) return { ok: false, reason: "domain" };
  if (parsed.uri !== trusted.uri) return { ok: false, reason: "uri" };
  if (
    typeof parsed.chainId !== "number" ||
    !Number.isSafeInteger(parsed.chainId) ||
    parsed.chainId <= 0
  ) {
    return { ok: false, reason: "chain" };
  }
  if (!isValidNonce(parsed.nonce)) return { ok: false, reason: "nonce" };
  if (
    !parsed.issuedAt ||
    !(parsed.issuedAt instanceof Date) ||
    Number.isNaN(parsed.issuedAt.getTime()) ||
    parsed.issuedAt.getTime() > now.getTime() + GENESIS_SIWE_MAX_CLOCK_SKEW_MS
  ) {
    return { ok: false, reason: "issuedAt" };
  }
  if (
    !parsed.expirationTime ||
    !(parsed.expirationTime instanceof Date) ||
    Number.isNaN(parsed.expirationTime.getTime()) ||
    parsed.expirationTime.getTime() <= now.getTime()
  ) {
    return { ok: false, reason: "expired" };
  }
  if (!parsed.address) return { ok: false, reason: "malformed" };
  const canonicalMessageAddress = canonicalWalletAddress(parsed.address);
  if (!canonicalMessageAddress) return { ok: false, reason: "malformed" };

  let recovered: Address;
  try {
    recovered = await recoverMessageAddress({
      message,
      signature: signature as Hex,
    });
  } catch {
    return { ok: false, reason: "signature" };
  }
  const canonicalSigner = canonicalWalletAddress(recovered);
  if (!canonicalSigner || canonicalSigner !== canonicalMessageAddress) {
    return { ok: false, reason: "signer" };
  }
  return { ok: true, signer: canonicalSigner };
}
