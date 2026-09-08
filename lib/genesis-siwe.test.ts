import { describe, expect, it } from "vitest";
import { privateKeyToAccount } from "viem/accounts";
import {
  buildGenesisSiweMessage,
  parseGenesisSiweMessage,
  verifyGenesisSiwe,
  type SiweFailure,
} from "./genesis-siwe";

// Deterministic test key — never used outside tests.
const PK_A = ("0x" + "ab".repeat(32)) as `0x${string}`;
const PK_B = ("0x" + "cd".repeat(32)) as `0x${string}`;
const ACCOUNT_A = privateKeyToAccount(PK_A);
const ACCOUNT_B = privateKeyToAccount(PK_B);

const TRUSTED = { domain: "yazimao.xyz", uri: "https://yazimao.xyz" };
const NONCE = "c".repeat(64);

function baseFields(over: Partial<Record<string, unknown>> = {}) {
  const now = new Date();
  return {
    domain: "yazimao.xyz",
    uri: "https://yazimao.xyz",
    address: ACCOUNT_A.address,
    chainId: 1,
    nonce: NONCE,
    issuedAt: new Date(now.getTime() - 10_000),
    expirationTime: new Date(now.getTime() + 5 * 60_000),
    ...over,
  };
}

function sign(msg: string, account = ACCOUNT_A) {
  return account.signMessage({ message: msg });
}

/** Hand-built raw EIP-4361 text for controlled negative cases. */
function rawMessage(fields: {
  domain?: string;
  address?: string;
  statement?: string;
  uri?: string;
  version?: string;
  chainId?: number;
  nonce?: string;
  issuedAt?: string;
  expirationTime?: string;
}) {
  const f = {
    domain: "yazimao.xyz",
    address: ACCOUNT_A.address,
    statement: "YAZIMAO Genesis Program authentication.",
    uri: "https://yazimao.xyz",
    version: "1",
    chainId: 1,
    nonce: NONCE,
    issuedAt: new Date(Date.now() - 10_000).toISOString(),
    expirationTime: new Date(Date.now() + 5 * 60_000).toISOString(),
    ...fields,
  };
  return `${f.domain} wants you to sign in with your Ethereum account:\n${f.address}\n\n${f.statement}\n\nURI: ${f.uri}\nVersion: ${f.version}\nChain ID: ${f.chainId}\nNonce: ${f.nonce}\nIssued At: ${f.issuedAt}\nExpiration Time: ${f.expirationTime}`;
}

describe("buildGenesisSiweMessage", () => {
  it("produces a standard EIP-4361 message that round-trips through the parser", () => {
    const msg = buildGenesisSiweMessage({
      domain: TRUSTED.domain,
      uri: TRUSTED.uri,
      address: ACCOUNT_A.address,
      chainId: 1,
      nonce: NONCE,
      issuedAt: new Date(Date.now() - 10_000),
      expirationTime: new Date(Date.now() + 60_000),
    });
    expect(msg).toContain(`${TRUSTED.domain} wants you to sign in`);
    expect(msg).toContain(`Chain ID: 1`);
    const parsed = parseGenesisSiweMessage(msg);
    expect(parsed?.domain).toBe(TRUSTED.domain);
    expect(parsed?.uri).toBe(TRUSTED.uri);
    expect(parsed?.chainId).toBe(1);
    expect(parsed?.nonce).toBe(NONCE);
    expect(parsed?.version).toBe("1");
  });
});

describe("verifyGenesisSiwe — happy path", () => {
  it("accepts a valid message signed by the message address", async () => {
    const msg = buildGenesisSiweMessage(baseFields() as never);
    const signature = await sign(msg);
    const res = await verifyGenesisSiwe(msg, signature, TRUSTED);
    expect(res.ok).toBe(true);
    if (res.ok) expect(res.signer).toBe(ACCOUNT_A.address.toLowerCase());
  });
});

describe("verifyGenesisSiwe — failure modes", () => {
  async function expectFail(
    msg: string,
    signature: string,
    reasons: SiweFailure[],
  ) {
    const res = await verifyGenesisSiwe(msg, signature, TRUSTED);
    expect(res.ok).toBe(false);
    if (!res.ok) expect(reasons).toContain(res.reason);
  }

  it("rejects a tampered (invalid) signature", async () => {
    const msg = buildGenesisSiweMessage(baseFields() as never);
    const signature = await sign(msg);
    const tampered =
      signature.slice(0, -2) + (signature.endsWith("1b") ? "1c" : "1b");
    await expectFail(msg, tampered, ["signature", "signer"]);
  });

  it("rejects a wrong signer (different account signs the message)", async () => {
    const msg = buildGenesisSiweMessage(baseFields() as never);
    const signature = await sign(msg, ACCOUNT_B);
    await expectFail(msg, signature, ["signer"]);
  });

  it("rejects a wrong domain", async () => {
    const msg = buildGenesisSiweMessage(
      baseFields({ domain: "attacker.com" }) as never,
    );
    const signature = await sign(msg);
    await expectFail(msg, signature, ["domain"]);
  });

  it("rejects a wrong URI", async () => {
    const msg = buildGenesisSiweMessage(
      baseFields({ uri: "https://evil.example" }) as never,
    );
    const signature = await sign(msg);
    await expectFail(msg, signature, ["uri"]);
  });

  it("rejects a non-positive chain id", async () => {
    const msg = rawMessage({ chainId: 0 });
    const signature = await sign(msg);
    await expectFail(msg, signature, ["chain"]);
  });

  it("rejects a malformed nonce (not 64-char hex)", async () => {
    // 8-char alphanumeric passes SIWE's own serializer but is not our 256-bit
    // server-issued nonce shape.
    const msg = buildGenesisSiweMessage(
      baseFields({ nonce: "1234567890abcdef" }) as never,
    );
    const signature = await sign(msg);
    await expectFail(msg, signature, ["nonce"]);
  });

  it("rejects an expired expirationTime", async () => {
    const msg = buildGenesisSiweMessage(
      baseFields({
        issuedAt: new Date(Date.now() - 60_000),
        expirationTime: new Date(Date.now() - 10_000),
      }) as never,
    );
    const signature = await sign(msg);
    await expectFail(msg, signature, ["expired"]);
  });

  it("rejects an issuedAt in the future beyond clock skew", async () => {
    const msg = buildGenesisSiweMessage(
      baseFields({ issuedAt: new Date(Date.now() + 30 * 60_000) }) as never,
    );
    const signature = await sign(msg);
    await expectFail(msg, signature, ["issuedAt"]);
  });

  it("rejects a wrong SIWE version", async () => {
    const msg = rawMessage({ version: "2" });
    const signature = await sign(msg);
    await expectFail(msg, signature, ["version"]);
  });

  it("rejects malformed SIWE text", async () => {
    await expectFail("not a siwe message at all", "0x" + "11".repeat(65), [
      "malformed",
    ]);
  });

  it("rejects a signature that is not hex-shaped via a malformed flow", async () => {
    const msg = buildGenesisSiweMessage(baseFields() as never);
    await expectFail(msg, "not-a-signature", ["signature"]);
  });
});

describe("verifyGenesisSiwe — trust boundary", () => {
  it("never trusts a client-submitted address that did not sign", async () => {
    // Message claims ACCOUNT_A.address but is signed by ACCOUNT_B → signer
    // check fails even though the message address is valid.
    const msg = buildGenesisSiweMessage(baseFields() as never);
    const signature = await sign(msg, ACCOUNT_B);
    const res = await verifyGenesisSiwe(msg, signature, TRUSTED);
    expect(res.ok).toBe(false);
  });
});
