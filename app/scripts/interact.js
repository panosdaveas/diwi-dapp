// import { ethers, utils } from "ethers";
const ethers = require("ethers");
import { useEffect, useState } from "react";
import { useChainId } from "wagmi";
import { Configuration } from "../config";
import { getBlockExplorerUrl, getContractExplorerUrl } from "./blockExplorers";
import { contractCurrentABI } from "./contractABI";

const contractABI = contractCurrentABI;
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

  // New function to verify a message against its hash
  const verifyMessage = async (message, storedHash) => {
    if (!contract) return false;
    try {
      const isValid = await contract.verifyMessage(message, storedHash);
      return isValid;
    } catch (err) {
      setError("Error verifying message: " + err.message);
      return false;
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

  const submitPublicKey = async (uniqueId, publicKey) => {
    if (!contract) return;
    setLoading(true);
    setError(null);
    try {
      const tx = await contract.submitPublicKey(uniqueId, publicKey);
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

  // store the transaction hash in the will
  const storeTxHash = async (uniqueId, txHash) => {
    if (!contract) return;
    setLoading(true);
    setError(null);
    try {
      const tx = await contract.storeTxHash(uniqueId, txHash);
      const explorerUrl = getBlockExplorerUrl(chainId, tx.hash);
      setLastTxHash(tx.hash);
      await tx.wait();
      return {
        success: true,
        txHash: tx.hash,
        blockExplorerUrl: explorerUrl,
      };
    } catch (err) {
      setError("Error storing transaction hash: " + err.message);
      return {
        success: false,
        error: err.message,
      };
    } finally {
      setLoading(false);
    }
  };

  const sendWillToRecipient = async (uniqueId, message) => {
  if (!contract) return;
  setLoading(true);
  setError(null);
  try {
    const tx = await contract.sendWillToRecipient(uniqueId, message);
    const explorerUrl = getBlockExplorerUrl(chainId, tx.hash);
    setLastTxHash(tx.hash);
    // alert(`Please wait to verify transaction and get receipt for event data`);
    
    // Wait for transaction and get receipt for event data
    const receipt = await tx.wait();
    
    // Find MessageSent event in the receipt
    const event = receipt.logs
      .map((log) => {
        try {
          return contract.interface.parseLog(log);
        } catch (e) {
          return null;
        }
      })
      .find((event) => event && event.name === "MessageSent");

    const messageHash = event ? event.args.messageHash : null;
    return {
      success: true,
      txHash: tx.hash,
      blockExplorerUrl: explorerUrl,
      messageHash: messageHash,
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

  // Get message by transaction hash  (new function)
  const getMessageByTxHash = async (txHash) => {
    if (!contract) return;
    setLoading(true);
    setError(null);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const tx = await provider.getTransaction(txHash);
      const inputData = tx.data;

      // Decode the input data to get the message
      const decodedData = contract.interface.decodeFunctionData("sendWillToRecipient", inputData);
      const message = decodedData.message;
      
      return {
        success: true,
        message: message,
      };
    } catch (err) {
      setError("Error getting message by transaction hash: " + err.message);
      return {
        success: false,
        error: err.message,
      };
    } finally {
      setLoading(false);
    }
  };

  const getMessageByUniqueId = async (uniqueId) => {
    if (!contract) return;
    setLoading(true);
    setError(null);
    try {
      const will = await contract.getWillByUniqueId(uniqueId);
      const result = await getMessageByTxHash(will.txHash);
      const message = result.message;
      const isValid = await verifyMessage(message, will.messageHash);
      if (!isValid) {
        throw new Error("Message verification failed");
      }
      return {
        success: true,
        message: message,
      };
    } catch (err) {
      setError("Error getting message by uniqueId: " + err.message);
      return {
        success: false,
        error: err.message,
      };
    } finally {
      setLoading(false);
    } 
  };

  // New function to get message by block number and verify it
  const getMessageByBlockNumber = async (uniqueId) => {
    if (!contract) return;
    setLoading(true);
    setError(null);
    try {
      // Get the will by uniqueId to retrieve the block number and message hash
      const will = await contract.getWillByUniqueId(uniqueId);
      const blockNumber = will.blockNumber;
      const messageHash = will.messageHash;
      const signer = will.signer;

      // Get the block with transactions
      const provider = new ethers.BrowserProvider(window.ethereum);
      const block = await provider.getBlock(blockNumber, true);

      // Get all transactions in the block
      const txPromises = block.transactions.map((txHash) =>
        provider.getTransaction(txHash)
      );
      const transactions = await Promise.all(txPromises);

      // Find all transactions from this signer to our contract
      const relevantTxs = transactions.filter(
        (tx) =>
          tx.from.toLowerCase() === signer.toLowerCase() &&
          tx.to.toLowerCase() === contractAddress.toLowerCase()
      );

      if (relevantTxs.length === 0) {
        throw new Error("No matching transactions found in block");
      }

      // Try to decode each transaction and verify the message
      for (const tx of relevantTxs) {
        try {
          // Check if this transaction is a sendWillToRecipient call
          const decodedFunction = contract.interface.parseTransaction({
            data: tx.data,
          });

          if (decodedFunction.name === "sendWillToRecipient") {
            const decodedData = decodedFunction.args;
            // Check if this is for our uniqueId
            if (decodedData[0] === uniqueId) {
              const message = decodedData[1]; // Get the message

              // Verify the message matches the stored hash
              const isValid = await verifyMessage(message, messageHash);
              if (isValid) {
                return {
                  success: true,
                  message: message,
                };
              }
            }
          }
        } catch (e) {
          // This transaction might not be a valid sendWillToRecipient call, continue to next one
          console.log(
            "Skipping transaction - not a matching sendWillToRecipient call:",
            e.message
          );
          continue;
        }
      }

      throw new Error("No transactions with valid message found");
    } catch (err) {
      setError("Error getting message by block number: " + err.message);
      return {
        success: false,
        error: err.message,
      };
    } finally {
      setLoading(false);
    }
  };

  // Modified to include message hash in return data
  const getWillsBySigner = async (signerAddress) => {
    if (!contract) return;
    setLoading(true);
    setError(null);
    try {
      const wills = await contract.getWillsBySigner(signerAddress);
      return wills.map((will) => ({
        uniqueId: will.uniqueId,
        blockNumber: will.blockNumber,
        signer: will.signer,
        recipient: will.recipient,
        publicKey: will.publicKey,
        fulfilled: will.requestFulfilled,
        messageHash: will.messageHash,
        txHash: will.txHash,
      }));
    } catch (err) {
      setError("Error getting wills by signer: " + err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Modified to include message hash in return data
  const getWillsByRecipient = async (recipientAddress) => {
    if (!contract) return;
    setLoading(true);
    setError(null);
    try {
      const wills = await contract.getWillsByRecipient(recipientAddress);
      return wills.map((will) => ({
        uniqueId: will.uniqueId,
        blockNumber: will.blockNumber,
        signer: will.signer,
        recipient: will.recipient,
        message: will.message,
        publicKey: will.publicKey,
        fulfilled: will.requestFulfilled,
        messageHash: will.messageHash,
        txHash: will.txHash,
      }));
    } catch (err) {
      setError("Error getting wills by recipient: " + err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const listenToEvents = async () => {
    if (!contract) return;

    contract.on("PublicKeyRequested", (from, to, message) => {
      console.log("Public Key Requested:", { from, to, message });
    });

    contract.on("PublicKeySubmitted", (from, to, publicKey) => {
      console.log("Public Key Submitted:", { from, to, publicKey });
    });

    // Updated MessageSent event listener
    contract.on(
      "MessageSent",
      (from, to, blockNumber, publicKey, message, messageHash) => {
        console.log("Message Sent:", {
          from,
          to,
          blockNumber: blockNumber.toString(),
          publicKey,
          message,
          messageHash,
        });
      }
    );

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
      const formattedWills = wills.map((will) => ({
        uniqueId: will.uniqueId,
        blockNumber: will.blockNumber.toString(), // Convert BigNumber to string
        signer: will.signer,
        recipient: will.recipient,
        publicKey: will.publicKey,
        message: will.message,
        messageHash: will.messageHash,
        txHash: will.txHash,
      }));

      // Create a result object with metadata
      const result = {
        timestamp: new Date().toISOString(),
        contractAddress: contractAddress,
        totalWills: formattedWills.length,
        wills: formattedWills,
      };

      // Create a JSON string with formatting
      const jsonData = JSON.stringify(result, null, 2);

      // Create a data URL
      const dataUrl = `data:application/json;charset=utf-8,${encodeURIComponent(
        jsonData
      )}`;

      // Open the data URL in a new tab
      window.open(dataUrl, "_blank");
      console.log("URL:", dataUrl);

      console.log("JSON data opened in a new tab.");

      // Return both the formatted data and the URL
      return dataUrl;
    } catch (err) {
      setError("Error getting all wills: " + err.message);
      return {
        data: [],
        jsonUrl: null,
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
    sendWillToRecipient,
    getAllWills,
    getWillsBySigner,
    getWillsByRecipient,
    listenToEvents,
    verifyMessage,
    getMessageByTxHash,
    getMessageByUniqueId,
    storeTxHash,
    getMessageByBlockNumber,
  };
}
