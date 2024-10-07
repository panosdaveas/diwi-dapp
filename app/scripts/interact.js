import { ethers } from "ethers";
import { useEffect, useState, useCallback } from "react";
import { Configuration } from "../config";
import { useChainId } from 'wagmi';

const contractABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "message",
        type: "string",
      },
    ],
    name: "PublicKeyRequested",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "publicKey",
        type: "string",
      },
    ],
    name: "PublicKeySubmitted",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
    ],
    name: "getPublicKeys",
    outputs: [
      {
        internalType: "string[]",
        name: "",
        type: "string[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "signer",
        type: "address",
      },
    ],
    name: "getRecipients",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "publicKeys",
    outputs: [
      {
        internalType: "string",
        name: "publicKey",
        type: "string",
      },
      {
        internalType: "bool",
        name: "exists",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "string",
        name: "message",
        type: "string",
      },
    ],
    name: "requestPublicKey",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "signerRecipients",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "signer",
        type: "address",
      },
      {
        internalType: "string",
        name: "publicKey",
        type: "string",
      },
    ],
    name: "submitPublicKey",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
]; // Your existing ABI

const contractAddress = Configuration().contractAddress;

// Helper function to get block explorer URL based on chain ID
const getBlockExplorerUrl = (chainId, txHash) => {
  const explorers = {
    1: `https://etherscan.io/tx/${txHash}`, // Ethereum Mainnet
    137: `https://polygonscan.com/tx/${txHash}`, // Polygon
    10: `https://optimistic.etherscan.io/tx/${txHash}`, // Optimism
    42161: `https://arbiscan.io/tx/${txHash}`, // Arbitrum
    8453: `https://basescan.org/tx/${txHash}`, // Base
    1337: null, // Ganache (local) - no explorer
    43113: `https://testnet.snowtrace.io/tx/${txHash}`, // Avalanche Fuji Testnet
    11155111: `https://sepolia.etherscan.io/tx/${txHash}`, // Sepolia
  };
  
  return explorers[chainId] || null;
};

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

  // Helper function to update transaction details
  const updateTransactionDetails = useCallback((txHash) => {
    setLastTxHash(txHash);
    if (chainId) {
      const explorerUrl = getBlockExplorerUrl(chainId, txHash);
      setBlockExplorerUrl(explorerUrl);
    }
  }, [chainId]);

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
      console.log(publicKeys);
      if (publicKeys.length === 0) {
        return "No public key found";
      }
      return publicKeys[0];
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
      console.log("contractAddress", contractAddress);
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