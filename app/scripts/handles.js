import { CustomContext } from "@/app/Context/context";
import { useContext } from "react";
import { encryptWithPublicKey } from "../utils/asymmetricEncryption";
import { timeLockEncryption } from "../utils/timeLockEncrypt";
import { decryptWithPrivateKey } from "../utils/asymmetricEncryption";

export function handleScripts() {
  const { data, setData } = useContext(CustomContext);

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
      console.log(result.ciphertext);
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
    console.log(encrypted);
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
    } catch (error) {
      console.error("Error during encryption:", error);
    }
  };

  const handleDecrypt = async () => {
      await handleTimeLockDecryption();
      handleAsymmetricDecryption();
  };

  const handleAsymmetricDecryption = async () => {
    const message = await decryptWithPrivateKey(data.privateKey, data.message);
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
          displayMessage: decrypted,
          tlEncrypted: "false",
        }));
      }
    } catch (error) {
      console.error("Error during decryption:", error);
      const errorLog = "Patience young padawan..." + error;
      setData((prevState) => ({
        ...prevState,
        displayMessage: errorLog,
      }));
    }
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
  };
}
