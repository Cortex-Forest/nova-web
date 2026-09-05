import { describe, expect, it } from "vitest";
import {
  buildEarlyAccessApplicationRow,
  normalizeEmail,
  submitEarlyAccessSupabase,
  type EarlyAccessDb,
} from "./early-access-supabase";
import type { EarlyAccessPayload } from "./early-access";

const basePayload: EarlyAccessPayload = {
  email: "User@Example.com",
  participationTypes: ["creator", "node"],
  country: "Singapore",
};

function mockDb(
  handler: (row: unknown) => Promise<{ error: { code?: string | null } | null }>,
): EarlyAccessDb {
  return {
    insert: async (row) => handler(row),
  };
}

describe("normalizeEmail / buildEarlyAccessApplicationRow", () => {
  it("normalizes email (trim + lowercase) for the unique key", () => {
    expect(normalizeEmail("  Alice@Example.COM  ")).toBe("alice@example.com");
    expect(normalizeEmail("alice@example.com")).toBe("alice@example.com");
  });

  it("builds the exact minimal row (no wallet/payment/consent fields)", () => {
    const row = buildEarlyAccessApplicationRow(basePayload);
    expect(Object.keys(row).sort()).toEqual(
      [
        "country",
        "email",
        "email_normalized",
        "participation_types",
        "source",
        "status",
      ].sort(),
    );
    expect(row.email_normalized).toBe("user@example.com");
    expect(row.status).toBe("pending");
    expect(row.source).toBe("website");
    expect(row.participation_types).toEqual(["creator", "node"]);
    expect(row.country).toBe("Singapore");
  });

  it("country empty string → null (optional)", () => {
    const row = buildEarlyAccessApplicationRow({
      email: "a@b.co",
      participationTypes: ["community"],
    });
    expect(row.country).toBeNull();
  });

  it("participation_types is a fresh copy (immutability)", () => {
    const types: EarlyAccessPayload["participationTypes"] = ["creator"];
    const row = buildEarlyAccessApplicationRow({
      email: "a@b.co",
      participationTypes: types,
    });
    types.push("node");
    expect(row.participation_types).toEqual(["creator"]);
  });
});

describe("submitEarlyAccessSupabase", () => {
  it("insert success → registered (HTTP 200)", async () => {
    const outcome = await submitEarlyAccessSupabase(
      mockDb(async () => ({ error: null })),
      basePayload,
    );
    expect(outcome).toEqual({ status: "registered" });
  });

  it("unique violation (23505) → duplicate (HTTP 409)", async () => {
    const outcome = await submitEarlyAccessSupabase(
      mockDb(async () => ({ error: { code: "23505" } })),
      basePayload,
    );
    expect(outcome).toEqual({ status: "duplicate" });
  });

  it("other database error → error (mapped to SERVER_ERROR, never leaked)", async () => {
    const outcome = await submitEarlyAccessSupabase(
      mockDb(async () => ({
        error: { code: "42P01", message: "relation does not exist (internal)" },
      })),
      basePayload,
    );
    expect(outcome).toEqual({ status: "error" });
  });

  it("db.insert throws (network/unavailable) → error, never throws", async () => {
    const outcome = await submitEarlyAccessSupabase(
      mockDb(async () => {
        throw new Error("connect ECONNREFUSED (internal)");
      }),
      basePayload,
    );
    expect(outcome).toEqual({ status: "error" });
  });

  it("concurrency: DB unique constraint yields exactly one registered + duplicate(s)", async () => {
    // 模拟数据库 UNIQUE(email_normalized) 并发行为：首个成功，重复键冲突
    const seen = new Set<string>();
    const db = mockDb(async (row) => {
      const email = (row as { email_normalized: string }).email_normalized;
      if (seen.has(email)) return { error: { code: "23505" } };
      seen.add(email);
      return { error: null };
    });

    const payloads = [
      { email: "alice@example.com", participationTypes: ["creator" as const] },
      { email: " Alice@Example.com ", participationTypes: ["creator" as const] },
      { email: "alice@example.com", participationTypes: ["node" as const] },
    ];
    const outcomes = [];
    for (const p of payloads) {
      outcomes.push(await submitEarlyAccessSupabase(db, p));
    }
    // 关键：正常化后都落在同一 email_normalized；去重完全依赖约束（无 SELECT→INSERT）
    expect(outcomes).toEqual([
      { status: "registered" },
      { status: "duplicate" },
      { status: "duplicate" },
    ]);
  });
});
