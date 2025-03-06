import EthCrypto from "eth-crypto"
import { CustomContext } from "@/app/Context/context";
import { useContext } from "react";
import { useContractInteraction } from "@/app/scripts/interact";
const { timelockEncrypt, roundAt } = require("tlock-js");
const { quicknetClient, testnetQuicknetClient } = require("drand-client");

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

  const handleEncryptWill = async (uniqueId, publicKey, message) => {
    const encrypted = await EncryptWithPublicKey(publicKey, message);
    try {
      const result = await timeLockEncryption(data.dateTime, encrypted);
      await sendWillToRecipient(
        uniqueId,
        result.ciphertext
      );
    } catch (error) {
      console.error("Error during encryption:", error);
    }
  };

  const handleDecrypt = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const privateKey = formData.get("privateKey");
    const row = formData.get("selectedRow");
    const result = await getMessageByUniqueId(row);
    const tlMessage = result.success
      ? result.message
      : "Failed to retrieve message";
      // if result.success, then continue
    const tlDecryptedMsg = await handleTimeLockDecryption(tlMessage); // Ensure this completes first
    // const message = tlDecryption.decryptedMessageString;
    console.log(tlDecryptedMsg);
    const decryptedMsg = await handleAsymmetricDecryption(privateKey, tlDecryptedMsg);
    console.log(decryptedMsg);
    setData((prevState) => ({
      ...prevState,
      displayMessage: decryptedMsg,
    }));
    // try {
    //   setData((prevData) => {
    //     handleAsymmetricDecryption(privateKey, message); // Pass updated data
    //     return prevData; // Return unchanged to avoid extra re-render
    //   });
    // } catch (error) {
    //   console.error("Decryption failed:", error);
    // }
  };

  const handleAsymmetricDecryption = async (privateKey, tlMessage) => {
    try {
      await decryptWithPrivateKey(privateKey, tlMessage);
      // Display the decrypted message without storing it in state
      // alert(`Decrypted Message: ${message}`);
    } catch (error) {
      console.error("Error in asymmetric decryption:", error);
    }
  };

  const handleTimeLockDecryption = async (tlMessage) => {
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

      const decryptedMessageString = await response.json();
      // console.log(decryptedMessageString);

      // Wait for state update before proceeding to next step
      await new Promise((resolve) => {
        setData((prevState) => {
          const newState = {
            ...prevState,
            // message: decryptedMessageString.decrypted,
            // displayMessage: decryptedMessageString.decrypted,
            // tlEncrypted: "false",
          };
          resolve(newState);
          return newState;
        });
      });
      return decryptedMessageString.decrypted;
    } catch (error) {
      console.error("Error during decryption:", error);
      setData((prevState) => ({
        ...prevState,
        displayMessage: error.toString(),
      }));
    }
  };

  const timeLockEncryption = async (dateTime, message) => {
    // const plaintext = message;
    const decryptionTime = dateTime.getTime();
    let client;
    try {
      client = await quicknetClient();
    } catch (error) {
      console.error("An error occurred:", error);
    }
    const chainInfo = await client.chain().info();
    const roundNumber = await roundAt(decryptionTime, chainInfo);

    const ciphertext = await timelockEncrypt(
      roundNumber,
      Buffer.from(message),
      client
    );
    return {
      // plaintext,
      decryptionTime,
      ciphertext,
      client,
    };
  };

  // Encrypt with public key
const EncryptWithPublicKey = async (publicKey, message) => {
    try {
      const formattedPublicKey = stripHexPrefix(publicKey);
      const encrypted = await EthCrypto.encryptWithPublicKey(
        formattedPublicKey, // hex string
        message // plain text
      );
      return EthCrypto.cipher.stringify(encrypted);
    } catch (error) {
      console.error("Encryption error:", error);
      throw error;
    }
  }

  // Decrypt with private key
const decryptWithPrivateKey = async (privateKey, encrypted) => {
    try {
      const formattedPrivateKey = stripHexPrefix(privateKey);
      const decrypted = await EthCrypto.decryptWithPrivateKey(
        formattedPrivateKey, // hex string
        encrypted // encrypted text
      );
      return decrypted;
    } catch (error) {
      console.error("Decryption error:", error);
      throw error;
    }
  }

  // Strip the prefix "0x" from the public key if present
  const stripHexPrefix = (publicKey) => {
    return publicKey.startsWith("0x") ? publicKey.slice(2) : publicKey;
  };

  return {
    handleDateTimeChange,
    handleInputChange,
    handleDecrypt,
    handleEncryptWill,
  };
}
