import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  GENESIS_EVENT_REGISTER,
  mapGenesisRpcRow,
  NOVA_ID_RE,
  normalizeEmail,
  REGISTER_POINTS,
  validateRegisterInput,
} from "./genesis";

describe("validateRegisterInput", () => {
  it("accepts a valid email and normalizes (trim + lowercase)", () => {
    const res = validateRegisterInput({ email: "  User@Example.COM  " });
    expect(res.ok).toBe(true);
    if (res.ok) expect(res.payload.email).toBe("user@example.com");
  });

  it("rejects missing / empty / malformed emails", () => {
    for (const raw of [{}, { email: "" }, { email: "not-an-email" }, null, "x"]) {
      expect(validateRegisterInput(raw).ok).toBe(false);
    }
  });
});

describe("Nova ID format", () => {
  it("matches NV-GEN-######", () => {
    expect(NOVA_ID_RE.test("NV-GEN-928374")).toBe(true);
    expect(NOVA_ID_RE.test("NV-GEN-000001")).toBe(true);
    expect(NOVA_ID_RE.test("NV-GEN-92837")).toBe(false);
    expect(NOVA_ID_RE.test("NV-GEN-9283740")).toBe(false);
    expect(NOVA_ID_RE.test("nv-gen-928374")).toBe(false);
    expect(NOVA_ID_RE.test("NV-GEN-ABCDEF")).toBe(false);
  });
});

describe("normalizeEmail", () => {
  it("trims and lowercases", () => {
    expect(normalizeEmail("  Alice@Example.COM  ")).toBe("alice@example.com");
  });
});

describe("mapGenesisRpcRow", () => {
  it("maps registered row → registered with nova id + balance", () => {
    const o = mapGenesisRpcRow({
      status: "registered",
      nova_id: "NV-GEN-123456",
      points_balance: REGISTER_POINTS,
    });
    expect(o).toEqual({
      status: "registered",
      novaId: "NV-GEN-123456",
      pointsBalance: 20,
    });
  });

  it("maps duplicate → duplicate (never a second reward)", () => {
    expect(mapGenesisRpcRow({ status: "duplicate" })).toEqual({
      status: "duplicate",
    });
  });

  it("rejects malformed rows / bad nova ids / unknown status", () => {
    expect(mapGenesisRpcRow({ status: "registered", nova_id: "bad" })).toEqual({
      status: "error",
    });
    expect(mapGenesisRpcRow({ status: "unknown" })).toEqual({ status: "error" });
    expect(mapGenesisRpcRow(null)).toEqual({ status: "error" });
    expect(mapGenesisRpcRow(undefined)).toEqual({ status: "error" });
  });
});

describe("migration 0002 invariants (static)", () => {
  const sql = readFileSync(
    join(process.cwd(), "supabase", "migrations", "0002_genesis_profiles.sql"),
    "utf8",
  );

  it("defines genesis_profiles and genesis_points_events", () => {
    expect(sql).toContain("genesis_profiles");
    expect(sql).toContain("genesis_points_events");
  });

  it("keeps minimal data (no password / wallet / KYC / referral)", () => {
    expect(sql).not.toMatch(/password|wallet_address|kyc|referral_code/i);
  });

  it("phase 1 allows only REGISTER events", () => {
    expect(sql).toContain("in ('REGISTER')");
    expect(GENESIS_EVENT_REGISTER).toBe("REGISTER");
  });

  it("enforces uniqueness and accounting invariants", () => {
    expect(sql).toMatch(/email_normalized\s+text\s+not null unique/i);
    expect(sql).toMatch(/nova_id\s+text\s+not null unique/i);
    expect(sql).toContain("genesis_events_one_register");
    expect(sql).toMatch(/genesis_events_points_positive check \(points > 0\)/);
  });

  it("enables RLS with no anon policy and restricts the RPC to service role", () => {
    expect(sql).toContain("enable row level security");
    expect(sql).toMatch(/revoke execute on function public\.genesis_register\(text\)/);
    expect(sql).toMatch(/grant execute on function public\.genesis_register\(text\) to service_role/);
    // No anon INSERT policy is created anywhere.
    expect(sql).not.toMatch(/create policy.*for insert.*to anon/i);
  });

  it("qualifies gen_random_bytes as extensions.gen_random_bytes (search_path=public safety)", () => {
    // SECURITY DEFINER + SET search_path=public: an unqualified gen_random_bytes(3)
    // does not resolve in this Supabase (function lives in the extensions schema),
    // which made the production RPC fail with a runtime resolution error → HTTP 500.
    expect(sql).toContain("extensions.gen_random_bytes(3)");
    // No unqualified gen_random_bytes(...) call remains in the function body.
    expect(sql).not.toMatch(/(?<![.\w])gen_random_bytes\s*\(/);
  });
});
