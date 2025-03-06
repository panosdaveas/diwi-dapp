import EthCrypto from "eth-crypto";
import { CustomContext } from "@/app/Context/context";
import { useContext } from "react";
import { useContractInteraction } from "@/app/scripts/interact";
const { timelockEncrypt, roundAt } = require("tlock-js");
const { quicknetClient } = require("drand-client");

export function handleScripts() {
  const { data, setData } = useContext(CustomContext);
  const { sendWillToRecipient, getMessageByUniqueId } =
    useContractInteraction();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDateTimeChange = (dateTime) => {
    setData((prevData) => ({
      ...prevData,
      dateTime: dateTime,
    }));
  };

  // Strip the prefix "0x" from keys if present
  const stripHexPrefix = (key) => {
    return key.startsWith("0x") ? key.slice(2) : key;
  };

  // Encrypt with public key
  const encryptWithPublicKey = async (publicKey, message) => {
    try {
      const formattedPublicKey = stripHexPrefix(publicKey);
      const encrypted = await EthCrypto.encryptWithPublicKey(
        formattedPublicKey,
        message
      );
      return EthCrypto.cipher.stringify(encrypted);
    } catch (error) {
      console.error("Encryption error:", error);
      throw error;
    }
  };

  // Decrypt with private key
  const decryptWithPrivateKey = async (privateKey, encrypted) => {
    try {
      const formattedPrivateKey = stripHexPrefix(privateKey);
      const decrypted = await EthCrypto.decryptWithPrivateKey(
        formattedPrivateKey,
        encrypted
      );
      return decrypted;
    } catch (error) {
      console.error("Decryption error:", error);
      throw error;
    }
  };

  // Time-lock encryption
  const timeLockEncryption = async (dateTime, message) => {
    const decryptionTime = dateTime.getTime();
    let client;
    try {
      client = await quicknetClient();
      const chainInfo = await client.chain().info();
      const roundNumber = await roundAt(decryptionTime, chainInfo);
      const ciphertext = await timelockEncrypt(
        roundNumber,
        Buffer.from(message),
        client
      );
      return {
        decryptionTime,
        ciphertext,
        client,
      };
    } catch (error) {
      console.error("Time-lock encryption error:", error);
      throw error;
    }
  };

  // Time-lock decryption
  const timeLockDecryption = async (tlMessage) => {
    try {
      const response = await fetch("./api/decrypt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: tlMessage }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Decryption failed");
      }

      const result = await response.json();
      return result.decrypted;
    } catch (error) {
      console.error("Time-lock decryption error:", error);
      throw error;
    }
  };

  // Main encryption handler
  const handleEncryptWill = async (uniqueId, publicKey, message) => {
    try {
      // Step 1: Asymmetric encryption
      const asymEncrypted = await encryptWithPublicKey(publicKey, message);

      // Step 2: Time-lock encryption
      const result = await timeLockEncryption(data.dateTime, asymEncrypted);

      // Step 3: Send to blockchain
      await sendWillToRecipient(uniqueId, result.ciphertext);

      return true;
    } catch (error) {
      console.error("Error during encryption process:", error);
      return false;
    }
  };

  // Main decryption handler
  const handleDecrypt = async (event) => {
    event.preventDefault();

    try {
      // Get form data
      const formData = new FormData(event.target);
      const privateKey = formData.get("privateKey");
      const uniqueId = formData.get("selectedRow");

      // Step 1: Retrieve message from blockchain
      const result = await getMessageByUniqueId(uniqueId);
      if (!result.success) {
        throw new Error("Failed to retrieve message");
      }

      // Step 2: Time-lock decryption
      let tlDecrypted;
      try {
        tlDecrypted = await timeLockDecryption(result.message);
      } catch (tlError) {
        // Handle specific time lock errors
        const errorMessage = tlError.message
          .toLowerCase()
          .includes("not yet available")
          ? "This message is time-locked and not yet available for decryption."
          : `Time-lock decryption failed: ${tlError.message}`;

        // Update state with the error message
        setData((prevState) => ({
          ...prevState,
          displayMessage: errorMessage,
        }));

        // Stop execution here if time lock decryption fails
        return null;
      }

      // Only proceed to Step 3 if time lock decryption was successful
      // Step 3: Asymmetric decryption
      const finalDecrypted = await decryptWithPrivateKey(
        privateKey,
        tlDecrypted
      );

      // Update state with decrypted message
      setData((prevState) => ({
        ...prevState,
        displayMessage: finalDecrypted,
      }));

      return finalDecrypted;
    } catch (error) {
      console.error("Decryption process failed:", error);
      setData((prevState) => ({
        ...prevState,
        displayMessage: `Error: ${error.message}`,
      }));
      return null;
    }
  };

  return {
    handleInputChange,
    handleDateTimeChange,
    handleEncryptWill,
    handleDecrypt,
  };
}
