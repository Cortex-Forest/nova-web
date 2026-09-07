import { createConfig, http } from "wagmi";
import { mainnet } from "viem/chains";
// injected is provided by @wagmi/core. Importing from 'wagmi/connectors'
// would pull the whole connector barrel (including the base/coinbase connector
// chain that currently fails to resolve in webpack), so we import the
// connector directly from @wagmi/core.
import { injected } from "@wagmi/core";

/**
 * Nova Genesis — Phase 1: EVM wallet connection layer (NOT an identity layer).
 *
 * Connected ≠ Authenticated. This config only enables reading the wallet's
 * public address/network from the client. No nonce, no signature, no SIWE,
 * no Nova Genesis identity, no +20 rewards — those arrive in later phases.
 *
 * Honesty / network notes:
 * - Nova does NOT yet run a live mainnet or public testnet, and Nova has no
 *   final chain id. Therefore NO "Nova chain" is defined here and no existing
 *   chain id is claimed as Nova's.
 * - `mainnet` below is used ONLY as a neutral transport anchor to satisfy
 *   wagmi's config requirement (a chain + transport pair). It is never
 *   advertised to the user as Nova, never auto-switched to, and never used to
 *   perform on-chain reads. The UI reports only what the connected wallet
 *   reports, under neutral wording ("Wallet Network").
 *
 * Wallet support:
 * - `injected()` is wallet-agnostic: it connects to whatever EIP-1193 /
 *   EIP-6963 provider the browser exposes (MetaMask, Trust Wallet, OKX,
 *   Coinbase Wallet, Rabby, and other compatible wallets — including in-app
 *   mobile browsers). No single wallet is hard-coded.
 * - `ssr: true` keeps wagmi SSR/hydration safe in Next.js App Router.
 */
export const walletConfig = createConfig({
  chains: [mainnet],
  connectors: [injected()],
  transports: {
    [mainnet.id]: http(),
  },
  ssr: true,
});

export type { Connector } from "wagmi";
