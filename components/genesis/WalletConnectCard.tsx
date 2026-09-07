"use client";

import { useCallback, useEffect, useState } from "react";
import { KeyRound, Plug, ShieldCheck, Unplug, Wallet } from "lucide-react";
import { useAccount, useConnect, useDisconnect, useSignMessage } from "wagmi";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

/** 简短展示地址：0x1234…abcd */
function shortAddress(address: string): string {
  if (address.length <= 10) return address;
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

interface VerifiedProfile {
  novaId: string;
  pointsBalance: number;
  isNew: boolean;
}

type SignState = "unsigned" | "signing" | "verifying" | "done" | "error";

/**
 * Nova Genesis — Connect + SIWE sign-in (Phase 1 connect + Phase 2-B2 verify).
 *
 * CRITICAL SEMANTIC BOUNDARY:
 *   Connected ≠ Authenticated. Authentication happens ONLY after the server
 *   verifies the wallet's signature over a server-issued EIP-4361 (SIWE)
 *   message (nonce bound to address/domain/chain, single-use, short TTL).
 *
 * Behavior:
 *   - Injected wallets via EIP-1193 / EIP-6963 discovery (no wallet hard-coded).
 *   - Handles: user reject, wallet/provider unavailable, disconnect, account
 *     changed & chain changed (stale identity is never shown after a switch).
 *   - Errors are surfaced generically — provider/internal details are never
 *     rendered or logged.
 *
 * No private key / seed phrase / password is ever requested or stored.
 * No session / cookie / Supabase Auth. No token / NOVA / allocation claims.
 */

export function WalletConnectCard() {
  const { connectors, connectAsync } = useConnect();
  const { address, isConnected, chainId } = useAccount();
  const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();

  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [signState, setSignState] = useState<SignState>("unsigned");
  const [profile, setProfile] = useState<VerifiedProfile | null>(null);

  const injected = connectors[0] ?? null;

  // Wallet switch / chain change / disconnect resets auth UI state so a
  // previous session's identity never lingers for a different wallet.
  useEffect(() => {
    setSignState("unsigned");
    setProfile(null);
    setError(null);
  }, [address, chainId]);

  const onConnect = useCallback(async () => {
    if (!injected || pending) return;
    setPending(true);
    setError(null);
    try {
      await connectAsync({ connector: injected });
    } catch {
      // User rejected the request, or no usable wallet/provider is present.
      // Non-fatal: keep the page stable and show a generic message.
      setError("Unable to connect wallet. Please try again.");
    } finally {
      setPending(false);
    }
  }, [injected, pending, connectAsync]);

  const onDisconnect = useCallback(() => {
    setError(null);
    setSignState("unsigned");
    setProfile(null);
    try {
      disconnect();
    } catch {
      // Disconnect is best-effort; the connected state is re-derived by wagmi.
    }
  }, [disconnect]);

  const onSign = useCallback(async () => {
    if (!address || !isConnected) return;
    const walletChainId = typeof chainId === "number" && chainId > 0 ? chainId : null;
    if (!walletChainId) {
      setError("Unable to verify wallet network. Please try again.");
      return;
    }
    setError(null);
    setSignState("signing");
    try {
      // 1) Server-issued nonce + server-built SIWE message
      const nonceRes = await fetch("/api/genesis/wallet/nonce", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address, chainId: walletChainId }),
      });
      const nonceJson = await nonceRes.json().catch(() => null);
      if (!nonceRes.ok || typeof nonceJson?.message !== "string") {
        setSignState("error");
        setError("Unable to start wallet verification. Please try again.");
        return;
      }
      // 2) Wallet signs the exact server message (off-chain only)
      setSignState("verifying");
      const signature = await signMessageAsync({ message: nonceJson.message });
      // 3) Server verifies signature, atomically consumes the nonce and
      //    creates/logs the Genesis profile (+20 only on first registration).
      const verifyRes = await fetch("/api/genesis/wallet/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: nonceJson.message, signature }),
      });
      const verifyJson = await verifyRes.json().catch(() => null);
      if (!verifyRes.ok || verifyJson?.success !== true) {
        setSignState("error");
        setError("Unable to verify wallet ownership. Please try again.");
        return;
      }
      setProfile({
        novaId: typeof verifyJson.novaId === "string" ? verifyJson.novaId : "",
        pointsBalance:
          typeof verifyJson.pointsBalance === "number"
            ? verifyJson.pointsBalance
            : 0,
        isNew: verifyJson.isNew === true,
      });
      setSignState("done");
    } catch {
      // User rejected the signature or a network error — never crash.
      setSignState("error");
      setError("Unable to verify wallet ownership. Please try again.");
    }
  }, [address, isConnected, chainId, signMessageAsync]);

  return (
    <div className="rounded-2xl border border-white/8 bg-ink-800/50 p-6 md:p-8">
      <div className="flex items-center gap-2">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-nova-cyanSoft">
          <Wallet className="h-4 w-4" />
        </span>
        <h3 className="font-display text-lg font-semibold text-mist-100">
          Connect Wallet
        </h3>
      </div>

      {isConnected && address ? (
        <div data-testid="wallet-connected" className="mt-5">
          <p className="flex items-center gap-2 text-sm font-medium text-mist-200">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400/80" />
            Wallet Connected
          </p>
          <p className="mt-2 break-all font-mono text-lg font-semibold text-nova-cyanSoft">
            {shortAddress(address)}
          </p>

          {/* 中性网络展示：仅表示“连接钱包所在的网络”，绝非 Nova 网络 */}
          <p className="mt-2 text-xs text-mist-500">
            Wallet Network · Chain {typeof chainId === "number" ? chainId : "—"}
          </p>

          {signState === "done" && profile ? (
            <div
              data-testid="wallet-authenticated"
              className="mt-4 rounded-xl border border-nova-cyan/25 bg-ink-950/50 p-5"
            >
              <p className="flex items-center gap-2 text-sm font-medium text-nova-cyanSoft">
                <ShieldCheck className="h-4 w-4" />
                {profile.isNew
                  ? "Genesis Profile created · +20 Genesis Points"
                  : "Welcome back"}
              </p>
              <dl className="mt-3 space-y-1 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-mist-500">Nova ID</dt>
                  <dd className="font-mono text-nova-cyanSoft">{profile.novaId}</dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-mist-500">Genesis Points</dt>
                  <dd className="font-mono text-mist-100">{profile.pointsBalance}</dd>
                </div>
              </dl>
              <p className="mt-3 text-xs leading-relaxed text-mist-500">
                Wallet ownership is verified by signature. Genesis Points are
                participation points only — they do not represent, guarantee, or
                promise any future token allocation.
              </p>
            </div>
          ) : (
            <div className="mt-4">
              <p className="text-sm leading-relaxed text-mist-400">
                Sign a message to prove you control this wallet and join the
                Genesis Program.
              </p>
              <Button
                type="button"
                className={cn("mt-4 w-full sm:w-auto")}
                onClick={onSign}
                disabled={signState === "signing" || signState === "verifying"}
              >
                <KeyRound className="h-4 w-4" />
                {signState === "signing"
                  ? "Signing…"
                  : signState === "verifying"
                    ? "Verifying…"
                    : "Sign & Join Genesis"}
              </Button>
            </div>
          )}

          {error ? (
            <p
              role="alert"
              data-testid="wallet-error"
              className="mt-4 text-sm text-rose-300"
            >
              {error}
            </p>
          ) : null}

          <Button
            type="button"
            variant="ghost"
            className="mt-4"
            onClick={onDisconnect}
          >
            <Unplug className="h-4 w-4" />
            Disconnect
          </Button>
        </div>
      ) : (
        <div className="mt-5">
          <p className="text-sm leading-relaxed text-mist-400">
            Connect an EVM wallet such as MetaMask, Trust Wallet, OKX, Coinbase
            Wallet, or Rabby to get started with a wallet-based Nova identity.
          </p>

          <Button
            type="button"
            className={cn("mt-5 w-full sm:w-auto")}
            onClick={onConnect}
            disabled={!injected || pending}
          >
            {pending ? (
              "Connecting…"
            ) : (
              <>
                <Plug className="h-4 w-4" />
                Connect Wallet
              </>
            )}
          </Button>

          {error ? (
            <p
              role="alert"
              data-testid="wallet-error"
              className="mt-4 text-sm text-rose-300"
            >
              {error}
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
}

