import { CustomContext } from "@/app/Context/context";
import { useContext } from "react";
import { EncryptWithPublicKey } from "../utils/asymmetricEncryption";
import { timeLockEncryption } from "../utils/timeLockEncrypt";
import { decryptWithPrivateKey } from "../utils/asymmetricEncryption";
import { useContractInteraction } from "@/app/scripts/interact";

export function handleScripts() {
  const { data, setData } = useContext(CustomContext);
  const {
    sendMessageToRecipient,
    sendWillToRecipient,
  } = useContractInteraction();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleClearInputSigner = () => {
    setData((prevData) => ({
      ...prevData,
      message: "",
      publicKey: "",
      plaintext: "",
      dateTime: new Date(),
      displayMessage: "",
    }));
  };

  const handleDateTimeChange = (dateTime) => {
    setData((prevData) => ({
      ...prevData,
      dateTime: dateTime,
    }));
  };

  const handleTimeLockEncrypt = async () => {
    try {
      const result = await timeLockEncryption(data.dateTime, data.message);
      setData((prevData) => ({
        ...prevData,
        message: result.ciphertext,
        client: result.client,
        decryptionTime: result.decryptionTime,
        displayMessageEncrypted: result.ciphertext,
        tlEncrypted: "true",
      }));
    } catch (error) {
      console.error("Error during encryption:", error);
    }
  };

  const handleAsymmetricEncryption = async () => {
    const encrypted = await EncryptWithPublicKey(
      data.publicKey,
      data.plaintext
    );
    setData((prevData) => ({
      ...prevData,
      message: encrypted,
      displayMessage: encrypted,
      displayMessageEncrypted: encrypted,
    }));
  };

  const handleSendMessage = async (message) => {
    const recipientAddress = data.addressRecipient;

    const result = await sendMessageToRecipient(recipientAddress, message);
    if (result.success) {
        console.log(result);
    } else {
      console.error("Failed to send message:", result.error);
    }
  };

  const handleEncrypt = async () => {
    const encrypted = await encryptWithPublicKey(
      data.publicKey,
      data.plaintext
    );
    try {
      const result = await timeLockEncryption(data.dateTime, encrypted);
      setData((prevData) => ({
        ...prevData,
        message: result.ciphertext,
        displayMessage: result.ciphertext,
        tlEncrypted: "true",
      }));
      const emitMessage = await sendMessageToRecipient(
        data.addressRecipient,
        result.ciphertext
      );
    } catch (error) {
      console.error("Error during encryption:", error);
    }
    
  };

  const handleEncryptWill = async (uniqueId, publicKey, message) => {
    const encrypted = await EncryptWithPublicKey(publicKey, message);
    try {
      const result = await timeLockEncryption(data.dateTime, encrypted);
      setData((prevData) => ({
        ...prevData,
        message: result.ciphertext,
        displayMessage: result.ciphertext,
        tlEncrypted: "true",
      }));
      const emitMessage = await sendWillToRecipient(uniqueId, result.ciphertext);
    } catch (error) {
      console.error("Error during encryption:", error);
    }
  };

  // const handleDecrypt = async () => {
  //   try {
  //     await handleTimeLockDecryption(); // Ensure this completes first
  
  //     // Use the updated state after decryption
  //     setData((prevData) => {
  //       handleAsymmetricDecryption(privateKey, prevData); // Pass updated data
  //       return prevData; // Return unchanged to avoid extra re-render
  //     });
  //   } catch (error) {
  //     console.error("Error during decryption:", error);
  //   }
  // };

  const handleDecrypt = async (event) => {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const privateKey = formData.get("privateKey");
    
    await handleTimeLockDecryption(); // Ensure this completes first

    try {
      setData((prevData) => {
        handleAsymmetricDecryption(privateKey, prevData); // Pass updated data
        return prevData; // Return unchanged to avoid extra re-render
      });
    } catch (error) {
      console.error("Decryption failed:", error);
    }
  };

  const handleAsymmetricDecryption = async (privateKey, updatedData) => {
    try {
      const message = await decryptWithPrivateKey(
        privateKey, 
        updatedData.message
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

  const handleTimeLockDecryption = async () => { 
    try {
      const response = await fetch("./api/decrypt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
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
            // displayMessage: decryptedMessageString.decrypted,
            tlEncrypted: "false",
          };
          resolve(newState);
          return newState;
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

  //handle poll for messages    
  const handlePollMessages = async() => {
    const pollResults= await pollForMessages();
    setData((prevState) => ({
      ...prevState,
      displayMessage: pollResults[pollResults.length - 1].message,
    }));
};

  //handle poll for public key requests
  const handleRequests = async() => {
    const requests= await getRecipientRequest();
};

const handleNewWill = async() => {
  
};

  return {
    handleAsymmetricDecryption,
    handleTimeLockDecryption,
    handleAsymmetricEncryption,
    handleTimeLockEncrypt,
    handleDateTimeChange,
    handleInputChange,
    handleEncrypt,
    handleDecrypt,
    handleClearInputSigner,
    handlePollMessages,
    handleRequests,
    handleEncryptWill,
    handleNewWill,
  };
}
