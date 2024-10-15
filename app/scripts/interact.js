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
  const [blockExplorerUrl, setBlockExplorerUrl] = useState(null);
  const chainId = useChainId();

  // Setup contract instance
  useEffect(() => {
    const setupContract = async () => {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        // if (!signer) return;
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



  async function logRecipientsAndPublicKeys(signerAddress) {
    // Connect to the Ethereum network (replace with your preferred provider)
     const result = {
       signer: signerAddress,
       recipients: [],
     };

    try {
      // Get recipients for the signer
      const recipients = await contract.getRecipients(signerAddress);
      // console.log("Recipients for signer", signerAddress, ":", recipients);

      // For each recipient, get their public keys
      for (const recipient of recipients) {
        const publicKeys = await contract.getPublicKeys(recipient);
        // console.log("Public keys for recipient", recipient, ":", publicKeys);

        result.recipients.push({
          address: recipient,
          publicKeys: publicKeys,
        });
      }

      // Create a JSON string with formatting
      const jsonData = JSON.stringify(result, null, 2);

      // Create a data URL
      const dataUrl = `data:application/json;charset=utf-8,${encodeURIComponent(
        jsonData
      )}`;

      // Open the data URL in a new tab
      window.open(dataUrl, "_blank");

      console.log("JSON data opened in a new tab.");

      // Also return the data URL in case you want to use it elsewhere
      return dataUrl;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
};

  //Function to request public key from a recipient
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
      await tx.wait();
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

  //Submit public key
  const submitPublicKey = async (address, publicKey) => {
    if (!contract) return;
    setLoading(true);
    setError(null);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const tx = await contract.submitPublicKey(address, publicKey);
      const explorerUrl = getBlockExplorerUrl(chainId, tx.hash);
      setLastTxHash(tx.hash);
      await tx.wait();
      console.log("Public key submitted successfully from " + address);
      return {
        success: true,
        txHash: tx.hash,
        blockExplorerUrl: explorerUrl, // Return the URL directly instead of from state
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

  //Function to get public key from a recipient-signer pair
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

  return {
    contractData,
    loading,
    error,
    fetchOwner,
    requestPublicKey,
    submitPublicKey,
    getPublicKey,
    fetchContract,
    logRecipientsAndPublicKeys,
    lastTxHash,
    blockExplorerUrl,
  };
}
