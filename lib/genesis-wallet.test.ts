import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  canonicalWalletAddress,
  deriveSigningContext,
  GENESIS_WALLET_NONCE_HEX_LENGTH,
  GENESIS_WALLET_NONCE_TTL_SECONDS,
  isValidNonce,
  validateChainId,
} from "./genesis-wallet";

const sql = readFileSync(
  join(process.cwd(), "supabase", "migrations", "0004_genesis_wallet_auth.sql"),
  "utf8",
);

function fakeHeaders(map: Record<string, string | null>): {
  get(name: string): string | null;
} {
  return { get: (name: string) => map[name] ?? null };
}

describe("canonicalWalletAddress", () => {
  it("accepts a valid lowercase EVM address and keeps it canonical", () => {
    expect(canonicalWalletAddress("0x1234abcdabcdabcdabcdabcdabcdabcdabcdabcd")).toBe(
      "0x1234abcdabcdabcdabcdabcdabcdabcdabcdabcd",
    );
  });

  it("canonicalizes uppercase / mixed-case to lowercase", () => {
    expect(
      canonicalWalletAddress("0X1234ABCDABCDABCDABCDABCDABCDABCDABCDABCD"),
    ).toBe("0x1234abcdabcdabcdabcdabcdabcdabcdabcdabcd");
    expect(
      canonicalWalletAddress("0x1234ABCDabcdABCDabcdABCDabcdABCDabcdABCD"),
    ).toBe("0x1234abcdabcdabcdabcdabcdabcdabcdabcdabcd");
  });

  it("rejects malformed / non-address inputs", () => {
    for (const bad of [
      null,
      undefined,
      42,
      "",
      "0x1234", // too short
      "0x1234abcdabcdabcdabcdabcdabcdabcdabcdabcdabcd", // too long
      "1234abcdabcdabcdabcdabcdabcdabcdabcdabcdabcd", // no 0x
      "0xzzz4abcdabcdabcdabcdabcdabcdabcdabcdabcdabcd", // non-hex
      "hello",
    ]) {
      expect(canonicalWalletAddress(bad)).toBeNull();
    }
  });
});

describe("validateChainId", () => {
  it("accepts positive integers", () => {
    expect(validateChainId(1)).toBe(1);
    expect(validateChainId(8453)).toBe(8453);
    expect(validateChainId("1")).toBe(1);
  });

  it("rejects 0 / negative / non-integer / non-number", () => {
    for (const bad of [0, -1, -8453, 1.5, "1.5", "", "abc", null, undefined, {}, []]) {
      expect(validateChainId(bad)).toBeNull();
    }
  });
});

describe("isValidNonce", () => {
  it("accepts a 64-char lowercase hex nonce", () => {
    expect(isValidNonce("a".repeat(GENESIS_WALLET_NONCE_HEX_LENGTH))).toBe(true);
    expect(GENESIS_WALLET_NONCE_HEX_LENGTH).toBe(64); // 32 bytes → 256-bit entropy
  });

  it("rejects wrong length / non-hex / non-string", () => {
    expect(isValidNonce("a".repeat(32))).toBe(false);
    expect(isValidNonce("A".repeat(64))).toBe(false); // uppercase not canonical
    expect(isValidNonce("g".repeat(64))).toBe(false);
    expect(isValidNonce(123)).toBe(false);
    expect(isValidNonce(null)).toBe(false);
  });
});

describe("deriveSigningContext", () => {
  it("accepts trusted hosts (production + localhost)", () => {
    expect(
      deriveSigningContext(
        fakeHeaders({ host: "yazimao.xyz", "x-forwarded-proto": "https" }),
      ),
    ).toEqual({ domain: "yazimao.xyz", uri: "https://yazimao.xyz" });
    expect(
      deriveSigningContext(fakeHeaders({ host: "localhost:3000" })),
    ).toEqual({ domain: "localhost", uri: "http://localhost:3000" });
  });

  it("accepts Vercel preview hosts", () => {
    const ctx = deriveSigningContext(
      fakeHeaders({
        "x-forwarded-host": "nova-web-git-foo-bar.vercel.app",
        "x-forwarded-proto": "https",
      }),
    );
    expect(ctx?.domain.endsWith(".vercel.app")).toBe(true);
  });

  it("rejects untrusted hosts and absent hosts", () => {
    expect(deriveSigningContext(fakeHeaders({ host: "attacker.com" }))).toBeNull();
    expect(deriveSigningContext(fakeHeaders({ host: "evil.example" }))).toBeNull();
    expect(deriveSigningContext(fakeHeaders({}))).toBeNull();
  });

  it("rejects the retired production host (nova-super.xyz → yazimao.xyz)", () => {
    // 安全负例：迁移后旧生产域必须被拒绝，不能继续生成有效 SIWE 上下文。
    expect(
      deriveSigningContext(
        fakeHeaders({ host: "nova-super.xyz", "x-forwarded-proto": "https" }),
      ),
    ).toBeNull();
  });
});

