import { ethers } from "ethers";
import { useEffect, useState, useCallback } from "react";
import { Configuration } from "../config";
import { useChainId, useReadContracts } from 'wagmi';
import { getBlockExplorerUrl } from "./blockExplorers";
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
  const [blockExplorerUrl, setBlockExplorerUrl] = useState(null);
  const chainId = useChainId();

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

  const requestPublicKey = async (address, message) => {
    if (!contract) return;
    setLoading(true);
    setError(null);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const tx = await contract.requestPublicKey(address, message);

      // Get the explorer URL immediately after getting the transaction hash
      const explorerUrl = getBlockExplorerUrl(chainId, tx.hash);
      setLastTxHash(tx.hash);
      setBlockExplorerUrl(explorerUrl);

      await tx.wait();
      console.log("Public key requested successfully from " + address);
      console.log("Block explorer URL: " + explorerUrl);
      return {
        success: true,
        txHash: tx.hash,
        blockExplorerUrl: explorerUrl, // Return the URL directly instead of from state
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


  const getPublicKey = async (address) => {
    if (!contract) return;
    setLoading(true);
    setError(null);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const publicKeys = await contract.getPublicKeys(address);
      if (publicKeys.length === 0) {
        return "No public key found";
      }
      return publicKeys.at(-1);
    } catch (err) {
      setError("Error fetching public key: " + err.message);
    } finally {
      setLoading(false);
    }
  };

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

  const fetchContract = async () => {
    if (!contract) return;
    setLoading(true);
    setError(null);
    try {
      return contractAddress;
    } catch (err) {
      setError("Error fetching contract: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    contractData,
    loading,
    error,
    fetchOwner,
    requestPublicKey,
    getPublicKey,
    fetchContract,
    lastTxHash,
    blockExplorerUrl
  };
}