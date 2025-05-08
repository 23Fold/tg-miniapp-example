"use client";

import React, { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createAppKit } from "@reown/appkit/react";
import { sophonTestnet } from "@reown/appkit/networks";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { State, WagmiProvider } from "wagmi";

import "@sophon-labs/account-eip6963/testnet";

// Get projectId from <https://cloud.reown.com>
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

const queryClient = new QueryClient();

if (!projectId) throw new Error("Project ID is not defined");

const metadata = {
  //optional
  name: "AppKit",
  description: "AppKit Example",
  url: "https://tg-miniapp-example.vercel.app",
  icons: ["https://avatars.githubusercontent.com/u/179229932"],
};

const wagmiAdapter = new WagmiAdapter({
  networks: [sophonTestnet],
  projectId,
});

createAppKit({
  enableWalletConnect: false,
  enableEIP6963: true,
  adapters: [wagmiAdapter],
  networks: [sophonTestnet],
  metadata: metadata,
  projectId,
  features: {
    analytics: true,
    connectMethodsOrder: ["wallet", "social", "email"],
  },
  includeWalletIds: ["sophon-testnet"],
});

export default function Web3ModalProvider({
  children,
  initialState,
}: {
  children: ReactNode;
  initialState?: State;
}) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
