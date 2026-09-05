import { describe, expect, it, vi } from "vitest";
import {
  isValidEmail,
  MAX_EMAIL_LENGTH,
  submitEarlyAccess,
  toWirePayload,
  validateEarlyAccessInput,
} from "./early-access";

describe("isValidEmail", () => {
  it("accepts a normal email and lowercases-trims", () => {
    expect(isValidEmail(" User@Example.COM ")).toBe(true);
  });

  it("rejects empty / missing @ / missing domain / spaces", () => {
    expect(isValidEmail("")).toBe(false);
    expect(isValidEmail("plainaddress")).toBe(false);
    expect(isValidEmail("a@b")).toBe(false);
    expect(isValidEmail("a b@c.com")).toBe(false);
  });

  it("rejects overly long emails", () => {
    expect(isValidEmail(`${"a".repeat(MAX_EMAIL_LENGTH)}@b.co`)).toBe(false);
  });
});

describe("validateEarlyAccessInput", () => {
  it("accepts a minimal valid payload and normalizes email/types", () => {
    const res = validateEarlyAccessInput({
      email: "  User@Example.COM ",
      participationTypes: ["creator", "developer", "creator"],
    });
    expect(res.ok).toBe(true);
    if (res.ok) {
      expect(res.payload.email).toBe("user@example.com");
      expect(res.payload.participationTypes).toEqual(["creator", "developer"]);
      expect(res.payload.country).toBeUndefined();
    }
  });

  it("accepts an optional country", () => {
    const res = validateEarlyAccessInput({
      email: "a@b.co",
      participationTypes: ["community"],
      country: " Singapore ",
    });
    expect(res.ok).toBe(true);
    if (res.ok) expect(res.payload.country).toBe("Singapore");
  });

  it("rejects non-object bodies as invalid input", () => {
    for (const raw of [null, "x", 1, ["a"]]) {
      const res = validateEarlyAccessInput(raw);
      expect(res.ok).toBe(false);
    }
  });

  it("email: required then format", () => {
    expect(
      validateEarlyAccessInput({ participationTypes: ["creator"] }).ok,
    ).toBe(false);
    const missing = validateEarlyAccessInput({
      email: "",
      participationTypes: ["creator"],
    });
    expect(missing.ok).toBe(false);
    const bad = validateEarlyAccessInput({
      email: "not-an-email",
      participationTypes: ["creator"],
    });
    expect(bad.ok).toBe(false);
  });

  it("types: required, whitelist, cap", () => {
    expect(
      validateEarlyAccessInput({ email: "a@b.co", participationTypes: [] }).ok,
    ).toBe(false);
    expect(
      validateEarlyAccessInput({ email: "a@b.co" }).ok,
    ).toBe(false);
    expect(
      validateEarlyAccessInput({
        email: "a@b.co",
        participationTypes: ["miner"],
      }).ok,
    ).toBe(false);
    // 超出类型上限（用重复项撑大原始长度）
    expect(
      validateEarlyAccessInput({
        email: "a@b.co",
        participationTypes: [
          "creator",
          "node",
          "developer",
          "community",
          "creator",
        ],
      }).ok,
    ).toBe(false);
  });

  it("country: rejects invalid charset / too long", () => {
    expect(
      validateEarlyAccessInput({
        email: "a@b.co",
        participationTypes: ["creator"],
        country: "!!!",
      }).ok,
    ).toBe(false);
    expect(
      validateEarlyAccessInput({
        email: "a@b.co",
        participationTypes: ["creator"],
        country: "X".repeat(91),
      }).ok,
    ).toBe(false);
  });
});

describe("toWirePayload", () => {
  it("emits only minimal fields + created_at (no sensitive data)", () => {
    const wire = toWirePayload({
      email: "a@b.co",
      participationTypes: ["creator", "node"],
      country: "SG",
    });
    expect(Object.keys(wire).sort()).toEqual(
      ["created_at", "country", "email", "participationTypes"].sort(),
    );
    expect(wire.email).toBe("a@b.co");
    expect(wire.created_at).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it("omits country when not provided", () => {
    const wire = toWirePayload({
      email: "a@b.co",
      participationTypes: ["community"],
    });
    expect("country" in wire).toBe(false);
  });
});

describe("submitEarlyAccess", () => {
  const payload = {
    email: "a@b.co",
    participationTypes: ["creator" as const],
    country: "SG",
  };

  it("no endpoint configured → unavailable (honest, never fake registered)", async () => {
    const outcome = await submitEarlyAccess(payload, { endpoint: null });
    expect(outcome).toEqual({ status: "unavailable" });
  });

  it("forwards minimal payload and maps 2xx → registered", async () => {
    let captured: RequestInit | undefined;
    const fetchImpl = vi.fn(async (_input: RequestInfo | URL, init?: RequestInit) => {
      captured = init;
      return { ok: true, status: 200 };
    });
    const outcome = await submitEarlyAccess(payload, {
      endpoint: "https://reg.example.test/api/early-access",
      fetchImpl: fetchImpl as unknown as typeof fetch,
    });
    expect(outcome).toEqual({ status: "registered" });
    expect(fetchImpl).toHaveBeenCalledWith(
      "https://reg.example.test/api/early-access",
      expect.anything(),
    );
    const sent = JSON.parse((captured?.body ?? "") as string);
    expect(sent).not.toHaveProperty("password");
    expect(sent).not.toHaveProperty("wallet");
    expect(sent).toHaveProperty("created_at");
  });

  it("maps 409 → duplicate", async () => {
    const outcome = await submitEarlyAccess(payload, {
      endpoint: "x",
      fetchImpl: (async () => ({ ok: false, status: 409 })) as unknown as typeof fetch,
    });
    expect(outcome).toEqual({ status: "duplicate" });
  });

  it("maps non-ok (e.g. 500) → error", async () => {
    const outcome = await submitEarlyAccess(payload, {
      endpoint: "x",
      fetchImpl: (async () => ({ ok: false, status: 500 })) as unknown as typeof fetch,
    });
    expect(outcome).toEqual({ status: "error" });
  });

  it("catches network failure → error (never throws)", async () => {
    const outcome = await submitEarlyAccess(payload, {
      endpoint: "x",
      fetchImpl: (async () => {
        throw new Error("network down");
      }) as unknown as typeof fetch,
    });
    expect(outcome).toEqual({ status: "error" });
  });
});
