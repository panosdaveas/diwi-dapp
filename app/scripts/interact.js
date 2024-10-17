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
  }

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

  const sendMessageToRecipient = async (recipientAddress, message) => {
    if (!contract) return;
    setLoading(true);
    setError(null);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const tx = await contract.sendMessageToRecipient(
        recipientAddress,
        message
      );
      const explorerUrl = getBlockExplorerUrl(chainId, tx.hash);
      setLastTxHash(tx.hash);
      console.log("Message sent:", message);
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

  const pollForMessages = async () => {
    if (!contract) return;
    setLoading(true);
    setError(null);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      // const toBlock = "latest";
      const toBlock = await provider.getBlockNumber(); // Latest block number
      const fromBlock = toBlock - 1000; // Get the starting block (1000 blocks ago)
      const filter = contract.filters.MessageSent(null, signer);
      const events = await contract.queryFilter(filter, fromBlock, toBlock);

      const messages = events.map((event) => ({
        from: event.args.from,
        message: event.args.message,
        blockNumber: event.blockNumber,
        transactionHash: event.transactionHash,
      }));
      console.log("Messages received:", messages);
      return messages;
    } catch (err) {
      setError("Error polling for messages: " + err.message);
      return [];
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
    sendMessageToRecipient,
    pollForMessages,
  };
}
