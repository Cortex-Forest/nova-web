import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  buildEarlyAccessApplicationRow,
  EARLY_ACCESS_SUPABASE_ERROR_EVENT,
  logEarlyAccessSupabaseError,
  normalizeEmail,
  redactSensitive,
  submitEarlyAccessSupabase,
  type EarlyAccessDb,
  type EarlyAccessDbError,
} from "./early-access-supabase";
import type { EarlyAccessPayload } from "./early-access";

const basePayload: EarlyAccessPayload = {
  email: "User@Example.com",
  participationTypes: ["creator", "node"],
  country: "Singapore",
};

function mockDb(
  handler: (row: unknown) => Promise<{ error: EarlyAccessDbError | null }>,
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
  // 静默真实 console，避免错误路径噪声；并可断言诊断日志调用
  let errSpy: ReturnType<typeof vi.spyOn>;
  beforeEach(() => {
    errSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });
  afterEach(() => {
    errSpy.mockRestore();
  });

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

describe("diagnostics (safe error logging)", () => {
  it("redactSensitive removes emails and long token-like strings", () => {
    const text =
      'duplicate key (alice@example.com) value violates constraint abcdefghijklmnopqrstuvwxyz0123456789';
    const out = redactSensitive(text);
    expect(out).not.toContain("alice@example.com");
    expect(out).not.toContain("abcdefghijklmnopqrstuvwxyz0123456789");
    expect(out).toContain("[email-redacted]");
    expect(out).toContain("[token-redacted]");
  });

  it("redactSensitive keeps short, non-sensitive identifiers", () => {
    expect(redactSensitive("relation does not exist")).toBe(
      "relation does not exist",
    );
    expect(redactSensitive("23505")).toBe("23505");
  });

  it("unexpected DB error is logged once with fixed event and code (no email leaked)", async () => {
    const errSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    try {
      const outcome = await submitEarlyAccessSupabase(
        mockDb(async () => ({
          error: {
            code: "42703",
            message: 'column "some_column" of relation "early_access_applications" does not exist',
            details: "affected row contained alice@example.com (redact me)",
            hint: null,
          },
        })),
        basePayload,
      );
      expect(outcome).toEqual({ status: "error" });

      expect(errSpy).toHaveBeenCalledTimes(1);
      const [event, payload] = errSpy.mock.calls[0] as [string, string];
      expect(event).toBe(EARLY_ACCESS_SUPABASE_ERROR_EVENT);
      const json = JSON.parse(payload);
      expect(json.kind).toBe("insert-error");
      expect(json.code).toBe("42703");
      expect(JSON.stringify(json)).not.toContain("alice@example.com");
    } finally {
      errSpy.mockRestore();
    }
  });

  it("duplicate (23505) does NOT emit an error log", async () => {
    const errSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    try {
      await submitEarlyAccessSupabase(
        mockDb(async () => ({
          error: { code: "23505", message: "duplicate key value" },
        })),
        basePayload,
      );
      expect(errSpy).not.toHaveBeenCalled();
    } finally {
      errSpy.mockRestore();
    }
  });

  it("thrown insert exception is logged with fixed event (no email leaked)", async () => {
    const errSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    try {
      const outcome = await submitEarlyAccessSupabase(
        mockDb(async () => {
          throw new Error(
            "connect ECONNREFUSED while inserting alice@example.com (internal)",
          );
        }),
        basePayload,
      );
      expect(outcome).toEqual({ status: "error" });

      expect(errSpy).toHaveBeenCalledTimes(1);
      const [event, payload] = errSpy.mock.calls[0] as [string, string];
      expect(event).toBe(EARLY_ACCESS_SUPABASE_ERROR_EVENT);
      expect(JSON.stringify(JSON.parse(payload))).not.toContain("alice@example.com");
    } finally {
      errSpy.mockRestore();
    }
  });

  it("logEarlyAccessSupabaseError never receives or emits PII keys", () => {
    const errSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    try {
      logEarlyAccessSupabaseError("client-init", {
        message: "fetch failed (supabase-project.supabase.co)",
      });
      const [, payload] = errSpy.mock.calls[0] as [string, string];
      const json = JSON.parse(payload);
      expect(Object.keys(json).sort()).toEqual(
        ["code", "details", "hint", "kind", "message"].sort(),
      );
      expect(json.kind).toBe("client-init");
    } finally {
      errSpy.mockRestore();
    }
  });
});
