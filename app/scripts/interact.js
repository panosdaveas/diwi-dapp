import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useChainId } from "wagmi";
import { Configuration } from "../config";
import { getBlockExplorerUrl, getContractExplorerUrl } from "./blockExplorers";
import { contractCurrentABI } from "./contractABI";

// Contract ABI
const contractABI = contractCurrentABI;

// Get deployed contract address
const contractAddress = Configuration().contractAddress;

export function useContractInteraction() {
  const [contract, setContract] = useState(null);
  const [contractData, setContractData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastTxHash, setLastTxHash] = useState(null);
  const chainId = useChainId();

  // Setup contract instance
  useEffect(() => {
    const setupContract = async () => {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contractInstance = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        setContract(contractInstance);
      } catch (err) {
        setError("Failed to setup contract: " + err.message);
      }
    };
    setupContract();
  }, []);

  //Function to fetch the owner of the contract
  const fetchOwner = async () => {
    if (!contract) return;
    setLoading(true);
    setError(null);
    try {
      const data = await contract.owner();
      setContractData(data);
      return data;
    } catch (err) {
      setError("Error fetching owner: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  //Function to get the contract address
  const fetchContract = async () => {
    if (!contract) return;
    setLoading(true);
    setError(null);
    const explorerUrl = getContractExplorerUrl(chainId, contractAddress);
    try {
      return {
        success: true,
        contractAddress: contractAddress,
        blockExplorerUrl: explorerUrl,
      };
    } catch (err) {
      setError("Error fetching contract: " + err.message);
      return {
        success: false,
        error: err.message,
      };
    } finally {
      setLoading(false);
    }
  };

  const requestPublicKey = async (recipientAddress, message) => {
    if (!contract) return;
    setLoading(true);
    setError(null);
    try {
      const tx = await contract.requestPublicKey(recipientAddress, message);
      const explorerUrl = getBlockExplorerUrl(chainId, tx.hash);
      setLastTxHash(tx.hash);
      await tx.wait();
      return {
        success: true,
        txHash: tx.hash,
        blockExplorerUrl: explorerUrl,
      };
    } catch (err) {
      setError("Error requesting public key: " + err.message);
      return {
        success: false,
        error: err.message,
      };
    } finally {
      setLoading(false);
    }
  };

  const submitPublicKey = async (signerAddress, publicKey) => {
    if (!contract) return;
    setLoading(true);
    setError(null);
    try {
      const tx = await contract.submitPublicKey(signerAddress, publicKey);
      const explorerUrl = getBlockExplorerUrl(chainId, tx.hash);
      setLastTxHash(tx.hash);
      await tx.wait();
      return {
        success: true,
        txHash: tx.hash,
        blockExplorerUrl: explorerUrl,
      };
    } catch (err) {
      setError("Error submitting public key: " + err.message);
      return {
        success: false,
        error: err.message,
      };
    } finally {
      setLoading(false);
    }
  };

  const sendMessageToRecipient = async (recipientAddress, message) => {
    if (!contract) return;
    setLoading(true);
    setError(null);
    try {
      const tx = await contract.sendMessageToRecipient(recipientAddress, message);
      const explorerUrl = getBlockExplorerUrl(chainId, tx.hash);
      setLastTxHash(tx.hash);
      await tx.wait();
      return {
        success: true,
        txHash: tx.hash,
        blockExplorerUrl: explorerUrl,
      };
    } catch (err) {
      setError("Error sending message: " + err.message);
      return {
        success: false,
        error: err.message,
      };
    } finally {
      setLoading(false);
    }
  };

  const getSignerRequest = async (recipientAddress) => {
    if (!contract) return;
    setLoading(true);
    setError(null);
    try {
      const result = await contract.getSignerRequests(recipientAddress);
      return {
        exists: result[0],
        fulfilled: result[1],
        message: result[2],
        publicKey: result[3]
      };
    } catch (err) {
      setError("Error getting signer request: " + err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getRecipientRequest = async (signerAddress) => {
    if (!contract) return;
    setLoading(true);
    setError(null);
    try {
      const result = await contract.getRecipientRequest(signerAddress);
      return {
        exists: result[0],
        fulfilled: result[1],
        message: result[2],
        publicKey: result[3]
      };
    } catch (err) {
      setError("Error getting recipient request: " + err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getWillsBySigner = async (signerAddress) => {
    if (!contract) return;
    setLoading(true);
    setError(null);
    try {
      const wills = await contract.getWillsBySigner(signerAddress);
      return wills.map(will => ({
        blockNumber: will.blockNumber,
        signer: will.signer,
        recipient: will.recipient,
        publicKey: will.publicKey,
        message: will.message
      }));
    } catch (err) {
      setError("Error getting wills by signer: " + err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getWillsByRecipient = async (recipientAddress) => {
    if (!contract) return;
    setLoading(true);
    setError(null);
    try {
      const wills = await contract.getWillsByRecipient(recipientAddress);
      return wills.map(will => ({
        blockNumber: will.blockNumber,
        signer: will.signer,
        recipient: will.recipient,
        publicKey: will.publicKey,
        message: will.message
      }));
    } catch (err) {
      setError("Error getting wills by recipient: " + err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Event listeners for real-time updates
  const listenToEvents = async () => {
    if (!contract) return;
    
    contract.on("PublicKeyRequested", (from, to, message) => {
      console.log("Public Key Requested:", { from, to, message });
    });

    contract.on("PublicKeySubmitted", (from, to, publicKey) => {
      console.log("Public Key Submitted:", { from, to, publicKey });
    });

    contract.on("MessageSent", (from, to, will) => {
      console.log("Message Sent:", { from, to, will });
    });

    return () => {
      contract.removeAllListeners();
    };
  };

  const getAllWills = async () => {
    if (!contract) return;
    setLoading(true);
    setError(null);
    try {
      const wills = await contract.getAllWills();
      
      // Format the wills data
      const formattedWills = wills.map(will => ({
        blockNumber: will.blockNumber.toString(), // Convert BigNumber to string
        signer: will.signer,
        recipient: will.recipient,
        publicKey: will.publicKey,
        message: will.message
      }));

      // Create a result object with metadata
      const result = {
        timestamp: new Date().toISOString(),
        contractAddress: contractAddress,
        totalWills: formattedWills.length,
        wills: formattedWills
      };

      // Create a JSON string with formatting
      const jsonData = JSON.stringify(result, null, 2);

      // Create a data URL
      const dataUrl = `data:application/json;charset=utf-8,${encodeURIComponent(jsonData)}`;

      // Open the data URL in a new tab
      window.open(dataUrl, "_blank");

      console.log("JSON data opened in a new tab.");

      // Return both the formatted data and the URL
      return dataUrl;
    } catch (err) {
      setError("Error getting all wills: " + err.message);
      return {
        data: [],
        jsonUrl: null
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    lastTxHash,
    fetchOwner,
    fetchContract,
    requestPublicKey,
    submitPublicKey,
    sendMessageToRecipient,
    getSignerRequest,
    getRecipientRequest,
    getAllWills,
    getWillsBySigner,
    getWillsByRecipient,
    listenToEvents
  };
}