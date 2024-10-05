import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Configuration } from "../config";

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
          name: "user",
          type: "address",
        },
      ],
      name: "getPublicKey",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
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
      ],
      name: "publicKeys",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "recepient",
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
          name: "userB",
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
];

// get with your contract's address from config.js
const contractAddress = Configuration().contractAddress;

export function useContractInteraction() {
  const [contract, setContract] = useState(null);
  const [contractData, setContractData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const setupContract = async () => {
      try {
        // const provider = new ethers.JsonRpcProvider(Configuration().networkProvider);
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

  const fetchOwner = async () => {
    if (!contract) return;
    setLoading(true);
    setError(null);
    try {
      const data = await contract.owner();
      setContractData(data);
      console.log("Owner:", data);
      return data;
    } catch (err) {
      setError("Error fetching owner: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const requestPublicKey = async (address, message) => {
    if (!contract) return;
    setLoading(true);
    setError(null);
    try {
        const provider = new ethers.JsonRpcProvider("http://localhost:7545");
        const signer = await provider.getSigner();
      const tx = await contract.requestPublicKey(address, message);
      await tx.wait();
      console.log("Public key requested successfully");
      return true;
    } catch (err) {
      setError("Error requesting public key: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getPublicKey = async (address) => {
    if (!contract) return;
    setLoading(true);
    setError(null);
    try {
      const publicKey = await contract.getPublicKey(address);
      console.log("Public key:", publicKey);
      return publicKey;
    } catch (err) {
      setError("Error fetching public key: " + err.message);
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
  };
}