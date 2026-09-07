"use client";

import { useState, type ReactNode } from "react";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { walletConfig } from "@/lib/wallet/config";

/**
 * Nova Genesis — Phase 1: Web3 Provider (client-only).
 *
 * Mounts wagmi + React Query providers above a wallet UI island. Kept fully
 * independent from Supabase / Genesis server logic — it only enables reading
 * the client-side wallet connection state.
 *
 * Connection is NOT authentication: a connected address is never treated as a
 * verified Nova identity here.
 */
export function Web3Provider({ children }: { children: ReactNode }) {
  // One QueryClient per mount (React Query best practice; avoids cross-request
  // cache sharing in the App Router).
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={walletConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
