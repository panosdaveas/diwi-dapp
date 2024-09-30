"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [walletInfo, setWalletInfo] = useState({
    address: null,
    isConnected: false,
    chainId: null,
  });

  const updateWalletInfo = useCallback((info) => {
    setWalletInfo((prevInfo) => {
      if (JSON.stringify(prevInfo) !== JSON.stringify(info)) {
        return info;
      }
      return prevInfo;
    });
  }, []);

  return (
    <WalletContext.Provider value={{ walletInfo, updateWalletInfo }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
