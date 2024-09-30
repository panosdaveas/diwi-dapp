"use client";

import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider, lightTheme, darkTheme, midnightTheme } from "@rainbow-me/rainbowkit";
import { config } from "../../wagmi";
import { WalletProvider } from "@/app/Context/WalletContext";
import { WalletInfoUpdater } from "@/app/utils/WalletInfoUpdater";

const queryClient = new QueryClient();

export function Providers({ children }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          modalSize="compact"
          theme={midnightTheme({
            accentColor: "black",
            accentColorForeground: "white",
            borderRadius: "medium",
            borderShadow: "none",
            fontStack: "system",
            overlayBlur: "small",
          })}
        >
          <WalletProvider>
            <WalletInfoUpdater />
            {children}
          </WalletProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
