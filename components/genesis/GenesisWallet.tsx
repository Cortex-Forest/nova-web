"use client";

import { Web3Provider } from "@/components/providers/Web3Provider";
import { WalletConnectCard } from "@/components/genesis/WalletConnectCard";

/**
 * Nova Genesis — Phase 1: wallet connection island for /airdrop.
 *
 * Self-contained client island: mounts the Web3Provider only around the wallet
 * card so wagmi/viem/React Query are not loaded on unrelated pages (keeps the
 * rest of the site's first-load bundle untouched).
 */
export function GenesisWallet() {
  return (
    <Web3Provider>
      <WalletConnectCard />
    </Web3Provider>
  );
}
