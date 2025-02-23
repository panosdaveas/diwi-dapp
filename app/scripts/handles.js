import { CustomContext } from "@/app/Context/context";
import { useContext } from "react";
import { encryptWithPublicKey } from "../utils/asymmetricEncryption";
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
    const encrypted = await encryptWithPublicKey(
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
    const encrypted = await encryptWithPublicKey(publicKey, message);
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

  const handleDecrypt = async () => {
    try {
      await handleTimeLockDecryption();
      await handleAsymmetricDecryption();
    } catch (error) {
      console.error("Error during decryption:", error);
    }
  };

  const handleAsymmetricDecryption = async () => {
    const message = await decryptWithPrivateKey(data.privateKey, data.displayMessage);
    setData((prevData) => ({
      ...prevData,
      displayMessage: message,
      ciphertext: message,
    }));
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
      } else {
        const decrypted = JSON.stringify(await response.json());
        const decryptedMessageString = JSON.parse(decrypted);
        setData((prevState) => ({
          ...prevState,
          message: decryptedMessageString.decrypted,
          displayMessage: decryptedMessageString.decrypted,
          tlEncrypted: "false",
        }));
      }
    } catch (error) {
      console.error("Error during decryption:", error);
      const errorLog = error;
      setData((prevState) => ({
        ...prevState,
        displayMessage: errorLog,
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
