import { describe, expect, it } from "vitest";
import {
  describeSupabaseUrlStructure,
  ensureTrailingSlash,
  redactHost,
} from "./url-structure";

describe("redactHost", () => {
  it("redacts a supabase project host", () => {
    expect(redactHost("abc123.supabase.co")).toBe("<project>.supabase.co");
  });
  it("marks non-supabase hosts as custom", () => {
    expect(redactHost("custom.example.com")).toBe("<custom-host>");
  });
});

describe("ensureTrailingSlash", () => {
  it("adds / only when missing", () => {
    expect(ensureTrailingSlash("https://x.co")).toBe("https://x.co/");
    expect(ensureTrailingSlash("https://x.co/")).toBe("https://x.co/");
  });
});

describe("describeSupabaseUrlStructure", () => {
  it("undefined / empty / invalid → not configured, safe fields", () => {
    for (const v of [undefined, "", "   ", "not-a-url"]) {
      const s = describeSupabaseUrlStructure(v);
      expect(s.configured).toBe(false);
    }
  });

  it("clean bare project URL → path '/', no extraneous segments, generated /rest/v1", () => {
    const s = describeSupabaseUrlStructure("https://abc123.supabase.co");
    expect(s.configured).toBe(true);
    expect(s.scheme).toBe("https");
    expect(s.host_redacted).toBe("<project>.supabase.co");
    expect(s.url_path).toBe("/");
    expect(s.has_rest_v1).toBe(false);
    expect(s.has_auth_v1).toBe(false);
    expect(s.has_dashboard).toBe(false);
    expect(s.has_query).toBe(false);
    expect(s.has_hash).toBe(false);
    expect(s.trailing_slash).toBe(false);
    expect(s.generated_path).toBe("/rest/v1");
    expect(s.generated_table_path).toBe("/rest/v1/early_access_applications");
  });

  it("trailing slash variant is fine", () => {
    const s = describeSupabaseUrlStructure("https://abc123.supabase.co/");
    expect(s.url_path).toBe("/");
    expect(s.trailing_slash).toBe(true);
    expect(s.generated_path).toBe("/rest/v1");
  });

  it("URL containing /rest/v1 → duplicate rest path (PGRST125 signature)", () => {
    const s = describeSupabaseUrlStructure("https://abc123.supabase.co/rest/v1");
    expect(s.has_rest_v1).toBe(true);
    expect(s.url_path).toBe("/rest/v1/");
    // SDK: new URL("rest/v1", base "/rest/v1/") → /rest/v1/rest/v1
    expect(s.generated_path).toBe("/rest/v1/rest/v1");
    expect(s.generated_table_path).toBe("/rest/v1/rest/v1/early_access_applications");
  });

  it("dashboard / auth / storage paths are flagged", () => {
    const dash = describeSupabaseUrlStructure(
      "https://supabase.com/dashboard/project/abc123",
    );
    expect(dash.has_dashboard).toBe(true);

    const auth = describeSupabaseUrlStructure(
      "https://abc123.supabase.co/auth/v1",
    );
    expect(auth.has_auth_v1).toBe(true);

    const storage = describeSupabaseUrlStructure(
      "https://abc123.supabase.co/storage/v1",
    );
    expect(storage.has_storage_v1).toBe(true);
  });

  it("query / hash flags and repeated slashes", () => {
    const s = describeSupabaseUrlStructure("https://abc123.supabase.co/?x=1#h");
    expect(s.has_query).toBe(true);
    expect(s.has_hash).toBe(true);
    const dbl = describeSupabaseUrlStructure("https://abc123.supabase.co//x");
    expect(dbl.repeated_slashes).toBe(true);
  });

  it("never leaks full host / project-ref / query values in output", () => {
    const s = describeSupabaseUrlStructure(
      "https://super-secret-ref-42.supabase.co/path?token=abc123def456",
    );
    expect(JSON.stringify(s)).not.toContain("super-secret-ref-42");
    expect(JSON.stringify(s)).not.toContain("abc123def456");
  });
});
