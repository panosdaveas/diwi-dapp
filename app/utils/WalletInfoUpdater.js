"use client";
import { useEffect, useMemo } from "react";
import { useAccount, useChainId } from "wagmi";
import { useWallet } from "@/app/Context/WalletContext";

export const WalletInfoUpdater = () => {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { updateWalletInfo } = useWallet();

  const walletInfo = useMemo(
    () => ({
      address,
      isConnected,
      chainId,
    }),
    [address, isConnected, chainId]
  );

  useEffect(() => {
    updateWalletInfo(walletInfo);
  }, [updateWalletInfo, walletInfo]);

  return null; // This component doesn't render anything
};
