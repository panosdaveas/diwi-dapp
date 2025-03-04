import { CustomContext } from "@/app/Context/context";
import { useContext } from "react";
import { EncryptWithPublicKey } from "../utils/asymmetricEncryption";
import { timeLockEncryption } from "../utils/timeLockEncrypt";
import { decryptWithPrivateKey } from "../utils/asymmetricEncryption";
import { useContractInteraction } from "@/app/scripts/interact";

export function handleScripts() {
  const { data, setData } = useContext(CustomContext);
  const {
    sendWillToRecipient,
    getMessageByUniqueId,
  } = useContractInteraction();

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
      // setData((prevData) => ({
      //   ...prevData,
      //   message: result.ciphertext,
      //   displayMessage: result.ciphertext,
      //   tlEncrypted: "true",
      // }));
      const emitMessage = await sendWillToRecipient(
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
    await handleTimeLockDecryption(tlMessage); // Ensure this completes first

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
      const message = await decryptWithPrivateKey(
        privateKey, 
        tlMessage
      );
        // Display the decrypted message without storing it in state
        // alert(`Decrypted Message: ${message}`);
      setData((prevData) => ({
        ...prevData,
        displayMessage: message,
        // ciphertext: message,
      }));
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
      
      // Wait for state update before proceeding to next step
      await new Promise((resolve) => {
        setData((prevState) => {
          const newState = {
            ...prevState,
            message: decryptedMessageString.decrypted,
            displayMessage: decryptedMessageString.decrypted,
            tlEncrypted: "false",
          };
          resolve(newState);
          return newState, decryptedMessageString.decrypted;
        });
      });
  
    } catch (error) {
      console.error("Error during decryption:", error);
      setData((prevState) => ({
        ...prevState,
        displayMessage: error.toString(),
      }));
    }
  };

  return {
    handleDateTimeChange,
    handleInputChange,
    handleDecrypt,
    handleEncryptWill,
  };
}