describe("TTL policy", () => {
  it("default nonce TTL is ~5 minutes (300s)", () => {
    expect(GENESIS_WALLET_NONCE_TTL_SECONDS).toBe(300);
  });
});

describe("0004 migration invariants (static)", () => {
  it("adds wallet identity fields and makes email optional", () => {
    expect(sql).toMatch(/add column if not exists wallet_address\s+text\s+null/i);
    expect(sql).toMatch(/add column if not exists wallet_chain_id\s+bigint\s+null/i);
    expect(sql).toMatch(/add column if not exists wallet_verified_at\s+timestamptz\s+null/i);
    expect(sql).toMatch(/alter column email\s+drop not null/i);
    expect(sql).toMatch(/alter column email_normalized\s+drop not null/i);
  });

  it("enforces one wallet ↔ one profile via partial unique index", () => {
    expect(sql).toContain("genesis_profiles_wallet_address_unique");
    expect(sql).toMatch(/on public\.genesis_profiles \(wallet_address\)\s+where wallet_address is not null/i);
  });

  it("uses schema-qualified CSPRNG for nonce generation (search_path safety)", () => {
    expect(sql).toContain("extensions.gen_random_bytes(32)");
    // No unqualified gen_random_bytes(...) call in this migration.
    expect(sql).not.toMatch(/(?<![.\w])gen_random_bytes\s*\(/);
  });

  it("nonce table is RLS-protected with no anon/authenticated policies", () => {
    expect(sql).toContain("genesis_wallet_nonces");
    expect(sql).toMatch(/enable row level security/);
    expect(sql).not.toMatch(/create policy/i);
  });

  it("restricts nonce RPC execution to service_role", () => {
    expect(sql).toMatch(/revoke execute on function public\.genesis_wallet_issue_nonce\(text, bigint, text, integer\) from public, anon, authenticated/);
    expect(sql).toMatch(/grant execute on function public\.genesis_wallet_issue_nonce\(text, bigint, text, integer\) to service_role/);
  });

  it("nonce RPC issues only — no consume / profile / points in this phase", () => {
    expect(sql).not.toMatch(/set consumed_at/i); // consume is Phase 2-B2
    expect(sql).not.toMatch(/insert into public\.genesis_profiles/i);
    expect(sql).not.toMatch(/insert into public\.genesis_points_events/i);
    expect(sql).not.toMatch(/points_balance\s*=/i);
    expect(sql).not.toMatch(/create or replace function public\.genesis_register/i); // email flow untouched
  });
});

describe("0005 migration invariants (static)", () => {
  const sql5 = readFileSync(
    join(process.cwd(), "supabase", "migrations", "0005_genesis_wallet_verify.sql"),
    "utf8",
  );

  it("defines an atomic verify function with SECURITY DEFINER + search_path", () => {
    expect(sql5).toContain("create or replace function public.genesis_wallet_verify");
    expect(sql5).toMatch(/security definer/);
    expect(sql5).toMatch(/set search_path = public/);
  });

  it("consumes the nonce atomically (single-use) and re-checks bindings", () => {
    expect(sql5).toContain("for update");
    expect(sql5).toMatch(/v_consumed is not null/);
    expect(sql5).toMatch(/set consumed_at = now\(\)/);
    expect(sql5).toMatch(/domain_mismatch/);
    expect(sql5).toMatch(/chain_mismatch/);
    expect(sql5).toMatch(/wallet_mismatch/);
    expect(sql5).toMatch(/nonce_expired/);
  });

  it("grants +20 only on first creation via REGISTER event + balance update", () => {
    expect(sql5).toMatch(/insert into public\.genesis_points_events .*REGISTER.*20/s);
    expect(sql5).toMatch(/points_balance = 20/);
  });

  it("guards concurrency with DB constraints (wallet unique + REGISTER-per-profile)", () => {
    expect(sql5).toContain("genesis_profiles_wallet_address_unique");
    expect(sql5).toContain("get stacked diagnostics");
    expect(sql5).toMatch(/return query select\s+'existing'/i);
  });

  it("restricts execution to service_role only", () => {
    expect(sql5).toMatch(/revoke execute on function public\.genesis_wallet_verify\(text, bigint, text, text\) from public, anon, authenticated/);
    expect(sql5).toMatch(/grant execute on function public\.genesis_wallet_verify\(text, bigint, text, text\) to service_role/);
  });

  it("uses schema-qualified CSPRNG and never touches email flow / existing rules", () => {
    expect(sql5).toContain("extensions.gen_random_bytes(3)");
    expect(sql5).not.toMatch(/(?<![.\w])gen_random_bytes\s*\(/);
    expect(sql5).not.toMatch(/create or replace function public\.genesis_register/i);
  });
});
