"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useWallet } from "./WalletContext";
import { useContractInteraction } from "@/app/scripts/interact";
import { Input } from "@material-tailwind/react";

export const TableDataContext = createContext([]);

export const TableDataProvider = ({ children }) => {
  const { walletInfo } = useWallet();
  const { contractData, fetchOwner, requestPublicKey, getPublicKey, loading, error } =
    useContractInteraction();

  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    updateTableData();
  }, [walletInfo, contractData]);

  const updateTableData = async () => {
    try {
    //const owner = await fetchOwner();
      const publicKey = await getPublicKey(walletInfo.address);
      setTableData([
        {
          number: "#Owner",
          customer: walletInfo.address || "Not fetched",
          amount: walletInfo.balance || "0",
          issued: "N/A",
          date: "N/A",
        },
        {
          number: "#Recipient",
          customer: <Input placeholder="Recipient Address" className="before:content-none after:content-none"/>,
          amount: "N/A",
          issued: "N/A",
          date: "N/A",
        },
        {
          number: <button onClick={handleFetchOwner}>Fetch Owner</button>,
          customer: contractData || "Not fetched",
          amount: "N/A",
          issued: "N/A",
          date: "N/A",
        },
        {
          number: <button onClick={handleFetchOwner}>Request Public Key</button>,
          customer: contractData || "Not fetched",
          amount: "N/A",
          issued: "N/A",
          date: "N/A",
        },
      ]);
    } catch (err) {
      console.error("Error updating table data:", err);
    }
  };

  const handleRequestPublicKey = async () => {
    try {
      await requestPublicKey(walletInfo.address, "Request for Public Key");
    } catch (err) {
      console.error("Error requesting public key:", err);
    }
  };

  const handleFetchOwner = async () => {
    try{
      await fetchOwner();
      await updateTableData();
      console.log("Owner:", contractData);
    } catch (err) {
      console.error("Error fetching owner:", err);
    }
  };

  const contextValue = {
    tableData,
    loading,
    error,
    handleRequestPublicKey,
    updateTableData,
  };

  return (
    <TableDataContext.Provider value={contextValue}>
      {children}
    </TableDataContext.Provider>
  );
};

export const useTableData = () => useContext(TableDataContext);
